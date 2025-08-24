// Default configuration
const DEFAULT_CONFIG = {
  apiBaseUrl: 'https://kp-floods-2025-backend-production.up.railway.app',
  defaultDateFrom: '2025-08-14',
  defaultDateTo: '2025-08-20',
};

// Environment Variables with fallbacks
const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_CONFIG.apiBaseUrl,
  defaultDateFrom: import.meta.env.VITE_DEFAULT_DATE_FROM || DEFAULT_CONFIG.defaultDateFrom,
  defaultDateTo: import.meta.env.VITE_DEFAULT_DATE_TO || DEFAULT_CONFIG.defaultDateTo,
};

export const BASE_URL = env.apiBaseUrl;
export const DEFAULT_DATE_RANGE = {
  from: env.defaultDateFrom,
  to: env.defaultDateTo,
};

export function qs(params?: Record<string, any>) {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");
  return q ? `?${q}` : "";
}

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    console.log('\n Fetching:', `${BASE_URL}${path}`);
    const r = await fetch(`${BASE_URL}${path}`, {
      headers: { 
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
      ...init,
    });

    const data = await r.json().catch(() => null);
    
    if (!r.ok) {
      throw new APIError(r.status, r.statusText, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Internal Error', error);
  }
}