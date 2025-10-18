import { Step, StepLabel, Stepper } from '@mui/material';
import { useBookingFlow } from '../../store/useBookingFlow.js';

const STEP_LABELS = ['Choose mode', 'Select details', 'Contact & billing', 'Review & payment'];

const BookingStepper = () => {
  const activeStep = useBookingFlow((state) => state.activeStep);

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ bgcolor: '#fff', borderRadius: 2, p: 2 }}>
      {STEP_LABELS.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BookingStepper;
