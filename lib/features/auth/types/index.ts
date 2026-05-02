/**
 * Auth types — aligned with the actual API contracts
 */

// ---------------------------------------------------------------------------
// Session (returned inside User from /auth/me)
// ---------------------------------------------------------------------------
export interface Session {
  id: string;
  expiresAt: string;
  revokedAt: string | null;
  createdByIp: string;
  userAgent: string;
  isActive: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// User entity (/auth/me)
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  emailConfirmed: boolean;
  role: string;
  storeId: string | null;
  sessions: Session[];
}

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

/** POST /auth/login  */
export interface LoginResponse {
  accessToken?: string;
}

/** POST /auth/register */
export interface RegisterResponse {
  isSuccess: boolean;
}

/** GET /auth/me */
export interface MeResponse {
  user: User;
}
