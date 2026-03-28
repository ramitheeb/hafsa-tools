const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface AuthStatus {
  setup: boolean;
  authenticated: boolean;
}

export const api = {
  getAuthStatus: () => request<AuthStatus>('/auth/status'),
  setup: (password: string) => request<{ ok: boolean }>('/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  login: (password: string) => request<{ ok: boolean }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
};
