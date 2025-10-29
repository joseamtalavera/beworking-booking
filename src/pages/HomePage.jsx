import { useMemo, useState } from 'react';
import { 
  Button, 
  Chip, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Tabs, 
  Tab, 
  Box,
  Card,
  CardMedia,
  CardContent,
  Rating,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import RoomMiniCard from '../components/cards/RoomMiniCard.jsx';
import { useCatalogRooms } from '../store/useCatalogRooms.js';

// Mock data for demonstration
const mockSpaces = [
  {
    id: 1,
    name: "Edge5",
    description: "Sitzungszimmer",
    type: "meeting_room",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    capacity: "1-10",
    rating: 4.9,
    reviewCount: 136,
    price: "CHF 25",
    priceUnit: "/h",
    location: "Zurich",
    tags: ["Hero Space"],
    instantBooking: true
  },
  {
    id: 2,
    name: "M40 Workspace",
    description: "Modern meeting room in loft style",
    type: "meeting_room",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    capacity: "1-15",
    rating: 4.8,
    reviewCount: 89,
    price: "€ 8",
    priceUnit: "/h",
    location: "Berlin",
    tags: [],
    instantBooking: true
  },
  {
    id: 3,
    name: "Desk Space A1",
    description: "Individual desk in quiet area",
    type: "desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    capacity: "1",
    rating: 4.7,
    reviewCount: 45,
    price: "€ 15",
    priceUnit: "/day",
    location: "Madrid",
    tags: ["Quiet Zone"],
    instantBooking: true
  },
  {
    id: 4,
    name: "Flex Desk",
    description: "Flexible workspace desk",
    type: "desk",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    capacity: "1",
    rating: 4.6,
    reviewCount: 78,
    price: "€ 12",
    priceUnit: "/day",
    location: "Málaga",
    tags: ["Flexible"],
    instantBooking: true
  },
  {
    id: 5,
    name: "Executive Desk",
    description: "Premium individual workspace with privacy",
    type: "desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    capacity: "1",
    rating: 4.8,
    reviewCount: 92,
    price: "€ 20",
    priceUnit: "/day",
    location: "Madrid",
    tags: ["Premium", "Private"],
    instantBooking: true
  },
  {
    id: 6,
    name: "Boardroom Elite",
    description: "Executive meeting room for important discussions",
    type: "meeting_room",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
    capacity: "8-12",
    rating: 4.9,
    reviewCount: 156,
    price: "€ 40",
    priceUnit: "/h",
    location: "Barcelona",
    tags: ["Executive", "Premium"],
    instantBooking: false
  }
];

const HomePage = () => {
  const { rooms } = useCatalogRooms();
  const [activeTab, setActiveTab] = useState(0);
  const [location, setLocation] = useState('');
  const [userType, setUserType] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [people, setPeople] = useState('');
  const [price, setPrice] = useState('');
  const [peopleAnchor, setPeopleAnchor] = useState(null);
  const [priceAnchor, setPriceAnchor] = useState(null);

  const spaceTypes = [
    { value: 'all', label: 'All Spaces', icon: <BusinessRoundedIcon /> },
    { value: 'meeting_room', label: 'Meeting Rooms', icon: <MeetingRoomRoundedIcon /> },
    { value: 'desk', label: 'Desks', icon: <DeskRoundedIcon /> }
  ];

  const filteredSpaces = useMemo(() => {
    let filtered = mockSpaces;
    
    // Filter by space type (tabs)
    if (activeTab > 0) {
      const selectedType = spaceTypes[activeTab].value;
      if (selectedType !== 'all') {
        filtered = filtered.filter(space => space.type === selectedType);
      }
    }
    
    // Filter by centro (location)
    if (location) {
      filtered = filtered.filter(space => space.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    // Filter by user type (meeting_room or desk)
    if (userType) {
      filtered = filtered.filter(space => space.type === userType);
    }
    
    // Filter by number of users
    if (people) {
      const userCount = parseInt(people);
      filtered = filtered.filter(space => {
        const [minCapacity, maxCapacity] = space.capacity.split('-').map(num => parseInt(num));
        return userCount >= minCapacity && userCount <= maxCapacity;
      });
    }
    
    return filtered;
  }, [activeTab, location, userType, people]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterClick = (event, setAnchor) => {
    setAnchor(event.currentTarget);
  };

  const handleFilterClose = (setAnchor) => {
    setAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        px: 3,
        py: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={700} color="primary">
            beworking
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              Book a space
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              Business
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              List your venue
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              Sign up
            </Button>
            <Button variant="contained" sx={{ textTransform: 'none' }}>
              Login
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 4 }}>
        {/* Page Title */}
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
          Meeting rooms and desks - {filteredSpaces.length}+ unique locations
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#475569', mb: 4 }}>
          Find the perfect workspace for your needs. Choose between meeting rooms for team collaboration or individual desks for focused work.
        </Typography>

        {/* Space Type Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 48
            }
          }}
        >
          {spaceTypes.map((type, index) => (
            <Tab 
              key={type.value}
              icon={type.icon} 
              label={type.label}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {/* Search and Filter Section */}
            <Paper
              elevation={0}
              sx={{
            p: 3, 
            mb: 4, 
                borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}
        >
          {/* Search Fields - Agenda Style */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Centro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="All centros"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f8fafc',
                    '& fieldset': {
                      borderColor: '#e2e8f0'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="User Type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                placeholder="All user types"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleAltRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f8fafc',
                    '& fieldset': {
                      borderColor: '#e2e8f0'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Number of Users"
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="Number of Users"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PeopleAltRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f8fafc',
                    '& fieldset': {
                      borderColor: '#e2e8f0'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Check in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f8fafc',
                    '& fieldset': {
                      borderColor: '#e2e8f0'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                sx={{
                  height: 40,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  backgroundColor: '#fb923c',
                  '&:hover': {
                    backgroundColor: '#ea580c'
                  }
                }}
              >
                SEARCH SPACES
              </Button>
            </Grid>
          </Grid>

          {/* Additional Filter Buttons - Agenda Style */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PeopleAltRoundedIcon />}
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: 'text.secondary',
                backgroundColor: '#f8fafc',
                minWidth: 'auto',
                px: 2,
                py: 1,
                '&:hover': {
                  borderColor: '#fb923c',
                  color: '#fb923c',
                  backgroundColor: '#fff'
                }
              }}
            >
              People
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EuroRoundedIcon />}
              onClick={(e) => handleFilterClick(e, setPriceAnchor)}
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: 'text.secondary',
                backgroundColor: '#f8fafc',
                minWidth: 'auto',
                px: 2,
                py: 1,
                '&:hover': {
                  borderColor: '#fb923c',
                  color: '#fb923c',
                  backgroundColor: '#fff'
                }
              }}
            >
              € Price
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Showing {filteredSpaces.length} of {mockSpaces.length} spaces
            </Typography>
          </Stack>
            </Paper>

        {/* Space Listings */}
        <Grid container spacing={3}>
          {filteredSpaces.map((space) => (
            <Grid item xs={12} sm={6} md={4} key={space.id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                {/* Image */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={space.image}
                    alt={space.name}
                  />
                  
                  {/* Tags */}
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      left: 12 
                    }}
                  >
                    {space.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
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

                  {/* Favorite Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    <FavoriteBorderRoundedIcon />
                  </IconButton>
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {space.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {space.description}
                  </Typography>

                  {/* Details */}
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PeopleAltRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {space.capacity}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarRoundedIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                      <Typography variant="body2" color="text.secondary">
                        {space.rating} ({space.reviewCount})
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <BusinessRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {space.type === 'meeting_room' ? 'Meeting room' : 'Desk'}
                      </Typography>
                </Stack>
              </Stack>

                  {/* Price */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600} color="primary">
                      From {space.price}{space.priceUnit}
                    </Typography>
                <Button
                  variant="contained"
                      size="small"
                  sx={{
                    textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: '#fb923c',
                        '&:hover': {
                          backgroundColor: '#ea580c'
                        }
                      }}
                    >
                      Book now
                </Button>
              </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filter Menus */}
        <Menu
          anchorEl={peopleAnchor}
          open={Boolean(peopleAnchor)}
          onClose={() => handleFilterClose(setPeopleAnchor)}
        >
          <MenuItem onClick={() => { setPeople('1-5'); handleFilterClose(setPeopleAnchor); }}>
            1-5 people
          </MenuItem>
          <MenuItem onClick={() => { setPeople('6-10'); handleFilterClose(setPeopleAnchor); }}>
            6-10 people
          </MenuItem>
          <MenuItem onClick={() => { setPeople('11-20'); handleFilterClose(setPeopleAnchor); }}>
            11-20 people
          </MenuItem>
          <MenuItem onClick={() => { setPeople('20+'); handleFilterClose(setPeopleAnchor); }}>
            20+ people
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={priceAnchor}
          open={Boolean(priceAnchor)}
          onClose={() => handleFilterClose(setPriceAnchor)}
        >
          <MenuItem onClick={() => { setPrice('€0-25'); handleFilterClose(setPriceAnchor); }}>
            €0 - €25
          </MenuItem>
          <MenuItem onClick={() => { setPrice('€25-50'); handleFilterClose(setPriceAnchor); }}>
            €25 - €50
          </MenuItem>
          <MenuItem onClick={() => { setPrice('€50-100'); handleFilterClose(setPriceAnchor); }}>
            €50 - €100
          </MenuItem>
          <MenuItem onClick={() => { setPrice('€100+'); handleFilterClose(setPriceAnchor); }}>
            €100+
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default HomePage;
