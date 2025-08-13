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
} from "lucide-react";

interface ServiceProviderOverviewProps {
  totalBookings?: number;
  upcomingBookings?: number;
  completedBookings?: number;
  totalRevenue?: number;
  totalCustomers?: number;
  averageRating?: number;
  businessName?: string;
  businessStatus?: "active" | "inactive";
}

export function ServiceProviderOverview({
  totalBookings = 0,
  upcomingBookings = 0,
  completedBookings = 0,
  totalRevenue = 0,
  totalCustomers = 0,
  averageRating = 0,
  businessName = "Your Business",
  businessStatus = "active",
}: ServiceProviderOverviewProps) {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
              Welcome to your business dashboard. Here's how your business is
              performing.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">{businessName}</span>
              <Badge
                variant={businessStatus === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {businessStatus === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              Service Provider
            </Badge>
            {user?.isVerified && (
              <Badge variant="default" className="text-sm">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Business Stats Grid */}
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalBookings > 0
                ? Math.round((completedBookings / totalBookings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Successful services</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Business</p>
                <p className="text-sm text-gray-600">
                  Update business details and settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">View Bookings</p>
                <p className="text-sm text-gray-600">
                  Manage customer appointments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Staff</p>
                <p className="text-sm text-gray-600">
                  Add and manage staff members
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
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  Welcome to business dashboard
                </span>
                <span className="text-gray-400 ml-auto">Just now</span>
              </div>
              {totalBookings > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {totalBookings} total booking
                    {totalBookings !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-gray-400 ml-auto">Just now</span>
                </div>
              )}
              {upcomingBookings > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {upcomingBookings} upcoming appointment
                    {upcomingBookings !== 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-400 ml-auto">Just now</span>
                </div>
              )}
              {totalRevenue > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Total revenue: {formatCurrency(totalRevenue)}
                  </span>
                  <span className="text-gray-400 ml-auto">Just now</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
