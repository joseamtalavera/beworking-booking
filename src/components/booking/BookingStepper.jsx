'use client';

import { Step, StepLabel, Stepper } from '@mui/material';
import { useBookingFlow } from '../../store/useBookingFlow';
import { useTranslation } from 'react-i18next';

const STEP_KEYS = ['stepper.selectDetails', 'stepper.contactBilling', 'stepper.reviewPayment'];

const BookingStepper = () => {
  const { t } = useTranslation();
  const activeStep = useBookingFlow((state) => state.activeStep);

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
      {STEP_KEYS.map((key) => (
        <Step key={key}>
          <StepLabel>{t(key)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BookingStepper;
