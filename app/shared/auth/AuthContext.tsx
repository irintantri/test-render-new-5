/**
 * Auth context: holds the session token and the authoritative user profile
 * (GET /api/users/me). Wraps the client root; protected routes use <RequireAuth>.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiClient, tokenStore } from "../http";
import type { UserMe } from "../types";
import { ROUTES } from "../lib/routes";

interface AuthState {
  token: string | null;
  user: UserMe | null;
  /** Demo sign-in: obtains a session token from the server. */
  signIn: () => Promise<string>;
  signOut: () => void;
  /** GET /api/users/me — stores and returns the profile; throws on 401. */
  loadUser: () => Promise<UserMe>;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [user, setUser] = useState<UserMe | null>(null);

  const signIn = useCallback(async () => {
    const { data } = await apiClient.post<{ token: string }>("/api/auth/session");
    tokenStore.set(data.token);
    setToken(data.token);
    return data.token;
  }, []);

  const signOut = useCallback(() => {
    tokenStore.set(null);
    setToken(null);
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    const { data } = await apiClient.get<UserMe>("/api/users/me");
    setUser(data);
    return data;
  }, []);

  const value = useMemo(() => ({ token, user, signIn, signOut, loadUser }), [token, user, signIn, signOut, loadUser]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Redirects to the sign-in screen when there is no session token. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to={ROUTES.signIn} replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
