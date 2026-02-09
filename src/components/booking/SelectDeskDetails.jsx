'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchDeskAvailability } from '../../api/bookings';

const DURATION_OPTIONS = [
  { label: '1 month', months: 1 },
  { label: '3 months', months: 3 },
  { label: '6 months', months: 6 },
  { label: '12 months', months: 12 },
];

const DESK_COUNT = 16;

const getMonthEnd = (startDate, months) => {
  const d = new Date(startDate + 'T00:00:00');
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getMonthStart = (yearMonth) => `${yearMonth}-01`;

const SelectDeskDetails = ({ room, onContinue }) => {
  const setSchedule = useBookingFlow((state) => state.setSchedule);

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [duration, setDuration] = useState(1);
  const [selectedDesk, setSelectedDesk] = useState(null);

  const startDate = getMonthStart(selectedMonth);
  const endDate = getMonthEnd(startDate, duration);

  const { data: bloqueos, isLoading, isError, error } = useQuery({
    queryKey: ['desk-availability', startDate, endDate],
    queryFn: () => fetchDeskAvailability(startDate, endDate),
    enabled: Boolean(selectedMonth),
  });

  // Determine which desks are booked during the selected period
  const bookedDesks = useMemo(() => {
    const booked = new Set();
    if (!Array.isArray(bloqueos)) return booked;

    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    bloqueos.forEach((b) => {
      const productName = (b.producto?.nombre || b.productName || '').toUpperCase();
      const match = productName.match(/^MA1O1[-_ ]?(\d{1,2})$/);
      if (!match) return;

      const bStart = new Date(b.fecha || b.date);
      const bEnd = b.fechaFin || b.dateTo ? new Date(b.fechaFin || b.dateTo) : bStart;

      // Check overlap
      if (bStart <= rangeEnd && bEnd >= rangeStart) {
        booked.add(parseInt(match[1], 10));
      }
    });

    return booked;
  }, [bloqueos, startDate, endDate]);

  // Reset desk selection when month/duration changes
  useEffect(() => {
    setSelectedDesk(null);
  }, [selectedMonth, duration]);

  const handleContinue = () => {
    if (!selectedDesk || !selectedMonth) return;
    setSchedule({
      date: startDate,
      dateTo: endDate,
      startTime: '00:00',
      endTime: '23:59',
      attendees: 1,
      deskProductName: `MA1O1-${selectedDesk}`,
      durationMonths: duration,
    });
    onContinue?.();
  };

  const isContinueDisabled = !selectedDesk || !selectedMonth;

  return (
    <Stack spacing={3}>
      {/* Room summary */}
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}
      >
        {room?.heroImage && (
          <Box
            component="img"
            src={room.heroImage}
            alt={room.name}
            sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {room?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {room?.centro}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${room?.capacity ?? '—'} desks · from €${room?.priceFrom ?? '—'}${room?.priceUnit ?? '/month'}`}
          </Typography>
        </Stack>
      </Paper>

      {/* Month & duration selection */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Select your period
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Choose a start month and how long you need the desk.
            </Typography>
          </Stack>

          <TextField
            size="small"
            label="Start month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: defaultMonth }}
            fullWidth
          />

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Duration
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {DURATION_OPTIONS.map((opt) => (
                <Button
                  key={opt.months}
                  variant={duration === opt.months ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setDuration(opt.months)}
                  sx={{
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Desk grid */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Choose your desk
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Select an available desk for your period. Desks in red are already booked.
            </Typography>
          </Stack>

          {/* Legend */}
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'success.light' }} />
              <Typography variant="caption">Available</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'error.light' }} />
              <Typography variant="caption">Booked</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'primary.main' }} />
              <Typography variant="caption">Selected</Typography>
            </Stack>
          </Stack>

          {isError && (
            <Alert severity="error">{error?.message || 'Unable to fetch desk availability.'}</Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1.5,
              }}
            >
              {Array.from({ length: DESK_COUNT }, (_, i) => i + 1).map((deskNum) => {
                const isBooked = bookedDesks.has(deskNum);
                const isSelected = selectedDesk === deskNum;

                return (
                  <Button
                    key={deskNum}
                    variant={isSelected ? 'contained' : 'outlined'}
                    disabled={isBooked}
                    onClick={() => setSelectedDesk(deskNum)}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      minWidth: 0,
                      ...(isBooked && {
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                        borderColor: 'error.light',
                        color: 'error.main',
                        '&.Mui-disabled': {
                          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                          borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
                          color: (theme) => alpha(theme.palette.error.main, 0.5),
                        },
                      }),
                      ...(!isBooked && !isSelected && {
                        borderColor: 'success.light',
                        color: 'success.dark',
                        '&:hover': {
                          borderColor: 'success.main',
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                        },
                      }),
                    }}
                  >
                    <Stack alignItems="center" spacing={0.25}>
                      <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1 }}>
                        Desk
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {deskNum}
                      </Typography>
                    </Stack>
                  </Button>
                );
              })}
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Price summary */}
      {selectedDesk && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Desk {selectedDesk} &middot; {duration} {duration === 1 ? 'month' : 'months'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {new Date(startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                {' '}&ndash;{' '}
                {new Date(endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {`€${((room?.priceFrom ?? 90) * duration).toFixed(2)}`}
            </Typography>
          </Stack>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={isContinueDisabled}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Continue
        </Button>
      </Box>
    </Stack>
  );
};

export default SelectDeskDetails;
