// Single source of truth for site-wide SEO defaults + business identity (NAP).
//
// Phase 1 uses `siteMeta` (defaults + share image) via the <Seo> component.
// Phase 2 structured-data builders (LocalBusiness / Organization) read `business`.
// Keep `business` in sync with src/data/locations.js — it mirrors the Málaga NAP.

export const SITE_URL = 'https://be-working.com';

export const siteMeta = {
  siteUrl: SITE_URL,
  siteName: 'BeWorking',
  defaultTitle: 'BeWorking — Espacios de trabajo en Málaga',
  defaultDescription:
    'Salas de reuniones, coworking y oficinas virtuales en Málaga. Reserva tu espacio ideal en BeWorking.',
  // Default social share card. Lives in public/.
  defaultShareImage: `${SITE_URL}/BeWorking_optimized.jpg`,
  twitterCard: 'summary_large_image',
};

// Canonical business identity (NAP). Phone matches the public WhatsApp number;
// do not change it without updating locations.js too.
export const business = {
  name: 'BeWorking',
  legalName: 'Beworking Partners Offices SL',
  telephone: '+34 640 369 759',
  email: 'info@be-working.com',
  address: {
    streetAddress: 'Calle Alejandro Dumas 17, Oficinas',
    addressLocality: 'Málaga',
    postalCode: '29004',
    addressRegion: 'Málaga',
    addressCountry: 'ES',
  },
  geo: { latitude: 36.7213, longitude: -4.4214 },
  // ISO-ish opening hours (Mo-Fr 09:00-20:00) for schema.org openingHours.
  openingHours: 'Mo-Fr 09:00-20:00',
  priceRange: '€€',
  sameAs: [
    'https://www.linkedin.com/company/beworking',
    'https://www.instagram.com/beworkingmalaga',
    'https://www.facebook.com/beworkingmalaga/',
    'https://www.youtube.com/@beworking6740',
  ],
};
