import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import TurnstileWidget from '../oficina-virtual/TurnstileWidget';
import ForgotPassword from './ForgotPassword';
import AccountSelector from './AccountSelector';
import { GoogleIcon, SitemarkIcon } from './CustomIcons';

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
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));


export default function SignInCard() {
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long.');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(err => {
        return null;
      });
      // Developer debug toggle: set sessionStorage.beworking_debug_keep_logs = '1' to prevent redirect and keep logs
      const keepLogs = typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.getItem('beworking_debug_keep_logs') === '1';

      if (response.ok) {
        // Multi-account: show account picker
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
          // Developer mode: do not navigate away so console logs remain available
          setFormError('DEBUG: login successful — logs preserved (remove sessionStorage key beworking_debug_keep_logs to allow redirect)');
        } else {
          if (typeof window !== 'undefined') {
            window.location.href = destination;
          } else if (router) {
            router.push(destination);
          }
        }
      } else {
        setFormError(data?.message || 'Login failed.');
        if ((data?.message || '').toLowerCase().includes('turnstile')) {
          setTurnstileToken('');
          setTurnstileReset((prev) => prev + 1);
        }
      }
    } catch (error) {
      setFormError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Show account picker if multi-account detected
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
    <Card variant="outlined">
      {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box> */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', alignSelf: 'center' }}
      >
        Login in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {formError && (
          <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>{formError}</Typography>
        )}
        <FormControl>
          <FormLabel htmlFor="email" sx={{ color: 'text.primary', fontWeight: 500 }}>Email</FormLabel>
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
            color={emailError ? 'error' : 'primary'}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password" sx={{ color: 'text.primary', fontWeight: 500 }}>Password</FormLabel>
            {/* <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline', textDecoration: 'none', fontWeight: 700 }}
            >
              Forgot your password?
            </Link> */}
          </Box>
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
            color={passwordError ? 'error' : 'primary'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(prev => !prev)}
                    onMouseDown={e => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Link
              //component="button"
              //type="button"
              href="#"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline', textDecoration: 'none', fontWeight: 700 }}
            >
              Forgot your password?
            </Link>
          </Box>

        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || (siteKey && !turnstileToken)}
          sx={{ borderRadius: '999px', py: 1.25 }}
        >
          {loading ? 'Loading...' : 'Acceder'}
        </Button>
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
        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            //variant="body2"
            sx={{ alignSelf: 'center', textDecoration: 'none', fontWeight: 700 }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
     {/*  <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
      </Box> */}
    </Card>
  );
}
