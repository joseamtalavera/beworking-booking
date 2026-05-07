import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import TurnstileWidget from '../oficina-virtual/TurnstileWidget';
import { tokens } from '@/theme/tokens';
import { trackInquirySubmitted } from '@/utils/analytics';

const { colors, radius, motion, typography } = tokens;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const SUBJECT_ALIASES = { Visita: 'Tour', Tour: 'Visita' };

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: `${radius.md}px`,
    bgcolor: colors.bg,
    '& fieldset': { borderColor: colors.line },
    '&:hover fieldset': { borderColor: colors.ink3 },
    '&.Mui-focused fieldset': { borderColor: colors.brand, borderWidth: 1 },
  },
  '& .MuiOutlinedInput-input': { fontSize: '0.95rem' },
};

// Mirrors SigninCard.js layout: eyebrow + H2 heading + form fields wrapped
// in FormControl/FormLabel pairs, green-pill submit, Turnstile below.
// Used standalone on /contact and inside ContactDialog popped from CTAs.
export default function ContactCard({ defaultSubject = '', onSuccess, compact = false, hideHeader = false }) {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  const subjectsRaw = t('contact.form.subjects', { returnObjects: true });
  const subjects = Array.isArray(subjectsRaw) ? subjectsRaw : [];

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);

  // Pre-fill subject on mount or when defaultSubject changes (CTA-driven).
  // Cross-language alias: if URL says 'Visita' but the user is on EN, map to 'Tour'.
  useEffect(() => {
    if (!defaultSubject || subjects.length === 0) return;
    let target = subjects.includes(defaultSubject) ? defaultSubject : null;
    if (!target) {
      const alias = SUBJECT_ALIASES[defaultSubject];
      if (alias && subjects.includes(alias)) target = alias;
    }
    if (target) setForm((p) => ({ ...p, subject: target }));
  }, [defaultSubject, subjects.length]);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact-page', turnstileToken }),
      });
      if (res.ok) {
        setStatus('success');
        trackInquirySubmitted({ subject: form.subject, source: 'contact-page' });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTurnstileReset((s) => s + 1);
        // Don't auto-close — the success card stays until the user clicks
        // Cerrar / Close, which is when onSuccess fires (see button below).
      } else {
        setStatus('error');
        setTurnstileReset((s) => s + 1);
      }
    } catch {
      setStatus('error');
      setTurnstileReset((s) => s + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        bgcolor: colors.bg,
        borderRadius: `${radius.lg}px`,
        border: compact ? 'none' : `1px solid ${colors.line}`,
        p: compact ? 0 : { xs: 3.5, sm: 4.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {status === 'success' ? (
        // Full-card success state — replaces the form. User closes manually
        // via the Cerrar/Close button (which fires onSuccess → dialog closes).
        <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 64, color: colors.brand }} />
          <Box
            component="h2"
            sx={{
              ...typography.h2,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
              fontSize: { xs: '1.6rem', sm: '1.85rem' },
            }}
          >
            {isEs ? '¡Recibido!' : 'Got it!'}
          </Box>
          <Typography sx={{ ...typography.body, color: colors.ink2, maxWidth: 360 }}>
            {isEs
              ? 'Te contactaremos en menos de un día hábil.'
              : 'We will get back to you within one business day.'}
          </Typography>
          <Button
            onClick={() => {
              if (typeof onSuccess === 'function') {
                onSuccess();
              } else {
                // Standalone page (no parent close handler) — return to a fresh
                // form so the user can submit another message if they want.
                setStatus(null);
              }
            }}
            variant="contained"
            disableElevation
            sx={{
              mt: 1,
              bgcolor: colors.brand,
              color: colors.bg,
              borderRadius: `${radius.pill}px`,
              px: 3.5,
              py: 1.2,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
            }}
          >
            {isEs ? 'Cerrar' : 'Close'}
          </Button>
        </Box>
      ) : (
      <>
      {!hideHeader && (
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography sx={{ ...typography.eyebrow, color: colors.brand, textTransform: 'uppercase', mb: 1 }}>
            BeWorking
          </Typography>
          <Box
            component="h2"
            sx={{
              ...typography.h2,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
              fontSize: { xs: '1.85rem', sm: '2.1rem' },
            }}
          >
            {isEs ? 'Contacto' : 'Contact'}
          </Box>
          <Typography
            sx={{
              ...typography.body,
              color: colors.ink2,
              mt: 1.25,
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
            }}
          >
            {isEs
              ? 'Introduce tus datos de contacto para empezar.'
              : 'Please enter your contact details to get started.'}
          </Typography>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {status === 'success' && (
          <Typography sx={{ ...typography.body, color: colors.brand, textAlign: 'center', mb: 0.5 }}>
            {t('contact.form.success', '¡Mensaje enviado! Nos pondremos en contacto pronto.')}
          </Typography>
        )}
        {status === 'error' && (
          <Typography sx={{ ...typography.body, color: '#b3261e', textAlign: 'center', mb: 0.5 }}>
            {t('contact.form.error', 'Algo salió mal. Inténtalo de nuevo.')}
          </Typography>
        )}

        <FormControl>
          <FormLabel htmlFor="name" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('contact.form.name', 'Nombre completo')} *
          </FormLabel>
          <TextField
            id="name"
            name="name"
            required
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleChange('name')}
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            Email *
          </FormLabel>
          <TextField
            id="email"
            type="email"
            name="email"
            required
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={handleChange('email')}
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('contact.form.phone', isEs ? 'Teléfono' : 'Phone')}
          </FormLabel>
          <TextField
            id="phone"
            type="tel"
            name="phone"
            fullWidth
            variant="outlined"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+34 600 000 000"
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="subject" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('contact.form.subject', 'Asunto')} *
          </FormLabel>
          <TextField
            id="subject"
            name="subject"
            select
            required
            fullWidth
            variant="outlined"
            value={form.subject}
            onChange={handleChange('subject')}
            sx={fieldSx}
          >
            {subjects.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="message" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('contact.form.message', isEs ? 'Tu mensaje' : 'Your message')}
          </FormLabel>
          <TextField
            id="message"
            name="message"
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            value={form.message}
            onChange={handleChange('message')}
            sx={fieldSx}
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
          disableElevation
          sx={{
            bgcolor: colors.brand,
            color: colors.bg,
            borderRadius: `${radius.pill}px`,
            py: 1.4,
            fontSize: '0.95rem',
            fontWeight: 600,
            textTransform: 'none',
            transition: `background-color ${motion.duration} ${motion.ease}`,
            '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
          }}
        >
          {loading
            ? (isEs ? 'Enviando…' : 'Sending…')
            : t('contact.form.button', isEs ? 'Enviar mensaje' : 'Send message')}
        </Button>

        {TURNSTILE_SITE_KEY && (
          <Box sx={{ my: 0.5, display: 'flex', justifyContent: 'center' }}>
            <TurnstileWidget
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
              resetSignal={turnstileReset}
            />
          </Box>
        )}

        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: colors.ink3,
            lineHeight: 1.5,
            mt: 0.25,
          }}
        >
          {isEs ? 'Al enviar este formulario aceptas nuestra ' : 'By submitting this form you agree to our '}
          <Link
            href="/politica-de-privacidad"
            style={{
              color: colors.brand,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
          </Link>
          .
        </Typography>
      </Box>
      </>
      )}
    </Box>
  );
}
