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

export const cancelBloqueo = (bloqueoId, options = {}) =>
  requestJson(`/bloqueos/${bloqueoId}/cancel`, {
    method: 'DELETE',
    ...options
  });

export const fetchBookingUsage = (email, productName, options = {}) =>
  requestJson(`/public/booking-usage?email=${encodeURIComponent(email)}&productName=${encodeURIComponent(productName)}`, options);

/**
 * Fetch desk availability for a given date range.
 * Returns bloqueos for desk products (MA1O1-1 through MA1O1-N)
 * for the specified range so the UI can mark desks as booked.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {object} [params]
 * @param {number} [params.deskCount=16] — number of desks to query (from room.capacity).
 * @param {object} [params.requestOptions] — passed through to requestJson.
 */
export const fetchDeskAvailability = async (startDate, endDate, params = {}) => {
  const { deskCount = 16, requestOptions = {} } = params;
  const products = [];
  for (let i = 1; i <= deskCount; i += 1) {
    products.push(`MA1O1-${i}`);
  }

  const search = new URLSearchParams();
  search.set('date', startDate);
  if (endDate) {
    search.set('dateTo', endDate);
  }
  products.forEach((p) => search.append('products', p));
  search.append('centers', 'MA1');

  const query = search.toString();
  return requestJson(`/public/availability${query ? `?${query}` : ''}`, requestOptions);
};
