import apiClient from "./client";
import {
  ApiResponse,
  Booking,
  CreateBookingRequest as NewCreateBookingRequest,
} from "@/types/api";

// Legacy interface for backward compatibility
export interface CreateBookingRequest {
  service: string;
  business: string;
  staff?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

// New staff-based booking interface
export interface CreateStaffBasedBookingRequest {
  serviceId: string;
  businessId: string;
  staffId: string; // Now required
  appointmentDate: string; // Full ISO date string
  notes?: string;
}

export interface UpdateBookingRequest {
  appointmentDate?: string;
  appointmentTime?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  notes?: string;
}

export interface BookingFilters {
  status?: string;
  date?: string;
  business?: string;
  service?: string;
  staff?: string; // Add staff filter
  page?: number;
  limit?: number;
}

export const bookingsApi = {
  // Create a new booking (legacy method - keeping for backward compatibility)
  createBooking: async (
    data: CreateBookingRequest
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },

  // Create a new staff-based booking (new method)
  createStaffBasedBooking: async (
    data: CreateStaffBasedBookingRequest
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (
    filters?: BookingFilters
  ): Promise<ApiResponse<Booking[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.date) params.append("date", filters.date);
    if (filters?.business) params.append("business", filters.business);
    if (filters?.service) params.append("service", filters.service);
    if (filters?.staff) params.append("staff", filters.staff);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (
    id: string,
    data: UpdateBookingRequest
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.put(`/bookings/${id}`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get business bookings (for business owners)
  getBusinessBookings: async (
    businessId: string,
    filters?: BookingFilters
  ): Promise<ApiResponse<Booking[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.date) params.append("date", filters.date);
    if (filters?.service) params.append("service", filters.service);
    if (filters?.staff) params.append("staff", filters.staff);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get(
      `/businesses/${businessId}/bookings?${params.toString()}`
    );
    return response.data;
  },

  // Get staff bookings
  getStaffBookings: async (
    staffId: string,
    filters?: Omit<BookingFilters, "staff">
  ): Promise<ApiResponse<Booking[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.date) params.append("date", filters.date);
    if (filters?.business) params.append("business", filters.business);
    if (filters?.service) params.append("service", filters.service);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get(
      `/staff/${staffId}/bookings?${params.toString()}`
    );
    return response.data;
  },

  // Check booking availability for a specific staff member
  checkStaffBookingAvailability: async (
    staffId: string,
    serviceId: string,
    date: string,
    time: string
  ): Promise<ApiResponse<{ available: boolean; conflictReason?: string }>> => {
    const response = await apiClient.get(
      `/bookings/check-availability?staffId=${staffId}&serviceId=${serviceId}&date=${date}&time=${time}`
    );
    return response.data;
  },
};
