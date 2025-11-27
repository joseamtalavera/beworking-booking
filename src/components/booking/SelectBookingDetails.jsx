import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBookingFlow } from '../../store/useBookingFlow.js';
import {
  fetchPublicAvailability,
  fetchBookingCentros,
  fetchBookingProductos
} from '../../api/bookings.js';
import RoomCalendarGrid, { CalendarLegend } from './RoomCalendarGrid.jsx';
import { addMinutesToTime } from '../../utils/calendarUtils.js';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const RESERVATION_TYPE_OPTIONS = ['Por Horas', 'Diaria', 'Mensual'];
const STATUS_FORM_OPTIONS = ['Created', 'Invoiced', 'Paid'];
const WEEKDAY_OPTIONS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];
const DEFAULT_USER_TYPE = 'Usuario Aulas';
const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };

const SelectBookingDetails = ({ room, onContinue }) => {
  const schedule = useBookingFlow((state) => state.schedule);
  const setSchedule = useBookingFlow((state) => state.setSchedule);

  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    customerName: '',
    centro: null,
    userType: DEFAULT_USER_TYPE,
    reservationType: RESERVATION_TYPE_OPTIONS[0],
    status: STATUS_FORM_OPTIONS[0],
    tarifa: '',
    producto: null,
    configuracion: '',
    note: '',
    weekdays: [],
    openEnded: false
  });
  const [centroOptions, setCentroOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    if (!schedule.startTime) {
      setSchedule({ startTime: DEFAULT_TIME_RANGE.start });
    }
    if (!schedule.endTime) {
      setSchedule({ endTime: DEFAULT_TIME_RANGE.end });
    }
    if (!schedule.date) {
      const today = new Date().toISOString().split('T')[0];
      setSchedule({ date: today, dateTo: today });
    } else if (!schedule.dateTo) {
      setSchedule({ dateTo: schedule.date });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchBookingCentros()
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        const normalized = items
          .map((item) => ({
            id: item.id,
            nombre: item.nombre || item.name || '',
            codigo: item.codigo || item.code || item.centroCodigo || item.centroCode || ''
          }))
          .filter((item) => item.codigo && item.codigo.toUpperCase() !== 'MAOV');
        setCentroOptions(normalized);
        if (normalized.length && !formState.centro) {
          const first = normalized[0];
          setFormState((prev) => ({
            ...prev,
            centro: {
              id: first.id,
              name: first.nombre,
              code: first.codigo
            }
          }));
        }
      })
      .catch((err) => console.error('Failed to load centros', err));
  }, []);

  useEffect(() => {
    fetchBookingProductos()
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        const normalized = items.map((item) => ({
          id: item.id,
          nombre: item.nombre || item.name,
          tipo: item.tipo || item.type,
          centerCode: (item.centroCodigo || item.centerCode || '').toUpperCase()
        }));
        setProductOptions(normalized);
        if (!formState.producto) {
          const match = normalized.find((item) => item.nombre?.toLowerCase() === room?.productName?.toLowerCase());
          const fallback = match || normalized[0];
          if (fallback) {
            setFormState((prev) => ({
              ...prev,
              producto: {
                id: fallback.id,
                name: fallback.nombre || fallback.name,
                type: fallback.tipo || fallback.type,
                centerCode: fallback.centerCode
              }
            }));
          }
        }
      })
      .catch((err) => console.error('Failed to load productos', err));
  }, [room?.productName]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['public-availability', schedule.date, formState.producto?.name || room?.productName],
    queryFn: () =>
      fetchPublicAvailability({
        date: schedule.date,
        products: formState.producto?.name ? [formState.producto.name] : room?.productName ? [room.productName] : undefined
      }),
    enabled: Boolean(schedule.date)
  });

  const bloqueos = Array.isArray(data) ? data : [];

  const activeProductName = formState.producto?.name || room?.productName;
  const roomBloqueos = useMemo(() => {
    if (!activeProductName) {
      return bloqueos;
    }
    return bloqueos.filter((item) => (item?.producto?.nombre || '').toLowerCase() === activeProductName.toLowerCase());
  }, [bloqueos, activeProductName]);

  const selectedSlotKey = useMemo(() => {
    if (schedule.startTime) {
      return `${room?.id || 'room'}-${schedule.startTime}`;
    }
    return '';
  }, [room?.id, schedule.startTime]);

  const handleScheduleChange = (patch) => {
    setSchedule(patch);
  };

  const handleDateChange = (field) => (event) => {
    const value = event.target.value;
    handleScheduleChange({ [field]: value });
    if (field === 'date') {
      handleScheduleChange({ dateTo: value });
    }
  };

  const handleTimeChange = (field) => (event) => {
    handleScheduleChange({ [field]: event.target.value });
  };

  const handleAttendeesChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    handleScheduleChange({ attendees: Number.isNaN(value) || value < 1 ? 1 : value });
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const filteredProducts = useMemo(() => {
    if (!formState.centro?.code) {
      return productOptions;
    }
    const code = (formState.centro.code || '').toUpperCase();
    const scoped = productOptions.filter(
      (item) => !item.centerCode || item.centerCode === code
    );
    return scoped.length ? scoped : productOptions;
  }, [productOptions, formState.centro?.code]);

  const handleCentroChange = (event) => {
    const selected = centroOptions.find((item) => item.nombre === event.target.value);
    setFormState((prev) => {
      const nextCentro = selected
        ? {
            id: selected.id,
            name: selected.nombre,
            code: selected.codigo || selected.code
          }
        : null;
      const code = (nextCentro?.code || '').toUpperCase();
      const nextProduct =
        filteredProducts.find((p) => p.centerCode === code) ||
        filteredProducts[0] ||
        null;
      return {
        ...prev,
        centro: nextCentro,
        producto: nextProduct
          ? { id: nextProduct.id, name: nextProduct.nombre, type: nextProduct.tipo, centerCode: nextProduct.centerCode }
          : null
      };
    });
  };

  const handleProductoChange = (event) => {
    const selected = productOptions.find((item) => item.nombre === event.target.value);
    setFormState((prev) => ({
      ...prev,
      producto: selected
        ? {
            id: selected.id,
            name: selected.nombre || selected.name,
            type: selected.tipo || selected.type,
            centerCode: selected.centerCode
          }
        : null
    }));
    queryClient.invalidateQueries({ queryKey: ['public-availability'] });
  };

  const handleWeekdayToggle = (weekday) => (_event, checked) => {
    setFormState((prev) => {
      const set = new Set(prev.weekdays);
      if (checked) {
        set.add(weekday);
      } else {
        set.delete(weekday);
      }
      return { ...prev, weekdays: Array.from(set) };
    });
  };

  const handleSlotSelect = (slot, bloqueo) => {
    if (!schedule.date || bloqueo) {
      return;
    }
    const nextEnd = addMinutesToTime(slot.id, 30);
    handleScheduleChange({ startTime: slot.id, endTime: nextEnd });
  };

  const isContinueDisabled =
    !formState.centro ||
    !formState.producto ||
    !schedule.date ||
    !schedule.startTime ||
    !schedule.endTime;

  return (
    <Stack spacing={4}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Who & where
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Provide basic booking details so we can secure the right space for you.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Search by name"
              placeholder="Your name"
              fullWidth
              value={formState.customerName}
              onChange={handleFieldChange('customerName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Centro"
              select
              fullWidth
              value={formState.centro?.nombre || formState.centro?.name || ''}
              onChange={handleCentroChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            >
              {centroOptions.map((option) => (
                <MenuItem key={option.id} value={option.nombre}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="User type"
              select
              fullWidth
              value={formState.userType}
              onChange={handleFieldChange('userType')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            >
              {[DEFAULT_USER_TYPE, 'Usuario Virtual', 'Usuario Mesa'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Producto"
              select
              fullWidth
              value={formState.producto?.name || ''}
              onChange={handleProductoChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SettingsSuggestRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            >
              {filteredProducts.map((option) => (
                <MenuItem key={option.id} value={option.nombre}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Reservation type"
              select
              fullWidth
              value={formState.reservationType}
              onChange={handleFieldChange('reservationType')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventRepeatRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            >
              {RESERVATION_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Status"
              fullWidth
              value={formState.status}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            >
              <MenuItem value={formState.status}>{formState.status}</MenuItem>
            </TextField>
            <TextField
              label="Tarifa (€)"
              value={formState.tarifa}
              onChange={handleFieldChange('tarifa')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Schedule & status
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Select your preferred dates and times. Weekday selection is optional for recurring bookings.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Date from"
              type="date"
              value={schedule.date || ''}
              onChange={handleDateChange('date')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Date to"
              type="date"
              value={schedule.dateTo || schedule.date || ''}
              onChange={handleDateChange('dateTo')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Start time"
              type="time"
              value={schedule.startTime || DEFAULT_TIME_RANGE.start}
              onChange={handleTimeChange('startTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="End time"
              type="time"
              value={schedule.endTime || DEFAULT_TIME_RANGE.end}
              onChange={handleTimeChange('endTime')}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <FormGroup row sx={{ gap: 1 }}>
            {WEEKDAY_OPTIONS.map((weekday) => (
              <FormControlLabel
                key={weekday.value}
                control={
                  <Checkbox
                    checked={formState.weekdays.includes(weekday.value)}
                    onChange={handleWeekdayToggle(weekday.value)}
                  />
                }
                label={weekday.label}
              />
            ))}
            <FormControlLabel
              control={
                <Switch
                  checked={formState.openEnded}
                  onChange={(_event, checked) =>
                    setFormState((prev) => ({
                      ...prev,
                      openEnded: checked
                    }))
                  }
                />
              }
              label="Open ended"
            />
          </FormGroup>

          <Divider sx={{ my: 1 }} />

          {isError ? (
            <Alert severity="error">{error?.message || 'Unable to fetch availability.'}</Alert>
          ) : null}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Stack spacing={2}>
              <CalendarLegend />
              <RoomCalendarGrid
                room={room}
                dateLabel={schedule.date ? new Date(schedule.date).toLocaleDateString() : ''}
                bloqueos={roomBloqueos}
                selectedSlotKey={selectedSlotKey}
                onSelectSlot={handleSlotSelect}
              />
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Additional details
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Attendees"
              type="number"
              value={schedule.attendees || ''}
              onChange={handleAttendeesChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleAltRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
              fullWidth
            />
            <TextField
              label="Configuración"
              value={formState.configuracion}
              onChange={handleFieldChange('configuracion')}
              fullWidth
            />
          </Stack>
          <TextField
            label="Notas"
            value={formState.note}
            onChange={handleFieldChange('note')}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onContinue} disabled={isContinueDisabled}>
          Continue
        </Button>
      </Box>
    </Stack>
  );
};

export default SelectBookingDetails;
