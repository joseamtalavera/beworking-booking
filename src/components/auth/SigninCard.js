import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import TurnstileWidget from '../oficina-virtual/TurnstileWidget';
import ForgotPassword from './ForgotPassword';
import AccountSelector from './AccountSelector';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

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

export default function SignInCard() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [turnstileToken, setTurnstileToken] = React.useState('');
  const [turnstileReset, setTurnstileReset] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [accountSelection, setAccountSelection] = React.useState(null);
  const router = require('next/router').useRouter ? require('next/router').useRouter() : null;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(isEs ? 'Introduce un email válido.' : 'Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage(isEs ? 'La contraseña debe tener al menos 8 caracteres.' : 'Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const payload = { email, password, turnstileToken };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      const keepLogs = typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.getItem('beworking_debug_keep_logs') === '1';

      if (response.ok) {
        if (data?.accountSelectionRequired) {
          setAccountSelection({
            accounts: data.accounts,
            selectionToken: data.selectionToken,
            role: data.role,
          });
          return;
        }

        const adminDashboardUrl = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 'http://localhost:5173/admin';
        const userDashboardUrl = process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || 'http://localhost:5173/user';
        const baseDestination = data.role === 'ADMIN' ? adminDashboardUrl : userDashboardUrl;
        const destination = data?.token
          ? `${baseDestination}${baseDestination.includes('?') ? '&' : '?'}token=${encodeURIComponent(data.token)}`
          : baseDestination;

        if (keepLogs) {
          setFormError('DEBUG: login successful — logs preserved (remove sessionStorage key beworking_debug_keep_logs to allow redirect)');
        } else if (typeof window !== 'undefined') {
          window.location.href = destination;
        } else if (router) {
          router.push(destination);
        }
      } else {
        setFormError(data?.message || (isEs ? 'No se pudo iniciar sesión.' : 'Login failed.'));
        if ((data?.message || '').toLowerCase().includes('turnstile')) {
          setTurnstileToken('');
          setTurnstileReset((prev) => prev + 1);
        }
      }
    } catch (error) {
      setFormError(error.message || (isEs ? 'Ha ocurrido un error.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (accountSelection) {
    return (
      <AccountSelector
        accounts={accountSelection.accounts}
        selectionToken={accountSelection.selectionToken}
        role={accountSelection.role}
        onBack={() => setAccountSelection(null)}
      />
    );
  }

  return (
    <Box
      sx={{
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
      }}
    >
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
          {t('nav.signIn')}
        </Box>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {formError && (
          <Typography sx={{ ...typography.body, color: '#b3261e', textAlign: 'center', mb: 0.5 }}>
            {formError}
          </Typography>
        )}

        <FormControl>
          <FormLabel htmlFor="email" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            Email
          </FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={fieldSx}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {isEs ? 'Contraseña' : 'Password'}
          </FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}>
            <Link
              href="#"
              onClick={(e) => { e.preventDefault(); handleClickOpen(); }}
              sx={{
                fontSize: '0.85rem',
                color: colors.brand,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { color: colors.brandDeep, textDecoration: 'underline' },
              }}
            >
              {isEs ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
            </Link>
          </Box>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              sx={{
                color: colors.line,
                '&.Mui-checked': { color: colors.brand },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: '0.9rem', color: colors.ink2 }}>
              {isEs ? 'Recuérdame' : 'Remember me'}
            </Typography>
          }
        />
        <ForgotPassword open={open} handleClose={handleClose} />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || (siteKey && !turnstileToken)}
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
          {loading ? (isEs ? 'Cargando…' : 'Loading…') : (isEs ? 'Acceder' : 'Sign in')}
        </Button>

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

        <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: colors.ink2 }}>
          {isEs ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
          <Link
            href="/register"
            sx={{
              color: colors.brand,
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { color: colors.brandDeep, textDecoration: 'underline' },
            }}
          >
            {t('nav.getStarted')}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
