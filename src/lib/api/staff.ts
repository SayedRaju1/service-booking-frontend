import apiClient from "./client";
import {
  ApiResponse,
  Staff,
  StaffWithAvailability,
  AvailableStaffResponse,
  StaffTimeSlotsResponse,
  StaffAvailability,
} from "@/types/api";

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "staff" | "manager" | "admin";
  specialties?: string[]; // Service IDs they can perform
  business: string; // Business ID
  isActive: boolean;
  avatar?: string;
  bio?: string;
  experience?: number; // Years of experience
  rating?: number;
  totalBookings?: number;
  availability?: {
    [key: string]: {
      // Day of week (monday, tuesday, etc.)
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  phone?: string;
  role?: "staff" | "manager" | "admin";
  specialties?: string[];
  business: string;
  bio?: string;
  experience?: number;
  availability?: {
    [key: string]: {
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    };
  };
}

export interface UpdateStaffRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: "staff" | "manager" | "admin";
  specialties?: string[];
  bio?: string;
  experience?: number;
  isActive?: boolean;
  availability?: {
    [key: string]: {
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    };
  };
}

export interface StaffFilters {
  business?: string;
  role?: string;
  isActive?: boolean;
  specialty?: string;
  page?: number;
  limit?: number;
}

export const staffApi = {
  // Get all staff for a business
  getBusinessStaff: async (
    businessId: string,
    filters?: StaffFilters
  ): Promise<ApiResponse<Staff[]>> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.specialty) params.append("specialty", filters.specialty);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get(
      `/businesses/${businessId}/staff?${params.toString()}`
    );
    return response.data;
  },

  // Get staff by ID
  getStaffById: async (staffId: string): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.get(`/staff/${staffId}`);
    return response.data;
  },

  // Create new staff member
  createStaff: async (
    data: CreateStaffRequest
  ): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.post("/staff", data);
    return response.data;
  },

  // Update staff member
  updateStaff: async (
    staffId: string,
    data: UpdateStaffRequest
  ): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.put(`/staff/${staffId}`, data);
    return response.data;
  },

  // Delete staff member
  deleteStaff: async (staffId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/staff/${staffId}`);
    return response.data;
  },

  // Get staff availability for a specific date
  getStaffAvailability: async (
    staffId: string,
    date: string
  ): Promise<ApiResponse<StaffAvailability>> => {
    const response = await apiClient.get(
      `/staff/${staffId}/availability?date=${date}`
    );
    return response.data;
  },

  // Get all availability for a staff member
  getStaffAllAvailability: async (
    staffId: string
  ): Promise<ApiResponse<StaffAvailability[]>> => {
    const response = await apiClient.get(`/staff/${staffId}/all-availability`);
    return response.data;
  },

  // Get available staff for a service on a specific date
  getAvailableStaffForService: async (
    serviceId: string,
    date: string
  ): Promise<ApiResponse<AvailableStaffResponse>> => {
    const response = await apiClient.get(
      `/services/${serviceId}/available-staff?date=${date}`
    );
    return response.data;
  },

  // Get time slots for a specific staff member on a specific date
  getStaffTimeSlots: async (
    staffId: string,
    date: string,
    serviceId: string
  ): Promise<ApiResponse<StaffTimeSlotsResponse>> => {
    const response = await apiClient.get(
      `/staff/${staffId}/time-slots?date=${date}&serviceId=${serviceId}`
    );
    return response.data;
  },

  // Check staff availability for a specific time period
  checkStaffAvailability: async (
    staffId: string,
    serviceId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<boolean>> => {
    const params = new URLSearchParams({
      staffId,
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
  createStaffAvailability: async (data: {
    staff: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    breakStart?: string;
    breakEnd?: string;
    maxBookingsPerDay?: number;
  }): Promise<ApiResponse<StaffAvailability>> => {
    const response = await apiClient.post("/staff-availability", data);
    return response.data;
  },

  // Update staff availability
  updateStaffAvailability: async (
    availabilityId: string,
    data: {
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
      breakStart?: string;
      breakEnd?: string;
      maxBookingsPerDay?: number;
    }
  ): Promise<ApiResponse<StaffAvailability>> => {
    const response = await apiClient.put(
      `/staff-availability/${availabilityId}`,
      data
    );
    return response.data;
  },

  // Update staff availability (legacy method - keeping for backward compatibility)
  updateStaffAvailabilityLegacy: async (
    staffId: string,
    availability: any
  ): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.put(`/staff/${staffId}/availability`, {
      availability,
    });
    return response.data;
  },
};
