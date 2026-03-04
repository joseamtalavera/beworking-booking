'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import { useTranslation } from 'react-i18next';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3020';

const isExternal = (href) => /^https?:\/\//.test(href);

const socialLinks = [
  { Icon: LinkedInIcon, href: 'https://www.linkedin.com/company/beworking', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/beworkingmalaga', label: 'Instagram' },
  { Icon: XIcon, href: 'https://x.com/beworking', label: 'X' },
];

const AppLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { labelKey: 'nav.platform',      href: `${FRONTEND_URL}/platform` },
    { labelKey: 'nav.virtualOffice', href: `${FRONTEND_URL}/virtual-office` },
    { labelKey: 'nav.spaces',        href: '/' },
    { labelKey: 'nav.marketplace',   href: `${FRONTEND_URL}/marketplace` },
  ];

  const footerColumns = [
    {
      titleKey: 'footer.product',
      links: [
        { labelKey: 'footer.links.platform',     href: `${FRONTEND_URL}/platform` },
        { labelKey: 'footer.links.virtualOffice', href: `${FRONTEND_URL}/virtual-office` },
        { labelKey: 'footer.links.spaces',        href: '/' },
        { labelKey: 'footer.links.marketplace',   href: `${FRONTEND_URL}/marketplace` },
      ],
    },
    {
      titleKey: 'footer.company',
      links: [
        { labelKey: 'footer.links.about',    soon: true },
        { labelKey: 'footer.links.careers',  soon: true },
        { labelKey: 'footer.links.press',    soon: true },
        { labelKey: 'footer.links.contact',  href: `${FRONTEND_URL}/contact` },
        { labelKey: 'footer.links.faq',      href: `${FRONTEND_URL}/faq` },
      ],
    },
    {
      titleKey: 'footer.legal',
      links: [
        { labelKey: 'footer.links.terms',    soon: true },
        { labelKey: 'footer.links.privacy',  soon: true },
        { labelKey: 'footer.links.cookies',  soon: true },
        { labelKey: 'footer.links.sitemap',  soon: true },
      ],
    },
  ];

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') localStorage.setItem('beworking_lang', next);
  };

  const LangToggle = ({ sx }) => (
    <Button
      onClick={toggleLang}
      size="small"
      sx={{
        minWidth: 0,
        px: 1.25,
        py: 0.5,
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '6px',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: 'rgba(0,0,0,0.18)' },
        ...sx,
      }}
    >
      {i18n.language === 'es' ? 'EN' : 'ES'}
    </Button>
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
          bgcolor: 'rgba(250, 250, 250, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            height: 64,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box component="a" href={FRONTEND_URL} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/beworking_logo_clean.svg" alt="BeWorking" style={{ height: 26, width: 130, cursor: 'pointer' }} />
          </Box>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navLinks.map((link) => (
              <Button
                key={link.labelKey}
                {...linkProps(link.href)}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '6px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                {t(link.labelKey)}
              </Button>
            ))}
          </Box>

          {/* Right: lang toggle + sign in + get started — desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <LangToggle />
            <Button
              component="a"
              href={`${FRONTEND_URL}/main/login`}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary',
                textTransform: 'none',
                px: 1.5,
                '&:hover': { backgroundColor: 'transparent', color: 'text.secondary' },
              }}
            >
              {t('nav.signIn')}
            </Button>
            <Button
              variant="contained"
              component="a"
              href={`${FRONTEND_URL}/main/register`}
              sx={{ borderRadius: '999px', px: 3, py: 0.875, fontSize: '0.875rem' }}
            >
              {t('nav.getStarted')}
            </Button>
          </Box>

          {/* Mobile: lang toggle + hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <LangToggle />
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }}>
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
          {navLinks.map((link) => (
            <ListItemButton
              key={link.labelKey}
              {...linkProps(link.href)}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: '8px', mx: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
            >
              <ListItemText
                primary={t(link.labelKey)}
                primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 400, color: 'text.primary' }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1.5, mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
        <List>
          <ListItemButton
            component="a"
            href={`${FRONTEND_URL}/main/login`}
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
            href={`${FRONTEND_URL}/main/register`}
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
          bgcolor: '#1a1a1a',
          color: 'common.white',
          pt: { xs: '64px', md: '80px' },
          pb: { xs: '32px', md: '40px' },
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 4, md: 6 },
          }}
        >
          {footerColumns.map((col) => (
            <Box key={col.titleKey}>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.5)',
                  mb: 2.5,
                  letterSpacing: '0.02em',
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
                      color: 'rgba(255,255,255,0.35)',
                      mb: 1.5,
                      cursor: 'default',
                    }}
                  >
                    {t(link.labelKey)}
                  </Typography>
                ) : (
                  <Link
                    key={link.labelKey}
                    {...linkProps(link.href)}
                    underline="none"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.8)',
                      mb: 1.5,
                      transition: 'color 0.15s ease',
                      '&:hover': { color: 'common.white' },
                    }}
                  >
                    {t(link.labelKey)}
                  </Link>
                )
              )}
            </Box>
          ))}

          {/* Connect column */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                mb: 2.5,
                letterSpacing: '0.02em',
              }}
            >
              {t('footer.connect')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    transition: 'color 0.15s ease',
                    '&:hover': { color: 'common.white' },
                  }}
                >
                  <social.Icon sx={{ fontSize: 20 }} />
                </Link>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
            {t('footer.tagline')}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
            {t('footer.location')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
