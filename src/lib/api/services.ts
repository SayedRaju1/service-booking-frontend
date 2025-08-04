import apiClient from "./client";
import {
  ApiResponse,
  Service,
  PaginatedResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
  BusinessServicesResponse,
} from "@/types/api";

// Services API endpoints
export const servicesApi = {
  // Get all services with filtering and pagination
  getServices: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    businessId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Service>>
    >("/services", { params });
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<ApiResponse<ServiceResponse>> => {
    const response = await apiClient.get<ApiResponse<ServiceResponse>>(
      `/services/${id}`
    );
    return response.data;
  },

  // Search services
  searchServices: async (
    query: string,
    params?: {
      page?: number;
      limit?: number;
      category?: string;
      businessId?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Service>>
    >("/services/search", { params: { q: query, ...params } });
    return response.data;
  },

  // Get services by business
  getServicesByBusiness: async (
    businessId: string,
    params?: {
      page?: number;
      limit?: number;
      category?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<ApiResponse<BusinessServicesResponse>> => {
    const response = await apiClient.get<ApiResponse<BusinessServicesResponse>>(
      `/services/business/${businessId}`,
      { params }
    );
    return response.data;
  },

  // Get my business services (requires auth)
  getMyBusinessServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>(
      "/services/my/business"
    );
    return response.data;
  },

  // Create new service (requires auth)
  createService: async (
    data: CreateServiceRequest
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post<ApiResponse<Service>>(
      "/services",
      data
    );
    return response.data;
  },

  // Update service (requires auth)
  updateService: async (
    id: string,
    data: UpdateServiceRequest
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.put<ApiResponse<Service>>(
      `/services/${id}`,
      data
    );
    return response.data;
  },

  // Delete service (requires auth)
  deleteService: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/services/${id}`
    );
    return response.data;
  },
};
