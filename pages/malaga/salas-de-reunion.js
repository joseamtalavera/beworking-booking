'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Seo from '@/seo/Seo';
import {
  Box, Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos, fetchPublicAvailability } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import { tokens } from '@/theme/tokens';
import { trackWhatsappClicked } from '@/utils/analytics';

const { colors, motion, typography, layout, radius } = tokens;
const location = getLocation('malaga');

// Half-hour booking slots from 06:00 to 22:00. Same shape used on room detail
// pages so users see a consistent time-picker across catalog and detail.
const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 6; h <= 22; h += 1) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

export default function SalasDeReunion() {
  const { t } = useTranslation();
  const { setRooms } = useCatalogRooms();
  const router = useRouter();
  const [centros, setCentros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('malaga');
  const [checkIn, setCheckIn] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [people, setPeople] = useState('1');
  const [bloqueos, setBloqueos] = useState([]);
  const [noResultsOpen, setNoResultsOpen] = useState(false);
  const lastShownCriteriaRef = useRef('');
  // Legacy compat: keep timeFilter mirroring startTime so handleBookNow's
  // existing query-string passing keeps working until /rooms/[roomId]
  // accepts ?from= & ?to= explicitly.
  const timeFilter = startTime;

  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [centrosData, productosData] = await Promise.all([
          fetchBookingCentros(),
          fetchBookingProductos({ centerCode: location.centerCode, type: 'Aula' }),
        ]);
        if (!active) return;

        const mapped = Array.isArray(centrosData) ? centrosData.map((c) => ({
          ...c,
          label: c.nombre ?? c.name ?? '',
          code: (c.codigo ?? c.code ?? '').toUpperCase(),
          city: (c.localidad ?? c.city ?? '').trim(),
        })) : [];
        setCentros(mapped);
        setProductos(Array.isArray(productosData) ? productosData : []);

        const centroLabel = mapped.find((c) => c.code === location.centerCode)?.label ?? 'Malaga Workspace';
        const aulas = (productosData || []).filter((p) => {
          const type = (p.type ?? p.tipo ?? '').trim().toLowerCase();
          const name = (p.name ?? p.nombre ?? '').trim().toUpperCase();
          return type === 'aula' && !isCanonicalDeskProducto(p) && name.startsWith('MA1A');
        });
        setRooms(aulas.map((p) => buildRoomFromProducto(p, centroLabel)));
      } catch {
        // keep empty on error
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [setRooms]);

  // Fetch availability (bloqueos for the date) so we can hide rooms that have
  // an overlapping booking in the requested [startTime, endTime] window.
  useEffect(() => {
    if (!checkIn) { setBloqueos([]); return; }
    let active = true;
    (async () => {
      try {
        const data = await fetchPublicAvailability({ date: checkIn });
        if (active) setBloqueos(Array.isArray(data) ? data : []);
      } catch {
        if (active) setBloqueos([]);
      }
    })();
    return () => { active = false; };
  }, [checkIn]);

  const filteredSpaces = useMemo(() => {
    const aulas = productos.filter((p) => {
      const type = (p.type ?? p.tipo ?? '').trim().toLowerCase();
      const name = (p.name ?? p.nombre ?? '').trim().toUpperCase();
      return type === 'aula' && !isCanonicalDeskProducto(p) && name.startsWith('MA1A');
    });

    let spaces = aulas.map((producto) => {
      const name = (producto.name ?? producto.nombre ?? '').trim();
      const center = (producto.centerCode ?? producto.centroCodigo ?? '').trim();
      const matchingCentro = centros.find((c) => c.code === center.toUpperCase());
      return {
        id: producto.id,
        name,
        productName: name,
        slug: name.toLowerCase(),
        type: 'meeting_room',
        typeLabel: (producto.type ?? producto.tipo ?? '') || 'Meeting room',
        image: producto.heroImage || '',
        capacity: producto.capacity != null ? String(producto.capacity) : '-',
        rating: producto.ratingAverage != null ? Number(producto.ratingAverage) : 4.8,
        reviewCount: producto.ratingCount ?? 0,
        priceFrom: producto.priceFrom,
        price: producto.priceFrom != null ? `€ ${producto.priceFrom}` : '€ -',
        priceUnit: producto.priceUnit || '/h',
        description: producto.description || producto.subtitle || `${name}`,
        subtitle: producto.subtitle || '',
        gallery: Array.isArray(producto.images) ? producto.images : [],
        amenities: Array.isArray(producto.amenities) ? producto.amenities : [],
        tags: Array.isArray(producto.tags) ? producto.tags : [],
        location: matchingCentro?.city || 'Malaga',
        sizeSqm: producto.sizeSqm != null ? Number(producto.sizeSqm) : null,
        instantBooking: producto.instantBooking !== false,
        centroCode: center || undefined,
        centerName: matchingCentro?.label || undefined,
        isBookable: true,
      };
    });

    if (people && people.trim() !== '') {
      const userCount = parseInt(people);
      if (!isNaN(userCount)) {
        spaces = spaces.filter((s) => {
          const cap = parseInt(s.capacity);
          return !isNaN(cap) && userCount <= cap;
        });
      }
    }

    // Availability filter: when date + start + end all set, drop rooms that
    // have a bloqueo overlapping the requested window.
    if (checkIn && startTime && endTime) {
      const reqStart = new Date(`${checkIn}T${startTime}:00`).getTime();
      const reqEnd = new Date(`${checkIn}T${endTime}:00`).getTime();
      if (!Number.isNaN(reqStart) && !Number.isNaN(reqEnd) && reqEnd > reqStart) {
        const conflictingRoomNames = new Set();
        bloqueos.forEach((b) => {
          const productName = (b?.producto?.nombre || '').trim();
          if (!productName) return;
          const bStart = new Date(b.fechaIni).getTime();
          const bEnd = new Date(b.fechaFin).getTime();
          if (Number.isNaN(bStart) || Number.isNaN(bEnd)) return;
          const overlaps = bStart < reqEnd && bEnd > reqStart;
          if (overlaps) conflictingRoomNames.add(productName);
        });
        spaces = spaces.filter((s) => !conflictingRoomNames.has(s.name));
      }
    }

    return spaces;
  }, [productos, centros, people, checkIn, startTime, endTime, bloqueos]);

  // Auto-open the no-availability modal once productos have loaded, the user
  // has set date+start+end, and the filter returns 0. Track the last shown
  // criteria so it doesn't reopen on every keystroke if the user dismisses it.
  useEffect(() => {
    if (loading) return;
    if (!productos.length) return;
    if (!checkIn || !startTime || !endTime) return;
    if (filteredSpaces.length > 0) return;
    const criteriaKey = `${checkIn}|${startTime}|${endTime}|${people}`;
    if (lastShownCriteriaRef.current === criteriaKey) return;
    lastShownCriteriaRef.current = criteriaKey;
    setNoResultsOpen(true);
  }, [loading, productos.length, filteredSpaces.length, checkIn, startTime, endTime, people]);

  const handleBookNow = useCallback(
    (space) => {
      const slug = (space.slug ?? '').toLowerCase();
      if (!slug) return;
      const query = {};
      if (checkIn) query.date = checkIn;
      if (startTime) query.startTime = startTime;
      if (endTime) query.endTime = endTime;
      if (people) query.attendees = people;
      router.push({ pathname: `/rooms/${slug}`, query });
    },
    [router, checkIn, startTime, endTime, people],
  );

  const filterFieldSx = {
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: colors.ink,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    '& .MuiInput-input': { fontSize: '0.9rem', color: colors.ink, py: 0.25 },
  };

  return (
    <>
      <Seo
        title={location.seo.meetingRooms.title}
        description={location.seo.meetingRooms.description}
        canonical="https://be-working.com/malaga/salas-de-reunion"
      />

      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 9 },
          px: { xs: 3, md: 5 },
          textAlign: 'center',
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Typography
            component="h1"
            sx={{
              ...typography.eyebrow,
              color: colors.brand,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {t('locations.services.meetingRooms', 'Salas de reunión')} · Málaga
          </Typography>
          <Box
            component="div"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            BeWorking<Box component="span" sx={{ color: colors.brand }}>Rooms</Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 560, mx: 'auto' }}>
            {t(
              'home.evolved.salasPage.subtitle',
              'Salas equipadas para reuniones, formación o eventos. Reserva por horas, desde 5€/h.',
            )}
          </Typography>

          <Box
            component="a"
            href="https://wa.me/34640369759?text=Hola,%20necesito%20ayuda%20con%20una%20sala%20de%20reuni%C3%B3n"
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsappClicked({ source: 'malaga-rooms' })}
            sx={{
              display: 'inline-block',
              mt: 3,
              px: 2.5,
              py: 0.9,
              bgcolor: colors.brand,
              color: colors.bg,
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: `${radius.pill}px`,
              textDecoration: 'none',
              transition: `background-color ${motion.duration} ${motion.ease}`,
              '&:hover': { bgcolor: colors.brandDeep },
            }}
          >
            {t('room.needHelp', '¿Necesitas ayuda?')}
          </Box>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 6, md: 9 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              border: `1px solid ${colors.line}`,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              flexDirection: { xs: 'column', sm: 'row' },
              borderRadius: { xs: 3, sm: 999 },
            }}
          >
            {/* WHERE — only Málaga today; designed to scale (Sevilla, Tallinn, …) */}
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                select
                variant="standard"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                label={t('home.where', 'Dónde')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              >
                <MenuItem value="malaga">Málaga</MenuItem>
                <MenuItem value="sevilla" disabled>Sevilla — pronto</MenuItem>
                <MenuItem value="tallinn" disabled>Tallinn — pronto</MenuItem>
              </TextField>
            </Box>
            {/* DATE */}
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                label={t('home.when', 'Fecha')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              />
            </Box>
            {/* STARTING */}
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                label={t('home.startTime', 'Inicio')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              >
                <MenuItem value=""><em>—</em></MenuItem>
                {TIME_SLOTS.map((slot) => (
                  <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                ))}
              </TextField>
            </Box>
            {/* ENDING */}
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                label={t('home.endTime', 'Fin')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              >
                <MenuItem value=""><em>—</em></MenuItem>
                {TIME_SLOTS
                  .filter((slot) => !startTime || slot > startTime)
                  .map((slot) => (
                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                  ))}
              </TextField>
            </Box>
            {/* PEOPLE */}
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                label={t('home.who', 'Personas')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  ...filterFieldSx,
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
                  '& input[type=number]': { MozAppearance: 'textfield' },
                }}
              />
            </Box>
            <Box sx={{ px: { xs: 2, sm: 1.5 }, py: { xs: 1.5, sm: 0 }, width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label={t('home.searchSpaces', 'Buscar')}
                onClick={() => {
                  const hasCriteria = checkIn && startTime && endTime;
                  if (hasCriteria && filteredSpaces.length === 0) {
                    setNoResultsOpen(true);
                  }
                }}
                sx={{
                  bgcolor: colors.brand,
                  color: colors.bg,
                  width: 44,
                  height: 44,
                  '&:hover': { bgcolor: colors.brandDeep },
                }}
              >
                <SearchRoundedIcon />
              </IconButton>
            </Box>
          </Paper>

          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', color: colors.ink3 }}>
              {t(filteredSpaces.length === 1 ? 'home.showingSpace' : 'home.showingSpaces', { count: filteredSpaces.length })}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              alignItems: 'stretch',
              pb: 6,
            }}
          >
            {filteredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={noResultsOpen}
        onClose={() => setNoResultsOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: `${radius.lg}px`, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: colors.brandSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EventBusyRoundedIcon sx={{ color: colors.brand, fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {t('home.noAvailability.title', 'Sin disponibilidad')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.ink2, mb: 2, lineHeight: 1.55 }}>
            {t(
              'home.noAvailability.body',
              'Lo sentimos, no hay salas disponibles para esa franja. Prueba a ajustar la fecha, la hora o el número de personas — o escríbenos por WhatsApp y miramos opciones contigo.'
            )}
          </Typography>
          <Stack spacing={1}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                trackWhatsappClicked({ source: 'catalog-no-availability' });
                window.open(
                  'https://wa.me/34640369759?text=Hola,%20busco%20una%20sala%20pero%20no%20vi%20disponibilidad.%20%C2%BFPod%C3%A9is%20ayudarme%3F',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              sx={{
                bgcolor: '#25D366',
                color: '#fff',
                borderRadius: `${radius.pill}px`,
                fontWeight: 600,
                textTransform: 'none',
                py: 1.2,
                '&:hover': { bgcolor: '#1da851' },
              }}
            >
              {t('home.noAvailability.whatsapp', 'Hablar por WhatsApp')}
            </Button>
            <Button
              variant="text"
              onClick={() => setNoResultsOpen(false)}
              sx={{ textTransform: 'none', color: colors.ink2, fontWeight: 600 }}
            >
              {t('home.noAvailability.adjust', 'Ajustar mi búsqueda')}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
