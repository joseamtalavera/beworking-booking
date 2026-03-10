'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Tabs,
  Tab,
  Box,
  Autocomplete
} from '@mui/material';

import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import VirtualOfficeSection from '@/components/home/VirtualOfficeSection';
import { useTranslation } from 'react-i18next';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3020';

const HomePage = () => {
  const { t } = useTranslation();
  const { rooms, setRooms } = useCatalogRooms();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [cityFilter, setCityFilter] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [people, setPeople] = useState('');
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

        setCentros(options);

        const uniqueCities = Array.from(new Set(options
          .map(option => option.city)
          .filter(city => typeof city === 'string' && city.trim() !== '')
          .map(city => city.trim())));
        setCityOptions(uniqueCities.map(city => ({ id: city.toLowerCase(), label: city })));
      } catch (error) {
        if (active) {
          setCentros([]);
          setCityOptions([]);
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

  // Populate the catalog store with room objects built from API data (one-time).
  // This feeds the detail page and booking page with real data from the dashboard.
  useEffect(() => {
    let active = true;

    const populateStore = async () => {
      try {
        const allProductos = await fetchBookingProductos({ centerCode: 'MA1' });
        if (!active || !Array.isArray(allProductos)) return;

        const centroLabel = centros.find((c) => (c.code ?? '').toUpperCase() === 'MA1')?.label ?? 'Málaga Workspace';

        const aulas = allProductos.filter((p) => {
          const type = (p.type ?? p.tipo ?? '').trim().toLowerCase();
          const name = (p.name ?? p.nombre ?? '').trim().toUpperCase();
          return type === 'aula' && name.startsWith('MA1A');
        });

        const mesas = allProductos.filter(isDeskProducto);

        const aulaRooms = aulas.map((p) => buildRoomFromProducto(p, centroLabel));

        // Build desk room: prefer the MA1-DESKS room from API (seeded in rooms table),
        // fall back to aggregating from mesa productos
        const deskProducto = allProductos.find(isCanonicalDeskProducto);

        if (deskProducto) {
          const deskRoom = buildRoomFromProducto(deskProducto, centroLabel);
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          aulaRooms.push(deskRoom);
        } else if (mesas.length > 0) {
          const sample = mesas[0];
          const deskRoom = buildRoomFromProducto(
            { ...sample, name: 'MA1 Desks', capacity: mesas.length },
            centroLabel
          );
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          aulaRooms.push(deskRoom);
        }

        setRooms(aulaRooms);
      } catch {
        // keep store empty on error; detail page will show "Room not found"
      }
    };

    populateStore();
    return () => { active = false; };
  }, [centros, setRooms]);

  // Load productos
  useEffect(() => {
    let active = true;
    setProductosLoading(true);

    const loadProductos = async () => {
      try {

        // Build params: always filter by MA1 centro.
        // For desk tab, do not force type=Mesa because some tenants expose desks
        // as canonical desk rooms (e.g. MA1_DESK) with type=Aula.
        const params = { centerCode: 'MA1' };
        if(activeTab === 0) {
          // Meeting Rooms tab -> Aulas
          params.type = 'Aula';
        }

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

  const spaceTypes = [
    { value: 'meeting_room', labelKey: 'home.meetingRooms', icon: <MeetingRoomRoundedIcon /> },
    { value: 'desk', labelKey: 'home.coworking', icon: <DeskRoundedIcon /> },
    // { value: 'virtual_office', labelKey: 'home.virtualOffice', icon: <BusinessRoundedIcon /> }
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

      if (type === 'aula' && !isCanonicalDeskProducto(producto)) {
        return upperName.startsWith('MA1A');
      }

      if (isDeskProducto(producto)) {
        if (isCanonicalDeskProducto(producto)) {
          return true;
        }
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
      return typeLower === 'aula' && !isCanonicalDeskProducto(producto);
    });

    const mesas = filteredProductos.filter((producto) => isDeskProducto(producto));

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
      const roomSlug = name.toLowerCase();

      return {
        id: producto.id,
        name,
        productName: name,
        slug: roomSlug,
        type: 'meeting_room',
        typeLabel: rawType || 'Meeting room',
        image: producto.heroImage || '',
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
        sizeSqm: producto.sizeSqm != null ? Number(producto.sizeSqm) : null,
        instantBooking: producto.instantBooking !== false,
        centroCode: productCenter || undefined,
        centerName: centerName || undefined,
        isBookable: true
      };
    });

    const deskCard = (() => {
      if (mesas.length === 0) {
        return null;
      }

      const sample = mesas[0];
      const productCenter = (sample.centerCode ?? sample.centroCodigo ?? '').trim();
      const productCenterUpper = productCenter.toUpperCase();
      const matchingCentro = centros.find(
        (c) => (c.code ?? '').toUpperCase() === productCenterUpper
      );
      const centerName = matchingCentro?.label ?? productCenter;
      const city = matchingCentro?.city ?? '';
      const deskCount = mesas.length;
      const matchingRoom = rooms.find((room) => (room.slug ?? '').toLowerCase() === 'ma1-desks');

      return {
        id: `desks-${productCenterUpper || 'ma1'}`,
        name: matchingRoom?.name || 'MA1 Desks',
        description: matchingRoom?.description || `${deskCount} desk${deskCount === 1 ? '' : 's'} available for booking`,
        productName: 'MA1 Desks',
        slug: 'ma1-desks',
        type: 'desk',
        image: matchingRoom?.heroImage || sample.heroImage || '',
        capacity: matchingRoom?.capacity != null ? String(matchingRoom.capacity) : String(deskCount),
        rating: 4.8,
        reviewCount: 0,
        price: matchingRoom?.priceFrom != null ? `€ ${matchingRoom.priceFrom}` : '€ 90',
        priceUnit: '/month',
        location: city || centerName || 'Málaga',
        tags: matchingRoom?.tags || [],
        instantBooking: true,
        centroCode: productCenter || undefined,
        availableCount: deskCount,
        centerName: centerName || undefined,
        isBookable: true
      };
    })();

    const mappedSpaces = deskCard ? [...aulaSpaces, deskCard] : aulaSpaces;

    let filtered = mappedSpaces.filter((space) => {
      if (activeTab === 0) {
        return space.type === 'meeting_room';
      }
      if (activeTab === 1) {
        return space.type === 'desk';
      }
      return true;
    });

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
  }, [productos, centros, cityFilter, people, rooms, activeTab]);

  const resolveRoomSlug = useCallback(
    (space) => {
      if (!space) {
        return '';
      }
      return (space.slug ?? '').toLowerCase();
    },
    []
  );

  const handleBookNow = useCallback(
    (space) => {
      const targetSlug = resolveRoomSlug(space);
      if (!targetSlug) {
        return;
      }

      const query = {};
      if (checkIn) query.date = checkIn;
      if (timeFilter) query.time = timeFilter;

      router.push({
        pathname: `/rooms/${targetSlug}`,
        query,
      });
    },
    [router, resolveRoomSlug, checkIn, timeFilter]
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Head>
        <title>BeSpaces | Meeting Rooms, Coworking & Virtual Office</title>
        <meta name="description" content="Meeting rooms, coworking desks, and virtual offices — find the right workspace for your business." />
      </Head>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 4 }}>
          {/* Back to main site */}
          <Button
            component="a"
            href={FRONTEND_URL}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'none',
              px: 1,
              mb: 1,
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'primary.main',
              },
            }}
          >
            {t('common.back')}
          </Button>

          {/* Page Title */}
          <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
            {t('home.title')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
            {t('home.subtitle')}
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
                label={t(type.labelKey)}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {activeTab === 2 ? (
          <VirtualOfficeSection />
        ) : (
          <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
            <>
              {/* Search Bar */}
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: { xs: 3, sm: 999 },
                }}
              >
                {/* Where */}
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <Autocomplete
                    size="small"
                    freeSolo
                    options={cityOptions.filter(o => !o.isAllOption)}
                    getOptionLabel={(option) => typeof option === 'string' ? option : (option?.label ?? '')}
                    value={cityFilter || null}
                    onChange={(_, value) => setCityFilter(typeof value === 'string' ? value : (value && value.id !== 'all' ? value.label : ''))}
                    onInputChange={(_, value, reason) => { if (reason === 'input') setCityFilter(value); }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder={t('home.wherePlaceholder')}
                        label={t('home.where')}
                        slotProps={{ input: { ...params.InputProps, disableUnderline: true }, inputLabel: { shrink: true } }}
                        sx={{
                          '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                          '& .MuiInput-input': { fontSize: '0.875rem', color: 'text.secondary', py: 0.25 },
                        }}
                      />
                    )}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

                {/* When */}
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    label={t('home.when')}
                    placeholder={t('home.whenPlaceholder')}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={{
                      '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                      '& .MuiInput-input': { fontSize: '0.875rem', color: checkIn ? 'text.primary' : 'text.secondary', py: 0.25 },
                    }}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

                {/* Time */}
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard"
                    type="time"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    label={t('home.time')}
                    placeholder={t('home.timePlaceholder')}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={{
                      '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                      '& .MuiInput-input': { fontSize: '0.875rem', color: timeFilter ? 'text.primary' : 'text.secondary', py: 0.25 },
                    }}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }} />

                {/* Who */}
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    variant="standard"
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    label={t('home.who')}
                    placeholder={t('home.whoPlaceholder')}
                    fullWidth
                    slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }}
                    sx={{
                      '& .MuiInputLabel-root': { fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.04em' },
                      '& .MuiInput-input': { fontSize: '0.875rem', color: people ? 'text.primary' : 'text.secondary', py: 0.25 },
                      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { display: 'none' },
                      '& input[type=number]': { MozAppearance: 'textfield' },
                    }}
                  />
                </Box>

                {/* Search button */}
                <Box sx={{ px: { xs: 2, sm: 1.5 }, py: { xs: 1.5, sm: 0 }, width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    aria-label={t('home.searchSpaces')}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'common.white',
                      width: 44,
                      height: 44,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <SearchRoundedIcon />
                  </IconButton>
                </Box>
              </Paper>

              {/* Results Count */}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {t(filteredSpaces.length === 1 ? 'home.showingSpace' : 'home.showingSpaces', { count: filteredSpaces.length })}
                </Typography>
              </Stack>

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
            </>
          </Box>
        )}

      </Box>
    </>
  );
};

export default HomePage;
