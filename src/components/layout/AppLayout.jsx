'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Divider,
  Link,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTranslation } from 'react-i18next';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3020';

const isExternal = (href) => /^https?:\/\//.test(href);

const socialLinks = [
  { Icon: LinkedInIcon, href: 'https://www.linkedin.com/company/beworking', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/beworkingmalaga', label: 'Instagram' },
];

const AppLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isOV = router.pathname === '/malaga/oficina-virtual';
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/malaga/oficina-virtual',  labelKey: 'nav.short.virtual',  fallback: 'Virtual' },
    { href: '/malaga/coworking',        labelKey: 'nav.short.desks',    fallback: 'Desks' },
    { href: '/malaga/salas-de-reunion', labelKey: 'nav.short.rooms',    fallback: 'Rooms' },
    { href: '/platform',                labelKey: 'nav.short.platform', fallback: 'App' },
    { labelKey: 'nav.services',         fallback: 'Services',           placeholder: true },
    {
      href: 'https://wa.me/34640369759?text=Hola,%20me%20interesa%20información%20sobre%20BeWorking',
      labelKey: 'nav.help',
      fallback: 'Ayuda',
      external: true,
    },
  ];

  const footerColumns = [
    {
      titleKey: 'footer.product',
      links: [
        { labelKey: 'nav.short.virtual',  href: '/malaga/oficina-virtual' },
        { labelKey: 'nav.short.desks',    href: '/malaga/coworking' },
        { labelKey: 'nav.short.rooms',    href: '/malaga/salas-de-reunion' },
        { labelKey: 'nav.short.platform', href: '/platform' },
        { labelKey: 'footer.links.pricing', soon: true },
      ],
    },
    {
      titleKey: 'footer.ciudades',
      links: [
        { labelKey: 'footer.links.malaga',      href: '/malaga' },
        { labelKey: 'footer.links.sevillaSoon', soon: true },
        { labelKey: 'footer.links.tallinn',     soon: true },
        { labelKey: 'footer.links.allCities',   href: '/spaces' },
      ],
    },
    {
      titleKey: 'footer.company',
      links: [
        { labelKey: 'footer.links.about',    soon: true },
        { labelKey: 'footer.links.blog',     soon: true },
        { labelKey: 'footer.links.press',    soon: true },
        { labelKey: 'footer.links.contact',  href: '/contact' },
        { label: 'info@be-working.com',      href: 'mailto:info@be-working.com' },
        { label: '+34 951 905 967',          href: 'tel:+34951905967' },
      ],
    },
    {
      titleKey: 'footer.legal',
      links: [
        { labelKey: 'footer.links.terms',    href: '/aviso-legal' },
        { labelKey: 'footer.links.privacy',  href: '/politica-de-privacidad' },
        { labelKey: 'footer.links.cookies',  href: '/politica-de-cookies' },
        { labelKey: 'footer.links.sitemap',  soon: true },
      ],
    },
  ];

  const setLang = (lang) => {
    if (i18n.language === lang) return;
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') localStorage.setItem('beworking_lang', lang);
  };

  const LangToggle = ({ sx }) => (
    <Box
      role="group"
      aria-label="Language"
      sx={{
        display: 'inline-flex',
        bgcolor: 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '999px',
        p: '3px',
        ...sx,
      }}
    >
      {['es', 'en'].map((lang) => {
        const active = i18n.language === lang;
        return (
          <Box
            key={lang}
            role="button"
            tabIndex={0}
            onClick={() => setLang(lang)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setLang(lang);
            }}
            sx={{
              minWidth: 32,
              px: 1.25,
              py: 0.35,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textAlign: 'center',
              borderRadius: '999px',
              cursor: active ? 'default' : 'pointer',
              userSelect: 'none',
              color: active ? '#ffffff' : 'rgba(0,0,0,0.5)',
              bgcolor: active ? '#1d1d1f' : 'transparent',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover': active ? {} : { color: 'rgba(0,0,0,0.75)' },
            }}
          >
            {lang.toUpperCase()}
          </Box>
        );
      })}
    </Box>
  );

  const linkProps = (href) =>
    isExternal(href)
      ? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
      : { component: NextLink, href };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: 'none',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            height: 64,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#0e0e0c', letterSpacing: '-0.034em', cursor: 'pointer', lineHeight: 1, display: 'inline-flex', alignItems: 'baseline', gap: '0.04em' }}>
              beworking<span aria-hidden="true" style={{ display: 'inline-block', width: '0.18em', height: '0.18em', borderRadius: '50%', backgroundColor: '#2e8b3d', alignSelf: 'flex-end', marginBottom: '0.04em' }} />
            </span>
          </Box>

          {/* Center: nav links (desktop only) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.75, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {navLinks.map((link) => {
              const label = t(link.labelKey, { defaultValue: link.fallback });
              if (link.placeholder) {
                return (
                  <span
                    key={link.labelKey}
                    style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', letterSpacing: '-0.005em', cursor: 'default' }}
                  >
                    {label}
                  </span>
                );
              }
              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.005em' }}
                  >
                    {label}
                  </a>
                );
              }
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.005em' }}
                >
                  {label}
                </NextLink>
              );
            })}
          </Box>

          {/* Right desktop: lang toggle + login + register */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25 }}>
            <LangToggle />
            <Button
              component={NextLink}
              href="/login"
              sx={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#1d1d1f',
                textTransform: 'none',
                px: 1.75,
                py: 0.5,
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '999px',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)', borderColor: 'rgba(0,0,0,0.2)' },
              }}
            >
              {t('nav.signIn')}
            </Button>
            {isOV ? (
              <Link
                href="tel:+34951905967"
                underline="none"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'primary.main',
                  '&:hover': { opacity: 0.7 },
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#009624">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                +34 951 905 967
              </Link>
            ) : (
              <Button
                component="a"
                href="/register"
                variant="contained"
                disableElevation
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '999px',
                  px: 2,
                  py: 0.5,
                  whiteSpace: 'nowrap',
                  bgcolor: '#009624',
                  '&:hover': { bgcolor: '#007a1e', boxShadow: 'none' },
                }}
              >
                {t('nav.getStarted')}
              </Button>
            )}
          </Box>

          {/* Right mobile: lang toggle + phone (OV) or hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <LangToggle />
            {isOV && (
              <Link
                href="tel:+34951905967"
                underline="none"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem', fontWeight: 700, color: 'primary.main' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#009624">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>+34 951 905 967</Box>
              </Link>
            )}
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, pt: 2, px: 1, bgcolor: '#ffffff' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => {
            const label = t(link.labelKey, { defaultValue: link.fallback });
            if (link.placeholder) {
              return (
                <ListItemButton
                  key={link.labelKey}
                  disabled
                  sx={{ borderRadius: '8px', mx: 1, opacity: 1 }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 400, color: 'text.primary' }}
                  />
                </ListItemButton>
              );
            }
            const linkComponentProps = link.external
              ? { component: 'a', href: link.href, target: '_blank', rel: 'noopener noreferrer' }
              : { component: NextLink, href: link.href };
            return (
              <ListItemButton
                key={link.href}
                {...linkComponentProps}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: '8px', mx: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 400, color: 'text.primary' }}
                />
              </ListItemButton>
            );
          })}
        </List>
        <Divider sx={{ my: 1.5, mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
        <List>
          <ListItemButton
            component={NextLink}
            href="/login"
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: '8px', mx: 1 }}
          >
            <ListItemText
              primary={t('nav.signIn')}
              primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 400 }}
            />
          </ListItemButton>
        </List>
        <Box sx={{ px: 2, pb: 2, mt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            component="a"
            href="/register"
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: '999px', py: 1.25, fontSize: '0.875rem' }}
          >
            {t('nav.getStarted')}
          </Button>
        </Box>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: 64 }} />

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#faf9f6',
          color: '#1d1d1f',
          pt: { xs: '56px', md: '72px' },
          pb: { xs: '24px', md: '32px' },
          px: { xs: 3, md: 5 },
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: '2fr repeat(4, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* Brand block */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, maxWidth: 320 }}>
            <Box component="a" href="/" sx={{ display: 'inline-flex', alignItems: 'baseline', textDecoration: 'none', mb: 2 }}>
              <Box
                component="span"
                sx={{
                  fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#0e0e0c',
                  letterSpacing: '-0.034em',
                  lineHeight: 1,
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '0.04em',
                }}
              >
                beworking
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    display: 'inline-block',
                    width: '0.18em',
                    height: '0.18em',
                    borderRadius: '50%',
                    bgcolor: '#2e8b3d',
                    alignSelf: 'flex-end',
                    marginBottom: '0.04em',
                  }}
                />
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'rgba(0,0,0,0.6)' }}>
              {t('footer.brandTagline')}
            </Typography>
          </Box>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <Box key={col.titleKey}>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1d1d1f',
                  mb: 2,
                  letterSpacing: '-0.005em',
                }}
              >
                {t(col.titleKey)}
              </Typography>
              {col.links.map((link) =>
                link.soon ? (
                  <Typography
                    key={link.labelKey}
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'rgba(0,0,0,0.35)',
                      mb: 1.25,
                      cursor: 'default',
                    }}
                  >
                    {link.label || t(link.labelKey)}
                  </Typography>
                ) : (
                  <Link
                    key={link.labelKey || link.label}
                    {...linkProps(link.href)}
                    underline="none"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'rgba(0,0,0,0.7)',
                      mb: 1.25,
                      transition: 'color 0.15s ease',
                      '&:hover': { color: '#007a1e' },
                    }}
                  >
                    {link.label || t(link.labelKey)}
                  </Link>
                )
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: 'rgba(0,0,0,0.08)' }} />

        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(0,0,0,0.45)' }}>
            {t('footer.tagline')}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(0,0,0,0.45)' }}>
            {t('footer.copyright')}
          </Typography>
        </Box>
      </Box>

      {/* WhatsApp floating button */}
      <Box
        component="a"
        href="https://wa.me/34640369759?text=Hola,%20me%20interesa%20información%20sobre%20BeWorking"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 28 },
          right: { xs: 20, md: 28 },
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          '&:hover': {
            transform: 'scale(1.12)',
            opacity: 0.8,
          },
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </Box>
    </Box>
  );
};

export default AppLayout;
