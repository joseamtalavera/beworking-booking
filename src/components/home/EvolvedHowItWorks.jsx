import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';
import ContactDialog from '@/components/contact/ContactDialog';

const { colors, motion, typography, layout, radius } = tokens;

const FALLBACK_STEPS = [
  {
    number: '01',
    title: 'Elige',
    description: 'Coworking, salas de reunión u oficina virtual. Filtra por ciudad y disponibilidad.',
  },
  {
    number: '02',
    title: 'Reserva',
    description: 'Solicita tu reserva y recibe la confirmación e instrucciones de pago.',
  },
  {
    number: '03',
    title: 'Accede',
    description: 'Códigos de acceso por la app. Sin papeleo, sin esperas, sin permanencia.',
  },
];

const EvolvedHowItWorks = () => {
  const { t } = useTranslation();
  const stepsRaw = t('home.howItWorks.steps', { returnObjects: true });
  const STEPS = Array.isArray(stepsRaw) ? stepsRaw : FALLBACK_STEPS;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Box
      component="section"
      ref={ref}
      id="how-it-works"
      sx={{
        bgcolor: colors.bgSoft,
        py: { xs: 8, md: 11 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth,
          mx: 'auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
          transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              ...typography.eyebrow,
              color: colors.brand,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {t('home.howItWorks.eyebrow', 'Cómo funciona')}
          </Typography>
          <Box
            component="h2"
            sx={{
              ...typography.h3,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {t('home.howItWorks.heading', 'Tres pasos. Sin papeleo.')}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 6 },
          }}
        >
          {STEPS.map(({ number, title, description }) => (
            <Box key={number}>
              <Typography
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 600,
                  color: colors.brand,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                {number}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.375rem' },
                  fontWeight: 600,
                  color: colors.ink,
                  mb: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ ...typography.body, color: colors.ink2, lineHeight: 1.6 }}>
                {description}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Inline CTA — moved here from the hero so the section is the
            human-touch entry point after explaining the 3 steps. Opens
            the contact dialog inline (no page navigation). */}
        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
          <Button
            onClick={() => setContactOpen(true)}
            variant="contained"
            size="large"
            sx={{
              bgcolor: colors.brand,
              color: colors.bg,
              px: 3.5,
              py: 1.4,
              borderRadius: `${radius.pill}px`,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
            }}
          >
            {t('home.evolved.ctaPrimary', 'Solicitar información')}
          </Button>
        </Box>
      </Box>

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultSubject="Consulta general"
      />
    </Box>
  );
};

export default EvolvedHowItWorks;
