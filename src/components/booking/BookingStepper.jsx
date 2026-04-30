'use client';

import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useBookingFlow } from '../../store/useBookingFlow';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors } = tokens;
const STEP_KEYS = ['stepper.selectDetails', 'stepper.contactBilling', 'stepper.reviewPayment'];

const BookingStepper = () => {
  const { t } = useTranslation();
  const activeStep = useBookingFlow((state) => state.activeStep);

  return (
    <Box
      sx={{
        '& .MuiStepIcon-root': { color: colors.line },
        '& .MuiStepIcon-root.Mui-active': { color: colors.brand },
        '& .MuiStepIcon-root.Mui-completed': { color: colors.brand },
        '& .MuiStepLabel-label': { color: colors.ink2, fontSize: '0.85rem' },
        '& .MuiStepLabel-label.Mui-active': { color: colors.ink, fontWeight: 600 },
        '& .MuiStepLabel-label.Mui-completed': { color: colors.ink2 },
        '& .MuiStepConnector-line': { borderColor: colors.line },
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEP_KEYS.map((key) => (
          <Step key={key}>
            <StepLabel>{t(key)}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default BookingStepper;
