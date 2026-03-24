import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, IconButton, AppBar, Toolbar, Link as MuiLink } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Seo from '@/components/oficina-virtual/Seo';
import StructuredData from '@/components/oficina-virtual/StructuredData';
import orgData from '@/components/oficina-virtual/structuredData/orgData';
import SignUp from '@/components/oficina-virtual/SignUp';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://be-working.com';
const BENEFIT_ICONS = [AccountBalanceIcon, MailOutlineIcon, MeetingRoomIcon, DashboardOutlinedIcon];

const PILARS = [
  {
    title: 'Domicilio Legal y Fiscal',
    image: '/pilar1.2final_optimized.webp',
    description: 'Te ofrecemos un domicilio legal y fiscal en múltiples ubicaciones.',
    benefits: [
      'Cumple con los requisitos legales y fiscales.',
      'Ubicación visible en Google Maps. Mantén tu privacidad sin usar tu dirección personal.',
    ],
  },
  {
    title: 'Recepción de Paquetería y Correspondencia',
    image: '/pilar2final_optimized.webp',
    description: 'Tu correspondencia siempre atendida: recibimos tu correo y paquetes.',
    benefits: [
      'En cuanto recibimos tu correspondencia, te avisamos por email o WhatsApp.',
      'Escaneo gratuito de cartas y archivo en la SuperApp.',
      'Recogida de paquetes en horario ampliado.',
    ],
  },
  {
    title: 'Acceso a la red física BeSpaces',
    image: '/pilar3final_optimized.webp',
    description: 'Utiliza nuestra red de espacios de trabajo sin coste adicional.',
    benefits: [
      'Oficina Física y Sala de Reuniones cuando las necesites.',
      'Todos estos espacios pertenecen a BeWorking.',
      'Conecta con emprendedores y freelancers.',
    ],
  },
  {
    title: 'Uso gratuito de la SuperApp',
    image: '/pilar4.1final_optimized.webp',
    description: 'Todas las herramientas de gestión empresarial incluidas en tu plan.',
    benefits: [
      'Contactos, MailBox, Contabilidad y Chat con otros Beworkers.',
      'Motor de Reservas Gratuito para usar nuestros espacios.',
      'Acceso disponible desde cualquier dispositivo.',
    ],
  },
  {
    title: 'Eventos Mensuales y Networking',
    image: '/pilar5final_optimized.webp',
    description: 'Participa en reuniones, talleres y cafés empresariales.',
    benefits: [
      'Eventos Presenciales cada mes organizados por nuestros gestores.',
      'Conoce a otros Beworkers y crea sinergias.',
      'Forma parte de una Comunidad activa y en crecimiento.',
    ],
  },
];

const GALLERY_IMAGES = [
  '/_MG_1510_optimized.webp', '/_MG_1521_optimized.webp', '/_MG_1541_optimized.webp',
  '/DSC_2247 (Mediano)_optimized.webp', '/DSC_2260 (Mediano)_optimized.webp',
  '/DSC_2281 (Mediano)_optimized.webp', '/DSC_2281_optimized.webp', '/DSC_2298_optimized.webp',
  '/DSC_2312 (Mediano)_optimized.webp', '/DSC_2660_optimized.webp', '/DSC_2665_optimized.webp',
  '/DSC_2673_optimized.webp', '/DSC_2677_optimized.webp', '/DSC_2684_optimized.webp',
  '/DSC_2689_optimized.webp', '/DSC_2691_optimized.webp', '/DSC_2697_optimized.webp',
];

