import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const Section = ({ id, title, children }) => (
  <Box id={id} sx={{ mt: 5 }}>
    <Typography variant="h5" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 1.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const P = ({ children, sx }) => (
  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2, ...sx }}>
    {children}
  </Typography>
);

const COOKIES = [
  {
    name: 'CookieConsent',
    provider: 'Cookiebot',
    purpose: 'Almacena el estado de consentimiento del usuario para cookies en este dominio.',
    duration: '12 meses',
    type: 'Necesaria',
  },
  {
    name: 'beworking_access',
    provider: 'BeWorking',
    purpose: 'Mantiene la sesión del usuario autenticado (token JWT, httpOnly).',
    duration: '15 minutos',
    type: 'Necesaria',
  },
  {
    name: 'beworking_refresh',
    provider: 'BeWorking',
    purpose: 'Permite renovar el token de sesión sin volver a iniciar sesión (httpOnly).',
    duration: '7 días',
    type: 'Necesaria',
  },
  {
    name: '__stripe_mid, __stripe_sid',
    provider: 'Stripe',
    purpose: 'Detección de fraude y prevención durante el procesamiento de pagos.',
    duration: '1 año / sesión',
    type: 'Necesaria',
  },
  {
    name: '_ga, _ga_<container-id>',
    provider: 'Google Analytics 4',
    purpose: 'Identifica al visitante de forma anónima para medir el uso del sitio.',
    duration: '2 años',
    type: 'Estadística',
  },
  {
    name: '_gid',
    provider: 'Google Analytics',
    purpose: 'Distingue visitantes para análisis de uso agregado.',
    duration: '24 horas',
    type: 'Estadística',
  },
];

const handleOpenPreferences = () => {
  if (typeof window === 'undefined') return;
  if (window.Cookiebot?.renew) {
    window.Cookiebot.renew();
  } else if (window.Cookiebot?.show) {
    window.Cookiebot.show();
  }
};

export default function PoliticaCookies() {
  return (
    <>
      <Head>
        <title>Política de Cookies — BeWorking</title>
        <meta name="description" content="Política de cookies de BeWorking. Información sobre las cookies que utilizamos y cómo gestionarlas." />
        <link rel="canonical" href="https://be-working.com/politica-de-cookies" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700 }}>
              Política de Cookies
            </Typography>
            <MuiLink href="/cookie-policy" sx={{ fontSize: '0.875rem' }}>
              Read in English
            </MuiLink>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Última actualización: 28 de abril de 2026
          </Typography>

          <P>
            La presente Política de Cookies regula el uso de cookies y tecnologías similares en el sitio
            web be-working.com, en cumplimiento del artículo 22.2 de la Ley 34/2002, de Servicios de la
            Sociedad de la Información (LSSI-CE), del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica
            3/2018 (LOPDGDD).
          </P>

          <Section id="que-son" title="1. ¿Qué son las cookies?">
            <P>
              Una cookie es un pequeño fichero de texto que un sitio web guarda en el navegador o
              dispositivo del usuario cuando lo visita. Las cookies permiten al sitio recordar
              información sobre la visita, como el idioma preferido, el estado de inicio de sesión o
              elementos del carrito, y son útiles para mejorar la experiencia de uso, así como para
              fines analíticos o publicitarios.
            </P>
          </Section>

          <Section id="tipos" title="2. Tipos de cookies que utilizamos">
            <P>
              Clasificamos las cookies según las directrices de la Agencia Española de Protección de
              Datos (AEPD):
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>
                <strong>Cookies estrictamente necesarias:</strong> imprescindibles para la prestación del
                servicio (autenticación, seguridad, gestión del consentimiento). Están exentas de
                consentimiento conforme al art. 22.2 LSSI.
              </li>
              <li>
                <strong>Cookies estadísticas:</strong> nos ayudan a entender de forma agregada cómo se
                usa el sitio. Solo se activan con el consentimiento explícito del usuario.
              </li>
              <li>
                <strong>Cookies de marketing:</strong> actualmente no utilizamos cookies de marketing ni
                publicidad personalizada.
              </li>
            </Box>
          </Section>

          <Section id="listado" title="3. Cookies en uso">
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Finalidad</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Duración</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {COOKIES.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.name}</TableCell>
                      <TableCell>{c.provider}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{c.purpose}</TableCell>
                      <TableCell>{c.duration}</TableCell>
                      <TableCell>{c.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <P sx={{ fontSize: '0.85rem' }}>
              Cloudflare Turnstile, utilizado para protección anti-bot en formularios, emite tokens
              efímeros que no persisten como cookies en el navegador.
            </P>
          </Section>

          <Section id="terceros" title="4. Cookies de terceros">
            <P>
              Algunas cookies son emitidas por terceros para prestarnos servicios (Google para
              analítica, Stripe para procesamiento de pagos, Cookiebot para gestión del consentimiento).
              Estos terceros pueden tratar los datos en países fuera del Espacio Económico Europeo;
              consulte sus respectivas políticas para más información.
            </P>
          </Section>

          <Section id="gestion" title="5. Cómo gestionar tus preferencias">
            <P>
              Puedes aceptar, rechazar o configurar el uso de cookies en cualquier momento desde el
              panel de preferencias. Tu elección se guardará durante 12 meses, salvo que la borres
              manualmente.
            </P>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPreferences}
              sx={{ mt: 1 }}
            >
              Gestionar preferencias de cookies
            </Button>
            <P sx={{ mt: 3 }}>
              También puedes eliminar las cookies directamente desde tu navegador. Encontrarás
              instrucciones en la documentación oficial de cada navegador:
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><MuiLink href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</MuiLink></li>
              <li><MuiLink href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener">Mozilla Firefox</MuiLink></li>
              <li><MuiLink href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener">Safari</MuiLink></li>
              <li><MuiLink href="https://support.microsoft.com/help/4027947" target="_blank" rel="noopener">Microsoft Edge</MuiLink></li>
            </Box>
          </Section>

          <Section id="cambios" title="6. Cambios en esta política">
            <P>
              Podemos actualizar esta Política de Cookies para reflejar cambios en nuestras prácticas
              o por motivos legales. La fecha de "última actualización" indicada al inicio te permite
              identificar cuándo se publicó la versión vigente.
            </P>
          </Section>

          <Section id="contacto" title="7. Contacto">
            <P>
              Para cualquier consulta sobre esta política puedes escribirnos a{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
