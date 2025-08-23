// src/lib/env.ts
export const API_BASE = import.meta.env.VITE_API_BASE ?? "https://kp-floods-2025-backend-production.up.railway.app";
export const DASHBOARD_PATH = import.meta.env.VITE_DASHBOARD_PATH ?? "/dashboard";
export const LOGIN_URL = `${API_BASE}/auth/log-in`;