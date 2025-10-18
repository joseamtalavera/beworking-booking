import { apiRequest } from './client.js';

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
  apiRequest(`/bloqueos${buildQueryString(params)}`, options);

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
  return apiRequest(`/public/availability${query ? `?${query}` : ''}`, options);
};

export const createReserva = (payload, options = {}) =>
  apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options
  });

export const updateBloqueo = (bloqueoId, payload, options = {}) =>
  apiRequest(`/bloqueos/${bloqueoId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...options
  });

export const fetchBookingContacts = (params = {}, options = {}) =>
  apiRequest(`/bookings/lookups/contacts${buildQueryString(params)}`, options);

export const fetchBookingCentros = (params = {}, options = {}) =>
  apiRequest(`/bookings/lookups/centros${buildQueryString(params)}`, options);

export const fetchBookingProductos = (params = {}, options = {}) =>
  apiRequest(`/bookings/lookups/productos${buildQueryString(params)}`, options);
