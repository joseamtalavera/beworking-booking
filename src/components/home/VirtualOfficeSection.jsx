'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box, Button, MenuItem, Stack, Step, StepLabel, Stepper, Typography,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ScannerIcon from '@mui/icons-material/Scanner';
import LockIcon from '@mui/icons-material/Lock';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const BENEFIT_ICONS = [GavelIcon, ScannerIcon, LockIcon, LocationOnIcon, AccessTimeIcon, MeetingRoomIcon];
const SERVICE_ICONS = [WifiIcon, LocalParkingIcon, DirectionsBusIcon, MeetingRoomIcon, RecordVoiceOverIcon, MailOutlineIcon, BusinessIcon, AccessTimeIcon];

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

const primaryButtonSx = {
  bgcolor: colors.brand,
  color: colors.bg,
  borderRadius: `${radius.pill}px`,
  px: 3.5,
  py: 1.4,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: `background-color ${motion.duration} ${motion.ease}`,
  '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
};

const secondaryButtonSx = {
  borderRadius: `${radius.pill}px`,
  px: 3,
  py: 1.4,
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  color: colors.ink,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
  '&:hover': { borderColor: colors.ink3, bgcolor: colors.bgSoft },
};

const useReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  const sx = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
    transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
  };
  return [ref, sx];
};

