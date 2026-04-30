import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, motion, typography } = tokens;

const CATEGORY_KEYS = ['general', 'spaces', 'platform', 'billing'];

const FaqItem = ({ q, a }) => (
  <Box
    component="details"
    sx={{
      borderTop: `1px solid ${colors.line}`,
      '&:last-of-type': { borderBottom: `1px solid ${colors.line}` },
      '&[open] .faq-icon': { transform: 'rotate(45deg)' },
    }}
  >
    <Box
      component="summary"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        listStyle: 'none',
        py: 2.25,
        '&::-webkit-details-marker': { display: 'none' },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '1rem', md: '1.0625rem' },
          fontWeight: 600,
          color: colors.ink,
          lineHeight: 1.4,
        }}
      >
        {q}
      </Typography>
      <Box
        className="faq-icon"
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.brandSoft,
          color: colors.brand,
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: 1,
          flexShrink: 0,
          transition: `transform ${motion.duration} ${motion.ease}`,
        }}
      >
        +
      </Box>
    </Box>
    <Box sx={{ pb: 2.5, pr: { md: 5 } }}>
      <Typography sx={{ ...typography.body, color: colors.ink2, lineHeight: 1.65 }}>
        {a}
      </Typography>
    </Box>
  </Box>
);

const EvolvedFaqTeaser = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

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

  const categoryKey = CATEGORY_KEYS[activeCategory];
  const items = t(`faq.categories.${categoryKey}.items`, { returnObjects: true });
  const validItems = Array.isArray(items) ? items : [];

  return (
    <Box
      component="section"
      ref={ref}
      id="faq"
      sx={{
        bgcolor: colors.bg,
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 5 },
        scrollMarginTop: 80,
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
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
            {t('faq.hero.label', 'FAQ')}
          </Typography>
          <Box
            component="h2"
            sx={{
              ...typography.h2,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {t('faq.hero.heading', 'Preguntas frecuentes.')}
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 2 }}>
            {t('faq.hero.subheading', 'Todo lo que necesitas saber sobre BeWorking.')}
          </Typography>
        </Box>

        {/* Category tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: { xs: 'flex-start', md: 'center' },
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            overflowX: { xs: 'auto', md: 'visible' },
            mb: { xs: 4, md: 5 },
            mx: { xs: -3, md: 0 },
            px: { xs: 3, md: 0 },
            pb: { xs: 1, md: 0 },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {CATEGORY_KEYS.map((key, i) => {
            const active = activeCategory === i;
            return (
              <Box
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCategory(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveCategory(i);
                }}
                sx={{
                  px: 2.25,
                  py: 0.85,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  bgcolor: active ? colors.brand : 'transparent',
                  color: active ? colors.bg : colors.ink2,
                  border: `1px solid ${active ? colors.brand : colors.line}`,
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  '&:hover': active ? {} : { borderColor: colors.brand, color: colors.brand },
                }}
              >
                {t(`faq.categories.${key}.label`)}
              </Box>
            );
          })}
        </Box>

        {/* Active category accordion */}
        <Box>
          {validItems.map((item, i) => (
            <FaqItem key={`${categoryKey}-${i}`} q={item.q} a={item.a} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EvolvedFaqTeaser;
