import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const Frame = ({ sx, children, lifted = false, ...rest }) => (
  <Box
    sx={{
      position: 'absolute',
      bgcolor: colors.bg,
      border: `1px solid ${colors.line}`,
      borderRadius: `${radius.xl}px`,
      boxShadow: lifted ? shadow.frameLift : shadow.frame,
      overflow: 'hidden',
      transition: `transform ${motion.duration} ${motion.ease}, box-shadow ${motion.duration} ${motion.ease}`,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadow.frameLift,
      },
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Box>
);

// --- Mockup: Virtual office address card ---
const VirtualOfficeMockup = ({ t }) => (
  <Box sx={{ p: 1.75, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: colors.brandSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: colors.brand }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.ink, lineHeight: 1.1 }}>
          {t('home.evolved.hero.mockVirtualOffice.title')}
        </Typography>
        <Typography sx={{ fontSize: '0.6rem', color: colors.ink3 }}>
          {t('home.evolved.hero.mockVirtualOffice.subtitle')}
        </Typography>
      </Box>
    </Stack>
    <Box sx={{ mt: 1.25, flex: 1 }}>
      <Typography sx={{ fontSize: '0.72rem', color: colors.ink, lineHeight: 1.45 }}>
        {t('home.evolved.hero.mockVirtualOffice.address1')}
      </Typography>
      <Typography sx={{ fontSize: '0.72rem', color: colors.ink, lineHeight: 1.45 }}>
        {t('home.evolved.hero.mockVirtualOffice.address2')}
      </Typography>
      <Typography sx={{ fontSize: '0.65rem', color: colors.ink3, lineHeight: 1.45 }}>
        {t('home.evolved.hero.mockVirtualOffice.country')}
      </Typography>
    </Box>
    <Stack direction="row" spacing={0.65}>
      <Box
        sx={{
          px: 1,
          py: 0.4,
          fontSize: '0.6rem',
          fontWeight: 600,
          color: colors.bg,
          bgcolor: colors.brand,
          borderRadius: `${radius.pill}px`,
        }}
      >
        {t('home.evolved.hero.mockVirtualOffice.ctaDirections')}
      </Box>
      <Box
        sx={{
          px: 1,
          py: 0.4,
          fontSize: '0.6rem',
          fontWeight: 600,
          color: colors.brand,
          bgcolor: colors.bg,
          border: `1px solid ${colors.brandSoft}`,
          borderRadius: `${radius.pill}px`,
        }}
      >
        {t('home.evolved.hero.mockVirtualOffice.ctaCall')}
      </Box>
    </Stack>
  </Box>
);

// --- Mockup: Servicios toggle list ---
const ServicesMockup = ({ t }) => {
  const items = t('home.evolved.hero.mockServices.items', { returnObjects: true });
  const itemsArr = Array.isArray(items) ? items : ['Domicilio Fiscal', 'CRM', 'Contabilidad', 'Legal'];
  const rows = itemsArr.map((label, i) => ({ label, on: i < 3 }));
  return (
    <Box sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: colors.ink, lineHeight: 1.1 }}>
        {t('home.evolved.hero.mockServices.title')}
      </Typography>
      <Typography sx={{ fontSize: '0.55rem', color: colors.ink3, mt: 0.25, mb: 0.85 }}>
        {t('home.evolved.hero.mockServices.subtitle')}
      </Typography>
      <Stack spacing={0.45} sx={{ flex: 1 }}>
        {rows.map(({ label, on }) => (
          <Box
            key={label}
            sx={{
              px: 0.9,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: on ? colors.brandSoft : colors.bg,
              border: `1px solid ${on ? colors.brandSoft : colors.line}`,
              borderRadius: `${radius.sm}px`,
            }}
          >
            <Typography sx={{ fontSize: '0.65rem', fontWeight: on ? 600 : 500, color: colors.ink }}>
              {label}
            </Typography>
            <Box
              sx={{
                width: 22,
                height: 12,
                borderRadius: 999,
                bgcolor: on ? colors.brand : 'rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: on ? 'flex-end' : 'flex-start',
                px: '2px',
                flexShrink: 0,
              }}
            >
              <Box sx={{ width: 8, height: 8, bgcolor: colors.bg, borderRadius: '50%' }} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const HeroEvolved = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        position: 'relative',
        bgcolor: colors.bg,
        pt: { xs: 8, md: 14 },
        pb: { xs: 10, md: 16 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth,
          mx: 'auto',
          px: { xs: 3, md: 5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'center',
        }}
      >
        {/* Left column: copy */}
        <Stack
          spacing={3}
          sx={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Typography sx={{ ...typography.eyebrow, color: colors.brand }}>
            {t('home.evolved.eyebrow', 'BeWorking')}
          </Typography>

          <Typography
            component="h1"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              maxWidth: 720,
            }}
          >
            {t('home.evolved.titleMain', 'Tu oficina, tu sala, tu día —')}{' '}
            <Box component="span" sx={{ color: colors.brand }}>
              {t('home.evolved.titleAccent', 'listos en un clic.')}
            </Box>
          </Typography>

          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, maxWidth: 560 }}>
            {t(
              'home.evolved.subtitle',
              'BeWorking — la plataforma de oficinas flexibles. Coworking, salas y dirección fiscal en tu ciudad, sin papeleo.',
            )}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              component={NextLink}
              href="/spaces"
              variant="contained"
              size="large"
              sx={{
                bgcolor: colors.brand,
                color: colors.bg,
                px: 3.5,
                py: 1.4,
                borderRadius: `${radius.pill}px`,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {t('home.evolved.ctaPrimary', 'Reservar ahora')}
            </Button>
            <Button
              component={NextLink}
              href="/malaga/oficina-virtual"
              variant="text"
              size="large"
              sx={{
                color: colors.ink,
                px: 2.5,
                py: 1.4,
                borderRadius: `${radius.pill}px`,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: colors.bgSoft },
              }}
            >
              {t('home.evolved.ctaSecondary', 'Ver oficinas virtuales →')}
            </Button>
          </Stack>
        </Stack>

        {/* Right column: overlapping product collage (md+ only) */}
        <Box
          sx={{
            position: 'relative',
            display: { xs: 'none', md: 'block' },
            height: 520,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : `translateY(${motion.revealOffset + 8}px)`,
            transition: `opacity 1s ${motion.ease} 0.1s, transform 1s ${motion.ease} 0.1s`,
          }}
        >
          {/* Frame 1: Espacios booking grid — real screenshot */}
          <Frame sx={{ top: 0, left: 0, width: '78%', height: '70%' }}>
            <Box
              component="img"
              src="/hero/spaces.png"
              alt={t('home.evolved.imgSpaces', 'Catálogo de espacios')}
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top left',
              }}
            />
          </Frame>

          {/* Frame 2: Virtual office card mockup */}
          <Frame lifted sx={{ top: '20%', right: 0, width: '46%', height: '38%' }}>
            <VirtualOfficeMockup t={t} />
          </Frame>

          {/* Frame 3: Servicios platform mockup */}
          <Frame sx={{ bottom: 0, right: '6%', width: '52%', height: '34%' }}>
            <ServicesMockup t={t} />
          </Frame>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroEvolved;
