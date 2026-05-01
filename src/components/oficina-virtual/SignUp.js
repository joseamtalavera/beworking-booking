import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation, Trans } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TextField from '../common/ClearableTextField';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const DEFAULT_PLANS = {
  basic: { name: 'BeWorkingVirtual', price: 15, priceCents: 1500 },
};

const LOCATION_KEYS = ['malaga', 'sevilla'];

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

const labelSx = {
  color: colors.ink,
  fontWeight: 600,
  fontSize: '0.85rem',
  mb: 0.75,
};

const cardSx = {
  width: '100%',
  maxWidth: 540,
  mx: 'auto',
  bgcolor: colors.bg,
  borderRadius: `${radius.lg}px`,
  border: `1px solid ${colors.line}`,
  p: { xs: 3, sm: 4 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  position: 'relative',
  overflow: 'visible',
};

const linkSx = {
  color: colors.brand,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': { color: colors.brandDeep, textDecoration: 'underline' },
};

const primaryButtonSx = {
  bgcolor: colors.brand,
  color: colors.bg,
  borderRadius: `${radius.pill}px`,
  px: 4,
  py: 1.3,
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
  py: 1.3,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  color: colors.ink,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
  '&:hover': { borderColor: colors.ink3, bgcolor: colors.bgSoft },
};

function PaymentForm({ onBack, onSubmit, loading, plan, t, termsSlot }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentReady, setPaymentReady] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    onSubmit(stripe, elements);
  };

  return (
    <Stack spacing={2.5}>
      <Alert
        severity="info"
        sx={{
          borderRadius: `${radius.md}px`,
          bgcolor: colors.brandSoft,
          color: colors.brandDeep,
          border: `1px solid ${colors.brand}`,
          '& .MuiAlert-icon': { color: colors.brand },
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
          {plan.name} — {t('register.trialBanner', { price: plan.price })}
        </Typography>
      </Alert>

      <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: `${radius.md}px`, p: 2 }}>
        <PaymentElement onChange={(e) => setPaymentReady(e.complete)} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          p: 1.75,
          borderRadius: `${radius.md}px`,
          bgcolor: colors.bgSoft,
          border: `1px solid ${colors.line}`,
        }}
      >
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.ink, letterSpacing: '-0.005em' }}>
          {t('payment.verificationNoteTitle')}
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: colors.ink2, lineHeight: 1.55 }}>
          {t('payment.verificationNote')}
        </Typography>
      </Box>

      {termsSlot}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
        <Button onClick={onBack} disabled={loading} sx={secondaryButtonSx}>
          {t('register.back')}
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={loading || !stripe || !elements || !paymentReady}
          sx={primaryButtonSx}
        >
          {loading ? <CircularProgress size={22} sx={{ color: colors.bg }} /> : t('register.submitTrial')}
        </Button>
      </Box>
    </Stack>
  );
}

