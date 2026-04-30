'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box, IconButton, Paper, Stack, TextField, Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import { tokens } from '@/theme/tokens';

const { colors, motion, typography, layout } = tokens;
const location = getLocation('malaga');

export default function SalasDeReunion() {
  const { t } = useTranslation();
  const { setRooms } = useCatalogRooms();
  const router = useRouter();
  const [centros, setCentros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [people, setPeople] = useState('');

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

    return spaces;
  }, [productos, centros, people]);

  const handleBookNow = useCallback(
    (space) => {
      const slug = (space.slug ?? '').toLowerCase();
      if (!slug) return;
      const query = {};
      if (checkIn) query.date = checkIn;
      if (timeFilter) query.time = timeFilter;
      router.push({ pathname: `/rooms/${slug}`, query });
    },
    [router, checkIn, timeFilter],
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
      <Head>
        <title>{location.seo.meetingRooms.title}</title>
        <meta name="description" content={location.seo.meetingRooms.description} />
        <link rel="canonical" href="https://be-working.com/malaga/salas-de-reunion" />
      </Head>

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
            component="h1"
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
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                label={t('home.when', 'Cuándo')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                variant="standard"
                type="time"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                label={t('home.time', 'Hora')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={filterFieldSx}
              />
            </Box>
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
    </>
  );
}
