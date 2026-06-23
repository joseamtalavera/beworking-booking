// Coworking desk zones (mirror of the backend com.beworking.bookings.CoworkZone).
// A zone is a block of individually-bookable desks whose product names share a
// prefix (MA1O1-1..16). Each zone is one catalog room + one Akiles door, with an
// optional active window. Keep this in sync with the backend registry.

export const COWORK_ZONES = [
  {
    prefix: 'MA1O1',
    slug: 'ma1-desks',
    displayName: 'MA1 Desks',
    deskCount: 16,
    activeFrom: null,
    activeTo: null,
    // Meeting-room code this zone takes over (hidden from the catalog while the
    // zone is active). The permanent zone takes over nothing.
    sourceAula: null,
  },
  {
    // Summer pop-up: Sala MA1A5 -> 14 desks, Jul–Aug 2026. Reuses the A5 door.
    prefix: 'MA1O5',
    slug: 'ma1a5-desks',
    displayName: 'MA1A5 Coworking',
    deskCount: 14,
    activeFrom: '2026-07-01',
    activeTo: '2026-08-31',
    sourceAula: 'MA1A5',
  },
];

const todayIso = () => new Date().toISOString().split('T')[0];

/** True iff the zone is bookable today (within its active window). */
export const isZoneActiveToday = (zone) => {
  if (!zone) return false;
  const today = todayIso();
  if (zone.activeFrom && today < zone.activeFrom) return false;
  if (zone.activeTo && today > zone.activeTo) return false;
  return true;
};

const normalize = (name = '') => name.trim().toUpperCase().replace(/[\s_-]+/g, '');

/** The zone a desk product name belongs to (e.g. "MA1O5-7" -> the A5 zone), or null. */
export const zoneForProductName = (name) => {
  const n = normalize(name);
  return COWORK_ZONES.find((z) => new RegExp(`^${z.prefix}\\d{1,2}$`).test(n)) || null;
};

/** The zone for a catalog room slug (e.g. "ma1a5-desks"), or null. */
export const zoneForSlug = (slug) => {
  const s = (slug || '').toLowerCase();
  return COWORK_ZONES.find((z) => z.slug === s) || null;
};

/** Meeting-room codes that are hidden from the catalog today (converted to cowork). */
export const hiddenAulasToday = () =>
  COWORK_ZONES.filter((z) => z.sourceAula && isZoneActiveToday(z)).map((z) => z.sourceAula.toUpperCase());
