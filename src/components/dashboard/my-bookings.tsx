"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { bookingsApi } from "@/lib/api/bookings";
import { PopulatedBooking } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingFilters {
  status: string | "all";
  startDate: string;
  endDate: string;
}

export function MyBookings() {
  // const { user } = useAuthStore();
  const [filters, setFilters] = useState<BookingFilters>({
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [selectedBooking, setSelectedBooking] =
    useState<PopulatedBooking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: ({
      id,
      cancellationReason,
    }: {
      id: string;
      cancellationReason?: string;
    }) => bookingsApi.cancelBooking(id, { cancellationReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      toast.success("Booking cancelled successfully!");
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "no_show":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "no_show":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleFilterChange = (field: keyof BookingFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Debounced filter update to prevent excessive API calls
  const handleDateFilterChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Debounce date filter changes to prevent excessive API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [filters]);

  // Use debounced filters for the API query
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myBookings", debouncedFilters],
    queryFn: () =>
      bookingsApi.getMyBookings({
        status:
          debouncedFilters.status === "all"
            ? undefined
            : debouncedFilters.status,
        page: 1,
        limit: 1000, // Get more data for better client-side filtering
      }),
    enabled: true, // Always enabled, debouncing is handled by the query key
  });

  // Extract data from queries - use the same dataset for consistency
  const allBookingsFromApi = bookingsData?.data?.bookings || [];
  // const pagination = bookingsData?.data?.pagination;
  // Use the same dataset for statistics to ensure consistency
  const allBookings = allBookingsFromApi;

  // Apply client-side date filtering since getMyBookings doesn't support date filters
  const bookings = allBookingsFromApi.filter((booking: PopulatedBooking) => {
    if (!debouncedFilters.startDate && !debouncedFilters.endDate) {
      return true;
    }

    try {
      const bookingDate = new Date(booking.appointmentDate);
      if (isNaN(bookingDate.getTime())) {
        return false; // Invalid date
      }

      // Set time to start of day for start date comparison
      const startDate = debouncedFilters.startDate
        ? new Date(debouncedFilters.startDate + "T00:00:00.000Z")
        : null;

      // Set time to end of day for end date comparison
      const endDate = debouncedFilters.endDate
        ? new Date(debouncedFilters.endDate + "T23:59:59.999Z")
        : null;

      if (startDate && bookingDate < startDate) {
        return false;
      }
      if (endDate && bookingDate > endDate) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error filtering booking by date:", error);
      return false;
    }
  });

  // Apply client-side date filtering to statistics as well
  const filteredAllBookings = allBookings.filter(
    (booking: PopulatedBooking) => {
      if (!debouncedFilters.startDate && !debouncedFilters.endDate) {
        return true;
      }

      try {
        const bookingDate = new Date(booking.appointmentDate);
        if (isNaN(bookingDate.getTime())) {
          return false; // Invalid date
        }

        // Set time to start of day for start date comparison
        const startDate = debouncedFilters.startDate
          ? new Date(debouncedFilters.startDate + "T00:00:00.000Z")
          : null;

        // Set time to end of day for end date comparison
        const endDate = debouncedFilters.endDate
          ? new Date(debouncedFilters.endDate + "T23:59:59.999Z")
          : null;

        if (startDate && bookingDate < startDate) {
          return false;
        }
        if (endDate && bookingDate > endDate) {
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error filtering booking by date for statistics:", error);
        return false;
      }
    }
  );

  // Calculate statistics from filtered data
  const totalBookings = filteredAllBookings.length;
  const pendingBookings = filteredAllBookings.filter(
    (b: PopulatedBooking) => b.status === "pending"
  ).length;
  const confirmedBookings = filteredAllBookings.filter(
    (b: PopulatedBooking) => b.status === "confirmed"
  ).length;
  const completedBookings = filteredAllBookings.filter(
    (b: PopulatedBooking) => b.status === "completed"
  ).length;
  const cancelledBookings = filteredAllBookings.filter(
    (b: PopulatedBooking) => b.status === "cancelled"
  ).length;

  // Use the same loading state for statistics
  // const isLoadingStats = isLoading;

  const clearFilters = () => {
    setFilters({
      status: "all",
      startDate: "",
      endDate: "",
    });
  };

  const handleCancelBooking = (
    bookingId: string,
    cancellationReason?: string
  ) => {
    cancelBookingMutation.mutate({
      id: bookingId,
      cancellationReason,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Bookings
        </h3>
        <p className="text-gray-600 mb-4">
          {(error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to load bookings. Please try again."}
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {confirmedBookings}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedBookings}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cancelledBookings}
            </div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => {
                    handleDateFilterChange("startDate", e.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => {
                    handleDateFilterChange("endDate", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters} type="button">
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            {totalBookings} total bookings • {pendingBookings} pending
            confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                {filters.status !== "all" ||
                filters.startDate ||
                filters.endDate
                  ? "Try adjusting your filters to see more results."
                  : "You haven't made any bookings yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: PopulatedBooking) => {
                const { date, time } = formatDateTime(booking.appointmentDate);

                return (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {booking.business?.name?.charAt(0)?.toUpperCase() ||
                            "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {booking.business?.name || "Unknown Business"}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />$
                            {booking.totalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {booking.service?.name || "Unknown Service"}
                          </Badge>
                          {booking.staff && (
                            <Badge variant="secondary" className="text-xs">
                              {booking.staff.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsViewModalOpen(true);
                        }}
                        className="h-9 w-9 p-0"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {["pending", "confirmed"].includes(booking.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsCancelModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                          title="Cancel booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Booking Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View complete information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Booking Status</h3>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-mono text-sm">{selectedBooking._id}</p>
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Service Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-medium">
                      {selectedBooking.service?.name || "Unknown Service"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">
                      {selectedBooking.service?.duration ||
                        selectedBooking.duration}{" "}
                      minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium">
                      ${selectedBooking.totalPrice} {selectedBooking.currency}
                    </p>
                  </div>
                  {selectedBooking.staff && (
                    <div>
                      <p className="text-sm text-gray-600">Staff Member</p>
                      <p className="font-medium">
                        {selectedBooking.staff.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-medium">
                      {selectedBooking.business?.name || "Unknown Business"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">
                      {selectedBooking.business?.contact?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">
                      {selectedBooking.business?.address?.street && (
                        <>
                          {selectedBooking.business.address.street}
                          <br />
                          {selectedBooking.business.address.city},{" "}
                          {selectedBooking.business.address.state}{" "}
                          {selectedBooking.business.address.zipCode}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {formatDateTime(selectedBooking.appointmentDate).date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">
                      {formatDateTime(selectedBooking.appointmentDate).time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Service:</strong> {selectedBooking.service?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {formatDateTime(selectedBooking.appointmentDate).date}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong>{" "}
                  {formatDateTime(selectedBooking.appointmentDate).time}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Business:</strong> {selectedBooking.business?.name}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedBooking) {
                  handleCancelBooking(
                    selectedBooking._id,
                    "Customer requested cancellation"
                  );
                }
              }}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending
                ? "Cancelling..."
                : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
