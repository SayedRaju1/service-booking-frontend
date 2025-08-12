"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  User,
  Mail,
  Phone,
  Star,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { staffApi, Staff, CreateStaffRequest } from "@/lib/api/staff";

export default function StaffManagementPage() {
  const queryClient = useQueryClient();
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  // Mock business ID - in real app, this would come from auth context
  const businessId = "business-id";

  const {
    data: staffData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["business-staff", businessId],
    queryFn: () => staffApi.getBusinessStaff(businessId),
    enabled: false, // Disabled for now since we don't have proper business context
  });

  const staff = staffData?.data || [];

  // Mock staff data for demonstration
  const mockStaff: Staff[] = [
    {
      _id: "staff-1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      role: "staff",
      business: businessId,
      isActive: true,
      experience: 5,
      rating: 4.8,
      totalBookings: 156,
      bio: "Experienced massage therapist specializing in deep tissue and relaxation techniques.",
      specialties: ["massage", "spa"],
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      _id: "staff-2",
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 (555) 234-5678",
      role: "manager",
      business: businessId,
      isActive: true,
      experience: 8,
      rating: 4.9,
      totalBookings: 203,
      bio: "Senior stylist with expertise in modern cuts and color techniques.",
      specialties: ["haircut", "styling", "color"],
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      _id: "staff-3",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 345-6789",
      role: "staff",
      business: businessId,
      isActive: false,
      experience: 3,
      rating: 4.6,
      totalBookings: 89,
      bio: "Skilled nail technician with attention to detail.",
      specialties: ["manicure", "pedicure"],
      createdAt: "2024-02-01T00:00:00Z",
      updatedAt: "2024-02-01T00:00:00Z",
    },
  ];

  const displayStaff = mockStaff; // Use mock data for now

  const handleDeleteStaff = (staffId: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      // In real app, this would call the API
      console.log("Delete staff:", staffId);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "staff":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Staff Management
            </h1>
            <p className="text-gray-600">
              Manage your team members and their schedules
            </p>
          </div>
          <Button onClick={() => setIsAddingStaff(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayStaff.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayStaff.filter((s) => s.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      displayStaff.reduce(
                        (acc, staff) => acc + (staff.rating || 0),
                        0
                      ) / displayStaff.length
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayStaff.reduce(
                      (acc, staff) => acc + (staff.totalBookings || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedules
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Availability
              </Button>
            </div>
          </div>

          {displayStaff.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No staff members yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first staff member to start managing your team.
                </p>
                <Button onClick={() => setIsAddingStaff(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayStaff.map((staff) => (
                <Card key={staff._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {staff.name}
                          </h3>
                          <Badge className={getRoleColor(staff.role)}>
                            {staff.role.charAt(0).toUpperCase() +
                              staff.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStaff(staff._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{staff.email}</span>
                      </div>
                      {staff.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{staff.phone}</span>
                        </div>
                      )}
                      {staff.bio && (
                        <p className="text-sm text-gray-600">{staff.bio}</p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {staff.rating?.toFixed(1)} ({staff.totalBookings}{" "}
                            bookings)
                          </span>
                          {staff.experience && (
                            <span>{staff.experience} years experience</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {staff.isActive ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-800"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
