"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { servicesApi } from "@/lib/api/services";
import { serviceCategoriesApi } from "@/lib/api/service-categories";
import { Service } from "@/types/api";
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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ServiceFormData = Partial<Service>;

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
];

export function ServicesManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [deleteConfirmService, setDeleteConfirmService] =
    useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: 60,
    price: 0,
    currency: "USD",
    category: "",
    isActive: true,
    isFeatured: false,
    maxBookingsPerDay: 10,
    bufferTime: 0,
  });

  const queryClient = useQueryClient();

  // Fetch services and categories
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["my-business-services"],
    queryFn: servicesApi.getMyBusinessServices,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["service-categories"],
    queryFn: serviceCategoriesApi.getCategories,
  });

  const services = servicesData?.data?.services || [];
  const categories = Array.isArray(categoriesData?.data?.categories)
    ? categoriesData.data.categories
    : [];

  // Show error if categories failed to load
  if (categoriesData && !Array.isArray(categoriesData?.data?.categories)) {
    console.error("Unexpected categories data structure:", categoriesData);
  }

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => servicesApi.createService(data),
    onSuccess: (response) => {
      const message = response?.message || "Service created successfully!";
      toast.success(message);
      setIsCreating(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["my-business-services"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to create service";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid service data provided";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) =>
      servicesApi.updateService(id, data),
    onSuccess: (response) => {
      const message = response?.message || "Service updated successfully!";
      toast.success(message);
      setEditingService(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["my-business-services"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update service";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 403) {
          errorMessage = "You are not authorized to update this service";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "Service not found";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid service data provided";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: (response) => {
      const message = response?.message || "Service deleted successfully!";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["my-business-services"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to delete service";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 403) {
          errorMessage = "You are not authorized to delete this service";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "Service not found";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 60,
      price: 0,
      currency: "USD",
      category: "",
      isActive: true,
      isFeatured: false,
      maxBookingsPerDay: 10,
      bufferTime: 0,
    });
  };

  const handleInputChange = (
    field: keyof ServiceFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateService = () => {
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (categories.length === 0) {
      toast.error("No service categories available. Please try again later.");
      return;
    }
    createServiceMutation.mutate(formData);
  };

  const handleUpdateService = (id: string) => {
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (categories.length === 0) {
      toast.error("No service categories available. Please try again later.");
      return;
    }
    updateServiceMutation.mutate({ id, data: formData });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      currency: service.currency || "USD",
      category:
        typeof service.category === "string"
          ? service.category
          : service.category._id,
      isActive: service.isActive ?? true,
      isFeatured: service.isFeatured ?? false,
      maxBookingsPerDay: service.maxBookingsPerDay || 10,
      bufferTime: service.bufferTime || 0,
    });
  };

  const handleDeleteService = (service: Service) => {
    setDeleteConfirmService(service);
  };

  const confirmDeleteService = () => {
    if (deleteConfirmService) {
      deleteServiceMutation.mutate(deleteConfirmService._id);
      setDeleteConfirmService(null);
    }
  };

  const cancelDeleteService = () => {
    setDeleteConfirmService(null);
  };

  const cancelEdit = () => {
    setEditingService(null);
    resetForm();
  };

  const cancelCreate = () => {
    setIsCreating(false);
    resetForm();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    const symbol = CURRENCIES.find((c) => c.value === currency)?.symbol || "$";
    return `${symbol}${price.toFixed(2)}`;
  };

  if (servicesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Services Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your business services, pricing, and availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {services.length} Services
          </Badge>
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Add Service
            </Button>
          )}
        </div>
      </div>

      {/* Service Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-blue-600 font-medium">
                  Total Services
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-900">
                  {services.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-green-600 font-medium">
                  Featured
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-900">
                  {services.filter((s) => s.isFeatured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-purple-600 font-medium">
                  Active
                </p>
                <p className="text-lg sm:text-xl font-bold text-purple-900">
                  {services.filter((s) => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-orange-600 font-medium">
                  Avg Price
                </p>
                <p className="text-lg sm:text-xl font-bold text-orange-900">
                  {services.length > 0
                    ? formatPrice(
                        services.reduce((sum, s) => sum + s.price, 0) /
                          services.length
                      )
                    : "$0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Service Form */}
      {(isCreating || editingService) && (
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-900">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              {isCreating ? "Create New Service" : "Edit Service"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Service Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Hair Cut, Dental Cleaning"
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
                  value={formData.category as string}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {categoriesLoading
                          ? "Loading categories..."
                          : "No categories available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {categories.length === 0 && !categoriesLoading && (
                  <div className="text-xs text-red-500 mt-1">
                    {categoriesError ? (
                      <div className="flex items-center gap-2">
                        <span>Failed to load categories.</span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["service-categories"],
                            })
                          }
                          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700"
                        >
                          Try again
                        </Button>
                      </div>
                    ) : (
                      "No service categories available. Please contact support."
                    )}
                  </div>
                )}
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
                placeholder="Describe your service in detail..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700"
                >
                  Duration (minutes) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Min: 15m, Max: 8h</p>
              </div>
              <div>
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700"
                >
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="currency"
                  className="text-sm font-medium text-gray-700"
                >
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="maxBookingsPerDay"
                  className="text-sm font-medium text-gray-700"
                >
                  Max Bookings Per Day
                </Label>
                <Input
                  id="maxBookingsPerDay"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxBookingsPerDay}
                  onChange={(e) =>
                    handleInputChange(
                      "maxBookingsPerDay",
                      parseInt(e.target.value)
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="bufferTime"
                  className="text-sm font-medium text-gray-700"
                >
                  Buffer Time (minutes)
                </Label>
                <Input
                  id="bufferTime"
                  type="number"
                  min="0"
                  max="60"
                  value={formData.bufferTime}
                  onChange={(e) =>
                    handleInputChange("bufferTime", parseInt(e.target.value))
                  }
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Time between appointments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleInputChange("isFeatured", checked)
                  }
                />
                <Label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured
                </Label>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                onClick={
                  isCreating
                    ? handleCreateService
                    : () => handleUpdateService(editingService!)
                }
                disabled={
                  createServiceMutation.isPending ||
                  updateServiceMutation.isPending
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createServiceMutation.isPending ||
                updateServiceMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isCreating ? "Create Service" : "Update Service"}
              </Button>
              <Button
                variant="outline"
                onClick={isCreating ? cancelCreate : cancelEdit}
                disabled={
                  createServiceMutation.isPending ||
                  updateServiceMutation.isPending
                }
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Services</h2>
          {services.length === 0 && (
            <p className="text-sm text-gray-500">No services created yet</p>
          )}
        </div>

        {services.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <Card
                key={service._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {service.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {service.isFeatured && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 text-xs"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!service.isActive && (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 text-xs"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatDuration(service.duration)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(service.price, service.currency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      Max: {service.maxBookingsPerDay || "Unlimited"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Buffer: {service.bufferTime || 0}m
                    </div>
                  </div>

                  {service.category && typeof service.category !== "string" && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="h-4 w-4" />
                      {service.category.name}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service)}
                      disabled={editingService === service._id}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service)}
                      disabled={deleteServiceMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmService}
        onOpenChange={() => setDeleteConfirmService(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>&ldquo;{deleteConfirmService?.name}&rdquo;</strong>? This
              action cannot be undone and will remove the service from your
              business.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={cancelDeleteService}
              disabled={deleteServiceMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteService}
              disabled={deleteServiceMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteServiceMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
