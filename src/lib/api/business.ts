import apiClient from "./client";
import { ApiResponse, Business, PaginatedResponse } from "@/types/api";

// Business API endpoints
export const businessApi = {
  // Get all businesses with pagination and filters
  getBusinesses: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<PaginatedResponse<Business>>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Business>>
    >("/businesses", { params });
    return response.data;
  },

  // Get business by ID
  getBusinessById: async (id: string): Promise<ApiResponse<Business>> => {
    const response = await apiClient.get<ApiResponse<Business>>(
      `/businesses/${id}`
    );
    return response.data;
  },

  // Get businesses by category
  getBusinessesByCategory: async (
    category: string,
    params?: {
      page?: number;
      limit?: number;
      location?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<ApiResponse<PaginatedResponse<Business>>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Business>>
    >(`/businesses/category/${category}`, { params });
    return response.data;
  },

  // Search businesses
  searchBusinesses: async (
    query: string,
    params?: {
      page?: number;
      limit?: number;
      category?: string;
      location?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<ApiResponse<PaginatedResponse<Business>>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Business>>
    >("/businesses/search", { params: { q: query, ...params } });
    return response.data;
  },

  // Get popular businesses
  getPopularBusinesses: async (params?: {
    limit?: number;
    category?: string;
    location?: string;
  }): Promise<ApiResponse<Business[]>> => {
    const response = await apiClient.get<ApiResponse<Business[]>>(
      "/businesses/popular",
      { params }
    );
    return response.data;
  },
};
