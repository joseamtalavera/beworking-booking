'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

const SpaceCard = ({ space, onBookNow }) => {
  const { t } = useTranslation();
  const [imgIndex, setImgIndex] = useState(0);

  if (!space) {
    return null;
  }

  const images = space.gallery && space.gallery.length > 0
    ? space.gallery
    : space.image ? [space.image] : [];

  const handleClick = () => {
    if (typeof onBookNow === 'function') {
      onBookNow(space);
    }
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

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: 0
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: (theme) => `0 4px 6px -1px ${alpha(theme.palette.common.black, 0.1)}`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          maxWidth: '100%',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => `0 10px 25px -3px ${alpha(theme.palette.common.black, 0.1)}`
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,
            height: '160px',
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

          {/* Left arrow */}
          {showArrows && (
            <IconButton
              className="card-nav-arrow"
              onClick={handlePrev}
              size="small"
              sx={{
                position: 'absolute',
                left: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
                opacity: 0,
                transition: 'opacity 0.2s',
                width: 28,
                height: 28,
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#fff' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          {/* Right arrow */}
          {showArrows && (
            <IconButton
              className="card-nav-arrow"
              onClick={handleNext}
              size="small"
              sx={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
                opacity: 0,
                transition: 'opacity 0.2s',
                width: 28,
                height: 28,
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#fff' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          {/* Dot indicators */}
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
                    bgcolor: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'background-color 0.2s',
                  }}
                />
              ))}
            </Box>
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              top: 10,
              left: 10
            }}
          >
            {space.instantBooking && (
              <Chip
                label={t('card.instantBooking')}
                size="small"
                sx={{
                  backgroundColor: '#fff',
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Stack>

        </Box>

        <CardContent
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minHeight: 0,
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ flex: '1 1 auto', minHeight: 0, width: '100%', maxWidth: '100%' }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mb: 0.75,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {space.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.25,
                minHeight: '2rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                width: '100%'
              }}
            >
              {space.subtitle || space.description}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                mb: 1.25,
                minHeight: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <PeopleAltRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {space.capacity}
                </Typography>
              </Stack>

              {space.sizeSqm != null && (
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <SquareFootRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {space.sizeSqm} m²
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <BusinessRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {space.typeLabel || (isMeetingRoom ? t('card.meetingRoom') : `${t('card.desk')}${deskLabel}`)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mt: 'auto',
              width: '100%',
              gap: 1
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="primary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: '0 1 auto',
                minWidth: 0
              }}
            >
              {t('card.from')} {space.price}
              {space.priceUnit}
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleClick}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: 'primary.main',
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              disabled={!space.isBookable}
            >
              {t('card.bookNow')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpaceCard;
