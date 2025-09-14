"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  Loader2,
  ShieldCheck,
  Ban,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { adminApi, AdminBusiness } from "@/lib/api/admin";
import { toast } from "sonner";

// Using AdminBusiness type from the API

export function BusinessManagement() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<AdminBusiness[]>(
    []
  );
  const [selectedBusiness, setSelectedBusiness] =
    useState<AdminBusiness | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    verification: "all",
  });

  // Fetch businesses from API
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await adminApi.getAllBusinesses({
        page: pagination.page,
        limit: pagination.limit,
        category: filters.category !== "all" ? filters.category : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        verified:
          filters.verification !== "all"
            ? filters.verification === "verified"
            : undefined,
        search: filters.search || undefined,
      });

      if (response.success && response.data) {
        setBusinesses(response.data.businesses);
        setFilteredBusinesses(response.data.businesses);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch businesses");
      }
    } catch (err: unknown) {
      handleApiError(err, "Failed to fetch businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBusinesses();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchBusinesses]);

  // Handle business verification
  const handleVerifyBusiness = async (
    businessId: string,
    isVerified: boolean,
    notes?: string
  ) => {
    try {
      setLoading(true);
      const response = await adminApi.verifyBusiness(businessId, {
        isVerified,
        verificationNotes: notes,
      });

      if (response.success && response.data) {
        // Update the selected business in the modal
        if (selectedBusiness && selectedBusiness._id === businessId) {
          setSelectedBusiness(response.data);
        }

        // Update the business in the main list
        setBusinesses((prev) =>
          prev.map((business) =>
            business._id === businessId ? response.data! : business
          )
        );

        // Update filtered businesses
        setFilteredBusinesses((prev) =>
          prev.map((business) =>
            business._id === businessId ? response.data! : business
          )
        );

        // Show success toast
        toast.success(
          isVerified
            ? "Business verified successfully!"
            : "Business verification rejected successfully!"
        );
      } else {
        // Show error toast
        toast.error(
          response.message || "Failed to update business verification"
        );
      }
    } catch (err: unknown) {
      handleApiError(
        err,
        "Failed to update business verification. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle business status update
  const handleUpdateBusinessStatus = async (
    businessId: string,
    isActive: boolean,
    reason?: string
  ) => {
    try {
      setLoading(true);
      const response = await adminApi.updateBusinessStatus(businessId, {
        isActive,
        deactivationReason: reason,
      });

      if (response.success && response.data) {
        // Update the selected business in the modal
        if (selectedBusiness && selectedBusiness._id === businessId) {
          setSelectedBusiness(response.data);
        }

        // Update the business in the main list
        setBusinesses((prev) =>
          prev.map((business) =>
            business._id === businessId ? response.data! : business
          )
        );

        // Update filtered businesses
        setFilteredBusinesses((prev) =>
          prev.map((business) =>
            business._id === businessId ? response.data! : business
          )
        );

        // Show success toast
        toast.success(
          isActive
            ? "Business activated successfully!"
            : "Business deactivated successfully!"
        );
      } else {
        // Show error toast
        toast.error(response.message || "Failed to update business status");
      }
    } catch (err: unknown) {
      handleApiError(
        err,
        "Failed to update business status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      beauty: "Beauty & Wellness",
      dental: "Dental Care",
      fitness: "Fitness & Sports",
      spa: "Spa & Relaxation",
      consulting: "Consulting",
      medical: "Medical",
      other: "Other",
    };
    return categories[category] || category;
  };

  const getStatusBadge = (business: AdminBusiness) => {
    if (!business.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (!business.isVerified) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pending Verification
        </Badge>
      );
    }
    return <Badge variant="default">Active & Verified</Badge>;
  };

  // Helper function to handle API errors
  const handleApiError = (error: unknown, defaultMessage: string) => {
    console.error("API Error:", error);

    if (error && typeof error === "object" && "code" in error) {
      const err = error as {
        code?: string;
        message?: string;
        response?: { status?: number; data?: { message?: string } };
      };

      if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
        toast.error(
          "Network error: Unable to connect to the server. Please check your connection and try again."
        );
      } else if (err.response?.status === 404) {
        toast.error(
          "Resource not found. Please refresh the page and try again."
        );
      } else if (err.response?.status === 500) {
        toast.error(
          "Server error: Something went wrong on our end. Please try again later."
        );
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(defaultMessage);
      }
    } else {
      toast.error(defaultMessage);
    }
  };

  const viewBusiness = async (business: AdminBusiness) => {
    try {
      // Open modal immediately with loading state
      setIsViewDialogOpen(true);
      setViewLoading(true);

      const response = await adminApi.getBusinessById(business._id);

      if (response.success && response.data) {
        setSelectedBusiness(response.data);
      } else {
        toast.error(response.message || "Failed to fetch business details");
      }
    } catch (err: unknown) {
      handleApiError(
        err,
        "Failed to fetch business details. Please try again."
      );
    } finally {
      setViewLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: pagination.total,
    verified: businesses.filter((b) => b.isVerified).length,
    pending: businesses.filter((b) => !b.isVerified).length,
    active: businesses.filter((b) => b.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Business Management
          </h1>
          <p className="text-muted-foreground">
            Manage all registered businesses in the system
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-700 font-medium">Offline</span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={fetchBusinesses}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter businesses by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                placeholder="Search businesses..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                <SelectItem value="dental">Dental Care</SelectItem>
                <SelectItem value="fitness">Fitness & Sports</SelectItem>
                <SelectItem value="spa">Spa & Relaxation</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.verification}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, verification: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Businesses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
          <CardDescription>
            {filteredBusinesses.length} businesses found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading businesses...</span>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No businesses found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div
                  key={business._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3"
                >
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{business.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {getCategoryLabel(business.category)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Owner: {business.owner.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Joined: {formatDate(business.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {getStatusBadge(business)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewBusiness(business)}
                      className="text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} businesses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page <= 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page >= pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent
          className="
          max-w-[95vw] max-h-[95vh] 
          sm:max-w-[90vw] sm:max-h-[90vh]
          md:max-w-[85vw] md:max-h-[90vh]
          lg:max-w-[80vw] lg:max-h-[90vh]
          xl:max-w-[75vw] xl:max-h-[90vh]
          2xl:max-w-[65vw] 2xl:max-h-[90vh]
          3xl:max-w-[60vw] 3xl:max-h-[90vh]
          4xl:max-w-[55vw] 4xl:max-h-[90vh]
          overflow-hidden
        "
          showCloseButton={false}
        >
          <DialogHeader className="pb-4 border-b bg-white sticky top-0 z-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  {selectedBusiness?.name}
                </DialogTitle>
                {/* Status badge - shows below business name on small screens, to the right on large screens */}
                {selectedBusiness && (
                  <div className="flex items-center gap-2 sm:ml-4">
                    {getStatusBadge(selectedBusiness)}
                  </div>
                )}
              </div>
              {/* Close button - positioned absolutely to avoid layout conflicts */}
              <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </DialogHeader>

          {viewLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-lg font-medium text-gray-900">
                  Loading business details...
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Please wait while we fetch the information
                </p>
              </div>
            </div>
          ) : (
            selectedBusiness && (
              <div
                className="
              space-y-6 overflow-y-auto px-1
              max-h-[calc(95vh-120px)]
              sm:max-h-[calc(90vh-120px)]
              md:max-h-[calc(90vh-120px)]
              lg:max-h-[calc(90vh-120px)]
              xl:max-h-[calc(90vh-120px)]
              2xl:max-h-[calc(90vh-120px)]
              3xl:max-h-[calc(90vh-120px)]
              4xl:max-h-[calc(90vh-120px)]
            "
              >
                {/* Action Buttons */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Business Actions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage verification and status
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!selectedBusiness.isVerified && (
                          <Button
                            onClick={() =>
                              handleVerifyBusiness(selectedBusiness._id, true)
                            }
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Verify Business
                          </Button>
                        )}
                        {selectedBusiness.isVerified && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleVerifyBusiness(selectedBusiness._id, false)
                            }
                            disabled={loading}
                            className="text-red-600 border-red-600 hover:bg-red-50 shadow-md"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject Verification
                          </Button>
                        )}
                        {selectedBusiness.isActive && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleUpdateBusinessStatus(
                                selectedBusiness._id,
                                false
                              )
                            }
                            disabled={loading}
                            className="text-red-600 border-red-600 hover:bg-red-50 shadow-md"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Deactivate
                          </Button>
                        )}
                        {!selectedBusiness.isActive && (
                          <Button
                            onClick={() =>
                              handleUpdateBusinessStatus(
                                selectedBusiness._id,
                                true
                              )
                            }
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Description
                        </label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedBusiness.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Category
                          </label>
                          <div className="text-sm text-gray-900">
                            {getCategoryLabel(selectedBusiness.category)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Created
                          </label>
                          <div className="text-sm text-gray-900">
                            {formatDate(selectedBusiness.createdAt)}
                          </div>
                        </div>
                      </div>
                      {selectedBusiness.verificationNotes && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Verification Notes
                          </label>
                          <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            {selectedBusiness.verificationNotes}
                          </p>
                        </div>
                      )}
                      {selectedBusiness.deactivationReason && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Deactivation Reason
                          </label>
                          <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                            {selectedBusiness.deactivationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {selectedBusiness.owner.name.charAt(0)}
                        </span>
                      </div>
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Name
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedBusiness.owner.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <div className="text-sm text-gray-900">
                          <a
                            href={`mailto:${selectedBusiness.owner.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedBusiness.owner.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address & Contact */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-600" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {selectedBusiness.address.street}
                          </div>
                          <div>
                            {selectedBusiness.address.city},{" "}
                            {selectedBusiness.address.state}{" "}
                            {selectedBusiness.address.zipCode}
                          </div>
                          <div className="text-gray-600">
                            {selectedBusiness.address.country}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a
                            href={`tel:${selectedBusiness.phone}`}
                            className="text-sm text-gray-900 hover:text-blue-600 hover:underline"
                          >
                            {selectedBusiness.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a
                            href={`mailto:${selectedBusiness.email}`}
                            className="text-sm text-gray-900 hover:text-blue-600 hover:underline"
                          >
                            {selectedBusiness.email}
                          </a>
                        </div>
                        {selectedBusiness.website && (
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <a
                              href={selectedBusiness.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {selectedBusiness.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Services & Staff */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            S
                          </span>
                        </div>
                        Services ({selectedBusiness.stats.totalServices})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedBusiness.recentServices &&
                      selectedBusiness.recentServices.length > 0 ? (
                        <div className="space-y-3">
                          {selectedBusiness.recentServices.map((service) => (
                            <div
                              key={service._id}
                              className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                            >
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </span>
                                {service.description && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-purple-600">
                                ${service.price}
                              </span>
                            </div>
                          ))}
                          {selectedBusiness.stats.totalServices >
                            selectedBusiness.recentServices.length && (
                            <div className="text-center py-2">
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                +
                                {selectedBusiness.stats.totalServices -
                                  selectedBusiness.recentServices.length}{" "}
                                more services
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-gray-400 text-lg">📋</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            No services available
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Staff */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            👥
                          </span>
                        </div>
                        Staff ({selectedBusiness.stats.totalStaff})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedBusiness.recentStaff &&
                      selectedBusiness.recentStaff.length > 0 ? (
                        <div className="space-y-3">
                          {selectedBusiness.recentStaff.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {member.name}
                                </span>
                                <p className="text-xs text-gray-600">
                                  {member.role || member.email}
                                </p>
                              </div>
                            </div>
                          ))}
                          {selectedBusiness.stats.totalStaff >
                            selectedBusiness.recentStaff.length && (
                            <div className="text-center py-2">
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                +
                                {selectedBusiness.stats.totalStaff -
                                  selectedBusiness.recentStaff.length}{" "}
                                more staff
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-gray-400 text-lg">👥</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            No staff members
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
