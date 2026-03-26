'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useBookingFlow } from '../../store/useBookingFlow';
import { timeStringToMinutes } from '../../utils/calendarUtils';
import { useTranslation } from 'react-i18next';

const fieldSx = (hasValue) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: hasValue ? 'primary.main' : 'text.primary',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
  },
  '& .MuiInput-input': {
    fontSize: '0.875rem',
    color: hasValue ? 'text.primary' : 'text.secondary',
    py: 0.25,
  },
});

const initialVisitorForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  taxId: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'Spain'
};

const buildErrors = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'contact.errors.firstNameRequired';
  if (!form.lastName.trim()) errors.lastName = 'contact.errors.lastNameRequired';
  if (!form.email.trim()) errors.email = 'contact.errors.emailRequired';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'contact.errors.emailInvalid';
  if (!form.phone.trim()) errors.phone = 'contact.errors.phoneRequired';
  return errors;
};

const ContactBillingStep = ({ room, onBack, onContinue }) => {
  const { t } = useTranslation();
  const schedule = useBookingFlow((state) => state.schedule);

  const [formState, setFormState] = useState(initialVisitorForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const isDesk = room?.priceUnit === '/month';

  const isSubscription = isDesk && schedule?.bookingType === 'month' && (schedule?.durationMonths || 1) > 1;

  const pricing = useMemo(() => {
    if (isDesk) {
      const isDayBooking = schedule?.bookingType === 'day';
      let subtotal;
      if (isDayBooking) {
        subtotal = 10; // €10/day
      } else if (isSubscription) {
        subtotal = 90; // €90/month (show monthly, not total)
      } else {
        subtotal = 90; // €90 single month
      }
      const vat = subtotal * 0.21;
      const total = subtotal + vat;
      const months = schedule?.durationMonths || 1;
      return {
        label: isDayBooking ? t('pricing.oneDay') : t(months === 1 ? 'pricing.month' : 'pricing.months', { count: months }),
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        isSubscription,
        months,
      };
    }

    if (!room?.priceFrom) return null;
    if (!schedule?.startTime || !schedule?.endTime) return null;
    const startMins = timeStringToMinutes(schedule.startTime);
    const endMins = timeStringToMinutes(schedule.endTime);
    if (startMins == null || endMins == null || endMins <= startMins) return null;
    const hours = (endMins - startMins) / 60;
    const perSession = hours * room.priceFrom;

    // Count recurring sessions
    const DAY_MAP = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
    let sessions = 1;
    if (schedule?.recurring && schedule?.weekdays?.length && schedule?.date && schedule?.dateTo) {
      const selectedDays = new Set(schedule.weekdays.map((d) => DAY_MAP[d]));
      let count = 0;
      const cursor = new Date(schedule.date + 'T00:00:00');
      const end = new Date(schedule.dateTo + 'T00:00:00');
      while (cursor <= end) {
        if (selectedDays.has(cursor.getDay())) count++;
        cursor.setDate(cursor.getDate() + 1);
      }
      if (count > 0) sessions = count;
    }

    const subtotal = perSession * sessions;
    const vat = subtotal * 0.21;
    const total = subtotal + vat;
    return {
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
      sessions,
      perSession: perSession.toFixed(2),
    };
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime, schedule?.durationMonths, schedule?.bookingType, isDesk, schedule?.recurring, schedule?.weekdays, schedule?.date, schedule?.dateTo]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError('');
    const nextErrors = buildErrors(formState);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onContinue?.({ contact: formState });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* Reservation summary */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Header with room image */}
          <Box
            sx={{
              position: 'relative',
              height: 140,
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
              sx={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                  {room?.name}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PlaceRoundedIcon sx={{ color: 'grey.300', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'grey.300' }}>
                    {room?.centro}
                  </Typography>
                </Stack>
              </Box>
              {pricing && (
                <Chip
                  label={pricing.isSubscription ? `€${pricing.total}/mo` : `€${pricing.total}`}
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

          {/* Details grid */}
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ px: 2.5, py: 2 }}
          >
            <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
              <CalendarMonthRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {isDesk && schedule?.bookingType === 'day' && schedule?.date
                  ? new Date(schedule.date + 'T00:00:00').toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : isDesk && schedule?.date && schedule?.dateTo
                    ? `${new Date(schedule.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} – ${new Date(schedule.dateTo).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
                    : schedule?.date
                      ? new Date(schedule.date).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isDesk ? (schedule?.bookingType === 'day' ? t('pricing.day') : t('pricing.period')) : t('pricing.dateLabel')}
              </Typography>
            </Stack>
            <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
              <AccessTimeRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {isDesk
                  ? (schedule?.deskProductName || '—')
                  : (schedule?.startTime && schedule?.endTime
                      ? `${schedule.startTime} – ${schedule.endTime}`
                      : '—')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isDesk ? t('pricing.deskLabel') : t('pricing.time')}
              </Typography>
            </Stack>
            {schedule?.attendees ? (
              <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
                <PeopleAltRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {schedule.attendees}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('pricing.attendees')}</Typography>
              </Stack>
            ) : null}
          </Stack>

          {pricing && (
            <Stack sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }} spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {pricing.isSubscription ? t('pricing.monthlySubtotal') : t('pricing.subtotal')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.subtotal}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('pricing.vat')}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>€{pricing.vat}</Typography>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {pricing.isSubscription ? t('pricing.monthlyTotal') : t('pricing.total')}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  €{pricing.total}{pricing.isSubscription ? t('pricing.perMonth') : ''}
                </Typography>
              </Stack>
              {pricing.isSubscription && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {t('pricing.subscriptionNote', { months: pricing.months })}
                </Typography>
              )}
            </Stack>
          )}
        </Paper>

        {/* Contact details */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t('contact.title')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('contact.subtitle')}
              </Typography>
            </Stack>

            {/* Name row */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: { xs: 3, sm: 999 } }}>
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.firstName')} placeholder={t('contact.firstNamePlaceholder')} value={formState.firstName} onChange={handleChange('firstName')} required error={Boolean(errors.firstName)} helperText={errors.firstName ? t(errors.firstName) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.firstName)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.lastName')} placeholder={t('contact.lastNamePlaceholder')} value={formState.lastName} onChange={handleChange('lastName')} required error={Boolean(errors.lastName)} helperText={errors.lastName ? t(errors.lastName) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.lastName)} />
              </Box>
            </Paper>

            {/* Email & Phone row */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: { xs: 3, sm: 999 } }}>
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" type="email" label={t('contact.email')} placeholder={t('contact.emailPlaceholder')} value={formState.email} onChange={handleChange('email')} required error={Boolean(errors.email)} helperText={errors.email ? t(errors.email) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.email)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.phone')} placeholder={t('contact.phonePlaceholder')} value={formState.phone} onChange={handleChange('phone')} required error={Boolean(errors.phone)} helperText={errors.phone ? t(errors.phone) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.phone)} />
              </Box>
            </Paper>

            {/* Company & Tax ID row */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: { xs: 3, sm: 999 } }}>
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.company')} placeholder={t('contact.companyPlaceholder')} value={formState.company} onChange={handleChange('company')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.company)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.vatTaxId')} placeholder={t('contact.vatTaxIdPlaceholder')} value={formState.taxId} onChange={handleChange('taxId')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.taxId)} />
              </Box>
            </Paper>
          </Stack>
        </Paper>

        {/* Billing address */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t('contact.billingAddress')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  — {t('contact.optional')}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('contact.billingSubtitle')}
              </Typography>
            </Stack>

            {/* Address row */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: { xs: 3, sm: 999 } }}>
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.addressLine1')} placeholder={t('contact.addressLine1Placeholder')} value={formState.addressLine1} onChange={handleChange('addressLine1')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.addressLine1)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.addressLine2')} placeholder={t('contact.addressLine2Placeholder')} value={formState.addressLine2} onChange={handleChange('addressLine2')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.addressLine2)} />
              </Box>
            </Paper>

            {/* City, Postal, Country row */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: { xs: 3, sm: 999 } }}>
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.city')} placeholder={t('contact.cityPlaceholder')} value={formState.city} onChange={handleChange('city')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.city)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.postalCode')} placeholder={t('contact.postalCodePlaceholder')} value={formState.postalCode} onChange={handleChange('postalCode')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.postalCode)} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
              <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                <TextField variant="standard" label={t('contact.country')} value={formState.country} onChange={handleChange('country')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.country)} />
              </Box>
            </Paper>
          </Stack>
        </Paper>

        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            onClick={onBack}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              color: '#4a7c59',
              '&:hover': { backgroundColor: 'rgba(74, 124, 89, 0.08)', color: '#3d6b4a' },
            }}
          >
            {t('common.back')}
          </Button>
          <Button
            type="submit"
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
            {t('contact.continueToPayment')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ContactBillingStep;
