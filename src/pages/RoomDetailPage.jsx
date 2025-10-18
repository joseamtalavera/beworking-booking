import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { useCatalogRooms } from '../store/useCatalogRooms.js';

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const { rooms } = useCatalogRooms();
  const room = useMemo(() => rooms.find((entry) => entry.slug === roomId || entry.id === roomId), [rooms, roomId]);

  if (!room) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Room not found</Typography>
        <Button component={Link} to="/" variant="contained">
          Back to discovery
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          minHeight: 320,
          backgroundImage: `linear-gradient(0deg, rgba(15,23,42,0.45), rgba(15,23,42,0.45)), url(${room.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
          p: 4
        }}
      >
        <Stack spacing={1}>
          <Chip label={room.centro} sx={{ bgcolor: 'rgba(226,232,240,0.25)', color: '#f8fafc', width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {room.name}
          </Typography>
          <Typography variant="body1">Capacity {room.capacity} · from {room.priceFrom} {room.currency}/hr</Typography>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <section>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Overview
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569' }}>
                This is a placeholder description. Integrate with the CMS/backend to fetch rich content,
                amenities, and availability. Highlight unique selling points and embed virtual tours as needed.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Amenities
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {room.tags?.map((tag) => (
                  <Chip key={tag} label={tag} sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }} />
                ))}
              </Stack>
            </section>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: 3, bgcolor: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Ready to book?
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Choose your preferred date and time, login or checkout as a visitor, and secure the space with a
              fast Stripe payment flow.
            </Typography>
            <Divider />
            <Button component={Link} to={`/rooms/${room.slug ?? room.id}/book`} variant="contained" size="large">
              Start booking
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default RoomDetailPage;
