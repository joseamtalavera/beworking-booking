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

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3020';

const navLinks = [
  { label: 'Business Address', href: `${FRONTEND_URL}/business-address` },
  { label: 'Spaces', href: '/' },
  { label: 'Platform', href: `${FRONTEND_URL}/application` },
  { label: 'Pricing', href: `${FRONTEND_URL}/pricing` },
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Business Address', href: `${FRONTEND_URL}/business-address` },
      { label: 'Spaces', href: '/' },
      { label: 'Platform', href: `${FRONTEND_URL}/application` },
      { label: 'Pricing', href: `${FRONTEND_URL}/pricing` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: `${FRONTEND_URL}/about` },
      { label: 'Careers', href: `${FRONTEND_URL}/careers` },
      { label: 'Press', href: `${FRONTEND_URL}/press` },
      { label: 'Contact', href: `${FRONTEND_URL}/contact` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: `${FRONTEND_URL}/terms` },
      { label: 'Privacy', href: `${FRONTEND_URL}/privacy` },
      { label: 'Cookies', href: `${FRONTEND_URL}/cookies` },
      { label: 'Sitemap', href: `${FRONTEND_URL}/sitemap` },
    ],
  },
];

const socialLinks = [
  { Icon: LinkedInIcon, href: 'https://www.linkedin.com/company/beworking', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/beworkingmalaga', label: 'Instagram' },
  { Icon: XIcon, href: 'https://x.com/beworking', label: 'X' },
];

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isInternalLink = (href) => href.startsWith('/') && !href.startsWith('//');

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
          {/* Left: Logo */}
          <Box component="a" href={FRONTEND_URL} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/beworking_logo_clean.svg" alt="BeWorking" style={{ height: 26, width: 130, cursor: 'pointer' }} />
          </Box>

          {/* Center: Nav links — desktop only */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={isInternalLink(link.href) ? NextLink : 'a'}
                href={link.href}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right: Sign in + Get started — desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Button
              component="a"
              href={`${FRONTEND_URL}/main/login`}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.primary',
                textTransform: 'none',
                px: 1.5,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'text.secondary',
                },
              }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              component="a"
              href={`${FRONTEND_URL}/main/register`}
              sx={{
                borderRadius: '999px',
                px: 3,
                py: 0.875,
                fontSize: '0.875rem',
              }}
            >
              Get started
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            pt: 2,
            px: 1,
            bgcolor: '#ffffff',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.label}
              component={isInternalLink(link.href) ? NextLink : 'a'}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '8px',
                mx: 1,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                }}
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
            sx={{
              borderRadius: '8px',
              mx: 1,
            }}
          >
            <ListItemText
              primary="Sign in"
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: 400,
              }}
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
            sx={{
              borderRadius: '999px',
              py: 1.25,
              fontSize: '0.875rem',
            }}
          >
            Get started
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
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 4, md: 6 },
          }}
        >
          {footerColumns.map((col) => (
            <Box key={col.title}>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.5)',
                  mb: 2.5,
                  letterSpacing: '0.02em',
                }}
              >
                {col.title}
              </Typography>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  component={isInternalLink(link.href) ? NextLink : 'a'}
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
                  {link.label}
                </Link>
              ))}
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
              Connect
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
            BeWorking, S.L. — European business infrastructure.
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
            Malaga, Spain
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