export default function SignUp({ defaultPlan = 'basic', defaultLocation = '' }) {
  const PLANS = DEFAULT_PLANS;
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { plan: planParam } = router.query;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    company: '', taxId: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [clientSecret, setClientSecret] = useState('');
  const [stripeCustomerId, setStripeCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailTaken, setEmailTaken] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const stepLabels = t('register.steps', { returnObjects: true }) || ['Account', 'Company', 'Address', 'Payment'];
  const stripePromise = useMemo(
    () => (step >= 2 ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '') : null),
    [step],
  );

  useEffect(() => {
    if (planParam && PLANS[planParam]) setSelectedPlan(planParam);
  }, [planParam]);

  useEffect(() => {
    if (defaultPlan && PLANS[defaultPlan]) setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'email') setEmailTaken(false);
  };

  const checkEmail = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!data.available) {
        setEmailTaken(true);
        setErrors((prev) => ({ ...prev, email: t('register.errors.emailTaken') }));
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const validateStep0 = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('register.errors.nameRequired');
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = t('register.errors.emailRequired');
    if (!form.password || form.password.length < 8) {
      errs.password = t('register.errors.passwordMin');
    } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password) || !/[^a-zA-Z0-9]/.test(form.password)) {
      errs.password = i18n.language === 'es'
        ? 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial'
        : 'Password must include uppercase, lowercase, number and special character';
    }
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('register.errors.passwordMatch');
    if (Object.keys(errs).length > 0) { setErrors(errs); return false; }
    const emailOk = await checkEmail(form.email);
    return emailOk;
  };

  const goToStep1 = async () => {
    setApiError('');
    const valid = await validateStep0();
    if (valid) setStep(1);
  };

  const goToStep3 = async () => {
    if (!selectedLocation) {
      setErrors((prev) => ({ ...prev, location: t('register.locationStep.errorRequired') }));
      return;
    }
    setApiError('');
    setLoading(true);
    try {
      // STEP 1 — persist a pending user in our DB BEFORE any Stripe interaction.
      // This way an abandoned signup leaves a recoverable trail instead of an
      // orphaned Stripe customer with no DB row.
      const pendingRes = await fetch(`${API_URL}/auth/register-pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          company: form.company,
          taxId: form.taxId,
          location: selectedLocation,
          plan: selectedPlan,
        }),
      });
      if (!pendingRes.ok) {
        const err = await pendingRes.json().catch(() => ({}));
        if (pendingRes.status === 409) {
          setApiError(t('register.errors.emailTaken'));
        } else {
          setApiError(err.error || 'Failed to register');
        }
        setLoading(false);
        return;
      }

      // STEP 2 — now create Stripe customer + SetupIntent. The backend will link
      // the new Stripe customer to the pending user we just created.
      const res = await fetch(`${API_URL}/auth/setup-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to initialize payment');
      }
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setStripeCustomerId(data.customerId);
      setStep(3);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (stripe, elements) => {
    if (!termsAccepted) {
      setErrors((prev) => ({ ...prev, terms: t('register.errors.termsRequired') }));
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const { error: stripeError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: 'if_required',
      });
      if (stripeError) { setApiError(stripeError.message); setLoading(false); return; }

      const res = await fetch(`${API_URL}/auth/register-with-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          phone: form.phone, company: form.company, taxId: form.taxId,
          plan: selectedPlan, location: selectedLocation,
          stripeCustomerId,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(true);
        if (selectedPlan === 'basic') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'purchase_completed',
            transactionId: result?.subscriptionId || setupIntent?.id,
            value: PLANS.basic.price,
            currency: 'EUR',
            plan: 'oficina15',
          });
        }
      } else {
        setApiError(result.message || 'Error creating account.');
      }
    } catch {
      setApiError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={cardSx} translate="no">
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: colors.brand, mb: 2 }} />
          <Box
            component="h2"
            sx={{
              ...typography.h3,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
              mb: 1.5,
            }}
          >
            {t('register.success')}
          </Box>
        </Box>
        <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: colors.ink2 }}>
          {t('register.alreadyHaveAccount')}{' '}
          <Link href="/login" sx={linkSx}>
            {t('register.signIn')}
          </Link>
        </Typography>
      </Box>
    );
  }

  const stepperSx = {
    mb: 1,
    '& .MuiStepIcon-root': { color: colors.line },
    '& .MuiStepIcon-root.Mui-active': { color: colors.brand },
    '& .MuiStepIcon-root.Mui-completed': { color: colors.brand },
    '& .MuiStepLabel-label': { color: colors.ink2, fontSize: '0.8rem' },
    '& .MuiStepLabel-label.Mui-active': { color: colors.ink, fontWeight: 600 },
    '& .MuiStepLabel-label.Mui-completed': { color: colors.ink2 },
    '& .MuiStepConnector-line': { borderColor: colors.line },
  };

  const optionCardSx = (isSelected) => ({
    border: isSelected ? `2px solid ${colors.brand}` : `1px solid ${colors.line}`,
    borderRadius: `${radius.md}px`,
    p: 2.5,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    bgcolor: isSelected ? colors.brandSoft : colors.bg,
    transition: `border-color ${motion.duration} ${motion.ease}, background-color ${motion.duration} ${motion.ease}`,
    '&:hover': { borderColor: colors.brand, bgcolor: isSelected ? colors.brandSoft : colors.bgSoft },
  });

  return (
    <Box sx={cardSx} translate="no">
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
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
          {t('register.title')}
        </Box>
      </Box>

      <Box sx={stepperSx}>
        <Stepper activeStep={step} alternativeLabel>
          {Array.isArray(stepLabels) && stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{apiError}</Alert>
      )}

      {/* Step 0: Account */}
      {step === 0 && (
        <form onSubmit={(e) => { e.preventDefault(); goToStep1(); }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.name')}</FormLabel>
              <TextField required fullWidth placeholder="Jon Snow" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name || ''} sx={fieldSx} />
            </FormControl>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.email')}</FormLabel>
              <TextField required fullWidth type="email" placeholder="your@email.com" value={form.email} onChange={handleChange('email')} error={!!errors.email || emailTaken} helperText={errors.email || ''} sx={fieldSx} />
            </FormControl>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.password')}</FormLabel>
              <TextField
                required
                fullWidth
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password || (i18n.language === 'es' ? 'Mín. 8 caracteres: mayúscula, minúscula, número y especial (!@#...)' : 'Min. 8 chars: uppercase, lowercase, number & special (!@#...)')}
                sx={fieldSx}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.confirmPassword')}</FormLabel>
              <TextField required fullWidth type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} sx={fieldSx} />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button type="submit" variant="contained" disableElevation sx={primaryButtonSx}>
                {t('register.next')}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Step 1: Company */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.company')}</FormLabel>
              <TextField fullWidth placeholder="Acme Inc. / Jon Snow" value={form.company} onChange={handleChange('company')} sx={fieldSx} />
            </FormControl>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.taxId')}</FormLabel>
              <TextField fullWidth placeholder="B12345678 / 12345678A" value={form.taxId} onChange={handleChange('taxId')} sx={fieldSx} />
            </FormControl>
            <FormControl>
              <FormLabel sx={labelSx}>{t('register.fields.phone')}</FormLabel>
              <TextField fullWidth placeholder="+34 600 000 000" value={form.phone} onChange={handleChange('phone')} sx={fieldSx} />
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
              <Button onClick={() => setStep(0)} sx={secondaryButtonSx}>
                {t('register.back')}
              </Button>
              <Button type="submit" variant="contained" disableElevation sx={primaryButtonSx}>
                {t('register.next')}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Step 2: City */}
      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); goToStep3(); }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink, textAlign: 'center', fontSize: '1.05rem' }}>
              {t('register.locationStep.heading')}
            </Typography>
            <Typography sx={{ ...typography.body, color: colors.ink2, textAlign: 'center', mb: 0.5 }}>
              {t('register.locationStep.subheading')}
            </Typography>

            {defaultLocation ? (
              (() => {
                const loc = t(`register.locations.${selectedLocation}`, { returnObjects: true });
                return (
                  <Box sx={optionCardSx(true)}>
                    <CheckCircleIcon sx={{ color: colors.brand, mt: 0.25 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: colors.ink }}>{loc.city}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: colors.ink2, mt: 0.25 }}>{loc.address}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>{loc.zip}</Typography>
                    </Box>
                  </Box>
                );
              })()
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {LOCATION_KEYS.map((key) => {
                  const loc = t(`register.locations.${key}`, { returnObjects: true });
                  const isSelected = selectedLocation === key;
                  return (
                    <Box
                      key={key}
                      onClick={() => { setSelectedLocation(key); setErrors((prev) => ({ ...prev, location: '' })); }}
                      sx={optionCardSx(isSelected)}
                    >
                      <LocationOnIcon sx={{ color: isSelected ? colors.brand : colors.ink3, mt: 0.25 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: colors.ink }}>{loc.city}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: colors.ink2, mt: 0.25 }}>{loc.address}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>{loc.zip}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
            {errors.location && (
              <Typography sx={{ color: '#b3261e', fontSize: '0.875rem', textAlign: 'center' }}>
                {errors.location}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
              <Button onClick={() => setStep(1)} sx={secondaryButtonSx}>
                {t('register.back')}
              </Button>
              <Button type="submit" variant="contained" disableElevation disabled={loading} sx={primaryButtonSx}>
                {loading ? <CircularProgress size={22} sx={{ color: colors.bg }} /> : t('register.next')}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Step 3: Plan + Payment */}
      {step === 3 && clientSecret && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.keys(PLANS).length > 1 && (
            <>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: colors.ink, textAlign: 'center' }}>
                {t('register.planStep.heading')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {Object.entries(PLANS).map(([key, plan]) => {
                  const isSelected = selectedPlan === key;
                  return (
                    <Box
                      key={key}
                      onClick={() => { setSelectedPlan(key); setErrors((prev) => ({ ...prev, plan: '' })); }}
                      sx={{
                        flex: 1,
                        border: isSelected ? `2px solid ${colors.brand}` : `1px solid ${colors.line}`,
                        borderRadius: `${radius.md}px`,
                        p: 1.5,
                        cursor: 'pointer',
                        textAlign: 'center',
                        bgcolor: isSelected ? colors.brandSoft : colors.bg,
                        transition: `border-color ${motion.duration} ${motion.ease}, background-color ${motion.duration} ${motion.ease}`,
                        position: 'relative',
                        '&:hover': { borderColor: colors.brand },
                      }}
                    >
                      {key === 'basic' && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            bgcolor: colors.brand,
                            color: colors.bg,
                            px: 1.25,
                            py: 0.25,
                            borderRadius: `${radius.sm}px`,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                          }}
                        >
                          <StarIcon sx={{ fontSize: '0.75rem' }} /> Popular
                        </Box>
                      )}
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: colors.ink }}>{plan.name}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: colors.brand, mt: 0.5 }}>{plan.price}€</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.ink3 }}>/mes</Typography>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}

          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <PaymentForm
              onBack={() => setStep(2)}
              onSubmit={handleFinalSubmit}
              loading={loading}
              plan={PLANS[selectedPlan]}
              t={t}
              termsSlot={
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => { setTermsAccepted(e.target.checked); setErrors((prev) => ({ ...prev, terms: '' })); }}
                        sx={{
                          color: colors.line,
                          '&.Mui-checked': { color: colors.brand },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>
                        <Trans
                          i18nKey="register.termsLabel"
                          components={{
                            terms: <Link href="/aviso-legal" target="_blank" rel="noopener" sx={linkSx} />,
                          }}
                        />
                      </Typography>
                    }
                  />
                  {errors.terms && (
                    <Typography sx={{ color: '#b3261e', fontSize: '0.85rem', mt: -1 }}>{errors.terms}</Typography>
                  )}
                </>
              }
            />
          </Elements>
        </Box>
      )}

      <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: colors.ink2 }}>
        {t('register.alreadyHaveAccount')}{' '}
        <Link href="/login" sx={linkSx}>
          {t('register.signIn')}
        </Link>
      </Typography>
    </Box>
  );
}
