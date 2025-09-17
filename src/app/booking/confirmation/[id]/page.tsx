"use client";

import { BookingConfirmation } from "@/components/booking/booking-confirmation";

export default function BookingConfirmationPage() {
  // Mock data for the booking confirmation
  const mockService = {
    _id: "mock-service-id",
    name: "Sample Service",
    description: "This is a sample service",
    price: 50,
    duration: 60,
    business: "mock-business-id",
    category: "mock-category-id",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockStaff = {
    _id: "mock-staff-id",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    position: "Service Provider",
    specialization: "General Services",
    hourlyRate: 25,
    bio: "Experienced service provider",
    services: ["mock-service-id"],
    business: "mock-business-id",
    isActive: true,
    availability: {
      _id: "mock-availability-id",
      staff: "mock-staff-id",
      dayOfWeek: "monday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
      breakStart: "12:00",
      breakEnd: "13:00",
      maxBookingsPerDay: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    performance: {
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
      completedServices: 0,
      cancelledServices: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTimeSlot = {
    start: new Date().toISOString(),
    end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    available: true,
    duration: 60,
    startTime: "10:00",
    endTime: "11:00",
  };

  const handleConfirm = async (notes?: string) => {
    console.log("Booking confirmed with notes:", notes);
  };

  const handleEdit = (step: "service" | "staff" | "date" | "time") => {
    console.log("Edit step:", step);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingConfirmation
          service={mockService}
          staff={mockStaff}
          selectedDate={new Date().toISOString().split("T")[0]}
          timeSlot={mockTimeSlot}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          isLoading={false}
          error={null}
        />
      </div>
    </div>
  );
}
