'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useBookingFlow } from '../../store/useBookingFlow';
import { useBookingVisitor } from '../../store/useBookingVisitor';
import { createPublicBooking, fetchBookingUsage, fetchPublicAvailability } from '../../api/bookings';
import { timeStringToMinutes } from '../../utils/calendarUtils';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const rawPaymentsBase = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL || '';
const paymentsBaseUrl = rawPaymentsBase.replace(/\/api\/?$/, '');
const VAT_RATE = 0.21;
const PENDING_BOOKING_KEY = 'beworking_pending_booking';
const MONTHLY_BASE = 90;
const MONTHLY_WITH_VAT = +(MONTHLY_BASE * (1 + VAT_RATE)).toFixed(2);

const cardSx = {
  p: { xs: 2.5, md: 3 },
  borderRadius: `${radius.lg}px`,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
};

const primaryButtonSx = {
  bgcolor: colors.brand,
  color: colors.bg,
  borderRadius: `${radius.pill}px`,
  px: 4,
  py: 1.4,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: `background-color ${motion.duration} ${motion.ease}`,
  '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
  '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
};

const backButtonSx = {
  borderRadius: `${radius.pill}px`,
  px: 3,
  py: 1.4,
  textTransform: 'none',
  fontWeight: 600,
  color: colors.ink2,
  '&:hover': { bgcolor: colors.bgSoft, color: colors.ink },
};

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
    dateTo: (isDesk || schedule?.recurring) ? (schedule?.dateTo || '') : undefined,
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    attendees: schedule?.attendees || 1,
    weekdays: schedule?.recurring && schedule?.weekdays?.length ? schedule.weekdays : undefined,
    ...extraFields,
  };
};

const SecurePaymentHeader = ({ t }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <LockRoundedIcon sx={{ fontSize: 18, color: colors.ink3 }} />
    <Typography sx={{ ...typography.body, color: colors.ink2 }}>
      {t('payment.securePayment')}
    </Typography>
  </Stack>
);

