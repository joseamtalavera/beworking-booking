import { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { 
  Button, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Tabs, 
  Tab, 
  Box,
  InputAdornment,
  Autocomplete
} from '@mui/material';

// Colors are now defined in theme.js - use theme palette: primary.main/dark for green
import Grid from '@mui/material/Grid';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { useCatalogRooms } from '../store/useCatalogRooms.js';
import { fetchBookingCentros, fetchBookingProductos } from '../api/bookings.js';
import SpaceCard from '../components/home/SpaceCard.jsx';

const HomePage = () => {
  const { rooms } = useCatalogRooms();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [location, setLocation] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cityOptions, setCityOptions] = useState([{ id: 'all', label: 'All locations', isAllOption: true }]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [people, setPeople] = useState('');
  const [price, setPrice] = useState('');
  const [centros, setCentros] = useState([]);
  const [centrosLoading, setCentrosLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosLoading, setProductosLoading] = useState(false);


// Load centros and cities
  useEffect(() => {
    let active = true;
    setCentrosLoading(true);
    
    const loadCentros = async () => {
      try {
        const data = await fetchBookingCentros();
        
        if (!active) return;

        const options = Array.isArray(data) ? data.map((c) => {
          const code = (c.codigo ?? c.code ?? '').toUpperCase();
          const city = (c.localidad ?? c.city ?? '').trim();

          return {
            ...c, 
            id: c.id ?? c.codigo ?? c.code ?? c.nombre ?? c.name ?? code, 
            label: c.nombre ?? c.name ?? '',
            code,
            city
          };
        }) : [];
        
        const centrosWithAll = [{ id: 'all', label: 'All Centros', isAllOption: true }, ...options];
        setCentros(centrosWithAll);

        const uniqueCities = Array.from(new Set(options
          .map(option => option.city)
          .filter(city => typeof city === 'string' && city.trim() !== '')
          .map(city => city.trim())));
        const cityList = [
          { id: 'all', label: 'All locations', isAllOption: true },
          ...uniqueCities.map(city => ({ id: city.toLowerCase(), label: city }))
        ];
        setCityOptions(cityList);
      } catch (error) {
        if (active) {
          setCentros([]);
          setCityOptions([{ id: 'all', label: 'All locations', isAllOption: true }]);
        }
      } finally {
        if (active) {
          setCentrosLoading(false);
        }
      }
    };
    loadCentros();
    
    return () => {
      active = false;
    };
  },[]);

  // Load productos
  useEffect(() => {
    let active = true;
    setProductosLoading(true);

    const loadProductos = async () => {
      try {

        // Build params: always filter by MA1 centro, filter by tipo based on activeTab
        const params = { centerCode: 'MA1' };
        if(activeTab === 1) {
          // Meeting Rooms tab -> Aulas
          params.type = 'Aula';
        } else if(activeTab === 2) {
          // Desks tab -> Mesas
          params.type = 'Mesa';
        }
        // activeTab === 0 -> All Spaces (no tipo filter, gets both Aula and Mesa)
        
        const data = await fetchBookingProductos(params);

        if (!active) return;
        setProductos(Array.isArray(data) ? data : []);

      } catch (error) {
        if (active) {
          setProductos([]);
        }
      } finally {
        if (active) {
          setProductosLoading(false);
        }
      }
    };
    
    loadProductos();
    
    return () => {
      active = false;
    };
  }, [activeTab]);

  // Standard field styles for all search inputs - uniform size
  const standardFieldStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      backgroundColor: '#f8fafc',
      height: '40px',
      '& fieldset': {
        borderColor: '#e2e8f0'
      },
      '& input': {
        fontSize: '0.9375rem !important',
        fontWeight: 500,
        color: '#1e293b !important',
        padding: '8.5px 14px !important',
        height: '100%'
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    '& .MuiAutocomplete-input': {
      padding: '8.5px 14px !important'
    }
  };

  const spaceTypes = [
    { value: 'all', label: 'All Spaces', icon: <BusinessRoundedIcon /> },
    { value: 'meeting_room', label: 'Meeting Rooms', icon: <MeetingRoomRoundedIcon /> },
    { value: 'desk', label: 'Desks', icon: <DeskRoundedIcon /> }
  ];

  const filteredSpaces = useMemo(() => {
    if (!productos || !Array.isArray(productos)) {
      return [];
    }

    const filteredProductos = productos.filter((producto) => {
      const type = (producto.type ?? producto.tipo ?? '').trim().toLowerCase();
      const name = (producto.name ?? producto.nombre ?? '').trim();
      const centerCode = (producto.centerCode ?? producto.centroCodigo ?? '').trim().toUpperCase();

      if (!name || centerCode !== 'MA1') {
        return false;
      }

      const upperName = name.toUpperCase();

      if (type === 'aula') {
        return upperName.startsWith('MA1A');
      }

      if (type === 'mesa') {
        const deskMatch = upperName.match(/^MA1[-_]?O1[-_ ]?(\d{1,2})$/);
        if (!deskMatch) {
          return false;
        }

        const numero = parseInt(deskMatch[1], 10);
        return numero >= 1 && numero <= 16;
      }

      return false;
    });
    
    const aulas = filteredProductos.filter((producto) => {
      const typeLower = (producto.type ?? producto.tipo ?? '').trim().toLowerCase();
      return typeLower === 'aula';
    });

    const mesas = filteredProductos.filter((producto) => {
      const typeLower = (producto.type ?? producto.tipo ?? '').trim().toLowerCase();
      return typeLower === 'mesa';
    });

    const aulaSpaces = aulas.map((producto) => {
      const rawType = (producto.type ?? producto.tipo ?? '').trim();
      const name = (producto.name ?? producto.nombre ?? '').trim();
      const productCenter = (producto.centerCode ?? producto.centroCodigo ?? '').trim();
      const productCenterUpper = productCenter.toUpperCase();
      const matchingCentro = centros.find(
        (c) => (c.code ?? '').toUpperCase() === productCenterUpper
      );
      const centerName = matchingCentro?.label ?? productCenter;
      const city = matchingCentro?.city ?? '';
      const matchingRoom = rooms.find((room) => (room.productName ?? '').toLowerCase() === name.toLowerCase());
      const roomSlug =
        matchingRoom?.slug ??
        ((matchingRoom?.id ? matchingRoom.id.toString().toLowerCase() : '') || name.toLowerCase());

      return {
        id: producto.id,
        name,
        productName: name,
        slug: roomSlug,
        type: 'meeting_room',
        typeLabel: rawType || 'Meeting room',
        image: producto.heroImage || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        capacity: producto.capacity != null ? String(producto.capacity) : '—',
        rating: producto.ratingAverage != null ? Number(producto.ratingAverage) : 4.8,
        reviewCount: producto.ratingCount != null ? producto.ratingCount : 0,
        priceFrom: producto.priceFrom,
        price: producto.priceFrom != null ? `€ ${producto.priceFrom}` : '€ —',
        priceUnit: producto.priceUnit || '/h',
        description: producto.description || producto.subtitle || `${rawType} - ${name}`,
        subtitle: producto.subtitle || '',
        gallery: Array.isArray(producto.images) ? producto.images : [],
        amenities: Array.isArray(producto.amenities) ? producto.amenities : [],
        tags: Array.isArray(producto.tags) ? producto.tags : [],
        location: city || centerName || 'Málaga',
        instantBooking: producto.instantBooking !== false,
        centroCode: productCenter || undefined,
        centerName: centerName || undefined,
        isBookable: Boolean(matchingRoom)
      };
    });

    const deskCard = (() => {
      if (mesas.length === 0) {
        return null;
      }

      const sample = mesas[0];
      const rawType = (sample.type ?? sample.tipo ?? '').trim();
      const productCenter = (sample.centerCode ?? sample.centroCodigo ?? '').trim();
      const productCenterUpper = productCenter.toUpperCase();
      const matchingCentro = centros.find(
        (c) => (c.code ?? '').toUpperCase() === productCenterUpper
      );
      const centerName = matchingCentro?.label ?? productCenter;
      const city = matchingCentro?.city ?? '';
      const deskCount = mesas.length;
      const matchingRoom = rooms.find((room) => (room.slug ?? '').toLowerCase() === 'ma1-desks');
      const roomSlug =
        matchingRoom?.slug ??
        ((matchingRoom?.id ? String(matchingRoom.id).toLowerCase() : '') || 'ma1-desks');

      return {
        id: `desks-${productCenterUpper || 'ma1'}`,
        name: centerName ? `${centerName} Desks` : 'MA1 Desks',
        description: `${deskCount} desk${deskCount === 1 ? '' : 's'} available for booking`,
        productName: 'MA1 Desks',
        slug: roomSlug,
        type: 'desk',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
        capacity: '1',
        rating: 4.8,
        reviewCount: 0,
        price: '€ 15',
        priceUnit: '/day',
        location: city || centerName || 'Málaga',
        tags: [],
        instantBooking: true,
        centroCode: productCenter || undefined,
        availableCount: deskCount,
        centerName: centerName || undefined,
        isBookable: Boolean(matchingRoom)
      };
    })();

    const mappedSpaces = deskCard ? [...aulaSpaces, deskCard] : aulaSpaces;
    
    let filtered = [...mappedSpaces];
    
    // Filter by city/location if specified
    if (cityFilter && cityFilter.trim() !== '') {
      const cityFilterLower = cityFilter.trim().toLowerCase();
      filtered = filtered.filter(space => (space.location ?? '').toLowerCase() === cityFilterLower);
    }
    
    // Filter by number of users
    if (people && people.trim() !== '') {
      const userCount = parseInt(people);
      if (!isNaN(userCount)) {
        filtered = filtered.filter(space => {
          if (!space.capacity) return false;
          const capacityParts = space.capacity.split('-');
          if (capacityParts.length === 1) {
            const singleCapacity = parseInt(capacityParts[0]);
            return !isNaN(singleCapacity) && userCount <= singleCapacity;
          } else {
            const [minCapacity, maxCapacity] = capacityParts.map(num => parseInt(num));
            return !isNaN(minCapacity) && !isNaN(maxCapacity) && 
                   userCount >= minCapacity && userCount <= maxCapacity;
          }
        });
      }
    }
    
    return filtered;
  }, [productos, centros, cityFilter, people, rooms]);

  const resolveRoomSlug = useCallback(
    (space) => {
      if (!space) {
        return '';
      }

      const matchingRoom = rooms.find((room) => {
        const roomProduct = (room.productName ?? '').toLowerCase();
        const roomSlug = (room.slug ?? '').toLowerCase();
        const targetProduct = (space.productName ?? space.name ?? '').toLowerCase();
        const targetSlug = (space.slug ?? '').toLowerCase();
        return (targetProduct && roomProduct === targetProduct) || (targetSlug && roomSlug === targetSlug);
      });

      const fallbackId = matchingRoom?.id ? String(matchingRoom.id).toLowerCase() : '';
      const targetSlug = (space.slug ?? '').toLowerCase() || (matchingRoom?.slug ?? '').toLowerCase() || fallbackId;
      return targetSlug;
    },
    [rooms]
  );

  const handleBookNow = useCallback(
    (space) => {
      const targetSlug = resolveRoomSlug(space);
      if (!targetSlug) {
        return;
      }

      navigate(`/rooms/${targetSlug}`, {
        state: {
          space,
          backgroundLocation: {
            pathname: routerLocation.pathname,
            search: routerLocation.search,
            hash: routerLocation.hash
          }
        }
      });
    },
    [navigate, resolveRoomSlug, routerLocation.hash, routerLocation.pathname, routerLocation.search]
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 4 }}>
        {/* Page Title */}
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
          Meeting rooms and desks in your city
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
                backgroundColor: 'white',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
          {/* Search Fields - Agenda Style */}
          <Grid container spacing={1.5} sx={{ mb: 2, display: 'flex' }}>
            <Grid item xs={12} sm={6} md sx={{ flex: '1 1 0%', minWidth: 0 }}>
              <Autocomplete
                size="small"
                options={cityOptions}
                getOptionLabel={(option) => option?.label ?? ''}
                value={
                  cityFilter === ''
                    ? (cityOptions.find(option => option.id === 'all') || null)
                    : (cityOptions.find(option => option.label?.toLowerCase() === cityFilter.toLowerCase()) || null)
                }
                onChange={(_, value) => setCityFilter(value && value.id !== 'all' ? value.label : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Location"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={standardFieldStyles}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                    {option.label}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md sx={{ flex: '1 1 0%', minWidth: 0 }}>
              <Autocomplete
                size="small"
                options={centros}
                loading={centrosLoading}
                getOptionLabel={(option) => option?.label ?? ''}
                value={
                  location === '' 
                    ? (centros.find(c => c.id === 'all') || null)
                    : (centros.find((c) => c.id !== 'all' && c.label?.toLowerCase() === (location || '').toLowerCase()) || null)
                }
                onChange={(_, value) => setLocation(value && value.id !== 'all' ? value.label : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Centro"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={standardFieldStyles}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                    {option.label}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md sx={{ flex: '1 1 0%', minWidth: 0 }}>
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
                sx={standardFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md sx={{ flex: '1 1 0%', minWidth: 0 }}>
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
                sx={standardFieldStyles}
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
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                SEARCH SPACES
              </Button>
            </Grid>
          </Grid>

          {/* Results Count */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Showing {filteredSpaces.length} {filteredSpaces.length === 1 ? 'space' : 'spaces'}
            </Typography>
          </Stack>
            </Paper>

        {/* Space Listings */}
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: (theme) => theme.spacing(3),
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))'
            },
            alignItems: 'stretch'
          }}
        >
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default HomePage;
