const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://testa1000-7-back-cu.hf.space";
const CLIENT_ID_STORAGE_KEY = "cu_business_trainer_client_id";

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
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.sessionStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (existing) return existing;

  const created = crypto.randomUUID();
  window.sessionStorage.setItem(CLIENT_ID_STORAGE_KEY, created);
  return created;
}

export function withQuery(path, params) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  if (!query) {
    return path;
  }

  return `${path}?${query}`;
}

export function isApiConfigured() {
  return Boolean(API_BASE);
}
