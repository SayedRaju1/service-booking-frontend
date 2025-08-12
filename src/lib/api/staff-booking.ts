import apiClient from "./client";
import {
  ApiResponse,
  AvailableStaffResponse,
  StaffTimeSlotsResponse,
  CreateBookingRequest,
} from "@/types/api";

/**
 * Staff-Based Booking API
 * Handles all operations related to staff-based booking system
 */
export const staffBookingApi = {
  /**
   * Get available staff for a specific service on a specific date
   * This is the first step in the booking flow
   */
  getAvailableStaffForService: async (
    serviceId: string,
    date: string
  ): Promise<ApiResponse<AvailableStaffResponse>> => {
    const response = await apiClient.get(
      `/services/${serviceId}/available-staff?date=${date}`
    );
    return response.data;
  },

  /**
   * Get available time slots for a specific staff member on a specific date
   * This is used after staff selection to show available time slots
   */
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

  /**
   * Check if a specific time slot is available for a staff member
   * Used for real-time availability checking
   */
  checkTimeSlotAvailability: async (
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

  /**
   * Create a new staff-based booking
   * This is the final step in the booking flow
   */
  createStaffBasedBooking: async (
    data: CreateBookingRequest
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },

  /**
   * Get staff availability for a specific date
   * Used to show staff working hours and breaks
   */
  getStaffAvailability: async (
    staffId: string,
    date: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(
      `/staff/${staffId}/availability?date=${date}`
    );
    return response.data;
  },

  /**
   * Get all availability for a staff member
   * Used for staff profile pages or admin views
   */
  getStaffAllAvailability: async (
    staffId: string
  ): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/staff/${staffId}/all-availability`);
    return response.data;
  },

  /**
   * Validate booking request before submission
   * Used for client-side validation
   */
  validateBookingRequest: async (data: {
    serviceId: string;
    businessId: string;
    staffId: string;
    appointmentDate: string;
  }): Promise<ApiResponse<{ valid: boolean; errors?: string[] }>> => {
    const response = await apiClient.post("/bookings/validate", data);
    return response.data;
  },
};
