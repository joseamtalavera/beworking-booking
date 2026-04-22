'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Button, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { useTranslation } from 'react-i18next';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
      }}
    >
      {children}
    </Box>
  );
}

function BigImage({ src, alt, aspect, fit = 'cover' }) {
  const aspectRatio = aspect || '3 / 2';
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.25)',
        bgcolor: '#f0f0f0',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          display: 'block',
        }}
      />
    </Box>
  );
}

function PricingSection({
  id, eyebrow, brand, brandNumber, headline, subhead, highlights, cta, href,
  image, imageAlt, reverse = false, bgColor = '#ffffff',
}) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        bgcolor: bgColor,
        py: { xs: 10, md: 14 },
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '4fr 6fr' },
          gap: { xs: 5, md: 8 },
          alignItems: 'center',
          direction: { md: reverse ? 'rtl' : 'ltr' },
          '& > *': { direction: 'ltr' },
        }}
      >
        <Reveal>
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'primary.main',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {eyebrow}
            </Typography>

            <Box
              component="h2"
              sx={{
                margin: 0,
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              <span>{brand}</span>
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  ml: '0.04em',
                }}
              >
                {brandNumber}
              </Box>
            </Box>

            <Typography
              component="p"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.1875rem' },
                fontWeight: 500,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                color: 'text.primary',
                mt: 2,
              }}
            >
              {headline}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.0625rem' },
                lineHeight: 1.65,
                color: 'text.secondary',
                mt: 2,
              }}
            >
              {subhead}
            </Typography>

            {highlights && highlights.length > 0 && (
              <Box sx={{ mt: 3 }}>
                {highlights.map((h) => (
                  <Stack key={h} direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 1.25 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'primary.main', mt: '2px', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'text.primary' }}>
                      {h}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                component={NextLink}
                href={href}
                variant="contained"
                sx={{
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.35,
                  fontSize: '0.9375rem',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                }}
              >
                {cta}
              </Button>
            </Box>
          </Box>
        </Reveal>

        <Reveal delay={0.1}>
          <BigImage src={image} alt={imageAlt} />
        </Reveal>
      </Box>
    </Box>
  );
}

function SimpleSection({
  id, eyebrow, headline, headlineAccent, subhead, highlights, cta, href,
  image, imageAlt, reverse = false, bgColor = '#ffffff',
}) {
  return (
    <Box component="section" id={id} sx={{ bgcolor: bgColor, py: { xs: 10, md: 14 }, px: 3 }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '4fr 6fr' },
          gap: { xs: 5, md: 8 },
          alignItems: 'center',
          direction: { md: reverse ? 'rtl' : 'ltr' },
          '& > *': { direction: 'ltr' },
        }}
      >
        <Reveal>
          <Box sx={{ maxWidth: 520 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'primary.main', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
              {eyebrow}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'text.primary',
              }}
            >
              {headline}
              {headlineAccent && (
                <> <Box component="span" sx={{ color: 'primary.main' }}>{headlineAccent}</Box></>
              )}
            </Typography>
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, color: 'text.secondary', mt: 3, maxWidth: 500 }}>
              {subhead}
            </Typography>
            {highlights && highlights.length > 0 && (
              <Box sx={{ mt: 3 }}>
                {highlights.map((h) => (
                  <Stack key={h} direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 1.25 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'primary.main', mt: '2px', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'text.primary' }}>{h}</Typography>
                  </Stack>
                ))}
              </Box>
            )}
            <Box sx={{ mt: 4 }}>
              <Button
                component={NextLink}
                href={href}
                variant="contained"
                sx={{
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.35,
                  fontSize: '0.9375rem',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                }}
              >
                {cta}
              </Button>
            </Box>
          </Box>
        </Reveal>
        <Reveal delay={0.1}>
          <BigImage src={image} alt={imageAlt} />
        </Reveal>
      </Box>
    </Box>
  );
}

function SuperAppSection({ id, eyebrow, headline, headlineAccent, subhead, body, cta, href, image, imageAlt, imageAspect, imageFit, bgColor = '#ffffff' }) {
  return (
    <Box component="section" id={id} sx={{ bgcolor: bgColor, py: { xs: 10, md: 14 }, px: 3 }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 5, md: 10 },
          alignItems: 'center',
        }}
      >
        <Reveal>
          <Box sx={{ maxWidth: 520 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'primary.main', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
              {eyebrow}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'text.primary',
              }}
            >
              {headline}{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>{headlineAccent}</Box>
            </Typography>
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, color: 'text.secondary', mt: 3 }}>
              {subhead}
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'text.secondary', mt: 2.5 }}>
              {body}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={NextLink}
                href={href}
                variant="contained"
                sx={{
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.35,
                  fontSize: '0.9375rem',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                }}
              >
                {cta}
              </Button>
            </Box>
          </Box>
        </Reveal>
        <Reveal delay={0.1}>
          <BigImage src={image} alt={imageAlt} aspect={imageAspect} fit={imageFit} />
        </Reveal>
      </Box>
    </Box>
  );
}

function FinalCtaStrip({ eyebrow, headline, subhead, cta }) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#ffffff',
        py: { xs: 10, md: 14 },
        px: 3,
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Reveal>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'primary.main', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
            {eyebrow}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'text.primary',
            }}
          >
            {headline}
          </Typography>
          <Typography sx={{ fontSize: '1.0625rem', color: 'text.secondary', mt: 2.5, maxWidth: 540, mx: 'auto' }}>
            {subhead}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={NextLink}
              href="/spaces"
              variant="contained"
              sx={{
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.35,
                fontSize: '0.9375rem',
                bgcolor: 'primary.main',
                color: '#fff',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
              }}
            >
              {cta}
            </Button>
          </Box>
        </Box>
      </Reveal>
    </Box>
  );
}

