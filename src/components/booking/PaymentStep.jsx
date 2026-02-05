'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paymentsBaseUrl = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL;

const PaymentIntentForm = ({ onBack }) => {
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

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Payment succeeded</Alert>}
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={onBack}>Back</Button>
        <Button type="submit" variant="contained" disabled={!stripe || submitting}>
          {submitting ? 'Processing…' : 'Pay now'}
        </Button>
      </Stack>
    </Stack>
  );
};

const PaymentStep = ({ room, onBack }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), []);

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
            amount: Math.round((room?.priceFrom || 0) * 100),
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
  }, [room]);

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={32} />
        <Typography variant="body2">Preparing payment…</Typography>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!clientSecret || !stripePromise) {
    return <Alert severity="warning">Payment is not available right now.</Alert>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentIntentForm onBack={onBack} />
    </Elements>
  );
};

export default PaymentStep;
