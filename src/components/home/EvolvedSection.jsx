import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const EvolvedSection = ({
  id,
  index = 0,
  eyebrow,
  brand,
  brandNumber,
  headline,
  headlineAccent,
  subhead,
  body,
  highlights = [],
  cta,
  href,
  image,
  imageAlt,
  imageFit = 'cover',
  imageAspect = '4 / 3',
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reverse = index % 2 === 1;
  const bg = reverse ? colors.bgSoft : colors.bg;

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
      id={id}
      ref={ref}
      sx={{
        bgcolor: bg,
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: { xs: 5, md: 8 },
          alignItems: 'center',
          direction: { md: reverse ? 'rtl' : 'ltr' },
          '& > *': { direction: 'ltr' },
        }}
      >
        {/* Copy */}
        <Box
          sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Box sx={{ maxWidth: 540 }}>
            <Typography
              sx={{
                ...typography.eyebrow,
                color: colors.brand,
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {eyebrow}
            </Typography>

            <Box
              component="h2"
              sx={{
                ...typography.h2,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
              }}
            >
              {brand ? (
                <>
                  <Box component="span">{brand}</Box>
                  <Box component="span" sx={{ color: colors.brand, ml: '0.04em' }}>
                    {brandNumber}
                  </Box>
                </>
              ) : (
                <>
                  <Box component="span">{headline}</Box>
                  {headlineAccent && (
                    <Box component="span" sx={{ color: colors.brand, ml: '0.35em' }}>
                      {headlineAccent}
                    </Box>
                  )}
                </>
              )}
            </Box>

            {brand && headline && (
              <Typography
                sx={{
                  ...typography.bodyLg,
                  color: colors.ink,
                  fontWeight: 500,
                  mt: 2,
                }}
              >
                {headline}
              </Typography>
            )}

            <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 2.5 }}>
              {subhead}
            </Typography>

            {body && (
              <Typography sx={{ ...typography.body, color: colors.ink2, mt: 2 }}>
                {body}
              </Typography>
            )}

            {highlights.length > 0 && (
              <Stack spacing={1.25} sx={{ mt: 3.5 }}>
                {highlights.map((h) => (
                  <Box
                    key={h}
                    sx={{
                      pl: 2,
                      borderLeft: `2px solid ${colors.brand}`,
                      fontSize: '0.95rem',
                      lineHeight: 1.55,
                      color: colors.ink,
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                component={NextLink}
                href={href}
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
                {cta}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Image frame */}
        <Box
          sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset + 8}px)`,
            transition: `opacity 1s ${motion.ease} 0.1s, transform 1s ${motion.ease} 0.1s`,
          }}
        >
          <Box
            sx={{
              width: '100%',
              aspectRatio: imageAspect,
              bgcolor: colors.bg,
              border: `1px solid ${colors.line}`,
              borderRadius: `${radius.xl}px`,
              boxShadow: shadow.frame,
              overflow: 'hidden',
              transition: `transform ${motion.duration} ${motion.ease}, box-shadow ${motion.duration} ${motion.ease}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadow.frameLift,
              },
            }}
          >
            <Box
              component="img"
              src={image}
              alt={imageAlt}
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: imageFit,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EvolvedSection;
