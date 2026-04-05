import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';

export default function PoliticaPrivacidad() {
  return (
    <>
      <Head>
        <title>Política de Privacidad — BeWorking</title>
        <meta name="description" content="Política de privacidad de BeWorking." />
        <link rel="canonical" href="https://be-working.com/politica-de-privacidad" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 4 }}>
            Política de Privacidad
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>Responsable del tratamiento:</strong> BeWorking Partners, S.L. (CIF B67508069)
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            <strong>Dirección:</strong> Calle Alejandro Dumas 17 - Oficinas, 29004 Málaga, España
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 4 }}>
            <strong>Email de contacto:</strong> info@be-working.com
          </Typography>
          <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Finalidad del tratamiento
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            Los datos personales recabados a través de este sitio web serán tratados con la finalidad de gestionar las solicitudes de información, reservas de espacios, contratación de servicios y cumplimiento de obligaciones contractuales.
          </Typography>
          <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mt: 4, mb: 2 }}>
            Derechos
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
            El interesado podrá ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad enviando un email a info@be-working.com.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
