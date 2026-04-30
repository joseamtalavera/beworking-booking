import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Dialog, IconButton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Seo from '@/components/oficina-virtual/Seo';
import StructuredData from '@/components/oficina-virtual/StructuredData';
import orgData from '@/components/oficina-virtual/structuredData/orgData';
import SignUp from '@/components/oficina-virtual/SignUp';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const PILARS_BY_LANG = {
  es: [
    {
      category: 'Address',
      title: 'Domicilio Legal y Fiscal',
      image: '/pilar1.2final_optimized.webp',
      description: 'Te ofrecemos un domicilio legal y fiscal en múltiples ubicaciones.',
      benefits: [
        'Cumple con los requisitos legales y fiscales.',
        'Ubicación visible en Google Maps. Mantén tu privacidad sin usar tu dirección personal.',
      ],
    },
    {
      category: 'Mail',
      title: 'Recepción de Paquetería y Correspondencia',
      image: '/pilar2final_optimized.webp',
      description: 'Tu correspondencia siempre atendida: recibimos tu correo y paquetes.',
      benefits: [
        'En cuanto recibimos tu correspondencia, te avisamos por email o WhatsApp.',
        'Escaneo gratuito de cartas y archivo en BeWorkingApp.',
        'Recogida de paquetes en horario ampliado.',
      ],
    },
    {
      category: 'Space',
      title: 'Acceso a la red física BeWorking',
      image: '/pilar3final_optimized.webp',
      description: 'Utiliza nuestra red de espacios de trabajo sin coste adicional.',
      benefits: [
        'Oficina física y sala de reuniones cuando las necesites.',
        'Todos estos espacios pertenecen a BeWorking.',
        'Conecta con emprendedores y freelancers.',
      ],
    },
    {
      category: 'BeWorkingApp',
      title: 'BeWorkingApp incluida',
      image: '/pilar4.1final_optimized.webp',
      description: 'Todas las herramientas de gestión empresarial incluidas en tu plan.',
      benefits: [
        'Contactos, MailBox, contabilidad y chat con otros Beworkers.',
        'Motor de reservas gratuito para usar nuestros espacios.',
        'Acceso disponible desde cualquier dispositivo.',
      ],
    },
    {
      category: 'Networking',
      title: 'Eventos mensuales y networking',
      image: '/pilar5final_optimized.webp',
      description: 'Participa en reuniones, talleres y cafés empresariales.',
      benefits: [
        'Eventos presenciales cada mes organizados por nuestros gestores.',
        'Conoce a otros Beworkers y crea sinergias.',
        'Forma parte de una comunidad activa y en crecimiento.',
      ],
    },
  ],
  en: [
    {
      category: 'Address',
      title: 'Legal & fiscal address',
      image: '/pilar1.2final_optimized.webp',
      description: 'A registered legal and fiscal address in multiple locations.',
      benefits: [
        'Compliant with all legal and tax requirements.',
        'Visible on Google Maps. Keep your privacy without exposing your home address.',
      ],
    },
    {
      category: 'Mail',
      title: 'Mail & parcel reception',
      image: '/pilar2final_optimized.webp',
      description: 'Your post is always handled — we receive your mail and parcels.',
      benefits: [
        'Instant notification by email or WhatsApp when something arrives.',
        'Free letter scanning and archive inside BeWorkingApp.',
        'Extended pickup hours for parcels.',
      ],
    },
    {
      category: 'Space',
      title: 'Physical BeWorking network',
      image: '/pilar3final_optimized.webp',
      description: 'Use our network of physical workspaces at no extra cost.',
      benefits: [
        'Physical office and meeting rooms whenever you need them.',
        'All spaces are operated by BeWorking.',
        'Connect with entrepreneurs and freelancers.',
      ],
    },
    {
      category: 'BeWorkingApp',
      title: 'BeWorkingApp included',
      image: '/pilar4.1final_optimized.webp',
      description: 'All the management tools you need, bundled with your plan.',
      benefits: [
        'Contacts, mailbox, accounting and chat with other Beworkers.',
        'Free booking engine to use our spaces.',
        'Available from any device.',
      ],
    },
    {
      category: 'Networking',
      title: 'Monthly events & networking',
      image: '/pilar5final_optimized.webp',
      description: 'Join meetups, workshops and business breakfasts.',
      benefits: [
        'In-person events every month, hosted by our team.',
        'Meet other Beworkers and build new connections.',
        'Be part of an active and growing community.',
      ],
    },
  ],
};

