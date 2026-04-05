import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Typography, Card, CardContent, CardActionArea, Button } from '@mui/material';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { getLocation } from '@/data/locations';
import ScrollReveal from '@/components/common/ScrollReveal';

const location = getLocation('malaga');

const serviceCards = [
  {
    slug: 'salas-de-reunion',
    icon: MeetingRoomRoundedIcon,
    titleKey: 'locations.services.meetingRooms',
    descKey: 'locations.malaga.meetingRoomsDesc',
    fallbackTitle: 'Salas de Reunion',
    fallbackDesc: 'Salas equipadas con proyector, WiFi y todo lo que necesitas para tus reuniones profesionales.',
  },
  {
    slug: 'coworking',
    icon: DeskRoundedIcon,
    titleKey: 'locations.services.coworking',
    descKey: 'locations.malaga.coworkingDesc',
    fallbackTitle: 'Coworking',
    fallbackDesc: 'Escritorios flexibles en un entorno profesional. Conecta con otros profesionales y haz crecer tu negocio.',
  },
  {
    slug: 'oficina-virtual',
    icon: BusinessRoundedIcon,
    titleKey: 'locations.services.virtualOffice',
    descKey: 'locations.malaga.virtualOfficeDesc',
    fallbackTitle: 'Oficina Virtual',
    fallbackDesc: 'Domicilio fiscal, recepcion de correspondencia y acceso a espacios de trabajo desde 15EUR/mes.',
  },
];

export default function MalagaHub() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{location.seo.city.title}</title>
        <meta name="description" content={location.seo.city.description} />
        <link rel="canonical" href="https://be-working.com/malaga" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Hero */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            pt: { xs: 6, md: 10 },
            pb: { xs: 5, md: 8 },
            px: 3,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <ScrollReveal direction="up">
            <Box sx={{ maxWidth: 700, mx: 'auto' }}>
              <Typography
                sx={{
                  fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
                  letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2,
                }}
              >
                BeWorking — {location.displayName}
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                  fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.035em',
                  color: 'text.primary', mb: 2,
                }}
              >
                {t('locations.malaga.heroTitle', 'Espacios de trabajo en')}
                <Box component="span" sx={{ color: 'primary.main' }}> Malaga.</Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.65,
                  color: 'text.secondary', maxWidth: 520, mx: 'auto',
                }}
              >
                {t('locations.malaga.heroSubtitle', 'Salas de reuniones, coworking y oficinas virtuales en el corazon de Malaga.')}
              </Typography>
            </Box>
          </ScrollReveal>
        </Box>

        {/* Service Cards */}
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {serviceCards.map((service, i) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.slug} direction="up" delay={i * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <CardActionArea component={NextLink} href={`/malaga/${service.slug}`} sx={{ height: '100%' }}>
                      <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box
                          sx={{
                            width: 52, height: 52, borderRadius: '12px',
                            bgcolor: 'rgba(0,150,36,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mb: 3,
                          }}
                        >
                          <Icon sx={{ fontSize: 26, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                          {t(service.titleKey, service.fallbackTitle)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, flex: 1 }}>
                          {t(service.descKey, service.fallbackDesc)}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 2.5, color: 'primary.main', fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          {t('locations.explore', 'Explorar')} →
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ScrollReveal>
              );
            })}
          </Box>
        </Box>

        {/* Location Info */}
        <Box sx={{ bgcolor: '#fafafa', py: { xs: 6, md: 10 }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Box
            sx={{
              maxWidth: 1100, mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 8 },
              alignItems: 'center',
            }}
          >
            <ScrollReveal direction="left">
              <Box
                sx={{
                  borderRadius: '16px', overflow: 'hidden',
                  height: { xs: 250, md: 350 },
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <iframe
                  title="BeWorking Malaga"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${location.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </Box>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                {t('locations.malaga.locationTitle', 'Nuestro espacio en Malaga')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.25 }} />
                <Typography sx={{ color: 'text.secondary' }}>{location.address}, {location.zip}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.25 }} />
                <Typography sx={{ color: 'text.secondary' }}>{location.hours}</Typography>
              </Box>
              <Button
                variant="contained"
                component="a"
                href={`https://wa.me/34640369759?text=Hola,%20me%20interesa%20información%20sobre%20BeWorking%20Málaga`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: '999px', px: 4, py: 1.25, mt: 2 }}
              >
                {t('locations.contactUs', 'Contactar')}
              </Button>
            </ScrollReveal>
          </Box>
        </Box>
      </Box>
    </>
  );
}
