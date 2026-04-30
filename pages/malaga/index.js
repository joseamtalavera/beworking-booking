import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography, layout } = tokens;
const location = getLocation('malaga');

const SERVICE_CARDS = [
  {
    slug: 'oficina-virtual',
    number: '01',
    brand: 'BeWorking',
    accent: 'Virtual',
    descEs: 'Domicilio fiscal y legal, recepción de correo y acceso a BeWorkingApp. Desde 15€/mes.',
    descEn: 'Legal & fiscal address, mail reception and full BeWorkingApp access. From €15/month.',
  },
  {
    slug: 'coworking',
    number: '02',
    brand: 'BeWorking',
    accent: 'Desks',
    descEs: 'Escritorios flexibles, sin permanencia. Fijo desde 90€/mes o día suelto desde 10€/día.',
    descEn: 'Flexible desks, no commitment. Dedicated from €90/month or day pass from €10/day.',
  },
  {
    slug: 'salas-de-reunion',
    number: '03',
    brand: 'BeWorking',
    accent: 'Rooms',
    descEs: 'Salas equipadas para reuniones, formación o eventos. Reserva por horas, desde 5€/h.',
    descEn: 'Equipped rooms for meetings, training or events. Book by the hour, from €5/h.',
  },
];

export default function MalagaHub() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

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

  return (
    <>
      <Head>
        <title>{location.seo.city.title}</title>
        <meta name="description" content={location.seo.city.description} />
        <link rel="canonical" href="https://be-working.com/malaga" />
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
            {isEs ? 'Ciudad' : 'City'} · {location.displayName}
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
            {isEs ? 'Tu sede flexible' : 'Your flexible base'}
            <Box component="span" sx={{ color: colors.brand, display: 'block' }}>
              {isEs ? `en ${location.displayName}.` : `in ${location.displayName}.`}
            </Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 540, mx: 'auto' }}>
            {isEs
              ? 'Coworking, salas de reunión y oficina virtual en el centro de Málaga.'
              : 'Coworking, meeting rooms and virtual office in central Málaga.'}
          </Typography>
        </Box>
      </Box>

      {/* Service cards */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
            }}
          >
            {SERVICE_CARDS.map((service) => (
              <Box
                key={service.slug}
                component={NextLink}
                href={`/malaga/${service.slug}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  bgcolor: colors.bg,
                  borderRadius: `${radius.lg}px`,
                  border: `1px solid ${colors.line}`,
                  p: { xs: 3, md: 4 },
                  transition: `transform ${motion.duration} ${motion.ease}, box-shadow ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 24px 60px -28px rgba(0,0,0,0.18)',
                    borderColor: colors.brand,
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.brand, letterSpacing: '0.02em', mb: 2.5 }}>
                  {service.number}
                </Typography>
                <Box
                  component="h3"
                  sx={{
                    ...typography.h3,
                    color: colors.ink,
                    fontFamily: typography.fontFamily,
                    fontFeatureSettings: typography.fontFeatureSettings,
                    m: 0,
                  }}
                >
                  {service.brand}
                  <Box component="span" sx={{ color: colors.brand }}>{service.accent}</Box>
                </Box>
                <Typography sx={{ ...typography.body, color: colors.ink2, mt: 2, flex: 1 }}>
                  {isEs ? service.descEs : service.descEn}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: colors.brand, mt: 3 }}>
                  {isEs ? 'Explorar →' : 'Explore →'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Location */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bg,
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 5 },
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <Box
          sx={{
            maxWidth: layout.maxWidth,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              borderRadius: `${radius.lg}px`,
              overflow: 'hidden',
              height: { xs: 280, md: 380 },
              border: `1px solid ${colors.line}`,
            }}
          >
            <iframe
              title="BeWorking Málaga"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${location.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                ...typography.eyebrow,
                color: colors.brand,
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {isEs ? 'Localización' : 'Location'}
            </Typography>
            <Box
              component="h2"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
              }}
            >
              {isEs ? 'Nuestro espacio en Málaga.' : 'Our space in Málaga.'}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 4 }}>
              <LocationOnIcon sx={{ fontSize: 20, color: colors.brand, mt: 0.25, flexShrink: 0 }} />
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {location.address}, {location.zip}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 1.5 }}>
              <AccessTimeIcon sx={{ fontSize: 20, color: colors.brand, mt: 0.25, flexShrink: 0 }} />
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>{location.hours}</Typography>
            </Box>
            <Button
              variant="contained"
              component="a"
              href="https://wa.me/34640369759?text=Hola,%20me%20interesa%20información%20sobre%20BeWorking%20Málaga"
              target="_blank"
              rel="noopener noreferrer"
              disableElevation
              sx={{
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 3.5,
                py: 1.4,
                mt: 4,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {isEs ? 'Contactar' : 'Get in touch'}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
