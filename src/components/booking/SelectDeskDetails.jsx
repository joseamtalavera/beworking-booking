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

const BOOKING_TYPES = [
  { label: 'Day', value: 'day' },
  { label: 'Month', value: 'month' },
];

const DESK_COUNT = 16;

const GRID_DESKS = [
  [10, 1, 1], [12, 2, 1], [14, 3, 1], [16, 4, 1],
  [9, 1, 2],  [11, 2, 2], [13, 3, 2], [15, 4, 2],
  [8, 1, 3],                           [4, 4, 3],
  [7, 1, 4],                           [3, 4, 4],
  [6, 1, 5],                           [2, 4, 5],
  [5, 1, 6],                           [1, 4, 6],
];

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
  const defaultDate = today.toISOString().split('T')[0];

  const [bookingType, setBookingType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [duration, setDuration] = useState(1);
  const [selectedDesk, setSelectedDesk] = useState(null);

  // Compute the date range for the availability query
  const startDate = bookingType === 'day' ? selectedDate : getMonthStart(selectedMonth);
  const endDate = bookingType === 'day' ? selectedDate : getMonthEnd(startDate, duration);

  const { data: bloqueos, isLoading, isError, error } = useQuery({
    queryKey: ['desk-availability', startDate, endDate],
    queryFn: () => fetchDeskAvailability(startDate, endDate),
    enabled: bookingType === 'day' ? Boolean(selectedDate) : Boolean(selectedMonth),
  });

  // Determine which desks are booked during the selected period
  const bookedDesks = useMemo(() => {
    const booked = new Set();
    if (!Array.isArray(bloqueos)) return booked;

    const rangeStart = new Date(startDate + 'T00:00:00');
    const rangeEnd = new Date(endDate + 'T23:59:59');

    bloqueos.forEach((b) => {
      const productName = (b.producto?.nombre || b.productName || '').toUpperCase();
      const match = productName.match(/^MA1O1[-_ ]?(\d{1,2})$/);
      if (!match) return;

      const bStart = new Date(b.fechaIni || b.fecha || b.date);
      const bEnd = b.fechaFin || b.dateTo
        ? new Date(b.fechaFin || b.dateTo)
        : bStart;

      // Check overlap
      if (bStart <= rangeEnd && bEnd >= rangeStart) {
        booked.add(parseInt(match[1], 10));
      }
    });

    return booked;
  }, [bloqueos, startDate, endDate]);

  const availableDesks = useMemo(() => {
    const desks = [];
    for (let i = 1; i <= DESK_COUNT; i++) {
      if (!bookedDesks.has(i)) {
        desks.push(i);
      }
    }
    return desks;
  }, [bookedDesks]);

  // Reset desk selection when period changes
  useEffect(() => {
    setSelectedDesk(null);
  }, [selectedMonth, selectedDate, duration, bookingType]);

  const handleContinue = () => {
    if (!selectedDesk) return;
    if (bookingType === 'day') {
      setSchedule({
        date: selectedDate,
        dateTo: selectedDate,
        startTime: '00:00',
        endTime: '23:59',
        attendees: 1,
        deskProductName: `MA1O1-${selectedDesk}`,
        bookingType: 'day',
        durationMonths: 0,
      });
    } else {
      setSchedule({
        date: startDate,
        dateTo: endDate,
        startTime: '00:00',
        endTime: '23:59',
        attendees: 1,
        deskProductName: `MA1O1-${selectedDesk}`,
        bookingType: 'month',
        durationMonths: duration,
      });
    }
    onContinue?.();
  };

  const isContinueDisabled = !selectedDesk;

  const VAT_RATE = 0.21;
  const pricePerDay = 10;
  const pricePerMonth = 90;
  const isSubscription = bookingType === 'month' && duration > 1;
  const subtotal = bookingType === 'day'
    ? pricePerDay
    : isSubscription ? pricePerMonth : pricePerMonth * duration;
  const vatAmount = subtotal * VAT_RATE;
  const totalPrice = subtotal + vatAmount;

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

      {/* Period selection */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Select your period
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Choose a booking type and when you need the desk.
            </Typography>
          </Stack>

          {/* Booking type toggle */}
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Booking type
            </Typography>
            <Stack direction="row" spacing={1}>
              {BOOKING_TYPES.map((opt) => (
                <Button
                  key={opt.value}
                  variant={bookingType === opt.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setBookingType(opt.value)}
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

          {bookingType === 'day' ? (
            <Paper
              elevation={0}
              sx={{
                border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper',
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                borderRadius: 999,
              }}
            >
              <Box sx={{ flex: 1, px: 3, py: 2, minWidth: 0 }}>
                <TextField
                  variant="standard"
                  type="date"
                  label="SELECT DATE"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultDate } }}
                  sx={{
                    '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                    '& .MuiInput-input': { fontSize: '0.875rem', color: selectedDate ? 'text.primary' : 'text.secondary', py: 0.25 },
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper',
                  display: 'flex', alignItems: 'center', overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                  borderRadius: 999,
                }}
              >
                <Box sx={{ flex: 1, px: 3, py: 2, minWidth: 0 }}>
                  <TextField
                    variant="standard"
                    type="month"
                    label="START MONTH"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultMonth } }}
                    sx={{
                      '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                      '& .MuiInput-input': { fontSize: '0.875rem', color: selectedMonth ? 'text.primary' : 'text.secondary', py: 0.25 },
                    }}
                  />
                </Box>
              </Paper>

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
            </>
          )}
        </Stack>
      </Paper>

      {/* Desk grid — only available desks */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Choose your desk
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {availableDesks.length > 0
                ? `${availableDesks.length} of ${DESK_COUNT} desks available for this period.`
                : 'No desks available for this period. Try a different date.'}
            </Typography>
          </Stack>

          {/* Legend */}
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'success.light' }} />
              <Typography variant="caption">Available</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'primary.main' }} />
              <Typography variant="caption">Selected</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: 'action.disabled' }} />
              <Typography variant="caption">Booked</Typography>
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
                gridTemplateRows: 'repeat(6, auto)',
                gap: 1.5,
              }}
            >
              {GRID_DESKS.map(([deskNum, col, row]) => {
                const isBooked = bookedDesks.has(deskNum);
                const isSelected = selectedDesk === deskNum;

                return (
                  <Box key={deskNum} sx={{ gridColumn: col, gridRow: row }}>
                    <Button
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => !isBooked && setSelectedDesk(deskNum)}
                      disabled={isBooked}
                      fullWidth
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        minWidth: 0,
                        ...(!isSelected && !isBooked && {
                          borderColor: 'success.light',
                          color: 'success.dark',
                          '&:hover': {
                            borderColor: 'success.main',
                            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                          },
                        }),
                        ...(isBooked && {
                          borderColor: 'action.disabled',
                          color: 'text.disabled',
                          bgcolor: (theme) => alpha(theme.palette.action.disabled, 0.08),
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
                  </Box>
                );
              })}
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Price summary */}
      {selectedDesk && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Desk {selectedDesk} &middot;{' '}
                  {bookingType === 'day'
                    ? '1 day'
                    : `${duration} ${duration === 1 ? 'month' : 'months'}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {bookingType === 'day'
                    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : `${new Date(startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} – ${new Date(endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isSubscription
                  ? `€${subtotal.toFixed(2)}/month`
                  : `€${subtotal.toFixed(2)}`}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isSubscription ? 'VAT (21%) /month' : 'VAT (21%)'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {`€${vatAmount.toFixed(2)}`}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center"
              sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {isSubscription ? 'Monthly total' : 'Total'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {isSubscription
                  ? `€${totalPrice.toFixed(2)}/month`
                  : `€${totalPrice.toFixed(2)}`}
              </Typography>
            </Stack>
            {isSubscription && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                First month charged now, then monthly for {duration} months total
              </Typography>
            )}
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
