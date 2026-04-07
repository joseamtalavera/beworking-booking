import { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Typography, Button, Tabs, Tab, Chip, Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
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
  const { t, i18n } = useTranslation();
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
              href="/register"
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

      {/* Pricing Section */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '112px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <ScrollReveal direction="up">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}>
                {t('platform.tabs.overview', { defaultValue: 'Planes' })}
              </Typography>
              <Typography variant="h3" component="h2" sx={{ color: 'text.primary', fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, lineHeight: 1.2 }}>
                {i18n.language === 'es' ? 'Elige el plan que mejor se adapta a ti' : 'Choose the plan that fits you best'}
              </Typography>
            </Box>
          </ScrollReveal>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
            {[
              { name: 'Free', price: '0', description: i18n.language === 'es' ? 'Empieza gratis con tu cuenta.' : 'Start free with your account.', features: i18n.language === 'es' ? ['Plataforma BeWorking', 'Reserva de espacios BeWorking', 'Panel de gestión', 'Facturación básica', 'Soporte por email'] : ['BeWorking Platform', 'BeWorking space booking', 'Management dashboard', 'Basic invoicing', 'Email support'], href: '/register' },
              { name: 'Basic', price: '15', popular: true, description: i18n.language === 'es' ? 'Dirección empresarial registrada.' : 'Registered business address.', features: i18n.language === 'es' ? ['Todo en Free', 'Domicilio fiscal y legal', 'Recepción de correo', 'Buzón digital', 'Logo en recepción'] : ['Everything in Free', 'Legal & fiscal address', 'Mail reception', 'Digital mailbox', 'Logo at reception'], href: '/malaga/oficina-virtual' },
              { name: 'Pro', price: '25', description: i18n.language === 'es' ? 'Todo en Basic más Web personalizada.' : 'Everything in Basic plus custom website.', features: i18n.language === 'es' ? ['Todo en Basic', 'Atención de llamadas', 'Multi-usuario (3 usuarios)', 'Gestor dedicado', 'Web corporativa'] : ['Everything in Basic', 'Call handling', 'Multi-user (3 users)', 'Dedicated manager', 'Corporate website'], href: '/malaga/oficina-virtual' },
            ].map((plan) => (
              <ScrollReveal key={plan.name} direction="up">
                <Box sx={{
                  bgcolor: '#fff', borderRadius: 3, p: 3.5, height: '100%',
                  border: '2px solid', borderColor: plan.popular ? 'primary.main' : 'divider',
                  position: 'relative', display: 'flex', flexDirection: 'column',
                }}>
                  {plan.popular && (
                    <Chip label="POPULAR" size="small" sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontWeight: 700, fontSize: '0.7rem', bgcolor: 'primary.main', color: '#fff', borderRadius: '999px', px: 1.5, height: 24 }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{plan.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, fontSize: '0.85rem' }}>{plan.description}</Typography>
                  <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '2.25rem', fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>{plan.price}€</Typography>
                    <Typography variant="body2" color="text.secondary">/mes</Typography>
                  </Stack>
                  <Stack spacing={1.25} sx={{ flex: 1, mb: 2.5 }}>
                    {plan.features.map((f) => (
                      <Stack key={f} direction="row" spacing={1} alignItems="flex-start">
                        <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{f}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    component={NextLink}
                    href={plan.href}
                    sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 600, py: 1.25 }}
                  >
                    {i18n.language === 'es' ? 'Elegir plan' : 'Choose plan'}
                  </Button>
                </Box>
              </ScrollReveal>
            ))}
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            {i18n.language === 'es' ? 'Todos los precios + IVA. Sin permanencia.' : 'All prices + VAT. No commitment.'}
          </Typography>
        </Box>
      </Box>

    </>
  );
}
