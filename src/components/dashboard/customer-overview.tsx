"use client";

import { useAuthStore } from "@/stores/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function CustomerOverview() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Fetch customer's bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: !!user?._id,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Calculate statistics from real data
  const totalBookings = bookingsData?.data?.bookings?.length || 0;
  const upcomingBookings =
    bookingsData?.data?.bookings?.filter(
      (booking) => new Date(booking.appointmentDate) > new Date()
    ).length || 0;
  const completedBookings =
    bookingsData?.data?.bookings?.filter(
      (booking) => booking.status === "completed"
    ).length || 0;

  // Get recent bookings for activity feed
  const recentBookings = bookingsData?.data?.bookings?.slice(0, 3) || [];

  if (isLoadingBookings) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">
              Loading your dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Error loading dashboard data</p>
            <p className="text-gray-600 text-sm">
              {bookingsError instanceof Error
                ? bookingsError.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "book":
        router.push("/services");
        break;
      case "businesses":
        router.push("/businesses");
        break;
      case "rate":
        // TODO: Implement rating functionality later
        // router.push("/dashboard/bookings");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome to your customer dashboard. Here&apos;s what&apos;s
              happening with your bookings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              Customer
            </Badge>
            {user?.isVerified && (
              <Badge variant="default" className="text-sm">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {upcomingBookings}
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Services
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
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
              onClick={() => handleQuickAction("book")}
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Book New Service</p>
                <p className="text-sm text-gray-600">
                  Schedule your next appointment
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => handleQuickAction("businesses")}
            >
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Find Businesses</p>
                <p className="text-sm text-gray-600">
                  Discover new service providers
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer opacity-50"
              // onClick={() => handleQuickAction("rate")}
            >
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Rate Services</p>
                <p className="text-sm text-gray-600">Coming Soon</p>
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
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Welcome to your dashboard</span>
                <span className="text-gray-400 ml-auto">Just now</span>
              </div>

              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {booking.service.name} at {booking.business.name}
                    </span>
                    <span className="text-gray-400 ml-auto">
                      {formatDistanceToNow(new Date(booking.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-500">No recent bookings</span>
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
