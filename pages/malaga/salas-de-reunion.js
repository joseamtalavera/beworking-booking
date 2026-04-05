'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box, IconButton, Paper, Stack, TextField, Typography, Breadcrumbs, Link,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import ScrollReveal from '@/components/common/ScrollReveal';

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

  // Load centros + productos
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

        // Populate catalog store
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
    [router, checkIn, timeFilter]
  );

  return (
    <>
      <Head>
        <title>{location.seo.meetingRooms.title}</title>
        <meta name="description" content={location.seo.meetingRooms.description} />
        <link rel="canonical" href="https://be-working.com/malaga/salas-de-reunion" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Hero */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            pt: { xs: 6, md: 10 },
            pb: { xs: 5, md: 8 },
            px: 3,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ justifyContent: 'center', display: 'flex', mb: 3 }}>
              <Link component={NextLink} href="/malaga" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Malaga
              </Link>
              <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                {t('locations.services.meetingRooms', 'Salas de Reunion')}
              </Typography>
            </Breadcrumbs>
            <Typography
              sx={{
                fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
                letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2,
              }}
            >
              BeSpaces
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.035em',
                color: 'text.primary', mb: 2,
              }}
            >
              {t('locations.malaga.meetingRoomsTitle', 'Salas de reunion en')}
              <Box component="span" sx={{ color: 'primary.main' }}> Malaga.</Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.65,
                color: 'text.secondary', maxWidth: 520, mx: 'auto',
              }}
            >
              {t('locations.malaga.meetingRoomsSubtitle', 'Espacios equipados para tus reuniones profesionales. Reserva por horas.')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, pt: 4 }}>
          {/* Search Bar */}
          <Paper
            elevation={0}
            sx={{
              mb: 3, border: '1px solid', borderColor: 'divider',
              backgroundColor: 'background.paper',
              display: 'flex', alignItems: 'center', overflow: 'hidden',
              boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
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
                label={t('home.when', 'Cuando')}
                fullWidth
                slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: checkIn ? 'text.primary' : 'text.secondary', py: 0.25 },
                }}
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
                sx={{
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: timeFilter ? 'text.primary' : 'text.secondary', py: 0.25 },
                }}
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
                  '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                  '& .MuiInput-input': { fontSize: '0.875rem', color: people ? 'text.primary' : 'text.secondary', py: 0.25 },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
                  '& input[type=number]': { MozAppearance: 'textfield' },
                }}
              />
            </Box>
            <Box sx={{ px: { xs: 2, sm: 1.5 }, py: { xs: 1.5, sm: 0 }, width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label={t('home.searchSpaces', 'Buscar')}
                sx={{
                  bgcolor: 'primary.main', color: 'common.white',
                  width: 44, height: 44,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <SearchRoundedIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* Results */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t(filteredSpaces.length === 1 ? 'home.showingSpace' : 'home.showingSpaces', { count: filteredSpaces.length })}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: '100%', display: 'grid',
              gap: (theme) => theme.spacing(3),
              gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              alignItems: 'stretch', pb: 6,
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
