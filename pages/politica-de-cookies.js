import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
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
  { name: 'CookieConsent', provider: 'Cookiebot', purposeKey: 'consent', durationKey: 'twelveMonths', categoryKey: 'necessary' },
  { name: 'beworking_access', provider: 'BeWorking', purposeKey: 'authAccess', durationKey: 'fifteenMin', categoryKey: 'necessary' },
  { name: 'beworking_refresh', provider: 'BeWorking', purposeKey: 'authRefresh', durationKey: 'sevenDays', categoryKey: 'necessary' },
  { name: '__stripe_mid, __stripe_sid', provider: 'Stripe', purposeKey: 'stripeFraud', durationKey: 'yearOrSession', categoryKey: 'necessary' },
  { name: '_ga, _ga_<container-id>', provider: 'Google Analytics 4', purposeKey: 'ga4Visitor', durationKey: 'twoYears', categoryKey: 'statistics' },
  { name: '_gid', provider: 'Google Analytics', purposeKey: 'gaDistinguish', durationKey: 'twentyFourHours', categoryKey: 'statistics' },
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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const canonical = isEn
    ? 'https://be-working.com/politica-de-cookies?lang=en'
    : 'https://be-working.com/politica-de-cookies';

  return (
    <>
      <Head>
        <title>{`${t('cookies.title')} — BeWorking`}</title>
        <meta name="description" content={t('cookies.intro').slice(0, 160)} />
        <link rel="canonical" href={canonical} />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 1 }}>
            {t('cookies.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            {t('cookies.lastUpdated')}
          </Typography>

          <P>{t('cookies.intro')}</P>

          <Section id="what" title={t('cookies.s1Title')}>
            <P>{t('cookies.s1Body')}</P>
          </Section>

          <Section id="types" title={t('cookies.s2Title')}>
            <P>{t('cookies.s2Body')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><strong>{t('cookies.s2NecessaryLabel')}:</strong> {t('cookies.s2NecessaryBody')}</li>
              <li><strong>{t('cookies.s2StatisticsLabel')}:</strong> {t('cookies.s2StatisticsBody')}</li>
              <li><strong>{t('cookies.s2MarketingLabel')}:</strong> {t('cookies.s2MarketingBody')}</li>
            </Box>
          </Section>

          <Section id="list" title={t('cookies.s3Title')}>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t('cookies.s3HeaderName')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('cookies.s3HeaderProvider')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('cookies.s3HeaderPurpose')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('cookies.s3HeaderDuration')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('cookies.s3HeaderCategory')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {COOKIES.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.name}</TableCell>
                      <TableCell>{c.provider}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{t(`cookies.purposes.${c.purposeKey}`)}</TableCell>
                      <TableCell>{t(`cookies.durations.${c.durationKey}`)}</TableCell>
                      <TableCell>{t(`cookies.categories.${c.categoryKey}`)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <P sx={{ fontSize: '0.85rem' }}>{t('cookies.s3Note')}</P>
          </Section>

          <Section id="third-parties" title={t('cookies.s4Title')}>
            <P>{t('cookies.s4Body')}</P>
          </Section>

          <Section id="manage" title={t('cookies.s5Title')}>
            <P>{t('cookies.s5Body')}</P>
            <Button variant="contained" color="primary" onClick={handleOpenPreferences} sx={{ mt: 1 }}>
              {t('cookies.s5Button')}
            </Button>
            <P sx={{ mt: 3 }}>{t('cookies.s5BrowserNote')}</P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><MuiLink href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</MuiLink></li>
              <li><MuiLink href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener">Mozilla Firefox</MuiLink></li>
              <li><MuiLink href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener">Safari</MuiLink></li>
              <li><MuiLink href="https://support.microsoft.com/help/4027947" target="_blank" rel="noopener">Microsoft Edge</MuiLink></li>
            </Box>
          </Section>

          <Section id="changes" title={t('cookies.s6Title')}>
            <P>{t('cookies.s6Body')}</P>
          </Section>

          <Section id="contact" title={t('cookies.s7Title')}>
            <P>
              {t('cookies.s7Body')}{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
