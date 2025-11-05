const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api')).replace(/\/$/, '');

const normalisePath = (path = '') => {
  const cleaned = path.replace(/^\/+/, '');
  return cleaned ? `${API_BASE_URL}/${cleaned}` : API_BASE_URL;
};

export const requestJson = async (path, options = {}) => {
  const { method = 'GET', headers = {}, body, credentials = 'include', signal } = options;

  const init = {
    method,
    credentials,
    headers: new Headers(headers),
    signal
  };

  if (body !== undefined) {
    if (body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams) {
      init.body = body;
    } else if (typeof body === 'string' || body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      init.body = body;
    } else {
      init.headers.set('Content-Type', 'application/json');
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(normalisePath(path), init);

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || response.statusText || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};
