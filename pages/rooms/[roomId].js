'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Head from 'next/head';
import { Alert, Box, Button, CircularProgress, Dialog, Divider, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
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
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import DeckRoundedIcon from '@mui/icons-material/DeckRounded';
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
import { buildTimeSlots, bloqueoCoversSlot } from '@/utils/calendarUtils';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchPublicAvailability, fetchDeskAvailability, fetchBookingProductos } from '@/api/bookings';
import BookingFlowModal from '@/components/booking/BookingFlowModal';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography } = tokens;

const pickAmenityIcon = (label) => {
  if (!label) return AppsRoundedIcon;
  const normalized = label.toLowerCase();
  if (normalized.includes('alarma')) return AlarmRoundedIcon;
  if (normalized.includes('marketing')) return CampaignRoundedIcon;
  if (normalized.includes('escaner') || normalized.includes('impresora')) return PrintRoundedIcon;
  if (normalized.includes('soporte')) return HeadsetMicRoundedIcon;
  if (normalized.includes('visa') || normalized.includes('coworking')) return CreditCardRoundedIcon;
  if (normalized.includes('taquilla')) return LockRoundedIcon;
  if (normalized.includes('agua')) return OpacityRoundedIcon;
  if (normalized.includes('wifi') || normalized.includes('internet')) return WifiRoundedIcon;
  if (normalized.includes('pantalla') || normalized.includes('screen') || normalized.includes('tv')) return TvRoundedIcon;
  if (normalized.includes('pizarra') || normalized.includes('whiteboard') || normalized.includes('rotulador')) return EditNoteRoundedIcon;
  if (normalized.includes('climat') || normalized.includes('aire') || normalized.includes('ac')) return AcUnitRoundedIcon;
  if (normalized.includes('coffee') || normalized.includes('café')) return CoffeeMakerRoundedIcon;
  if (normalized.includes('acceso') || normalized.includes('llave') || normalized.includes('24/7')) return KeyRoundedIcon;
  if (normalized.includes('híbrido') || normalized.includes('video') || normalized.includes('stream')) return VideocamRoundedIcon;
  if (normalized.includes('coworking') || normalized.includes('mesa')) return MeetingRoomRoundedIcon;
  if (normalized.includes('cocina')) return KitchenRoundedIcon;
  if (normalized.includes('terraza')) return DeckRoundedIcon;
  if (normalized.includes('vista') || normalized.includes('panor') || normalized.includes('ventana')) return PanoramaRoundedIcon;
  if (normalized.includes('mobiliario') || normalized.includes('modular') || normalized.includes('mesa')) return WeekendRoundedIcon;
  return AppsRoundedIcon;
};

const pickPolicyIcon = (text) => {
  if (!text) return ReportProblemRoundedIcon;
  const normalized = text.toLowerCase();
  if (normalized.includes('modific')) return AutorenewRoundedIcon;
  if (normalized.includes('email') || normalized.includes('correo')) return MailOutlineRoundedIcon;
  if (normalized.includes('devolu') || normalized.includes('reembolso') || normalized.includes('dinero')) return MoneyOffRoundedIcon;
  return ReportProblemRoundedIcon;
};

const pickInstructionIcon = (text) => {
  if (!text) return InfoOutlinedIcon;
  const normalized = text.toLowerCase();
  if (normalized.includes('solicita') || normalized.includes('reserva') || normalized.includes('día')) return EventAvailableRoundedIcon;
  if (normalized.includes('factura') || normalized.includes('pago') || normalized.includes('enlace')) return ReceiptLongRoundedIcon;
  if (normalized.includes('instruccion') || normalized.includes('acceso') || normalized.includes('llave')) return VpnKeyRoundedIcon;
  return InfoOutlinedIcon;
};

const SectionHeading = ({ children, sx }) => (
  <Box
    component="h2"
    sx={{
      ...typography.h3,
      color: colors.ink,
      fontFamily: typography.fontFamily,
      fontFeatureSettings: typography.fontFeatureSettings,
      m: 0,
      mb: 2,
      ...sx,
    }}
  >
    {children}
  </Box>
);

const RoomDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { roomId } = router.query;
  const { rooms, setRooms } = useCatalogRooms();
  const room = useMemo(
    () => rooms.find((entry) => entry.slug === roomId || entry.id === roomId),
    [rooms, roomId],
  );

  // If the store is empty (direct navigation), fetch from API and populate it
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
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('date')) return params.get('date');
    }
    return new Date().toISOString().split('T')[0];
  });

  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
  }, []);

  const isDesk = room?.priceUnit === '/month' || room?.slug === 'ma1-desks';
  // Desk count comes from the catalog (room.capacity); fall back to 16 only if
  // capacity is missing so we still render something sensible while the room
  // record is loading.
  const DESK_COUNT = room?.capacity ?? 16;

  const { data: availabilityData, isLoading: availLoading, isError: availError, error: availErrorMsg } = useQuery({
    queryKey: ['public-availability', selectedDate, room?.productName],
    queryFn: () =>
      fetchPublicAvailability({
        date: selectedDate,
        products: room?.productName ? [room.productName] : undefined,
      }),
    enabled: Boolean(room?.productName) && !isDesk,
  });

  const { data: deskAvailabilityData } = useQuery({
    queryKey: ['desk-availability', selectedDate],
    queryFn: () => fetchDeskAvailability(selectedDate, selectedDate, { deskCount: DESK_COUNT }),
    enabled: isDesk,
  });

  const calendarEntries = useMemo(() => {
    if (!isDesk) {
      if (!availabilityData) return [];
      const bloqueos = Array.isArray(availabilityData) ? availabilityData : availabilityData.bloqueos ?? [];
      return bloqueos.filter((b) => {
        const prodName = b.producto?.nombre || b.producto?.name || '';
        return !room?.productName || prodName.toLowerCase().includes(room.productName.toLowerCase());
      });
    }
    if (!deskAvailabilityData) return [];
    const bloqueos = Array.isArray(deskAvailabilityData) ? deskAvailabilityData : deskAvailabilityData.bloqueos ?? [];
    return bloqueos;
  }, [isDesk, availabilityData, deskAvailabilityData, room?.productName]);

  const deskSlotInfo = useMemo(() => {
    if (!isDesk || calendarEntries.length === 0) return null;

    const deskBloqueoCoversSlot = (b, slotId) => {
      const ini = b.fechaIni || '';
      const fin = b.fechaFin || '';
      const iniDate = ini.split('T')[0];
      const finDate = fin.split('T')[0];
      if (iniDate !== finDate) {
        return selectedDate >= iniDate && selectedDate < finDate;
      }
      return bloqueoCoversSlot(b, slotId);
    };

    const slots = buildTimeSlots();
    const info = {};
    slots.forEach((slot) => {
      let bookedCount = 0;
      calendarEntries.forEach((b) => {
        if (deskBloqueoCoversSlot(b, slot.id)) bookedCount += 1;
      });
      info[slot.id] = {
        bookedCount,
        freeCount: DESK_COUNT - bookedCount,
        fullyBooked: bookedCount >= DESK_COUNT,
      };
    });
    return info;
  }, [isDesk, calendarEntries, selectedDate]);

  if (!roomId) return null;

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
          <Stack spacing={2}>
            <Box
              component="h1"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                m: 0,
              }}
            >
              {t('common.roomNotFound')}
            </Box>
            <Button
              component={NextLink}
              href="/"
              variant="contained"
              disableElevation
              sx={{
                alignSelf: 'flex-start',
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 3.5,
                py: 1.4,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {t('common.backToDiscovery')}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  const galleryImages = (() => {
    const primary = Array.isArray(room.gallery) ? room.gallery.filter(Boolean) : [];
    if (primary.length) return primary;
    return room.heroImage ? [room.heroImage] : [];
  })();

  const spotlightImages = galleryImages.slice(0, 5);
  const featureImage = spotlightImages[0];
  const secondaryImages = spotlightImages.slice(1, 5);
  const xsGalleryAreas = ['"hero"', ...secondaryImages.map((_, index) => `"thumb${index + 1}"`)].join(' ') || '"hero"';
  const description =
    room.description ?? 'Nuestra Aula está equipada para reuniones, eventos y formaciones. Espacio luminoso con conexión de alta velocidad, pizarra y un ambiente profesional listo para tus clientes.';
  const amenities = room.amenities ?? room.tags ?? [];
  const cancellationPolicy = room.cancellationPolicy ?? [
    'La fecha de la reserva podrá modificarse hasta 24 h antes del inicio.',
    'La modificación debe confirmarse por email.',
    'No se realizará devolución en caso de no asistencia.',
  ];
  const bookingInstructions = room.bookingInstructions ?? [
    'Solicita el día de tu reserva.',
    'Te confirmaremos disponibilidad y enviaremos la factura.',
    'Tras el pago recibirás instrucciones de acceso.',
  ];
  const calendarLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const mapEmbedUrl = room.mapEmbedUrl
    ?? `https://maps.google.com/maps?q=BeWorking+Coworking+${encodeURIComponent(room.centro || 'Málaga')}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <Head>
        <title>{room.name} | BeWorking Booking</title>
        <meta name="description" content={description.slice(0, 160)} />
      </Head>
      <Box sx={{ minHeight: '100vh', bgcolor: colors.bg }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 4, md: 6 } }}>
          <Stack spacing={4}>
            <Button
              component={NextLink}
              href="/"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'none',
                color: colors.ink2,
                fontWeight: 600,
                fontSize: '0.9rem',
                '&:hover': { color: colors.brand, bgcolor: 'transparent' },
              }}
            >
              {t('common.back')}
            </Button>

            {/* Title row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'flex-start' }}
              spacing={2}
            >
              <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    ...typography.eyebrow,
                    color: colors.brand,
                    textTransform: 'uppercase',
                  }}
                >
                  {room.centro}
                </Typography>
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
                  {room.name}
                </Box>
                {room.subtitle && (
                  <Typography sx={{ ...typography.bodyLg, color: colors.ink2, fontWeight: 500, mt: 0.5 }}>
                    {room.subtitle}
                  </Typography>
                )}
                <Typography sx={{ ...typography.body, color: colors.ink2, mt: 0.5 }}>
                  {`${t('room.capacity', { count: room.capacity })} · ${t('room.from')} ${room.priceFrom ?? room.price ?? '—'} ${room.priceUnit ?? room.currency ?? ''}`}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
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
                    fontWeight: 600,
                    color: colors.ink,
                    '&:hover': { bgcolor: colors.bgSoft },
                  }}
                >
                  {t('room.share')}
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
                    fontWeight: 600,
                    color: colors.ink,
                    '&:hover': { bgcolor: colors.bgSoft },
                  }}
                >
                  {t('room.save')}
                </Button>
              </Stack>
            </Stack>

            {/* Gallery grid */}
            {featureImage ? (
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                    gridTemplateRows: { md: 'repeat(2, 220px)' },
                    gridTemplateAreas: {
                      xs: xsGalleryAreas,
                      md: '"hero hero thumb1 thumb2" "hero hero thumb3 thumb4"',
                    },
                    '& .gallery-hero': { gridArea: 'hero', height: { xs: 260, md: '100%' } },
                    '& .gallery-thumb': { height: { xs: 180, md: '100%' } },
                  }}
                >
                  <Box
                    component="img"
                    src={featureImage}
                    alt={`${room.name} principal`}
                    className="gallery-hero"
                    onClick={() => { setCarouselIndex(0); setGalleryOpen(true); }}
                    sx={{ width: '100%', objectFit: 'cover', borderRadius: `${radius.lg}px`, cursor: 'pointer' }}
                  />
                  {secondaryImages.map((image, index) => (
                    <Box
                      key={`${image}-${index}`}
                      component="img"
                      src={image}
                      alt={`${room.name} ${index + 2}`}
                      className="gallery-thumb"
                      onClick={() => { setCarouselIndex(index + 1); setGalleryOpen(true); }}
                      sx={{ width: '100%', objectFit: 'cover', borderRadius: `${radius.lg}px`, gridArea: `thumb${index + 1}`, cursor: 'pointer' }}
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
                    borderRadius: `${radius.pill}px`,
                    bgcolor: colors.bg,
                    color: colors.ink,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 2.25,
                    py: 0.75,
                    border: `1px solid ${colors.line}`,
                    boxShadow: shadow.frame,
                    '&:hover': { bgcolor: colors.bgSoft },
                  }}
                >
                  {t('room.photos', { count: galleryImages.length })}
                </Button>
              </Box>
            ) : null}

            <Grid container spacing={5}>
              <Grid item xs={12} md={7}>
                <Stack spacing={5}>
                  <Box component="section">
                    <SectionHeading>{t('room.description')}</SectionHeading>
                    <Typography sx={{ ...typography.body, color: colors.ink2, lineHeight: 1.7 }}>
                      {description}
                    </Typography>
                  </Box>

                  {amenities.length ? (
                    <Box component="section">
                      <SectionHeading>{t('room.amenities')}</SectionHeading>
                      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.25}>
                        {amenities.map((amenity) => {
                          const AmenityIcon = pickAmenityIcon(amenity);
                          return (
                            <Box
                              key={amenity}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                py: 0.85,
                                px: 1.75,
                                borderRadius: `${radius.pill}px`,
                                bgcolor: colors.bg,
                                border: `1px solid ${colors.line}`,
                                transition: `border-color ${motion.duration} ${motion.ease}, background-color ${motion.duration} ${motion.ease}`,
                                '&:hover': { borderColor: colors.brand, bgcolor: colors.brandSoft },
                              }}
                            >
                              <AmenityIcon sx={{ fontSize: 17, color: colors.brand }} />
                              <Typography sx={{ fontSize: '0.85rem', color: colors.ink, fontWeight: 500 }}>
                                {amenity}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  ) : null}

                  <Box component="section">
                    <SectionHeading>{t('room.cancellation')}</SectionHeading>
                    <Stack spacing={1.5}>
                      {cancellationPolicy.map((item) => {
                        const PolicyIcon = pickPolicyIcon(item);
                        return (
                          <Stack direction="row" spacing={1.5} key={item}>
                            <PolicyIcon sx={{ color: colors.brand, mt: 0.35, flexShrink: 0, fontSize: 18 }} />
                            <Typography sx={{ ...typography.body, color: colors.ink2 }}>{item}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box component="section">
                    <SectionHeading>{t('room.instructions')}</SectionHeading>
                    <Stack spacing={1.5}>
                      {bookingInstructions.map((item) => {
                        const InstructionIcon = pickInstructionIcon(item);
                        return (
                          <Stack direction="row" spacing={1.5} key={item}>
                            <InstructionIcon sx={{ color: colors.brand, mt: 0.35, flexShrink: 0, fontSize: 18 }} />
                            <Typography sx={{ ...typography.body, color: colors.ink2 }}>{item}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* Calendar + CTA */}
              <Grid item xs={12} md={5}>
                <Stack
                  spacing={3}
                  sx={{
                    border: `1px solid ${colors.line}`,
                    borderRadius: `${radius.lg}px`,
                    p: 3,
                    bgcolor: colors.bg,
                    boxShadow: shadow.tile,
                    position: { md: 'sticky' },
                    top: { md: 88 },
                  }}
                >
                  <Box
                    component="h3"
                    sx={{
                      ...typography.h3,
                      color: colors.ink,
                      fontFamily: typography.fontFamily,
                      fontFeatureSettings: typography.fontFeatureSettings,
                      m: 0,
                      fontSize: { xs: '1.25rem', md: '1.4rem' },
                    }}
                  >
                    {t('room.availability')}
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      border: `1px solid ${colors.line}`,
                      bgcolor: colors.bg,
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      flexDirection: { xs: 'column', sm: 'row' },
                      borderRadius: { xs: 3, sm: 999 },
                    }}
                  >
                    <Box sx={{ flex: 1, px: 2.5, py: { xs: 1.25, sm: 1.5 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                      <TextField
                        variant="standard"
                        type="date"
                        label={t('room.selectDate')}
                        value={selectedDate}
                        onChange={handleDateChange}
                        fullWidth
                        slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                        sx={{
                          '& .MuiInputLabel-root': { fontSize: '0.7rem', fontWeight: 700, color: colors.ink, textTransform: 'uppercase', letterSpacing: '0.06em' },
                          '& .MuiInput-input': { fontSize: '0.875rem', color: colors.ink, py: 0.25 },
                        }}
                      />
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: colors.line, display: { xs: 'none', sm: 'block' } }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', px: 2.5, py: { xs: 1.25, sm: 1.5 } }}>
                      <CalendarLegend />
                    </Box>
                  </Paper>
                  {availError ? (
                    <Alert severity="error" sx={{ borderRadius: `${radius.md}px` }}>
                      {availErrorMsg?.message || t('booking.fetchError')}
                    </Alert>
                  ) : null}
                  {availLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={28} sx={{ color: colors.brand }} />
                    </Box>
                  ) : (
                    <RoomCalendarGrid
                      room={room}
                      dateLabel={calendarLabel}
                      bloqueos={calendarEntries}
                      isDesk={isDesk}
                      deskSlotInfo={deskSlotInfo}
                      deskCount={DESK_COUNT}
                    />
                  )}
                  <Button
                    onClick={() => setBookingModalOpen(true)}
                    variant="contained"
                    size="large"
                    disableElevation
                    sx={{
                      alignSelf: 'center',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: colors.brand,
                      color: colors.bg,
                      borderRadius: `${radius.pill}px`,
                      px: 5,
                      py: 1.4,
                      '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
                    }}
                  >
                    {t('room.startBooking')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Map */}
            <Box component="section">
              <SectionHeading>{t('room.location')}</SectionHeading>
              <Box
                sx={{
                  borderRadius: `${radius.lg}px`,
                  overflow: 'hidden',
                  border: `1px solid ${colors.line}`,
                  minHeight: 320,
                  bgcolor: colors.bg,
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
            </Box>

            {/* Fullscreen gallery dialog */}
            <Dialog
              open={galleryOpen}
              onClose={() => setGalleryOpen(false)}
              fullScreen
              PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.94)' } }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  {`${carouselIndex + 1} / ${galleryImages.length}`}
                </Typography>
                <IconButton
                  onClick={() => setGalleryOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>

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
                    borderRadius: `${radius.md}px`,
                  }}
                />

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

              {galleryImages.length > 1 && (
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ pb: 3, px: 2, overflowX: 'auto' }}>
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
                        transition: `opacity ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
                        flexShrink: 0,
                        '&:hover': { opacity: 0.85 },
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
          const query = {};
          if (selectedDate) query.date = selectedDate;
          else if (router.query.date) query.date = router.query.date;
          if (router.query.time) query.time = router.query.time;
          router.push({ pathname: `/rooms/${room.slug ?? room.id}/book`, query });
        }}
      />
    </>
  );
};

export default RoomDetailPage;
