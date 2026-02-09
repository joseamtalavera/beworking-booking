'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Head from 'next/head';
import { alpha } from '@mui/material/styles';
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import TvRoundedIcon from '@mui/icons-material/TvRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import CoffeeMakerRoundedIcon from '@mui/icons-material/CoffeeMakerRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import PanoramaRoundedIcon from '@mui/icons-material/PanoramaRounded';
import WeekendRoundedIcon from '@mui/icons-material/WeekendRounded';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MoneyOffRoundedIcon from '@mui/icons-material/MoneyOffRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useQuery } from '@tanstack/react-query';
import RoomCalendarGrid, { CalendarLegend } from '@/components/booking/RoomCalendarGrid';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto
} from '@/store/useCatalogRooms';
import { fetchPublicAvailability, fetchBookingProductos } from '@/api/bookings';
import BookingFlowModal from '@/components/booking/BookingFlowModal';

const pickAmenityIcon = (label) => {
  if (!label) {
    return AppsRoundedIcon;
  }
  const normalized = label.toLowerCase();
  if (normalized.includes('alarma')) {
    return AlarmRoundedIcon;
  }
  if (normalized.includes('marketing')) {
    return CampaignRoundedIcon;
  }
  if (normalized.includes('escaner') || normalized.includes('impresora')) {
    return PrintRoundedIcon;
  }
  if (normalized.includes('soporte')) {
    return HeadsetMicRoundedIcon;
  }
  if (normalized.includes('visa') || normalized.includes('coworking')) {
    return CreditCardRoundedIcon;
  }
  if (normalized.includes('taquilla')) {
    return LockRoundedIcon;
  }
  if (normalized.includes('agua')) {
    return OpacityRoundedIcon;
  }
  if (normalized.includes('wifi') || normalized.includes('internet')) {
    return WifiRoundedIcon;
  }
  if (normalized.includes('pantalla') || normalized.includes('screen') || normalized.includes('tv')) {
    return TvRoundedIcon;
  }
  if (normalized.includes('pizarra') || normalized.includes('whiteboard') || normalized.includes('rotulador')) {
    return EditNoteRoundedIcon;
  }
  if (normalized.includes('climat') || normalized.includes('aire') || normalized.includes('ac')) {
    return AcUnitRoundedIcon;
  }
  if (normalized.includes('coffee') || normalized.includes('café')) {
    return CoffeeMakerRoundedIcon;
  }
  if (normalized.includes('acceso') || normalized.includes('llave') || normalized.includes('24/7')) {
    return KeyRoundedIcon;
  }
  if (normalized.includes('híbrido') || normalized.includes('video') || normalized.includes('stream')) {
    return VideocamRoundedIcon;
  }
  if (normalized.includes('coworking') || normalized.includes('mesa')) {
    return MeetingRoomRoundedIcon;
  }
  if (normalized.includes('vista') || normalized.includes('panor') || normalized.includes('ventana')) {
    return PanoramaRoundedIcon;
  }
  if (normalized.includes('mobiliario') || normalized.includes('modular') || normalized.includes('mesa')) {
    return WeekendRoundedIcon;
  }
  return AppsRoundedIcon;
};

const pickPolicyIcon = (text) => {
  if (!text) {
    return ReportProblemRoundedIcon;
  }
  const normalized = text.toLowerCase();
  if (normalized.includes('modific')) {
    return AutorenewRoundedIcon;
  }
  if (normalized.includes('email') || normalized.includes('correo')) {
    return MailOutlineRoundedIcon;
  }
  if (normalized.includes('devolu') || normalized.includes('reembolso') || normalized.includes('dinero')) {
    return MoneyOffRoundedIcon;
  }
  return ReportProblemRoundedIcon;
};

