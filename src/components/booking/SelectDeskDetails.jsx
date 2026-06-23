'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import { useBookingFlow } from '../../store/useBookingFlow';
import { fetchDeskAvailability } from '../../api/bookings';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

// Distinct physical layouts per zone size. 16 = the original U-shaped room
// (4 cols × 6 rows); 14 = the summer A5 room, two facing rows of 7 (2 cols ×
// 7 rows) so the two rooms are visually unmistakable.
const DESK_LAYOUTS = {
  16: {
    cols: 4,
    rows: 6,
    desks: [
      [10, 1, 1], [12, 2, 1], [14, 3, 1], [16, 4, 1],
      [9, 1, 2], [11, 2, 2], [13, 3, 2], [15, 4, 2],
      [8, 1, 3], [4, 4, 3],
      [7, 1, 4], [3, 4, 4],
      [6, 1, 5], [2, 4, 5],
      [5, 1, 6], [1, 4, 6],
    ],
  },
  14: {
    cols: 2,
    rows: 7,
    desks: [
      [1, 1, 1], [2, 2, 1],
      [3, 1, 2], [4, 2, 2],
      [5, 1, 3], [6, 2, 3],
      [7, 1, 4], [8, 2, 4],
      [9, 1, 5], [10, 2, 5],
      [11, 1, 6], [12, 2, 6],
      [13, 1, 7], [14, 2, 7],
    ],
  },
};
const MAX_DESKS = 16;

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

  // Desk zones inside this room → Desk 1 / Desk 2 tabs. Fall back to a single
  // zone built from the room's own fields for non-tabbed rooms.
  const zones = useMemo(() => (
    Array.isArray(room?.deskZones) && room.deskZones.length > 0
      ? room.deskZones
      : [{
          prefix: room?.deskPrefix || 'MA1O1',
          shortLabel: 'Desk 1',
          displayName: room?.name,
          deskCount: room?.capacity ?? MAX_DESKS,
          seasonStart: room?.seasonStart || null,
          seasonEnd: room?.seasonEnd || null,
        }]
  ), [room]);
  const [zonePrefix, setZonePrefix] = useState(zones[0]?.prefix);
  useEffect(() => {
    if (!zones.some((z) => z.prefix === zonePrefix)) setZonePrefix(zones[0]?.prefix);
  }, [zones, zonePrefix]);
  const activeZone = zones.find((z) => z.prefix === zonePrefix) || zones[0] || {};

  // Active zone drives the product prefix (MA1O1-N / MA1O5-N), desk count/layout
  // and the bookable date window.
  const deskPrefix = activeZone.prefix || 'MA1O1';
  const seasonStart = activeZone.seasonStart || null; // ISO yyyy-mm-dd or null
  const seasonEnd = activeZone.seasonEnd || null;

  const deskCount = Math.min(activeZone.deskCount ?? MAX_DESKS, MAX_DESKS);
  const layout = DESK_LAYOUTS[deskCount];
  const gridCols = layout ? layout.cols : 4;
  const gridRows = layout ? layout.rows : 6;
  const visibleDesks = useMemo(
    () => (layout ? layout.desks : DESK_LAYOUTS[16].desks.filter(([deskNum]) => deskNum <= deskCount)),
    [layout, deskCount],
  );

  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];
  // Zone is blocked (visible but unbookable) once its window has ended.
  const zoneBlocked = Boolean(seasonEnd) && todayIso > seasonEnd;
  // Earliest selectable day: today, or the season start if the zone opens later.
  const minDate = seasonStart && seasonStart > todayIso ? seasonStart : todayIso;
  const defaultDate = minDate;
  // Day desk bookings are limited to the next 30 days, clamped to the season end.
  const plus30 = new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0];
  const maxDayDate = seasonEnd && seasonEnd < plus30 ? seasonEnd : plus30;
  // Subscriptions start today or up to the 1st of next month, clamped to season end.
  const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const firstNextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
  const maxSubDate = seasonEnd && seasonEnd < firstNextMonth ? seasonEnd : firstNextMonth;
  // Open-ended monthly subscription: first period runs start → same day next
  // month (e.g. 13th → 13th).
  const addMonths = (dateStr, n) => {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setMonth(d.getMonth() + n);
    return d.toISOString().split('T')[0];
  };

  const [bookingType, setBookingType] = useState('day');
  const [selectedSubDate, setSelectedSubDate] = useState(defaultDate);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedDesk, setSelectedDesk] = useState(null);

  const startDate = bookingType === 'day' ? selectedDate : selectedSubDate;
  const endDate = bookingType === 'day' ? selectedDate : addMonths(selectedSubDate, 1);

  const { data: bloqueos, isLoading, isError, error } = useQuery({
    queryKey: ['desk-availability', deskPrefix, startDate, endDate],
    queryFn: () => fetchDeskAvailability(startDate, endDate, { deskCount, prefix: deskPrefix }),
    enabled: bookingType === 'day' ? Boolean(selectedDate) : Boolean(selectedSubDate),
  });

  const bookedDesks = useMemo(() => {
    const booked = new Set();
    if (!Array.isArray(bloqueos)) return booked;

    const rangeStart = new Date(`${startDate}T00:00:00`);
    const rangeEnd = new Date(`${endDate}T23:59:59`);

    bloqueos.forEach((b) => {
      const productName = (b.producto?.nombre || b.productName || '').toUpperCase();
      const match = productName.match(new RegExp(`^${deskPrefix}[-_ ]?(\\d{1,2})$`));
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
  }, [bloqueos, startDate, endDate, deskPrefix]);

  const availableDesks = useMemo(() => {
    const desks = [];
    for (let i = 1; i <= deskCount; i += 1) {
      if (!bookedDesks.has(i)) desks.push(i);
    }
    return desks;
  }, [bookedDesks, deskCount]);

  useEffect(() => {
    setSelectedDesk(null);
  }, [selectedSubDate, selectedDate, bookingType, zonePrefix]);

  // When the zone changes, snap both dates to that zone's earliest valid day
  // (a date from the other zone may be outside this zone's window).
  useEffect(() => {
    setSelectedDate(minDate);
    setSelectedSubDate(minDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zonePrefix]);

  const handleContinue = () => {
    if (!selectedDesk) return;
    if (bookingType === 'day') {
      setSchedule({
        date: selectedDate,
        dateTo: selectedDate,
        startTime: '00:00',
        endTime: '23:59',
        attendees: 1,
        deskProductName: `${deskPrefix}-${selectedDesk}`,
        bookingType: 'day',
        durationMonths: 0,
      });
    } else {
      // Subscription = open-ended monthly. Bloqueos created for the starting
      // calendar month only; Stripe renews automatically until cancelled.
      setSchedule({
        date: startDate,
        dateTo: endDate,
        startTime: '00:00',
        endTime: '23:59',
        attendees: 1,
        deskProductName: `${deskPrefix}-${selectedDesk}`,
        bookingType: 'subscription',
        durationMonths: 1,
      });
    }
    onContinue?.();
  };

  const isContinueDisabled = !selectedDesk;

  const VAT_RATE = 0.21;
  const pricePerDay = 10;
  const pricePerMonth = 90;
  const isSubscription = bookingType === 'subscription';
  const subtotal = bookingType === 'day' ? pricePerDay : pricePerMonth;
  const vatAmount = subtotal * VAT_RATE;
  const totalPrice = subtotal + vatAmount;

  const bookingTypeLabel = (v) => (v === 'day'
    ? (isEs ? 'Día' : 'Day')
    : (isEs ? 'Suscripción' : 'Subscription'));

  return (
    <Stack spacing={3}>
      {/* Room summary */}
      <Paper elevation={0} sx={{ ...cardSx, display: 'flex', gap: 2, alignItems: 'center' }}>
        {room?.heroImage && (
          <Box
            component="img"
            src={room.heroImage}
            alt={room.name}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            sx={{ width: 80, height: 80, borderRadius: `${radius.md}px`, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: colors.ink }}>{room?.name}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.ink3 }}>{room?.centro}</Typography>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {`${deskCount} ${isEs ? 'mesas' : 'desks'} · ${isEs ? 'desde' : 'from'} €${room?.priceFrom ?? '—'}${room?.priceUnit ?? '/month'}`}
          </Typography>
        </Stack>
      </Paper>

      {/* Coworking 1 / Coworking 2 tabs — segmented-pill style (matches admin) */}
      {zones.length > 1 && (
        <Box sx={{ display: 'inline-flex', alignSelf: 'flex-end' }}>
          <Tabs
            value={zonePrefix}
            onChange={(e, v) => setZonePrefix(v)}
            sx={{
              minHeight: 40,
              bgcolor: colors.bgSoft,
              borderRadius: `${radius.md}px`,
              p: 0.5,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTabs-flexContainer': { gap: 0.5 },
              '& .MuiTab-root': {
                minHeight: 32,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: `${radius.md}px`,
                px: 2,
                py: 0.5,
                color: colors.ink2,
              },
              '& .Mui-selected': { color: `${colors.brand} !important`, bgcolor: colors.bg, boxShadow: 1 },
            }}
          >
            {zones.map((z) => (
              <Tab key={z.prefix} value={z.prefix} label={z.shortLabel || z.displayName} />
            ))}
          </Tabs>
        </Box>
      )}

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
              {['day', 'subscription'].map((opt) => (
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
                  slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultDate, max: maxDayDate } }}
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
                    type="date"
                    label={isEs ? 'FECHA DE INICIO' : 'START DATE'}
                    value={selectedSubDate}
                    onChange={(e) => setSelectedSubDate(e.target.value)}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true }, htmlInput: { min: defaultDate, max: maxSubDate } }}
                    sx={pillFieldSx(selectedSubDate)}
                  />
                </Box>
              </Paper>

              <Typography sx={{ ...typography.body, color: colors.ink3 }}>
                {isEs
                  ? 'Suscripción mensual que se renueva automáticamente. Cancela cuando quieras desde tu cuenta.'
                  : 'Monthly subscription that auto-renews. Cancel anytime from your account.'}
              </Typography>
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
              {zoneBlocked
                ? (isEs
                    ? 'Este escritorio no está disponible para reservar en este momento.'
                    : 'This desk room is not available for booking right now.')
                : availableDesks.length > 0
                  ? (isEs
                      ? `${availableDesks.length} de ${deskCount} escritorios disponibles para este periodo.`
                      : `${availableDesks.length} of ${deskCount} desks available for this period.`)
                  : (isEs
                      ? 'No hay escritorios disponibles para este periodo. Prueba otra fecha.'
                      : 'No desks available for this period. Try a different date.')}
            </Typography>
          </Stack>

          {!zoneBlocked && (
          <>
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
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gridTemplateRows: `repeat(${gridRows}, auto)`,
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
                        <Box sx={{ position: 'relative', width: 30, height: 26, color: 'inherit' }}>
                          {/* head */}
                          <Box sx={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: '50%', bgcolor: 'currentColor' }} />
                          {/* shoulders */}
                          <Box sx={{ position: 'absolute', left: '50%', top: 7, transform: 'translateX(-50%)', width: 16, height: 9, borderRadius: '8px 8px 0 0', bgcolor: 'currentColor' }} />
                          {/* desk */}
                          <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: 30, height: 7, borderRadius: '3px', bgcolor: 'currentColor', opacity: 0.8 }} />
                        </Box>
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
          </>
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
                    : (isEs ? 'Suscripción mensual' : 'Monthly subscription')}
                </Typography>
                <Typography sx={{ ...typography.body, color: colors.ink3, mt: 0.25 }}>
                  {bookingType === 'day'
                    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : (isEs
                        ? `Empieza ${new Date(startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}${seasonEnd ? ` · finaliza ${new Date(`${seasonEnd}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`
                        : `Starts ${new Date(startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}${seasonEnd ? ` · ends ${new Date(`${seasonEnd}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}`)}
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
                {seasonEnd
                  ? (isEs
                      ? `Reserva de temporada: finaliza el ${new Date(`${seasonEnd}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                      : `Seasonal booking: ends ${new Date(`${seasonEnd}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}.`)
                  : (isEs
                      ? 'Primer mes ahora, luego mensualmente hasta que canceles.'
                      : 'First month charged now, then monthly until you cancel.')}
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
