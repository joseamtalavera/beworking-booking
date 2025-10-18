import { apiRequest } from './client.js';

export const fetchCurrentUser = (options = {}) => apiRequest('/auth/me', options);
