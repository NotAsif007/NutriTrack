import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_HOST
    ? `https://${import.meta.env.VITE_API_HOST}/api/v1`
    : "/api/v1");

export const DEMO_TOKEN_KEY = "nutritrack_demo_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const demoToken = window.localStorage.getItem(DEMO_TOKEN_KEY);
    if (demoToken) {
      config.headers.Authorization = `Bearer ${demoToken}`;
    }
  }
  return config;
});

// Keep the UI in sync when a browser drops the cross-site session cookie.
// AuthContext listens for this event and ProtectedRoute redirects to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutritrack:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
}
