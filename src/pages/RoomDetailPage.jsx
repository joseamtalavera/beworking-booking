import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MoneyOffRoundedIcon from '@mui/icons-material/MoneyOffRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RoomCalendarGrid, { CalendarLegend } from '../components/booking/RoomCalendarGrid.jsx';
import { useCatalogRooms } from '../store/useCatalogRooms.js';
import BookingFlowModal from '../components/booking/BookingFlowModal.jsx';

const AMENITY_ICON_COLOR = '#fb8c00';

const pickAmenityIcon = (label) => {
  if (!label) {
    return AppsRoundedIcon;
  }
  const normalized = label.toLowerCase();
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
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);

  if (!room) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Room not found</Typography>
            <Button component={Link} to="/" variant="contained">
              Back to discovery
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  // Derive gallery, description, amenities, policies, map and calendar placeholders
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const galleryImages = useMemo(() => {
    const primary = Array.isArray(room.gallery) ? room.gallery.filter(Boolean) : [];
    if (primary.length) {
      return primary;
    }
    return room.heroImage ? [room.heroImage] : [];
  }, [room.gallery, room.heroImage]);

  const spotlightImages = galleryImages.slice(0, 5);
  const featureImage = spotlightImages[0];
  const secondaryImages = spotlightImages.slice(1, 5);
  const xsGalleryAreas = ['"hero"', ...secondaryImages.map((_, index) => `"thumb${index + 1}"`)].join(' ') || '"hero"';
  const description =
    room.description ?? 'Nuestra Aula está equipada para reuniones, eventos y formaciones. Espacio luminoso con conexión de alta velocidad, pizarra y un ambiente profesional listo para tus clientes.';
  const amenities = room.amenities ?? room.tags ?? [];
  const amenitiesColumns = useMemo(() => {
    if (!amenities.length) {
      return [];
    }
    const midpoint = Math.ceil(amenities.length / 2);
    return [
      amenities.slice(0, midpoint),
      amenities.slice(midpoint)
    ].filter((column) => column.length > 0);
  }, [amenities]);
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
    const todayIso = new Date().toISOString().split('T')[0];
    const calendarEntries = room.availability ?? [
      {
        id: 'sample-1',
        fechaIni: `${todayIso}T10:00:00`,
        fechaFin: `${todayIso}T12:00:00`,
        estado: 'paid',
        cliente: { nombre: 'Reserva confirmada' },
        centro: { nombre: room.centro },
        producto: { nombre: room.name }
      },
      {
        id: 'sample-2',
        fechaIni: `${todayIso}T15:00:00`,
        fechaFin: `${todayIso}T16:30:00`,
        estado: 'created',
        cliente: { nombre: 'Bloqueo interno' },
        centro: { nombre: room.centro },
        producto: { nombre: room.name }
      }
    ];

  const calendarLabel = new Date (todayIso).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
  const mapEmbedUrl = room.mapEmbedUrl ?? (room.latitude && room.longitude
    ? `https://www.google.com/maps?q=${room.latitude},${room.longitude}&z=15&output=embed`
    : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9975481.89859359!2d-13.865541969374726!3d40.20864084878176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0e320f8d25d7f7%3A0x40340f63c70c1c0!2sEspaña!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses`);


  return (
    <>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Stack spacing={5}>
          {/* NEW: header block */}
          <Stack spacing={1}>
            <Typography variant="overline" sx={{ color: '#475569', letterSpacing: 1.2 }}>
              {room.centro}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {room.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569' }}>
              Capacidad {room.capacity} personas · desde {room.priceFrom} {room.currency}/h
            </Typography>
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
                  sx={{ width: '100%', objectFit: 'cover', borderRadius: 3 }}
                />
                {secondaryImages.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    component="img"
                    src={image}
                    alt={`${room.name} ${index + 2}`}
                    className="gallery-thumb"
                    sx={{ width: '100%', objectFit: 'cover', borderRadius: 3, gridArea: `thumb${index + 1}` }}
                  />
                ))}
              </Box>

              {galleryImages.length > 5 ? (
                <Button
                  onClick={() => setGalleryOpen(true)}
                  startIcon={<PhotoLibraryOutlinedIcon />}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    borderRadius: 999,
                    backgroundColor: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                >
                  Show all photos
                </Button>
              ) : null}
            </Box>
          ) : null}

          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                <section>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.65 }}>
                    {description}
                  </Typography>
                </section>

                {amenities.length ? (
                  <section>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Servicios incluidos
                    </Typography>
                <Grid container spacing={2}>
                  {amenitiesColumns.map((column, columnIndex) => (
                    <Grid item xs={12} md={6} key={`amenities-col-${columnIndex}`}>
                      <Stack spacing={1.5}>
                        {column.map((amenity) => {
                          const AmenityIcon = pickAmenityIcon(amenity);
                          return (
                            <Stack
                              key={amenity}
                              direction="row"
                              spacing={1.5}
                              alignItems="flex-start"
                            >
                              <AmenityIcon sx={{ color: AMENITY_ICON_COLOR, mt: 0.4, flexShrink: 0 }} fontSize="small" />
                              <Typography variant="body1" sx={{ color: '#1f2937' }}>
                                {amenity}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
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
                          <PolicyIcon sx={{ color: AMENITY_ICON_COLOR, mt: 0.35, flexShrink: 0 }} fontSize="small" />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
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
                          <InstructionIcon sx={{ color: AMENITY_ICON_COLOR, mt: 0.35, flexShrink: 0 }} fontSize="small" />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
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
              <Stack spacing={3} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Disponibilidad
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Consulta los bloques reservados y solicita tu horario ideal. La disponibilidad se sincroniza con el panel
                  de Agenda del dashboard.
                </Typography>
                <Divider />
                <CalendarLegend />
                <RoomCalendarGrid room={room} dateLabel={calendarLabel} bloqueos={calendarEntries} />
                <Button
                  onClick={() => setBookingModalOpen(true)}
                  variant="contained"
                  size="large"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
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
                border: '1px solid #e2e8f0',
                minHeight: 320,
                bgcolor: '#fff'
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
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
          >
            <IconButton
              onClick={() => setGalleryOpen(false)}
              sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#fff' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <DialogContent sx={{ pt: 4 }}>
              <Grid container spacing={2}>
                {galleryImages.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${image}-${index}`}>
                    <Box
                      component="img"
                      src={image}
                      alt={`${room.name} gallery ${index + 1}`}
                      sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
          </Dialog>
          </Stack>
        </Box>
      </Box>
      <BookingFlowModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onContinue={() => {
          setBookingModalOpen(false);
          navigate(`/rooms/${room.slug ?? room.id}/book`);
        }}
      />
    </>
  );
};

export default RoomDetailPage;
