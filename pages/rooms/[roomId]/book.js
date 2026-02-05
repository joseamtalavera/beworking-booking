'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useCatalogRooms } from '@/store/useCatalogRooms';
import { useBookingFlow } from '@/store/useBookingFlow';
import BookingStepper from '@/components/booking/BookingStepper';
import SelectBookingDetails from '@/components/booking/SelectBookingDetails';
import ContactBillingStep from '@/components/booking/ContactBillingStep';
import PaymentStep from '@/components/booking/PaymentStep';
import { useBookingVisitor } from '@/store/useBookingVisitor';

export const BookingFlowContent = ({ roomId, layout = 'page' }) => {
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
        return <PaymentStep room={room} onBack={prevStep} />;
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
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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

const BookingFlowPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);

  if (!roomId) {
    return null; // Still loading router
  }

  return (
    <>
      <Head>
        <title>Book {room?.name || 'Room'} | BeWorking Booking</title>
        <meta name="description" content={`Complete your booking for ${room?.name || 'this space'} at BeWorking`} />
      </Head>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <BookingFlowContent roomId={roomId} layout="page" />
        </Box>
      </Box>
    </>
  );
};

export default BookingFlowPage;
