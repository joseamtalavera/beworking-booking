import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography, layout } = tokens;

const TONE_BG = {
  brand: colors.brandSoft,
  soft: colors.bgSoft,
  white: colors.bg,
};

const StatusCard = ({ title, subtitle, rows }) => (
  <Box
    sx={{
      bgcolor: colors.bg,
      border: `1px solid ${colors.line}`,
      borderRadius: `${radius.lg}px`,
      boxShadow: shadow.frameLift,
      p: 2,
      width: { xs: 240, md: 280 },
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: colors.brandSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.brand }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.ink, lineHeight: 1.15 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: colors.ink3, lineHeight: 1.3 }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
    <Stack spacing={0.6} sx={{ borderTop: `1px solid ${colors.lineSoft}`, pt: 1 }}>
      {rows.map(({ label, value }) => (
        <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '0.75rem', color: colors.ink2 }}>{label}</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.ink }}>{value}</Typography>
        </Stack>
      ))}
    </Stack>
  </Box>
);

const PriceChip = ({ amount, period }) => (
  <Box
    sx={{
      bgcolor: colors.bg,
      border: `1px solid ${colors.line}`,
      borderRadius: `${radius.xl}px`,
      boxShadow: shadow.frameLift,
      px: 2.25,
      py: 1.25,
      display: 'flex',
      alignItems: 'baseline',
      gap: 0.75,
    }}
  >
    <Typography sx={{ fontSize: '1.85rem', fontWeight: 600, color: colors.brand, lineHeight: 1 }}>
      {amount}
    </Typography>
    <Typography sx={{ fontSize: '0.85rem', color: colors.ink2, fontWeight: 500 }}>
      {period}
    </Typography>
  </Box>
);

const PresencePill = ({ count, label }) => (
  <Box
    sx={{
      bgcolor: colors.bg,
      border: `1px solid ${colors.line}`,
      borderRadius: `${radius.pill}px`,
      boxShadow: shadow.frameLift,
      px: 1.75,
      py: 0.85,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.85,
    }}
  >
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: colors.brand,
        boxShadow: `0 0 0 4px ${colors.brandSoft}`,
      }}
    />
    <Typography sx={{ fontSize: '0.75rem', color: colors.ink, lineHeight: 1 }}>
      <Box component="span" sx={{ fontWeight: 700 }}>{count}</Box>
      <Box component="span" sx={{ color: colors.ink2, ml: 0.5 }}>{label}</Box>
    </Typography>
  </Box>
);

