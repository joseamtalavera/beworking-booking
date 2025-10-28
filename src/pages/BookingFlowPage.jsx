import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCatalogRooms } from '../store/useCatalogRooms.js';
import { useBookingFlow } from '../store/useBookingFlow.js';
import BookingStepper from '../components/booking/BookingStepper.jsx';
import ChooseBookingMode from '../components/booking/ChooseBookingMode.jsx';
import SelectBookingDetails from '../components/booking/SelectBookingDetails.jsx';
import ContactBillingStep from '../components/booking/ContactBillingStep.jsx';
import { useBookingVisitor } from '../store/useBookingVisitor.js';
import { useAuth } from '../components/auth/AuthProvider.jsx';

export const BookingFlowContent = ({ layout = 'page' }) => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);
  const activeStep = useBookingFlow((state) => state.activeStep);
  const nextStep = useBookingFlow((state) => state.nextStep);
  const prevStep = useBookingFlow((state) => state.prevStep);
  const resetFlow = useBookingFlow((state) => state.resetFlow);
  const setVisitorContact = useBookingVisitor((state) => state.setVisitorContact);
  const resetVisitor = useBookingVisitor((state) => state.resetVisitor);
  const setActiveStep = useBookingFlow((state) => state.setActiveStep);
  const auth = useAuth();

  useEffect(() => () => {
    resetFlow();
    resetVisitor();
  }, [resetFlow, resetVisitor]);

  useEffect(() => {
    if (location.state?.skipMode) {
      setActiveStep(1);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, setActiveStep]);

  const authenticatedContact = useMemo(() => {
    if (auth.status !== 'authenticated' || !auth.profile) {
      return null;
    }
    const { name, email, phone, billing, tenantId } = auth.profile;
    return {
      name,
      email,
      phone,
      tenantId,
      billing
    };
  }, [auth.profile, auth.status]);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <ChooseBookingMode onContinue={nextStep} />;
      case 1:
        return <SelectBookingDetails room={room} onContinue={nextStep} />;
      case 2:
        return (
          <ContactBillingStep
            room={room}
            onBack={prevStep}
            onContinue={(payload) => {
              setVisitorContact(payload);
              nextStep();
            }}
            authStatus={auth.status}
            loginUrl={auth.loginUrl}
            existingContact={authenticatedContact}
          />
        );
      case 3:
        return (
          <Stack spacing={2} sx={{ border: '1px dashed #cbd5f5', borderRadius: 3, p: 3, bgcolor: '#fff' }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Review &amp; payment
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
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
    return <Typography variant="h6">Room not found.</Typography>;
  }

  const containerSx =
    layout === 'modal'
      ? { width: '100%', display: 'grid', gap: 3 }
      : { maxWidth: 720, mx: 'auto', display: 'grid', gap: 4 };

  return (
    <Box sx={containerSx}>
      <Box>
        <Typography variant="overline" sx={{ color: '#64748b' }}>
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

      <BookingStepper />

      {renderStep()}
    </Box>
  );
};

const BookingFlowPage = () => <BookingFlowContent layout="page" />;

export default BookingFlowPage;
