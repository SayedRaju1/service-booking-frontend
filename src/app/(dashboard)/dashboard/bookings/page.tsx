"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { PopulatedBooking } from "@/types/api";
import { formatDistanceToNow, format, parseISO } from "date-fns";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface BookingFilters {
  status: BookingStatus | "all";
  dateRange: "upcoming" | "past" | "all";
}

export default function CustomerBookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>({
    status: "all",
    dateRange: "all",
  });

  // Fetch customer's bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: () => bookingsApi.getMyBookings(),
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDateRangeBadge = (dateRange: string) => {
    const now = new Date();
    const config = {
      upcoming: { color: "bg-blue-100 text-blue-800", text: "Upcoming" },
      past: { color: "bg-gray-100 text-gray-800", text: "Past" },
      all: { color: "bg-purple-100 text-purple-800", text: "All" },
    };

    return (
      <Badge
        className={
          config[dateRange as keyof typeof config]?.color || config.all.color
        }
      >
        {config[dateRange as keyof typeof config]?.text || config.all.text}
      </Badge>
    );
  };

  const filterBookings = () => {
    if (!bookingsData?.data?.bookings) return [];

    let filtered = [...bookingsData.data.bookings];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === filters.status
      );
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange === "upcoming") {
      filtered = filtered.filter(
        (booking) => new Date(booking.appointmentDate) > now
      );
    } else if (filters.dateRange === "past") {
      filtered = filtered.filter(
        (booking) => new Date(booking.appointmentDate) <= now
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const filteredBookings = filterBookings();

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        // TODO: Implement cancel booking API call
        console.log("Cancelling booking:", bookingId);
        // await bookingsApi.cancelBooking(bookingId);
        refetchBookings();
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  const handleRescheduleBooking = async (bookingId: string) => {
    // TODO: Implement reschedule booking functionality
    console.log("Rescheduling booking:", bookingId);
  };

  if (isLoadingBookings) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading your bookings...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (bookingsError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error loading bookings</p>
              <p className="text-gray-600 text-sm mb-4">
                {bookingsError instanceof Error
                  ? bookingsError.message
                  : "Unknown error occurred"}
              </p>
              <Button onClick={() => refetchBookings()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage your appointments and view booking history
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value as BookingStatus | "all",
                    })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: e.target.value as "upcoming" | "past" | "all",
                    })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bookings ({filteredBookings.length})</span>
              <Button
                onClick={() => refetchBookings()}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No bookings found</p>
                <p className="text-gray-500 text-sm">
                  {filters.status !== "all" || filters.dateRange !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't made any bookings yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.service.name}
                          </h3>
                          {getStatusBadge(booking.status)}
                          {getDateRangeBadge(
                            new Date(booking.appointmentDate) > new Date()
                              ? "upcoming"
                              : "past"
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{booking.business.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{booking.staff.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(parseISO(booking.appointmentDate), "PPP")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(parseISO(booking.appointmentDate), "p")} (
                              {booking.duration} min)
                            </span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span>{" "}
                            {booking.notes}
                          </div>
                        )}

                        <div className="mt-3 text-sm text-gray-500">
                          Booked{" "}
                          {formatDistanceToNow(parseISO(booking.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <div className="text-right">
                          <div className="font-semibold text-lg text-gray-900">
                            ${booking.totalPrice}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.currency}
                          </div>
                        </div>

                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRescheduleBooking(booking._id)
                              }
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRescheduleBooking(booking._id)
                              }
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
