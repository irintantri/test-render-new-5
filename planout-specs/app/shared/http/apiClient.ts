/**
 * Typed fetch wrapper — the ONLY fetch surface the frontend uses.
 * Base URL comes from VITE_API_BASE_URL (empty in dev → same-origin → Vite proxy).
 */
import type { ErrorEnvelope } from "../errors";

const BASE_URL: string = (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? "";
const TOKEN_KEY = "consent-iq.token";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: Partial<ErrorEnvelope>,
  ) {
    super(message);
  }
}

export interface ApiResult<T> {
  status: number;
  data: T;
}

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

async function request<T>(method: string, path: string, body?: unknown, init: RequestInit = {}): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  const token = tokenStore.get();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }
  const res = await fetch(apiUrl(path), { ...init, method, headers, body: payload });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const env = (data ?? {}) as Partial<ErrorEnvelope>;
    throw new ApiError(env.message || env.error || `Request failed (${res.status})`, res.status, env);
  }
  return { status: res.status, data: data as T };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>("GET", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("POST", path, body, init),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("PATCH", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("PUT", path, body, init),
  delete: <T>(path: string, init?: RequestInit) => request<T>("DELETE", path, undefined, init),
};

/** Build a query string, skipping empty values. */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== null && v !== "" && p.set(k, String(v)));
  const s = p.toString();
  return s ? `?${s}` : "";
}
