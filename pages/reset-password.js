import Head from 'next/head';
import { Box, Container } from '@mui/material';
import ResetPassword from '@/components/auth/ResetPassword';

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Restablecer contraseña — BeWorking</title>
        <meta name="description" content="Restablece tu contraseña de BeWorking." />
        <link rel="canonical" href="https://be-working.com/reset-password" />
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent', minHeight: '80vh', py: { xs: 4, md: 8 }, px: 2 }}>
        <Container maxWidth="sm">
          <ResetPassword />
        </Container>
      </Box>
    </>
  );
}
