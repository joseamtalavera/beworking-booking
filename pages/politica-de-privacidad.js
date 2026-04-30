import Head from 'next/head';
import { useTranslation } from 'react-i18next';
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

const Field = ({ label, children }) => (
  <P><strong>{label}:</strong> {children}</P>
);

export default function PoliticaPrivacidad() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const aepdLink = (
    <MuiLink href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</MuiLink>
  );
  const emailLink = (
    <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>
  );

  return (
    <>
      <Head>
        <title>{`${t('privacy.title')} — BeWorking`}</title>
        <meta name="description" content={t('privacy.intro').slice(0, 160)} />
        <link rel="canonical" href="https://be-working.com/politica-de-privacidad" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 1 }}>
            {t('privacy.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            {t('privacy.lastUpdated')}
          </Typography>

          {isEn && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
              {t('legal.disclaimerEn')}
            </Typography>
          )}

          <P>{t('privacy.intro')}</P>

          <Section id="responsable" title={t('privacy.s1Title')}>
            <Field label={t('privacy.s1IdentityLabel')}>{t('privacy.s1IdentityValue')}</Field>
            <Field label={t('privacy.s1CifLabel')}>{t('privacy.s1CifValue')}</Field>
            <Field label={t('privacy.s1AddressLabel')}>{t('privacy.s1AddressValue')}</Field>
            <Field label={t('privacy.s1EmailLabel')}>{t('privacy.s1EmailValue')}</Field>
            <Field label={t('privacy.s1DpoLabel')}>{t('privacy.s1DpoValue')}</Field>
          </Section>

          <Section id="datos" title={t('privacy.s2Title')}>
            <P>{t('privacy.s2Intro')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>{t('privacy.s2B1')}</li>
              <li>{t('privacy.s2B2')}</li>
              <li>{t('privacy.s2B3')}</li>
              <li>{t('privacy.s2B4')}</li>
              <li>{t('privacy.s2B5')}</li>
            </Box>
          </Section>

          <Section id="finalidad" title={t('privacy.s3Title')}>
            <P>{t('privacy.s3Intro')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>{t('privacy.s3B1')}</li>
              <li>{t('privacy.s3B2')}</li>
              <li>{t('privacy.s3B3')}</li>
              <li>{t('privacy.s3B4')}</li>
              <li>{t('privacy.s3B5')}</li>
              <li>{t('privacy.s3B6')}</li>
            </Box>
          </Section>

          <Section id="base-juridica" title={t('privacy.s4Title')}>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><strong>{t('privacy.s4B1Label')}</strong> {t('privacy.s4B1Body')}</li>
              <li><strong>{t('privacy.s4B2Label')}</strong> {t('privacy.s4B2Body')}</li>
              <li><strong>{t('privacy.s4B3Label')}</strong> {t('privacy.s4B3Body')}</li>
              <li><strong>{t('privacy.s4B4Label')}</strong> {t('privacy.s4B4Body')}</li>
            </Box>
          </Section>

          <Section id="conservacion" title={t('privacy.s5Title')}>
            <P>{t('privacy.s5Body')}</P>
          </Section>

          <Section id="destinatarios" title={t('privacy.s6Title')}>
            <P>{t('privacy.s6Intro')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>{t('privacy.s6B1')}</li>
              <li>{t('privacy.s6B2')}</li>
              <li>{t('privacy.s6B3')}</li>
            </Box>
            <P>{t('privacy.s6Closing')}</P>
          </Section>

          <Section id="transferencias" title={t('privacy.s7Title')}>
            <P>{t('privacy.s7Body')}</P>
          </Section>

          <Section id="derechos" title={t('privacy.s8Title')}>
            <P>{t('privacy.s8Intro')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>{t('privacy.s8B1')}</li>
              <li>{t('privacy.s8B2')}</li>
              <li>{t('privacy.s8B3')}</li>
              <li>{t('privacy.s8B4')}</li>
              <li>{t('privacy.s8B5')}</li>
              <li>{t('privacy.s8B6')}</li>
              <li>{t('privacy.s8B7')}</li>
              <li>{t('privacy.s8B8')}</li>
            </Box>
            <P>
              {t('privacy.s8Closing', { email: '__EMAIL__' })
                .split(/(__EMAIL__)/)
                .map((part, i) => (part === '__EMAIL__' ? <span key={i}>{emailLink}</span> : part))}
            </P>
          </Section>

          <Section id="reclamacion" title={t('privacy.s9Title')}>
            <P>
              {t('privacy.s9Body', { aepdLink: '__AEPD__' })
                .split(/(__AEPD__)/)
                .map((part, i) => (part === '__AEPD__' ? <span key={i}>{aepdLink}</span> : part))}
            </P>
          </Section>

          <Section id="seguridad" title={t('privacy.s10Title')}>
            <P>{t('privacy.s10Body')}</P>
          </Section>

          <Section id="cambios" title={t('privacy.s11Title')}>
            <P>{t('privacy.s11Body')}</P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
