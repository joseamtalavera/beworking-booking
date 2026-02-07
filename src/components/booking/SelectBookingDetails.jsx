'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchPublicAvailability } from '../../api/bookings';
import RoomCalendarGrid, { CalendarLegend } from './RoomCalendarGrid';
import { addMinutesToTime } from '../../utils/calendarUtils';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import InputAdornment from '@mui/material/InputAdornment';

const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };

const SelectBookingDetails = ({ room, onContinue }) => {
  const schedule = useBookingFlow((state) => state.schedule);
  const setSchedule = useBookingFlow((state) => state.setSchedule);

  const [note, setNote] = useState('');

  useEffect(() => {
    if (!schedule.startTime) {
      setSchedule({ startTime: DEFAULT_TIME_RANGE.start });
    }
    if (!schedule.endTime) {
      setSchedule({ endTime: DEFAULT_TIME_RANGE.end });
    }
    if (!schedule.date) {
      const today = new Date().toISOString().split('T')[0];
      setSchedule({ date: today, dateTo: today });
    } else if (!schedule.dateTo) {
      setSchedule({ dateTo: schedule.date });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['public-availability', schedule.date, room?.productName],
    queryFn: () =>
      fetchPublicAvailability({
        date: schedule.date,
        products: room?.productName ? [room.productName] : undefined
      }),
    enabled: Boolean(schedule.date)
  });

  const bloqueos = Array.isArray(data) ? data : [];

  const roomBloqueos = useMemo(() => {
    if (!room?.productName) return bloqueos;
    return bloqueos.filter(
      (item) => (item?.producto?.nombre || '').toLowerCase() === room.productName.toLowerCase()
    );
  }, [bloqueos, room?.productName]);

  const selectedSlotKey = useMemo(() => {
    if (schedule.startTime) {
      return `${room?.id || 'room'}-${schedule.startTime}`;
    }
    return '';
  }, [room?.id, schedule.startTime]);

  const handleSlotSelect = (slot, bloqueo) => {
    if (!schedule.date || bloqueo) return;
    const nextEnd = addMinutesToTime(slot.id, 60);
    setSchedule({ startTime: slot.id, endTime: nextEnd });
  };

  const handleDateChange = (event) => {
    const value = event.target.value;
    setSchedule({ date: value, dateTo: value });
  };

  const handleTimeChange = (field) => (event) => {
    setSchedule({ [field]: event.target.value });
  };

  const handleAttendeesChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setSchedule({ attendees: Number.isNaN(value) || value < 1 ? 1 : value });
  };

  const isContinueDisabled = !schedule.date || !schedule.startTime || !schedule.endTime;

  return (
    <Stack spacing={3}>
      {/* Room summary card */}
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
            {`Capacity ${room?.capacity ?? '—'} · from ${room?.priceFrom ?? room?.price ?? '—'} ${room?.priceUnit ?? room?.currency ?? 'EUR'}/h`}
          </Typography>
        </Stack>
      </Paper>

      {/* Date & time selection */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Pick your date & time
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Select a date and click an available slot, or set the time manually.
            </Typography>
          </Stack>

          <TextField
            size="small"
            label="Date"
            type="date"
            value={schedule.date || ''}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small"
              label="Start time"
              type="time"
              value={schedule.startTime || DEFAULT_TIME_RANGE.start}
              onChange={handleTimeChange('startTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              size="small"
              label="End time"
              type="time"
              value={schedule.endTime || DEFAULT_TIME_RANGE.end}
              onChange={handleTimeChange('endTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          <Divider />

          {isError ? (
            <Alert severity="error">{error?.message || 'Unable to fetch availability.'}</Alert>
          ) : null}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Stack spacing={1.5}>
              <CalendarLegend />
              <RoomCalendarGrid
                room={room}
                dateLabel={
                  schedule.date
                    ? new Date(schedule.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : ''
                }
                bloqueos={roomBloqueos}
                selectedSlotKey={selectedSlotKey}
                onSelectSlot={handleSlotSelect}
              />
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Additional info */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Additional details
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small"
              label="Number of attendees"
              type="number"
              value={schedule.attendees || ''}
              onChange={handleAttendeesChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleAltRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 1, max: room?.capacity || 99 }
              }}
              fullWidth
            />
          </Stack>
          <TextField
            size="small"
            label="Notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder="Any special requirements or requests..."
          />
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => {
            setSchedule({ note });
            onContinue?.();
          }}
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

export default SelectBookingDetails;
