"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { BookingSuccess } from "@/components/booking/booking-success";
import { bookingsApi } from "@/lib/api/bookings";
import { Loader2, AlertCircle } from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const error = searchParams.get("error");

  // Fetch booking details
  const {
    data: bookingData,
    isLoading: isLoadingBooking,
    error: bookingError,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => {
      if (!bookingId) throw new Error("No booking ID");
      return bookingsApi.getBookingById(bookingId);
    },
    enabled: !!bookingId,
  });

  // Show error if no booking ID or error parameter
  if (error === "no-booking-id" || !bookingId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Error
            </h2>
            <p className="text-gray-600 mb-4">
              {error === "no-booking-id"
                ? "The booking was created but we couldn't retrieve the details."
                : "No booking ID provided."}
            </p>
            <p className="text-sm text-gray-500">
              Please check your email for confirmation or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Booking Details...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch your booking information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (bookingError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Booking
            </h2>
            <p className="text-gray-600 mb-4">
              {bookingError?.message || "Failed to load booking details."}
            </p>
            <p className="text-sm text-gray-500">
              Please check your booking ID or try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success page with real data
  if (bookingData?.data?.booking) {
    const booking = bookingData.data.booking;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <BookingSuccess
              booking={{
                _id: booking._id,
                appointmentDate: booking.appointmentDate,
                appointmentTime: new Date(
                  booking.appointmentDate
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
                totalAmount: booking.totalPrice,
                notes: booking.notes,
              }}
              service={{
                name: booking.service.name,
                duration: booking.service.duration,
              }}
              business={{
                name: booking.business.name,
                address: booking.business.address,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback for no data
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600">
            The booking details could not be found. Please check your booking
            ID.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we load the page.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
