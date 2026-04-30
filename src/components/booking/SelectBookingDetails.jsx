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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import { useQuery } from '@tanstack/react-query';
import TextField from '../common/ClearableTextField';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchPublicAvailability } from '../../api/bookings';
import RoomCalendarGrid, { CalendarLegend } from './RoomCalendarGrid';
import TimeSlotSelect from './TimeSlotSelect';
import { addMinutesToTime, buildTimeSlots, getBookedSlotIds, getMaxEndTime } from '../../utils/calendarUtils';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;
const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };

const pillFieldSx = (hasValue) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: hasValue ? colors.brand : colors.ink,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    transition: `color ${motion.duration} ${motion.ease}`,
  },
  '& .MuiInput-input': {
    fontSize: '0.9rem',
    color: hasValue ? colors.ink : colors.ink3,
    py: 0.25,
  },
});

const pillFieldNumberSx = (hasValue) => ({
  ...pillFieldSx(hasValue),
  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
  '& input[type=number]': { MozAppearance: 'textfield' },
});

const pillBarSx = {
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  flexDirection: { xs: 'column', sm: 'row' },
  borderRadius: { xs: 3, sm: 999 },
};

const cardSx = {
  p: { xs: 2.5, md: 3 },
  borderRadius: `${radius.lg}px`,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
};

