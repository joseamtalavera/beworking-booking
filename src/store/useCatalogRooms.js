import { create } from 'zustand';
import { COWORK_ZONES, isZoneActiveToday, zoneForProductName } from '../config/coworkZones';

// Static defaults for fields the API does not provide.
// Keyed by product name (upper-cased) for easy lookup.
const STATIC_DEFAULTS = {
  MA1A1: {
    mapEmbedUrl:
      'https://maps.google.com/maps?q=BeWorking+Coworking+Málaga+Calle+Alejandro+Dumas+17&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
};

// Cancellation policy and booking instructions defaults live in i18n now
// (room.defaultCancellationPolicy / room.defaultBookingInstructions). The store
// leaves these fields undefined so consumers resolve via t() in their own locale.

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
    descriptionEn: producto.descriptionEn || '',
    subtitle: producto.subtitle || '',
    subtitleEn: producto.subtitleEn || '',
    amenities: Array.isArray(producto.amenities) ? producto.amenities : [],
    tags: Array.isArray(producto.tags) ? producto.tags : [],
    cancellationPolicy: undefined,
    bookingInstructions: undefined,
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

  // Defensive fallback for misclassified desk products in any zone (MA1O1-N, MA1O5-N…).
  return zoneForProductName(producto?.name ?? producto?.nombre ?? '') != null;
};

/**
 * Build one catalog desk room per coworking zone bookable today. Desks are
 * grouped by zone prefix so a second zone (e.g. the summer A5 pop-up) doesn't
 * inflate the original room's capacity. Each room carries deskPrefix + season
 * bounds so the picker can scope availability and clamp dates. Returns [] when
 * no desk products are present.
 */
export function buildDeskRooms(productos, centroName) {
  const list = Array.isArray(productos) ? productos : [];
  const rooms = [];
  for (const zone of COWORK_ZONES) {
    if (!isZoneActiveToday(zone)) continue;
    const zoneMesas = list.filter((p) => {
      const z = zoneForProductName(p?.name ?? p?.nombre ?? '');
      return z && z.prefix === zone.prefix;
    });
    if (zoneMesas.length === 0) continue;

    const sample = zoneMesas[0];
    const deskRoom = buildRoomFromProducto(
      { ...sample, name: zone.displayName, capacity: zoneMesas.length },
      centroName,
    );
    deskRoom.id = zone.slug;
    deskRoom.slug = zone.slug;
    deskRoom.productName = zone.displayName;
    deskRoom.priceUnit = '/month';
    deskRoom.deskPrefix = zone.prefix;
    deskRoom.seasonStart = zone.activeFrom || null;
    deskRoom.seasonEnd = zone.activeTo || null;
    rooms.push(deskRoom);
  }
  return rooms;
}

export const useCatalogRooms = create((set) => ({
  rooms: [],
  setRooms: (nextRooms) => set({ rooms: nextRooms })
}));
