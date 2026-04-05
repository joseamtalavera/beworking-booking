import Head from 'next/head';
import { Box } from '@mui/material';
import SigninCard from '@/components/auth/SigninCard';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Iniciar sesión — BeWorking</title>
        <meta name="description" content="Accede a tu cuenta de BeWorking para gestionar tus oficinas y servicios." />
        <link rel="canonical" href="https://be-working.com/login" />
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent', minHeight: '80vh', py: { xs: 4, md: 8 }, px: 2 }}>
        <SigninCard />
      </Box>
    </>
  );
}
