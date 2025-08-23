// Export all API modules
export { default as apiClient } from "./client";
export { authApi } from "./auth";
export { businessApi } from "./business";
export { bookingsApi } from "./bookings";
export { servicesApi } from "./services";
export { serviceCategoriesApi } from "./service-categories";
export { staffApi } from "./staff";
export { staffBookingApi } from "./staff-booking";
export { adminApi } from "./admin";

// Export types
export type {
  ApiResponse,
  Service,
  Business,
  Booking,
  Staff,
  StaffWithAvailability,
  StaffAvailability,
  TimeSlot,
  AvailableStaffResponse,
  StaffTimeSlotsResponse,
  CreateBookingRequest,
  ServiceCategory,
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/api";