const GALLERY_IMAGES = [
  '/_MG_1510_optimized.webp', '/_MG_1521_optimized.webp', '/_MG_1541_optimized.webp',
  '/DSC_2247 (Mediano)_optimized.webp', '/DSC_2260 (Mediano)_optimized.webp',
  '/DSC_2281 (Mediano)_optimized.webp', '/DSC_2281_optimized.webp', '/DSC_2298_optimized.webp',
  '/DSC_2312 (Mediano)_optimized.webp', '/DSC_2660_optimized.webp', '/DSC_2665_optimized.webp',
  '/DSC_2673_optimized.webp', '/DSC_2677_optimized.webp', '/DSC_2684_optimized.webp',
  '/DSC_2689_optimized.webp', '/DSC_2691_optimized.webp', '/DSC_2697_optimized.webp',
];

const SectionEyebrow = ({ children }) => (
  <Typography
    sx={{
      ...typography.eyebrow,
      color: colors.brand,
      textTransform: 'uppercase',
      mb: 2,
      textAlign: 'center',
    }}
  >
    {children}
  </Typography>
);

const SectionHeading = ({ children }) => (
  <Box
    component="h2"
    sx={{
      ...typography.h2,
      color: colors.ink,
      fontFamily: typography.fontFamily,
      fontFeatureSettings: typography.fontFeatureSettings,
      textAlign: 'center',
      m: 0,
    }}
  >
    {children}
  </Box>
);

