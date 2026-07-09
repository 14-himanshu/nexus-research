export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${API_BASE}${path}`, options);
}
