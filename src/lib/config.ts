// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  
  // Authentication
  auth: {
    tokenKey: 'service-booking-token',
    refreshTokenKey: 'service-booking-refresh-token',
  },
  
  // App Configuration
  app: {
    name: 'Service Booking System',
    description: 'A comprehensive booking management system for service-based businesses',
    version: '1.0.0',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },
} as const;

// Type-safe environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const; 