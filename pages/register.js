import Head from 'next/head';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SimpleSignUp from '@/components/register/SimpleSignUp';
import { tokens } from '@/theme/tokens';

const { colors } = tokens;

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  return (
    <>
      <Head>
        <title>{`${t('nav.getStarted')} — BeWorking`}</title>
        <meta
          name="description"
          content={isEs
            ? 'Crea tu cuenta gratuita en BeWorking y accede a la plataforma.'
            : 'Create your free BeWorking account and access the platform.'}
        />
        <link rel="canonical" href="https://be-working.com/register" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.bgSoft,
          minHeight: '90vh',
          py: { xs: 6, md: 10 },
          px: 2,
        }}
      >
        <SimpleSignUp />
      </Box>
    </>
  );
}
