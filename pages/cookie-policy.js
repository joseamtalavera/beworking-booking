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
    purpose: 'Stores the user’s consent state for cookies on this domain.',
    duration: '12 months',
    type: 'Strictly necessary',
  },
  {
    name: 'beworking_access',
    provider: 'BeWorking',
    purpose: 'Keeps the authenticated user session (JWT, httpOnly).',
    duration: '15 minutes',
    type: 'Strictly necessary',
  },
  {
    name: 'beworking_refresh',
    provider: 'BeWorking',
    purpose: 'Allows the session token to be refreshed without re-login (httpOnly).',
    duration: '7 days',
    type: 'Strictly necessary',
  },
  {
    name: '__stripe_mid, __stripe_sid',
    provider: 'Stripe',
    purpose: 'Fraud detection and prevention during payment processing.',
    duration: '1 year / session',
    type: 'Strictly necessary',
  },
  {
    name: '_ga, _ga_<container-id>',
    provider: 'Google Analytics 4',
    purpose: 'Anonymously identifies the visitor to measure site usage.',
    duration: '2 years',
    type: 'Statistics',
  },
  {
    name: '_gid',
    provider: 'Google Analytics',
    purpose: 'Distinguishes visitors for aggregate usage analytics.',
    duration: '24 hours',
    type: 'Statistics',
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

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy — BeWorking</title>
        <meta name="description" content="BeWorking cookie policy. Information about the cookies we use and how to manage them." />
        <link rel="canonical" href="https://be-working.com/cookie-policy" />
      </Head>
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Container maxWidth="md">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700 }}>
              Cookie Policy
            </Typography>
            <MuiLink href="/politica-de-cookies" sx={{ fontSize: '0.875rem' }}>
              Leer en español
            </MuiLink>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Last updated: 28 April 2026
          </Typography>

          <P>
            This Cookie Policy explains how cookies and similar technologies are used on
            be-working.com, in compliance with article 22.2 of Spanish Law 34/2002 on Information
            Society Services (LSSI-CE), the EU General Data Protection Regulation 2016/679 (GDPR), and
            Spanish Organic Law 3/2018 (LOPDGDD).
          </P>

          <Section id="what" title="1. What are cookies?">
            <P>
              A cookie is a small text file that a website saves in the user’s browser or device on
              visit. Cookies allow the site to remember information about the visit — such as preferred
              language, login state, or cart items — and are useful for improving the user experience
              as well as for analytics or advertising purposes.
            </P>
          </Section>

          <Section id="types" title="2. Types of cookies we use">
            <P>
              Cookies are classified following the guidelines of the Spanish Data Protection Agency
              (AEPD):
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li>
                <strong>Strictly necessary cookies:</strong> required for the service to function
                (authentication, security, consent management). Exempt from consent under
                art. 22.2 LSSI.
              </li>
              <li>
                <strong>Statistics cookies:</strong> help us understand in aggregate how the site is
                used. Only activated with the user’s explicit consent.
              </li>
              <li>
                <strong>Marketing cookies:</strong> we currently do not use marketing cookies or
                personalised advertising.
              </li>
            </Box>
          </Section>

          <Section id="list" title="3. Cookies in use">
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Purpose</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
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
              Cloudflare Turnstile, used for anti-bot protection on forms, issues ephemeral tokens
              that are not stored as persistent browser cookies.
            </P>
          </Section>

          <Section id="third-parties" title="4. Third-party cookies">
            <P>
              Some cookies are issued by third parties that provide services to us (Google for
              analytics, Stripe for payment processing, Cookiebot for consent management). These third
              parties may process data in countries outside the European Economic Area; please consult
              their respective policies for further information.
            </P>
          </Section>

          <Section id="manage" title="5. How to manage your preferences">
            <P>
              You can accept, reject or configure the use of cookies at any time from the preferences
              panel. Your choice is stored for 12 months unless you delete it manually.
            </P>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPreferences}
              sx={{ mt: 1 }}
            >
              Manage cookie preferences
            </Button>
            <P sx={{ mt: 3 }}>
              You can also delete cookies directly from your browser. Instructions are available in
              each browser’s official documentation:
            </P>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.75, pl: 3, mb: 2 }}>
              <li><MuiLink href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</MuiLink></li>
              <li><MuiLink href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener">Mozilla Firefox</MuiLink></li>
              <li><MuiLink href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener">Safari</MuiLink></li>
              <li><MuiLink href="https://support.microsoft.com/help/4027947" target="_blank" rel="noopener">Microsoft Edge</MuiLink></li>
            </Box>
          </Section>

          <Section id="changes" title="6. Changes to this policy">
            <P>
              We may update this Cookie Policy to reflect changes in our practices or for legal
              reasons. The "last updated" date at the top of the page indicates when the current
              version was published.
            </P>
          </Section>

          <Section id="contact" title="7. Contact">
            <P>
              For any questions about this policy you can contact us at{' '}
              <MuiLink href="mailto:info@be-working.com">info@be-working.com</MuiLink>.
            </P>
          </Section>
        </Container>
      </Box>
    </>
  );
}
