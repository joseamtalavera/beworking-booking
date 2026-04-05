import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import TurnstileWidget from '../oficina-virtual/TurnstileWidget';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://be-working.com';
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: 520,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  borderRadius: 10,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 520,
    padding: theme.spacing(4),
  },
}));

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
      <Card variant="outlined">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t('register.simple.successTitle', 'Check your email')}
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 340, mx: 'auto' }}>
            {t('register.simple.successBody', 'We sent a confirmation link to your email. Click it to activate your account.')}
          </Typography>
        </Box>
        <Typography sx={{ textAlign: 'center' }}>
          {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
          <Link href={`${FRONTEND_URL}/main/login`} sx={{ textDecoration: 'none', fontWeight: 700 }}>
            {t('register.signIn', 'Sign in')}
          </Link>
        </Typography>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', alignSelf: 'center' }}
      >
        {t('register.simple.title', 'Create your account')}
      </Typography>

      {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.name', 'Full name')}</FormLabel>
          <TextField
            required fullWidth placeholder="Jon Snow"
            value={form.name} onChange={handleChange('name')}
            error={!!errors.name} helperText={errors.name || ''}
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.email', 'Email')}</FormLabel>
          <TextField
            required fullWidth type="email" placeholder="your@email.com"
            value={form.email} onChange={handleChange('email')}
            error={!!errors.email} helperText={errors.email || ''}
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.password', 'Password')}</FormLabel>
          <TextField
            required fullWidth placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            value={form.password} onChange={handleChange('password')}
            error={!!errors.password} helperText={errors.password || ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} onMouseDown={(e) => e.preventDefault()} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.confirmPassword', 'Confirm password')}</FormLabel>
          <TextField
            required fullWidth placeholder="••••••"
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword} onChange={handleChange('confirmPassword')}
            error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} onMouseDown={(e) => e.preventDefault()} edge="end" size="small">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {siteKey && (
          <Box sx={{ my: 1 }}>
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
          disabled={loading || (!!siteKey && !turnstileToken)}
          sx={{ borderRadius: '999px', py: 1.25 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : t('register.simple.submit', 'Create account')}
        </Button>
      </Box>

      <Typography sx={{ textAlign: 'center' }}>
        {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
        <Link href={`${FRONTEND_URL}/main/login`} sx={{ textDecoration: 'none', fontWeight: 700 }}>
          {t('register.signIn', 'Sign in')}
        </Link>
      </Typography>
    </Card>
  );
}
