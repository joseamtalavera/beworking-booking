import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

const SpaceCard = ({ space, onBookNow }) => {
  if (!space) {
    return null;
  }

  const handleClick = () => {
    if (typeof onBookNow === 'function') {
      onBookNow(space);
    }
  };

  const isMeetingRoom = space.type === 'meeting_room';
  const deskLabel = space.availableCount ? ` (${space.availableCount} available)` : '';

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
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          maxWidth: '100%',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box sx={{ position: 'relative', flexShrink: 0, height: '160px', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={space.image}
            alt={space.name}
            sx={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />

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
                label="Instant booking"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Stack>

          <IconButton
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <FavoriteBorderRoundedIcon />
          </IconButton>
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
              {space.description}
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

              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <StarRoundedIcon sx={{ fontSize: 15, color: '#fbbf24' }} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {space.rating} ({space.reviewCount})
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <BusinessRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {isMeetingRoom ? 'Meeting room' : `Desk${deskLabel}`}
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
              From {space.price}
              {space.priceUnit}
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleClick}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#fb923c',
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: '#ea580c'
                }
              }}
              disabled={!space.isBookable}
            >
              Book now
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpaceCard;
