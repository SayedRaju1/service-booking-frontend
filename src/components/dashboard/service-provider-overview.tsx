"use client";

import { useAuthStore } from "@/stores/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api/business";
import { servicesApi } from "@/lib/api/services";
import { staffApi } from "@/lib/api/staff";
import { bookingsApi } from "@/lib/api/bookings";
import { useRouter } from "next/navigation";
import { PopulatedBooking } from "@/types/api";

export function ServiceProviderOverview() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Fetch business data
  const {
    data: businessData,
    isLoading: isLoadingBusiness,
    error: businessError,
  } = useQuery({
    queryKey: ["my-business"],
    queryFn: () => businessApi.getMyBusiness(),
    enabled: !!user?._id,
  });

  // Fetch business services
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    error: servicesError,
  } = useQuery({
    queryKey: ["my-business-services"],
    queryFn: () => servicesApi.getMyBusinessServices(),
    enabled: !!businessData?.data?.business?._id,
  });

  // Fetch business staff
  const {
    data: staffData,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useQuery({
    queryKey: ["my-business-staff"],
    queryFn: () =>
      staffApi.getBusinessStaff(businessData?.data?.business?._id || ""),
    enabled: !!businessData?.data?.business?._id,
  });

  // Fetch business bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["my-business-bookings"],
    queryFn: () => bookingsApi.getBusinessBookings(),
    enabled: !!businessData?.data?.business?._id,
  });

  // Calculate statistics
  const totalServices = servicesData?.data?.services?.length || 0;
  const totalStaff = staffData?.data?.staff?.length || 0;
  const totalBookings = bookingsData?.data?.bookings?.length || 0;

  // Calculate revenue (sum of all completed bookings)
  const totalRevenue =
    bookingsData?.data?.bookings
      ?.filter((booking: PopulatedBooking) => booking.status === "completed")
      ?.reduce(
        (sum: number, booking: PopulatedBooking) =>
          sum + (booking.totalPrice || 0),
        0
      ) || 0;

  // Calculate average rating
  const averageRating = businessData?.data?.business?.rating || 0;
  const totalReviews = businessData?.data?.business?.totalReviews || 0;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "business":
        router.push("/dashboard/business");
        break;
      case "services":
        router.push("/dashboard/services");
        break;
      case "staff":
        router.push("/dashboard/staff");
        break;
      case "bookings":
        router.push("/dashboard/bookings");
        break;
      default:
        break;
    }
  };

  if (
    isLoadingBusiness ||
    isLoadingServices ||
    isLoadingStaff ||
    isLoadingBookings
  ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading business data...</span>
        </div>
      </div>
    );
  }

  if (businessError || servicesError || staffError || bookingsError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error loading business data</p>
            <p className="text-gray-600 text-sm">
              {businessError?.message ||
                servicesError?.message ||
                staffError?.message ||
                bookingsError?.message ||
                "Unknown error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "Business Owner"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            Service Provider
          </Badge>
          {businessData?.data?.business?.isVerified && (
            <Badge variant="default" className="text-sm">
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Business Info */}
      {businessData?.data?.business && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {businessData.data.business.name}
                </h2>
                <p className="text-gray-600">
                  {businessData.data.business.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    {businessData.data.business.address.city},{" "}
                    {businessData.data.business.address.state}
                  </span>
                  <span className="text-sm text-gray-500">
                    {businessData.data.business.category}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From completed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Business Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {totalReviews} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Business Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessData?.data?.business?.isActive ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground">
              {businessData?.data?.business?.isVerified
                ? "Verified"
                : "Pending verification"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => handleQuickAction("business")}
            >
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Business</p>
                <p className="text-sm text-gray-600">
                  Update business information and settings
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => handleQuickAction("services")}
            >
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Services</p>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove services
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() => handleQuickAction("staff")}
            >
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Staff</p>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove staff members
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer"
              onClick={() => handleQuickAction("bookings")}
            >
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">View Bookings</p>
                <p className="text-sm text-gray-600">
                  Manage appointments and schedules
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookingsData?.data?.bookings &&
              bookingsData.data.bookings.length > 0 ? (
                bookingsData.data.bookings
                  .slice(0, 5)
                  .map((booking: PopulatedBooking) => (
                    <div
                      key={booking._id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">
                        New booking for {booking.service?.name || "Service"}
                      </span>
                      <span className="text-gray-400 ml-auto">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-500">No recent activity</span>
                  <span className="text-gray-400 ml-auto">-</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
