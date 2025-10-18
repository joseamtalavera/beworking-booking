import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';

const RoomMiniCard = ({ room }) => {
  const detailHref = `/rooms/${room.slug ?? room.id}`;

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 30px -20px rgba(15, 23, 42, 0.4)' }}>
      <CardActionArea component={RouterLink} to={detailHref} sx={{ textAlign: 'left' }}>
        <Box
          sx={{
            position: 'relative',
            pt: '56%',
            backgroundImage: `url(${room.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 600 }}>
              {room.centro}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {room.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Up to {room.capacity} people · from {room.priceFrom} {room.currency}/hr
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {room.tags?.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RoomMiniCard;
