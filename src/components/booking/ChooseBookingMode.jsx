import { useEffect } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { useBookingFlow } from '../../store/useBookingFlow.js';
import { useAuth } from '../auth/AuthProvider.jsx';

const ChooseBookingMode = ({ onContinue }) => {
  const bookingMode = useBookingFlow((state) => state.bookingMode);
  const setBookingMode = useBookingFlow((state) => state.setBookingMode);
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === 'authenticated' && bookingMode !== 'login') {
      setBookingMode('login');
    }
  }, [auth.status, bookingMode, setBookingMode]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(148, 163, 184, 0.24)',
        bgcolor: '#fff'
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Who is booking this space?
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Sign in to reuse your saved billing profile or continue as a guest and enter the required details in the
            next step.
          </Typography>
        </Stack>

        <RadioGroup
          value={bookingMode}
          onChange={(event) => setBookingMode(event.target.value)}
          sx={{ display: 'flex', gap: 2 }}
        >
          <FormControlLabel
            value="login"
            control={<Radio />}
            sx={{
              m: 0,
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 2,
              p: 2,
              bgcolor: bookingMode === 'login' ? 'rgba(37, 99, 235, 0.06)' : '#fff'
            }}
            label={
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LoginRoundedIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    I have a BeWorking account
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Access saved contacts, payment methods, and invoices. We&apos;ll preload your billing profile when you
                  continue.
                </Typography>
                {auth.status !== 'authenticated' ? (
                  <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600 }}>
                    You&apos;ll be asked to sign in on the next step if you aren&apos;t already.
                  </Typography>
                ) : null}
              </Stack>
            }
          />

          <FormControlLabel
            value="visitor"
            control={<Radio />}
            sx={{
              m: 0,
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 2,
              p: 2,
              bgcolor: bookingMode === 'visitor' ? 'rgba(37, 99, 235, 0.06)' : '#fff'
            }}
            label={
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonAddAlt1RoundedIcon sx={{ color: '#10b981' }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Continue as visitor
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  We&apos;ll collect basic contact and billing information in the next step and send a secure payment link.
                </Typography>
              </Stack>
            }
          />
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={onContinue}
            sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ChooseBookingMode;
