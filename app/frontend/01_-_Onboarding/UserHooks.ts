/** Authoritative user profile + task summary from GET /api/users/me. */
import { useEffect, useState } from "react";
import { useAuth } from "@shared/auth";
import type { TaskCounts, UserMe } from "@shared/types";

export function useUserSession() {
  const { user: cached, loadUser } = useAuth();
  const [user, setUser] = useState<UserMe | null>(cached);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadUser()
      .then((u) => alive && setUser(u))
      .catch((e) => alive && setError((e as Error).message))
      .finally(() => alive && setIsLoading(false));
    return () => {
      alive = false;
    };
  }, [loadUser]);

  const tasks: TaskCounts | null = user ? user.taskSummary : null;
  return {
    user: user
      ? { firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl, role: user.role, secondaryRole: user.secondaryRole, locale: user.locale, timezone: user.timezone }
      : null,
    tasks,
    isLoading,
    error,
  };
}
