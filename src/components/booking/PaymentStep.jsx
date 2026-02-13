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
import { createPublicBooking, fetchBookingUsage } from '../../api/bookings';
import { timeStringToMinutes } from '../../utils/calendarUtils';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paymentsBaseUrl = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL;
const VAT_RATE = 0.21;

const MONTHLY_BASE = 90;
const MONTHLY_WITH_VAT = +(MONTHLY_BASE * (1 + VAT_RATE)).toFixed(2); // 108.90

const buildBookingPayload = (visitor, schedule, room, isDesk, extraFields = {}) => {
  const contact = visitor.contact || {};
  const billing = visitor.billing || {};
  const productName = isDesk
    ? (schedule?.deskProductName || room?.productName || room?.name || '')
    : (room?.productName || room?.name || '');

  return {
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
    ...extraFields,
  };
};

/* ─── One-time payment form (unchanged flow) ─── */
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
        await createPublicBooking(
          buildBookingPayload(visitor, schedule, room, isDesk, {
            stripePaymentIntentId: result.paymentIntent.id,
          })
        );
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
    return <SuccessMessage amount={`€${amount}`} />;
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
            borderRadius: 999, px: 3, py: 1.25,
            textTransform: 'none', fontWeight: 600, color: 'text.secondary',
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || submitting}
          sx={{
            borderRadius: 999, px: 4, py: 1.25,
            textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
          }}
        >
          {submitting ? 'Processing…' : `Pay €${amount}`}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Subscription form (SetupIntent flow) ─── */
const SubscriptionForm = ({ onBack, monthlyAmount, durationMonths, room }) => {
  const stripe = useStripe();
  const elements = useElements();
  const schedule = useBookingFlow((state) => state.schedule);
  const visitor = useBookingVisitor();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      setSubmitting(false);
      setError(result.error.message || 'Card setup failed');
      return;
    }

    try {
      // Create the subscription
      const cancelAt = Math.floor(
        new Date(schedule.dateTo + 'T23:59:59').getTime() / 1000
      );

      const subRes = await fetch(`${paymentsBaseUrl}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setup_intent_id: result.setupIntent.id,
          monthly_amount: Math.round(monthlyAmount * 100),
          currency: (room?.currency || 'EUR').toLowerCase(),
          duration_months: durationMonths,
          cancel_at: cancelAt,
          tenant: process.env.NEXT_PUBLIC_STRIPE_TENANT || 'default',
          reference: room?.id || 'booking',
          desk_name: schedule?.deskProductName || '',
        }),
      });

      if (!subRes.ok) {
        const text = await subRes.text();
        throw new Error(text);
      }

      const subData = await subRes.json();

      // Create the booking in the Java backend
      await createPublicBooking(
        buildBookingPayload(visitor, schedule, room, true, {
          stripeSubscriptionId: subData.subscriptionId,
        })
      );

      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Subscription creation failed');
    }
  };

  if (success) {
    return <SuccessMessage amount={`€${monthlyAmount.toFixed(2)}/month`} isSubscription />;
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

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.info.main, 0.04) }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Monthly subscription
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Charged today: €{monthlyAmount.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Then €{monthlyAmount.toFixed(2)}/month for {durationMonths - 1} remaining {durationMonths - 1 === 1 ? 'month' : 'months'}
          </Typography>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          onClick={onBack}
          disabled={submitting}
          sx={{
            borderRadius: 999, px: 3, py: 1.25,
            textTransform: 'none', fontWeight: 600, color: 'text.secondary',
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || submitting}
          sx={{
            borderRadius: 999, px: 4, py: 1.25,
            textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
          }}
        >
          {submitting ? 'Processing…' : `Subscribe — €${monthlyAmount.toFixed(2)}/month`}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Free booking form (no Stripe) ─── */
const FreeBookingForm = ({ onBack, room, pricing, usage }) => {
  const schedule = useBookingFlow((state) => state.schedule);
  const visitor = useBookingVisitor();
  const isDesk = room?.priceUnit === '/month';
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await createPublicBooking(
        buildBookingPayload(visitor, schedule, room, isDesk)
      );
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessMessage amount="FREE" />;
  }

  return (
    <Stack spacing={2.5}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.04),
          borderColor: 'success.main',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleRoundedIcon sx={{ fontSize: 20, color: 'success.main' }} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Free booking
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This is your free booking ({usage.used + 1} of {usage.freeLimit} this month).
          </Typography>
          {pricing && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
              >
                €{pricing.total}
              </Typography>
              <Chip
                label="FREE"
                size="small"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.8rem' }}
              />
            </Stack>
          )}
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          onClick={onBack}
          disabled={submitting}
          sx={{
            borderRadius: 999, px: 3, py: 1.25,
            textTransform: 'none', fontWeight: 600, color: 'text.secondary',
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            borderRadius: 999, px: 4, py: 1.25,
            textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
          }}
        >
          {submitting ? 'Processing…' : 'Confirm free booking'}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Success message ─── */
const SuccessMessage = ({ amount, isSubscription }) => (
  <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
    <Stack spacing={3} alignItems="center">
      <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main' }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Booking confirmed!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {isSubscription
          ? `Your subscription of ${amount} has been activated. You'll receive a confirmation email shortly with access instructions.`
          : `Your payment of ${amount} has been processed successfully. You'll receive a confirmation email shortly with access instructions.`}
      </Typography>
      <Button
        href="/"
        variant="contained"
        sx={{
          borderRadius: 999, px: 4, py: 1.25,
          textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
        }}
      >
        Browse more spaces
      </Button>
    </Stack>
  </Paper>
);

