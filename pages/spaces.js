'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Autocomplete, Box, Divider, IconButton, Paper, Stack, TextField, Typography,
} from '@mui/material';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import DeskRoundedIcon from '@mui/icons-material/DeskRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  useCatalogRooms,
  buildRoomFromProducto,
  isCanonicalDeskProducto,
  isDeskProducto,
} from '@/store/useCatalogRooms';
import { fetchBookingCentros, fetchBookingProductos } from '@/api/bookings';
import SpaceCard from '@/components/home/SpaceCard';
import VirtualOfficeSection from '@/components/home/VirtualOfficeSection';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography, layout } = tokens;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
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

  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
            city,
          };
        }) : [];

        setCentros(options);

        const uniqueCities = Array.from(new Set(options
          .map((option) => option.city)
          .filter((city) => typeof city === 'string' && city.trim() !== '')
          .map((city) => city.trim())));
        setCityOptions(uniqueCities.map((city) => ({ id: city.toLowerCase(), label: city })));
      } catch {
        if (active) {
          setCentros([]);
          setCityOptions([]);
        }
      } finally {
        if (active) setCentrosLoading(false);
      }
    };
    loadCentros();
    return () => { active = false; };
  }, []);

  // Populate the catalog store with room objects built from API data
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
            centroLabel,
          );
          deskRoom.id = 'ma1-desks';
          deskRoom.slug = 'ma1-desks';
          deskRoom.productName = 'MA1 Desks';
          deskRoom.priceUnit = '/month';
          aulaRooms.push(deskRoom);
        }

        setRooms(aulaRooms);
      } catch {
        // keep store empty on error
      }
    };

    populateStore();
    return () => { active = false; };
  }, [centros, setRooms]);

  // Load productos for active tab
  useEffect(() => {
    let active = true;
    setProductosLoading(true);

    const loadProductos = async () => {
      try {
        const params = { centerCode: 'MA1' };
        if (activeTab === 0) {
          params.type = 'Aula';
        }
        const data = await fetchBookingProductos(params);
        if (!active) return;
        setProductos(Array.isArray(data) ? data : []);
      } catch {
        if (active) setProductos([]);
      } finally {
        if (active) setProductosLoading(false);
      }
    };

    loadProductos();
    return () => { active = false; };
  }, [activeTab]);

  const spaceTypes = [
    { value: 'meeting_room', labelKey: 'home.meetingRooms', Icon: MeetingRoomRoundedIcon },
    { value: 'desk', labelKey: 'home.coworking', Icon: DeskRoundedIcon },
    { value: 'virtual_office', labelKey: 'home.businessAddress', Icon: BusinessRoundedIcon },
  ];

  const filteredSpaces = useMemo(() => {
    if (!productos || !Array.isArray(productos)) return [];

    const filteredProductos = productos.filter((producto) => {
      const type = (producto.type ?? producto.tipo ?? '').trim().toLowerCase();
      const name = (producto.name ?? producto.nombre ?? '').trim();
      const centerCode = (producto.centerCode ?? producto.centroCodigo ?? '').trim().toUpperCase();

      if (!name || centerCode !== 'MA1') return false;

      const upperName = name.toUpperCase();

      if (type === 'aula' && !isCanonicalDeskProducto(producto)) {
        return upperName.startsWith('MA1A');
      }

      if (isDeskProducto(producto)) {
        if (isCanonicalDeskProducto(producto)) return true;
        const deskMatch = upperName.match(/^MA1[-_]?O1[-_ ]?(\d{1,2})$/);
        if (!deskMatch) return false;
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
      const matchingCentro = centros.find((c) => (c.code ?? '').toUpperCase() === productCenterUpper);
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
        isBookable: true,
      };
    });

    const deskCard = (() => {
      if (mesas.length === 0) return null;

      const sample = mesas[0];
      const productCenter = (sample.centerCode ?? sample.centroCodigo ?? '').trim();
      const productCenterUpper = productCenter.toUpperCase();
      const matchingCentro = centros.find((c) => (c.code ?? '').toUpperCase() === productCenterUpper);
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
        isBookable: true,
      };
    })();

    const mappedSpaces = deskCard ? [...aulaSpaces, deskCard] : aulaSpaces;

    let filtered = mappedSpaces.filter((space) => {
      if (activeTab === 0) return space.type === 'meeting_room';
      if (activeTab === 1) return space.type === 'desk';
      return true;
    });

    if (cityFilter && cityFilter.trim() !== '') {
      const cityFilterLower = cityFilter.trim().toLowerCase();
      filtered = filtered.filter((space) => (space.location ?? '').toLowerCase() === cityFilterLower);
    }

    if (people && people.trim() !== '') {
      const userCount = parseInt(people);
      if (!isNaN(userCount)) {
        filtered = filtered.filter((space) => {
          if (!space.capacity) return false;
          const capacityParts = space.capacity.split('-');
          if (capacityParts.length === 1) {
            const singleCapacity = parseInt(capacityParts[0]);
            return !isNaN(singleCapacity) && userCount <= singleCapacity;
          }
          const [minCapacity, maxCapacity] = capacityParts.map((num) => parseInt(num));
          return !isNaN(minCapacity) && !isNaN(maxCapacity) && userCount >= minCapacity && userCount <= maxCapacity;
        });
      }
    }

    return filtered;
  }, [productos, centros, cityFilter, people, rooms, activeTab]);

  const resolveRoomSlug = useCallback(
    (space) => (space ? (space.slug ?? '').toLowerCase() : ''),
    [],
  );

  const handleBookNow = useCallback(
    (space) => {
      const targetSlug = resolveRoomSlug(space);
      if (!targetSlug) return;
      const query = {};
      if (checkIn) query.date = checkIn;
      if (timeFilter) query.time = timeFilter;
      router.push({ pathname: `/rooms/${targetSlug}`, query });
    },
    [router, resolveRoomSlug, checkIn, timeFilter],
  );

  const handleTabChange = (newValue) => {
    if (newValue === 2) {
      router.push('/malaga/oficina-virtual');
      return;
    }
    setActiveTab(newValue);
  };

  const filterFieldSx = {
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: colors.ink,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    '& .MuiInput-input': { fontSize: '0.9rem', color: colors.ink, py: 0.25 },
  };

  return (
    <>
      <Head>
        <title>Spaces | BeWorking — Meeting Rooms, Coworking & Virtual Office</title>
        <meta
          name="description"
          content={isEs
            ? 'Salas de reuniones, coworking y oficinas virtuales en Málaga. Reserva tu espacio ideal en BeWorking.'
            : 'Meeting rooms, coworking and virtual offices in Málaga. Find and book the ideal space at BeWorking.'}
        />
        <link rel="canonical" href="https://be-working.com/spaces" />
      </Head>

      {/* Hero */}
      <Box
        component="section"
        ref={heroRef}
        sx={{
          bgcolor: colors.bg,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 9 },
          px: { xs: 3, md: 5 },
          textAlign: 'center',
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : `translateY(${motion.revealOffset}px)`,
            transition: `opacity ${motion.durationSlow} ${motion.ease}, transform ${motion.durationSlow} ${motion.ease}`,
          }}
        >
          <Typography
            sx={{
              ...typography.eyebrow,
              color: colors.brand,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            BeWorking · Spaces
          </Typography>
          <Box
            component="h1"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
            }}
          >
            {isEs ? 'Encuentra tu espacio' : 'Find your space'}
            <Box component="span" sx={{ color: colors.brand, display: 'block' }}>
              {isEs ? 'ideal.' : 'ideal.'}
            </Box>
          </Box>
          <Typography sx={{ ...typography.bodyLg, color: colors.ink2, mt: 3, maxWidth: 540, mx: 'auto' }}>
            {t('home.subtitle')}
          </Typography>
        </Box>
      </Box>

      {/* Filters + Grid */}
      <Box
        component="section"
        sx={{
          bgcolor: colors.bgSoft,
          py: { xs: 6, md: 9 },
          px: { xs: 3, md: 5 },
        }}
      >
        <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto' }}>
          {/* Type tabs */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            sx={{ mb: 4, justifyContent: 'center' }}
          >
            {spaceTypes.map((type, index) => {
              const active = activeTab === index;
              const { Icon } = type;
              return (
                <Box
                  key={type.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTabChange(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleTabChange(index);
                  }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.85,
                    px: 2.25,
                    py: 0.85,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '-0.005em',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    borderRadius: `${radius.pill}px`,
                    bgcolor: active ? colors.brand : colors.bg,
                    color: active ? colors.bg : colors.ink2,
                    border: `1px solid ${active ? colors.brand : colors.line}`,
                    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                    '&:hover': active ? {} : { borderColor: colors.brand, color: colors.brand },
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {t(type.labelKey)}
                </Box>
              );
            })}
          </Stack>

          {activeTab === 2 ? (
            <VirtualOfficeSection />
          ) : (
            <>
              {/* Search bar */}
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  border: `1px solid ${colors.line}`,
                  bgcolor: colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: { xs: 3, sm: 999 },
                }}
              >
                {/* Where */}
                <Box sx={{ flex: 1, px: 3, py: { xs: 1.5, sm: 2 }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                  <Autocomplete
                    size="small"
                    freeSolo
                    options={cityOptions.filter((o) => !o.isAllOption)}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : (option?.label ?? ''))}
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
                        sx={filterFieldSx}
                      />
                    )}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: colors.line }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto', borderColor: colors.line }} />

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
                    sx={filterFieldSx}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: colors.line }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto', borderColor: colors.line }} />

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
                    sx={filterFieldSx}
                  />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: colors.line }} />
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto', borderColor: colors.line }} />

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
                      ...filterFieldSx,
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
                      bgcolor: colors.brand,
                      color: colors.bg,
                      width: 44,
                      height: 44,
                      '&:hover': { bgcolor: colors.brandDeep },
                    }}
                  >
                    <SearchRoundedIcon />
                  </IconButton>
                </Box>
              </Paper>

              {/* Result count */}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', color: colors.ink3 }}>
                  {t(filteredSpaces.length === 1 ? 'home.showingSpace' : 'home.showingSpaces', { count: filteredSpaces.length })}
                </Typography>
              </Stack>

              {/* Card grid */}
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(1, minmax(0, 1fr))',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                  alignItems: 'stretch',
                  pb: 6,
                }}
              >
                {filteredSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
