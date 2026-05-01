'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchDeskAvailability } from '../../api/bookings';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const DURATION_OPTIONS = [
  { months: 1 },
  { months: 3 },
  { months: 6 },
  { months: 12 },
];

const GRID_DESKS = [
  [10, 1, 1], [12, 2, 1], [14, 3, 1], [16, 4, 1],
  [9, 1, 2], [11, 2, 2], [13, 3, 2], [15, 4, 2],
  [8, 1, 3], [4, 4, 3],
  [7, 1, 4], [3, 4, 4],
  [6, 1, 5], [2, 4, 5],
  [5, 1, 6], [1, 4, 6],
];

const getMonthEnd = (startDate, months) => {
  const d = new Date(`${startDate}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getMonthStart = (yearMonth) => `${yearMonth}-01`;

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

const pillButtonSx = (active) => ({
  borderRadius: `${radius.pill}px`,
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  py: 0.75,
  fontSize: '0.85rem',
  bgcolor: active ? colors.brand : 'transparent',
  color: active ? colors.bg : colors.ink2,
  border: `1px solid ${active ? colors.brand : colors.line}`,
  boxShadow: 'none',
  '&:hover': active
    ? { bgcolor: colors.brandDeep, borderColor: colors.brandDeep, boxShadow: 'none' }
    : { borderColor: colors.brand, color: colors.brand, bgcolor: 'transparent' },
});

const SelectDeskDetails = ({ room, onContinue }) => {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  const setSchedule = useBookingFlow((state) => state.setSchedule);

  // Real desk count comes from the catalog (room.capacity). Fall back to the
  // floor-plan size if the room has no capacity set, and clamp to the layout
  // to avoid rendering desks the floor plan can't position.
  const deskCount = Math.min(room?.capacity ?? GRID_DESKS.length, GRID_DESKS.length);
  const visibleDesks = useMemo(
    () => GRID_DESKS.filter(([deskNum]) => deskNum <= deskCount),
    [deskCount],
  );

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const defaultDate = today.toISOString().split('T')[0];

  const [bookingType, setBookingType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [duration, setDuration] = useState(1);
  const [selectedDesk, setSelectedDesk] = useState(null);

  const startDate = bookingType === 'day' ? selectedDate : getMonthStart(selectedMonth);
  const endDate = bookingType === 'day' ? selectedDate : getMonthEnd(startDate, duration);

  const { data: bloqueos, isLoading, isError, error } = useQuery({
    queryKey: ['desk-availability', startDate, endDate],
    queryFn: () => fetchDeskAvailability(startDate, endDate),
    enabled: bookingType === 'day' ? Boolean(selectedDate) : Boolean(selectedMonth),
  });

  const bookedDesks = useMemo(() => {
    const booked = new Set();
    if (!Array.isArray(bloqueos)) return booked;

    const rangeStart = new Date(`${startDate}T00:00:00`);
    const rangeEnd = new Date(`${endDate}T23:59:59`);

    bloqueos.forEach((b) => {
      const productName = (b.producto?.nombre || b.productName || '').toUpperCase();
      const match = productName.match(/^MA1O1[-_ ]?(\d{1,2})$/);
      if (!match) return;

      const bStart = new Date(b.fechaIni || b.fecha || b.date);
      const bEnd = b.fechaFin || b.dateTo
        ? new Date(b.fechaFin || b.dateTo)
        : bStart;

      if (bStart <= rangeEnd && bEnd >= rangeStart) {
        booked.add(parseInt(match[1], 10));
      }
    });

    return booked;
  }, [bloqueos, startDate, endDate]);

  const availableDesks = useMemo(() => {
    const desks = [];
    for (let i = 1; i <= deskCount; i += 1) {
      if (!bookedDesks.has(i)) desks.push(i);
    }
    return desks;
  }, [bookedDesks, deskCount]);

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

  const bookingTypeLabel = (v) => (v === 'day' ? (isEs ? 'Día' : 'Day') : (isEs ? 'Mes' : 'Month'));
  const durationLabel = (m) => `${m} ${m === 1 ? (isEs ? 'mes' : 'month') : (isEs ? 'meses' : 'months')}`;

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
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.ink }}>{room?.name}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.ink3 }}>{room?.centro}</Typography>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {`${room?.capacity ?? '—'} ${isEs ? 'mesas' : 'desks'} · ${isEs ? 'desde' : 'from'} €${room?.priceFrom ?? '—'}${room?.priceUnit ?? '/month'}`}
          </Typography>
        </Stack>
      </Paper>

      {/* Period selection */}
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Box component="h3" sx={sectionTitleSx}>{isEs ? 'Selecciona tu periodo' : 'Select your period'}</Box>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {isEs ? 'Elige el tipo de reserva y cuándo necesitas el escritorio.' : 'Choose a booking type and when you need the desk.'}
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
              {isEs ? 'Tipo de reserva' : 'Booking type'}
            </Typography>
            <Stack direction="row" spacing={1}>
              {['day', 'month'].map((opt) => (
                <Button
                  key={opt}
                  size="small"
                  onClick={() => setBookingType(opt)}
                  disableElevation
                  sx={pillButtonSx(bookingType === opt)}
                >
                  {bookingTypeLabel(opt)}
                </Button>
              ))}
            </Stack>
          </Stack>

          {bookingType === 'day' ? (
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${colors.line}`,
                bgcolor: colors.bg,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 999,
              }}
            >
              <Box sx={{ flex: 1, px: 3, py: 1.5, minWidth: 0 }}>
                <TextField
                  variant="standard"
                  type="date"
                  label={isEs ? 'SELECCIONA FECHA' : 'SELECT DATE'}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultDate } }}
                  sx={pillFieldSx(selectedDate)}
                />
              </Box>
            </Paper>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${colors.line}`,
                  bgcolor: colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 999,
                }}
              >
                <Box sx={{ flex: 1, px: 3, py: 1.5, minWidth: 0 }}>
                  <TextField
                    variant="standard"
                    type="month"
                    label={isEs ? 'MES DE INICIO' : 'START MONTH'}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultMonth } }}
                    sx={pillFieldSx(selectedMonth)}
                  />
                </Box>
              </Paper>

              <Stack spacing={1.25}>
                <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
                  {isEs ? 'Duración' : 'Duration'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {DURATION_OPTIONS.map((opt) => (
                    <Button
                      key={opt.months}
                      size="small"
                      onClick={() => setDuration(opt.months)}
                      disableElevation
                      sx={pillButtonSx(duration === opt.months)}
                    >
                      {durationLabel(opt.months)}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>

      {/* Desk grid */}
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Box component="h3" sx={sectionTitleSx}>{isEs ? 'Elige tu escritorio' : 'Choose your desk'}</Box>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {availableDesks.length > 0
                ? (isEs
                    ? `${availableDesks.length} de ${deskCount} escritorios disponibles para este periodo.`
                    : `${availableDesks.length} of ${deskCount} desks available for this period.`)
                : (isEs
                    ? 'No hay escritorios disponibles para este periodo. Prueba otra fecha.'
                    : 'No desks available for this period. Try a different date.')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2.5} sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: colors.brandSoft, border: `1px solid ${colors.brand}` }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.ink2 }}>
                {isEs ? 'Disponible' : 'Available'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: colors.brand }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.ink2 }}>
                {isEs ? 'Seleccionado' : 'Selected'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: colors.bgSoft, border: `1px solid ${colors.line}` }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.ink2 }}>
                {isEs ? 'Reservado' : 'Booked'}
              </Typography>
            </Stack>
          </Stack>

          {isError && (
            <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>
              {error?.message || (isEs ? 'No se pudo cargar la disponibilidad.' : 'Unable to fetch desk availability.')}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: colors.brand }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(6, auto)',
                gap: 1.25,
              }}
            >
              {visibleDesks.map(([deskNum, col, row]) => {
                const isBooked = bookedDesks.has(deskNum);
                const isSelected = selectedDesk === deskNum;

                return (
                  <Box key={deskNum} sx={{ gridColumn: col, gridRow: row }}>
                    <Button
                      onClick={() => !isBooked && setSelectedDesk(deskNum)}
                      disabled={isBooked}
                      fullWidth
                      disableElevation
                      sx={{
                        py: 1.75,
                        borderRadius: `${radius.md}px`,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        minWidth: 0,
                        boxShadow: 'none',
                        ...(isSelected && {
                          bgcolor: colors.brand,
                          color: colors.bg,
                          border: `1px solid ${colors.brand}`,
                          '&:hover': { bgcolor: colors.brandDeep, borderColor: colors.brandDeep },
                        }),
                        ...(!isSelected && !isBooked && {
                          bgcolor: colors.brandSoft,
                          border: `1px solid ${colors.brand}`,
                          color: colors.brandDeep,
                          '&:hover': { bgcolor: colors.brand, color: colors.bg, borderColor: colors.brand },
                        }),
                        ...(isBooked && {
                          bgcolor: colors.bgSoft,
                          border: `1px solid ${colors.line}`,
                          color: colors.ink3,
                        }),
                      }}
                    >
                      <Stack alignItems="center" spacing={0.25}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, lineHeight: 1, color: 'inherit' }}>
                          {isEs ? 'Mesa' : 'Desk'}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1, color: 'inherit' }}>
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
        <Paper elevation={0} sx={cardSx}>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography sx={{ ...typography.body, color: colors.ink, fontWeight: 600 }}>
                  {isEs ? `Mesa ${selectedDesk}` : `Desk ${selectedDesk}`} ·{' '}
                  {bookingType === 'day'
                    ? (isEs ? '1 día' : '1 day')
                    : durationLabel(duration)}
                </Typography>
                <Typography sx={{ ...typography.body, color: colors.ink3, mt: 0.25 }}>
                  {bookingType === 'day'
                    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : `${new Date(startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} – ${new Date(endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                </Typography>
              </Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {isSubscription ? `€${subtotal.toFixed(2)}/${isEs ? 'mes' : 'month'}` : `€${subtotal.toFixed(2)}`}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ ...typography.body, color: colors.ink3 }}>
                {isSubscription ? `IVA (21%) /${isEs ? 'mes' : 'month'}` : 'IVA (21%)'}
              </Typography>
              <Typography sx={{ ...typography.body, color: colors.ink3 }}>
                €{vatAmount.toFixed(2)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderTop: `1px solid ${colors.line}`, pt: 1.5 }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: colors.ink }}>
                {isSubscription ? (isEs ? 'Total mensual' : 'Monthly total') : 'Total'}
              </Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.ink }}>
                {isSubscription
                  ? `€${totalPrice.toFixed(2)}/${isEs ? 'mes' : 'month'}`
                  : `€${totalPrice.toFixed(2)}`}
              </Typography>
            </Stack>
            {isSubscription && (
              <Typography sx={{ fontSize: '0.8rem', color: colors.ink3 }}>
                {isEs
                  ? `Primer mes ahora, después mensualmente durante ${duration} meses.`
                  : `First month charged now, then monthly for ${duration} months total.`}
              </Typography>
            )}
          </Stack>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          disableElevation
          onClick={handleContinue}
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
          {isEs ? 'Continuar' : 'Continue'}
        </Button>
      </Box>
    </Stack>
  );
};

export default SelectDeskDetails;
