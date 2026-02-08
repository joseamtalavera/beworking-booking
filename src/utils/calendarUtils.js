export const DEFAULT_START_HOUR = 6;
export const DEFAULT_END_HOUR = 22;

import { alpha } from '@mui/material/styles';

export const statusStyles = () => ({
  available: {
    bgcolor: alpha('#a1a1aa', 0.15),
    borderColor: '#a1a1aa',
    color: '#52525b'
  },
  paid: {
    bgcolor: alpha('#009624', 0.18),
    borderColor: '#009624',
    color: '#007a1d'
  },
  invoiced: {
    bgcolor: alpha('#ef4444', 0.18),
    borderColor: '#dc2626',
    color: '#b91c1c'
  },
  created: {
    bgcolor: alpha('#fb923c', 0.15),
    borderColor: '#fb923c',
    color: '#ea580c'
  }
});

export const getInitials = (value) => {
  if (!value) {
    return '';
  }
  const normalized = value.trim();
  if (!normalized) {
    return '';
  }
  const parts = normalized.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const [first, second] = parts;
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
};

export const timeStringToMinutes = (value) => {
  if (!value) {
    return null;
  }
  const [hourPart, minutePart = '0'] = value.split(':');
  const hour = Number.parseInt(hourPart, 10);
  const minute = Number.parseInt(minutePart, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }
  return hour * 60 + minute;
};

const padTime = (minutes) => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const minute = (minutes % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

export const buildTimeSlotsWithBounds = (minMinutes, maxMinutes) => {
  const slots = [];
  for (let minutes = minMinutes; minutes <= maxMinutes; minutes += 30) {
    slots.push({ id: padTime(minutes), label: padTime(minutes) });
  }
  return slots;
};

export const buildTimeSlots = (startHour = DEFAULT_START_HOUR, endHour = DEFAULT_END_HOUR) =>
  buildTimeSlotsWithBounds(startHour * 60, endHour * 60);

const extractTimeFromISO = (isoString) => {
  if (!isoString) {
    return null;
  }
  const parts = isoString.split('T');
  if (parts.length < 2) {
    return null;
  }
  return parts[1].slice(0, 5);
};

export const mapStatusKey = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('pag') || normalized.includes('paid')) {
    return 'paid';
  }
  if (normalized.includes('fact') || normalized.includes('invoice')) {
    return 'invoiced';
  }
  return 'created';
};

export const describeBloqueo = (bloqueo) => {
  if (!bloqueo) {
    return 'Available slot';
  }
  const pieces = [];
  if (bloqueo.cliente?.nombre) {
    pieces.push(bloqueo.cliente.nombre);
  }
  if (bloqueo.centro?.nombre) {
    pieces.push(bloqueo.centro.nombre);
  }
  if (bloqueo.producto?.nombre) {
    pieces.push(bloqueo.producto.nombre);
  }
  const from = extractTimeFromISO(bloqueo.fechaIni);
  const to = extractTimeFromISO(bloqueo.fechaFin);
  if (from && to) {
    pieces.push(`${from} – ${to}`);
  }
  return pieces.join(' · ');
};

export const bloqueoCoversSlot = (bloqueo, slotId) => {
  const slotMinutes = timeStringToMinutes(slotId);
  if (slotMinutes == null) {
    return false;
  }
  const startMinutes = timeStringToMinutes(extractTimeFromISO(bloqueo.fechaIni)) ?? 0;
  const endMinutes = timeStringToMinutes(extractTimeFromISO(bloqueo.fechaFin)) ?? 24 * 60;
  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
};

export const buildTimeSlotsFromBloqueos = (bloqueos = []) => {
  if (!Array.isArray(bloqueos) || bloqueos.length === 0) {
    return buildTimeSlots();
  }
  let min = DEFAULT_START_HOUR * 60;
  let max = DEFAULT_END_HOUR * 60;
  let hasData = false;

  bloqueos.forEach((bloqueo) => {
    const start = timeStringToMinutes(extractTimeFromISO(bloqueo.fechaIni));
    const end = timeStringToMinutes(extractTimeFromISO(bloqueo.fechaFin));
    if (start != null) {
      min = Math.min(min, start);
      hasData = true;
    }
    if (end != null) {
      max = Math.max(max, end);
      hasData = true;
    }
  });

  if (!hasData) {
    return buildTimeSlots();
  }

  const clampedMin = Math.max(0, Math.min(min, 22 * 60));
  const clampedMax = Math.min(Math.max(clampedMin + 30, max), 23 * 60 + 30);
  return buildTimeSlotsWithBounds(clampedMin, clampedMax);
};

export const coversSlot = (booking, slotId) => {
  const slotMinutes = timeStringToMinutes(slotId);
  if (slotMinutes == null) {
    return false;
  }
  const startMinutes = timeStringToMinutes(booking.startTime);
  const endMinutes = timeStringToMinutes(booking.endTime);
  if (startMinutes == null || endMinutes == null) {
    return false;
  }
  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
};

export const addMinutesToTime = (timeString, minutesToAdd) => {
  const minutes = timeStringToMinutes(timeString);
  if (minutes == null) {
    return timeString;
  }
  const total = minutes + minutesToAdd;
  const normalized = Math.max(0, Math.min(total, 24 * 60));
  const hour = Math.floor(normalized / 60)
    .toString()
    .padStart(2, '0');
  const minute = (normalized % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
};
