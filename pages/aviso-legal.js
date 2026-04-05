import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';

export default function AvisoLegal() {
  return (
    <>
      <Head>
        <title>Aviso Legal — BeWorking</title>
        <meta name="description" content="Aviso legal de BeWorking." />
        <link rel="canonical" href="https://be-working.com/aviso-legal" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 4 }}>
            Aviso Legal
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>Titular del sitio web:</strong> BeWorking Partners, S.L.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>CIF:</strong> B67508069
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>Dirección:</strong> Calle Alejandro Dumas 17 - Oficinas, 29004 Málaga, España
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>Email:</strong> info@be-working.com
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 4 }}>
            El presente aviso legal regula el uso del sitio web be-working.com.
            El acceso al sitio y la utilización de sus contenidos y servicios implica la aceptación plena y sin reservas del presente aviso legal.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
