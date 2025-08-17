"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingList } from "@/components/booking/booking-list";
import { bookingsApi } from "@/lib/api/bookings";

export default function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("today");

  // Fetch business bookings (this would need to be implemented with proper business ID)
  const { data: bookingsData } = useQuery({
    queryKey: ["business-bookings", activeTab],
    queryFn: () =>
      bookingsApi.getBusinessBookings("business-id", {
        status:
          activeTab === "today"
            ? "pending,confirmed"
            : activeTab === "upcoming"
            ? "confirmed"
            : activeTab === "completed"
            ? "completed"
            : undefined,
        date:
          activeTab === "today"
            ? new Date().toISOString().split("T")[0]
            : undefined,
      }),
    enabled: false, // Disabled for now since we don't have proper business context
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Dashboard
          </h1>
          <p className="text-gray-600">Manage your services and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Today's Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Revenue (Month)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">$2,450</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/business/services">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </Link>
                <Link href="/dashboard/business/schedule">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                  </Button>
                </Link>
                <Link href="/dashboard/staff">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Staff
                  </Button>
                </Link>
                <Link href="/dashboard/business/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Business Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Bookings
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("today")}
              >
                Today
              </Button>
              <Button
                variant={activeTab === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Placeholder for business bookings */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-4">
                  When customers book your services, they'll appear here.
                </p>
                <Link href="/dashboard/business/services">
                  <Button>Add Your First Service</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Month</span>
                  <span className="font-semibold text-gray-900">$2,180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">$2,450</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Haircut & Styling</p>
                    <p className="text-sm text-gray-600">
                      Most booked this month
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    24 bookings
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dental Cleaning</p>
                    <p className="text-sm text-gray-600">Regular checkups</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    18 bookings
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Massage Therapy</p>
                    <p className="text-sm text-gray-600">Relaxation services</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    15 bookings
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New booking: Haircut & Styling
                    </p>
                    <p className="text-xs text-gray-500">
                      Tomorrow at 2:00 PM - John Doe
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Completed: Dental Cleaning
                    </p>
                    <p className="text-xs text-gray-500">
                      Today at 10:00 AM - Jane Smith
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Service updated: Massage Therapy
                    </p>
                    <p className="text-xs text-gray-500">
                      Price increased to $80
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