/* ─── One-time payment form with 3DS redirect recovery ─── */
const PaymentIntentForm = ({ onBack, amount, room }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const schedule = useBookingFlow((state) => state.schedule);
  const visitor = useBookingVisitor();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const isDesk = room?.priceUnit === '/month';
  const [redirectRecoveryDone, setRedirectRecoveryDone] = useState(false);

  useEffect(() => {
    if (!stripe || redirectRecoveryDone) return;
    const params = new URLSearchParams(window.location.search);
    const piClientSecret = params.get('payment_intent_client_secret');
    if (!piClientSecret) return;

    setRedirectRecoveryDone(true);
    setSubmitting(true);

    const recover = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(piClientSecret);
        if (paymentIntent?.status !== 'succeeded') {
          setError(t('payment.paymentFailed'));
          setSubmitting(false);
          return;
        }

        let savedPayload;
        try {
          const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
          savedPayload = raw ? JSON.parse(raw) : null;
        } catch (_) {}

        if (!savedPayload) {
          setError(t('payment.paymentSuccessBookingFailed', { ref: paymentIntent.id }));
          setSubmitting(false);
          return;
        }

        savedPayload.stripePaymentIntentId = paymentIntent.id;
        await createPublicBooking(savedPayload);
        sessionStorage.removeItem(PENDING_BOOKING_KEY);
        setPaymentIntentId(paymentIntent.id);
        setSuccess(true);
      } catch (bookingErr) {
        console.error('Failed to create booking after 3DS redirect:', bookingErr);
        let errMsg = bookingErr?.message || '';
        try { errMsg = JSON.parse(errMsg)?.message || errMsg; } catch (_) {}
        if (errMsg.toLowerCase().includes('conflict') || errMsg.toLowerCase().includes('overlap')) {
          setError(t('payment.slotUnavailableRefunded'));
        } else {
          setError(t('payment.paymentSuccessBookingFailed', { ref: '' }));
        }
      } finally {
        setSubmitting(false);
        const url = new URL(window.location.href);
        url.searchParams.delete('payment_intent');
        url.searchParams.delete('payment_intent_client_secret');
        url.searchParams.delete('redirect_status');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    };

    recover();
  }, [stripe, redirectRecoveryDone, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const productName = isDesk
      ? (schedule?.deskProductName || room?.productName || room?.name || '')
      : (room?.productName || room?.name || '');
    if (schedule?.date && productName) {
      try {
        const bloqueos = await fetchPublicAvailability({
          date: schedule.date,
          products: [productName],
        });
        if (Array.isArray(bloqueos) && bloqueos.length > 0) {
          const selStart = timeStringToMinutes(schedule.startTime);
          const selEnd = timeStringToMinutes(schedule.endTime);
          if (selStart != null && selEnd != null) {
            const conflict = bloqueos.some((b) => {
              const bStart = timeStringToMinutes(b.fechaIni?.split?.('T')?.[1]?.slice(0, 5));
              const bEnd = timeStringToMinutes(b.fechaFin?.split?.('T')?.[1]?.slice(0, 5));
              return bStart != null && bEnd != null && bStart < selEnd && bEnd > selStart;
            });
            if (conflict) {
              setSubmitting(false);
              setError(t('payment.slotUnavailable'));
              return;
            }
          }
        }
      } catch (_) {}
    }

    const bookingPayload = buildBookingPayload(visitor, schedule, room, isDesk);
    try {
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(bookingPayload));
    } catch (_) {}

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href.split('?')[0] + window.location.search,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setSubmitting(false);
      sessionStorage.removeItem(PENDING_BOOKING_KEY);
      setError(result.error.message || t('payment.paymentFailed'));
    } else if (result.paymentIntent?.status === 'succeeded') {
      try {
        await createPublicBooking({
          ...bookingPayload,
          stripePaymentIntentId: result.paymentIntent.id,
        });
        sessionStorage.removeItem(PENDING_BOOKING_KEY);
        setSubmitting(false);
        setPaymentIntentId(result.paymentIntent.id);
        setSuccess(true);
      } catch (bookingErr) {
        console.error('Failed to create booking after payment:', bookingErr);
        sessionStorage.removeItem(PENDING_BOOKING_KEY);

        let refunded = false;
        let errMsg = bookingErr?.message || '';
        try { errMsg = JSON.parse(errMsg)?.message || errMsg; } catch (_) {}
        const alreadyRefunded = errMsg.toLowerCase().includes('refunded');

        if (!alreadyRefunded && rawPaymentsBase && result.paymentIntent?.id) {
          try {
            await fetch(`${rawPaymentsBase}/api/refunds`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment_intent_id: result.paymentIntent.id }),
            });
            refunded = true;
          } catch (refundErr) {
            console.error('Auto-refund failed:', refundErr);
          }
        } else {
          refunded = alreadyRefunded;
        }

        setSubmitting(false);
        if (errMsg.toLowerCase().includes('conflict') || errMsg.toLowerCase().includes('overlap')) {
          setError(t('payment.slotUnavailableRefunded'));
        } else if (refunded) {
          setError(t('payment.bookingFailedRefunded', { defaultValue: 'No se ha podido crear la reserva. Tu pago ha sido reembolsado automáticamente.' }));
        } else {
          setError(t('payment.paymentSuccessBookingFailed', { ref: result.paymentIntent.id }));
        }
      }
    } else {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessMessage amount={`€${amount}`} valueCents={Math.round((parseFloat(amount) || 0) * 100)} transactionId={paymentIntentId} />;
  }

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2}>
          <SecurePaymentHeader t={t} />
          <PaymentElement />
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button onClick={onBack} disabled={submitting} sx={backButtonSx}>
          {t('common.back')}
        </Button>
        <Button type="submit" variant="contained" disableElevation disabled={!stripe || submitting} sx={primaryButtonSx}>
          {submitting ? t('payment.processing') : t('payment.pay', { amount })}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Subscription form (SetupIntent flow) ─── */
