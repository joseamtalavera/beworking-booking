import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createReserva, fetchBookingCentros, fetchBookingContacts, fetchBookingProductos, updateBloqueo } from '../../api/bookings.js';

const DEFAULT_START_HOUR = 6;
const DEFAULT_END_HOUR = 24;
const DEFAULT_RESERVATION_TYPE = 'Por Horas';
const RESERVATION_TYPE_OPTIONS = ['Por Horas', 'Diaria', 'Mensual'];
const STATUS_FORM_OPTIONS = ['Created', 'Invoiced', 'Paid'];
const WEEKDAY_OPTIONS = [
  { value: 'monday', label: 'Monday', shortLabel: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
  { value: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
  { value: 'friday', label: 'Friday', shortLabel: 'Fri' },
  { value: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
  { value: 'sunday', label: 'Sunday', shortLabel: 'Sun' }
];

const TENANT_TYPE_OVERRIDES = {
  'cesar manuel del castillo rivero': 'Usuario Virtual',
  'francisca granados ballesteros': 'Usuario Virtual',
  horums: 'Usuario Virtual',
  'juan lopez garcia': 'Usuario Virtual',
  'osguese business, sociedad limitada': 'Usuario Virtual',
  'moderniza & actua consultores s.l.': 'Usuario Aulas',
  'p2 formacion y empleo sl': 'Usuario Aulas',
  'jose a molina-talavera': 'Usuario Mesa'
};

const LEGACY_TENANT_TYPE_MAP = {
  'Usuario Oficinas Virtuales': 'Usuario Virtual'
};

const DEFAULT_TIME_RANGE = { start: '09:00', end: '10:00' };
const DEFAULT_USER_TYPE = 'Usuario Aulas';

const normalizeName = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const resolveTenantType = (bloqueo) => {
  const nameKey = normalizeName(bloqueo?.cliente?.nombre || '');
  const override = nameKey ? TENANT_TYPE_OVERRIDES[nameKey] : undefined;
  const rawType = override || bloqueo?.cliente?.tipoTenant || '';
  return LEGACY_TENANT_TYPE_MAP[rawType] || rawType;
};

const resolveDisplayTenantType = (bloqueo) => {
  const tenantType = resolveTenantType(bloqueo);
  const productName = bloqueo?.producto?.nombre || '';
  if (['MA1A1', 'MA1A2', 'MA1A3', 'MA1A4', 'MA1A5'].includes(productName)) {
    return 'Usuario Aulas';
  }
  return tenantType;
};

const initialDateISO = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toTimeString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
};

const parseTimeString = (value) => {
  if (!value) {
    return null;
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const buildDefaultTimeSlots = () => {
  const slots = [];
  for (let minutes = DEFAULT_START_HOUR * 60; minutes <= DEFAULT_END_HOUR * 60; minutes += 30) {
    const hour = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const minute = (minutes % 60).toString().padStart(2, '0');
    slots.push({ id: `${hour}:${minute}`, label: `${hour}:${minute}` });
  }
  return slots;
};

const ReservationSummary = ({ formState, selectedContact }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Quick summary
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formState.dateFrom} · {formState.startTime} – {formState.endTime}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formState.producto?.name || 'Select a room'} · {formState.centro?.name || 'Centro'}
        </Typography>
        {selectedContact ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {selectedContact.name} · {selectedContact.email || 'No email'}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

const ReservaDialog = ({
  open,
  mode = 'create',
  onClose,
  onCreated,
  onUpdated,
  defaultDate,
  defaultSlot,
  initialBloqueo,
  room
}) => {
  const isEditMode = mode === 'edit';
  const dialogTitle = isEditMode ? 'Edit bloqueo' : 'Create reserva';
  const dialogSubtitle = isEditMode
    ? 'Update the bloqueo details before saving.'
    : 'Add a new reservation to the system';
  const primaryActionLabel = isEditMode ? 'Save changes' : 'Create reserva';
  const DialogIcon = isEditMode ? EditRoundedIcon : AddRoundedIcon;

  const buildInitialState = useCallback(() => {
    const fallbackDate = defaultDate || initialDateISO();
    const extractDate = (isoString, fallback) => {
      if (!isoString) {
        return fallback;
      }
      const [datePart] = isoString.split('T');
      return datePart || fallback;
    };
    const extractTime = (isoString) => {
      if (!isoString) {
        return '';
      }
      const timePart = isoString.split('T')[1] || '';
      return timePart.slice(0, 5);
    };

    if (isEditMode && initialBloqueo) {
      const startDate = extractDate(initialBloqueo.fechaIni, fallbackDate);
      const endDate = extractDate(initialBloqueo.fechaFin, startDate);
      const startTimeRaw = extractTime(initialBloqueo.fechaIni);
      const endTimeRaw = extractTime(initialBloqueo.fechaFin);

      const contact = initialBloqueo.cliente
        ? {
            id: initialBloqueo.cliente.id,
            name: initialBloqueo.cliente.nombre || initialBloqueo.cliente.name || '',
            email: initialBloqueo.cliente.email || '',
            tenantType:
              initialBloqueo.cliente.tipoTenant ||
              initialBloqueo.cliente.tenantType ||
              resolveDisplayTenantType(initialBloqueo)
          }
        : null;

      const centro = initialBloqueo.centro
        ? {
            id: initialBloqueo.centro.id,
            name: initialBloqueo.centro.nombre || initialBloqueo.centro.name || '',
            code:
              initialBloqueo.centro.code ||
              initialBloqueo.centro.codigo ||
              initialBloqueo.centro.centroCode ||
              initialBloqueo.centro.codeCenter ||
              ''
          }
        : null;

      const reservationTypeRaw =
        initialBloqueo.tipoReserva ||
        initialBloqueo.reservationType ||
        initialBloqueo.tipo ||
        DEFAULT_RESERVATION_TYPE;

      const reservationType =
        RESERVATION_TYPE_OPTIONS.find(
          (option) => option.toLowerCase() === String(reservationTypeRaw || '').toLowerCase()
        ) || DEFAULT_RESERVATION_TYPE;
      const normalizedReservationType = reservationType.toLowerCase();

      const producto = initialBloqueo.producto
        ? {
            id: initialBloqueo.producto.id,
            name: initialBloqueo.producto.nombre || initialBloqueo.producto.name || '',
            type: initialBloqueo.producto.tipo || initialBloqueo.producto.type,
            centerCode:
              initialBloqueo.producto.centerCode ||
              initialBloqueo.producto.centroCodigo ||
              initialBloqueo.producto.centroCode ||
              (centro?.code ? centro.code.toLowerCase() : undefined)
          }
        : null;

      const weekSources =
        initialBloqueo.weekdays || initialBloqueo.dias || initialBloqueo.days || initialBloqueo.semana;
      const weekdays = Array.isArray(weekSources)
        ? weekSources
            .map((day) => (typeof day === 'string' ? day.toLowerCase() : day?.value || ''))
            .filter(Boolean)
        : [];

      const statusOption = (() => {
        const rawStatus = initialBloqueo.estado;
        if (STATUS_FORM_OPTIONS.includes(rawStatus)) {
          return rawStatus;
        }
        const key = (() => {
          const normalized = (rawStatus || '').toLowerCase();
          if (normalized.includes('pag') || normalized.includes('paid')) {
            return 'Paid';
          }
          if (normalized.includes('fact') || normalized.includes('invoice')) {
            return 'Invoiced';
          }
          return 'Created';
        })();
        return key;
      })();

      return {
        contact,
        centro,
        producto,
        userType: contact?.tenantType || DEFAULT_USER_TYPE,
        reservationType,
        dateFrom: startDate,
        dateTo: endDate,
        startTime:
          startTimeRaw || (normalizedReservationType === 'por horas' ? DEFAULT_TIME_RANGE.start : ''),
        endTime: endTimeRaw || (normalizedReservationType === 'por horas' ? DEFAULT_TIME_RANGE.end : ''),
        weekdays,
        openEnded: Boolean(initialBloqueo.openEnded),
        tarifa:
          initialBloqueo.tarifa != null && initialBloqueo.tarifa !== ''
            ? String(initialBloqueo.tarifa)
            : '',
        attendees:
          initialBloqueo.asistentes != null && initialBloqueo.asistentes !== ''
            ? String(initialBloqueo.asistentes)
            : '',
        configuracion: initialBloqueo.configuracion ?? '',
        note: initialBloqueo.nota ?? '',
        status: statusOption
      };
    }

    const defaultProduct = room
      ? {
          id: room.productId ?? null,
          name: room.productName || room.name,
          type: 'Meeting room'
        }
      : null;

    return {
      contact: null,
      centro: null,
      producto: defaultProduct,
      userType: DEFAULT_USER_TYPE,
      reservationType: DEFAULT_RESERVATION_TYPE,
      dateFrom: defaultSlot?.date || fallbackDate,
      dateTo: defaultSlot?.date || fallbackDate,
      startTime: defaultSlot?.startTime || DEFAULT_TIME_RANGE.start,
      endTime: defaultSlot?.endTime || DEFAULT_TIME_RANGE.end,
      weekdays: [],
      openEnded: false,
      tarifa: '',
      attendees: '',
      configuracion: '',
      note: '',
      status: STATUS_FORM_OPTIONS[0]
    };
  }, [defaultDate, defaultSlot, initialBloqueo, isEditMode, room]);

  const [formState, setFormState] = useState(() => buildInitialState());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [contactOptions, setContactOptions] = useState([]);
  const [contactInputValue, setContactInputValue] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactFetchError, setContactFetchError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const [centroOptions, setCentroOptions] = useState([]);
  const [centrosLoading, setCentrosLoading] = useState(false);
  const [productosLoading, setProductosLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!open) {
      return;
    }
    setFormState(buildInitialState());
    setSelectedContact(null);
    setContactInputValue('');
    setActiveTab('details');
  }, [open, buildInitialState]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCentrosLoading(true);
    fetchBookingCentros()
      .then((response) => {
        setCentroOptions(Array.isArray(response) ? response : []);
      })
      .catch((fetchError) => {
        console.error('Failed to load centros', fetchError);
      })
      .finally(() => setCentrosLoading(false));

    setProductosLoading(true);
    fetchBookingProductos()
      .then((response) => {
        const items = Array.isArray(response) ? response : [];
        setAvailableProducts(items.map((item) => ({
          id: item.id,
          name: item.nombre || item.name,
          type: item.tipo || item.type,
          centerCode: item.centroCodigo || item.centerCode || null
        })));
      })
      .catch((fetchError) => {
        console.error('Failed to load productos', fetchError);
      })
      .finally(() => setProductosLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!availableProducts.length || !room?.productName) {
      return;
    }
    const match = availableProducts.find((item) => item.name === room.productName);
    if (match) {
      setFormState((prev) => ({
        ...prev,
        producto: match
      }));
    }
  }, [availableProducts, open, room]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!centroOptions.length || !room?.centro) {
      return;
    }
    const match = centroOptions.find((item) => item.nombre === room.centro);
    if (match) {
      setFormState((prev) => ({
        ...prev,
        centro: {
          id: match.id,
          name: match.nombre,
          code: match.codigo || match.code
        }
      }));
    }
  }, [centroOptions, open, room]);

  useEffect(() => {
    if (!selectedContact) {
      return;
    }
    setFormState((prev) => ({
      ...prev,
      userType: selectedContact.tenantType || DEFAULT_USER_TYPE
    }));
  }, [selectedContact]);

  const filteredWeekdays = useMemo(() => {
    if (!Array.isArray(formState.weekdays)) {
      return [];
    }
    return WEEKDAY_OPTIONS.filter((option) => formState.weekdays.includes(option.value));
  }, [formState.weekdays]);

  const selectedContactLabel = selectedContact
    ? `${selectedContact.name}${selectedContact.email ? ` · ${selectedContact.email}` : ''}`
    : 'Select contact';

  const handleTabChange = (_event, value) => {
    setActiveTab(value);
  };

  const handleContactSearch = (_event, value, reason) => {
    if (reason === 'input') {
      setContactInputValue(value);
    }
  };

  const fetchContacts = useCallback(
    (search) => {
      setContactsLoading(true);
      setContactFetchError('');
      fetchBookingContacts({ search })
        .then((response) => {
          const items = Array.isArray(response) ? response : [];
          setContactOptions(
            items.map((item) => ({
              id: item.id,
              name: item.nombre || item.name,
              email: item.email || '',
              tenantType: item.tipoTenant || item.tenantType || ''
            }))
          );
        })
        .catch((fetchError) => {
          console.error('Contact lookup failed', fetchError);
          setContactFetchError('Unable to load contacts');
          setContactOptions([]);
        })
        .finally(() => setContactsLoading(false));
    },
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchContacts('');
  }, [fetchContacts, open]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleWeekdayToggle = (weekday) => (_event, checked) => {
    setFormState((prev) => {
      const set = new Set(prev.weekdays || []);
      if (checked) {
        set.add(weekday);
      } else {
        set.delete(weekday);
      }
      return {
        ...prev,
        weekdays: Array.from(set)
      };
    });
  };

  const normalizedReservationType = (formState.reservationType || '').toLowerCase();
  const isPerHour = normalizedReservationType === 'por horas';
  const showWeekdays = normalizedReservationType === 'por horas' || normalizedReservationType === 'diaria';

  const validateForm = () => {
    if (!selectedContact?.id) {
      return 'Please select a contact';
    }
    if (!formState.centro?.id) {
      return 'Please select a centro';
    }
    if (!formState.producto?.id) {
      return 'Please select a producto';
    }
    if (!formState.dateFrom || !formState.dateTo) {
      return 'Both start and end dates are required';
    }
    if (formState.dateFrom > formState.dateTo) {
      return 'Start date must be before end date';
    }
    if (isPerHour && (!formState.startTime || !formState.endTime)) {
      return 'Start and end times are required';
    }
    return '';
  };

  const buildPayload = () => {
    const attendees = formState.attendees === '' ? null : Number(formState.attendees);
    const payload = {
      contactId: selectedContact.id,
      centroId: formState.centro.id,
      productoId: formState.producto.id,
      reservationType: formState.reservationType,
      dateFrom: formState.dateFrom,
      dateTo: formState.dateTo,
      timeSlots: isPerHour
        ? [
            {
              from: formState.startTime,
              to: formState.endTime
            }
          ]
        : [],
      weekdays: showWeekdays ? formState.weekdays : [],
      openEnded: formState.openEnded,
      tarifa: formState.tarifa ? Number(formState.tarifa) : null,
      attendees,
      configuracion: formState.configuracion || null,
      note: formState.note || null,
      status: formState.status
    };
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode && initialBloqueo?.id) {
        const payload = buildPayload();
        await updateBloqueo(initialBloqueo.id, payload);
        onUpdated?.();
      } else {
        const payload = buildPayload();
        await createReserva(payload);
        onCreated?.();
      }
    } catch (submitError) {
      console.error('Reserva submit error', submitError);
      setError(submitError.message || 'Unable to process reserva');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DialogIcon sx={{ color: 'secondary.main' }} />
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {dialogTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {dialogSubtitle}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
          <Stack spacing={3}>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : null}

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: '1px solid', borderBottomColor: 'divider' }}>
              <Tab label="Details" value="details" disableRipple />
              <Tab label="Extras" value="extras" disableRipple />
            </Tabs>

            {activeTab === 'details' ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Stack spacing={3}>
                      <Autocomplete
                        value={selectedContact}
                        onChange={(_event, value) => {
                          setSelectedContact(value);
                          setFormState((prev) => ({
                            ...prev,
                            contact: value
                          }));
                        }}
                        onInputChange={handleContactSearch}
                        inputValue={contactInputValue}
                        options={contactOptions}
                        loading={contactsLoading}
                        filterOptions={(options) => options}
                        getOptionLabel={(option) => option?.name || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Contact"
                            placeholder="Search contacts"
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchRoundedIcon sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {contactsLoading ? <CircularProgress color="inherit" size={16} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {option.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {option.email || 'No email'}
                              </Typography>
                            </Stack>
                          </li>
                        )}
                        noOptionsText={contactFetchError || 'No contacts'}
                      />

                      <TextField
                        label="Contact email"
                        value={selectedContact?.email || ''}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlinedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        label="Centro"
                        value={formState.centro?.name || ''}
                        onChange={(event) => {
                          const centro = centroOptions.find((item) => item.nombre === event.target.value);
                          setFormState((prev) => ({
                            ...prev,
                            centro: centro
                              ? {
                                  id: centro.id,
                                  name: centro.nombre,
                                  code: centro.codigo || centro.code
                                }
                              : null
                          }));
                        }}
                        select
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnRoundedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      >
                        <MenuItem value="">Select centro</MenuItem>
                        {centroOptions.map((centro) => (
                          <MenuItem key={centro.id} value={centro.nombre}>
                            {centro.codigo ? `${centro.codigo} · ` : ''}
                            {centro.nombre}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Producto"
                        value={formState.producto?.name || ''}
                        onChange={(event) => {
                          const producto = availableProducts.find((item) => item.name === event.target.value);
                          setFormState((prev) => ({ ...prev, producto: producto || null }));
                        }}
                        select
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MeetingRoomRoundedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      >
                        <MenuItem value="">Select product</MenuItem>
                        {availableProducts.map((producto) => (
                          <MenuItem key={producto.id} value={producto.name}>
                            {producto.name}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Reservation type"
                        value={formState.reservationType}
                        onChange={handleFieldChange('reservationType')}
                        select
                        required
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

                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                          label="Start date"
                          type="date"
                          value={formState.dateFrom}
                          onChange={handleFieldChange('dateFrom')}
                          InputLabelProps={{ shrink: true }}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonthRoundedIcon sx={{ color: 'text.disabled' }} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <TextField
                          label="End date"
                          type="date"
                          value={formState.dateTo}
                          onChange={handleFieldChange('dateTo')}
                          InputLabelProps={{ shrink: true }}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayRoundedIcon sx={{ color: 'text.disabled' }} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Stack>

                      {isPerHour ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TimePicker
                              label="Start time"
                              value={parseTimeString(formState.startTime)}
                              onChange={(value) => {
                                setFormState((prev) => ({
                                  ...prev,
                                  startTime: toTimeString(value)
                                }));
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccessTimeRoundedIcon sx={{ color: 'text.disabled' }} />
                                      </InputAdornment>
                                    )
                                  }
                                }
                              }}
                            />
                            <TimePicker
                              label="End time"
                              value={parseTimeString(formState.endTime)}
                              onChange={(value) => {
                                setFormState((prev) => ({
                                  ...prev,
                                  endTime: toTimeString(value)
                                }));
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  InputProps: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccessTimeRoundedIcon sx={{ color: 'text.disabled' }} />
                                      </InputAdornment>
                                    )
                                  }
                                }
                              }}
                            />
                          </Stack>
                        </LocalizationProvider>
                      ) : null}

                      {showWeekdays ? (
                        <FormGroup sx={{ gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Weekdays
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                          </Stack>
                        </FormGroup>
                      ) : null}

                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                          label="Attendees"
                          type="number"
                          value={formState.attendees}
                          onChange={handleFieldChange('attendees')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PeopleAltRoundedIcon sx={{ color: 'text.disabled' }} />
                              </InputAdornment>
                            )
                          }}
                        />
                        <TextField
                          label="Tarifa (€)"
                          type="number"
                          value={formState.tarifa}
                          onChange={handleFieldChange('tarifa')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EuroRoundedIcon sx={{ color: 'text.disabled' }} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Stack>

                      <TextField
                        label="Configuración"
                        value={formState.configuracion}
                        onChange={handleFieldChange('configuracion')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SettingsSuggestRoundedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        label="Status"
                        value={formState.status}
                        onChange={handleFieldChange('status')}
                        select
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FlagRoundedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      >
                        {STATUS_FORM_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Notes"
                        value={formState.note}
                        onChange={handleFieldChange('note')}
                        multiline
                        minRows={3}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StickyNote2RoundedIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <ReservationSummary formState={formState} selectedContact={selectedContact} />
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Quick actions
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          Toggle open ended reservations or mark weekdays that apply.
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(formState.openEnded)}
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
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formState.weekdays.length === WEEKDAY_OPTIONS.length}
                              onChange={(_event, checked) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  weekdays: checked ? WEEKDAY_OPTIONS.map((item) => item.value) : []
                                }))
                              }
                            />
                          }
                          label="Select all weekdays"
                        />
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {filteredWeekdays.map((weekday) => (
                            <Chip key={weekday.value} label={weekday.shortLabel} size="small" />
                          ))}
                        </Stack>
                      </Stack>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Additional notes
                      </Typography>
                      <TextField
                        label="Configuration"
                        value={formState.configuracion}
                        onChange={handleFieldChange('configuracion')}
                        multiline
                        minRows={3}
                      />
                      <TextField
                        label="Internal notes"
                        value={formState.note}
                        onChange={handleFieldChange('note')}
                        multiline
                        minRows={3}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined" startIcon={<CloseRoundedIcon />} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<PlayArrowRoundedIcon />} disabled={submitting}>
            {submitting ? 'Saving…' : primaryActionLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ReservaDialog;
