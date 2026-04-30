'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const SpaceCard = ({ space, onBookNow }) => {
  const { t } = useTranslation();
  const [imgIndex, setImgIndex] = useState(0);

  if (!space) return null;

  const images = space.gallery && space.gallery.length > 0
    ? space.gallery
    : space.image ? [space.image] : [];

  const handleClick = () => {
    if (typeof onBookNow === 'function') onBookNow(space);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isMeetingRoom = space.type === 'meeting_room';
  const deskLabel = space.availableCount ? ` (${space.availableCount} ${t('card.available')})` : '';
  const showArrows = images.length > 1;

  const arrowSx = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    bgcolor: 'rgba(255,255,255,0.92)',
    opacity: 0,
    width: 28,
    height: 28,
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
    transition: `opacity ${motion.duration} ${motion.ease}`,
    '&:hover': { bgcolor: '#fff' },
  };

  return (
    <Box sx={{ display: 'flex', minWidth: 0 }}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          maxWidth: '100%',
          bgcolor: colors.bg,
          border: `1px solid ${colors.line}`,
          borderRadius: `${radius.lg}px`,
          overflow: 'hidden',
          transition: `transform ${motion.duration} ${motion.ease}, box-shadow ${motion.duration} ${motion.ease}, border-color ${motion.duration} ${motion.ease}`,
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 18px 40px -22px rgba(0,0,0,0.22)',
            borderColor: colors.brand,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,
            height: 168,
            overflow: 'hidden',
            '&:hover .card-nav-arrow': { opacity: 1 },
          }}
        >
          {images.length > 0 && (
            <Box
              component="img"
              src={images[imgIndex]}
              alt={space.name}
              sx={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          )}

          {showArrows && (
            <IconButton
              className="card-nav-arrow"
              onClick={handlePrev}
              size="small"
              sx={{ ...arrowSx, left: 6 }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          {showArrows && (
            <IconButton
              className="card-nav-arrow"
              onClick={handleNext}
              size="small"
              sx={{ ...arrowSx, right: 6 }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          {showArrows && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '5px',
              }}
            >
              {images.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.55)',
                    transition: `background-color ${motion.duration} ${motion.ease}`,
                  }}
                />
              ))}
            </Box>
          )}

          {space.instantBooking && (
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 10, left: 10 }}>
              <Chip
                label={t('card.instantBooking')}
                size="small"
                sx={{
                  bgcolor: '#ffffff',
                  color: colors.ink,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  borderRadius: `${radius.pill}px`,
                  height: 24,
                  '& .MuiChip-label': { color: colors.ink, px: 1.25 },
                }}
              />
            </Stack>
          )}
        </Box>

        <Box
          sx={{
            p: 2.25,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minHeight: 0,
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ flex: '1 1 auto', minHeight: 0, width: '100%' }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: colors.ink,
                mb: 0.5,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {space.name}
            </Typography>

            <Typography
              sx={{
                ...typography.body,
                color: colors.ink2,
                mb: 1.25,
                minHeight: '2.6rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {space.subtitle || space.description}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                mb: 1.5,
                minHeight: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.4}>
                <PeopleAltRoundedIcon sx={{ fontSize: 15, color: colors.ink3 }} />
                <Typography sx={{ fontSize: '0.82rem', color: colors.ink2 }}>
                  {space.capacity}
                </Typography>
              </Stack>

              {space.sizeSqm != null && (
                <Stack direction="row" alignItems="center" spacing={0.4}>
                  <SquareFootRoundedIcon sx={{ fontSize: 15, color: colors.ink3 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: colors.ink2 }}>
                    {space.sizeSqm} m²
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" spacing={0.4}>
                <BusinessRoundedIcon sx={{ fontSize: 15, color: colors.ink3 }} />
                <Typography sx={{ fontSize: '0.82rem', color: colors.ink2, whiteSpace: 'nowrap' }}>
                  {space.typeLabel || (isMeetingRoom ? t('card.meetingRoom') : `${t('card.desk')}${deskLabel}`)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 'auto', gap: 1 }}
          >
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: colors.brand,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: '0 1 auto',
                minWidth: 0,
              }}
            >
              {t('card.from')} {space.price}{space.priceUnit}
            </Typography>

            <Button
              size="small"
              onClick={handleClick}
              disabled={!space.isBookable}
              disableElevation
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 2,
                py: 0.6,
                flexShrink: 0,
                transition: `background-color ${motion.duration} ${motion.ease}`,
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: colors.line, color: colors.ink3 },
              }}
            >
              {t('card.bookNow')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default SpaceCard;
