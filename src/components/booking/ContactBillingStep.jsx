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
  Typography,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useTranslation } from 'react-i18next';
import TextField from '../common/ClearableTextField';
import { useBookingFlow } from '../../store/useBookingFlow';
import { timeStringToMinutes } from '../../utils/calendarUtils';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const fieldSx = (hasValue) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: hasValue ? colors.brand : colors.ink,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    transition: `color ${motion.duration} ${motion.ease}`,
  },
  '& .MuiInput-input': {
    fontSize: '0.9rem',
    color: hasValue ? colors.ink : colors.ink3,
    py: 0.25,
  },
});

const pillBarSx = {
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  flexDirection: { xs: 'column', sm: 'row' },
  borderRadius: { xs: 3, sm: 999 },
};

const pillCellSx = {
  flex: 1,
  px: 3,
  py: { xs: 1.25, sm: 1.5 },
  minWidth: 0,
  width: { xs: '100%', sm: 'auto' },
};

const cardSx = {
  p: { xs: 2.5, md: 3 },
  borderRadius: `${radius.lg}px`,
  border: `1px solid ${colors.line}`,
  bgcolor: colors.bg,
};

const sectionTitleSx = {
  ...typography.h3,
  color: colors.ink,
  fontFamily: typography.fontFamily,
  fontFeatureSettings: typography.fontFeatureSettings,
  m: 0,
  fontSize: { xs: '1.05rem', md: '1.15rem' },
};

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
  country: 'Spain',
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