export default function OficinaVirtualPage() {
  const city = 'Málaga';
  const locationKey = 'malaga';
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);
  const [chosenPlan, setChosenPlan] = useState('basic');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const imagesPerPage = 4;

  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stats = t('landing.trust.stats', { returnObjects: true }) || [];
  const bullets = t('landing.hero.bullets', { returnObjects: true }) || [];
  const isEs = i18n.language === 'es';
  const pilars = PILARS_BY_LANG[isEs ? 'es' : 'en'];

  const plan = {
    name: 'BeWorkingVirtual',
    key: 'basic',
    price: '15',
    description: isEs
      ? 'Dirección profesional en Málaga, domicilio legal y fiscal, recepción de correo y acceso a BeWorkingApp.'
      : 'Professional address in Málaga, legal & fiscal domicile, mail reception and full BeWorkingApp access.',
    features: isEs
      ? ['Domicilio fiscal y legal', 'Recepción de correo y paquetería', 'Logo en recepción', '5 días de oficina al mes', 'Acceso completo a BeWorkingApp']
      : ['Legal & fiscal address', 'Mail & parcel reception', 'Logo at reception', '5 days of office per month', 'Full access to BeWorkingApp'],
  };

  const scrollToForm = (planKey) => {
    if (planKey) setChosenPlan(planKey);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const visibleGalleryImages = [
    ...GALLERY_IMAGES.slice(galleryIndex, galleryIndex + imagesPerPage),
    ...GALLERY_IMAGES.slice(0, Math.max(0, galleryIndex + imagesPerPage - GALLERY_IMAGES.length)),
  ];

  return (
    <>
      <Seo
        title={`Oficina Virtual en ${city} — BeWorking desde 15€/mes`}
        description="Domicilio legal y fiscal, recepción de correo, coworking y plataforma de gestión incluida. Sin depósito, sin permanencia. Empieza hoy."
        image="/BeWorking_optimized.jpg"
        url="https://be-working.com/malaga/oficina-virtual"
        canonical="https://be-working.com/malaga/oficina-virtual"
      />
      <StructuredData data={orgData} />

      {/* ─── HERO ─── */}
      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          px: { xs: 3, md: 5 },
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Box
          sx={{
            maxWidth: layout.maxWidth,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Box>
            <Typography sx={{ ...typography.eyebrow, color: colors.brand, textTransform: 'uppercase', mb: 2 }}>
              {t('landing.hero.label', 'Oficina virtual')} · {city}
            </Typography>
            <Box
              component="h1"
              sx={{
                ...typography.h1,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
              }}
            >
              BeWorking
              <Box component="span" sx={{ color: colors.brand, display: 'block' }}>Virtual</Box>
            </Box>
            <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 480 }}>
              {t('landing.hero.subtitle')}
            </Typography>

            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 4 }}>
              <Typography
                sx={{
                  fontSize: { xs: '3rem', md: '4rem' },
                  fontWeight: 700,
                  color: colors.brand,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                15€
              </Typography>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, color: colors.ink2 }}>
                {isEs ? '/mes' : '/month'}
              </Typography>
            </Stack>

            <Stack spacing={1.25} sx={{ mt: 3 }}>
              {bullets.map((bullet) => (
                <Box key={bullet} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: colors.brand }} />
                  <Typography sx={{ fontSize: '0.9375rem', color: colors.ink2 }}>{bullet}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box ref={formRef}>
            <SignUp defaultPlan={chosenPlan} defaultLocation={locationKey} />
          </Box>
        </Box>
      </Box>

      {/* ─── PILARS ─── */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bg,
          py: { xs: 10, md: 14 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <SectionEyebrow>{isEs ? '¿Qué incluye?' : 'Included in your plan'}</SectionEyebrow>
          <SectionHeading>
            {isEs ? 'Cinco pilares para tu negocio' : 'Five pillars for your business'}
            <Box component="span" sx={{ color: colors.brand }}>.</Box>
          </SectionHeading>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 3, mb: { xs: 8, md: 12 } }}>
            {isEs
              ? 'Descubre los 5 pilares fundamentales de tu Oficina Virtual BeWorking.'
              : 'Discover the 5 core pillars of your BeWorking Virtual Office.'}
          </Typography>

          {pilars.map((pilar, idx) => {
            const isReverse = idx % 2 === 1;
            return (
              <Box
                key={pilar.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' },
                  gap: { xs: 4, md: 8 },
                  alignItems: 'center',
                  mb: { xs: 8, md: 12 },
                  '&:last-of-type': { mb: 0 },
                  direction: { md: isReverse ? 'rtl' : 'ltr' },
                  '& > *': { direction: 'ltr' },
                }}
              >
                <Box
                  component="img"
                  src={pilar.image}
                  alt={pilar.title}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    maxWidth: 620,
                    mx: 'auto',
                    height: 'auto',
                    display: 'block',
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      ...typography.eyebrow,
                      color: colors.brand,
                      textTransform: 'uppercase',
                      mb: 1.5,
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')} · {pilar.category}
                  </Typography>
                  <Box
                    component="h3"
                    sx={{
                      ...typography.h2,
                      color: colors.ink,
                      fontFamily: typography.fontFamily,
                      fontFeatureSettings: typography.fontFeatureSettings,
                      m: 0,
                    }}
                  >
                    {pilar.title}
                  </Box>
                  <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 2.5 }}>
                    {pilar.description}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    {pilar.benefits.map((b) => (
                      <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 18, color: colors.brand, mt: 0.4, flexShrink: 0 }} />
                        <Typography sx={{ ...typography.body, color: colors.ink2 }}>{b}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ─── GALLERY ─── */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 8, md: 11 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <SectionEyebrow>{isEs ? 'Galería' : 'Gallery'}</SectionEyebrow>
          <SectionHeading>
            {isEs ? 'Nuestros espacios' : 'Our spaces'}
          </SectionHeading>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 3, mb: 6 }}>
            {isEs
              ? 'Explora la galería para descubrir nuestros espacios y servicios.'
              : 'Browse the gallery to explore our spaces and services.'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <IconButton
              onClick={() => setGalleryIndex((i) => (i - imagesPerPage + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              sx={{ position: 'absolute', left: 0, zIndex: 2, color: colors.brand }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', px: 6 }}>
              {visibleGalleryImages.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  onClick={() => setModalImageIndex((galleryIndex + i) % GALLERY_IMAGES.length)}
                  sx={{
                    width: { xs: '45%', sm: '23%' },
                    height: { xs: 120, sm: 160 },
                    objectFit: 'cover',
                    borderRadius: `${radius.md}px`,
                    cursor: 'pointer',
                    transition: `transform ${motion.duration} ${motion.ease}`,
                    flexShrink: 0,
                    '&:hover': { transform: 'scale(1.03)' },
                    display: { xs: i < 2 ? 'block' : 'none', sm: 'block' },
                  }}
                />
              ))}
            </Box>
            <IconButton
              onClick={() => setGalleryIndex((i) => (i + imagesPerPage) % GALLERY_IMAGES.length)}
              sx={{ position: 'absolute', right: 0, zIndex: 2, color: colors.brand }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setGalleryDialogOpen(true)}
              sx={{
                background: 'none',
                border: 0,
                p: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.brand,
                letterSpacing: '-0.005em',
                transition: `opacity ${motion.duration} ${motion.ease}`,
                '&:hover': { opacity: 0.7 },
              }}
            >
              {isEs ? 'Ver todas las imágenes →' : 'View all images →'}
            </Box>
          </Box>

          <Dialog open={galleryDialogOpen} onClose={() => setGalleryDialogOpen(false)} fullWidth maxWidth="lg">
            <Box sx={{ p: 3, position: 'relative' }}>
              <IconButton onClick={() => setGalleryDialogOpen(false)} sx={{ position: 'absolute', top: 12, right: 12, color: colors.ink3 }}>✕</IconButton>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5, mt: 2 }}>
                {GALLERY_IMAGES.map((src, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    loading="lazy"
                    onClick={() => setModalImageIndex(i)}
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
                      borderRadius: `${radius.sm}px`,
                      cursor: 'pointer',
                      transition: `transform ${motion.duration} ${motion.ease}`,
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Dialog>

          {modalImageIndex !== null && (
            <Box
              onClick={() => setModalImageIndex(null)}
              sx={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                bgcolor: 'rgba(0,0,0,0.85)', zIndex: 1401,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}
            >
              <IconButton onClick={(e) => { e.stopPropagation(); setModalImageIndex(null); }} sx={{ position: 'absolute', top: 24, right: 24, color: '#fff' }}>✕</IconButton>
              <Box
                component="img"
                src={GALLERY_IMAGES[modalImageIndex]}
                alt={`Gallery ${modalImageIndex + 1}`}
                sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: `${radius.md}px`, boxShadow: 4, mb: 2 }}
                onClick={(e) => e.stopPropagation()}
              />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <IconButton onClick={(e) => { e.stopPropagation(); setModalImageIndex((modalImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length); }} sx={{ color: colors.brand }}>
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); setModalImageIndex((modalImageIndex + 1) % GALLERY_IMAGES.length); }} sx={{ color: colors.brand }}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── MAP ─── */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bg,
          py: { xs: 8, md: 11 },
          px: { xs: 3, md: 5 },
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <SectionEyebrow>{isEs ? 'Localización' : 'Location'}</SectionEyebrow>
          <SectionHeading>
            {isEs ? 'Localiza tu BeWorking.' : 'Find your BeWorking.'}
          </SectionHeading>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 3, mb: 6 }}>
            {t('landing.map.subtitle', 'Calle Alejandro Dumas 17 · Oficinas, 29004 Málaga')}
          </Typography>
          <Box sx={{ borderRadius: `${radius.lg}px`, overflow: 'hidden', height: { xs: 300, md: 420 }, border: `1px solid ${colors.line}` }}>
            <iframe
              title="BeWorking Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=BeWorking,Calle+Alejandro+Dumas+17,Málaga&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </Box>
        </Box>
      </Box>

      {/* ─── PRICING ─── */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bg,
          py: { xs: 10, md: 14 },
          px: { xs: 3, md: 5 },
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 9 } }}>
            <SectionEyebrow>{isEs ? 'Precio' : 'Pricing'}</SectionEyebrow>
            <SectionHeading>
              {isEs ? 'Un plan, todo incluido' : 'One plan, everything included'}
              <Box component="span" sx={{ color: colors.brand }}>.</Box>
            </SectionHeading>
          </Box>

          <Box
            sx={{
              maxWidth: 460,
              mx: 'auto',
              bgcolor: colors.bg,
              borderRadius: `${radius.lg}px`,
              p: { xs: 3, md: 4 },
              border: `1px solid ${colors.brand}`,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: shadow.tile,
            }}
          >
            <Box
              component="h3"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
              }}
            >
              BeWorking<Box component="span" sx={{ color: colors.brand }}>Virtual</Box>
            </Box>
            <Typography sx={{ ...typography.body, color: colors.ink2, mt: 1.5 }}>
              {plan.description}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontSize: '2.75rem', fontWeight: 700, color: colors.brand, lineHeight: 1 }}>
                {plan.price}€
              </Typography>
              <Typography sx={{ ...typography.body, color: colors.ink3 }}>
                {isEs ? '/mes' : '/mo'}
              </Typography>
            </Stack>
            <Stack spacing={1.25} sx={{ mb: 3 }}>
              {plan.features.map((f) => (
                <Stack key={f} direction="row" spacing={1.25} alignItems="flex-start">
                  <CheckCircleOutlineIcon sx={{ fontSize: 20, color: colors.brand, mt: '2px' }} />
                  <Typography sx={{ ...typography.body, color: colors.ink2 }}>{f}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button
              variant="contained"
              fullWidth
              onClick={() => scrollToForm(plan.key)}
              disableElevation
              sx={{
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.4,
                fontSize: '0.9375rem',
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {isEs ? 'Empezar por 15€/mes' : 'Start from €15/month'}
            </Button>
          </Box>

          <Typography sx={{ ...typography.body, textAlign: 'center', color: colors.ink2, mt: 5 }}>
            {isEs
              ? 'Todos los planes incluyen BeWorkingApp completo: panel de gestión, facturación y todas las herramientas. Cambia de plan en cualquier momento.'
              : 'All plans include the full BeWorkingApp: management dashboard, invoicing and all tools. Change your plan at any time.'}
          </Typography>
          <Typography sx={{ ...typography.body, textAlign: 'center', mt: 1.5, fontWeight: 600, color: colors.brand }}>
            {isEs ? 'Todos los precios + IVA. Sin permanencia.' : 'All prices + VAT. No commitment.'}
          </Typography>
        </Box>
      </Box>

      {/* ─── TRUST ─── */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 10, md: 13 },
          px: { xs: 3, md: 5 },
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <SectionEyebrow>{isEs ? 'Confianza' : 'Trust'}</SectionEyebrow>
            <SectionHeading>
              {isEs ? 'Cinco años acompañando negocios.' : 'Five years backing businesses.'}
            </SectionHeading>
            <Typography sx={{ ...typography.bodyLg, color: colors.ink2, textAlign: 'center', maxWidth: 620, mx: 'auto', mt: 3 }}>
              {isEs
                ? 'Desde 2020, BeWorking es la dirección fiscal y la plataforma de cientos de empresas. Operamos sin caídas — tu negocio nunca se queda fuera.'
                : 'Since 2020, BeWorking has been the registered address and platform for hundreds of companies. We run without downtime — your business is always on.'}
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 900,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 5, md: 8 },
              alignItems: 'start',
            }}
          >
            {stats.map((stat, i) => {
              const blurbsEs = [
                'Año en que empezamos a domiciliar empresas en Málaga.',
                'Negocios activos confían su dirección fiscal y operativa a BeWorking.',
                'Disponibilidad de la plataforma. Sin caídas, sin interrupciones.',
              ];
              const blurbsEn = [
                'The year we started hosting registered companies in Málaga.',
                'Active businesses trust BeWorking with their fiscal and operational address.',
                'Platform uptime. No downtime, no interruptions.',
              ];
              const blurb = (isEs ? blurbsEs : blurbsEn)[i] || '';
              return (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '2.75rem', md: '3.5rem' },
                      fontWeight: 700,
                      color: colors.ink,
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.ink, mt: 1.5 }}>
                    {stat.label}
                  </Typography>
                  {blurb && (
                    <Typography sx={{ ...typography.body, color: colors.ink2, mt: 1.5, maxWidth: 240, mx: 'auto' }}>
                      {blurb}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}
