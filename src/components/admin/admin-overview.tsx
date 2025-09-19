"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Calendar,
  Settings,
  Activity,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverview() {
  // Fetch real data from backend APIs
  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["adminSystemOverview"],
    queryFn: adminApi.getSystemOverview,
  });

  // const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
  //   queryKey: ["adminRevenueAnalytics"],
  //   queryFn: () => adminApi.getRevenueAnalytics({ period: "monthly" }),
  // });

  // Mock recent activity (could be enhanced with real activity logs)
  const recentActivity = [
    {
      id: 1,
      type: "user",
      action: "New user registered",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "business",
      action: "Business verification requested",
      time: "15 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      type: "booking",
      action: "New booking created",
      time: "1 hour ago",
      status: "confirmed",
    },
    {
      id: 4,
      type: "service",
      action: "New service added",
      time: "2 hours ago",
      status: "active",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "business":
        return <Building2 className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "service":
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your service booking platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="h-3 w-3 mr-1" />
            Admin Access
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overviewData?.data?.users?.total?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">
                    +{overviewData?.data?.users?.newThisMonth || 0}
                  </span>{" "}
                  new this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overviewData?.data?.businesses?.total || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">
                    {overviewData?.data?.businesses?.pending || 0}
                  </span>{" "}
                  pending verification
                </p>
              </>
            )}
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
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overviewData?.data?.bookings?.total?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">
                    {overviewData?.data?.bookings?.thisMonth || 0}
                  </span>{" "}
                  this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingOverview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${overviewData?.data?.revenue?.total?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  $
                  {overviewData?.data?.revenue?.thisMonth?.toLocaleString() ||
                    "0"}{" "}
                  this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access frequently used admin functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>

            <Link href="/admin/businesses">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2"
              >
                <Building2 className="h-6 w-6" />
                <span>Manage Businesses</span>
              </Button>
            </Link>

            <Link href="/admin/categories">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2"
              >
                <Settings className="h-6 w-6" />
                <span>Service Categories</span>
              </Button>
            </Link>

            <Link href="/admin/bookings">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2"
              >
                <Calendar className="h-6 w-6" />
                <span>System Bookings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform performance and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">API Status: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Database: Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Uptime: 99.9%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
