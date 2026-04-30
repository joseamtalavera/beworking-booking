import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const primaryButtonSx = {
  bgcolor: colors.brand,
  color: colors.bg,
  borderRadius: `${radius.pill}px`,
  px: 3,
  py: 1,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: `background-color ${motion.duration} ${motion.ease}`,
  '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
  '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
};

const secondaryButtonSx = {
  borderRadius: `${radius.pill}px`,
  px: 3,
  py: 1,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  color: colors.ink,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
  '&:hover': { borderColor: colors.ink3, bgcolor: colors.bgSoft },
};

function ForgotPassword({ open, handleClose }) {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [formMessage, setFormMessage] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage('');
    setEmailError(false);
    setEmailErrorMessage('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(isEs ? 'Introduce un email válido.' : 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        setFormMessage(isEs ? 'Ha ocurrido un error. Inténtalo de nuevo.' : 'An error occurred. Please try again.');
      }
    } catch {
      setFormMessage(isEs ? 'Ha ocurrido un error. Inténtalo de nuevo.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: success ? undefined : 'form',
          onSubmit: success ? undefined : handleSubmit,
          sx: {
            backgroundImage: 'none',
            borderRadius: `${radius.lg}px`,
            border: `1px solid ${colors.line}`,
            p: 2.5,
            minWidth: { xs: 320, sm: 380 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          fontSize: '1.35rem',
          color: colors.ink,
          mb: 0.5,
          pt: 1,
        }}
      >
        {isEs ? 'Restablecer contraseña' : 'Reset password'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {success ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ ...typography.body, color: colors.ink2, mb: 1 }}>
              {isEs
                ? 'Si este email existe, te enviaremos un enlace para restablecer tu contraseña.'
                : 'If this email exists, a reset link will be sent.'}
            </Typography>
            <Typography sx={{ ...typography.body, color: colors.ink2, mb: 1 }}>
              {isEs
                ? 'Revisa tu bandeja de entrada y sigue las instrucciones.'
                : 'Please check your inbox and follow the instructions.'}
            </Typography>
            <Typography sx={{ ...typography.body, color: colors.ink, fontWeight: 600, mt: 1 }}>
              {email}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography sx={{ ...typography.body, color: colors.ink2, textAlign: 'center', mb: 0.5 }}>
              {isEs
                ? 'Introduce el email de tu cuenta y te enviaremos un enlace para restablecer la contraseña.'
                : "Enter your account's email address, and we'll send you a link to reset your password."}
            </Typography>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              placeholder={isEs ? 'Email' : 'Email address'}
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              sx={{
                borderRadius: `${radius.md}px`,
                bgcolor: colors.bg,
                '& fieldset': { borderColor: colors.line },
                '&:hover fieldset': { borderColor: colors.ink3 },
                '&.Mui-focused fieldset': { borderColor: colors.brand, borderWidth: 1 },
              }}
            />
            {emailError && (
              <Typography sx={{ color: '#b3261e', fontSize: '0.85rem', textAlign: 'center', mt: -0.5 }}>
                {emailErrorMessage}
              </Typography>
            )}
            {formMessage && (
              <Typography sx={{ color: '#b3261e', fontSize: '0.85rem', textAlign: 'center' }}>
                {formMessage}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 1, px: 1, justifyContent: 'space-between' }}>
        {success ? (
          <Button
            variant="contained"
            disableElevation
            sx={{ ...primaryButtonSx, mx: 'auto' }}
            onClick={() => {
              setSuccess(false);
              setEmail('');
              handleClose();
              router.push('/');
            }}
          >
            {isEs ? 'Ir al inicio' : 'Go to home'}
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} sx={secondaryButtonSx}>
              {isEs ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button
              variant="contained"
              disableElevation
              type="submit"
              disabled={loading}
              sx={primaryButtonSx}
            >
              {loading ? (isEs ? 'Enviando…' : 'Sending…') : (isEs ? 'Continuar' : 'Continue')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
