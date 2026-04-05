import { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Typography, Button, Tabs, Tab, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/common/ScrollReveal';

const TABS = [
  { key: 'overview',       icon: DashboardIcon,            screenshot: '/platform/oveview.png',             i18nPrefix: 'platform' },
  { key: 'mailbox',        icon: MailOutlineIcon,           screenshot: '/platform/domicilio_fiscal.png',    i18nPrefix: 'platform', label: 'businessAddress' },
  { key: 'beSpaces',       icon: PlaceOutlinedIcon,         screenshot: '/platform/bespaces.png',            i18nPrefix: 'platform' },
  { key: 'automation',     icon: AutoFixHighOutlinedIcon,   screenshot: '/platform/automatizaciones.png',    i18nPrefix: 'platform', soon: true },
  { key: 'reports',        icon: AssessmentOutlinedIcon,    screenshot: '/platform/informes.png',            i18nPrefix: 'platform', soon: true },
];

const NAV_HEIGHT = 56;

export default function Platform() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef([]);

  const handleTabClick = (_, index) => {
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
      { rootMargin: `-${NAV_HEIGHT + 32}px 0px -55% 0px`, threshold: 0 }
    );
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Platform — BeWorking</title>
        <meta name="description" content="One dashboard for every part of your business. Built-in tools and external integrations — invoicing, contacts, mailbox, and 50+ connected apps." />
        <link rel="canonical" href="https://be-working.com/platform" />
        <meta property="og:title" content="Platform — BeWorking" />
        <meta property="og:description" content="One dashboard for every part of your business. Built-in tools and external integrations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://be-working.com/platform" />
      </Head>

      {/* Platform Hero */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: '80px', md: '112px' },
          pb: { xs: '64px', md: '80px' },
          px: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <ScrollReveal direction="up">
          <Typography
            sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}
          >
            {t('platform.hero.label')}
          </Typography>
          <Typography variant="h2" component="h1" sx={{ color: 'text.primary', maxWidth: 700, mx: 'auto', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, lineHeight: 1.15 }}>
            {t('platform.hero.heading')}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>{t('platform.hero.headingAccent')}</Box>
          </Typography>
          <Typography component="p" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto', mt: 4, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, display: 'block' }}>
            {t('platform.hero.subheading')}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              component={NextLink}
              href="/"
              sx={{ borderRadius: '999px', px: 4, py: 1.25, fontSize: '0.875rem' }}
            >
              {t('platform.cta.button')}
            </Button>
          </Box>
        </ScrollReveal>
      </Box>

      {/* Sticky nav */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          px: 3,
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabClick}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: NAV_HEIGHT,
              '& .MuiTabs-flexContainer': { justifyContent: { xs: 'flex-start', md: 'center' } },
              '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: 'text.secondary',
                minWidth: 'auto',
                minHeight: NAV_HEIGHT,
                px: 2.5,
                '&.Mui-selected': { color: 'text.primary', fontWeight: 500 },
              },
            }}
          >
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const tabLabel = tab.label || tab.key;
              return (
                <Tab
                  key={tab.key}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon sx={{ fontSize: 16 }} />
                      {t(`${tab.i18nPrefix}.tabs.${tabLabel}`)}
                      {tab.soon && (
                        <Chip label="Soon" size="small" sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600, bgcolor: 'rgba(0,150,36,0.08)', color: 'primary.main', borderRadius: '6px' }} />
                      )}
                    </Box>
                  }
                  value={i}
                />
              );
            })}
          </Tabs>
        </Box>
      </Box>

      {/* All sections */}
      {TABS.map((tab, index) => (
        <Box
          key={tab.key}
          ref={(el) => { sectionRefs.current[index] = el; }}
          sx={{
            bgcolor: index % 2 === 0 ? '#ffffff' : '#fafafa',
            py: { xs: '80px', md: '112px' },
            px: 3,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              maxWidth: 1100,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 10 },
              alignItems: 'center',
              direction: index % 2 === 0 ? 'ltr' : 'rtl',
            }}
          >
            <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'}>
              <Box sx={{ direction: 'ltr' }}>
                <Typography
                  sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}
                >
                  {t(`${tab.i18nPrefix}.tabs.${tab.label || tab.key}`)}
                </Typography>
                <Typography variant="h3" component="h2" sx={{ color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, lineHeight: 1.2 }}>
                  {t(`${tab.i18nPrefix}.features.${tab.key}.heading`)}
                </Typography>
                <Typography component="p" sx={{ color: 'text.secondary', mt: 4, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, display: 'block' }}>
                  {t(`${tab.i18nPrefix}.features.${tab.key}.body`)}
                </Typography>
              </Box>
            </ScrollReveal>

            <ScrollReveal direction={index % 2 === 0 ? 'right' : 'left'} delay={0.1}>
              <Box sx={{ direction: 'ltr' }}>
                <Box
                  component="img"
                  src={tab.screenshot}
                  alt={t(`${tab.i18nPrefix}.tabs.${tab.key}`)}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'block',
                  }}
                />
              </Box>
            </ScrollReveal>
          </Box>
        </Box>
      ))}

    </>
  );
}
