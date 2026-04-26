import Head from 'next/head';
import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import NextLink from 'next/link';

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

export default function AvisoLegal() {
  return (
    <>
      <Head>
        <title>Aviso Legal — BeWorking</title>
        <meta name="description" content="Aviso legal y condiciones de uso del sitio web de BeWorking." />
        <link rel="canonical" href="https://be-working.com/aviso-legal" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 1 }}>
            Aviso Legal y Condiciones de Uso
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Última actualización: 26 de abril de 2026
          </Typography>

          <P>
            En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la
            Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen a disposición de
            los usuarios y autoridades competentes los siguientes datos identificativos del titular
            del sitio web.
          </P>

          <Section id="titular" title="1. Datos del titular">
            <P><strong>Denominación social:</strong> BEWORKING OFFICES PARTNERS SL</P>
            <P><strong>CIF:</strong> B67508069</P>
            <P><strong>Domicilio social:</strong> Calle Alejandro Dumas 17 - Oficinas, 29004 Málaga, España</P>
            <P><strong>Correo electrónico:</strong> info@be-working.com</P>
            <P><strong>Datos registrales:</strong> [Pendiente de cumplimentar — tomo, folio, hoja y fecha de inscripción en el Registro Mercantil correspondiente].</P>
          </Section>

          <Section id="objeto" title="2. Objeto">
            <P>
              El presente Aviso Legal regula el acceso y la utilización del sitio web be-working.com y
              de sus subdominios (en adelante, el «Sitio Web»), titularidad de BeWorking Partners,
              S.L. (en adelante, «BeWorking»). El acceso al Sitio Web y la utilización de sus
              contenidos y servicios implica la aceptación plena y sin reservas de las presentes
              condiciones por parte del usuario.
            </P>
            <P>
              Algunos servicios podrán estar sujetos a condiciones particulares que, en su caso,
              sustituirán, completarán o modificarán el presente Aviso Legal y deberán ser aceptadas
              expresamente por el usuario antes de su contratación.
            </P>
          </Section>

          <Section id="acceso" title="3. Acceso y uso del Sitio Web">
            <P>
              El acceso al Sitio Web es libre y gratuito, sin perjuicio de los servicios que requieran
              registro previo o el pago de una contraprestación. El usuario se compromete a utilizar
              el Sitio Web y sus servicios conforme a la ley, a la moral, al orden público y a las
              presentes condiciones, absteniéndose de utilizarlos con fines ilícitos o lesivos contra
              los intereses o derechos de BeWorking o de terceros.
            </P>
            <P>
              Cuando sea necesario el registro, el usuario se compromete a proporcionar información
              veraz, exacta y actualizada, y a custodiar las credenciales de acceso, siendo
              responsable de cualquier actividad realizada con su cuenta.
            </P>
          </Section>

          <Section id="propiedad" title="4. Propiedad intelectual e industrial">
            <P>
              Todos los contenidos del Sitio Web —incluyendo, a título enunciativo y no limitativo,
              textos, fotografías, gráficos, imágenes, iconos, software, nombres comerciales, marcas,
              logotipos y diseños— son titularidad de BeWorking o, en su caso, de terceros que han
              autorizado su uso, y se encuentran protegidos por la normativa nacional e internacional
              en materia de propiedad intelectual e industrial.
            </P>
            <P>
              Queda expresamente prohibida la reproducción, distribución, comunicación pública,
              transformación o cualquier otra forma de explotación sin autorización previa y por
              escrito de su titular. La utilización no autorizada podrá dar lugar a las acciones
              legales que correspondan.
            </P>
          </Section>

          <Section id="responsabilidad" title="5. Exclusión de garantías y responsabilidad">
            <P>
              BeWorking no garantiza la disponibilidad y continuidad ininterrumpida del Sitio Web ni
              la ausencia de errores en sus contenidos, si bien adoptará las medidas técnicas
              razonables para evitarlos, subsanarlos o actualizarlos.
            </P>
            <P>
              BeWorking no se hace responsable de los daños y perjuicios de cualquier naturaleza que
              pudieran derivarse de la falta de disponibilidad o continuidad del Sitio Web, ni de la
              presencia de virus o de la introducción ilícita de programas en los sistemas
              informáticos del usuario, siempre que haya adoptado las medidas técnicas exigibles
              conforme al estado de la técnica.
            </P>
          </Section>

          <Section id="enlaces" title="6. Enlaces a sitios de terceros">
            <P>
              El Sitio Web puede contener enlaces a páginas de terceros. BeWorking no asume
              responsabilidad alguna por los contenidos, servicios o información alojados en dichas
              páginas, ni por la disponibilidad técnica, calidad, fiabilidad o exactitud de los
              mismos. La inclusión de estos enlaces no implica relación, recomendación o respaldo
              alguno por parte de BeWorking.
            </P>
          </Section>

          <Section id="privacidad" title="7. Protección de datos y cookies">
            <P>
              El tratamiento de los datos personales que el usuario facilite a través del Sitio Web
              se rige por la{' '}
              <NextLink href="/politica-de-privacidad" passHref legacyBehavior>
                <MuiLink>Política de Privacidad</MuiLink>
              </NextLink>
              . El uso de cookies y tecnologías similares se rige por la política de cookies, en su
              caso disponible en el propio Sitio Web.
            </P>
          </Section>

          <Section id="modificaciones" title="8. Modificaciones">
            <P>
              BeWorking se reserva el derecho a modificar, en cualquier momento y sin previo aviso, la
              presentación, configuración y contenidos del Sitio Web, así como las presentes
              condiciones. La fecha de la última actualización figura al inicio de este documento.
            </P>
          </Section>

          <Section id="ley" title="9. Legislación aplicable y jurisdicción">
            <P>
              Las presentes condiciones se rigen por la legislación española. Para la resolución de
              cualquier controversia derivada de su interpretación o aplicación, las partes se someten
              a los Juzgados y Tribunales del domicilio del usuario cuando éste tenga la condición de
              consumidor. En el resto de supuestos, ambas partes se someten expresamente, con
              renuncia a cualquier otro fuero, a los Juzgados y Tribunales de Málaga (España).
            </P>
          </Section>

          <Section id="contacto" title="10. Contacto">
            <P>
              Para cualquier consulta relativa al presente Aviso Legal, el usuario puede dirigirse a
              BEWORKING OFFICES PARTNERS SL mediante correo electrónico a{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
