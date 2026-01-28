import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useCatalogRooms } from '../store/useCatalogRooms.js';
import { useBookingFlow } from '../store/useBookingFlow.js';
import BookingStepper from '../components/booking/BookingStepper.jsx';
import SelectBookingDetails from '../components/booking/SelectBookingDetails.jsx';
import ContactBillingStep from '../components/booking/ContactBillingStep.jsx';
import { useBookingVisitor } from '../store/useBookingVisitor.js';

export const BookingFlowContent = ({ layout = 'page' }) => {
  const { roomId } = useParams();
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);
  const activeStep = useBookingFlow((state) => state.activeStep);
  const nextStep = useBookingFlow((state) => state.nextStep);
  const prevStep = useBookingFlow((state) => state.prevStep);
  const resetFlow = useBookingFlow((state) => state.resetFlow);
  const setVisitorContact = useBookingVisitor((state) => state.setVisitorContact);
  const resetVisitor = useBookingVisitor((state) => state.resetVisitor);

  useEffect(() => {
    resetFlow();
    resetVisitor();
    return () => {
      resetFlow();
      resetVisitor();
    };
  }, [resetFlow, resetVisitor]);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <SelectBookingDetails room={room} onContinue={nextStep} />;
      case 1:
        return (
          <ContactBillingStep
            room={room}
            onBack={prevStep}
            onContinue={(payload) => {
              setVisitorContact(payload.contact);
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <Stack spacing={2} sx={{ border: '1px dashed', borderColor: 'grey.300', borderRadius: 3, p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Review &amp; payment
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Stripe Payment Element placeholder. We will inject the payment intent client secret here and render
              confirmation details in the next step.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={prevStep}>Back</Button>
              <Button variant="contained" disabled>
                Pay now
              </Button>
            </Stack>
          </Stack>
        );
      default:
        return null;
    }
  };

  if (!room) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Typography variant="h6">Room not found.</Typography>
        </Box>
      </Box>
    );
  }

  const containerSx =
    layout === 'modal'
      ? { width: '100%', display: 'grid', gap: 3 }
      : { width: '100%', display: 'grid', gap: 5 };

  return (
    <Stack spacing={5} sx={containerSx}>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          Booking · {room.centro}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {room.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569' }}>
          Structured flow placeholder. We'll progressively replace these sections with live availability, visitor
          registration, and Stripe payment integration.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ px: 3, py: 2, borderRadius: 3 }}>
        <BookingStepper />
      </Paper>

      {renderStep()}
    </Stack>
  );
};

const BookingFlowPage = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
      <BookingFlowContent layout="page" />
    </Box>
  </Box>
);

export default BookingFlowPage;
