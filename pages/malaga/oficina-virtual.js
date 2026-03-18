'use client';

import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import VirtualOfficeSection from '@/components/home/VirtualOfficeSection';

const location = getLocation('malaga');

export default function OficinaVirtual() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{location.seo.virtualOffice.title}</title>
        <meta name="description" content={location.seo.virtualOffice.description} />
        <link rel="canonical" href="https://be-spaces.com/malaga/oficina-virtual" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Breadcrumb header */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            pt: { xs: 3, md: 4 },
            pb: 0,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ justifyContent: 'center', display: 'flex' }}>
            <Link component={NextLink} href="/malaga" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Malaga
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
              {t('locations.services.virtualOffice', 'Oficina Virtual')}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Reuse existing VirtualOfficeSection which has hero, benefits, services, and form */}
        <VirtualOfficeSection />
      </Box>
    </>
  );
}
