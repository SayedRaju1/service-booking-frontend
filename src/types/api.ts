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

// Service Category types
export interface ServiceCategory {
  _id: string;
  name: string;
  description?: string;
  parent?: string; // Parent category ID
  business?: string; // Business ID if category is business-specific
  isActive: boolean;
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

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
