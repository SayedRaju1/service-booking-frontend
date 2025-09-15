"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { User as UserType } from "@/types/api";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function CustomerProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  const queryClient = useQueryClient();

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch user profile data
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => authApi.getProfile(),
    enabled: !!user?._id,
  });

  // Handle profile loading errors
  useEffect(() => {
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      const errorMessage =
        profileError &&
        typeof profileError === "object" &&
        "response" in profileError
          ? (profileError as { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;
      toast.error(
        errorMessage || "Failed to load profile data. Please refresh the page."
      );
    }
  }, [profileError]);

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profileData?.data?.user) {
      const userData = profileData.data.user;
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: {
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          zipCode: userData.address?.zipCode || "",
          country: userData.address?.country || "",
        },
      });
    }
  }, [profileData]);

  // Timeout wrapper for mutations
  const createTimeoutPromise = (ms: number) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), ms);
    });
  };

  // Enhanced mutation function with timeout
  const updateProfileWithTimeout = async (
    data: Partial<ProfileFormData>
  ): Promise<{ data?: { user?: UserType } }> => {
    const timeoutMs = 8000; // 8 seconds timeout for mutations

    return Promise.race([
      authApi.updateProfile(data),
      createTimeoutPromise(timeoutMs),
    ]) as Promise<{ data?: { user?: UserType } }>;
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfileWithTimeout,
    retry: (failureCount, error): boolean => {
      // Only retry once for network errors, not for timeout or validation errors
      if (failureCount < 1) {
        const isNetworkError =
          error &&
          typeof error === "object" &&
          "code" in error &&
          (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED");
        return Boolean(isNetworkError);
      }
      return false;
    },
    onSuccess: (response: { data?: { user?: UserType } }) => {
      if (response.data?.user) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    },
    onError: (error: unknown) => {
      console.error("Error updating profile:", error);

      let errorMessage = "Failed to update profile. Please try again.";

      if (error && typeof error === "object") {
        // Handle timeout errors
        if ("message" in error && error.message === "Request timeout") {
          errorMessage =
            "Request timed out. Please check your connection and try again.";
        }
        // Handle network errors
        else if ("code" in error) {
          const code = (error as { code: string }).code;
          if (code === "ERR_NETWORK" || code === "ECONNREFUSED") {
            errorMessage =
              "Unable to connect to the server. Please check your internet connection.";
          } else if (code === "ECONNABORTED") {
            errorMessage = "Request timed out. Please try again.";
          }
        }
        // Handle API response errors
        else if ("response" in error) {
          const responseError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage = responseError.response?.data?.message || errorMessage;
        }
      }

      toast.error(errorMessage);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileFormData] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    // Check if user is offline
    if (!isOnline) {
      toast.error(
        "You are currently offline. Please check your internet connection and try again."
      );
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Error handling is already done in the mutation onError callback
    }
  };

  const handleCancel = () => {
    const userData = currentUser || user;
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: {
        street: userData?.address?.street || "",
        city: userData?.address?.city || "",
        state: userData?.address?.state || "",
        zipCode: userData?.address?.zipCode || "",
        country: userData?.address?.country || "",
      },
    });
    setIsEditing(false);
    toast.info("Profile editing cancelled. No changes were saved.");
  };

  const currentUser = profileData?.data?.user || user;

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (profileError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading profile</p>
              <p className="text-gray-600 text-sm">
                {profileError instanceof Error
                  ? profileError.message
                  : "Unknown error occurred"}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information and account settings
            </p>
            {!isOnline && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                You are currently offline
              </div>
            )}
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} disabled={!isOnline}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={currentUser?.profilePicture}
                  alt={currentUser?.name}
                />
                <AvatarFallback className="text-2xl">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentUser?.name}
                </h2>
                <p className="text-gray-600">{currentUser?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {currentUser?.role === "service_provider"
                      ? "Service Provider"
                      : currentUser?.role === "admin"
                      ? "Admin"
                      : "Customer"}
                  </Badge>
                  {currentUser?.isVerified && (
                    <Badge variant="default">Verified</Badge>
                  )}
                  <Badge variant="outline">
                    Member since{" "}
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).getFullYear()
                      : "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Created
                </Label>
                <Input
                  value={
                    currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-medium">
                <MapPin className="h-4 w-4" />
                Address Information
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleInputChange("address.city", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleInputChange("address.state", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      handleInputChange("address.zipCode", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter ZIP code"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) =>
                      handleInputChange("address.country", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending || !isOnline}
                  className="flex-1"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
