import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '../common/ClearableTextField';
import TurnstileWidget from '../oficina-virtual/TurnstileWidget';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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

const cardSx = {
  width: '100%',
  maxWidth: 480,
  mx: 'auto',
  bgcolor: colors.bg,
  borderRadius: `${radius.lg}px`,
  border: `1px solid ${colors.line}`,
  p: { xs: 3.5, sm: 4.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
};

const linkSx = {
  color: colors.brand,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': { color: colors.brandDeep, textDecoration: 'underline' },
};

const primaryButtonSx = {
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
};

export default function SimpleSignUp() {
  const { t } = useTranslation();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('register.errors.nameRequired', 'Name is required.');
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = t('register.errors.emailRequired', 'Enter a valid email.');
    if (!form.password || form.password.length < 8) errs.password = t('register.errors.passwordMin', 'Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('register.errors.passwordMatch', 'Passwords do not match.');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          turnstileToken,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data.message || data.error || 'Registration failed.';
        setApiError(msg);
        if (msg.toLowerCase().includes('turnstile')) {
          setTurnstileToken('');
          setTurnstileReset((prev) => prev + 1);
        }
      }
    } catch {
      setApiError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={cardSx}>
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: colors.brand, mb: 2 }} />
          <Box
            component="h1"
            sx={{
              ...typography.h3,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
              mb: 1.5,
            }}
          >
            {t('register.simple.successTitle', 'Check your email')}
          </Box>
          <Typography sx={{ ...typography.body, color: colors.ink2, maxWidth: 360, mx: 'auto' }}>
            {t('register.simple.successBody', 'We sent a confirmation link to your email. Click it to activate your account.')}
          </Typography>
        </Box>
        <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: colors.ink2 }}>
          {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
          <Link href="/login" sx={linkSx}>
            {t('register.signIn', 'Sign in')}
          </Link>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={cardSx}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          sx={{
            ...typography.eyebrow,
            color: colors.brand,
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          BeWorking
        </Typography>
        <Box
          component="h1"
          sx={{
            ...typography.h2,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
            fontSize: { xs: '1.85rem', sm: '2.1rem' },
          }}
        >
          {t('register.simple.title', 'Create your account')}
        </Box>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>
          {apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('register.fields.name', 'Full name')}
          </FormLabel>
          <TextField
            required
            fullWidth
            placeholder="Jon Snow"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name || ''}
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('register.fields.email', 'Email')}
          </FormLabel>
          <TextField
            required
            fullWidth
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email || ''}
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('register.fields.password', 'Password')}
          </FormLabel>
          <TextField
            required
            fullWidth
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange('password')}
            error={!!errors.password}
            helperText={errors.password || ''}
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                    sx={{ color: colors.ink3 }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {t('register.fields.confirmPassword', 'Confirm password')}
          </FormLabel>
          <TextField
            required
            fullWidth
            placeholder="••••••"
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword || ''}
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                    sx={{ color: colors.ink3 }}
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {siteKey && (
          <Box sx={{ my: 0.5 }}>
            <TurnstileWidget
              siteKey={siteKey}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
              resetSignal={turnstileReset}
            />
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disableElevation
          disabled={loading || (!!siteKey && !turnstileToken)}
          sx={primaryButtonSx}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: colors.bg }} />
          ) : (
            t('register.simple.submit', 'Create account')
          )}
        </Button>
      </Box>

      <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: colors.ink2 }}>
        {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
        <Link href="/login" sx={linkSx}>
          {t('register.signIn', 'Sign in')}
        </Link>
      </Typography>
    </Box>
  );
}
