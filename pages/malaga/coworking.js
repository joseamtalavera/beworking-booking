'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Typography } from '@mui/material';
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
import { tokens } from '@/theme/tokens';

const { colors, motion, typography, layout } = tokens;
const location = getLocation('malaga');

export default function Coworking() {
  const { t } = useTranslation();
  const { rooms, setRooms } = useCatalogRooms();
  const router = useRouter();
  const [centros, setCentros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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
            centroLabel,
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
    [router],
  );

  return (
    <>
      <Head>
        <title>{location.seo.coworking.title}</title>
        <meta name="description" content={location.seo.coworking.description} />
        <link rel="canonical" href="https://be-working.com/malaga/coworking" />
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
            {t('locations.services.coworking', 'Coworking')} · Málaga
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
            BeWorking<Box component="span" sx={{ color: colors.brand }}>Desks</Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 560, mx: 'auto' }}>
            {t(
              'home.evolved.coworking.subtitle',
              'Escritorios flexibles, sin permanencia. Fijo desde 90€/mes o día suelto desde 10€/día.',
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
          {deskCard ? (
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gap: 3,
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
              <Typography sx={{ ...typography.bodyLg, color: colors.ink3 }}>
                {t('locations.noSpacesAvailable', 'No hay espacios disponibles en este momento.')}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
