import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const TABS = [
  { key: 'overview', icon: DashboardIcon, screenshot: '/platform/oveview.png' },
  { key: 'mailbox', label: 'businessAddress', icon: MailOutlineIcon, screenshot: '/platform/domicilio_fiscal.png' },
  { key: 'beSpaces', icon: PlaceOutlinedIcon, screenshot: '/platform/bespaces.png' },
  { key: 'automation', icon: AutoFixHighOutlinedIcon, screenshot: '/platform/automatizaciones.png', soon: true },
  { key: 'reports', icon: AssessmentOutlinedIcon, screenshot: '/platform/informes.png', soon: true },
];

const NAV_HEIGHT = 56;

const RevealBox = ({ children, sx, delay = 0 }) => {
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
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
        transition: `opacity ${motion.durationSlow} ${motion.ease} ${delay}s, transform ${motion.durationSlow} ${motion.ease} ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default function Platform() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef([]);
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

  const handleTabClick = (index) => {
    setActiveTab(index);
    const el = sectionRefs.current[index];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveTab(index);
          }
        });
      },
      { rootMargin: `-${NAV_HEIGHT + 32}px 0px -55% 0px`, threshold: 0 },
    );
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>{isEs ? 'BeWorkingApp — BeWorking' : 'BeWorkingApp — BeWorking'}</title>
        <meta
          name="description"
          content={isEs
            ? 'Una sola app para todo tu negocio. Herramientas integradas e integraciones — facturación, contactos, mailbox y más de 50 apps conectadas.'
            : 'One dashboard for every part of your business. Built-in tools and external integrations — invoicing, contacts, mailbox, and 50+ connected apps.'}
        />
        <link rel="canonical" href="https://be-working.com/platform" />
        <meta property="og:title" content="BeWorkingApp — BeWorking" />
        <meta property="og:description" content="One dashboard for every part of your business." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://be-working.com/platform" />
      </Head>

      {/* Hero */}
      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 7, md: 10 },
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
            {isEs ? 'Plataforma' : 'Platform'}
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
            BeWorking
            <Box component="span" sx={{ color: colors.brand, display: 'block' }}>App</Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 560, mx: 'auto' }}>
            {t('platform.hero.subheading')}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              component={NextLink}
              href="/register"
              disableElevation
              sx={{
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 3.5,
                py: 1.4,
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {t('platform.cta.button', isEs ? 'Empezar gratis' : 'Get started')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Sticky tabs */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.line}`,
          px: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            maxWidth: layout.maxWidth,
            mx: 'auto',
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            justifyContent: { xs: 'flex-start', md: 'center' },
            py: 1.5,
          }}
        >
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const tabLabel = tab.label || tab.key;
            const active = activeTab === i;
            return (
              <Box
                key={tab.key}
                role="button"
                tabIndex={0}
                onClick={() => handleTabClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleTabClick(i);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.85,
                  px: 2,
                  py: 0.75,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  borderRadius: `${radius.pill}px`,
                  bgcolor: active ? colors.brand : 'transparent',
                  color: active ? colors.bg : colors.ink2,
                  border: `1px solid ${active ? colors.brand : colors.line}`,
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  '&:hover': active ? {} : { borderColor: colors.brand, color: colors.brand },
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
                {t(`platform.tabs.${tabLabel}`)}
                {tab.soon && (
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      bgcolor: active ? 'rgba(255,255,255,0.2)' : colors.brandSoft,
                      color: active ? colors.bg : colors.brand,
                      borderRadius: `${radius.sm}px`,
                      px: 0.85,
                      py: 0.2,
                    }}
                  >
                    {isEs ? 'Pronto' : 'Soon'}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Feature sections */}
      {TABS.map((tab, index) => {
        const tabLabel = tab.label || tab.key;
        const isReverse = index % 2 === 1;
        return (
          <Box
            key={tab.key}
            component="section"
            ref={(el) => { sectionRefs.current[index] = el; }}
            sx={{
              bgcolor: index % 2 === 0 ? colors.bg : colors.bgSoft,
              py: { xs: 9, md: 13 },
              px: { xs: 3, md: 5 },
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
                direction: { md: isReverse ? 'rtl' : 'ltr' },
                '& > *': { direction: 'ltr' },
              }}
            >
              <RevealBox>
                <Typography
                  sx={{
                    ...typography.eyebrow,
                    color: colors.brand,
                    textTransform: 'uppercase',
                    mb: 2,
                  }}
                >
                  {String(index + 1).padStart(2, '0')} · {t(`platform.tabs.${tabLabel}`)}
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
                  {t(`platform.features.${tab.key}.heading`)}
                </Box>
                <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3 }}>
                  {t(`platform.features.${tab.key}.body`)}
                </Typography>
              </RevealBox>

              <RevealBox
                delay={0.1}
                sx={{
                  width: '100%',
                  borderRadius: `${radius.lg}px`,
                  overflow: 'hidden',
                  bgcolor: colors.bg,
                  border: `1px solid ${colors.line}`,
                  boxShadow: shadow.frame,
                }}
              >
                <Box
                  component="img"
                  src={tab.screenshot}
                  alt={t(`platform.tabs.${tabLabel}`)}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </RevealBox>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