const SubscriptionForm = ({ onBack, monthlyAmount, durationMonths, room }) => {
  const { t } = useTranslation();
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
      setError(result.error.message || t('payment.cardSetupFailed'));
      return;
    }

    try {
      const cancelAt = Math.floor(
        new Date(`${schedule.dateTo}T23:59:59`).getTime() / 1000,
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

      await createPublicBooking(
        buildBookingPayload(visitor, schedule, room, true, {
          stripeSubscriptionId: subData.subscriptionId,
        }),
      );

      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      setSubmitting(false);
      setError(err.message || t('payment.subscriptionFailed'));
    }
  };

  if (success) {
    return <SuccessMessage amount={`€${monthlyAmount.toFixed(2)}/month`} isSubscription valueCents={Math.round(monthlyAmount * 100)} />;
  }

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
      <Paper elevation={0} sx={cardSx}>
        <Stack spacing={2}>
          <SecurePaymentHeader t={t} />
          <PaymentElement />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          p: 2.25,
          bgcolor: colors.brandSoft,
          borderColor: colors.brand,
        }}
      >
        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: colors.brandDeep }}>
            {t('payment.monthlySubscription')}
          </Typography>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {t('payment.chargedToday', { amount: monthlyAmount.toFixed(2) })}
          </Typography>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {t('payment.thenMonthly', {
              amount: monthlyAmount.toFixed(2),
              remaining: durationMonths - 1,
              label: durationMonths - 1 === 1 ? t('payment.monthSingular') : t('payment.monthPlural'),
            })}
          </Typography>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button onClick={onBack} disabled={submitting} sx={backButtonSx}>
          {t('common.back')}
        </Button>
        <Button type="submit" variant="contained" disableElevation disabled={!stripe || submitting} sx={primaryButtonSx}>
          {submitting ? t('payment.processing') : t('payment.subscribe', { amount: monthlyAmount.toFixed(2) })}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Free booking form (no Stripe) ─── */
const FreeBookingForm = ({ onBack, room, pricing, usage }) => {
  const { t } = useTranslation();
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
        buildBookingPayload(visitor, schedule, room, isDesk),
      );
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('payment.failedToCreate'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessMessage amount={t('payment.free')} />;
  }

  return (
    <Stack spacing={2.5}>
      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          bgcolor: colors.brandSoft,
          borderColor: colors.brand,
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleRoundedIcon sx={{ fontSize: 22, color: colors.brand }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.brandDeep }}>
              {t('payment.freeBooking')}
            </Typography>
          </Stack>
          <Typography sx={{ ...typography.body, color: colors.ink2 }}>
            {t('payment.freeBookingDesc', { used: usage.used + 1, limit: usage.freeLimit })}
          </Typography>
          {pricing && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ ...typography.body, textDecoration: 'line-through', color: colors.ink3 }}>
                €{pricing.total}
              </Typography>
              <Chip
                label={t('payment.free')}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  bgcolor: colors.brand,
                  color: colors.bg,
                  borderRadius: `${radius.pill}px`,
                  height: 22,
                }}
              />
            </Stack>
          )}
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button onClick={onBack} disabled={submitting} sx={backButtonSx}>
          {t('common.back')}
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={submitting}
          sx={primaryButtonSx}
        >
          {submitting ? t('payment.processing') : t('payment.confirmFreeBooking')}
        </Button>
      </Stack>
    </Stack>
  );
};

/* ─── Success message ─── */
const SuccessMessage = ({ amount, isSubscription, valueCents, transactionId }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (transactionId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'booking_completed',
        transactionId,
        value: valueCents ? valueCents / 100 : 0,
        currency: 'EUR',
        isSubscription: !!isSubscription,
      });
    }
  }, [transactionId, valueCents, isSubscription]);

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <CheckCircleRoundedIcon sx={{ fontSize: 56, color: colors.brand }} />
        <Box
          component="h2"
          sx={{
            ...typography.h3,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
          }}
        >
          {t('payment.bookingConfirmed')}
        </Box>
        <Typography sx={{ ...typography.body, color: colors.ink2 }}>
          {isSubscription
            ? t('payment.subscriptionActivated', { amount })
            : t('payment.paymentProcessed', { amount })}
        </Typography>
        <Button
          href="/"
          variant="contained"
          disableElevation
          sx={primaryButtonSx}
        >
          {t('payment.browseMore')}
        </Button>
      </Stack>
    </Paper>
  );
};

