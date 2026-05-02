import axios, { AxiosRequestConfig } from "axios";

import { handleApiError } from "@/lib/api/error-handler";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/api/token";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  withCredentials: true, // send httpOnly refresh-token cookie automatically
});

// ---------------------------------------------------------------------------
// Refresh-token queue
// Requests that arrive while a refresh is in-flight are parked here and
// replayed (or rejected) once the refresh settles.
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
};

// ---------------------------------------------------------------------------
// Request interceptor — attach access token
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — handle 401, refresh, retry
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _noRedirect?: boolean; // skip login redirect on refresh failure (used for bootstrap)
    };

    // Only handle 401s that haven't been retried yet
    if (error.response?.status !== 401 || originalRequest._retry) {
      handleApiError(error);
      return Promise.reject(error);
    }

    // A refresh is already in-flight — queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };
        return api(originalRequest);
      });
    }

    // This request will own the refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post<{ accessToken: string }>(
        "/auth/refresh",
      );

      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();

      // Only bounce to /login if the caller didn't opt out of the redirect
      // (bootstrap calls on public pages set _noRedirect to avoid forcing a redirect)
      if (!originalRequest._noRedirect && typeof window !== "undefined") {
        window.location.href = "/login";
      }

      handleApiError(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
