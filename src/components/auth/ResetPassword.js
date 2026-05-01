import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
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

export default function ResetPassword() {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const router = useRouter();
  const { token } = router.isReady ? router.query : {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    let valid = true;
    if (
      !password
      || password.length < 8
      || !/(?=.*[a-z])/.test(password)
      || !/(?=.*[A-Z])/.test(password)
      || !/(?=.*\d)/.test(password)
      || !/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*/.test(password)
    ) {
      setPasswordError(isEs
        ? 'La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula, número y símbolo.'
        : 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (password !== confirmPassword) {
      setConfirmError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      valid = false;
    } else {
      setConfirmError('');
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.text();
      if (response.ok) {
        setFormSuccess(isEs
          ? 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.'
          : 'Password reset successfully. You can now log in.');
      } else {
        setFormError(data || (isEs
          ? 'No se pudo restablecer la contraseña. El enlace puede ser inválido o haber caducado.'
          : 'Reset failed. The link may be invalid or expired.'));
      }
    } catch {
      setFormError(isEs ? 'Ha ocurrido un error. Inténtalo de nuevo.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {isEs ? 'Restablecer contraseña' : 'Reset password'}
        </Box>
      </Box>

      {router.isReady && !token && (
        <Typography sx={{ ...typography.body, color: '#b3261e', textAlign: 'center' }}>
          {isEs
            ? 'Enlace no válido o ausente. Solicita un nuevo restablecimiento de contraseña.'
            : 'Invalid or missing reset link. Please request a new password reset.'}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor="password" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {isEs ? 'Nueva contraseña' : 'New password'}
          </FormLabel>
          <TextField
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={isEs ? 'Mostrar/ocultar contraseña' : 'Toggle password visibility'}
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirm-password" sx={{ color: colors.ink, fontWeight: 600, fontSize: '0.85rem', mb: 0.75 }}>
            {isEs ? 'Confirmar contraseña' : 'Confirm password'}
          </FormLabel>
          <TextField
            placeholder="••••••"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmError}
            helperText={confirmError}
            fullWidth
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={isEs ? 'Mostrar/ocultar contraseña' : 'Toggle password visibility'}
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {formError && (
          <Typography sx={{ ...typography.body, color: '#b3261e' }}>{formError}</Typography>
        )}
        {formSuccess && (
          <Typography sx={{ ...typography.body, color: colors.brand, fontWeight: 500 }}>
            {formSuccess}
          </Typography>
        )}

        {formSuccess ? (
          <Button
            variant="contained"
            disableElevation
            onClick={() => router.push('/login')}
            sx={{ ...primaryButtonSx, mt: 1 }}
          >
            {isEs ? 'Ir a iniciar sesión' : 'Go to sign in'}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading || !token}
            sx={{ ...primaryButtonSx, mt: 1 }}
          >
            {loading
              ? (isEs ? 'Restableciendo…' : 'Resetting…')
              : (isEs ? 'Restablecer contraseña' : 'Reset password')}
          </Button>
        )}
      </Box>
    </Box>
  );
}
