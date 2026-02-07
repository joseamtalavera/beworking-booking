'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useBookingFlow } from '../../store/useBookingFlow';
import { timeStringToMinutes } from '../../utils/calendarUtils';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paymentsBaseUrl = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL;

const PaymentIntentForm = ({ onBack, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error.message || 'Payment failed');
    } else if (result.paymentIntent?.status === 'succeeded') {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Booking confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Your payment of €{amount} has been processed successfully.
            You'll receive a confirmation email shortly with access instructions.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LockRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Secure payment powered by Stripe
            </Typography>
          </Stack>
          <PaymentElement />
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          onClick={onBack}
          disabled={submitting}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || submitting}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          {submitting ? 'Processing…' : `Pay €${amount}`}
        </Button>
      </Stack>
    </Stack>
  );
};

const PaymentStep = ({ room, onBack }) => {
  const schedule = useBookingFlow((state) => state.schedule);

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), []);

  const estimatedTotal = useMemo(() => {
    if (!room?.priceFrom || !schedule?.startTime || !schedule?.endTime) return null;
    const startMins = timeStringToMinutes(schedule.startTime);
    const endMins = timeStringToMinutes(schedule.endTime);
    if (startMins == null || endMins == null || endMins <= startMins) return null;
    const hours = (endMins - startMins) / 60;
    return (hours * room.priceFrom).toFixed(2);
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime]);

  const amountCents = useMemo(() => {
    if (!estimatedTotal) return Math.round((room?.priceFrom || 0) * 100);
    return Math.round(Number(estimatedTotal) * 100);
  }, [estimatedTotal, room?.priceFrom]);

  useEffect(() => {
    const fetchIntent = async () => {
      if (!paymentsBaseUrl) {
        setError('Payment service URL is not configured');
        setLoading(false);
        return;
      }
      if (!publishableKey) {
        setError('Stripe publishable key is not configured');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${paymentsBaseUrl}/api/payment-intents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountCents,
            currency: (room?.currency || 'EUR').toLowerCase(),
            reference: room?.id || 'booking',
            tenant: process.env.NEXT_PUBLIC_STRIPE_TENANT || 'default'
          })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message || 'Failed to create payment intent');
      } finally {
        setLoading(false);
      }
    };

    fetchIntent();
  }, [room, amountCents]);

  if (loading) {
    return (
      <Stack spacing={3}>
        <OrderSummary room={room} schedule={schedule} estimatedTotal={estimatedTotal} />
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  border: '3px solid',
                  borderColor: 'divider',
                  borderTopColor: 'primary.main',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  '@keyframes spin': {
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Preparing secure payment…
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack spacing={3}>
        <OrderSummary room={room} schedule={schedule} estimatedTotal={estimatedTotal} />
        <Alert severity="error">{error}</Alert>
        <Box>
          <Button
            onClick={onBack}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Back
          </Button>
        </Box>
      </Stack>
    );
  }

  if (!clientSecret || !stripePromise) {
    return <Alert severity="warning">Payment is not available right now.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <OrderSummary room={room} schedule={schedule} estimatedTotal={estimatedTotal} />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentIntentForm onBack={onBack} amount={estimatedTotal || '0.00'} />
      </Elements>
    </Stack>
  );
};

const OrderSummary = ({ room, schedule, estimatedTotal }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        height: 120,
        backgroundImage: room?.heroImage ? `url(${room.heroImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        bgcolor: room?.heroImage ? undefined : (theme) => alpha(theme.palette.primary.main, 0.08),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />
      <Stack
        sx={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Box>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
            {room?.name}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PlaceRoundedIcon sx={{ color: 'grey.300', fontSize: 14 }} />
            <Typography variant="caption" sx={{ color: 'grey.300' }}>
              {room?.centro}
            </Typography>
          </Stack>
        </Box>
        {estimatedTotal && (
          <Chip
            label={`€${estimatedTotal}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              fontWeight: 700,
              fontSize: '0.95rem',
              height: 32,
            }}
          />
        )}
      </Stack>
    </Box>

    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      sx={{ px: 2, py: 1.5 }}
    >
      <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
        <CalendarMonthRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {schedule?.date
            ? new Date(schedule.date).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
              })
            : '—'}
        </Typography>
      </Stack>
      <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
        <AccessTimeRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {schedule?.startTime && schedule?.endTime
            ? `${schedule.startTime} – ${schedule.endTime}`
            : '—'}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default PaymentStep;
