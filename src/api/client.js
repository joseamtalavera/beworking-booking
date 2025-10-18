const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api');

const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'beworking_token';

export const getStoredToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to read auth token from storage', error);
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to persist auth token', error);
  }
};

const ensureLeadingSlash = (path = '') => (path.startsWith('/') ? path : `/${path}`);

export const resolveApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL || '';
  }
  return `${API_BASE_URL}${ensureLeadingSlash(path)}`;
};

const extractErrorMessage = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const data = await response.json();
      if (typeof data === 'object' && data !== null) {
        return data.message || data.error || JSON.stringify(data);
      }
      if (typeof data === 'string') {
        return data;
      }
    } catch (error) {
      console.error('Failed to parse error response as JSON', error);
    }
  }

  try {
    const text = await response.text();
    if (text) return text;
  } catch (error) {
    console.error('Failed to read error response body', error);
  }

  return response.statusText || 'Request failed';
};

const parseResponse = async (response, mode) => {
  if (mode === 'raw') return response;
  if (mode === 'blob') return response.blob();
  if (mode === 'text') return response.text();

  if (response.status === 204) return null;
  return response.json();
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    headers,
    body,
    credentials = 'include',
    parse: parseMode = 'json',
    signal
  } = options;

  const requestInit = {
    method,
    credentials,
    headers: new Headers(headers || {}),
    signal
  };

  if (!requestInit.headers.has('Authorization')) {
    const token = typeof window !== 'undefined' ? getStoredToken() : null;
    if (token) {
      requestInit.headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      requestInit.body = body;
    } else if (typeof Blob !== 'undefined' && body instanceof Blob) {
      requestInit.body = body;
    } else if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
      requestInit.body = body;
    } else if (
      typeof body === 'string' ||
      body instanceof ArrayBuffer ||
      ArrayBuffer.isView(body)
    ) {
      requestInit.body = body;
    } else {
      requestInit.headers.set('Content-Type', 'application/json');
      requestInit.body = JSON.stringify(body);
    }
  }

  const response = await fetch(resolveApiUrl(path), requestInit);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return parseResponse(response, parseMode);
};
