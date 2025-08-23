// src/lib/auth.ts
import { LOGIN_URL } from "./env";

export type LoginResult =
  | { ok: true; token?: string }
  | { ok: false; message: string; status?: number };

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    console.log('Attempting login to:', LOGIN_URL);
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      credentials: "include", // allow httpOnly session cookies if server sets them
      body: JSON.stringify({ username, password }),
    });
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    // If the backend returns a cookie-only session, res.ok is enough.
    if (res.ok && res.status >= 200 && res.status < 300) {
      let token: string | undefined;
      try {
        const data = await res.clone().json().catch(() => null);
        token =
          data?.access_token ??
          data?.accessToken ??
          data?.token ??
          (typeof data === "string" ? data : undefined);
      } catch { /* ignore parse errors */ }
      return { ok: true, token };
    }

    // Extract server error
    const errTxt = await res.text().catch(() => "");
    console.log('Error response:', { status: res.status, text: errTxt });
    return { ok: false, status: res.status, message: errTxt || "Login failed" };
  } catch (e: any) {
    return { ok: false, message: e?.message || "Network error" };
  }
}