export default function HomePage() {
  const { t } = useTranslation();

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const quickNav = [
    { id: 'oficina15', labelKey: 'home.apple.quickNavOficina15', icon: <BusinessRoundedIcon fontSize="small" /> },
    { id: 'oficina90', labelKey: 'home.apple.quickNavOficina90', icon: <DeskRoundedIcon fontSize="small" /> },
    { id: 'salas', labelKey: 'home.apple.quickNavMeetingRooms', icon: <MeetingRoomRoundedIcon fontSize="small" /> },
    { id: 'superapp', labelKey: 'home.apple.quickNavSuperapp', icon: <DashboardRoundedIcon fontSize="small" /> },
  ];

  const oficina15Highlights = t('home.apple.oficina15.highlights', { returnObjects: true });
  const oficina90Highlights = t('home.apple.oficina90.highlights', { returnObjects: true });
  const salasHighlights = t('home.apple.salas.highlights', { returnObjects: true });

  return (
    <>
      <Head>
        <title>BeWorking — Oficina15, Oficina90, salas y SuperApp en Málaga</title>
        <meta
          name="description"
          content="BeWorking: Oficina Virtual desde 15€, Coworking desde 90€, salas de formación y reunión por horas, y SuperApp incluida. Todo en Málaga."
        />
        <link rel="canonical" href="https://be-working.com" />
      </Head>

      {/* HERO */}
      <Box
        component="header"
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: 10, md: 14 },
          pb: { xs: 6, md: 8 },
          px: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'primary.main',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {t('home.apple.heroBrand')}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: 'text.primary',
            }}
          >
            {t('home.apple.heroTitle')}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {t('home.apple.heroTitleAccent')}
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.65,
              color: 'text.secondary',
              mt: 3,
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            {t('home.apple.heroSubtitle')}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 5 }}
          >
            {quickNav.map((n) => (
              <Button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                startIcon={n.icon}
                variant="outlined"
                sx={{
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2.5,
                  py: 0.875,
                  color: 'primary.main',
                  borderColor: 'rgba(0,150,36,0.3)',
                  bgcolor: 'rgba(0,150,36,0.04)',
                  '& .MuiButton-startIcon': { color: 'primary.main' },
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiButton-startIcon': { color: '#fff' },
                  },
                }}
              >
                {t(n.labelKey)}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Section 1: Oficina15 (Virtual Office) */}
      <PricingSection
        id="oficina15"
        eyebrow={t('home.apple.oficina15.eyebrow')}
        brand={t('home.apple.oficina15.brand')}
        brandNumber={t('home.apple.oficina15.brandNumber')}
        headline={t('home.apple.oficina15.headline')}
        subhead={t('home.apple.oficina15.subhead')}
        highlights={Array.isArray(oficina15Highlights) ? oficina15Highlights : []}
        cta={t('home.apple.oficina15.cta')}
        href="/malaga/oficina-virtual"
        image="/DSC_2312 (Mediano)_optimized.webp"
        imageAlt="Oficina Virtual BeWorking — sala A1 en Málaga"
        bgColor="#ffffff"
      />

      {/* Section 2: Oficina90 (Coworking) */}
      <PricingSection
        id="oficina90"
        eyebrow={t('home.apple.oficina90.eyebrow')}
        brand={t('home.apple.oficina90.brand')}
        brandNumber={t('home.apple.oficina90.brandNumber')}
        headline={t('home.apple.oficina90.headline')}
        subhead={t('home.apple.oficina90.subhead')}
        highlights={Array.isArray(oficina90Highlights) ? oficina90Highlights : []}
        cta={t('home.apple.oficina90.cta')}
        href="/malaga/coworking"
        image="/DSC_2281 (Mediano)_optimized.webp"
        imageAlt="Coworking BeWorking — escritorios en Málaga"
        reverse
        bgColor="#f5f5f7"
      />

      {/* Section 3: Salas */}
      <SimpleSection
        id="salas"
        eyebrow={t('home.apple.salas.eyebrow')}
        headline={t('home.apple.salas.headline')}
        headlineAccent={t('home.apple.salas.headlineAccent')}
        subhead={t('home.apple.salas.subhead')}
        highlights={Array.isArray(salasHighlights) ? salasHighlights : []}
        cta={t('home.apple.salas.cta')}
        href="/malaga/salas-de-reunion"
        image="/DSC_2684_optimized.webp"
        imageAlt="Salas de formación y reunión BeWorking Málaga"
        bgColor="#ffffff"
      />

      {/* Section 4: SuperApp */}
      <SuperAppSection
        id="superapp"
        eyebrow={t('home.apple.superapp.eyebrow')}
        headline={t('home.apple.superapp.headline')}
        headlineAccent={t('home.apple.superapp.headlineAccent')}
        subhead={t('home.apple.superapp.subhead')}
        body={t('home.apple.superapp.body')}
        cta={t('home.apple.superapp.cta')}
        href="/platform"
        image="/platform/oveview.png"
        imageAlt="BeWorking SuperApp — Overview del dashboard"
        imageFit="cover"
        bgColor="#f5f5f7"
      />

      <FinalCtaStrip
        eyebrow={t('home.apple.finalCta.eyebrow')}
        headline={t('home.apple.finalCta.headline')}
        subhead={t('home.apple.finalCta.subhead')}
        cta={t('home.apple.finalCta.cta')}
      />
    </>
  );
}
