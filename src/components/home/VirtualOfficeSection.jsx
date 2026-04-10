'use client';

import { useState } from 'react';
import {
  Box, Button, Card, CardContent, MenuItem,
  Stack, Step, StepLabel, Stepper, Typography,
} from '@mui/material';
import TextField from '../common/ClearableTextField';
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
import ScrollReveal from '../common/ScrollReveal';

const BENEFIT_ICONS = [GavelIcon, ScannerIcon, LockIcon, LocationOnIcon, AccessTimeIcon, MeetingRoomIcon];
const SERVICE_ICONS = [WifiIcon, LocalParkingIcon, DirectionsBusIcon, MeetingRoomIcon, RecordVoiceOverIcon, MailOutlineIcon, BusinessIcon, AccessTimeIcon];

const VirtualOfficeSection = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', taxId: '', industry: '' });
  const [submitted, setSubmitted] = useState(false);

  const steps = t('virtualOffice.form.steps', { returnObjects: true });
  const benefits = t('virtualOffice.benefits.items', { returnObjects: true });
  const services = t('virtualOffice.services.items', { returnObjects: true });
  const plans = t('virtualOffice.form.plans', { returnObjects: true });
  const industries = t('virtualOffice.form.fields.industries', { returnObjects: true });

  const handleFormChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: '80px', md: '112px' },
          pb: { xs: '64px', md: '80px' },
          px: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <ScrollReveal direction="up">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}>
            {t('virtualOffice.hero.label')}
          </Typography>
          <Typography variant="display" component="h1" sx={{ color: 'text.primary', maxWidth: 700, mx: 'auto' }}>
            {t('virtualOffice.hero.heading')}
          </Typography>
          <Typography variant="bodyLg" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto', mt: 3 }}>
            {t('virtualOffice.hero.subheading')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{ borderRadius: '999px', px: 4, py: 1.25, fontSize: '0.875rem' }}
              onClick={() => document.getElementById('vo-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('virtualOffice.form.buttons.submit')}
            </Button>
            <Button
              variant="outlined"
              sx={{ borderRadius: '999px', px: 4, py: 1.25, fontSize: '0.875rem' }}
              href={process.env.NEXT_PUBLIC_FRONTEND_URL || '/'}
            >
              {t('nav.platform')}
            </Button>
          </Box>
        </ScrollReveal>
      </Box>

      {/* Benefits grid */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <ScrollReveal direction="up">
            <Typography variant="h2" component="h2" sx={{ color: 'text.primary', textAlign: 'center', mb: 8 }}>
              {t('virtualOffice.benefits.heading')}
            </Typography>
          </ScrollReveal>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Array.isArray(benefits) && benefits.map((item, i) => {
              const Icon = BENEFIT_ICONS[i] || GavelIcon;
              return (
                <ScrollReveal key={item.title} direction="up" delay={i * 0.08}>
                  <Card sx={{ height: '100%', p: 1 }}>
                    <CardContent>
                      <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: 'rgba(0,150,36,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Icon sx={{ fontSize: 22, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h4" component="h3" sx={{ mb: 1 }}>{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{item.body}</Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Mockup + Location */}
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
          <ScrollReveal direction="left">
            <Box
              component="img"
              src="/screenshots/oficina-virtual.png"
              alt="Oficina Virtual"
              loading="lazy"
              sx={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'block',
              }}
            />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Typography variant="h2" component="h2" sx={{ color: 'text.primary', mb: 4 }}>
              {t('virtualOffice.location.heading')}
            </Typography>
            {[
              { icon: LocationOnIcon, text: t('virtualOffice.location.address') },
              { icon: AccessTimeIcon, text: t('virtualOffice.location.hours') },
              { icon: MailOutlineIcon, text: t('virtualOffice.location.email') },
            ].map(({ icon: Icon, text }) => (
              <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5 }}>
                <Icon sx={{ fontSize: 20, color: 'primary.main', mt: 0.25, flexShrink: 0 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>{text}</Typography>
              </Box>
            ))}
            <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box component="span" sx={{ fontSize: 20 }}>📞</Box>
              {t('virtualOffice.location.phone')}
            </Typography>

            {/* Services */}
            <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
              {t('virtualOffice.services.heading')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {Array.isArray(services) && services.map((s, i) => {
                const Icon = SERVICE_ICONS[i] || WifiIcon;
                return (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75, borderRadius: '8px', bgcolor: 'rgba(0,150,36,0.06)', border: '1px solid rgba(0,150,36,0.12)' }}>
                    <Icon sx={{ fontSize: 15, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.8125rem' }}>{s}</Typography>
                  </Box>
                );
              })}
            </Box>
          </ScrollReveal>
        </Box>
      </Box>

      {/* Registration form */}
      <Box id="vo-form" sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '112px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 640, mx: 'auto' }}>
          <ScrollReveal direction="up">
            <Typography variant="h2" component="h2" sx={{ color: 'text.primary', textAlign: 'center', mb: 1 }}>
              {t('virtualOffice.form.heading')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 6 }}>
              {t('virtualOffice.form.subheading')}
            </Typography>
          </ScrollReveal>

          {submitted ? (
            <ScrollReveal direction="up">
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
                <Typography variant="h3" sx={{ mb: 2 }}>{t('virtualOffice.form.confirmation.heading')}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{t('virtualOffice.form.confirmation.body')}</Typography>
              </Box>
            </ScrollReveal>
          ) : (
            <>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {Array.isArray(steps) && steps.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.8125rem' } }}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Personal */}
              {activeStep === 0 && (
                <ScrollReveal direction="up">
                  <Stack spacing={2.5}>
                    <TextField fullWidth label={t('virtualOffice.form.fields.name')} value={form.name} onChange={handleFormChange('name')} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.email')} type="email" value={form.email} onChange={handleFormChange('email')} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.phone')} value={form.phone} onChange={handleFormChange('phone')} />
                  </Stack>
                </ScrollReveal>
              )}

              {/* Step 2: Company */}
              {activeStep === 1 && (
                <ScrollReveal direction="up">
                  <Stack spacing={2.5}>
                    <TextField fullWidth label={t('virtualOffice.form.fields.company')} value={form.company} onChange={handleFormChange('company')} />
                    <TextField fullWidth label={t('virtualOffice.form.fields.taxId')} value={form.taxId} onChange={handleFormChange('taxId')} />
                    <TextField fullWidth select label={t('virtualOffice.form.fields.industry')} value={form.industry} onChange={handleFormChange('industry')}>
                      {Array.isArray(industries) && industries.map((ind) => <MenuItem key={ind} value={ind}>{ind}</MenuItem>)}
                    </TextField>
                  </Stack>
                </ScrollReveal>
              )}

              {/* Step 3: Plan */}
              {activeStep === 2 && (
                <ScrollReveal direction="up">
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {Array.isArray(plans) && plans.map((plan, i) => (
                      <Card
                        key={plan.name}
                        onClick={() => setSelectedPlan(i)}
                        sx={{
                          cursor: 'pointer',
                          border: selectedPlan === i ? '2px solid' : '1px solid rgba(0,0,0,0.08)',
                          borderColor: selectedPlan === i ? 'primary.main' : undefined,
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="h4" sx={{ mb: 0.5 }}>{plan.name}</Typography>
                          <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'primary.main', mb: 2 }}>{plan.price}</Typography>
                          {plan.features.map((f) => (
                            <Typography key={f} variant="body2" sx={{ color: 'text.secondary', mb: 0.75, display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'center' }}>
                              <CheckCircleIcon sx={{ fontSize: 14, color: 'primary.main' }} />{f}
                            </Typography>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </ScrollReveal>
              )}

              {/* Navigation */}
              <Box sx={{ display: 'flex', gap: 2, mt: 5, justifyContent: activeStep === 0 ? 'flex-end' : 'space-between' }}>
                {activeStep > 0 && (
                  <Button variant="outlined" onClick={() => setActiveStep((p) => p - 1)} sx={{ borderRadius: '999px', px: 3 }}>
                    {t('virtualOffice.form.buttons.back')}
                  </Button>
                )}
                {activeStep < (Array.isArray(steps) ? steps.length : 4) - 1 ? (
                  <Button variant="contained" onClick={() => setActiveStep((p) => p + 1)} sx={{ borderRadius: '999px', px: 4 }}>
                    {t('virtualOffice.form.buttons.next')}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: '999px', px: 4 }}>
                    {t('virtualOffice.form.buttons.submit')}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualOfficeSection;
