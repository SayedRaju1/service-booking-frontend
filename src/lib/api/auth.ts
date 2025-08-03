import apiClient from "./client";
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/types/api";

// Authentication API endpoints
export const authApi = {
  // Register new user
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/auth/profile",
      data
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(
      "/auth/change-password",
      data
    );
    return response.data;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/logout"
    );
    return response.data;
  },
};
