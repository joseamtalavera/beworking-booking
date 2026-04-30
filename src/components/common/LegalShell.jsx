import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

export const Section = ({ id, title, children }) => (
  <Box id={id} sx={{ mt: 6 }}>
    <Box
      component="h2"
      sx={{
        ...typography.h3,
        color: colors.ink,
        fontFamily: typography.fontFamily,
        fontFeatureSettings: typography.fontFeatureSettings,
        m: 0,
        mb: 2,
        fontSize: { xs: '1.25rem', md: '1.4rem' },
      }}
    >
      {title}
    </Box>
    {children}
  </Box>
);

export const P = ({ children, sx }) => (
  <Typography sx={{ ...typography.body, color: colors.ink2, lineHeight: 1.75, mb: 2, ...sx }}>
    {children}
  </Typography>
);

export const Field = ({ label, children }) => (
  <P>
    <Box component="strong" sx={{ color: colors.ink, fontWeight: 600 }}>{label}:</Box> {children}
  </P>
);

export const SubHeading = ({ children }) => (
  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 2.5, mb: 1, color: colors.ink }}>
    {children}
  </Typography>
);

export const LegalList = ({ children }) => (
  <Box
    component="ul"
    sx={{
      color: colors.ink2,
      lineHeight: 1.75,
      pl: 3,
      mb: 2,
      '& > li': { mb: 0.75, fontSize: typography.body.fontSize },
    }}
  >
    {children}
  </Box>
);

export default function LegalShell({ title, lastUpdated, intro, showEnDisclaimer, disclaimer, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
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
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        bgcolor: colors.bg,
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
          transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
        }}
      >
        <Typography
          sx={{
            ...typography.eyebrow,
            color: colors.brand,
            textTransform: 'uppercase',
            mb: 2,
          }}
        >
          BeWorking · Legal
        </Typography>
        <Box
          component="h1"
          sx={{
            ...typography.h2,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
            mb: 1,
          }}
        >
          {title}
        </Box>
        {lastUpdated && (
          <Typography sx={{ fontSize: '0.85rem', color: colors.ink3, mb: 4 }}>
            {lastUpdated}
          </Typography>
        )}
        {showEnDisclaimer && disclaimer && (
          <Box
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: `${radius.md}px`,
              bgcolor: colors.bgSoft,
              border: `1px solid ${colors.line}`,
            }}
          >
            <Typography sx={{ ...typography.body, color: colors.ink2, fontStyle: 'italic' }}>
              {disclaimer}
            </Typography>
          </Box>
        )}
        {intro && <P>{intro}</P>}
        {children}
      </Container>
    </Box>
  );
}
