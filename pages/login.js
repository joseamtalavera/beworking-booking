import Head from 'next/head';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SigninCard from '@/components/auth/SigninCard';
import { tokens } from '@/theme/tokens';

const { colors } = tokens;

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  return (
    <>
      <Head>
        <title>{`${t('nav.signIn')} — BeWorking`}</title>
        <meta
          name="description"
          content={isEs
            ? 'Accede a tu cuenta de BeWorking para gestionar tus oficinas y servicios.'
            : 'Sign in to your BeWorking account to manage your offices and services.'}
        />
        <link rel="canonical" href="https://be-working.com/login" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.bgSoft,
          minHeight: '80vh',
          py: { xs: 6, md: 10 },
          px: 2,
        }}
      >
        <SigninCard />
      </Box>
    </>
  );
}
