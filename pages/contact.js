import { useState } from 'react';
import Head from 'next/head';
import {
  Box, Typography, TextField, Button, MenuItem, Stack, Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/common/ScrollReveal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const subjects = t('contact.form.subjects', { returnObjects: true });

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

  return (
    <>
      <Head>
        <title>Contact — BeWorking</title>
        <meta name="description" content="Get in touch with BeWorking. We'll get back to you within one business day." />
        <link rel="canonical" href="https://be-working.com/contact" />
      </Head>

      {/* Hero */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: '80px', md: '112px' },
          pb: { xs: '64px', md: '80px' },
          px: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <ScrollReveal direction="up">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}>
            {t('contact.hero.label')}
          </Typography>
          <Typography variant="h2" component="h1" sx={{ color: 'text.primary', maxWidth: 560, mx: 'auto', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, lineHeight: 1.15 }}>
            {t('contact.hero.heading')}
          </Typography>
          <Typography component="p" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto', mt: 4, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, display: 'block' }}>
            {t('contact.hero.subheading')}
          </Typography>
        </ScrollReveal>
      </Box>

      {/* Form + Info */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Box
          sx={{
            maxWidth: 1000,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'flex-start',
          }}
        >
          <ScrollReveal direction="left">
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField fullWidth label={t('contact.form.name')} value={form.name} onChange={handleChange('name')} required />
                <TextField fullWidth label={t('contact.form.email')} type="email" value={form.email} onChange={handleChange('email')} required />
                <TextField fullWidth select label={t('contact.form.subject')} value={form.subject} onChange={handleChange('subject')} required>
                  {(subjects || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label={t('contact.form.message')}
                  value={form.message}
                  onChange={handleChange('message')}
                  required
                />
                {status === 'success' && <Alert severity="success">{t('contact.form.success')}</Alert>}
                {status === 'error' && <Alert severity="error">{t('contact.form.error')}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ borderRadius: '999px', px: 4, py: 1.25, fontSize: '0.875rem', alignSelf: 'flex-start' }}
                >
                  {t('contact.form.button')}
                </Button>
              </Stack>
            </Box>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <Typography variant="h4" component="h2" sx={{ mb: 4, fontSize: '1.5rem', fontWeight: 700 }}>
              {t('contact.info.heading')}
            </Typography>
            {(t('contact.info.offices', { returnObjects: true }) || []).map((office) => (
              <Box key={office.city} sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: 'text.primary', mb: 2 }}>
                  {office.city}
                </Typography>
                {[
                  { icon: LocationOnIcon, text: `${office.address}\n${office.zip}` },
                  { icon: PhoneIcon, text: office.phone },
                ].map(({ icon: Icon, text }) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(0,150,36,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                      <Icon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', pt: 0.5, whiteSpace: 'pre-line' }}>{text}</Typography>
                  </Box>
                ))}
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(0,150,36,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', pt: 0.5 }}>{t('contact.info.email')}</Typography>
            </Box>
          </ScrollReveal>
        </Box>
      </Box>
    </>
  );
}
