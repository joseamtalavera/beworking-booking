import Head from 'next/head';
import { useTranslation } from 'react-i18next';
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

const Field = ({ label, children }) => (
  <P><strong>{label}:</strong> {children}</P>
);

const SubHeading = ({ children }) => (
  <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1, color: 'text.primary' }}>
    {children}
  </Typography>
);

export default function AvisoLegal() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <>
      <Head>
        <title>{`${t('aviso.title')} — BeWorking`}</title>
        <meta name="description" content={t('aviso.intro').slice(0, 160)} />
        <link rel="canonical" href="https://be-working.com/aviso-legal" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 1 }}>
            {t('aviso.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            {t('aviso.lastUpdated')}
          </Typography>

          {isEn && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
              {t('legal.disclaimerEn')}
            </Typography>
          )}

          <P>{t('aviso.intro')}</P>

          <Section id="titular" title={t('aviso.s1Title')}>
            <Field label={t('aviso.s1NameLabel')}>{t('aviso.s1NameValue')}</Field>
            <Field label={t('aviso.s1CifLabel')}>{t('aviso.s1CifValue')}</Field>
            <Field label={t('aviso.s1AddressLabel')}>{t('aviso.s1AddressValue')}</Field>
            <Field label={t('aviso.s1EmailLabel')}>{t('aviso.s1EmailValue')}</Field>
            <Field label={t('aviso.s1RegistryLabel')}>{t('aviso.s1RegistryValue')}</Field>
          </Section>

          <Section id="objeto" title={t('aviso.s2Title')}>
            <P>{t('aviso.s2P1')}</P>
            <P>{t('aviso.s2P2')}</P>
          </Section>

          <Section id="acceso" title={t('aviso.s3Title')}>
            <P>{t('aviso.s3P1')}</P>
            <P>{t('aviso.s3P2')}</P>
          </Section>

          <Section id="propiedad" title={t('aviso.s4Title')}>
            <P>{t('aviso.s4P1')}</P>
            <P>{t('aviso.s4P2')}</P>
          </Section>

          <Section id="responsabilidad" title={t('aviso.s5Title')}>
            <P>{t('aviso.s5P1')}</P>
            <P>{t('aviso.s5P2')}</P>
          </Section>

          <Section id="enlaces" title={t('aviso.s6Title')}>
            <P>{t('aviso.s6Body')}</P>
          </Section>

          <Section id="privacidad" title={t('aviso.s7Title')}>
            <P>
              {t('aviso.s7Body', {
                privacyLink: '__PRIVACY__',
                cookiesLink: '__COOKIES__',
              })
                .split(/(__PRIVACY__|__COOKIES__)/)
                .map((part, i) => {
                  if (part === '__PRIVACY__') {
                    return (
                      <NextLink key={i} href="/politica-de-privacidad" passHref legacyBehavior>
                        <MuiLink>{t('aviso.s7PrivacyLink')}</MuiLink>
                      </NextLink>
                    );
                  }
                  if (part === '__COOKIES__') {
                    return (
                      <NextLink key={i} href="/politica-de-cookies" passHref legacyBehavior>
                        <MuiLink>{t('aviso.s7CookiesLink')}</MuiLink>
                      </NextLink>
                    );
                  }
                  return part;
                })}
            </P>
          </Section>

          <Section id="cancelaciones" title={t('aviso.s8Title')}>
            <P>{t('aviso.s8Intro')}</P>

            <SubHeading>{t('aviso.s8HourlyTitle')}</SubHeading>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><strong>{t('aviso.s8HourlyB1Strong')}</strong> {t('aviso.s8HourlyB1')}</li>
              <li>{t('aviso.s8HourlyB2')}</li>
              <li>{t('aviso.s8HourlyB3')}</li>
            </Box>

            <SubHeading>{t('aviso.s8SubsTitle')}</SubHeading>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>{t('aviso.s8SubsB1')}</li>
              <li>{t('aviso.s8SubsB2')}</li>
              <li>{t('aviso.s8SubsB3')}</li>
            </Box>

            <SubHeading>{t('aviso.s8ModsTitle')}</SubHeading>
            <P>{t('aviso.s8ModsBody')}</P>

            <SubHeading>{t('aviso.s8ForceTitle')}</SubHeading>
            <P>{t('aviso.s8ForceBody')}</P>

            <SubHeading>{t('aviso.s8RefundTitle')}</SubHeading>
            <P>{t('aviso.s8RefundBody')}</P>
          </Section>

          <Section id="modificaciones" title={t('aviso.s9Title')}>
            <P>{t('aviso.s9Body')}</P>
          </Section>

          <Section id="ley" title={t('aviso.s10Title')}>
            <P>{t('aviso.s10Body')}</P>
          </Section>

          <Section id="contacto" title={t('aviso.s11Title')}>
            <P>
              {t('aviso.s11Body')}{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