const VirtualOfficeSection = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', taxId: '', industry: '' });
  const [submitted, setSubmitted] = useState(false);

  const [heroRef, heroSx] = useReveal();
  const [benefitsRef, benefitsSx] = useReveal();
  const [mockupRef, mockupSx] = useReveal();
  const [formHeadRef, formHeadSx] = useReveal();
  const [formStepRef, formStepSx] = useReveal();

  const steps = t('virtualOffice.form.steps', { returnObjects: true });
  const benefits = t('virtualOffice.benefits.items', { returnObjects: true });
  const services = t('virtualOffice.services.items', { returnObjects: true });
  const plans = t('virtualOffice.form.plans', { returnObjects: true });
  const industries = t('virtualOffice.form.fields.industries', { returnObjects: true });

  const handleFormChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const stepperSx = {
    '& .MuiStepIcon-root': { color: colors.line },
    '& .MuiStepIcon-root.Mui-active': { color: colors.brand },
    '& .MuiStepIcon-root.Mui-completed': { color: colors.brand },
    '& .MuiStepLabel-label': { color: colors.ink2, fontSize: '0.8rem' },
    '& .MuiStepLabel-label.Mui-active': { color: colors.ink, fontWeight: 600 },
    '& .MuiStepConnector-line': { borderColor: colors.line },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero */}
      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 7, md: 10 },
          px: { xs: 3, md: 5 },
          textAlign: 'center',
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Box sx={{ maxWidth: 720, mx: 'auto', ...heroSx }}>
          <Typography sx={{ ...typography.eyebrow, color: colors.brand, textTransform: 'uppercase', mb: 2 }}>
            {t('virtualOffice.hero.label')}
          </Typography>
          <Box
            component="h1"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {t('virtualOffice.hero.heading')}
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, maxWidth: 560, mx: 'auto', mt: 3 }}>
            {t('virtualOffice.hero.subheading')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              disableElevation
              sx={primaryButtonSx}
              onClick={() => document.getElementById('vo-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('virtualOffice.form.buttons.submit')}
            </Button>
            <Button sx={secondaryButtonSx} href={process.env.NEXT_PUBLIC_FRONTEND_URL || '/'}>
              {t('nav.platform')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Benefits grid */}
      <Box
        component="section"
        ref={benefitsRef}
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 9, md: 13 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', ...benefitsSx }}>
          <Box
            component="h2"
            sx={{
              ...typography.h2,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
              m: 0,
            }}
          >
            {t('virtualOffice.benefits.heading')}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              mt: { xs: 6, md: 8 },
            }}
          >
            {Array.isArray(benefits) && benefits.map((item, i) => {
              const Icon = BENEFIT_ICONS[i] || GavelIcon;
              return (
                <Box
                  key={item.title}
                  sx={{
                    p: 3,
                    bgcolor: colors.bg,
                    borderRadius: `${radius.lg}px`,
                    border: `1px solid ${colors.line}`,
                    transition: `transform ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
                    '&:hover': { borderColor: colors.brand, transform: 'translateY(-2px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: `${radius.md}px`,
                      bgcolor: colors.brandSoft,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 22, color: colors.brand }} />
                  </Box>
                  <Box
                    component="h3"
                    sx={{
                      ...typography.h3,
                      color: colors.ink,
                      fontFamily: typography.fontFamily,
                      fontFeatureSettings: typography.fontFeatureSettings,
                      m: 0,
                      mb: 1,
                      fontSize: '1.05rem',
                    }}
                  >
                    {item.title}
                  </Box>
                  <Typography sx={{ ...typography.body, color: colors.ink2, lineHeight: 1.65 }}>
                    {item.body}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Mockup + Location */}
      <Box
        component="section"
        ref={mockupRef}
        sx={{
          bgcolor: colors.bg,
          py: { xs: 9, md: 13 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            maxWidth: layout.maxWidth,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
            ...mockupSx,
          }}
        >
          <Box
            component="img"
            src="/screenshots/oficina-virtual.png"
            alt="Oficina Virtual"
            loading="lazy"
            sx={{
              width: '100%',
              borderRadius: `${radius.lg}px`,
              boxShadow: shadow.frame,
              border: `1px solid ${colors.line}`,
              display: 'block',
            }}
          />
          <Box>
            <Box
              component="h2"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
                mb: 3.5,
              }}
            >
              {t('virtualOffice.location.heading')}
            </Box>
            {[
              { icon: LocationOnIcon, text: t('virtualOffice.location.address') },
              { icon: AccessTimeIcon, text: t('virtualOffice.location.hours') },
              { icon: MailOutlineIcon, text: t('virtualOffice.location.email') },
            ].map(({ icon: Icon, text }) => (
              <Stack key={text} direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 2 }}>
                <Icon sx={{ fontSize: 20, color: colors.brand, mt: 0.25, flexShrink: 0 }} />
                <Typography sx={{ ...typography.body, color: colors.ink2 }}>{text}</Typography>
              </Stack>
            ))}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
              <Box component="span" sx={{ fontSize: 18 }}>📞</Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {t('virtualOffice.location.phone')}
              </Typography>
            </Stack>

            <Box
              component="h3"
              sx={{
                ...typography.h3,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
                mb: 2,
                fontSize: '1.05rem',
              }}
            >
              {t('virtualOffice.services.heading')}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(services) && services.map((s, i) => {
                const Icon = SERVICE_ICONS[i] || WifiIcon;
                return (
                  <Box
                    key={s}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.85,
                      px: 1.75,
                      py: 0.85,
                      borderRadius: `${radius.pill}px`,
                      bgcolor: colors.brandSoft,
                      border: `1px solid ${colors.brand}`,
                    }}
                  >
                    <Icon sx={{ fontSize: 15, color: colors.brand }} />
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: colors.brandDeep }}>
                      {s}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Registration form */}
      <Box
        id="vo-form"
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 9, md: 13 },
          px: { xs: 3, md: 5 },
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <Box sx={{ maxWidth: 660, mx: 'auto' }}>
          <Box ref={formHeadRef} sx={{ textAlign: 'center', ...formHeadSx, mb: { xs: 5, md: 7 } }}>
            <Box
              component="h2"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
                mb: 1.5,
              }}
            >
              {t('virtualOffice.form.heading')}
            </Box>
            <Typography sx={{ ...typography.bodyLg, color: colors.ink2 }}>
              {t('virtualOffice.form.subheading')}
            </Typography>
          </Box>

          {submitted ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: colors.brand, mb: 2.5 }} />
              <Box
                component="h3"
                sx={{
                  ...typography.h3,
                  color: colors.ink,
                  fontFamily: typography.fontFamily,
                  fontFeatureSettings: typography.fontFeatureSettings,
                  m: 0,
                  mb: 1.5,
                }}
              >
                {t('virtualOffice.form.confirmation.heading')}
              </Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {t('virtualOffice.form.confirmation.body')}
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ ...stepperSx, mb: 5 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {Array.isArray(steps) && steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box ref={formStepRef} sx={formStepSx}>
                {activeStep === 0 && (
                  <Stack spacing={2.5}>
                    <TextField fullWidth label={t('virtualOffice.form.fields.name')} value={form.name} onChange={handleFormChange('name')} sx={fieldSx} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.email')} type="email" value={form.email} onChange={handleFormChange('email')} sx={fieldSx} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.phone')} value={form.phone} onChange={handleFormChange('phone')} sx={fieldSx} />
                  </Stack>
                )}

                {activeStep === 1 && (
                  <Stack spacing={2.5}>
                    <TextField fullWidth label={t('virtualOffice.form.fields.company')} value={form.company} onChange={handleFormChange('company')} sx={fieldSx} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.taxId')} value={form.taxId} onChange={handleFormChange('taxId')} sx={fieldSx} />
                    <TextField fullWidth select label={t('virtualOffice.form.fields.industry')} value={form.industry} onChange={handleFormChange('industry')} sx={fieldSx}>
                      {Array.isArray(industries) && industries.map((ind) => <MenuItem key={ind} value={ind}>{ind}</MenuItem>)}
                    </TextField>
                  </Stack>
                )}

                {activeStep === 2 && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {Array.isArray(plans) && plans.map((plan, i) => (
                      <Box
                        key={plan.name}
                        onClick={() => setSelectedPlan(i)}
                        sx={{
                          p: 2.5,
                          cursor: 'pointer',
                          bgcolor: colors.bg,
                          border: selectedPlan === i ? `2px solid ${colors.brand}` : `1px solid ${colors.line}`,
                          borderRadius: `${radius.lg}px`,
                          textAlign: 'center',
                          transition: `border-color ${motion.duration} ${motion.ease}, transform ${motion.duration} ${motion.ease}`,
                          '&:hover': { borderColor: colors.brand, transform: 'translateY(-2px)' },
                        }}
                      >
                        <Box
                          component="h4"
                          sx={{
                            ...typography.h3,
                            color: colors.ink,
                            fontFamily: typography.fontFamily,
                            fontFeatureSettings: typography.fontFeatureSettings,
                            m: 0,
                            mb: 0.5,
                            fontSize: '1.05rem',
                          }}
                        >
                          {plan.name}
                        </Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.brand, mb: 2 }}>
                          {plan.price}
                        </Typography>
                        {plan.features.map((f) => (
                          <Stack key={f} direction="row" justifyContent="center" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: colors.brand, flexShrink: 0 }} />
                            <Typography sx={{ ...typography.body, color: colors.ink2 }}>{f}</Typography>
                          </Stack>
                        ))}
                      </Box>
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 5, justifyContent: activeStep === 0 ? 'flex-end' : 'space-between' }}>
                  {activeStep > 0 && (
                    <Button onClick={() => setActiveStep((p) => p - 1)} sx={secondaryButtonSx}>
                      {t('virtualOffice.form.buttons.back')}
                    </Button>
                  )}
                  {activeStep < (Array.isArray(steps) ? steps.length : 4) - 1 ? (
                    <Button variant="contained" disableElevation onClick={() => setActiveStep((p) => p + 1)} sx={primaryButtonSx}>
                      {t('virtualOffice.form.buttons.next')}
                    </Button>
                  ) : (
                    <Button variant="contained" disableElevation onClick={handleSubmit} sx={primaryButtonSx}>
                      {t('virtualOffice.form.buttons.submit')}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualOfficeSection;