const pickInstructionIcon = (text) => {
  if (!text) {
    return InfoOutlinedIcon;
  }
  const normalized = text.toLowerCase();
  if (normalized.includes('solicita') || normalized.includes('reserva') || normalized.includes('día')) {
    return EventAvailableRoundedIcon;
  }
  if (normalized.includes('factura') || normalized.includes('pago') || normalized.includes('enlace')) {
    return ReceiptLongRoundedIcon;
  }
  if (normalized.includes('instruccion') || normalized.includes('acceso') || normalized.includes('llave')) {
    return VpnKeyRoundedIcon;
  }
  return InfoOutlinedIcon;
};

const RoomDetailPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const { rooms, setRooms } = useCatalogRooms();
  const room = useMemo(
    () => rooms.find((entry) => entry.slug === roomId || entry.id === roomId),
    [rooms, roomId]
  );

  // If the store is empty (direct navigation), fetch from API and populate it
  // including both meeting rooms (MA1A*) and the aggregated desk room (MA1-DESKS).
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

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
  }, []);

  const { data: availabilityData } = useQuery({
    queryKey: ['public-availability', selectedDate, room?.productName],
    queryFn: () =>
      fetchPublicAvailability({
        date: selectedDate,
        products: room?.productName ? [room.productName] : undefined,
      }),
    enabled: Boolean(room?.productName),
  });

  const calendarEntries = useMemo(() => {
    if (!availabilityData) return [];
    const bloqueos = Array.isArray(availabilityData) ? availabilityData : availabilityData.bloqueos ?? [];
    return bloqueos.filter((b) => {
      const prodName = b.producto?.nombre || b.producto?.name || '';
      return !room?.productName || prodName.toLowerCase().includes(room.productName.toLowerCase());
    });
  }, [availabilityData, room?.productName]);

  if (!roomId) {
    return null; // Still loading router
  }

  if (!room) {
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
          <Stack spacing={2}>
            <Typography variant="h5">Room not found</Typography>
            <Button component={NextLink} href="/" variant="contained">
              Back to discovery
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  const galleryImages = (() => {
    const primary = Array.isArray(room.gallery) ? room.gallery.filter(Boolean) : [];
    if (primary.length) {
      return primary;
    }
    return room.heroImage ? [room.heroImage] : [];
  })();

  const spotlightImages = galleryImages.slice(0, 5);
  const featureImage = spotlightImages[0];
  const secondaryImages = spotlightImages.slice(1, 5);
  const xsGalleryAreas = ['"hero"', ...secondaryImages.map((_, index) => `"thumb${index + 1}"`)].join(' ') || '"hero"';
  const description =
    room.description ?? 'Nuestra Aula está equipada para reuniones, eventos y formaciones. Espacio luminoso con conexión de alta velocidad, pizarra y un ambiente profesional listo para tus clientes.';
  const amenities = room.amenities ?? room.tags ?? [];
  const amenitiesColumns = (() => {
    if (!amenities.length) {
      return [];
    }
    const midpoint = Math.ceil(amenities.length / 2);
    return [
      amenities.slice(0, midpoint),
      amenities.slice(midpoint)
    ].filter((column) => column.length > 0);
  })();
  const cancellationPolicy = room.cancellationPolicy ??
  [
      'La fecha de la reserva podrá modificarse hasta 24 h antes del inicio.',
      'La modificación debe confirmarse por email.',
      'No se realizará devolución en caso de no asistencia.'
    ];
  const bookingInstructions = room.bookingInstructions ??
  [
      'Solicita el día de tu reserva.',
      'Te confirmaremos disponibilidad y enviaremos la factura.',
      'Tras el pago recibirás instrucciones de acceso.'
    ];
  const calendarLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
  const mapEmbedUrl = room.mapEmbedUrl
    ?? `https://maps.google.com/maps?q=BeWorking+Coworking+${encodeURIComponent(room.centro || 'Málaga')}&t=&z=16&ie=UTF8&iwloc=&output=embed`;


  return (
    <>
      <Head>
        <title>{room.name} | BeWorking Booking</title>
        <meta name="description" content={description.slice(0, 160)} />
      </Head>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Stack spacing={4}>
            <Button
              component={NextLink}
              href="/"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{ alignSelf: 'flex-start', textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
            >
              Back
            </Button>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
                  {room.centro}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {room.name}
                </Typography>
                {room.subtitle && (
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {room.subtitle}
                  </Typography>
                )}
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {`Capacidad ${room.capacity} personas · desde ${room.priceFrom ?? room.price ?? '—'} ${room.priceUnit ?? room.currency ?? ''}`}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  size="small"
                  startIcon={<IosShareOutlinedIcon />}
                  variant="text"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: room.name, url: window.location.href }).catch(() => {});
                    } else if (typeof navigator !== 'undefined') {
                      navigator.clipboard?.writeText(window.location.href).catch(() => {});
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Compartir
                </Button>
                <Button
                  size="small"
                  startIcon={<DownloadOutlinedIcon />}
                  variant="text"
                  onClick={() => {
                    if (featureImage && typeof document !== 'undefined') {
                      const link = document.createElement('a');
                      link.href = featureImage;
                      link.download = `${room.name || 'room'}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: 'text.primary'
                  }}
                >
                  Guardar
                </Button>
              </Stack>
            </Stack>

          {/* Gallery */}
          {featureImage ? (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                  gridTemplateRows: { md: 'repeat(2, 220px)' },
                  gridTemplateAreas: {
                    xs: xsGalleryAreas,
                    md: '"hero hero thumb1 thumb2" "hero hero thumb3 thumb4"'
                  },
                  '& .gallery-hero': {
                    gridArea: 'hero',
                    height: { xs: 260, md: '100%' }
                  },
                  '& .gallery-thumb': {
                    height: { xs: 180, md: '100%' }
                  }
                }}
              >
                <Box
                  component="img"
                  src={featureImage}
                  alt={`${room.name} principal`}
                  className="gallery-hero"
                  onClick={() => { setCarouselIndex(0); setGalleryOpen(true); }}
                  sx={{ width: '100%', objectFit: 'cover', borderRadius: 3, cursor: 'pointer' }}
                />
                {secondaryImages.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    component="img"
                    src={image}
                    alt={`${room.name} ${index + 2}`}
                    className="gallery-thumb"
                    onClick={() => { setCarouselIndex(index + 1); setGalleryOpen(true); }}
                    sx={{ width: '100%', objectFit: 'cover', borderRadius: 3, gridArea: `thumb${index + 1}`, cursor: 'pointer' }}
                  />
                ))}
              </Box>

              <Button
                onClick={() => { setCarouselIndex(0); setGalleryOpen(true); }}
                startIcon={<PhotoLibraryOutlinedIcon />}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  borderRadius: 999,
                  backgroundColor: 'background.paper',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  boxShadow: (theme) => theme.shadows[6],
                  '&:hover': { backgroundColor: 'background.default' }
                }}
              >
                {`${galleryImages.length} photos`}
              </Button>
            </Box>
          ) : null}

          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                <section>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                    {description}
                  </Typography>
                </section>

                {amenities.length ? (
                  <section>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Servicios incluidos
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
                      {amenities.map((amenity) => {
                        const AmenityIcon = pickAmenityIcon(amenity);
                        return (
                          <Box key={amenity}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                py: 1,
                                px: 1.75,
                                borderRadius: 999,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                '&:hover': {
                                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
                                  boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
                                },
                              }}
                            >
                              <AmenityIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                                {amenity}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </section>
                ) : null}

                <section>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Política de cancelación
                  </Typography>
                  <Stack spacing={1.25}>
                    {cancellationPolicy.map((item) => {
                      const PolicyIcon = pickPolicyIcon(item);
                      return (
                        <Stack direction="row" spacing={1.5} key={item}>
                          <PolicyIcon sx={{ color: 'primary.main', mt: 0.35, flexShrink: 0 }} fontSize="small" />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </section>

                <section>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Instrucciones
                  </Typography>
                  <Stack spacing={1.25}>
                    {bookingInstructions.map((item) => {
                      const InstructionIcon = pickInstructionIcon(item);
                      return (
                        <Stack direction="row" spacing={1.5} key={item}>
                          <InstructionIcon sx={{ color: 'primary.main', mt: 0.35, flexShrink: 0 }} fontSize="small" />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </section>
              </Stack>
            </Grid>

            {/* NEW: calendar + CTA */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Disponibilidad
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Consulta los bloques reservados y solicita tu horario ideal. La disponibilidad se sincroniza con el panel
                  de Agenda del dashboard.
                </Typography>
                <Divider />
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                  <TextField
                    label="Select date"
                    type="date"
                    size="small"
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 170 }}
                  />
                  <CalendarLegend />
                </Stack>
                <RoomCalendarGrid room={room} dateLabel={calendarLabel} bloqueos={calendarEntries} />
                <Button
                  onClick={() => setBookingModalOpen(true)}
                  variant="contained"
                  size="large"
                  sx={{
                    alignSelf: 'center',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    borderRadius: 999,
                    px: 5,
                    py: 1.25,
                  }}
                >
                  Start booking
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* NEW: map */}
          <section>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Ubicación
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
                minHeight: 320,
                bgcolor: 'background.paper'
              }}
            >
              <Box
                component="iframe"
                title={`Mapa de ${room.name}`}
                src={mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                sx={{ width: '100%', height: 360, border: 0 }}
              />
            </Box>
          </section>

          <Dialog
            open={galleryOpen}
            onClose={() => setGalleryOpen(false)}
            fullScreen
            PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.92)' } }}
          >
            {/* Top bar */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 3, py: 2 }}
            >
              <Typography variant="body2" sx={{ color: 'grey.400', fontWeight: 600 }}>
                {`${carouselIndex + 1} / ${galleryImages.length}`}
              </Typography>
              <IconButton
                onClick={() => setGalleryOpen(false)}
                sx={{ color: 'grey.300', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            {/* Carousel body */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                px: { xs: 2, md: 8 },
                pb: 4,
                userSelect: 'none',
              }}
            >
              {/* Prev */}
              {galleryImages.length > 1 && (
                <IconButton
                  onClick={() => setCarouselIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  sx={{
                    position: 'absolute',
                    left: { xs: 8, md: 24 },
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    width: 48,
                    height: 48,
                  }}
                >
                  <ChevronLeftRoundedIcon fontSize="large" />
                </IconButton>
              )}

              <Box
                component="img"
                src={galleryImages[carouselIndex]}
                alt={`${room.name} ${carouselIndex + 1}`}
                sx={{
                  maxHeight: 'calc(100vh - 140px)',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />

              {/* Next */}
              {galleryImages.length > 1 && (
                <IconButton
                  onClick={() => setCarouselIndex((prev) => (prev + 1) % galleryImages.length)}
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, md: 24 },
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    width: 48,
                    height: 48,
                  }}
                >
                  <ChevronRightRoundedIcon fontSize="large" />
                </IconButton>
              )}
            </Box>

            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ pb: 3, px: 2, overflowX: 'auto' }}
              >
                {galleryImages.map((image, index) => (
                  <Box
                    key={`thumb-${index}`}
                    component="img"
                    src={image}
                    alt={`thumbnail ${index + 1}`}
                    onClick={() => setCarouselIndex(index)}
                    sx={{
                      width: 56,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      opacity: index === carouselIndex ? 1 : 0.4,
                      border: index === carouselIndex ? '2px solid #fff' : '2px solid transparent',
                      transition: 'opacity 0.2s, border-color 0.2s',
                      flexShrink: 0,
                      '&:hover': { opacity: 0.8 },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Dialog>
          </Stack>
        </Box>
      </Box>
      <BookingFlowModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onContinue={() => {
          setBookingModalOpen(false);
          router.push(`/rooms/${room.slug ?? room.id}/book`);
        }}
      />
    </>
  );
};

export default RoomDetailPage;
