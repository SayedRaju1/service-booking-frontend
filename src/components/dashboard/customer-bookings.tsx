"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Edit,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BookingFilters {
  status: string | "all";
  startDate: string;
  endDate: string;
}

export function CustomerBookings() {
  const [filters, setFilters] = useState<BookingFilters>({
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [selectedBooking, setSelectedBooking] =
    useState<PopulatedBooking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Note: Statistics will be calculated from the main query data for consistency

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      cancellationReason,
    }: {
      id: string;
      status: string;
      cancellationReason?: string;
    }) => bookingsApi.updateBookingStatus(id, { status, cancellationReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      toast.success("Booking status updated successfully!");
      setIsEditModalOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      toast.success("Booking cancelled successfully!");
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    queryKey: ["customerBookings", debouncedFilters],
    queryFn: () =>
      bookingsApi.getBusinessBookings({
        status:
          debouncedFilters.status === "all"
            ? undefined
            : debouncedFilters.status,
        startDate: debouncedFilters.startDate || undefined,
        endDate: debouncedFilters.endDate || undefined,
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

  // Use API data directly since getBusinessBookings supports server-side filtering
  const bookings = allBookingsFromApi;
  const filteredAllBookings = allBookings;

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
  const isLoadingStats = isLoading;

  const clearFilters = () => {
    setFilters({
      status: "all",
      startDate: "",
      endDate: "",
    });
  };

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: string,
    cancellationReason?: string
  ) => {
    updateStatusMutation.mutate({
      id: bookingId,
      status: newStatus,
      cancellationReason,
    });
  };

  const handleCancelBooking = (
    bookingId: string,
    cancellationReason?: string
  ) => {
    cancelBookingMutation.mutate({ id: bookingId, cancellationReason });
  };

  if (isLoading || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Bookings
          </h1>
          <p className="text-gray-600">
            Manage and track all customer appointments
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
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
              Awaiting confirmation
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
            <p className="text-xs text-muted-foreground">Ready for service</p>
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
            <p className="text-xs text-muted-foreground">Service delivered</p>
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
            <p className="text-xs text-muted-foreground">Cancelled bookings</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                {filters.status !== "all" ||
                filters.startDate ||
                filters.endDate
                  ? "Try adjusting your filters"
                  : "Customers haven't made any bookings yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: PopulatedBooking) => {
                const { date, time } = formatDateTime(booking.appointmentDate);
                return (
                  <div
                    key={booking._id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {booking.customer?.name?.charAt(0)?.toUpperCase() ||
                            "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {booking.customer?.name || "Unknown Customer"}
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
                      {booking.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsEditModalOpen(true);
                          }}
                          className="h-9 w-9 p-0"
                          title="Update status"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {["pending", "confirmed"].includes(booking.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDeleteModalOpen(true);
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Customer
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {selectedBooking.customer?.name || "Unknown Customer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      {selectedBooking.customer?.email || "No email"}
                    </div>
                    {selectedBooking.customer?.phone && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {selectedBooking.customer.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Service
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">
                      {selectedBooking.service?.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Duration: {selectedBooking.service?.duration} minutes
                    </div>
                    <div className="text-sm text-gray-600">
                      Price: ${selectedBooking.totalPrice}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Appointment
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {formatDateTime(selectedBooking.appointmentDate).date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(selectedBooking.appointmentDate).time}
                  </div>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Customer Notes
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedBooking.notes}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {getStatusIcon(selectedBooking.status)}
                  {selectedBooking.status.charAt(0).toUpperCase() +
                    selectedBooking.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-600">
                  Created:{" "}
                  {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Current Status
                </Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="newStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  New Status
                </Label>
                <Select
                  onValueChange={(value) => {
                    if (value === "cancelled") {
                      const reason = prompt(
                        "Please provide a cancellation reason:"
                      );
                      if (reason !== null) {
                        handleStatusUpdate(selectedBooking._id, value, reason);
                      }
                    } else {
                      handleStatusUpdate(selectedBooking._id, value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
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
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-900">
                  {selectedBooking.customer?.name || "Unknown Customer"} -{" "}
                  {selectedBooking.service?.name}
                </div>
                <div className="text-sm text-red-700 mt-1">
                  {formatDateTime(selectedBooking.appointmentDate).date} at{" "}
                  {formatDateTime(selectedBooking.appointmentDate).time}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="cancellationReason"
                  className="text-sm font-medium text-gray-700"
                >
                  Cancellation Reason (Optional)
                </Label>
                <Input
                  id="cancellationReason"
                  placeholder="e.g., Customer request, scheduling conflict..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCancelBooking(
                        selectedBooking._id,
                        e.currentTarget.value
                      );
                    }
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const reason = (
                  document.getElementById(
                    "cancellationReason"
                  ) as HTMLInputElement
                )?.value;
                handleCancelBooking(selectedBooking?._id || "", reason);
              }}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
