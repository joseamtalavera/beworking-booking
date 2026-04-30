'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';
import HeroEvolved from '@/components/home/HeroEvolved';
import EvolvedHowItWorks from '@/components/home/EvolvedHowItWorks';
import EvolvedSection from '@/components/home/EvolvedSection';
import EvolvedSectionShowcase from '@/components/home/EvolvedSectionShowcase';
import EvolvedFaqTeaser from '@/components/home/EvolvedFaqTeaser';

function FinalCtaStrip({ eyebrow, headline, subhead, cta }) {
  const { colors, radius, motion, typography, layout } = tokens;
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        bgcolor: colors.brandSoft,
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 5 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
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
          {eyebrow}
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
          {headline}
        </Box>
        <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 2.5, maxWidth: 540, mx: 'auto' }}>
          {subhead}
        </Typography>
        <Box sx={{ mt: 4 }}>
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
            {cta}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function HomePage() {
  const { t } = useTranslation();

  const safeArray = (key, fallback = []) => {
    const v = t(key, { returnObjects: true });
    return Array.isArray(v) ? v : fallback;
  };
  const safeObject = (key, fallback = {}) => {
    const v = t(key, { returnObjects: true });
    return v && typeof v === 'object' && !Array.isArray(v) ? v : fallback;
  };

  return (
    <>
      <Head>
        <title>{t('home.evolved.meta.title')}</title>
        <meta name="description" content={t('home.evolved.meta.description')} />
        <link rel="canonical" href="https://be-working.com" />
      </Head>

      {/* HERO */}
      <HeroEvolved />

      <EvolvedHowItWorks />

      {/* Section 1: BeWorkingVirtual (Virtual Office) — Showcase */}
      <EvolvedSectionShowcase
        id="oficina15"
        eyebrow={t('home.apple.oficina15.eyebrow')}
        brand={t('home.apple.oficina15.brand')}
        brandNumber={t('home.apple.oficina15.brandNumber')}
        headline={t('home.apple.oficina15.headline')}
        subhead={t('home.apple.oficina15.subhead')}
        cta={t('home.apple.oficina15.cta')}
        href="/malaga/oficina-virtual"
        image="/DSC_2312 (Mediano)_optimized.webp"
        imageAlt={t('home.evolved.oficina15.imageAlt')}
        statusCard={safeObject('home.evolved.oficina15.statusCard')}
        price={safeObject('home.evolved.oficina15.price')}
        features={safeArray('home.evolved.oficina15.features')}
      />

      {/* Section 2: BeWorkingDesk (Coworking) — Showcase, zigzag */}
      <EvolvedSectionShowcase
        id="oficina90"
        tone="soft"
        reverse
        eyebrow={t('home.apple.oficina90.eyebrow')}
        brand={t('home.apple.oficina90.brand')}
        brandNumber={t('home.apple.oficina90.brandNumber')}
        headline={t('home.apple.oficina90.headline')}
        subhead={t('home.apple.oficina90.subhead')}
        cta={t('home.apple.oficina90.cta')}
        href="/malaga/coworking"
        image="/DSC_2281 (Mediano)_optimized.webp"
        imageAlt={t('home.evolved.oficina90.imageAlt')}
        presence={safeObject('home.evolved.oficina90.presence')}
        schedule={(() => {
          const sched = safeObject('home.evolved.oficina90.schedule');
          const dayLetters = Array.isArray(sched.days) ? sched.days : ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
          return {
            title: sched.title,
            priceLabel: sched.priceLabel,
            days: dayLetters.map((letter) => ({ letter, active: true })),
          };
        })()}
        features={safeArray('home.evolved.oficina90.features')}
      />

      {/* Section 3: BeWorkingRoom — Showcase, zigzag back */}
      <EvolvedSectionShowcase
        id="salas"
        tone="white"
        eyebrow={t('home.apple.salas.eyebrow')}
        brand={t('home.apple.salas.brand')}
        brandNumber={t('home.apple.salas.brandNumber')}
        headline={t('home.apple.salas.headline')}
        subhead={t('home.apple.salas.subhead')}
        cta={t('home.apple.salas.cta')}
        href="/malaga/salas-de-reunion"
        image="https://beworking-uploads-eu.s3.eu-north-1.amazonaws.com/catalog/5f9372c0-d1f4-4417-8deb-62654211e902-BEWORKING%2001.jpg"
        imageAlt={t('home.evolved.salas.imageAlt')}
        bookingGridMock
        price={safeObject('home.evolved.salas.price')}
        features={safeArray('home.evolved.salas.features')}
      />

      {/* Section 4: BeWorkingApp — Showcase, zigzag */}
      <EvolvedSectionShowcase
        id="superapp"
        tone="soft"
        reverse
        eyebrow={t('home.apple.superapp.eyebrow')}
        brand={t('home.apple.superapp.brand')}
        brandNumber={t('home.apple.superapp.brandNumber')}
        headline={t('home.apple.superapp.headline')}
        subhead={t('home.apple.superapp.subhead')}
        body={t('home.apple.superapp.body')}
        cta={t('home.apple.superapp.cta')}
        href="/platform"
        image="/platform/oveview.png"
        imageAlt={t('home.evolved.superapp.imageAlt')}
        imageAspect="1264 / 921"
        imageFit="contain"
        features={safeArray('home.evolved.superapp.features')}
      />

      <EvolvedFaqTeaser />

      <FinalCtaStrip
        eyebrow={t('home.apple.finalCta.eyebrow')}
        headline={t('home.apple.finalCta.headline')}
        subhead={t('home.apple.finalCta.subhead')}
        cta={t('home.apple.finalCta.cta')}
      />
    </>
  );
}
