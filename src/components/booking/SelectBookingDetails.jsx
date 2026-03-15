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
import { useTranslation } from 'react-i18next';

const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };

const SelectBookingDetails = ({ room, onContinue }) => {
  const { t } = useTranslation();
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
            {t('booking.capacityFrom', { capacity: room?.capacity ?? '—', price: room?.priceFrom ?? room?.price ?? '—', unit: room?.priceUnit ?? room?.currency ?? 'EUR' })}
          </Typography>
        </Stack>
      </Paper>

      {/* Date & time selection */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t('booking.pickDateTime')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('booking.pickDateTimeDesc')}
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
              flexDirection: { xs: 'column', sm: 'row' },
              borderRadius: { xs: 3, sm: 999 },
            }}
          >
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="date"
                label={t('booking.date')}
                value={schedule.date || ''}
                onChange={handleDateChange}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: schedule.date ? 'text.primary' : 'text.secondary', py: 0.25 },
                }}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="time"
                label={t('booking.startTime')}
                value={schedule.startTime || DEFAULT_TIME_RANGE.start}
                onChange={handleTimeChange('startTime')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: schedule.startTime ? 'text.primary' : 'text.secondary', py: 0.25 },
                }}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="time"
                label={t('booking.endTime')}
                value={schedule.endTime || DEFAULT_TIME_RANGE.end}
                onChange={handleTimeChange('endTime')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: schedule.endTime ? 'text.primary' : 'text.secondary', py: 0.25 },
                }}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="number"
                label={t('booking.numberOfAttendees')}
                value={schedule.attendees || ''}
                onChange={handleAttendeesChange}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: schedule.attendees ? 'text.primary' : 'text.secondary', py: 0.25 },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
                  '& input[type=number]': { MozAppearance: 'textfield' },
                }}
              />
            </Box>
          </Paper>

          <Divider />

          {isError ? (
            <Alert severity="error">{error?.message || t('booking.fetchError')}</Alert>
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
            {t('booking.additionalDetails')}
          </Typography>
          <TextField
            size="small"
            label={t('booking.notesOptional')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder={t('booking.notesPlaceholder')}
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
          {t('common.continue')}
        </Button>
      </Box>
    </Stack>
  );
};

export default SelectBookingDetails;
