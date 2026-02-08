import { requestJson } from './client.js';

const buildQueryString = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

export const fetchBloqueos = (params = {}, options = {}) =>
  requestJson(`/bloqueos${buildQueryString(params)}`, options);

export const fetchPublicAvailability = (params = {}, options = {}) => {
  const search = new URLSearchParams();
  if (params.date) {
    search.set('date', params.date);
  }
  if (Array.isArray(params.products)) {
    params.products.forEach((product) => {
      if (product) {
        search.append('products', product);
      }
    });
  }
  if (Array.isArray(params.centers)) {
    params.centers.forEach((center) => {
      if (center) {
        search.append('centers', center);
      }
    });
  }
  const query = search.toString();
  return requestJson(`/public/availability${query ? `?${query}` : ''}`, options);
};

export const createReserva = (payload, options = {}) =>
  requestJson('/bookings', {
    method: 'POST',
    body: payload,
    ...options
  });

export const updateBloqueo = (bloqueoId, payload, options = {}) =>
  requestJson(`/bloqueos/${bloqueoId}`, {
    method: 'PUT',
    body: payload,
    ...options
  });

export const fetchBookingContacts = (params = {}, options = {}) =>
  requestJson(`/bookings/lookups/contacts${buildQueryString(params)}`, options);

export const fetchBookingCentros = (params = {}, options = {}) =>
  requestJson(`/public/centros${buildQueryString(params)}`, options);

export const fetchBookingProductos = (params = {}, options = {}) =>
  requestJson(`/public/productos${buildQueryString(params)}`, options);

export const createPublicBooking = (payload, options = {}) =>
  requestJson('/public/bookings', {
    method: 'POST',
    body: payload,
    ...options
  });
