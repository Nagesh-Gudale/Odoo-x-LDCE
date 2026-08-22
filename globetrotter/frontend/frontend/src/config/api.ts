const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export interface ApiErrorShape {
  error?: string;
  message?: string;
}

function getStoredToken(): string | null {
  return localStorage.getItem('globetrotter_token') ?? sessionStorage.getItem('globetrotter_token');
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set('Content-Type', 'application/json');

  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  const rawText = await response.text();
  let data: unknown = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('globetrotter_token');
      sessionStorage.removeItem('globetrotter_token');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      window.location.assign('/login');
    }

    const payload = (data as ApiErrorShape) ?? {};
    const message = payload.error ?? payload.message ?? 'Request failed.';
    throw new Error(message);
  }

  return (data as T) ?? ({} as T);
}