/* ─── Main PaymentStep component ─── */
const PaymentStep = ({ room, onBack }) => {
  const schedule = useBookingFlow((state) => state.schedule);
  const visitor = useBookingVisitor();
  const isDesk = room?.priceUnit === '/month';
  const isSubscription = isDesk && schedule?.bookingType === 'month' && (schedule?.durationMonths || 1) > 1;

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [freeUsage, setFreeUsage] = useState(null); // { used, freeLimit, isFree }

  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), []);

  const pricing = useMemo(() => {
    if (isDesk) {
      const isDayBooking = schedule?.bookingType === 'day';
      if (isSubscription) {
        const monthlySubtotal = MONTHLY_BASE;
        const monthlyVat = monthlySubtotal * VAT_RATE;
        const monthlyTotal = MONTHLY_WITH_VAT;
        const months = schedule?.durationMonths || 1;
        return {
          isSubscription: true,
          monthlySubtotal: monthlySubtotal.toFixed(2),
          monthlyVat: monthlyVat.toFixed(2),
          monthlyTotal: monthlyTotal.toFixed(2),
          months,
          subtotal: monthlySubtotal.toFixed(2),
          vat: monthlyVat.toFixed(2),
          total: monthlyTotal.toFixed(2),
        };
      }
      let subtotal;
      if (isDayBooking) {
        subtotal = 10;
      } else {
        subtotal = 90;
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
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime, schedule?.durationMonths, schedule?.bookingType, isDesk, isSubscription]);

  const estimatedTotal = pricing?.total ?? null;

  const amountCents = useMemo(() => {
    if (isSubscription) {
      return Math.round(MONTHLY_WITH_VAT * 100);
    }
    if (!estimatedTotal) return Math.round((room?.priceFrom || 0) * (1 + VAT_RATE) * 100);
    return Math.round(Number(estimatedTotal) * 100);
  }, [estimatedTotal, room?.priceFrom, isSubscription]);

  useEffect(() => {
    const init = async () => {
      // Check free booking eligibility first
      try {
        const email = visitor.contact?.email;
        const productName = isDesk
          ? (schedule?.deskProductName || room?.productName || room?.name || '')
          : (room?.productName || room?.name || '');

        if (email && productName) {
          const usage = await fetchBookingUsage(email, productName);
          setFreeUsage(usage);
          if (usage.isFree) {
            setLoading(false);
            return;
          }
        }
      } catch (usageErr) {
        // If usage check fails, fall through to normal payment flow
      }

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
        if (isSubscription) {
          const contact = visitor.contact || {};
          const res = await fetch(`${paymentsBaseUrl}/api/setup-intents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_email: contact.email || '',
              customer_name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
              tenant: process.env.NEXT_PUBLIC_STRIPE_TENANT || 'default',
              reference: room?.id || 'booking',
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }

          const data = await res.json();
          setClientSecret(data.clientSecret);
        } else {
          const res = await fetch(`${paymentsBaseUrl}/api/payment-intents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: amountCents,
              currency: (room?.currency || 'EUR').toLowerCase(),
              reference: room?.id || 'booking',
              tenant: process.env.NEXT_PUBLIC_STRIPE_TENANT || 'default',
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }

          const data = await res.json();
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [room, amountCents, isSubscription]);

  if (loading) {
    return (
      <Stack spacing={3}>
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} isSubscription={isSubscription} />
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 32, height: 32,
                  border: '3px solid', borderColor: 'divider',
                  borderTopColor: 'primary.main', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
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
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} isSubscription={isSubscription} />
        <Alert severity="error">{error}</Alert>
        <Box>
          <Button
            onClick={onBack}
            sx={{
              borderRadius: 999, px: 3, py: 1.25,
              textTransform: 'none', fontWeight: 600, color: 'text.secondary',
            }}
          >
            Back
          </Button>
        </Box>
      </Stack>
    );
  }

  if (freeUsage?.isFree) {
    return (
      <Stack spacing={3}>
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} isSubscription={isSubscription} />
        <FreeBookingForm onBack={onBack} room={room} pricing={pricing} usage={freeUsage} />
      </Stack>
    );
  }

  if (!clientSecret || !stripePromise) {
    return <Alert severity="warning">Payment is not available right now.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} isSubscription={isSubscription} />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {isSubscription ? (
          <SubscriptionForm
            onBack={onBack}
            monthlyAmount={MONTHLY_WITH_VAT}
            durationMonths={schedule?.durationMonths || 1}
            room={room}
          />
        ) : (
          <PaymentIntentForm onBack={onBack} amount={estimatedTotal || '0.00'} room={room} />
        )}
      </Elements>
    </Stack>
  );
};

const OrderSummary = ({ room, schedule, pricing, isDesk, isSubscription }) => (
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
            label={isSubscription ? `€${pricing.monthlyTotal}/mo` : `€${pricing.total}`}
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isSubscription ? 'Monthly subtotal' : 'Subtotal'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.subtotal}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>IVA (21%)</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.vat}</Typography>
        </Stack>
        <Divider sx={{ my: 0.5 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {isSubscription ? 'Monthly total' : 'Total'}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            €{pricing.total}{isSubscription ? '/month' : ''}
          </Typography>
        </Stack>
        {isSubscription && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {pricing.months} months — first month charged now, then monthly
          </Typography>
        )}
      </Stack>
    )}
  </Paper>
);

export default PaymentStep;
