'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Seo from '@/seo/Seo';
import { Box, Typography } from '@mui/material';
import {
  useCatalogRooms,
  buildDeskRooms,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import { tokens } from '@/theme/tokens';
import { trackWhatsappClicked } from '@/utils/analytics';

const { colors, motion, typography, layout, radius } = tokens;
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
        setRooms(buildDeskRooms(productosData, centroLabel));
      } catch {
        // keep empty on error
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [setRooms]);

  // One catalog card per coworking zone bookable today (the summer A5 zone
  // appears only during its window). Derived from the store's desk rooms so a
  // second zone never inflates the first one's desk count.
  const deskCards = useMemo(() => {
    const matchingCentro = centros.find((c) => c.code === location.centerCode);
    return rooms
      .filter((room) => room.deskPrefix)
      .map((room) => ({
        id: room.slug,
        name: room.name,
        description: room.description || `${room.capacity} desk${room.capacity === 1 ? '' : 's'} available`,
        productName: room.productName,
        slug: room.slug,
        type: 'desk',
        image: room.heroImage || '',
        capacity: room.capacity != null ? String(room.capacity) : '',
        rating: 4.8,
        reviewCount: 0,
        // Catalog card shows the day-pass entry price; monthly fixed-desk
        // pricing surfaces in the booking flow itself.
        price: '€ 10',
        priceUnit: '/day',
        location: matchingCentro?.city || 'Malaga',
        tags: room.tags || [],
        instantBooking: true,
        centroCode: location.centerCode,
        availableCount: room.capacity,
        centerName: matchingCentro?.label || undefined,
        isBookable: true,
      }));
  }, [rooms, centros]);

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
      <Seo
        title={location.seo.coworking.title}
        description={location.seo.coworking.description}
        canonical="https://be-working.com/malaga/coworking"
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
            {t('locations.services.coworking', 'Coworking')} · Málaga
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
            BeWorking<Box component="span" sx={{ color: colors.brand }}>Desks</Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 560, mx: 'auto' }}>
            {t(
              'home.evolved.coworking.subtitle',
              'Escritorios flexibles, sin permanencia. Fijo desde 90€/mes o día suelto desde 10€/día.',
            )}
          </Typography>

          <Box
            component="a"
            href="https://wa.me/34640369759?text=Hola,%20necesito%20ayuda%20con%20un%20escritorio%20de%20coworking"
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsappClicked({ source: 'malaga-coworking' })}
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
          {deskCards.length > 0 ? (
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
              {deskCards.map((card) => (
                <SpaceCard key={card.id} space={card} onBookNow={handleBookNow} />
              ))}
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