const OrderSummary = ({ room, schedule, pricing, isDesk, isSubscription }) => {
  const { t } = useTranslation();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: `${radius.lg}px`,
        overflow: 'hidden',
        border: `1px solid ${colors.line}`,
        bgcolor: colors.bg,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 130,
          backgroundImage: room?.heroImage ? `url(${room.heroImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          bgcolor: room?.heroImage ? undefined : colors.brandSoft,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 60%)',
          }}
        />
        <Stack
          sx={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
              {room?.name}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceRoundedIcon sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem' }}>
                {room?.centro}
              </Typography>
            </Stack>
          </Box>
          {pricing && (
            <Chip
              label={isSubscription ? `€${pricing.monthlyTotal}/mo` : `€${pricing.total}`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.95)',
                color: colors.ink,
                fontWeight: 700,
                fontSize: '0.95rem',
                height: 32,
                borderRadius: `${radius.pill}px`,
              }}
            />
          )}
        </Stack>
      </Box>

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: colors.line }} />}
        sx={{ px: 2, py: 1.5 }}
      >
        <Stack spacing={0.4} sx={{ flex: 1, alignItems: 'center' }}>
          <CalendarMonthRoundedIcon sx={{ color: colors.brand, fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: colors.ink, textAlign: 'center' }}>
            {isDesk && schedule?.bookingType === 'day' && schedule?.date
              ? new Date(`${schedule.date}T00:00:00`).toLocaleDateString(undefined, {
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
        <Stack spacing={0.4} sx={{ flex: 1, alignItems: 'center' }}>
          <AccessTimeRoundedIcon sx={{ color: colors.brand, fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: colors.ink }}>
            {isDesk
              ? (schedule?.deskProductName || '—')
              : (schedule?.startTime && schedule?.endTime
                  ? `${schedule.startTime} – ${schedule.endTime}`
                  : '—')}
          </Typography>
        </Stack>
      </Stack>

      {pricing && (
        <Stack sx={{ px: 2.5, py: 2, borderTop: `1px solid ${colors.line}`, bgcolor: colors.bgSoft }} spacing={0.6}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {isSubscription ? t('pricing.monthlySubtotal') : t('pricing.subtotal')}
            </Typography>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>€{pricing.subtotal}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>{t('pricing.vat')}</Typography>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>€{pricing.vat}</Typography>
          </Stack>
          <Divider sx={{ my: 0.5, borderColor: colors.line }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ ...typography.body, fontWeight: 700, color: colors.ink }}>
              {isSubscription ? t('pricing.monthlyTotal') : t('pricing.total')}
            </Typography>
            <Typography sx={{ ...typography.body, fontWeight: 700, color: colors.ink }}>
              €{pricing.total}{isSubscription ? t('pricing.perMonth') : ''}
            </Typography>
          </Stack>
          {isSubscription && (
            <Typography sx={{ fontSize: '0.75rem', color: colors.ink3, mt: 0.25 }}>
              {t('pricing.subscriptionNote', { months: pricing.months })}
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

/* ─── Main PaymentStep component ─── */
const PaymentStep = ({ room, onBack }) => {
  const { t } = useTranslation();
  const schedule = useBookingFlow((state) => state.schedule);
  const isDesk = room?.priceUnit === '/month';
  const isSubscription = isDesk && schedule?.bookingType === 'month' && (schedule?.durationMonths || 1) > 1;

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [freeUsage, setFreeUsage] = useState(null);

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
      if (isDayBooking) subtotal = 10;
      else subtotal = 90;
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
    const perSession = hours * room.priceFrom;

    const DAY_MAP = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
    let sessions = 1;
    if (schedule?.recurring && schedule?.weekdays?.length && schedule?.date && schedule?.dateTo) {
      const selectedDays = new Set(schedule.weekdays.map((d) => DAY_MAP[d]));
      let count = 0;
      const cursor = new Date(`${schedule.date}T00:00:00`);
      const end = new Date(`${schedule.dateTo}T00:00:00`);
      while (cursor <= end) {
        if (selectedDays.has(cursor.getDay())) count += 1;
        cursor.setDate(cursor.getDate() + 1);
      }
      if (count > 0) sessions = count;
    }

    const subtotal = perSession * sessions;
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;
    return {
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
      sessions,
      perSession: perSession.toFixed(2),
    };
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime, schedule?.durationMonths, schedule?.bookingType, isDesk, isSubscription, schedule?.recurring, schedule?.weekdays, schedule?.date, schedule?.dateTo]);

  const estimatedTotal = pricing?.total ?? null;

  const amountCents = useMemo(() => {
    if (isSubscription) return Math.round(MONTHLY_WITH_VAT * 100);
    if (!estimatedTotal) return Math.round((room?.priceFrom || 0) * (1 + VAT_RATE) * 100);
    return Math.round(Number(estimatedTotal) * 100);
  }, [estimatedTotal, room?.priceFrom, isSubscription]);

  const redirectClientSecret = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('payment_intent_client_secret') || null;
  }, []);

  useEffect(() => {
    if (redirectClientSecret) {
      setClientSecret(redirectClientSecret);
      setLoading(false);
      return;
    }

    const init = async () => {
      const currentVisitor = useBookingVisitor.getState();

      try {
        const email = currentVisitor.contact?.email;
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
      } catch (_) {}

      if (!paymentsBaseUrl) {
        setError(t('payment.serviceNotConfigured'));
        setLoading(false);
        return;
      }
      if (!publishableKey) {
        setError(t('payment.stripeNotConfigured'));
        setLoading(false);
        return;
      }

      try {
        if (isSubscription) {
          const contact = currentVisitor.contact || {};
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
          const contact = currentVisitor.contact || {};
          const customerName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
          const res = await fetch(`${paymentsBaseUrl}/api/payment-intents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: amountCents,
              currency: (room?.currency || 'EUR').toLowerCase(),
              reference: room?.id || 'booking',
              tenant: process.env.NEXT_PUBLIC_STRIPE_TENANT || 'default',
              customer_email: contact.email || '',
              customer_name: customerName,
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
        setError(err.message || t('payment.failedToInitialize'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [room, amountCents, isSubscription, redirectClientSecret]);

  if (loading) {
    return (
      <Stack spacing={3}>
        <OrderSummary room={room} schedule={schedule} pricing={pricing} isDesk={isDesk} isSubscription={isSubscription} />
        <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                border: `3px solid ${colors.line}`,
                borderTopColor: colors.brand,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
              }}
            />
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {t('payment.preparingPayment')}
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
        <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{error}</Alert>
        <Box>
          <Button onClick={onBack} sx={backButtonSx}>
            {t('common.back')}
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
    return <Alert severity="warning" sx={{ borderRadius: `${radius.md}px` }}>{t('payment.notAvailable')}</Alert>;
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

class PaymentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('PaymentStep crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      let bookingCompleted = false;
      try {
        bookingCompleted = !sessionStorage.getItem('beworking_pending_booking');
      } catch (_) {}

      if (bookingCompleted) {
        return (
          <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
            <Stack spacing={2} alignItems="center">
              <CheckCircleRoundedIcon sx={{ fontSize: 56, color: colors.brand }} />
              <Box
                component="h2"
                sx={{
                  ...typography.h3,
                  color: colors.ink,
                  fontFamily: typography.fontFamily,
                  fontFeatureSettings: typography.fontFeatureSettings,
                  m: 0,
                }}
              >
                ¡Reserva confirmada!
              </Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                Tu pago se ha procesado correctamente. Recibirás un email de confirmación en breve.
              </Typography>
              <Button href="/" variant="contained" disableElevation sx={primaryButtonSx}>
                Volver al inicio
              </Button>
            </Stack>
          </Paper>
        );
      }

      return (
        <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Box
              component="h2"
              sx={{
                ...typography.h3,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
              }}
            >
              Algo salió mal
            </Box>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              No se pudo cargar el formulario de pago. Intenta recargar la página o usa otro navegador.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => window.location.reload()}
              sx={primaryButtonSx}
            >
              Recargar página
            </Button>
          </Stack>
        </Paper>
      );
    }
    return this.props.children;
  }
}

const PaymentStepWithBoundary = (props) => (
  <PaymentErrorBoundary>
    <PaymentStep {...props} />
  </PaymentErrorBoundary>
);

export default PaymentStepWithBoundary;
