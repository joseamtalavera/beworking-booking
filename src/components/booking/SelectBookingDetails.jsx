'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import { useQuery } from '@tanstack/react-query';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchPublicAvailability } from '../../api/bookings';
import RoomCalendarGrid, { CalendarLegend } from './RoomCalendarGrid';
import TimeSlotSelect from './TimeSlotSelect';
import { addMinutesToTime, buildTimeSlots, getBookedSlotIds, getMaxEndTime } from '../../utils/calendarUtils';
import { useTranslation } from 'react-i18next';

const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };

const pillFieldSx = (hasValue) => ({
  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: hasValue ? 'primary.main' : 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'color 0.2s' },
  '& .MuiInput-input': { fontSize: '0.875rem', color: hasValue ? 'text.primary' : 'text.secondary', py: 0.25 },
});

const pillFieldNumberSx = (hasValue) => ({
  ...pillFieldSx(hasValue),
  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
  '& input[type=number]': { MozAppearance: 'textfield' },
});
const WEEKDAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_JS_MAP = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };

const SelectBookingDetails = ({ room, onContinue }) => {
  const { t } = useTranslation();
  const schedule = useBookingFlow((state) => state.schedule);
  const setSchedule = useBookingFlow((state) => state.setSchedule);

  const [note, setNote] = useState('');
  const recurring = schedule.recurring || false;
  const setRecurring = (val) => setSchedule({ recurring: val });
  const weekdays = schedule.weekdays || [];
  const setWeekdays = (val) => setSchedule({ weekdays: val });

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

  const timeSlots = useMemo(() => buildTimeSlots(), []);

  const bookedSlotIds = useMemo(() => getBookedSlotIds(roomBloqueos), [roomBloqueos]);

  const maxEndTime = useMemo(
    () => getMaxEndTime(schedule.startTime, roomBloqueos),
    [schedule.startTime, roomBloqueos]
  );

  // Auto-adjust if selected startTime is booked
  useEffect(() => {
    if (!schedule.startTime || bookedSlotIds.size === 0) return;
    if (bookedSlotIds.has(schedule.startTime)) {
      const next = timeSlots.find((s) => !bookedSlotIds.has(s.id));
      if (next) {
        setSchedule({ startTime: next.id, endTime: addMinutesToTime(next.id, 60) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookedSlotIds]);

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

  const handleAttendeesChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setSchedule({ attendees: Number.isNaN(value) || value < 1 ? 1 : value });
  };

  const bookingCount = useMemo(() => {
    if (!recurring || !schedule.date || !schedule.dateTo || !weekdays.length) return 0;
    const selectedDays = new Set(weekdays.map((d) => DAY_JS_MAP[d]));
    let count = 0;
    const cursor = new Date(schedule.date + 'T00:00:00');
    const end = new Date(schedule.dateTo + 'T00:00:00');
    while (cursor <= end) {
      if (selectedDays.has(cursor.getDay())) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }, [recurring, schedule.date, schedule.dateTo, weekdays]);

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
                sx={pillFieldSx(schedule.date)}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TimeSlotSelect
                label={t('booking.startTime')}
                value={schedule.startTime || DEFAULT_TIME_RANGE.start}
                onChange={(val) => setSchedule({ startTime: val })}
                slots={timeSlots}
                bookedSlotIds={bookedSlotIds}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TimeSlotSelect
                label={t('booking.endTime')}
                value={schedule.endTime || DEFAULT_TIME_RANGE.end}
                onChange={(val) => setSchedule({ endTime: val })}
                slots={timeSlots}
                bookedSlotIds={bookedSlotIds}
                minTime={schedule.startTime ? addMinutesToTime(schedule.startTime, 30) : undefined}
                maxTime={maxEndTime || undefined}
                isEndTime
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="number"
                label={t('booking.numberOfAttendees')}
                placeholder="1"
                value={schedule.attendees || ''}
                onChange={handleAttendeesChange}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={pillFieldNumberSx(schedule.attendees)}
              />
            </Box>
          </Paper>

          {/* Recurring toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={recurring}
                onChange={(e) => {
                  const on = e.target.checked;
                  setRecurring(on);
                  if (!on) {
                    setSchedule({ dateTo: schedule.date });
                    setWeekdays([]);
                  }
                }}
              />
            }
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <EventRepeatRoundedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  {t('booking.recurringBooking')}
                </Typography>
              </Stack>
            }
          />

          {recurring && (
            <>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper',
                  display: 'flex', alignItems: 'center', overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: { xs: 3, sm: 999 },
                }}
              >
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard" type="date" label={t('booking.dateFrom')}
                    value={schedule.date || ''} onChange={(e) => setSchedule({ date: e.target.value })}
                    fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={pillFieldSx(schedule.date)}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard" type="date" label={t('booking.dateTo')}
                    value={schedule.dateTo || ''} onChange={(e) => setSchedule({ dateTo: e.target.value })}
                    fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={pillFieldSx(schedule.dateTo)}
                  />
                </Box>
              </Paper>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {t('booking.selectWeekdays')}
                </Typography>
                <ToggleButtonGroup
                  value={weekdays}
                  onChange={(_, newDays) => setWeekdays(newDays)}
                  size="small" multiple
                  sx={{ flexWrap: 'wrap', gap: 0.5 }}
                >
                  {WEEKDAY_KEYS.map((day) => (
                    <ToggleButton key={day} value={day} sx={{
                      px: 1.5, py: 0.5, borderRadius: '8px !important', border: '1px solid', borderColor: 'divider',
                      '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } },
                    }}>
                      {t(`booking.weekday_${day}`)}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
              {bookingCount > 0 && (
                <Chip icon={<EventRepeatRoundedIcon />} label={t('booking.bookingsWillBeCreated', { count: bookingCount })} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              )}
            </>
          )}

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
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', borderRadius: 3 }}>
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: '100%' }}>
              <TextField
                variant="standard"
                label={t('booking.notesOptional')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                placeholder={t('booking.notesPlaceholder')}
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={pillFieldSx(note)}
              />
            </Box>
          </Paper>
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
