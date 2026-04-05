import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/router';

function ForgotPassword({ open, handleClose }) {
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
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // Call backend endpoint for password reset
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        setFormMessage('An error occurred. Please try again.');
      }
    } catch (e) {
      setFormMessage('An error occurred. Please try again.');
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
          sx: { backgroundImage: 'none', borderRadius: 4, p: 3, minWidth: 340 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', fontSize: '1.5rem', mb: 1 }}>Reset password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {success ? (
          <>
            <DialogContentText sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              If this email exists, a reset link will be sent.<br />
              Please check your inbox and follow the instructions.<br /><br />
              <b>{email}</b>
            </DialogContentText>
          </>
        ) : (
          <>
            <DialogContentText sx={{ textAlign: 'center', mb: 1, color: 'text.secondary' }}>
              Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
            </DialogContentText>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              placeholder="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={emailError}
              sx={{ mb: 1 }}
            />
            {emailError && (
              <DialogContentText sx={{ color: 'error.main', fontSize: '0.95em', textAlign: 'center', mb: 1 }}>{emailErrorMessage}</DialogContentText>
            )}
            {formMessage && (
              <DialogContentText sx={{ color: 'success.main', fontSize: '0.95em', textAlign: 'center', mb: 1 }}>{formMessage}</DialogContentText>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3, justifyContent: 'space-between' }}>
        {success ? (
          <Button
            variant="contained"
            sx={{ px: 3 }}
            onClick={() => {
              setSuccess(false);
              setEmail('');
              handleClose();
              router.push('/');
            }}
          >
            Go to Home
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} variant="outlined" sx={{ px: 3 }}>Cancel</Button>
            <Button variant="contained" type="submit" sx={{ px: 3 }} disabled={loading}>
              {loading ? 'Sending...' : 'Continue'}
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