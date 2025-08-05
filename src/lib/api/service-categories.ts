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

  // Get all services under a category (including subcategories)
  getCategoryServices: async (
    categoryId: string,
    params?: {
      page?: number;
      limit?: number;
      business?: string;
      featured?: boolean;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<
    ApiResponse<{
      services: Service[];
      category: ServiceCategory;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      filters: {
        categoryIds: string[];
        business: string | null;
        featured: boolean;
        minPrice: number | null;
        maxPrice: number | null;
      };
    }>
  > => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.business) queryParams.append("business", params.business);
    if (params?.featured !== undefined)
      queryParams.append("featured", params.featured.toString());
    if (params?.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await apiClient.get<
      ApiResponse<{
        services: Service[];
        category: ServiceCategory;
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
        filters: {
          categoryIds: string[];
          business: string | null;
          featured: boolean;
          minPrice: number | null;
          maxPrice: number | null;
        };
      }>
    >(`/service-categories/${categoryId}/services?${queryParams.toString()}`);

    return response.data;
  },
};
