import apiClient from "./client";
import {
  ApiResponse,
  ServiceCategory,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
} from "@/types/api";

// Service Categories API endpoints
export const serviceCategoriesApi = {
  // Get all service categories with hierarchy
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      "/service-categories"
    );
    return response.data;
  },

  // Get single service category
  getCategoryById: async (
    id: string
  ): Promise<ApiResponse<ServiceCategory>> => {
    const response = await apiClient.get<ApiResponse<ServiceCategory>>(
      `/service-categories/${id}`
    );
    return response.data;
  },

  // Get categories for a specific business
  getCategoriesByBusiness: async (
    businessId: string
  ): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `/service-categories/business/${businessId}`
    );
    return response.data;
  },

  // Create new service category (requires auth)
  createCategory: async (
    data: CreateServiceCategoryRequest
  ): Promise<ApiResponse<ServiceCategory>> => {
    const response = await apiClient.post<ApiResponse<ServiceCategory>>(
      "/service-categories",
      data
    );
    return response.data;
  },

  // Update service category (requires auth)
  updateCategory: async (
    id: string,
    data: UpdateServiceCategoryRequest
  ): Promise<ApiResponse<ServiceCategory>> => {
    const response = await apiClient.put<ApiResponse<ServiceCategory>>(
      `/service-categories/${id}`,
      data
    );
    return response.data;
  },

  // Delete service category (requires auth)
  deleteCategory: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/service-categories/${id}`
    );
    return response.data;
  },
};
