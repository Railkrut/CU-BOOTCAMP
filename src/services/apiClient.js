const API_BASE = "https://testa1000-7-back-cu.hf.space/import.meta.env.VITE_API_BASE_URL" || "http://localhost:8000";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api(path, init = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, text || "API request failed");
  }

  return response.json();
}

export function getStableClientId() {
  const storageKey = "client_id";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const created = crypto.randomUUID();
  localStorage.setItem(storageKey, created);
  return created;
}

export function isApiConfigured() {
  return Boolean(API_BASE);
}
