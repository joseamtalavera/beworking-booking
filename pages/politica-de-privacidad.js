import Head from 'next/head';
import { Box, Container, Link as MuiLink, Typography } from '@mui/material';

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

export default function PoliticaPrivacidad() {
  return (
    <>
      <Head>
        <title>Política de Privacidad — BeWorking</title>
        <meta name="description" content="Política de privacidad y protección de datos de BeWorking conforme al RGPD y la LOPDGDD." />
        <link rel="canonical" href="https://be-working.com/politica-de-privacidad" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 1 }}>
            Política de Privacidad
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Última actualización: 26 de abril de 2026
          </Typography>

          <P>
            La presente Política de Privacidad regula el tratamiento de los datos personales que
            BEWORKING OFFICES PARTNERS SL recoge a través del sitio web be-working.com y de los
            servicios asociados, en cumplimiento del Reglamento (UE) 2016/679 General de Protección
            de Datos (RGPD) y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos
            Personales y garantía de los derechos digitales (LOPDGDD).
          </P>

          <Section id="responsable" title="1. Responsable del tratamiento">
            <P><strong>Identidad:</strong> BEWORKING OFFICES PARTNERS SL</P>
            <P><strong>CIF:</strong> B67508069</P>
            <P><strong>Domicilio:</strong> Calle Alejandro Dumas 17 - Oficinas, 29004 Málaga, España</P>
            <P><strong>Correo electrónico:</strong> info@be-working.com</P>
            <P><strong>Delegado de Protección de Datos (DPO):</strong> [Pendiente de designación, en caso de ser obligatorio conforme al art. 37 RGPD].</P>
          </Section>

          <Section id="datos" title="2. Datos personales que tratamos">
            <P>
              En función de la relación que el usuario mantenga con BEWORKING OFFICES PARTNERS SL,
              podrán tratarse las siguientes categorías de datos:
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>Datos de identificación y contacto: nombre, apellidos, NIF/CIF, dirección postal, teléfono y correo electrónico.</li>
              <li>Datos profesionales: empresa, cargo y datos de facturación.</li>
              <li>Datos de la relación contractual: servicios contratados, reservas, facturación e historial de pagos.</li>
              <li>Datos de navegación: dirección IP, identificadores de dispositivo, páginas visitadas y datos derivados del uso de cookies (véase política de cookies).</li>
              <li>Comunicaciones: contenido de los mensajes, formularios y solicitudes que el usuario nos remita.</li>
            </Box>
          </Section>

          <Section id="finalidad" title="3. Finalidades del tratamiento">
            <P>Los datos personales se tratan con las siguientes finalidades:</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>Gestionar el alta de usuario, la cuenta y la prestación de los servicios contratados.</li>
              <li>Tramitar reservas, pagos y la emisión de facturas.</li>
              <li>Atender consultas, solicitudes de información y comunicaciones de los usuarios.</li>
              <li>Cumplir con las obligaciones legales aplicables (fiscales, contables y de prevención del fraude).</li>
              <li>Enviar comunicaciones comerciales sobre nuestros servicios cuando exista una relación contractual previa o el usuario haya prestado su consentimiento expreso.</li>
              <li>Mejorar el funcionamiento del sitio web y analizar su uso de forma agregada.</li>
            </Box>
          </Section>

          <Section id="base-juridica" title="4. Base jurídica del tratamiento">
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><strong>Ejecución de un contrato</strong> (art. 6.1.b RGPD): para la prestación de los servicios y la gestión de la relación contractual.</li>
              <li><strong>Cumplimiento de obligaciones legales</strong> (art. 6.1.c RGPD): para obligaciones fiscales, contables y mercantiles.</li>
              <li><strong>Interés legítimo</strong> (art. 6.1.f RGPD): para la atención de consultas, la prevención del fraude, el aseguramiento de la red y el envío de comunicaciones comerciales sobre productos similares a clientes existentes (art. 21.2 LSSI).</li>
              <li><strong>Consentimiento</strong> (art. 6.1.a RGPD): para el envío de comunicaciones comerciales a personas que no sean clientes y para el uso de cookies no esenciales.</li>
            </Box>
          </Section>

          <Section id="conservacion" title="5. Plazo de conservación">
            <P>
              Los datos personales se conservarán durante el tiempo necesario para cumplir con la
              finalidad para la que fueron recabados. Una vez finalizada dicha finalidad, los datos
              se conservarán bloqueados durante los plazos legales de prescripción de las
              responsabilidades nacidas del tratamiento (en particular, los plazos previstos por la
              normativa fiscal, mercantil y contable, generalmente de hasta seis años).
            </P>
          </Section>

          <Section id="destinatarios" title="6. Destinatarios y cesiones de datos">
            <P>
              Los datos podrán ser comunicados a las siguientes categorías de destinatarios cuando
              resulte necesario para la prestación del servicio o por imperativo legal:
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>Proveedores de servicios que actúan como encargados del tratamiento (alojamiento, envío de correo electrónico, procesadores de pago, herramientas analíticas), con los que se han suscrito los correspondientes contratos de encargo conforme al art. 28 RGPD.</li>
              <li>Administraciones públicas y autoridades competentes en cumplimiento de obligaciones legales.</li>
              <li>Entidades financieras y procesadores de pagos, en su caso, para la tramitación de cobros.</li>
            </Box>
            <P>
              No se prevé la cesión de datos a terceros con fines comerciales sin el previo
              consentimiento expreso del interesado.
            </P>
          </Section>

          <Section id="transferencias" title="7. Transferencias internacionales">
            <P>
              Determinados proveedores de servicios podrán estar ubicados fuera del Espacio Económico
              Europeo. En tal caso, BEWORKING OFFICES PARTNERS SL adopta las garantías adecuadas
              previstas por el RGPD (cláusulas contractuales tipo aprobadas por la Comisión Europea u
              otros mecanismos válidos), con el objetivo de garantizar un nivel de protección
              equivalente al exigido por la normativa europea. El usuario puede solicitar más
              información sobre las transferencias internacionales y las garantías aplicables
              escribiendo a info@be-working.com.
            </P>
          </Section>

          <Section id="derechos" title="8. Derechos del interesado">
            <P>
              El usuario podrá ejercer en cualquier momento los derechos reconocidos por el RGPD y la
              LOPDGDD:
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>Derecho de acceso a sus datos personales.</li>
              <li>Derecho de rectificación de los datos inexactos.</li>
              <li>Derecho de supresión («derecho al olvido»).</li>
              <li>Derecho a la limitación del tratamiento.</li>
              <li>Derecho a la portabilidad de los datos.</li>
              <li>Derecho de oposición al tratamiento.</li>
              <li>Derecho a no ser objeto de decisiones automatizadas, incluida la elaboración de perfiles, que produzcan efectos jurídicos sobre el interesado o le afecten significativamente.</li>
              <li>Derecho a retirar el consentimiento prestado, sin que ello afecte a la licitud del tratamiento previo.</li>
            </Box>
            <P>
              Para ejercer estos derechos, el usuario podrá enviar una comunicación a{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink> indicando el
              derecho que desea ejercer y acompañando copia de un documento que acredite su identidad.
            </P>
          </Section>

          <Section id="reclamacion" title="9. Reclamación ante la autoridad de control">
            <P>
              El interesado tiene derecho a presentar una reclamación ante la Agencia Española de
              Protección de Datos (AEPD), con sede en C/ Jorge Juan, 6, 28001 Madrid (
              <MuiLink href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</MuiLink>),
              especialmente cuando considere que no ha obtenido satisfacción en el ejercicio de sus
              derechos.
            </P>
          </Section>

          <Section id="seguridad" title="10. Medidas de seguridad">
            <P>
              BEWORKING OFFICES PARTNERS SL aplica las medidas técnicas y organizativas apropiadas
              para garantizar un nivel de seguridad adecuado al riesgo del tratamiento, conforme al
              art. 32 RGPD, incluyendo, entre otras, el cifrado de las comunicaciones, el control de
              accesos, la realización de copias de seguridad y la formación del personal.
            </P>
          </Section>

          <Section id="cambios" title="11. Modificaciones">
            <P>
              BEWORKING OFFICES PARTNERS SL podrá modificar la presente Política de Privacidad para
              adaptarla a novedades legislativas, jurisprudenciales o a sus propias prácticas. Cuando
              los cambios sean sustanciales, se informará al usuario por los medios habituales y, en
              su caso, se solicitará el consentimiento que resulte necesario.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
