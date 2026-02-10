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
import { useBookingVisitor } from '../../store/useBookingVisitor';
import { createPublicBooking } from '../../api/bookings';
import { timeStringToMinutes } from '../../utils/calendarUtils';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paymentsBaseUrl = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL;
const VAT_RATE = 0.21;

const PaymentIntentForm = ({ onBack, amount, room }) => {
  const stripe = useStripe();
  const elements = useElements();
  const schedule = useBookingFlow((state) => state.schedule);
  const visitor = useBookingVisitor();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isDesk = room?.priceUnit === '/month';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (result.error) {
      setSubmitting(false);
      setError(result.error.message || 'Payment failed');
    } else if (result.paymentIntent?.status === 'succeeded') {
      try {
        const contact = visitor.contact || {};
        const billing = visitor.billing || {};
        const productName = isDesk
          ? (schedule?.deskProductName || room?.productName || room?.name || '')
          : (room?.productName || room?.name || '');
        await createPublicBooking({
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company: billing.company || contact.company || '',
          taxId: billing.taxId || '',
          billingAddress: billing.address || '',
          billingCity: billing.city || '',
          billingProvince: billing.province || '',
          billingCountry: billing.country || '',
          billingPostalCode: billing.postalCode || '',
          productName,
          date: schedule?.date || '',
          dateTo: isDesk ? (schedule?.dateTo || '') : undefined,
          startTime: schedule?.startTime || '',
          endTime: schedule?.endTime || '',
          attendees: schedule?.attendees || 1,
          stripePaymentIntentId: result.paymentIntent.id
        });
      } catch (bookingErr) {
        console.error('Failed to create booking after payment:', bookingErr);
      }
      setSubmitting(false);
      setSuccess(true);
    } else {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Stack spacing={3} alignItems="center">
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Booking confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Your payment of €{amount} has been processed successfully.
            You'll receive a confirmation email shortly with access instructions.
          </Typography>
          <Button
            href="/"
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            Browse more spaces
          </Button>
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
  const isDesk = room?.priceUnit === '/month';

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), []);

  const pricing = useMemo(() => {
    if (isDesk) {
      const isDayBooking = schedule?.bookingType === 'day';
      let subtotal;
      if (isDayBooking) {
        subtotal = 10; // €10/day
      } else {
        const months = schedule?.durationMonths || 1;
        subtotal = months * 90; // €90/month
      }
      const vat = subtotal * VAT_RATE;
      const total = subtotal + vat;
      return {
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
      };
    }

    if (!room?.priceFrom) return null;
    if (!schedule?.startTime || !schedule?.endTime) return null;
    const startMins = timeStringToMinutes(schedule.startTime);
    const endMins = timeStringToMinutes(schedule.endTime);
    if (startMins == null || endMins == null || endMins <= startMins) return null;
    const hours = (endMins - startMins) / 60;
    const subtotal = hours * room.priceFrom;
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;
    return {
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    };
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime, schedule?.durationMonths, schedule?.bookingType, isDesk]);

  const estimatedTotal = pricing?.total ?? null;

  const amountCents = useMemo(() => {
    if (!estimatedTotal) return Math.round((room?.priceFrom || 0) * (1 + VAT_RATE) * 100);
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
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} />
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
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} />
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
      <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentIntentForm onBack={onBack} amount={estimatedTotal || '0.00'} room={room} />
      </Elements>
    </Stack>
  );
};

const OrderSummary = ({ room, schedule, pricing, isDesk }) => (
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
        {pricing && (
          <Chip
            label={`€${pricing.total}`}
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
          {isDesk && schedule?.bookingType === 'day' && schedule?.date
            ? new Date(schedule.date + 'T00:00:00').toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : isDesk && schedule?.date && schedule?.dateTo
              ? `${new Date(schedule.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} – ${new Date(schedule.dateTo).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
              : schedule?.date
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
          {isDesk
            ? (schedule?.deskProductName || '—')
            : (schedule?.startTime && schedule?.endTime
                ? `${schedule.startTime} – ${schedule.endTime}`
                : '—')}
        </Typography>
      </Stack>
    </Stack>

    {pricing && (
      <Stack sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }} spacing={0.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Subtotal</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.subtotal}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>IVA (21%)</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.vat}</Typography>
        </Stack>
        <Divider sx={{ my: 0.5 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>€{pricing.total}</Typography>
        </Stack>
      </Stack>
    )}
  </Paper>
);

export default PaymentStep;
