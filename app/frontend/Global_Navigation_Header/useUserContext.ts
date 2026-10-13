import { useEffect, useState } from "react";
import { API } from "./apiService";

export interface UserProfile {
  name: string | null;
  role: string | null;
  avatarInitials: string | null;
  unreadNotifications: number;
}

export function useUserContext() {
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: null, role: null, avatarInitials: null, unreadNotifications: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    API.fetchUserContext()
      .then((data) => {
        if (!alive) return;
        setUserProfile({
          name: data.fullName || "User Name",
          role: data.role || "ICF Author",
          avatarInitials: data.initials,
          unreadNotifications: data.taskCounts,
        });
      })
      .catch(() => alive && setError("Failed to load user context"))
      .finally(() => alive && setIsLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { userProfile, isLoading, error };
}