export default function OficinaVirtualPage() {
  const city = 'Málaga';
  const locationKey = 'malaga';
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);
  const [apiPlans, setApiPlans] = useState(null);
  const [chosenPlan, setChosenPlan] = useState('basic');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const imagesPerPage = 4;

  useEffect(() => {
    fetch(`${API_URL}/public/plans`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setApiPlans(data); })
      .catch(() => {});
  }, []);

  const benefits = t('landing.benefits.items', { returnObjects: true }) || [];
  const i18nPlans = t('landing.pricing.plans', { returnObjects: true }) || [];
  const stats = t('landing.trust.stats', { returnObjects: true }) || [];

  // Merge API prices into i18n plan data (API is source of truth for price/popular)
  const plans = i18nPlans.map((p, idx) => {
    if (!apiPlans) return p;
    const match = apiPlans.find((a) => a.name === p.name || a.key === (p.key || ['basic', 'pro', 'max'][idx]));
    if (!match) return p;
    return { ...p, price: match.price, popular: match.popular, key: match.key, features: match.features || p.features };
  });
  const bullets = t('landing.hero.bullets', { returnObjects: true }) || [];

  const scrollToForm = (planKey) => {
    if (planKey) setChosenPlan(planKey);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') localStorage.setItem('beworking_lang', next);
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
        url="https://be-spaces.com/malaga/oficina-virtual"
        canonical="https://be-spaces.com/malaga/oficina-virtual"
      />
      <StructuredData data={orgData} />

      {/* ─── HERO ─── */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: '64px', md: '96px' },
          pb: { xs: '64px', md: '96px' },
          px: 3,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left — copy */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'primary.main',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {t('landing.hero.label')}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: 'text.primary',
              }}
            >
              {t('landing.hero.titleCity', { city })}
              <Box component="span" sx={{ color: 'primary.main' }}>{t('landing.hero.titleAccent')}</Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                lineHeight: 1.65,
                color: 'text.secondary',
                mt: 4,
                maxWidth: 480,
              }}
            >
              {t('landing.hero.subtitle')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4 }}>
              {bullets.map((bullet) => (
                <Box key={bullet} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>{bullet}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right — registration form */}
          <Box ref={formRef}>
            <SignUp defaultPlan={chosenPlan} defaultLocation={locationKey} apiPlans={apiPlans} />
          </Box>
        </Box>
      </Box>

      {/* ─── BENEFITS + PILARS (merged) ─── */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '96px' }, px: 3 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
              letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2, textAlign: 'center',
            }}
          >
            {t('landing.benefits.label')}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 500, lineHeight: 1.12,
              letterSpacing: '-0.03em', color: 'text.primary', textAlign: 'center',
              maxWidth: 600, mx: 'auto', mb: 2,
            }}
          >
            {t('landing.benefits.title')}
            <Box component="span" sx={{ color: 'primary.main' }}>{t('landing.benefits.titleAccent')}</Box>
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 8, fontSize: '1.0625rem', lineHeight: 1.65 }}>
            {t('landing.pilars.subtitle', 'Descubre los 5 pilares fundamentales de tu Oficina Virtual BeWorking.')}
          </Typography>

          {PILARS.map((pilar, idx) => {
            const isReverse = idx % 2 === 1;
            return (
              <Box
                key={pilar.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: { xs: 4, md: 6 },
                  alignItems: 'center',
                  mb: { xs: 8, md: 10 },
                  direction: { md: isReverse ? 'rtl' : 'ltr' },
                  '& > *': { direction: 'ltr' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src={pilar.image}
                    alt={pilar.title}
                    loading="lazy"
                    sx={{
                      width: '100%', maxWidth: 420, height: 'auto',
                      borderRadius: '16px', objectFit: 'contain',
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 500, color: 'text.primary', mb: 1.5 }}>
                    {pilar.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', color: 'primary.main', fontWeight: 500, mb: 2.5, lineHeight: 1.5 }}>
                    {pilar.description}
                  </Typography>
                  {pilar.benefits.map((b) => (
                    <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.25, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', lineHeight: 1.6 }}>{b}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ─── GALLERY ─── */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '64px', md: '80px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
              letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2, textAlign: 'center',
            }}
          >
            {t('landing.gallery.label', 'Galería')}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 500, lineHeight: 1.12,
              letterSpacing: '-0.03em', color: 'text.primary', textAlign: 'center', mb: 2,
            }}
          >
            {t('landing.gallery.title', 'Nuestros espacios')}
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 6, fontSize: '1.0625rem', lineHeight: 1.65 }}>
            {t('landing.gallery.subtitle', 'Explora nuestra galería para descubrir más sobre nuestros BeSpaces y servicios.')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <IconButton
              onClick={() => setGalleryIndex((i) => (i - imagesPerPage + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              sx={{ position: 'absolute', left: 0, zIndex: 2, color: 'primary.main' }}
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
                    width: { xs: '45%', sm: '23%' }, height: { xs: 120, sm: 160 },
                    objectFit: 'cover', borderRadius: '12px', cursor: 'pointer',
                    transition: 'transform 0.2s', flexShrink: 0,
                    '&:hover': { transform: 'scale(1.03)' },
                    display: { xs: i < 2 ? 'block' : 'none', sm: 'block' },
                  }}
                />
              ))}
            </Box>
            <IconButton
              onClick={() => setGalleryIndex((i) => (i + imagesPerPage) % GALLERY_IMAGES.length)}
              sx={{ position: 'absolute', right: 0, zIndex: 2, color: 'primary.main' }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="outlined" onClick={() => setGalleryDialogOpen(true)} sx={{ borderRadius: 999, px: 4, py: 1.2, fontWeight: 600, fontSize: '0.875rem' }}>
              {t('landing.gallery.viewAll', 'Ver todas las imágenes')}
            </Button>
          </Box>

          {/* Gallery full dialog */}
          <Dialog open={galleryDialogOpen} onClose={() => setGalleryDialogOpen(false)} fullWidth maxWidth="lg">
            <Box sx={{ p: 3, position: 'relative' }}>
              <IconButton onClick={() => setGalleryDialogOpen(false)} sx={{ position: 'absolute', top: 12, right: 12, color: 'grey.500' }}>✕</IconButton>
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
                      width: '100%', height: 140, objectFit: 'cover',
                      borderRadius: '8px', cursor: 'pointer',
                      transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Dialog>

          {/* Lightbox modal */}
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
                sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '12px', boxShadow: 4, mb: 2 }}
                onClick={(e) => e.stopPropagation()}
              />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <IconButton onClick={(e) => { e.stopPropagation(); setModalImageIndex((modalImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length); }} sx={{ color: 'primary.main' }}>
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); setModalImageIndex((modalImageIndex + 1) % GALLERY_IMAGES.length); }} sx={{ color: 'primary.main' }}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── MAP ─── */}
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '64px', md: '80px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
              letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2, textAlign: 'center',
            }}
          >
            {t('landing.map.label', 'Ubicación')}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 500, lineHeight: 1.12,
              letterSpacing: '-0.03em', color: 'text.primary', textAlign: 'center', mb: 2,
            }}
          >
            {t('landing.map.title', 'Nuestro BeSpace')}
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 6, fontSize: '1.0625rem', lineHeight: 1.65 }}>
            {t('landing.map.subtitle', 'Calle Alejandro Dumas 17 · Oficinas, 29004 Málaga')}
          </Typography>
          <Box sx={{ borderRadius: '16px', overflow: 'hidden', height: { xs: 300, md: 420 }, border: '1px solid rgba(0,0,0,0.08)' }}>
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
      <Box sx={{ bgcolor: '#ffffff', py: { xs: '80px', md: '96px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.75rem', fontWeight: 500, color: 'primary.main',
              letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2, textAlign: 'center',
            }}
          >
            {t('landing.pricing.label')}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 500, lineHeight: 1.12,
              letterSpacing: '-0.03em', color: 'text.primary', textAlign: 'center',
              maxWidth: 600, mx: 'auto',
            }}
          >
            {t('landing.pricing.title')}
            <Box component="span" sx={{ color: 'primary.main' }}>{t('landing.pricing.titleAccent')}</Box>
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3, mt: 8, alignItems: 'stretch',
            }}
          >
            {plans.map((plan, idx) => (
              <Box
                key={plan.name}
                sx={{
                  bgcolor: '#ffffff',
                  border: plan.popular ? '2px solid' : '1px solid rgba(0,0,0,0.08)',
                  borderColor: plan.popular ? 'primary.main' : undefined,
                  borderRadius: '16px', p: { xs: 3, md: 4 },
                  display: 'flex', flexDirection: 'column', position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' },
                }}
              >
                {plan.popular && (
                  <Box sx={{
                    position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                    bgcolor: 'primary.main', color: '#fff', px: 2.5, py: 0.5,
                    borderRadius: '0 0 8px 8px', fontSize: '0.75rem', fontWeight: 600,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    {t('landing.pricing.popular')}
                  </Box>
                )}
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  {plan.name}
                </Typography>
                {plan.description && (
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.5, lineHeight: 1.5 }}>
                    {plan.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                    {plan.price}€
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', ml: 0.5 }}>
                    {t('landing.pricing.perMonth')}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', mb: 2.5 }}>
                  {t('landing.pricing.trialBadge')}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  {(plan.features || []).map((f) => (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.25, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.5 }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={plan.popular ? 'contained' : 'outlined'}
                  onClick={() => scrollToForm(plan.key || ['basic', 'pro', 'max'][idx])}
                  sx={{
                    borderRadius: '999px', mt: 2, py: 1.2,
                    fontWeight: 600, fontSize: '0.875rem',
                  }}
                >
                  {t('landing.pricing.choosePlan')}
                </Button>
              </Box>
            ))}
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 4, fontSize: '0.8125rem', color: 'text.secondary', maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
            {t('landing.pricing.vatNote')}
          </Typography>
          <Typography sx={{ textAlign: 'center', mt: 1.5, fontSize: '0.875rem', fontWeight: 600, color: 'primary.main' }}>
            {t('landing.pricing.trialNote')}
          </Typography>
        </Box>
      </Box>

      {/* ─── TRUST ─── */}
      <Box sx={{ bgcolor: '#fafafa', py: { xs: '64px', md: '80px' }, px: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 8 }, flexWrap: 'wrap' }}>
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ─── WhatsApp FAB ─── */}
      <Box
        component="a"
        href="https://wa.me/34640369759?text=Hola,%20me%20interesa%20información%20sobre%20la%20oficina%20virtual"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        sx={{
          position: 'fixed', bottom: { xs: 20, md: 28 }, right: { xs: 20, md: 28 },
          width: 56, height: 56, borderRadius: '50%',
          bgcolor: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1200,
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          '&:hover': { transform: 'scale(1.12)', opacity: 0.8 },
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </Box>
    </>
  );
}

// Use the landing-ov Layout instead of the default AppLayout
function OVLayout({ children }) {
  const { t, i18n } = useTranslation();
  const FRONTEND_URL_LAYOUT = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://be-working.com';

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') localStorage.setItem('beworking_lang', next);
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'rgba(250,250,250,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            height: 56,
            maxWidth: 1100,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box component="a" href={FRONTEND_URL_LAYOUT} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/beworking_logo_clean.svg" alt="BeWorking" style={{ height: 24, width: 120, cursor: 'pointer' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={toggleLang}
              size="small"
              sx={{
                minWidth: 'auto',
                px: 1.5,
                py: 0.5,
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'text.secondary',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '6px',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
              }}
            >
              {t('landing.lang')}
            </Button>
            <MuiLink
              href="tel:+34951905967"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'primary.main',
                px: 1.5,
                py: 0.5,
                borderRadius: '999px',
                border: '1px solid',
                borderColor: 'primary.main',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'rgba(0,150,36,0.06)' },
              }}
            >
              <PhoneOutlinedIcon sx={{ fontSize: 16 }} />
              +34 951 905 967
            </MuiLink>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 56 }} />

      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: '#1a1a1a',
          color: 'rgba(255,255,255,0.5)',
          py: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} BeWorking — Calle Alejandro Dumas 17, Oficinas, 29004 Málaga · +34 951 905 967
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiLink href={`${FRONTEND_URL_LAYOUT}/aviso-legal`} target="_blank" rel="noopener" underline="none" sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              Legal
            </MuiLink>
            <MuiLink href={`${FRONTEND_URL_LAYOUT}/politica-de-privacidad`} target="_blank" rel="noopener" underline="none" sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              Privacidad
            </MuiLink>
            <MuiLink href="https://www.linkedin.com/company/beworking" target="_blank" rel="noopener" aria-label="LinkedIn" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              <LinkedInIcon sx={{ fontSize: 18 }} />
            </MuiLink>
            <MuiLink href="https://www.instagram.com/beworkingmalaga" target="_blank" rel="noopener" aria-label="Instagram" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              <InstagramIcon sx={{ fontSize: 18 }} />
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

OficinaVirtualPage.getLayout = (page) => <OVLayout>{page}</OVLayout>;
