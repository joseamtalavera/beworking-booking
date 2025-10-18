import { useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RoomMiniCard from '../components/cards/RoomMiniCard.jsx';
import MapPreview from '../components/map/MapPreview.jsx';
import { useCatalogRooms } from '../store/useCatalogRooms.js';

const HomePage = () => {
  const { rooms } = useCatalogRooms();
  const featuredRooms = useMemo(() => rooms.slice(0, 6), [rooms]);

  return (
    <Stack spacing={4} sx={{ pb: 6 }}>
      <Stack spacing={1}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Meeting rooms tailored to your team
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#475569' }}>
          Compare availability across BeWorking locations, filter by amenities, and secure the right space in minutes.
        </Typography>
      </Stack>

      <Grid container spacing={4} alignItems="flex-start">
        <Grid xs={12} lg={7}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.24)',
                p: 3,
                backgroundColor: '#ffffff'
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Where"
                  placeholder="Search for a city or location"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <LocationOnRoundedIcon sx={{ color: 'text.disabled', mr: 1 }} />
                    )
                  }}
                />
                <TextField
                  label="Check in"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <CalendarMonthRoundedIcon sx={{ color: 'text.disabled', mr: 1 }} />
                    )
                  }}
                />
                <TextField
                  label="Check out"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <CalendarMonthRoundedIcon sx={{ color: 'text.disabled', mr: 1 }} />
                    )
                  }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flexGrow: 1 }}>
                  <Chip
                    icon={<PeopleAltRoundedIcon />}
                    label="1 – 10 people"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<EuroRoundedIcon />}
                    label="Max 50 €/hour"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip label="TV screen" variant="outlined" sx={{ fontWeight: 600 }} />
                  <Chip label="Hybrid ready" variant="outlined" sx={{ fontWeight: 600 }} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton sx={{ border: '1px solid rgba(148, 163, 184, 0.32)' }}>
                    <SortRoundedIcon />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid rgba(148, 163, 184, 0.32)' }}>
                    <FilterAltRoundedIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<SearchRoundedIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3,
                      backgroundColor: '#2563eb',
                      '&:hover': { backgroundColor: '#1d4ed8' }
                    }}
                  >
                    Search spaces
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Divider />

            <Grid container spacing={2}>
              {featuredRooms.map((room) => (
                <Grid key={room.id} xs={12} md={6}>
                  <RoomMiniCard room={room} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>

        <Grid xs={12} lg={5}>
          <Box
            sx={{
              position: 'sticky',
              top: 112,
              height: { xs: 320, lg: 640 },
              borderRadius: 3,
              border: '1px solid rgba(148, 163, 184, 0.24)',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9'
            }}
          >
            <MapPreview rooms={rooms} />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default HomePage;
