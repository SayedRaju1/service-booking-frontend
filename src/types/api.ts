// Common API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
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
  name: string;
  description: string;
  owner: string; // User ID
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
  category: string;
  business: string; // Business ID
  staff: string[]; // Staff IDs
  isActive: boolean;
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

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
