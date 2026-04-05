'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box, Paper, Stack, Typography, Breadcrumbs, Link,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import ScrollReveal from '@/components/common/ScrollReveal';

const location = getLocation('malaga');

export default function Coworking() {
  const { t } = useTranslation();
  const { rooms, setRooms } = useCatalogRooms();
  const router = useRouter();
  const [centros, setCentros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [centrosData, productosData] = await Promise.all([
          fetchBookingCentros(),
          fetchBookingProductos({ centerCode: location.centerCode }),
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

        // Populate catalog store with desk room
        const centroLabel = mapped.find((c) => c.code === location.centerCode)?.label ?? 'Malaga Workspace';
        const mesas = (productosData || []).filter(isDeskProducto);
        const deskProducto = (productosData || []).find(isCanonicalDeskProducto);

        const storeRooms = [];
        if (deskProducto) {
          const deskRoom = buildRoomFromProducto(deskProducto, centroLabel);
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          storeRooms.push(deskRoom);
        } else if (mesas.length > 0) {
          const sample = mesas[0];
          const deskRoom = buildRoomFromProducto(
            { ...sample, name: 'MA1 Desks', capacity: mesas.length },
            centroLabel
          );
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          storeRooms.push(deskRoom);
        }
        setRooms(storeRooms);
      } catch {
        // keep empty on error
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [setRooms]);

  const deskCard = useMemo(() => {
    const mesas = productos.filter(isDeskProducto);
    if (mesas.length === 0) return null;

    const sample = mesas[0];
    const center = (sample.centerCode ?? sample.centroCodigo ?? '').trim();
    const matchingCentro = centros.find((c) => c.code === center.toUpperCase());
    const matchingRoom = rooms.find((room) => (room.slug ?? '').toLowerCase() === 'ma1-desks');

    return {
      id: `desks-${center.toUpperCase() || 'ma1'}`,
      name: matchingRoom?.name || 'MA1 Desks',
      description: matchingRoom?.description || `${mesas.length} desk${mesas.length === 1 ? '' : 's'} available`,
      productName: 'MA1 Desks',
      slug: 'ma1-desks',
      type: 'desk',
      image: matchingRoom?.heroImage || sample.heroImage || '',
      capacity: matchingRoom?.capacity != null ? String(matchingRoom.capacity) : String(mesas.length),
      rating: 4.8,
      reviewCount: 0,
      price: matchingRoom?.priceFrom != null ? `€ ${matchingRoom.priceFrom}` : '€ 90',
      priceUnit: '/month',
      location: matchingCentro?.city || 'Malaga',
      tags: matchingRoom?.tags || [],
      instantBooking: true,
      centroCode: center || undefined,
      availableCount: mesas.length,
      centerName: matchingCentro?.label || undefined,
      isBookable: true,
    };
  }, [productos, centros, rooms]);

  const handleBookNow = useCallback(
    (space) => {
      const slug = (space.slug ?? '').toLowerCase();
      if (!slug) return;
      router.push({ pathname: `/rooms/${slug}` });
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>{location.seo.coworking.title}</title>
        <meta name="description" content={location.seo.coworking.description} />
        <link rel="canonical" href="https://be-working.com/malaga/coworking" />
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
                {t('locations.services.coworking', 'Coworking')}
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
              {t('locations.malaga.coworkingTitle', 'Coworking en')}
              <Box component="span" sx={{ color: 'primary.main' }}> Malaga.</Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.65,
                color: 'text.secondary', maxWidth: 520, mx: 'auto',
              }}
            >
              {t('locations.malaga.coworkingSubtitle', 'Escritorios flexibles en un entorno profesional. Sin permanencia.')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: { xs: 4, md: 6 } }}>
          {deskCard ? (
            <Box
              sx={{
                width: '100%', display: 'grid',
                gap: (theme) => theme.spacing(3),
                gridTemplateColumns: {
                  xs: 'repeat(1, minmax(0, 1fr))',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                alignItems: 'stretch',
              }}
            >
              <SpaceCard space={deskCard} onBookNow={handleBookNow} />
            </Box>
          ) : !loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                {t('locations.noSpacesAvailable', 'No hay espacios disponibles en este momento.')}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
