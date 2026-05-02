/**
 * In-memory access token store.
 *
 * Intentionally NOT stored in localStorage/sessionStorage to protect against
 * XSS attacks. The refresh token lives in an httpOnly cookie handled by the
 * server; only the short-lived access token lives here.
 */
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};
