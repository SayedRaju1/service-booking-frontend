import axios, { AxiosInstance, AxiosResponse } from "axios";
import { config } from "../config";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (we'll implement proper token management later)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("service-booking-token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("service-booking-token");
        // We'll implement proper redirect logic later
      }
    }

    // Handle network errors
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      error.message =
        "Unable to connect to the server. Please check if the backend is running.";
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      error.message = "Request timed out. Please try again.";
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      error.message = "Resource not found.";
    }

    // Handle 500 errors
    if (error.response?.status >= 500) {
      error.message = "Server error. Please try again later.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
