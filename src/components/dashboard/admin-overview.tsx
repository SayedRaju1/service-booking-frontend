"use client";

import { useAuthStore } from "@/stores/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Briefcase,
  Shield,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface AdminOverviewProps {
  totalUsers?: number;
  totalBusinesses?: number;
  totalServices?: number;
  totalBookings?: number;
  pendingApprovals?: number;
  systemHealth?: "healthy" | "warning" | "critical";
}

export function AdminOverview({
  totalUsers = 0,
  totalBusinesses = 0,
  totalServices = 0,
  totalBookings = 0,
  pendingApprovals = 0,
  systemHealth = "healthy",
}: AdminOverviewProps) {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSystemHealthText = (health: string) => {
    switch (health) {
      case "healthy":
        return "Healthy";
      case "warning":
        return "Warning";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome to your admin dashboard. Here&apos;s the system overview
              and management tools.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="font-medium text-gray-900">
                System Administrator
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${getSystemHealthColor(systemHealth)}`}
              >
                {getSystemHealthText(systemHealth)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="text-sm">
              Administrator
            </Badge>
            {user?.isVerified && (
              <Badge variant="default" className="text-sm">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalBusinesses}
            </div>
            <p className="text-xs text-muted-foreground">Active businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalServices}
            </div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {totalBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              System-wide bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getSystemHealthText(systemHealth)}
            </div>
            <p className="text-xs text-muted-foreground">Overall status</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">
                  View and manage all system users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Business Management</p>
                <p className="text-sm text-gray-600">
                  Approve and manage businesses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <Briefcase className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Service Categories</p>
                <p className="text-sm text-gray-600">
                  Manage service categories
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
                  Welcome to admin dashboard
                </span>
                <span className="text-gray-400 ml-auto">Just now</span>
              </div>
              {totalUsers > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {totalUsers} total user{totalUsers !== 1 ? "s" : ""} in
                    system
                  </span>
                  <span className="text-gray-400 ml-auto">Just now</span>
                </div>
              )}
              {totalBusinesses > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {totalBusinesses} business
                    {totalBusinesses !== 1 ? "es" : ""} registered
                  </span>
                  <span className="text-gray-400 ml-auto">Just now</span>
                </div>
              )}
              {pendingApprovals > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {pendingApprovals} pending approval
                    {pendingApprovals !== 1 ? "s" : ""}
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