const sectionTitleSx = {
  ...typography.h3,
  color: colors.ink,
  fontFamily: typography.fontFamily,
  fontFeatureSettings: typography.fontFeatureSettings,
  m: 0,
  fontSize: { xs: '1.05rem', md: '1.15rem' },
};

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
    if (!schedule.startTime) setSchedule({ startTime: DEFAULT_TIME_RANGE.start });
    if (!schedule.endTime) setSchedule({ endTime: DEFAULT_TIME_RANGE.end });
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
        products: room?.productName ? [room.productName] : undefined,
      }),
    enabled: Boolean(schedule.date),
  });

  const bloqueos = Array.isArray(data) ? data : [];

  const roomBloqueos = useMemo(() => {
    if (!room?.productName) return bloqueos;
    return bloqueos.filter(
      (item) => (item?.producto?.nombre || '').toLowerCase() === room.productName.toLowerCase(),
    );
  }, [bloqueos, room?.productName]);

  const timeSlots = useMemo(() => buildTimeSlots(), []);
  const bookedSlotIds = useMemo(() => getBookedSlotIds(roomBloqueos), [roomBloqueos]);
  const maxEndTime = useMemo(
    () => getMaxEndTime(schedule.startTime, roomBloqueos),
    [schedule.startTime, roomBloqueos],
  );

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
    if (schedule.startTime) return `${room?.id || 'room'}-${schedule.startTime}`;
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
    const cursor = new Date(`${schedule.date}T00:00:00`);
    const end = new Date(`${schedule.dateTo}T00:00:00`);
    while (cursor <= end) {
      if (selectedDays.has(cursor.getDay())) count += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }, [recurring, schedule.date, schedule.dateTo, weekdays]);

  const isContinueDisabled = !schedule.date || !schedule.startTime || !schedule.endTime;

  return (
    <Stack spacing={3}>
      {/* Room summary */}
      <Paper elevation={0} sx={{ ...cardSx, display: 'flex', gap: 2, alignItems: 'center' }}>
        {room?.heroImage && (
          <Box
            component="img"
            src={room.heroImage}
            alt={room.name}
            sx={{ width: 80, height: 80, borderRadius: `${radius.md}px`, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.ink }}>
            {room?.name}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.ink3 }}>
            {room?.centro}
          </Typography>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {t('booking.capacityFrom', { capacity: room?.capacity ?? '—', price: room?.priceFrom ?? room?.price ?? '—', unit: room?.priceUnit ?? room?.currency ?? 'EUR' })}
          </Typography>
        </Stack>
      </Paper>

      {/* Date & time selection */}
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Box component="h3" sx={sectionTitleSx}>{t('booking.pickDateTime')}</Box>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {t('booking.pickDateTimeDesc')}
            </Typography>
          </Stack>

          <Paper elevation={0} sx={pillBarSx}>
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
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
            <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ borderColor: colors.line, display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TimeSlotSelect
                label={t('booking.startTime')}
                value={schedule.startTime || DEFAULT_TIME_RANGE.start}
                onChange={(val) => setSchedule({ startTime: val })}
                slots={timeSlots}
                bookedSlotIds={bookedSlotIds}
              />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ borderColor: colors.line, display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
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
            <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ borderColor: colors.line, display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

            <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
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
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: colors.brand },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.brand },
                }}
              />
            }
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <EventRepeatRoundedIcon sx={{ fontSize: 20, color: colors.brand }} />
                <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
                  {t('booking.recurringBooking')}
                </Typography>
              </Stack>
            }
          />

          {recurring && (
            <>
              <Paper elevation={0} sx={pillBarSx}>
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard"
                    type="date"
                    label={t('booking.dateFrom')}
                    value={schedule.date || ''}
                    onChange={(e) => setSchedule({ date: e.target.value })}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={pillFieldSx(schedule.date)}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ borderColor: colors.line, display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard"
                    type="date"
                    label={t('booking.dateTo')}
                    value={schedule.dateTo || ''}
                    onChange={(e) => setSchedule({ dateTo: e.target.value })}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={pillFieldSx(schedule.dateTo)}
                  />
                </Box>
              </Paper>
              <Stack spacing={1.25}>
                <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
                  {t('booking.selectWeekdays')}
                </Typography>
                <ToggleButtonGroup
                  value={weekdays}
                  onChange={(_, newDays) => setWeekdays(newDays)}
                  size="small"
                  multiple
                  sx={{ flexWrap: 'wrap', gap: 0.5 }}
                >
                  {WEEKDAY_KEYS.map((day) => (
                    <ToggleButton
                      key={day}
                      value={day}
                      sx={{
                        px: 1.75,
                        py: 0.6,
                        borderRadius: `${radius.pill}px !important`,
                        border: `1px solid ${colors.line}`,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: colors.ink2,
                        '&:hover': { borderColor: colors.brand, color: colors.brand, bgcolor: 'transparent' },
                        '&.Mui-selected': {
                          bgcolor: colors.brand,
                          color: colors.bg,
                          borderColor: colors.brand,
                          '&:hover': { bgcolor: colors.brandDeep, borderColor: colors.brandDeep, color: colors.bg },
                        },
                      }}
                    >
                      {t(`booking.weekday_${day}`)}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
              {bookingCount > 0 && (
                <Chip
                  icon={<EventRepeatRoundedIcon sx={{ color: `${colors.brand} !important` }} />}
                  label={t('booking.bookingsWillBeCreated', { count: bookingCount })}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: colors.brandSoft,
                    color: colors.brandDeep,
                    border: `1px solid ${colors.brand}`,
                    fontWeight: 600,
                  }}
                />
              )}
            </>
          )}

          <Divider sx={{ borderColor: colors.line }} />

          {isError ? (
            <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>
              {error?.message || t('booking.fetchError')}
            </Alert>
          ) : null}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: colors.brand }} />
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
                        day: 'numeric',
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

      {/* Notes */}
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2}>
          <Box component="h3" sx={sectionTitleSx}>{t('booking.additionalDetails')}</Box>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${colors.line}`,
              bgcolor: colors.bg,
              display: 'flex',
              overflow: 'hidden',
              borderRadius: `${radius.md}px`,
            }}
          >
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
          disableElevation
          onClick={() => {
            setSchedule({ note });
            onContinue?.();
          }}
          disabled={isContinueDisabled}
          sx={{
            bgcolor: colors.brand,
            color: colors.bg,
            borderRadius: `${radius.pill}px`,
            px: 4,
            py: 1.4,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: `background-color ${motion.duration} ${motion.ease}`,
            '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
          }}
        >
          {t('common.continue')}
        </Button>
      </Box>
    </Stack>
  );
};

export default SelectBookingDetails;
