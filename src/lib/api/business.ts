import apiClient from "./client";
import {
  ApiResponse,
  Business,
  PaginationMeta,
  MyBusinessResponse,
} from "@/types/api";

export const businessApi = {
  // Get all businesses with filtering and pagination
  getBusinesses: async (filters?: {
    page?: number;
    limit?: number;
    category?: string;
    city?: string;
    state?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<
    ApiResponse<{ businesses: Business[]; pagination: PaginationMeta }>
  > => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.category) params.append("category", filters.category);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.state) params.append("state", filters.state);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await apiClient.get(`/businesses?${params.toString()}`);
    return response.data;
  },

  // Get business by ID
  getBusiness: async (id: string): Promise<ApiResponse<Business>> => {
    const response = await apiClient.get(`/businesses/${id}`);
    return response.data;
  },

  // Get my business (for service providers)
  getMyBusiness: async (): Promise<ApiResponse<MyBusinessResponse>> => {
    const response = await apiClient.get("/businesses/my/business");
    return response.data;
  },

  // Create new business
  createBusiness: async (
    data: Partial<Business>
  ): Promise<ApiResponse<Business>> => {
    const response = await apiClient.post("/businesses", data);
    return response.data;
  },

  // Update business
  updateBusiness: async (
    id: string,
    data: Partial<Business>
  ): Promise<ApiResponse<Business>> => {
    const response = await apiClient.put(`/businesses/${id}`, data);
    return response.data;
  },

  // Delete business
  deleteBusiness: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/businesses/${id}`);
    return response.data;
  },

  // Search businesses
  searchBusinesses: async (
    query: string
  ): Promise<ApiResponse<{ businesses: Business[] }>> => {
    const response = await apiClient.get(
      `/businesses/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get businesses by category
  getBusinessesByCategory: async (
    category: string
  ): Promise<ApiResponse<{ businesses: Business[] }>> => {
    const response = await apiClient.get(`/businesses/category/${category}`);
    return response.data;
  },
};
