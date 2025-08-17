"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Star,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { staffApi } from "@/lib/api/staff";
import { businessApi } from "@/lib/api/business";
import { servicesApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  specialization: string;
  hourlyRate: number;
  bio: string;
  services: string[];
}

export function StaffManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    specialization: "",
    hourlyRate: 0,
    bio: "",
    services: [],
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: businessData } = useQuery({
    queryKey: ["myBusiness"],
    queryFn: businessApi.getMyBusiness,
  });

  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["businessStaff", businessData?.data?.business?._id],
    queryFn: () =>
      staffApi.getBusinessStaff(businessData?.data?.business?._id || ""),
    enabled: !!businessData?.data?.business?._id,
  });

  const { data: servicesData } = useQuery({
    queryKey: ["myBusinessServices"],
    queryFn: servicesApi.getMyBusinessServices,
  });

  // Mutations
  const createStaffMutation = useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["businessStaff", businessData?.data?.business?._id],
      });
      toast.success("Staff member created successfully!");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create staff member"
      );
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffFormData> }) =>
      staffApi.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["businessStaff", businessData?.data?.business?._id],
      });
      toast.success("Staff member updated successfully!");
      setIsEditModalOpen(false);
      setSelectedStaff(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update staff member"
      );
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: staffApi.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["businessStaff", businessData?.data?.business?._id],
      });
      toast.success("Staff member deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete staff member"
      );
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      specialization: "",
      hourlyRate: 0,
      bio: "",
      services: [],
    });
  };

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessData?.data?.business?._id) {
      toast.error("Business not found. Please try again.");
      return;
    }

    if (selectedStaff) {
      updateStaffMutation.mutate({ id: selectedStaff._id, data: formData });
    } else {
      createStaffMutation.mutate({
        ...formData,
        businessId: businessData.data.business._id,
      });
    }
  };

  const handleEdit = (staff: any) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      position: staff.position || "",
      specialization: staff.specialization || "",
      hourlyRate: staff.hourlyRate || 0,
      bio: staff.bio || "",
      services: staff.services?.map((s: any) => s._id) || [],
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (staff: any) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStaff) {
      deleteStaffMutation.mutate(selectedStaff._id);
    }
  };

  const staff = staffData?.data?.staff || [];
  const business = businessData?.data?.business;
  const services = servicesData?.data?.services || [];

  const totalStaff = staff.length;
  const totalBookings = staff.reduce(
    (sum: number, s: any) => sum + (s.performance?.totalBookings || 0),
    0
  );
  const averageRating =
    staff.length > 0
      ? (
          staff.reduce(
            (sum: number, s: any) => sum + (s.performance?.averageRating || 0),
            0
          ) / staff.length
        ).toFixed(1)
      : "0.0";

  if (isLoadingStaff || !businessData?.data?.business?._id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">
            Manage your team members and their schedules
          </p>
        </div>
        <Dialog
          open={isAddModalOpen}
          onOpenChange={(open) => {
            if (open && !businessData?.data?.business?._id) {
              toast.error("Business data not available. Please try again.");
              return;
            }
            setIsAddModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              disabled={!businessData?.data?.business?._id}
            >
              <UserPlus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-semibold">
                Add New Staff Member
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 mt-2">
                Add a new team member to your business. Fill in their details
                below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="position"
                    className="text-sm font-medium text-gray-700"
                  >
                    Position *
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    placeholder="e.g., Senior Stylist, Junior Technician"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="specialization"
                    className="text-sm font-medium text-gray-700"
                  >
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                    placeholder="e.g., Hair Coloring, Nail Art"
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="hourlyRate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Hourly Rate ($)
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      handleInputChange(
                        "hourlyRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Brief description of skills and experience"
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="services"
                  className="text-sm font-medium text-gray-700"
                >
                  Services
                </Label>
                <Select
                  value={formData.services[0] || ""}
                  onValueChange={(value) =>
                    handleInputChange("services", [value])
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select primary service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service: any) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-6 border-t border-gray-200">
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 sm:flex-none px-6 py-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createStaffMutation.isPending}
                    className="flex items-center gap-2 flex-1 sm:flex-none px-6 py-2.5"
                  >
                    {createStaffMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Staff Member
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
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
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Staff performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your staff members and their information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <div className="text-center py-8 px-6">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No staff members yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start building your team by adding your first staff member.
              </p>
              <Button
                onClick={() => {
                  if (!businessData?.data?.business?._id) {
                    toast.error(
                      "Business data not available. Please try again."
                    );
                    return;
                  }
                  setIsAddModalOpen(true);
                }}
                disabled={!businessData?.data?.business?._id}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Staff Member
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {staff.map((member: any) => (
                <div
                  key={member._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src={member.profileImage}
                        alt={member.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {member.name?.charAt(0)?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-base">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {member.position}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {member.specialization && (
                          <Badge
                            variant="secondary"
                            className="text-xs whitespace-nowrap px-2 py-1"
                          >
                            {member.specialization}
                          </Badge>
                        )}
                        {member.hourlyRate > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap px-2 py-1"
                          >
                            ${member.hourlyRate}/hr
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      className="h-9 w-9 p-0 flex-shrink-0"
                      title="Edit staff member"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStaff(member);
                        setIsAvailabilityModalOpen(true);
                      }}
                      className="h-9 w-9 p-0 flex-shrink-0"
                      title="Manage availability"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0 flex-shrink-0"
                      title="Delete staff member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-semibold">
              Edit Staff Member
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              Update the staff member's information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="edit-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="edit-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="edit-phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="edit-position"
                  className="text-sm font-medium text-gray-700"
                >
                  Position *
                </Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="e.g., Senior Stylist, Junior Technician"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="edit-specialization"
                  className="text-sm font-medium text-gray-700"
                >
                  Specialization
                </Label>
                <Input
                  id="edit-specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  placeholder="e.g., Hair Coloring, Nail Art"
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="edit-hourlyRate"
                  className="text-sm font-medium text-gray-700"
                >
                  Hourly Rate ($)
                </Label>
                <Input
                  id="edit-hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    handleInputChange(
                      "hourlyRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="edit-bio"
                className="text-sm font-medium text-gray-700"
              >
                Bio
              </Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Brief description of skills and experience"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="edit-services"
                className="text-sm font-medium text-gray-700"
              >
                Services
              </Label>
              <Select
                value={formData.services[0] || ""}
                onValueChange={(value) =>
                  handleInputChange("services", [value])
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select primary service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-6 border-t border-gray-200">
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedStaff(null);
                    resetForm();
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateStaffMutation.isPending}
                  className="flex items-center gap-2 flex-1 sm:flex-none px-6 py-2.5"
                >
                  {updateStaffMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Update Staff Member
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteStaffMutation.isPending}
            >
              {deleteStaffMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Modal (Placeholder) */}
      <Dialog
        open={isAvailabilityModalOpen}
        onOpenChange={setIsAvailabilityModalOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Manage Availability - {selectedStaff?.name}
            </DialogTitle>
            <DialogDescription>
              Set working hours and availability for this staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Availability Management
            </h3>
            <p className="text-gray-600">
              This feature will be implemented in the next phase.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAvailabilityModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
