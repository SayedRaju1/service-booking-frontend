import apiClient from "./client";
import {
  ApiResponse,
  Service,
  PaginationMeta,
  MyBusinessServicesResponse,
  StaffAvailability,
} from "@/types/api";

export const servicesApi = {
  // Get all services with filtering and pagination
  getServices: async (filters?: {
    page?: number;
    limit?: number;
    business?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<
    ApiResponse<{ services: Service[]; pagination: PaginationMeta }>
  > => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.business) params.append("business", filters.business);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await apiClient.get(`/services?${params.toString()}`);
    return response.data;
  },

  // Get service by ID
  getService: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // Get my business services (for service providers)
  getMyBusinessServices: async (): Promise<
    ApiResponse<MyBusinessServicesResponse>
  > => {
    const response = await apiClient.get("/services/my/business");
    return response.data;
  },

  // Create new service
  createService: async (
    data: Partial<Service>
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post("/services", data);
    return response.data;
  },

  // Update service
  updateService: async (
    id: string,
    data: Partial<Service>
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.put(`/services/${id}`, data);
    return response.data;
  },

  // Delete service
  deleteService: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },

  // Search services
  searchServices: async (
    query: string
  ): Promise<ApiResponse<{ services: Service[] }>> => {
    const response = await apiClient.get(
      `/services/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get services by business
  getServicesByBusiness: async (
    businessId: string
  ): Promise<ApiResponse<{ services: Service[] }>> => {
    const response = await apiClient.get(`/services/business/${businessId}`);
    return response.data;
  },

  // Get available staff for a service
  getAvailableStaffForService: async (
    serviceId: string,
    date: string
  ): Promise<
    ApiResponse<{
      service: { _id: string; name: string; duration: number; price: number };
      availableStaff: Array<{
        _id: string;
        name: string;
        position: string;
        profileImage?: string;
        availability: StaffAvailability;
        existingBookings: number;
        maxBookingsPerDay: number;
      }>;
      selectedDate: string;
      dayOfWeek: string;
    }>
  > => {
    const response = await apiClient.get(
      `/services/${serviceId}/available-staff?date=${date}`
    );
    return response.data;
  },
};
