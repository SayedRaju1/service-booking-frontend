// Common API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Specific response types for different endpoints
export interface ServiceResponse {
  service: Service;
}

export interface BusinessResponse {
  business: Business;
}

export interface BusinessServicesResponse {
  services: Service[];
  businessId: string;
}

// Service Provider Dashboard Response Types
export interface MyBusinessResponse {
  business: Business;
}

export interface MyBusinessServicesResponse {
  services: Service[];
}

export interface BusinessStaffResponse {
  staff: Staff[];
}

export interface BusinessBookingsResponse {
  bookings: PopulatedBooking[];
  pagination: PaginationMeta;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "service_provider" | "admin";
  isVerified: boolean;
  profilePicture?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Business types
export interface Business {
  _id: string;
  id?: string; // Some APIs return both _id and id
  name: string;
  description: string;
  owner: string | { _id: string; name: string }; // Can be string ID or populated object
  category:
    | "salon"
    | "dental"
    | "beauty"
    | "spa"
    | "consulting"
    | "fitness"
    | "medical"
    | "other";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency?: string;
  category:
    | string
    | {
        _id: string;
        name: string;
        description?: string;
        icon?: string;
        color?: string;
      };
  business:
    | string
    | {
        _id: string;
        id?: string;
        name: string;
        description?: string;
        address?: {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
        };
        contact?: {
          phone: string;
          email: string;
          website?: string;
        };
        rating?: number;
        totalReviews?: number;
        averageRating?: number;
      };
  staff?: string[]; // Staff IDs
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
  requirements?: string[];
  cancellationPolicy?: string;
  maxBookingsPerDay?: number;
  bufferTime?: number;
  rating?: number;
  reviewCount?: number;
  durationFormatted?: string;
  priceFormatted?: string;
  totalTime?: number;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  _id: string;
  customer: string; // User ID
  business: string; // Business ID
  service: string; // Service ID
  staff?: string; // Staff ID
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Populated booking interface for getMyBookings endpoint
export interface PopulatedBooking {
  _id: string;
  customer: string; // User ID
  business: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    contact: {
      phone: string;
      email: string;
      website?: string;
    };
  };
  service: {
    _id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    currency: string;
  };
  staff?: {
    _id: string;
    name: string;
    position: string;
  };
  appointmentDate: string;
  duration: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking creation response (matches actual backend structure)
export interface BookingCreationResponse {
  success: boolean;
  message: string;
  data: {
    booking: {
      _id: string;
      customer: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        fullName: string;
        id: string;
      };
      service: {
        _id: string;
        name: string;
        description: string;
        duration: number;
        price: number;
        currency: string;
        durationFormatted: string;
        priceFormatted: string;
        totalTime: number | null;
        id: string;
      };
      business: {
        address: {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
        };
        contact: {
          phone: string;
          email: string;
          website: string;
        };
        _id: string;
        name: string;
        fullAddress: string;
        averageRating: number;
        id: string;
      };
      staff: {
        _id: string;
        name: string;
        position: string;
      };
      appointmentDate: string;
      duration: number;
      totalPrice: number;
      currency: string;
      status: string;
      paymentStatus: string;
      notes: string;
      reminderSent: boolean;
      createdAt: string;
      updatedAt: string;
      appointmentEndDate: string;
      appointmentDateFormatted: string;
      totalPriceFormatted: string;
      timeUntilAppointment: number;
      isUpcoming: boolean;
      isPast: boolean;
      id: string;
    };
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "customer" | "service_provider" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Service Category types
export interface ServiceCategory {
  _id: string;
  name: string;
  description?: string;
  parent?: string; // Parent category ID
  business?: string; // Business ID if category is business-specific
  isActive: boolean;
  subcategories?: ServiceCategory[]; // Subcategories (populated by API)
  color?: string; // Category color for UI
  createdAt: string;
  updatedAt: string;
}

// Service Category Request types
export interface CreateServiceCategoryRequest {
  name: string;
  description?: string;
  parent?: string;
  business?: string;
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  description?: string;
  parent?: string;
  business?: string;
  isActive?: boolean;
}

// Service Request types
export interface CreateServiceRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  business: string;
  staff?: string[];
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  staff?: string[];
  isActive?: boolean;
}

// Staff Availability types
export interface StaffAvailability {
  _id: string;
  staff: string;
  dayOfWeek: string; // "monday", "tuesday", etc.
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
  breakStart?: string; // "12:00"
  breakEnd?: string; // "13:00"
  maxBookingsPerDay?: number;
  createdAt: string;
  updatedAt: string;
}

// Base Staff interface
export interface Staff {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  profileImage?: string;
  isActive?: boolean;
  experience?: number;
  rating?: number;
  specialties?: string[];
  hourlyRate?: number;
  commissionRate?: number;
  business?: string; // Business ID
  performance?: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    completedServices: number;
    cancelledServices: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Time Slot types
export interface TimeSlot {
  start: string; // ISO date string
  end: string; // ISO date string
  available: boolean;
  duration: number; // in minutes
  startTime: string; // "10:00" (formatted time)
  endTime: string; // "11:15" (formatted time)
}

// Enhanced Staff interface with availability
export interface StaffWithAvailability extends Staff {
  availability?: StaffAvailability; // Changed from StaffAvailability[] to StaffAvailability
  existingBookings?: number;
  maxBookingsPerDay?: number;
  specialties?: string[];
  rating?: number;
  profileImage?: string;
  position?: string;
}

// Available Staff Response
export interface AvailableStaffResponse {
  service: Service;
  availableStaff: StaffWithAvailability[];
  selectedDate: string;
  dayOfWeek: string;
}

// Staff Time Slots Response
export interface StaffTimeSlotsResponse {
  staff: Staff;
  service: Service;
  availability: {
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
  };
  timeSlots: TimeSlot[];
  selectedDate: string;
  dayOfWeek: string;
}

// Updated Create Booking Request (now requires staffId)
export interface CreateBookingRequest {
  serviceId: string;
  businessId: string;
  staffId: string; // Now required
  appointmentDate: string; // Full ISO date string
  notes?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
