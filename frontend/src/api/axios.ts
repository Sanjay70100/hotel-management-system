import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add the authentication token to API requests when available.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hotel_access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API errors consistently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired token if unauthorized
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("hotel_access_token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;