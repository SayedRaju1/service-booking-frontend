import apiClient from "./client";
import {
  ApiResponse,
  Staff,
  PaginationMeta,
  BusinessStaffResponse,
} from "@/types/api";

export const staffApi = {
  // Get all staff with filtering and pagination
  getStaff: async (filters?: {
    page?: number;
    limit?: number;
    business?: string;
    position?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<{ staff: Staff[]; pagination: PaginationMeta }>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.business) params.append("business", filters.business);
    if (filters?.position) params.append("position", filters.position);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await apiClient.get(`/staff?${params.toString()}`);
    return response.data;
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data;
  },

  // Get business staff (for service providers)
  getBusinessStaff: async (
    businessId: string
  ): Promise<ApiResponse<BusinessStaffResponse>> => {
    const response = await apiClient.get(`/staff/business/${businessId}`);
    return response.data;
  },

  // Create new staff member
  createStaff: async (data: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.post("/staff", data);
    return response.data;
  },

  // Update staff member
  updateStaff: async (
    id: string,
    data: Partial<Staff>
  ): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.put(`/staff/${id}`, data);
    return response.data;
  },

  // Delete staff member
  deleteStaff: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/staff/${id}`);
    return response.data;
  },

  // Get available staff for a service
  getAvailableStaff: async (
    businessId: string,
    serviceId: string,
    appointmentDate: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({
      businessId,
      serviceId,
      appointmentDate,
    });
    const response = await apiClient.get(
      `/staff/available?${params.toString()}`
    );
    return response.data;
  },

  // Get staff performance
  getStaffPerformance: async (
    staffId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get(
      `/staff/${staffId}/performance?${params.toString()}`
    );
    return response.data;
  },

  // Update staff availability
  updateStaffAvailability: async (
    staffId: string,
    data: any
  ): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.put(
      `/staff/${staffId}/availability`,
      data
    );
    return response.data;
  },

  // Get staff availability for a specific date
  getStaffAvailability: async (
    staffId: string,
    date: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(
      `/staff/${staffId}/availability?date=${date}`
    );
    return response.data;
  },

  // Get all staff availability
  getStaffAllAvailability: async (
    staffId: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/staff/${staffId}/all-availability`);
    return response.data;
  },

  // Get staff time slots
  getStaffTimeSlots: async (
    staffId: string,
    date: string,
    serviceId: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({
      date,
      serviceId,
    });
    const response = await apiClient.get(
      `/staff/${staffId}/time-slots?${params.toString()}`
    );
    return response.data;
  },

  // Check staff availability
  checkStaffAvailability: async (
    businessId: string,
    serviceId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({
      businessId,
      serviceId,
      startDate,
      endDate,
    });
    const response = await apiClient.get(
      `/staff/check-availability?${params.toString()}`
    );
    return response.data;
  },

  // Create staff availability
  createStaffAvailability: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/staff-availability", data);
    return response.data;
  },

  // Update staff availability
  updateStaffAvailabilityById: async (
    availabilityId: string,
    data: any
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(
      `/staff-availability/${availabilityId}`,
      data
    );
    return response.data;
  },
};
