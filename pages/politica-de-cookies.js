import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
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
import LegalShell, { Section, P, LegalList } from '@/components/common/LegalShell';
import { tokens } from '@/theme/tokens';

const { colors, radius } = tokens;
const linkSx = { color: colors.brand, '&:hover': { color: colors.brandDeep } };

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
      <LegalShell
        title={t('cookies.title')}
        lastUpdated={t('cookies.lastUpdated')}
        intro={t('cookies.intro')}
      >
        <Section id="what" title={t('cookies.s1Title')}>
          <P>{t('cookies.s1Body')}</P>
        </Section>

        <Section id="types" title={t('cookies.s2Title')}>
          <P>{t('cookies.s2Body')}</P>
          <LegalList>
            <li><strong>{t('cookies.s2NecessaryLabel')}:</strong> {t('cookies.s2NecessaryBody')}</li>
            <li><strong>{t('cookies.s2StatisticsLabel')}:</strong> {t('cookies.s2StatisticsBody')}</li>
            <li><strong>{t('cookies.s2MarketingLabel')}:</strong> {t('cookies.s2MarketingBody')}</li>
          </LegalList>
        </Section>

        <Section id="list" title={t('cookies.s3Title')}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              mb: 2,
              border: `1px solid ${colors.line}`,
              borderRadius: `${radius.md}px`,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, color: colors.ink, bgcolor: colors.bgSoft, borderColor: colors.line } }}>
                  <TableCell>{t('cookies.s3HeaderName')}</TableCell>
                  <TableCell>{t('cookies.s3HeaderProvider')}</TableCell>
                  <TableCell>{t('cookies.s3HeaderPurpose')}</TableCell>
                  <TableCell>{t('cookies.s3HeaderDuration')}</TableCell>
                  <TableCell>{t('cookies.s3HeaderCategory')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {COOKIES.map((c) => (
                  <TableRow key={c.name} sx={{ '& td': { borderColor: colors.line } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: colors.ink }}>{c.name}</TableCell>
                    <TableCell sx={{ color: colors.ink }}>{c.provider}</TableCell>
                    <TableCell sx={{ color: colors.ink2 }}>{t(`cookies.purposes.${c.purposeKey}`)}</TableCell>
                    <TableCell sx={{ color: colors.ink2 }}>{t(`cookies.durations.${c.durationKey}`)}</TableCell>
                    <TableCell sx={{ color: colors.ink2 }}>{t(`cookies.categories.${c.categoryKey}`)}</TableCell>
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
          <Button
            variant="contained"
            disableElevation
            onClick={handleOpenPreferences}
            sx={{
              mt: 1,
              bgcolor: colors.brand,
              color: colors.bg,
              borderRadius: `${radius.pill}px`,
              px: 3.5,
              py: 1.2,
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
            }}
          >
            {t('cookies.s5Button')}
          </Button>
          <P sx={{ mt: 3 }}>{t('cookies.s5BrowserNote')}</P>
          <LegalList>
            <li><MuiLink href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" sx={linkSx}>Google Chrome</MuiLink></li>
            <li><MuiLink href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener" sx={linkSx}>Mozilla Firefox</MuiLink></li>
            <li><MuiLink href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener" sx={linkSx}>Safari</MuiLink></li>
            <li><MuiLink href="https://support.microsoft.com/help/4027947" target="_blank" rel="noopener" sx={linkSx}>Microsoft Edge</MuiLink></li>
          </LegalList>
        </Section>

        <Section id="changes" title={t('cookies.s6Title')}>
          <P>{t('cookies.s6Body')}</P>
        </Section>

        <Section id="contact" title={t('cookies.s7Title')}>
          <P>
            {t('cookies.s7Body')}{' '}
            <MuiLink href="mailto:info@be-working.com" sx={linkSx}>info@be-working.com</MuiLink>.
          </P>
        </Section>
      </LegalShell>
    </>
  );
}
