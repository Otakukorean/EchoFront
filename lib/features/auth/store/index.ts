import { create } from "zustand";

import type { User } from "../types";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  /** True once the initial /auth/me bootstrap has settled (success or error). */
  hasBootstrapped: boolean;
  /** True while the initial bootstrap is in progress. */
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Actions shape
// ---------------------------------------------------------------------------
interface AuthActions {
  setUser: (user: User) => void;
  setAuthenticated: (value: boolean) => void;
  setAccessToken: (token: string) => void;
  setBootstrapped: () => void;
  setIsLoading: (value: boolean) => void;
  clearAuth: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  accessToken: null,
  hasBootstrapped: false,
  isLoading: true, // starts loading to prevent flashes of unauthenticated content

  // Set user and mark as authenticated in one shot
  setUser: (user) => set({ user, isAuthenticated: true }),

  // Flip the authenticated flag without changing the user
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // Store the access token reactively so hooks can react to its presence
  setAccessToken: (token) => set({ accessToken: token }),

  // Mark bootstrap as done — prevents further /me calls from AuthInitializer
  setBootstrapped: () => set({ hasBootstrapped: true, isLoading: false }),

  // Set loading state explicitly
  setIsLoading: (isLoading) => set({ isLoading }),

  // Full reset on logout — clear token and user, keep hasBootstrapped true
  clearAuth: () => set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false }),
}));
