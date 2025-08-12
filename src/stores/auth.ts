import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "service_provider" | "admin";
  isVerified: boolean;
  profilePicture?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void; // Fixed: now expects user and token
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Fixed: login now only handles state management, not API calls
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Store token in localStorage for API calls
        if (typeof window !== "undefined") {
          localStorage.setItem("service-booking-token", token);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Clear token from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("service-booking-token");
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });

        // Store token in localStorage for API calls
        if (typeof window !== "undefined") {
          localStorage.setItem("service-booking-token", token);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
