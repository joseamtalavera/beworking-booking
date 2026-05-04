import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';
import ContactCard from '@/components/contact/ContactCard';

const { colors, motion, typography } = tokens;

export default function Contact() {
  const { t } = useTranslation();
  const router = useRouter();
  const [defaultSubject, setDefaultSubject] = useState('');

  // Pre-fill subject from ?subject= so deep-links from CTAs land on the
  // right option (same behavior as the popup's deep-link handling).
  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.subject;
    if (typeof raw === 'string' && raw) setDefaultSubject(raw);
  }, [router.isReady, router.query.subject]);

  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const offices = t('contact.info.offices', { returnObjects: true });
  const officesArr = Array.isArray(offices) ? offices : [];

  return (
    <>
      <Head>
        <title>{t('contact.hero.heading')} — BeWorking</title>
        <meta name="description" content={t('contact.hero.subheading')} />
        <link rel="canonical" href="https://be-working.com/contact" />
      </Head>

      {/* Hero */}
      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 9 },
          px: { xs: 3, md: 5 },
          textAlign: 'center',
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 660,
            mx: 'auto',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Typography sx={{ ...typography.eyebrow, color: colors.brand, textTransform: 'uppercase', mb: 2 }}>
            {t('contact.hero.label')}
          </Typography>
          <Box
            component="h1"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {t('contact.hero.heading').replace(/\.$/, '')}
            <Box component="span" sx={{ color: colors.brand }}>.</Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 480, mx: 'auto' }}>
            {t('contact.hero.subheading')}
          </Typography>
        </Box>
      </Box>

      {/* Form + Info */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1080,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'flex-start',
          }}
        >
          {/* Form card — shared component, no internal header (the page hero already covers it) */}
          <ContactCard defaultSubject={defaultSubject} hideHeader />

          {/* Info column */}
          <Box>
            <Box
              component="h2"
              sx={{
                ...typography.h3,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
                mb: 3.5,
              }}
            >
              {t('contact.info.heading')}
            </Box>

            {officesArr.map((office) => {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.address || ''} ${office.zip || ''} ${office.city || ''}`.trim())}`;
              const telHref = office.phone ? `tel:${office.phone.replace(/[^+\d]/g, '')}` : null;
              return (
                <Box key={office.city} sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: colors.ink, mb: 2 }}>
                    {office.city}
                  </Typography>
                  {[
                    { Icon: LocationOnIcon, text: `${office.address}\n${office.zip}`, href: mapUrl, external: true },
                    { Icon: PhoneIcon, text: office.phone, href: telHref, external: false },
                  ].filter(item => item.text && item.href).map(({ Icon, text, href, external }) => (
                    <Box
                      key={text}
                      component="a"
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      sx={{
                        display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2,
                        textDecoration: 'none', color: 'inherit',
                        transition: 'opacity 0.15s ease',
                        '&:hover': { opacity: 0.7 },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36, height: 36, borderRadius: '50%',
                          bgcolor: colors.brandSoft,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: 17, color: colors.brand }} />
                      </Box>
                      <Typography sx={{ ...typography.body, color: colors.ink2, whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            })}

            <Box
              component="a"
              href={`mailto:${t('contact.info.email')}`}
              sx={{
                display: 'flex', alignItems: 'flex-start', gap: 1.5,
                textDecoration: 'none', color: 'inherit',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: colors.brandSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <EmailIcon sx={{ fontSize: 17, color: colors.brand }} />
              </Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {t('contact.info.email')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
