/**
 * Tests for Staff Booking API Integration
 * This file tests the new staff-based booking system APIs
 */

import { staffBookingApi } from "../staff-booking";
import { staffApi } from "../staff";
import { bookingsApi } from "../bookings";
import apiClient from "../client";

// Mock the API client
jest.mock("../client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Staff Booking API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvailableStaffForService", () => {
    it("should call the correct endpoint with service ID and date", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            service: { _id: "service1", name: "Hair Cut" },
            availableStaff: [],
            selectedDate: "2024-01-15",
            dayOfWeek: "monday",
          },
        },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await staffBookingApi.getAvailableStaffForService(
        "service1",
        "2024-01-15"
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        "/services/service1/available-staff?date=2024-01-15"
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getStaffTimeSlots", () => {
    it("should call the correct endpoint with staff ID, date, and service ID", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            staff: { _id: "staff1", name: "John Doe" },
            service: { _id: "service1", name: "Hair Cut" },
            availability: { startTime: "09:00", endTime: "17:00" },
            timeSlots: [],
            selectedDate: "2024-01-15",
            dayOfWeek: "monday",
          },
        },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await staffBookingApi.getStaffTimeSlots(
        "staff1",
        "2024-01-15",
        "service1"
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        "/staff/staff1/time-slots?date=2024-01-15&serviceId=service1"
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createStaffBasedBooking", () => {
    it("should call the correct endpoint with booking data", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "booking1", status: "pending" },
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const bookingData = {
        serviceId: "service1",
        businessId: "business1",
        staffId: "staff1",
        appointmentDate: "2024-01-15T10:00:00.000Z",
        notes: "Test booking",
      };

      const result = await staffBookingApi.createStaffBasedBooking(bookingData);

      expect(apiClient.post).toHaveBeenCalledWith("/bookings", bookingData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe("Staff API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStaffAvailability", () => {
    it("should call the correct endpoint with staff ID and date", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "availability1",
            staff: "staff1",
            dayOfWeek: "monday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
        },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await staffApi.getStaffAvailability(
        "staff1",
        "2024-01-15"
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        "/staff/staff1/availability?date=2024-01-15"
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe("Bookings API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createStaffBasedBooking", () => {
    it("should call the correct endpoint with staff-based booking data", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { _id: "booking1", status: "pending" },
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const bookingData = {
        serviceId: "service1",
        businessId: "business1",
        staffId: "staff1",
        appointmentDate: "2024-01-15T10:00:00.000Z",
        notes: "Test booking",
      };

      const result = await bookingsApi.createStaffBasedBooking(bookingData);

      expect(apiClient.post).toHaveBeenCalledWith("/bookings", bookingData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
