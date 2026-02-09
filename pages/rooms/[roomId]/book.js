'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto
} from '@/store/useCatalogRooms';
import { useBookingFlow } from '@/store/useBookingFlow';
import BookingStepper from '@/components/booking/BookingStepper';
import SelectBookingDetails from '@/components/booking/SelectBookingDetails';
import SelectDeskDetails from '@/components/booking/SelectDeskDetails';
import ContactBillingStep from '@/components/booking/ContactBillingStep';
import PaymentStep from '@/components/booking/PaymentStep';
import { useBookingVisitor } from '@/store/useBookingVisitor';
import { fetchBookingProductos } from '@/api/bookings';

export const BookingFlowContent = ({ roomId, layout = 'page' }) => {
  const { rooms, setRooms } = useCatalogRooms();
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

  // Populate store on direct entry (when coming straight to /rooms/ma1-desks/book)
  useEffect(() => {
    if (rooms.length > 0 || !roomId) return;
    let active = true;
    fetchBookingProductos({ centerCode: 'MA1' })
      .then((data) => {
        if (!active || !Array.isArray(data)) return;

        const aulas = data.filter((p) => {
          const type = (p.type ?? p.tipo ?? '').trim().toLowerCase();
          const name = (p.name ?? p.nombre ?? '').trim().toUpperCase();
          return type === 'aula' && name.startsWith('MA1A');
        });
        const mesas = data.filter(isDeskProducto);
        const aulaRooms = aulas.map((p) => buildRoomFromProducto(p));

        const deskProducto = data.find(isCanonicalDeskProducto);

        if (deskProducto) {
          const deskRoom = buildRoomFromProducto(deskProducto);
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          setRooms([...aulaRooms, deskRoom]);
        } else if (mesas.length > 0) {
          const sample = mesas[0];
          const deskRoom = buildRoomFromProducto({ ...sample, name: 'MA1 Desks', capacity: mesas.length });
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          setRooms([...aulaRooms, deskRoom]);
        } else {
          setRooms(aulaRooms);
        }
      })
      .catch(() => {})
      .finally(() => { /* no-op */ });
    return () => { active = false; };
  }, [rooms.length, roomId, setRooms]);

  const isDesk = room?.priceUnit === '/month' || room?.slug === 'ma1-desks';

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return isDesk
          ? <SelectDeskDetails room={room} onContinue={nextStep} />
          : <SelectBookingDetails room={room} onContinue={nextStep} />;
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
    // If store is empty, we're likely fetching; show a lightweight loading state
    if (rooms.length === 0) {
      return (
        <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loading room…</Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Typography variant="h6">Room not found.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Stack spacing={layout === 'modal' ? 3 : 4} sx={{ width: '100%' }}>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          Booking · {room.centro}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {room.name}
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
          <Button
            component={NextLink}
            href={`/rooms/${roomId}`}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ mb: 2, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
          >
            Back
          </Button>
          <BookingFlowContent roomId={roomId} layout="page" />
        </Box>
      </Box>
    </>
  );
};

export default BookingFlowPage;
