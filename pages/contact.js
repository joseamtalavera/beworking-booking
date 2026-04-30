import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Box, Typography, TextField, Button, MenuItem, Stack, Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography, layout } = tokens;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const subjectsRaw = t('contact.form.subjects', { returnObjects: true });
  const subjects = Array.isArray(subjectsRaw) ? subjectsRaw : [];

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact-page' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: `${radius.md}px`,
      bgcolor: colors.bg,
      '& fieldset': { borderColor: colors.line },
      '&:hover fieldset': { borderColor: colors.ink3 },
      '&.Mui-focused fieldset': { borderColor: colors.brand, borderWidth: 1 },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: colors.brand },
  };

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
          <Typography
            sx={{
              ...typography.eyebrow,
              color: colors.brand,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
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
          {/* Form card */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: colors.bg,
              borderRadius: `${radius.lg}px`,
              border: `1px solid ${colors.line}`,
              p: { xs: 3, md: 4.5 },
            }}
          >
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label={t('contact.form.name')}
                value={form.name}
                onChange={handleChange('name')}
                required
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label={t('contact.form.email')}
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                required
                sx={fieldSx}
              />
              <TextField
                fullWidth
                select
                label={t('contact.form.subject')}
                value={form.subject}
                onChange={handleChange('subject')}
                required
                sx={fieldSx}
              >
                {subjects.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                multiline
                rows={5}
                label={t('contact.form.message')}
                value={form.message}
                onChange={handleChange('message')}
                required
                sx={fieldSx}
              />
              {status === 'success' && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: `${radius.md}px`,
                    bgcolor: colors.brandSoft,
                    color: colors.brandDeep,
                    border: `1px solid ${colors.brand}`,
                    '& .MuiAlert-icon': { color: colors.brand },
                  }}
                >
                  {t('contact.form.success')}
                </Alert>
              )}
              {status === 'error' && (
                <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>
                  {t('contact.form.error')}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                disableElevation
                sx={{
                  bgcolor: colors.brand,
                  color: colors.bg,
                  borderRadius: `${radius.pill}px`,
                  px: 4,
                  py: 1.4,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  alignSelf: 'flex-start',
                  '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
                  '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
                }}
              >
                {t('contact.form.button')}
              </Button>
            </Stack>
          </Box>

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

            {officesArr.map((office) => (
              <Box key={office.city} sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: colors.ink, mb: 2 }}>
                  {office.city}
                </Typography>
                {[
                  { Icon: LocationOnIcon, text: `${office.address}\n${office.zip}` },
                  { Icon: PhoneIcon, text: office.phone },
                ].map(({ Icon, text }) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
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
                      <Icon sx={{ fontSize: 17, color: colors.brand }} />
                    </Box>
                    <Typography sx={{ ...typography.body, color: colors.ink2, whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
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
