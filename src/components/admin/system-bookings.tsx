"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Eye,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { adminApi, AdminBooking } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";

// Use the AdminBooking interface from the API
type SystemBooking = AdminBooking;

export function SystemBookings() {
  // State declarations first
  const [selectedBooking, setSelectedBooking] = useState<SystemBooking | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    business: "all",
    dateRange: "all",
  });

  // Fetch real data from backend API
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["adminBookings", filters],
    queryFn: () =>
      adminApi.getAllBookings({
        page: 1,
        limit: 50, // Get more bookings for better statistics
        status: filters.status === "all" ? undefined : filters.status,
        business: filters.business === "all" ? undefined : filters.business,
        search: filters.search || undefined,
      }),
  });

  // Fetch unfiltered data for statistics (always shows total counts)
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminBookingsStats"],
    queryFn: () =>
      adminApi.getAllBookings({
        page: 1,
        limit: 1000, // Get all bookings for accurate statistics
      }),
  });

  const bookings = useMemo(
    () => bookingsData?.data?.bookings || [],
    [bookingsData?.data?.bookings]
  );
  const pagination = bookingsData?.data?.pagination;

  // Use unfiltered data for statistics
  const statsBookings = useMemo(
    () => statsData?.data?.bookings || [],
    [statsData?.data?.bookings]
  );

  // Filter bookings based on current filters using useMemo to prevent infinite loops
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (filters.search) {
      filtered = filtered.filter(
        (booking) =>
          booking.customer.name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          booking.customer.email
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          booking.business.name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          booking.service.name
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === filters.status
      );
    }

    if (filters.business !== "all") {
      filtered = filtered.filter(
        (booking) => booking.business._id === filters.business
      );
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filters.dateRange) {
        case "today":
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.appointmentDate);
            return (
              bookingDate >= today &&
              bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
            );
          });
          break;
        case "week":
          const weekFromNow = new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.appointmentDate);
            return bookingDate >= today && bookingDate < weekFromNow;
          });
          break;
        case "month":
          const monthFromNow = new Date(
            today.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.appointmentDate);
            return bookingDate >= today && bookingDate < monthFromNow;
          });
          break;
      }
    }

    return filtered;
  }, [bookings, filters]);

  const getStatusBadge = (status: string) => {
    const badgeVariants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={badgeVariants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const viewBooking = (booking: SystemBooking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: statsData?.data?.pagination?.total || 0,
    pending: statsBookings.filter((b) => b.status === "pending").length,
    confirmed: statsBookings.filter((b) => b.status === "confirmed").length,
    completed: statsBookings.filter((b) => b.status === "completed").length,
    cancelled: statsBookings.filter((b) => b.status === "cancelled").length,
    revenue: statsBookings.reduce((sum, b) => sum + b.service.price, 0),
    today: statsBookings.filter((b) => {
      const today = new Date();
      const bookingDate = new Date(b.appointmentDate);
      return bookingDate.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all system-wide bookings
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats.today}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                ${stats.revenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter bookings by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Input
                placeholder="Search bookings..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.business}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, business: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Businesses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                {Array.from(new Set(bookings.map((b) => b.business._id))).map(
                  (businessId) => {
                    const business = bookings.find(
                      (b) => b.business._id === businessId
                    )?.business;
                    return business ? (
                      <SelectItem key={businessId} value={businessId}>
                        {business.name}
                      </SelectItem>
                    ) : null;
                  }
                )}
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading..."
              : `${pagination?.total || 0} bookings found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer.name} • {booking.business.name}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(booking.appointmentDate)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {booking.staff?.name || "No staff assigned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">
                        ${booking.service.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewBooking(booking)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Detailed information about this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium mb-2">Service Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Service:</span>{" "}
                    {selectedBooking.service.name}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> $
                    {selectedBooking.service.price}
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span> $
                    {selectedBooking.service.price}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedBooking.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedBooking.customer.email}
                  </p>
                  {selectedBooking.customer.phone && (
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedBooking.customer.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="font-medium mb-2">Business Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Business:</span>{" "}
                    {selectedBooking.business.name}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {selectedBooking.business.category}
                  </p>
                </div>
              </div>

              {/* Staff Info */}
              {selectedBooking.staff && (
                <div>
                  <h3 className="font-medium mb-2">Staff Information</h3>
                  <div className="grid gap-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedBooking.staff.name}
                    </p>
                    {selectedBooking.staff.email && (
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedBooking.staff.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Appointment Info */}
              <div>
                <h3 className="font-medium mb-2">Appointment Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Date & Time:</span>{" "}
                    {formatDate(selectedBooking.appointmentDate)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(selectedBooking.status)}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedBooking.createdAt)}
                  </p>
                  {selectedBooking.notes && (
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {selectedBooking.notes}
                    </p>
                  )}
                  {selectedBooking.cancellationReason && (
                    <p>
                      <span className="font-medium">Cancellation Reason:</span>{" "}
                      {selectedBooking.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
