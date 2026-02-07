'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
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
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  return errors;
};

const ContactBillingStep = ({ room, onBack, onContinue }) => {
  const schedule = useBookingFlow((state) => state.schedule);

  const [formState, setFormState] = useState(initialVisitorForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const estimatedTotal = useMemo(() => {
    if (!room?.priceFrom || !schedule?.startTime || !schedule?.endTime) return null;
    const startMins = timeStringToMinutes(schedule.startTime);
    const endMins = timeStringToMinutes(schedule.endTime);
    if (startMins == null || endMins == null || endMins <= startMins) return null;
    const hours = (endMins - startMins) / 60;
    return (hours * room.priceFrom).toFixed(2);
  }, [room?.priceFrom, schedule?.startTime, schedule?.endTime]);

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
              {estimatedTotal && (
                <Chip
                  label={`€${estimatedTotal}`}
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
                {schedule?.date
                  ? new Date(schedule.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Date</Typography>
            </Stack>
            <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
              <AccessTimeRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {schedule?.startTime && schedule?.endTime
                  ? `${schedule.startTime} – ${schedule.endTime}`
                  : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Time</Typography>
            </Stack>
            {schedule?.attendees ? (
              <Stack spacing={0.25} sx={{ flex: 1, alignItems: 'center' }}>
                <PeopleAltRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {schedule.attendees}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Attendees</Typography>
              </Stack>
            ) : null}
          </Stack>
        </Paper>

        {/* Contact details */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Contact details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We'll use this to confirm your booking and send access instructions.
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="First name" value={formState.firstName} onChange={handleChange('firstName')} required error={Boolean(errors.firstName)} helperText={errors.firstName} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="Last name" value={formState.lastName} onChange={handleChange('lastName')} required error={Boolean(errors.lastName)} helperText={errors.lastName} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="Email" type="email" value={formState.email} onChange={handleChange('email')} required error={Boolean(errors.email)} helperText={errors.email} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="Phone" value={formState.phone} onChange={handleChange('phone')} required error={Boolean(errors.phone)} helperText={errors.phone} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="Company" value={formState.company} onChange={handleChange('company')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="VAT / Tax ID" value={formState.taxId} onChange={handleChange('taxId')} fullWidth />
            </Grid>
          </Grid>
        </Paper>

        {/* Billing address */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Billing address
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                — optional
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Required only if you need an invoice.
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField size="small" label="Address line 1" value={formState.addressLine1} onChange={handleChange('addressLine1')} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField size="small" label="Address line 2" value={formState.addressLine2} onChange={handleChange('addressLine2')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField size="small" label="City" value={formState.city} onChange={handleChange('city')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField size="small" label="Postal code" value={formState.postalCode} onChange={handleChange('postalCode')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField size="small" label="Country" value={formState.country} onChange={handleChange('country')} fullWidth />
            </Grid>
          </Grid>
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
              color: 'text.secondary',
            }}
          >
            Back
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
            Continue to payment
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ContactBillingStep;
