import { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import TurnstileWidget from './TurnstileWidget';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://be-working.com';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const DEFAULT_PLANS = {
  basic: { name: 'Basic', price: 15, priceCents: 1500 },
  pro: { name: 'Pro', price: 25, priceCents: 2500 },
  max: { name: 'Max', price: 90, priceCents: 9000 },
};

const LOCATION_KEYS = ['malaga', 'sevilla'];

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: 520,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  borderRadius: 10,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 520,
    padding: theme.spacing(4),
  },
}));

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
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>
          Plan {plan.name} — {t('register.trialBanner', { price: plan.price })}
        </Typography>
      </Alert>

      <Box sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2, p: 2 }}>
        <PaymentElement onChange={(e) => setPaymentReady(e.complete)} />
      </Box>

      {termsSlot}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{ borderRadius: '999px', px: 3 }}
        >
          {t('register.back')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !stripe || !elements || !paymentReady}
          sx={{ borderRadius: '999px', px: 4 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : t('register.submitTrial')}
        </Button>
      </Box>
    </Stack>
  );
}

export default function SignUp({ defaultPlan = 'basic', defaultLocation = '', apiPlans = null }) {
  // Build PLANS map from API data or fall back to defaults
  const PLANS = apiPlans
    ? apiPlans.reduce((acc, p) => {
        acc[p.key] = { name: p.name, price: Number(p.price), priceCents: Math.round(Number(p.price) * 100) };
        return acc;
      }, {})
    : DEFAULT_PLANS;
  const { t } = useTranslation();
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
  const [setupIntentId, setSetupIntentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailTaken, setEmailTaken] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const stepLabels = t('register.steps', { returnObjects: true }) || ['Account', 'Company', 'Address', 'Payment'];

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
    if (!form.password || form.password.length < 8) errs.password = t('register.errors.passwordMin');
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
      setSetupIntentId(data.setupIntentId);
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
      const checkRes = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(form.email)}`);
      const checkData = await checkRes.json();
      if (!checkData.available) {
        setApiError(t('register.errors.emailTaken'));
        setLoading(false);
        return;
      }

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
          setupIntentId: setupIntent.id, stripeCustomerId, turnstileToken,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setApiError(result.message || 'Error creating account.');
        if ((result?.message || '').toLowerCase().includes('turnstile')) {
          setTurnstileToken('');
          setTurnstileReset((prev) => prev + 1);
        }
      }
    } catch {
      setApiError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card variant="outlined">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t('register.success')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ textAlign: 'center' }}>
            {t('register.alreadyHaveAccount')}{' '}
            <Link href={`${FRONTEND_URL}/main/login`} sx={{ textDecoration: 'none', fontWeight: 700 }}>
              {t('register.signIn')}
            </Link>
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ position: 'relative', overflow: 'visible' }}>
      <Box sx={{
        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
        bgcolor: 'primary.main', color: '#fff', px: 2.5, py: 0.5,
        borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 700,
        letterSpacing: '0.03em', whiteSpace: 'nowrap', zIndex: 1,
      }}>
        {t('register.trialRibbon', '30 días gratis')}
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', mt: 1 }}
      >
        {t('register.title')}
      </Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 1 }}>
        {Array.isArray(stepLabels) && stepLabels.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.8125rem' } }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}

      {/* Step 0: Account */}
      {step === 0 && (
        <form onSubmit={(e) => { e.preventDefault(); goToStep1(); }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.name')}</FormLabel>
              <TextField required fullWidth placeholder="Jon Snow" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name || ''} />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.email')}</FormLabel>
              <TextField required fullWidth type="email" placeholder="your@email.com" value={form.email} onChange={handleChange('email')} error={!!errors.email || emailTaken} helperText={errors.email || ''} />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.password')}</FormLabel>
              <TextField required fullWidth type="password" placeholder="••••••••" value={form.password} onChange={handleChange('password')} error={!!errors.password} helperText={errors.password || ''} />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.confirmPassword')}</FormLabel>
              <TextField required fullWidth type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button type="submit" variant="contained" sx={{ borderRadius: '999px', px: 4 }}>
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
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.company')}</FormLabel>
              <TextField fullWidth placeholder="Acme Inc." value={form.company} onChange={handleChange('company')} />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.taxId')}</FormLabel>
              <TextField fullWidth placeholder="B12345678" value={form.taxId} onChange={handleChange('taxId')} />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: 'text.primary', fontWeight: 500 }}>{t('register.fields.phone')}</FormLabel>
              <TextField fullWidth placeholder="+34 600 000 000" value={form.phone} onChange={handleChange('phone')} />
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={() => setStep(0)} sx={{ borderRadius: '999px', px: 3 }}>
                {t('register.back')}
              </Button>
              <Button type="submit" variant="contained" sx={{ borderRadius: '999px', px: 4 }}>
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
          <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', textAlign: 'center' }}>
            {t('register.locationStep.heading')}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', mb: 1 }}>
            {t('register.locationStep.subheading')}
          </Typography>
          {defaultLocation ? (
            (() => {
              const loc = t(`register.locations.${selectedLocation}`, { returnObjects: true });
              return (
                <Box sx={{ border: '2px solid', borderColor: 'primary.main', borderRadius: '12px', p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2, bgcolor: 'rgba(0,150,36,0.04)' }}>
                  <CheckCircleIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{loc.city}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.25 }}>{loc.address}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{loc.zip}</Typography>
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
                    sx={{
                      border: isSelected ? '2px solid' : '1px solid rgba(0,0,0,0.12)',
                      borderColor: isSelected ? 'primary.main' : undefined,
                      borderRadius: '12px',
                      p: 2.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      bgcolor: isSelected ? 'rgba(0,150,36,0.04)' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,150,36,0.02)' },
                    }}
                  >
                    <LocationOnIcon sx={{ color: isSelected ? 'primary.main' : 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{loc.city}</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.25 }}>{loc.address}</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{loc.zip}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
          {errors.location && (
            <Typography color="error" sx={{ fontSize: '0.875rem', textAlign: 'center' }}>{errors.location}</Typography>
          )}

          {siteKey && (
            <Box sx={{ my: 1 }}>
              <TurnstileWidget
                siteKey={siteKey}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken('')}
                onExpire={() => setTurnstileToken('')}
                resetSignal={turnstileReset}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
            <Button variant="outlined" onClick={() => setStep(1)} sx={{ borderRadius: '999px', px: 3 }}>
              {t('register.back')}
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ borderRadius: '999px', px: 4 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : t('register.next')}
            </Button>
          </Box>
        </Box>
        </form>
      )}

      {/* Step 3: Plan + Payment */}
      {step === 3 && clientSecret && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Plan selector */}
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', textAlign: 'center' }}>
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
                    border: isSelected ? '2px solid' : '1px solid rgba(0,0,0,0.12)',
                    borderColor: isSelected ? 'primary.main' : undefined,
                    borderRadius: '12px',
                    p: 1.5,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: isSelected ? 'rgba(0,150,36,0.04)' : 'transparent',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,150,36,0.02)' },
                  }}
                >
                  {key === 'basic' && (
                    <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 0.3, bgcolor: 'primary.main', color: '#fff', px: 1, py: 0.2, borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700 }}>
                      <StarIcon sx={{ fontSize: '0.75rem' }} /> Popular
                    </Box>
                  )}
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{plan.name}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'primary.main' }}>{plan.price}€</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>/mes</Typography>
                </Box>
              );
            })}
          </Box>

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
                        color="primary"
                      />
                    }
                    label={
                      <span>
                        <Trans i18nKey="register.termsLabel" components={{
                          terms: <Link href={`${FRONTEND_URL}/main/terminos`} target="_blank" rel="noopener" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }} />,
                        }} />
                      </span>
                    }
                  />
                  {errors.terms && (
                    <Typography color="error" sx={{ fontSize: '0.9rem', mt: -1 }}>{errors.terms}</Typography>
                  )}
                </>
              }
            />
          </Elements>

        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ textAlign: 'center' }}>
          {t('register.alreadyHaveAccount')}{' '}
          <Link href={`${FRONTEND_URL}/main/login`} sx={{ textDecoration: 'none', fontWeight: 700 }}>
            {t('register.signIn')}
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}
