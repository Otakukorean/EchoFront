import api from "@/lib/api/client";
import { clearAccessToken } from "@/lib/api/token";

import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../types";

export class AuthService {
  /**
   * POST /auth/register
   * Body: { registerDto: { email, password, displayName } }
   * Response: { isSuccess: boolean }
   */
  static async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/register", {
      registerDto: payload,
    });
    return data;
  }

  /**
   * POST /auth/login
   * Body: { loginDto: { email, password } }
   * Access token is set via httpOnly cookie by the server.
   */
  static async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      loginDto: payload,
    });
    return data;
  }

  /**
   * POST /auth/logout
   * Clears in-memory token; server invalidates the refresh cookie.
   */
  static async logout(): Promise<void> {
    await api.post("/auth/logout");
    clearAccessToken();
  }

  /**
   * GET /auth/me
   * Response: { user: User }
   */
  static async getMe(options?: { noRedirect?: boolean }): Promise<User> {
    const { data } = await api.get<MeResponse>("/auth/me", {
      _noRedirect: options?.noRedirect,
    } as object);
    return data.user;
  }
}
