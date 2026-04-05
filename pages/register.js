import Head from 'next/head';
import { Box } from '@mui/material';
import SimpleSignUp from '@/components/register/SimpleSignUp';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Crear cuenta — BeWorking</title>
        <meta name="description" content="Crea tu cuenta gratuita en BeWorking y accede a la plataforma BeWorking." />
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent', minHeight: '90vh' }}>
        <SimpleSignUp />
      </Box>
    </>
  );
}
