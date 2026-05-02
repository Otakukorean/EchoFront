"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { setAccessToken } from "@/lib/api/token";

import { AuthService } from "../api/auth.service";
import { useAuthStore } from "../store";
import type { LoginPayload, RegisterPayload } from "../types";

// ---------------------------------------------------------------------------
// useMe
// Only fires the /auth/me request when isAuthenticated is true.
// Syncs the returned user into the Zustand store.
// ---------------------------------------------------------------------------
export function useMe(isAuthenticated = true) {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => AuthService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}

// ---------------------------------------------------------------------------
// useRegister
// ---------------------------------------------------------------------------
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
    onSuccess: () => {
      toast.success("Account created!", {
        description: "Please check your email to confirm your account.",
      });
      router.push("/login");
    },
  });
}

// ---------------------------------------------------------------------------
// useLogin
// 1. Stores the access token in memory (if the API returns one)
// 2. Marks the user as authenticated in Zustand
// 3. Redirects to the home page
// ---------------------------------------------------------------------------
export function useLogin() {
  const router = useRouter();
  const { setAuthenticated, setUser, setBootstrapped } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthService.login(payload),
    onSuccess: async (data) => {
      // Store access token in memory for the axios interceptor
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }

      // Immediately fetch the user and populate the store
      const user = await AuthService.getMe();
      setUser(user);

      // Mark bootstrap done — AuthInitializer won't fire again
      setBootstrapped();
      setAuthenticated(true);

      toast.success("Welcome back!");
      router.push("/");
    },
  });
}

// ---------------------------------------------------------------------------
// useLogout
// ---------------------------------------------------------------------------
export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      clearAuth();
      toast.success("Signed out successfully.");
      router.push("/login");
    },
  });
}
