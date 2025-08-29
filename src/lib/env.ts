// src/lib/env.ts
// Centralized, typed access to client-safe env vars
export const env = Object.freeze({
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ?? '',
  // add other NON-SECRET VITE_* keys here as needed
});

// Helper for safe debug without leaking values
export function debugEnvPresence() {
  if (env.DEV) {
    // dev: show actual string for easier debugging
    console.info('Environment variables check:');
    console.info('VITE_API_BASE_URL present:', Boolean(env.API_BASE_URL));
    console.info('VITE_OPENAI_API_KEY present:', Boolean(env.OPENAI_API_KEY));
    console.info('All VITE_ env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
  } else {
    // prod: never print actual values
    console.info('VITE vars present:', {
      VITE_API_BASE_URL: Boolean(env.API_BASE_URL),
      VITE_OPENAI_API_KEY: Boolean(env.OPENAI_API_KEY),
    });
  }
}

// Legacy exports for backward compatibility
export const API_BASE = env.API_BASE_URL || "https://kp-floods-2025-mongo-backend-production.up.railway.app";
export const DASHBOARD_PATH = import.meta.env.VITE_DASHBOARD_PATH ?? "/dashboard";
export const LOGIN_URL = `${API_BASE}/auth/log-in`;