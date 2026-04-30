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
  isDeskProducto,
} from '@/store/useCatalogRooms';
import { useBookingFlow } from '@/store/useBookingFlow';
import BookingStepper from '@/components/booking/BookingStepper';
import SelectBookingDetails from '@/components/booking/SelectBookingDetails';
import SelectDeskDetails from '@/components/booking/SelectDeskDetails';
import ContactBillingStep from '@/components/booking/ContactBillingStep';
import PaymentStep from '@/components/booking/PaymentStep';
import { useBookingVisitor } from '@/store/useBookingVisitor';
import { fetchBookingProductos } from '@/api/bookings';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, typography } = tokens;

export const BookingFlowContent = ({ roomId, initialDate, initialTime, layout = 'page' }) => {
  const { t } = useTranslation();
  const { rooms, setRooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);
  const activeStep = useBookingFlow((state) => state.activeStep);
  const nextStep = useBookingFlow((state) => state.nextStep);
  const prevStep = useBookingFlow((state) => state.prevStep);
  const resetFlow = useBookingFlow((state) => state.resetFlow);
  const setSchedule = useBookingFlow((state) => state.setSchedule);
  const setVisitorContact = useBookingVisitor((state) => state.setVisitorContact);
  const resetVisitor = useBookingVisitor((state) => state.resetVisitor);

  useEffect(() => {
    resetFlow();
    resetVisitor();
    if (initialDate || initialTime) {
      const patch = {};
      if (initialDate) { patch.date = initialDate; patch.dateTo = initialDate; }
      if (initialTime) { patch.startTime = initialTime; }
      setSchedule(patch);
    }
    return () => {
      resetFlow();
      resetVisitor();
    };
  }, [resetFlow, resetVisitor, initialDate, initialTime, setSchedule]);

  // Populate store on direct entry
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
      .catch(() => {});
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
    if (rooms.length === 0) {
      return (
        <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ ...typography.body, color: colors.ink3 }}>{t('common.loading')}</Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: colors.bg }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 6 }}>
          <Box
            component="h1"
            sx={{
              ...typography.h2,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {t('common.roomNotFound')}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Stack spacing={layout === 'modal' ? 3 : 4} sx={{ width: '100%' }}>
      <Box>
        <Typography
          sx={{
            ...typography.eyebrow,
            color: colors.brand,
            textTransform: 'uppercase',
          }}
        >
          {t('booking.eyebrow', 'Booking')} · {room.centro}
        </Typography>
        <Box
          component="h1"
          sx={{
            ...typography.h2,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
            mt: 0.5,
          }}
        >
          {room.name}
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2,
          borderRadius: `${radius.lg}px`,
          border: `1px solid ${colors.line}`,
          bgcolor: colors.bg,
        }}
      >
        <BookingStepper />
      </Paper>

      {renderStep()}
    </Stack>
  );
};

const BookingFlowPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { roomId, date, time } = router.query;
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);

  if (!roomId) return null;

  return (
    <>
      <Head>
        <title>Book {room?.name || 'Room'} | BeWorking Booking</title>
        <meta name="description" content={`Complete your booking for ${room?.name || 'this space'} at BeWorking`} />
      </Head>
      <Box sx={{ minHeight: '100vh', bgcolor: colors.bg }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 4, md: 6 } }}>
          <Button
            component={NextLink}
            href={`/rooms/${roomId}`}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              mb: 3,
              textTransform: 'none',
              color: colors.ink2,
              fontWeight: 600,
              fontSize: '0.9rem',
              '&:hover': { color: colors.brand, bgcolor: 'transparent' },
            }}
          >
            {t('common.back')}
          </Button>
          <BookingFlowContent roomId={roomId} initialDate={date} initialTime={time} layout="page" />
        </Box>
      </Box>
    </>
  );
};

export default BookingFlowPage;
