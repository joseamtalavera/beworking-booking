'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Button } from '@mui/material';
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      }}
    >
      {children}
    </Box>
  );
}

function FeatureSection({
  eyebrow, title, titleAccent, subhead, body, cta, href,
  image, imageAlt, dark = false, reverse = false,
}) {
  const bgColor = dark ? '#0a0a0a' : '#ffffff';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const subheadColor = dark ? 'rgba(255,255,255,0.78)' : 'text.secondary';
  const bodyColor = dark ? 'rgba(255,255,255,0.55)' : 'text.secondary';

  return (
    <Box
      component="section"
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 10, md: 12 },
        px: 3,
        borderTop: dark ? 'none' : '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          width: '100%',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
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
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: textColor,
              }}
            >
              {title}{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>{titleAccent}</Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                lineHeight: 1.55,
                color: subheadColor,
                mt: 3,
                maxWidth: 480,
              }}
            >
              {subhead}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: bodyColor,
                mt: 2.5,
                maxWidth: 480,
              }}
            >
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
                  px: 3.5,
                  py: 1.25,
                  fontSize: '0.9375rem',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                {cta}
              </Button>
            </Box>
          </Box>
        </Reveal>

        {image && (
          <Reveal delay={0.1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={image}
                alt={imageAlt || ''}
                loading="lazy"
                sx={{
                  width: '100%',
                  maxWidth: 480,
                  height: 'auto',
                  borderRadius: '16px',
                  objectFit: 'contain',
                  boxShadow: dark
                    ? '0 20px 60px rgba(0,0,0,0.6)'
                    : '0 20px 60px rgba(0,0,0,0.12)',
                }}
              />
            </Box>
          </Reveal>
        )}
      </Box>
    </Box>
  );
}

function SuperAppSection({ eyebrow, title, titleAccent, subhead, body, cta, href }) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#0a0a0a',
        color: '#fff',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 10, md: 14 },
        px: 3,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Reveal>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'primary.main',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {eyebrow}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#fff',
            }}
          >
            {title}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>{titleAccent}</Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.0625rem', md: '1.25rem' },
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.78)',
              mt: 3,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            {subhead}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.55)',
              mt: 2.5,
              maxWidth: 520,
              mx: 'auto',
            }}
          >
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
                '&:hover': { bgcolor: 'primary.dark' },
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

  return (
    <>
      <Head>
        <title>BeWorking — Espacios y software para tu empresa</title>
        <meta
          name="description"
          content="BeWorking: oficina virtual desde 15€, coworking desde 90€, salas de reunión por horas y SuperApp incluida. Todo en Málaga."
        />
        <link rel="canonical" href="https://be-working.com" />
      </Head>

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
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: 'text.primary',
            }}
          >
            {t('home.apple.heroTagline')}
          </Typography>
        </Box>
      </Box>

      <FeatureSection
        eyebrow={t('home.apple.oficinaVirtual.eyebrow')}
        title={t('home.apple.oficinaVirtual.title')}
        titleAccent={t('home.apple.oficinaVirtual.titleAccent')}
        subhead={t('home.apple.oficinaVirtual.subhead')}
        body={t('home.apple.oficinaVirtual.body')}
        cta={t('home.apple.oficinaVirtual.cta')}
        href="/malaga/oficina-virtual"
        image="/pilar1.2final_optimized.webp"
        imageAlt="Oficina Virtual BeWorking Málaga"
      />

      <FeatureSection
        eyebrow={t('home.apple.coworking.eyebrow')}
        title={t('home.apple.coworking.title')}
        titleAccent={t('home.apple.coworking.titleAccent')}
        subhead={t('home.apple.coworking.subhead')}
        body={t('home.apple.coworking.body')}
        cta={t('home.apple.coworking.cta')}
        href="/malaga/coworking"
        image="/pilar3final_optimized.webp"
        imageAlt="Coworking BeWorking Málaga"
        dark
        reverse
      />

      <FeatureSection
        eyebrow={t('home.apple.salas.eyebrow')}
        title={t('home.apple.salas.title')}
        titleAccent={t('home.apple.salas.titleAccent')}
        subhead={t('home.apple.salas.subhead')}
        body={t('home.apple.salas.body')}
        cta={t('home.apple.salas.cta')}
        href="/malaga/salas-de-reunion"
        image="/_MG_1541_optimized.webp"
        imageAlt="Salas de formación y reunión BeWorking Málaga"
      />

      <SuperAppSection
        eyebrow={t('home.apple.superapp.eyebrow')}
        title={t('home.apple.superapp.title')}
        titleAccent={t('home.apple.superapp.titleAccent')}
        subhead={t('home.apple.superapp.subhead')}
        body={t('home.apple.superapp.body')}
        cta={t('home.apple.superapp.cta')}
        href="/platform"
      />
    </>
  );
}
