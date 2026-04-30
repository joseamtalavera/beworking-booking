import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ResetPassword from '@/components/auth/ResetPassword';
import { tokens } from '@/theme/tokens';

const { colors } = tokens;

export default function ResetPasswordPage() {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  return (
    <>
      <Head>
        <title>{`${isEs ? 'Restablecer contraseña' : 'Reset password'} — BeWorking`}</title>
        <meta
          name="description"
          content={isEs ? 'Restablece tu contraseña de BeWorking.' : 'Reset your BeWorking password.'}
        />
        <link rel="canonical" href="https://be-working.com/reset-password" />
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
        <Container maxWidth="sm" disableGutters>
          <ResetPassword />
        </Container>
      </Box>
    </>
  );
}
