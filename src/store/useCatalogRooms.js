import { create } from 'zustand';

// Static defaults for fields the API does not provide.
// Keyed by product name (upper-cased) for easy lookup.
const STATIC_DEFAULTS = {
  MA1A1: {
    mapEmbedUrl:
      'https://maps.google.com/maps?q=BeWorking+Coworking+Málaga+Calle+Alejandro+Dumas+17&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
};

const DEFAULT_CANCELLATION_POLICY = [
  'Cambios admitidos hasta 24 h antes del inicio.',
  'Modificaciones vía correo electrónico.',
  'No hay reembolso en caso de no asistencia.'
];

const DEFAULT_BOOKING_INSTRUCTIONS = [
  'Solicita tu horario y espera confirmación.',
  'Recibirás la factura y enlace de pago.',
  'Tras el pago te enviaremos instrucciones y acceso.'
];

/**
 * Build a room object from an API producto response, merging with static defaults.
 */
export function buildRoomFromProducto(producto, centroName) {
  const name = (producto.name ?? producto.nombre ?? '').trim();
  const nameUpper = name.toUpperCase();
  const slug = nameUpper.startsWith('MA1') && !nameUpper.includes('DESK')
    ? name.toLowerCase()
    : name.toLowerCase().replace(/\s+/g, '-');
  const staticDefaults = STATIC_DEFAULTS[nameUpper] || {};

  return {
    id: slug,
    slug,
    name: producto.displayName || name,
    centro: centroName || 'Málaga Workspace',
    capacity: producto.capacity,
    priceFrom: producto.priceFrom != null ? Number(producto.priceFrom) : undefined,
    priceUnit: producto.priceUnit || ((producto.type ?? producto.tipo ?? '').trim().toLowerCase() === 'mesa' ? '/month' : '/h'),
    currency: 'EUR',
    productName: name,
    heroImage: producto.heroImage || '',
    gallery: Array.isArray(producto.images) ? producto.images : [],
    description: producto.description || '',
    subtitle: producto.subtitle || '',
    amenities: Array.isArray(producto.amenities) ? producto.amenities : [],
    tags: Array.isArray(producto.tags) ? producto.tags : [],
    cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
    bookingInstructions: DEFAULT_BOOKING_INSTRUCTIONS,
    mapEmbedUrl: staticDefaults.mapEmbedUrl,
    instantBooking: producto.instantBooking !== false,
    ratingAverage: producto.ratingAverage != null ? Number(producto.ratingAverage) : undefined,
    ratingCount: producto.ratingCount ?? 0,
  };
}

const normalizeProductName = (name = '') =>
  name.trim().toUpperCase().replace(/[\s_-]+/g, '');

export const isCanonicalDeskProducto = (producto) => {
  const name = normalizeProductName(producto?.name ?? producto?.nombre ?? '');
  return name === 'MA1DESK' || name === 'MA1DESKS';
};

export const isDeskProducto = (producto) => {
  const type = (producto?.type ?? producto?.tipo ?? '').trim().toLowerCase();
  if (type === 'mesa') {
    return true;
  }

  const name = normalizeProductName(producto?.name ?? producto?.nombre ?? '');
  if (name === 'MA1DESK' || name === 'MA1DESKS') {
    return true;
  }

  // Defensive fallback for misclassified desk products.
  if (/^MA1O1\d{1,2}$/.test(name)) {
    return true;
  }

  return false;
};

export const useCatalogRooms = create((set) => ({
  rooms: [],
  setRooms: (nextRooms) => set({ rooms: nextRooms })
}));
