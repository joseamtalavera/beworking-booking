'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useBookingFlow } from '../../store/useBookingFlow';

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
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required';
  }
  if (!form.addressLine1.trim()) {
    errors.addressLine1 = 'Address is required';
  }
  if (!form.city.trim()) {
    errors.city = 'City is required';
  }
  if (!form.postalCode.trim()) {
    errors.postalCode = 'Postal code is required';
  }
  return errors;
};

const ContactBillingStep = ({ room, onBack, onContinue }) => {
  const schedule = useBookingFlow((state) => state.schedule);

  const [formState, setFormState] = useState(initialVisitorForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const summaryItems = useMemo(() => {
    const items = [];
    if (room?.name) {
      items.push({ label: 'Room', value: room.name });
    }
    if (schedule?.date) {
      items.push({ label: 'Date', value: new Date(schedule.date).toLocaleDateString() });
    }
    if (schedule?.startTime && schedule?.endTime) {
      items.push({ label: 'Time', value: `${schedule.startTime} – ${schedule.endTime}` });
    }
    if (schedule?.attendees) {
      items.push({ label: 'Attendees', value: `${schedule.attendees}` });
    }
    return items;
  }, [room?.name, schedule]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError('');
    const nextErrors = buildErrors(formState);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    onContinue?.({ contact: formState });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Contact details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter the guest&apos;s contact and billing information. We&apos;ll create a contact profile that mirrors the admin
              dashboard.
            </Typography>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
                value={formState.firstName}
                onChange={handleChange('firstName')}
                required
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name"
                value={formState.lastName}
                onChange={handleChange('lastName')}
                required
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={formState.email}
                onChange={handleChange('email')}
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
                type="email"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={formState.phone}
                onChange={handleChange('phone')}
                required
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                value={formState.company}
                onChange={handleChange('company')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="VAT / Tax ID"
                value={formState.taxId}
                onChange={handleChange('taxId')}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Billing address
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This information will appear on invoices and receipts.
            </Typography>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Address line 1"
                value={formState.addressLine1}
                onChange={handleChange('addressLine1')}
                required
                error={Boolean(errors.addressLine1)}
                helperText={errors.addressLine1}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address line 2"
                value={formState.addressLine2}
                onChange={handleChange('addressLine2')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={formState.city}
                onChange={handleChange('city')}
                required
                error={Boolean(errors.city)}
                helperText={errors.city}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Postal code"
                value={formState.postalCode}
                onChange={handleChange('postalCode')}
                required
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Country"
                value={formState.country}
                onChange={handleChange('country')}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Reservation summary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Quick snapshot of the reservation before payment.
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {summaryItems.map((item) => (
              <Stack key={item.label} direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Button onClick={onBack}>Back</Button>
          <Button type="submit" variant="contained">
            Continue to payment
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ContactBillingStep;
