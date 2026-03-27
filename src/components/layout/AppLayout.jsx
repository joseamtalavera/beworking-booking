'use client';

import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Divider,
  Link,
  Typography,
} from '@mui/material';
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

  const footerColumns = [
    {
      titleKey: 'footer.product',
      links: [
        { labelKey: 'footer.links.platform',  href: `${FRONTEND_URL}/platform` },
        { labelKey: 'footer.links.spaces',    href: '/' },
        { labelKey: 'footer.links.pricing',   href: `${FRONTEND_URL}/prices` },
      ],
    },
    {
      titleKey: 'footer.malaga',
      links: [
        { labelKey: 'footer.links.malaga',           href: '/malaga' },
        { labelKey: 'footer.links.meetingRooms',      href: '/malaga/salas-de-reunion' },
        { labelKey: 'footer.links.coworking',         href: '/malaga/coworking' },
        { labelKey: 'footer.links.virtualOffice',     href: '/malaga/oficina-virtual' },
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
            <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#009624', letterSpacing: '-0.02em', cursor: 'pointer', lineHeight: 1 }}>
              bespaces<span style={{ display: 'inline-block', width: '0.26em', height: '0.26em', borderRadius: '50%', backgroundColor: '#fb923c', marginLeft: '0.08em', verticalAlign: 'baseline', position: 'relative', top: '0.05em' }} />
            </span>
          </Box>

          {/* Right: lang toggle + login + register */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LangToggle />
            <Button
              component="a"
              href={`${FRONTEND_URL}/main/login`}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'text.primary',
                textTransform: 'none',
                px: 1.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
            >
              {t('nav.signIn')}
            </Button>
            <Button
              component="a"
              href="/register"
              variant="contained"
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '999px',
                px: 2.5,
                py: 0.875,
                whiteSpace: 'nowrap',
              }}
            >
              {t('nav.getStarted')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: 64 }} />

      {/* Main content */}
      <Box sx={{ flex: 1, pb: { xs: '64px', md: '80px' } }}>
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