const VerticalDivider = () => (
  <>
    <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
    <Divider sx={{ borderColor: colors.line, display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />
  </>
);

const ContactBillingStep = ({ room, onBack, onContinue }) => {
  const { t } = useTranslation();
  const schedule = useBookingFlow((state) => state.schedule);

  const [formState, setFormState] = useState(initialVisitorForm);
  const [errors, setErrors] = useState({});
  const [submitError] = useState('');

  const isDesk = room?.priceUnit === '/month';
  const isSubscription = isDesk && schedule?.bookingType === 'month' && (schedule?.durationMonths || 1) > 1;

  const pricing = useMemo(() => {
    if (isDesk) {
      const isDayBooking = schedule?.bookingType === 'day';
      let subtotal;
      if (isDayBooking) subtotal = 10;
      else if (isSubscription) subtotal = 90;
      else subtotal = 90;
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
    const vat = subtotal * 0.21;
    const total = subtotal + vat;
    return {
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
      sessions,
      perSession: perSession.toFixed(2),
    };
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime, schedule?.durationMonths, schedule?.bookingType, isDesk, schedule?.recurring, schedule?.weekdays, schedule?.date, schedule?.dateTo, t, isSubscription]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
            borderRadius: `${radius.lg}px`,
            overflow: 'hidden',
            border: `1px solid ${colors.line}`,
            bgcolor: colors.bg,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: 160,
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
              sx={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                  {room?.name}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PlaceRoundedIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                    {room?.centro}
                  </Typography>
                </Stack>
              </Box>
              {pricing && (
                <Chip
                  label={pricing.isSubscription ? `€${pricing.total}/mo` : `€${pricing.total}`}
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
            sx={{ px: 2.5, py: 2.25 }}
          >
            <Stack spacing={0.4} sx={{ flex: 1, alignItems: 'center' }}>
              <CalendarMonthRoundedIcon sx={{ color: colors.brand, fontSize: 20 }} />
              <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink, textAlign: 'center' }}>
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
                          year: 'numeric',
                        })
                      : '—'}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: colors.ink3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isDesk ? (schedule?.bookingType === 'day' ? t('pricing.day') : t('pricing.period')) : t('pricing.dateLabel')}
              </Typography>
            </Stack>
            <Stack spacing={0.4} sx={{ flex: 1, alignItems: 'center' }}>
              <AccessTimeRoundedIcon sx={{ color: colors.brand, fontSize: 20 }} />
              <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
                {isDesk
                  ? (schedule?.deskProductName || '—')
                  : (schedule?.startTime && schedule?.endTime
                      ? `${schedule.startTime} – ${schedule.endTime}`
                      : '—')}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: colors.ink3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isDesk ? t('pricing.deskLabel') : t('pricing.time')}
              </Typography>
            </Stack>
            {schedule?.attendees ? (
              <Stack spacing={0.4} sx={{ flex: 1, alignItems: 'center' }}>
                <PeopleAltRoundedIcon sx={{ color: colors.brand, fontSize: 20 }} />
                <Typography sx={{ ...typography.body, fontWeight: 600, color: colors.ink }}>
                  {schedule.attendees}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: colors.ink3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('pricing.attendees')}
                </Typography>
              </Stack>
            ) : null}
          </Stack>

          {pricing && (
            <Stack sx={{ px: 2.5, py: 2, borderTop: `1px solid ${colors.line}`, bgcolor: colors.bgSoft }} spacing={0.75}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                  {pricing.isSubscription ? t('pricing.monthlySubtotal') : t('pricing.subtotal')}
                </Typography>
                <Typography sx={{ ...typography.body, color: colors.ink2 }}>€{pricing.subtotal}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ ...typography.body, color: colors.ink2 }}>{t('pricing.vat')}</Typography>
                <Typography sx={{ ...typography.body, color: colors.ink2 }}>€{pricing.vat}</Typography>
              </Stack>
              <Divider sx={{ borderColor: colors.line, my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ ...typography.body, fontWeight: 700, color: colors.ink }}>
                  {pricing.isSubscription ? t('pricing.monthlyTotal') : t('pricing.total')}
                </Typography>
                <Typography sx={{ ...typography.body, fontWeight: 700, color: colors.ink }}>
                  €{pricing.total}{pricing.isSubscription ? t('pricing.perMonth') : ''}
                </Typography>
              </Stack>
              {pricing.isSubscription && (
                <Typography sx={{ fontSize: '0.75rem', color: colors.ink3, mt: 0.25 }}>
                  {t('pricing.subscriptionNote', { months: pricing.months })}
                </Typography>
              )}
            </Stack>
          )}
        </Paper>

        {/* Contact details */}
        <Paper elevation={0} sx={cardSx}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Box component="h3" sx={sectionTitleSx}>{t('contact.title')}</Box>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {t('contact.subtitle')}
              </Typography>
            </Stack>

            <Paper elevation={0} sx={pillBarSx}>
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.firstName')} placeholder={t('contact.firstNamePlaceholder')} value={formState.firstName} onChange={handleChange('firstName')} required error={Boolean(errors.firstName)} helperText={errors.firstName ? t(errors.firstName) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.firstName)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.lastName')} placeholder={t('contact.lastNamePlaceholder')} value={formState.lastName} onChange={handleChange('lastName')} required error={Boolean(errors.lastName)} helperText={errors.lastName ? t(errors.lastName) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.lastName)} />
              </Box>
            </Paper>

            <Paper elevation={0} sx={pillBarSx}>
              <Box sx={pillCellSx}>
                <TextField variant="standard" type="email" label={t('contact.email')} placeholder={t('contact.emailPlaceholder')} value={formState.email} onChange={handleChange('email')} required error={Boolean(errors.email)} helperText={errors.email ? t(errors.email) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.email)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.phone')} placeholder={t('contact.phonePlaceholder')} value={formState.phone} onChange={handleChange('phone')} required error={Boolean(errors.phone)} helperText={errors.phone ? t(errors.phone) : ''} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.phone)} />
              </Box>
            </Paper>

            <Paper elevation={0} sx={pillBarSx}>
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.company')} placeholder={t('contact.companyPlaceholder')} value={formState.company} onChange={handleChange('company')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.company)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.vatTaxId')} placeholder={t('contact.vatTaxIdPlaceholder')} value={formState.taxId} onChange={handleChange('taxId')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.taxId)} />
              </Box>
            </Paper>
          </Stack>
        </Paper>

        {/* Billing address */}
        <Paper elevation={0} sx={cardSx}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Box component="h3" sx={sectionTitleSx}>{t('contact.billingAddress')}</Box>
                <Typography sx={{ ...typography.body, color: colors.ink3 }}>
                  — {t('contact.optional')}
                </Typography>
              </Stack>
              <Typography sx={{ ...typography.body, color: colors.ink2 }}>
                {t('contact.billingSubtitle')}
              </Typography>
            </Stack>

            <Paper elevation={0} sx={pillBarSx}>
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.addressLine1')} placeholder={t('contact.addressLine1Placeholder')} value={formState.addressLine1} onChange={handleChange('addressLine1')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.addressLine1)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.addressLine2')} placeholder={t('contact.addressLine2Placeholder')} value={formState.addressLine2} onChange={handleChange('addressLine2')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.addressLine2)} />
              </Box>
            </Paper>

            <Paper elevation={0} sx={pillBarSx}>
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.city')} placeholder={t('contact.cityPlaceholder')} value={formState.city} onChange={handleChange('city')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.city)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.postalCode')} placeholder={t('contact.postalCodePlaceholder')} value={formState.postalCode} onChange={handleChange('postalCode')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.postalCode)} />
              </Box>
              <VerticalDivider />
              <Box sx={pillCellSx}>
                <TextField variant="standard" label={t('contact.country')} value={formState.country} onChange={handleChange('country')} fullWidth slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} sx={fieldSx(formState.country)} />
              </Box>
            </Paper>
          </Stack>
        </Paper>

        {submitError ? (
          <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>{submitError}</Alert>
        ) : null}

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            onClick={onBack}
            sx={{
              borderRadius: `${radius.pill}px`,
              px: 3,
              py: 1.4,
              textTransform: 'none',
              fontWeight: 600,
              color: colors.ink2,
              '&:hover': { bgcolor: colors.bgSoft, color: colors.ink },
            }}
          >
            {t('common.back')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
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