const BookingGridMock = () => {
  const headers = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const rooms = [
    { code: 'MA1A1', cells: [null, null, null, null, 'AS', 'AS', 'AS', 'AS'] },
    { code: 'MA1A2', cells: [null, null, null, 'AT', 'AT', 'AT', 'AT', null] },
    { code: 'MA1A3', cells: [null, null, null, null, null, 'FI', 'FI', 'FI'] },
    { code: 'MA1A4', cells: [null, null, null, null, null, null, 'A&', 'A&'] },
  ];
  return (
    <Box sx={{ p: 1.25 }}>
      <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 0.4 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.brand }} />
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: colors.ink, lineHeight: 1.1 }}>
          Reservas de Espacios
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: '0.55rem', color: colors.ink3, mb: 0.85 }}>
        Salas de reuniones · 29.04.2026
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `36px repeat(${headers.length}, 1fr)`,
          columnGap: '3px',
          rowGap: '3px',
        }}
      >
        <Box />
        {headers.map((h) => (
          <Typography
            key={h}
            sx={{
              fontSize: '0.42rem',
              fontWeight: 600,
              color: colors.ink3,
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            {h}
          </Typography>
        ))}
        {rooms.map(({ code, cells }) => (
          <Box key={code} sx={{ display: 'contents' }}>
            <Typography
              sx={{
                fontSize: '0.5rem',
                fontWeight: 700,
                color: colors.ink,
                alignSelf: 'center',
              }}
            >
              {code}
            </Typography>
            {cells.map((cell, i) => (
              <Box
                key={i}
                sx={{
                  height: 16,
                  borderRadius: '4px',
                  bgcolor: cell ? colors.brandSoft : 'transparent',
                  border: `1px solid ${cell ? colors.brand : colors.lineSoft}`,
                  fontSize: '0.42rem',
                  fontWeight: 700,
                  color: cell ? colors.brand : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cell || ''}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ScheduleCard = ({ title, priceLabel, days }) => (
  <Box
    sx={{
      bgcolor: colors.bg,
      border: `1px solid ${colors.line}`,
      borderRadius: `${radius.lg}px`,
      boxShadow: shadow.frameLift,
      p: 2,
      width: { xs: 240, md: 280 },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1.25 }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.ink }}>{title}</Typography>
      {priceLabel && (
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.brand }}>{priceLabel}</Typography>
      )}
    </Stack>
    <Stack direction="row" spacing={0.55} sx={{ borderTop: `1px solid ${colors.lineSoft}`, pt: 1.25 }}>
      {days.map(({ letter, active }, i) => (
        <Box
          key={i}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: active ? colors.brand : 'transparent',
            color: active ? colors.bg : colors.ink3,
            border: `1px solid ${active ? colors.brand : colors.line}`,
            flexShrink: 0,
          }}
        >
          {letter}
        </Box>
      ))}
    </Stack>
  </Box>
);

const EvolvedSectionShowcase = ({
  id,
  tone = 'brand',
  reverse = false,
  eyebrow,
  brand,
  brandNumber,
  headline,
  headlineAccent,
  subhead,
  body,
  cta,
  href,
  image,
  imageAlt,
  imageAspect = '4 / 3',
  imageFit = 'cover',
  statusCard,
  price,
  presence,
  schedule,
  imageOverlay,
  bookingGridMock = false,
  features = [],
}) => {
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copyBlock = (
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
            ...typography.h1,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
          }}
        >
          {brand ? (
            <>
              {brand}
              <Box component="span" sx={{ color: colors.brand, display: 'block' }}>{brandNumber}</Box>
            </>
          ) : (
            <>
              {headline}
              {headlineAccent && (
                <>
                  {' '}
                  <Box component="span" sx={{ color: colors.brand }}>{headlineAccent}</Box>
                </>
              )}
            </>
          )}
        </Box>
        {brand && headline && (
          <Typography sx={{ ...typography.bodyLg, color: colors.ink, fontWeight: 500, mt: 2.5 }}>
            {headline}
          </Typography>
        )}
        <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 2 }}>
          {subhead}
        </Typography>
        {body && (
          <Typography sx={{ ...typography.body, color: colors.ink2, mt: 2 }}>
            {body}
          </Typography>
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
  );

  const photoBlock = (
    <Box
      sx={{
        position: 'relative',
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
        }}
      >
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          loading="lazy"
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: imageFit }}
        />
      </Box>
      {statusCard && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: -22, left: -22 }}>
          <StatusCard {...statusCard} />
        </Box>
      )}
      {presence && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: -18, right: 24 }}>
          <PresencePill {...presence} />
        </Box>
      )}
      {schedule && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', bottom: -22, left: -22 }}>
          <ScheduleCard {...schedule} />
        </Box>
      )}
      {bookingGridMock && (
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            bottom: -24,
            left: -28,
            width: 280,
            bgcolor: colors.bg,
            border: `1px solid ${colors.line}`,
            borderRadius: `${radius.lg}px`,
            boxShadow: shadow.frameLift,
            overflow: 'hidden',
          }}
        >
          <BookingGridMock />
        </Box>
      )}
      {imageOverlay && !bookingGridMock && (
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            bottom: -28,
            left: -28,
            width: 360,
            aspectRatio: '4 / 3',
            bgcolor: colors.bg,
            border: `1px solid ${colors.line}`,
            borderRadius: `${radius.lg}px`,
            boxShadow: shadow.frameLift,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageOverlay.src}
            alt={imageOverlay.alt}
            loading="lazy"
            sx={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top left',
            }}
          />
        </Box>
      )}
      {price && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', bottom: -22, right: -22 }}>
          <PriceChip {...price} />
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="section"
      id={id}
      ref={ref}
      sx={{
        bgcolor: TONE_BG[tone] || TONE_BG.brand,
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: reverse ? '7fr 5fr' : '5fr 7fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
          }}
        >
          {reverse ? photoBlock : copyBlock}
          {reverse ? copyBlock : photoBlock}
        </Box>

        {features.length > 0 && (
          <Box
            sx={{
              mt: { xs: 7, md: 10 },
              pt: { xs: 4, md: 5 },
              borderTop: `1px solid ${colors.line}`,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${features.length}, 1fr)` },
              gap: { xs: 4, md: 5 },
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
              transition: `opacity ${motion.durationSlow} ${motion.ease} 0.2s, transform ${motion.durationSlow} ${motion.ease} 0.2s`,
            }}
          >
            {features.map(({ title, description }, i) => (
              <Box key={title}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: colors.ink3,
                    letterSpacing: '0.12em',
                    mb: 1.5,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: colors.ink,
                    mb: 0.75,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.ink2, lineHeight: 1.55 }}>
                  {description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EvolvedSectionShowcase;
