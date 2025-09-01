import apiClient from "./client";
import { ApiResponse } from "../../types/api";

// Admin Analytics Response Types
export interface AdminSystemOverview {
  users: {
    total: number;
    customers: number;
    serviceProviders: number;
    admins: number;
    newThisMonth: number;
  };
  businesses: {
    total: number;
    verified: number;
    pending: number;
    active: number;
    newThisMonth: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    thisMonth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    thisYear: number;
  };
}

export interface AdminTrendData {
  period: string;
  metric: string;
  trends: Array<{
    date: string;
    value: number;
    change: number;
  }>;
  summary: {
    total: number;
    average: number;
    growth: number;
  };
}

export interface AdminRevenueAnalytics {
  period: string;
  totalRevenue: number;
  averageOrderValue: number;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    bookings: number;
  }>;
  topRevenueSources: Array<{
    business: string;
    revenue: number;
    percentage: number;
  }>;
  growthMetrics: {
    monthOverMonth: number;
    yearOverYear: number;
  };
}

export interface AdminUserAnalytics {
  period: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowth: Array<{
    period: string;
    newUsers: number;
    totalUsers: number;
    growthRate: number;
  }>;
  userTypeDistribution: {
    customers: number;
    serviceProviders: number;
    admins: number;
  };
  engagementMetrics: {
    averageSessionDuration: number;
    retentionRate: number;
    churnRate: number;
  };
}

// Admin Bookings Response Types
export interface AdminBooking {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  business: {
    _id: string;
    name: string;
    category: string;
  };
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
  };
  staff?: {
    _id: string;
    name: string;
    email?: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  appointmentDate: string;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  cancellationReason?: string;
}

export interface AdminBookingsResponse {
  bookings: AdminBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Admin Business Response Types
export interface AdminBusiness {
  _id: string;
  name: string;
  description: string;
  category: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  isVerified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  stats: {
    totalServices: number;
    totalStaff: number;
    totalBookings: number;
  };
  verificationNotes?: string;
  verifiedAt?: string;
  deactivationReason?: string;
  deactivatedAt?: string;
  recentServices?: Array<{
    _id: string;
    name: string;
    price: number;
    description?: string;
  }>;
  recentStaff?: Array<{
    _id: string;
    name: string;
    email?: string;
    role?: string;
  }>;
}

export interface AdminBusinessesResponse {
  businesses: AdminBusiness[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VerifyBusinessRequest {
  isVerified: boolean;
  verificationNotes?: string;
}

export interface UpdateBusinessStatusRequest {
  isActive: boolean;
  deactivationReason?: string;
}

// Admin API Functions
export const adminApi = {
  // Get system overview analytics
  getSystemOverview: async (): Promise<ApiResponse<AdminSystemOverview>> => {
    const response = await apiClient.get("/admin/analytics/overview");
    return response.data;
  },

  // Get all system bookings
  getAllBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    business?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<ApiResponse<AdminBookingsResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status && params.status !== "all")
      queryParams.append("status", params.status);
    if (params?.business && params.business !== "all")
      queryParams.append("business", params.business);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.search) queryParams.append("search", params.search);

    const response = await apiClient.get(`/admin/bookings?${queryParams}`);
    return response.data;
  },

  // Get trend data
  getTrendData: async (params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
    metric?: "bookings" | "revenue" | "users" | "businesses";
  }): Promise<ApiResponse<AdminTrendData>> => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.metric) queryParams.append("metric", params.metric);

    const response = await apiClient.get(
      `/admin/analytics/trends?${queryParams}`
    );
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
    business?: string;
  }): Promise<ApiResponse<AdminRevenueAnalytics>> => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.business) queryParams.append("business", params.business);

    const response = await apiClient.get(
      `/admin/analytics/revenue?${queryParams}`
    );
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
    userType?: "all" | "customers" | "serviceProviders" | "admins";
  }): Promise<ApiResponse<AdminUserAnalytics>> => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.userType) queryParams.append("userType", params.userType);

    const response = await apiClient.get(
      `/admin/analytics/users?${queryParams}`
    );
    return response.data;
  },

  // Business Management API Functions
  // Get all businesses with pagination and filtering
  getAllBusinesses: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    verified?: boolean;
    search?: string;
  }): Promise<ApiResponse<AdminBusinessesResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category && params.category !== "all")
      queryParams.append("category", params.category);
    if (params?.status && params.status !== "all")
      queryParams.append("status", params.status);
    if (params?.verified !== undefined)
      queryParams.append("verified", params.verified.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await apiClient.get(`/admin/businesses?${queryParams}`);
    return response.data;
  },

  // Get specific business details
  getBusinessById: async (id: string): Promise<ApiResponse<AdminBusiness>> => {
    const response = await apiClient.get(`/admin/businesses/${id}`);
    return response.data;
  },

  // Verify or reject business
  verifyBusiness: async (
    id: string,
    data: VerifyBusinessRequest
  ): Promise<ApiResponse<AdminBusiness>> => {
    const response = await apiClient.put(
      `/admin/businesses/${id}/verify`,
      data
    );
    return response.data;
  },

  // Update business status (activate/deactivate)
  updateBusinessStatus: async (
    id: string,
    data: UpdateBusinessStatusRequest
  ): Promise<ApiResponse<AdminBusiness>> => {
    const response = await apiClient.put(
      `/admin/businesses/${id}/status`,
      data
    );
    return response.data;
  },
};
