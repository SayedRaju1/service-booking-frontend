"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { businessApi } from "@/lib/api/business";
import { Business } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  Edit,
  Building,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

type BusinessFormData = Partial<Business>;

const BUSINESS_CATEGORIES = [
  { value: "salon", label: "Salon", icon: "💇‍♀️" },
  { value: "dental", label: "Dental", icon: "🦷" },
  { value: "beauty", label: "Beauty", icon: "✨" },
  { value: "spa", label: "Spa", icon: "🧖‍♀️" },
  { value: "consulting", label: "Consulting", icon: "💼" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "medical", label: "Medical", icon: "🏥" },
  { value: "other", label: "Other", icon: "🏢" },
];

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

export function BusinessManagement() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    description: "",
    category: undefined,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    operatingHours: {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "09:00", close: "17:00", isOpen: false },
      sunday: { open: "09:00", close: "17:00", isOpen: false },
    },
  });

  // Fetch business data
  const {
    data: businessData,
    isLoading: isLoadingBusiness,
    error: businessError,
  } = useQuery({
    queryKey: ["my-business"],
    queryFn: () => businessApi.getMyBusiness(),
  });

  // Update business mutation
  const updateBusinessMutation = useMutation({
    mutationFn: (data: BusinessFormData) => {
      if (!businessData?.data?.business?._id) {
        throw new Error("Business ID not found");
      }
      return businessApi.updateBusiness(businessData.data.business._id, data);
    },
    onSuccess: (response) => {
      // Show success message with backend response message
      const message = response?.message || "Business updated successfully!";
      toast.success(message);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["my-business"] });
    },
    onError: (error: unknown) => {
      // Handle different types of errors based on backend response
      let errorMessage = "Failed to update business";

      // Type guard for axios error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };

        if (axiosError.response?.data?.message) {
          // Backend API error message
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 403) {
          errorMessage = "You are not authorized to update this business";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "Business not found";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid business data provided";
        }
      } else if (error instanceof Error) {
        // Frontend error message
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // Initialize form data when business data is loaded
  useEffect(() => {
    if (businessData?.data?.business && !isEditing) {
      const business = businessData.data.business;
      setFormData({
        name: business.name || "",
        description: business.description || "",
        category: business.category || undefined,
        address: {
          street: business.address?.street || "",
          city: business.address?.city || "",
          state: business.address?.state || "",
          zipCode: business.address?.zipCode || "",
          country: business.address?.country || "United States",
        },
        contact: {
          phone: business.contact?.phone || "",
          email: business.contact?.email || "",
          website: business.contact?.website || "",
        },
        operatingHours: business.operatingHours || {
          monday: { open: "09:00", close: "17:00", isOpen: true },
          tuesday: { open: "09:00", close: "17:00", isOpen: true },
          wednesday: { open: "09:00", close: "17:00", isOpen: true },
          thursday: { open: "09:00", close: "17:00", isOpen: true },
          friday: { open: "09:00", close: "17:00", isOpen: true },
          saturday: { open: "09:00", close: "17:00", isOpen: false },
          sunday: { open: "09:00", close: "17:00", isOpen: false },
        },
      });
    }
  }, [businessData, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        [field]: value,
      },
    }));
  };

  const handleOperatingHoursChange = (
    day: string,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours!,
        [day]: {
          ...prev.operatingHours![day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original business data
    if (businessData?.data?.business) {
      const business = businessData.data.business;
      setFormData({
        name: business.name || "",
        description: business.description || "",
        category: business.category || undefined,
        address: {
          street: business.address?.street || "",
          city: business.address?.city || "",
          state: business.address?.state || "",
          zipCode: business.address?.zipCode || "",
          country: business.address?.country || "United States",
        },
        contact: {
          phone: business.contact?.phone || "",
          email: business.contact?.email || "",
          website: business.contact?.website || "",
        },
        operatingHours: business.operatingHours || {
          monday: { open: "09:00", close: "17:00", isOpen: true },
          tuesday: { open: "09:00", close: "17:00", isOpen: true },
          wednesday: { open: "09:00", close: "17:00", isOpen: true },
          thursday: { open: "09:00", close: "17:00", isOpen: true },
          friday: { open: "09:00", close: "17:00", isOpen: true },
          saturday: { open: "09:00", close: "17:00", isOpen: false },
          sunday: { open: "09:00", close: "17:00", isOpen: false },
        },
      });
    }
  };

  if (isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Business Data
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your business information...
          </p>
        </div>
      </div>
    );
  }

  if (businessError) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-3">
            Error Loading Business Data
          </h3>
          <p className="text-gray-600 mb-4">
            {businessError?.message || "Unknown error occurred"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!businessData?.data?.business) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Business Found
          </h3>
          <p className="text-gray-600 mb-4">
            You need to create a business first before you can manage it.
          </p>
          <Button>Create Business</Button>
        </CardContent>
      </Card>
    );
  }

  const business = businessData.data.business;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Business Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your business information, contact details, and operating
            hours.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {business.isVerified && (
            <Badge variant="default" className="text-xs sm:text-sm">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Verified
            </Badge>
          )}
          <Badge
            variant={business.isActive ? "default" : "secondary"}
            className="text-xs sm:text-sm"
          >
            {business.isActive ? "Active" : "Inactive"}
          </Badge>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit Business
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                size="sm"
                className="text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateBusinessMutation.isPending}
                size="sm"
                className="text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                {updateBusinessMutation.isPending ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Business Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                  Business Rating
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                  {business.rating || 0}/5
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-200 rounded-full">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">
                  Total Reviews
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                  {business.totalReviews || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-200 rounded-full">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                  Category
                </p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-purple-900 capitalize">
                  {business.category || "Not Set"}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-200 rounded-full">
                <Building className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-orange-600 mb-1">
                  Status
                </p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-orange-900 capitalize">
                  {business.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-200 rounded-full">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Business Info & Address */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
                <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Business Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter business name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <span className="mr-2">{category.icon}</span>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="Describe your business"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="street"
                  className="text-sm font-medium text-gray-700"
                >
                  Street Address *
                </Label>
                <Input
                  id="street"
                  value={formData.address?.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="Enter street address"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.address?.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700"
                  >
                    State *
                  </Label>
                  <Input
                    id="state"
                    value={formData.address?.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter state"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="zipCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    ZIP Code *
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter ZIP code"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.contact?.phone}
                    onChange={(e) =>
                      handleContactChange("phone", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact?.email}
                    onChange={(e) =>
                      handleContactChange("email", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-gray-700"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.contact?.website}
                  onChange={(e) =>
                    handleContactChange("website", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="https://yourwebsite.com"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Operating Hours */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day.key}
                  className="p-2 sm:p-3 lg:p-4 border rounded-lg"
                >
                  <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                    {/* Day Header with Toggle */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Switch
                        checked={formData.operatingHours?.[day.key]?.isOpen}
                        onCheckedChange={(checked) =>
                          handleOperatingHoursChange(day.key, "isOpen", checked)
                        }
                        disabled={!isEditing}
                      />
                      <Label className="font-medium text-sm sm:text-base min-w-0 flex-shrink-0">
                        {day.label}
                      </Label>
                    </div>

                    {/* Time Inputs or Closed Status */}
                    {formData.operatingHours?.[day.key]?.isOpen ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 ml-0 sm:ml-4 lg:ml-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0 w-full">
                          <Input
                            type="time"
                            value={formData.operatingHours?.[day.key]?.open}
                            onChange={(e) =>
                              handleOperatingHoursChange(
                                day.key,
                                "open",
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            className="w-full sm:w-20 lg:w-24 xl:w-28 text-sm flex-shrink-0"
                          />
                          <span className="text-gray-500 text-sm whitespace-nowrap text-center sm:text-left">
                            to
                          </span>
                          <Input
                            type="time"
                            value={formData.operatingHours?.[day.key]?.close}
                            onChange={(e) =>
                              handleOperatingHoursChange(
                                day.key,
                                "close",
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            className="w-full sm:w-20 lg:w-24 xl:w-28 text-sm flex-shrink-0"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="ml-0 sm:ml-4 lg:ml-6">
                        <span className="text-gray-500 italic text-sm">
                          Closed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
