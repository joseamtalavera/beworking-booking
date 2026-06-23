// Coworking desk zones (mirror of the backend com.beworking.bookings.CoworkZone).
// A zone is a block of individually-bookable desks whose product names share a
// prefix (MA1O1-1..16). Each zone is its own catalog room + floor plan + Akiles
// door, with an optional bookable-date window. Capacity/image/price come from
// THIS config (not by sniffing the productos list) so a zone's card can never
// silently disappear. Keep in sync with the backend registry.

export const COWORK_ZONES = [
  {
    prefix: 'MA1O1',
    slug: 'ma1-desks',
    shortLabel: 'Coworking 1',
    displayName: 'MA1 Desks',
    deskCount: 16,
    priceFrom: 90,
    heroImage: 'https://app.be-working.com/img/MA1A5-0-featured-20240501123909.jpg',
    // Bookable-date window; null = always bookable.
    activeFrom: null,
    activeTo: null,
  },
  {
    // Summer pop-up: Sala MA1A5 -> 14 desks. Sellable now (pre-booking); the
    // picker clamps selectable dates to 2026-07-01 .. 2026-08-31. Reuses the
    // MA1A5 Akiles door. The A5 meeting room still renders as usual — its
    // calendar is blocked for the window by a DB bloqueo (V93), not by hiding.
    prefix: 'MA1O5',
    slug: 'ma1a5-desks',
    shortLabel: 'Coworking 2',
    displayName: 'MA1A5 Coworking',
    deskCount: 14,
    priceFrom: 90,
    heroImage: 'https://app.be-working.com/img/MA1A5-0-featured-20240501123909.jpg',
    activeFrom: '2026-07-01',
    activeTo: '2026-08-31',
  },
];

const todayIso = () => new Date().toISOString().split('T')[0];

/**
 * Zones are PERMANENT fixtures and always visible. Bookability is governed
 * separately by the date window [activeFrom, activeTo] (the picker clamps to it);
 * outside that window the zone renders but is blocked.
 */
export const isZoneActiveToday = (zone) => Boolean(zone);

/** True iff the zone can be booked for some date as of today (window not over). */
export const isZoneBookableToday = (zone) => {
  if (!zone) return false;
  if (zone.activeTo && todayIso() > zone.activeTo) return false;
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
