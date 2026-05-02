"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { AuthService } from "@/lib/features/auth/api/auth.service";
import { useAuthStore } from "@/lib/features/auth/store";

/**
 * Bootstraps the app on page load.
 * 
 * It calls /auth/me EXACTLY ONCE per browser session.
 * Because we don't have an access token in memory on hard reload, this request
 * will hit a 401 from the server.
 * The Axios interceptor will catch it, automatically use the httpOnly refresh
 * cookie to get a new access token, store it, and retry the /auth/me request!
 * 
 * - Uses _noRedirect so a failed refresh doesn't bounce the user to /login
 *   on public pages (they're just not logged in)
 * - Sets hasBootstrapped after the call settles regardless of outcome
 */
export function AuthInitializer() {
  const { setUser, clearAuth, setBootstrapped, hasBootstrapped } =
    useAuthStore();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["auth", "bootstrap"],
    queryFn: () => AuthService.getMe({ noRedirect: true }),
    enabled: !hasBootstrapped, // fire once; never again after first settle
    staleTime: Infinity,       // keep this result forever — don't auto-refetch
    retry: false,
  });

  // Populate store on success
  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data, setUser]);

  // Clean store on failure (user not logged in or session expired)
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  // Mark bootstrap as done so this never fires again
  useEffect(() => {
    if (isSuccess || isError) {
      setBootstrapped();
    }
  }, [isSuccess, isError, setBootstrapped]);

  return null;
}
