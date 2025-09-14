"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  DollarSign,
  Calendar,
  Star,
  MapPin,
  Phone,
  ArrowLeft,
  User,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { servicesApi } from "@/lib/api/services";

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const {
    data: serviceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      console.log("Fetching service with ID:", serviceId);
      try {
        const result = await servicesApi.getService(serviceId);
        console.log("Service API response:", result);
        return result;
      } catch (err) {
        console.error("Error fetching service:", err);
        throw err;
      }
    },
    enabled: !!serviceId,
  });

  const service = serviceData?.data?.service;

  // Use business data directly from service response
  const business =
    typeof service?.business === "string" ? null : service?.business;

  // Log the service data for debugging
  console.log("Service data:", service);
  console.log("Business data:", business);

  // Check if service is active
  if (service && service.isActive === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-amber-600 mb-4">
              <div className="text-lg font-medium mb-2">
                Service Unavailable
              </div>
              <div className="text-sm text-gray-600 mb-4">
                This service is currently inactive and not available for
                booking.
              </div>
            </div>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Loading service details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Extract error details for better debugging
    const errorMessage =
      error instanceof Error
        ? error.message
        : (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.message ||
          "Failed to load service details";

    const errorStatus = (error as { response?: { status?: number } })?.response
      ?.status;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <div className="text-lg font-medium mb-2">
                {errorStatus === 404
                  ? "Service not found"
                  : "Failed to load service details"}
              </div>
              <div className="text-sm text-gray-600 mb-4">{errorMessage}</div>
              {errorStatus && (
                <div className="text-xs text-gray-500 mb-4">
                  Error Code: {errorStatus}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Link href="/services">
                <Button>Back to Services</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="ml-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if service data is properly structured (only after successful API call)
  if (serviceData && (!service || !service?._id || !service?.name)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <div className="text-lg font-medium mb-2">
                Invalid Service Data
              </div>
              <div className="text-sm text-gray-600 mb-4">
                The service data received is incomplete or malformed.
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Received data: {JSON.stringify(serviceData, null, 2)}
              </div>
            </div>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minutes`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/services">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>

        {/* Service Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {service?.name}
                  </h1>
                  <Badge variant="secondary" className="mb-3">
                    {typeof service?.category === "string"
                      ? service?.category
                      : service?.category?.name || "Uncategorized"}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(service?.price || 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDuration(service?.duration || 0)}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                {service?.description}
              </p>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm">
                      {formatDuration(service?.duration || 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Price</div>
                    <div className="text-sm">
                      {formatPrice(service?.price || 0)}
                    </div>
                  </div>
                </div>

                {service?.rating && (
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Rating</div>
                      <div className="text-sm">
                        {service?.rating.toFixed(1)} out of 5
                        {service.reviewCount &&
                          ` (${service.reviewCount} reviews)`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/booking?serviceId=${service?._id}&businessId=${
                  typeof service?.business === "string"
                    ? service?.business
                    : service?.business._id || service?.business.id
                }`}
              >
                <Button size="lg" className="flex items-center gap-2 w-full">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Contact Provider
              </Button>
            </div>
          </div>
        </div>

        {/* Business Information */}
        {business && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Service Provider
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {business.name}
                </CardTitle>
                <CardDescription>{business.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {business.address.street}
                        </div>
                        <div className="text-sm">
                          {business.address.city}, {business.address.state}{" "}
                          {business.address.zipCode}
                        </div>
                      </div>
                    </div>
                  )}

                  {business.contact?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{business.contact.phone}</span>
                    </div>
                  )}

                  {business.rating && (
                    <div className="flex items-center text-gray-600">
                      <Star className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {business.rating.toFixed(1)} out of 5
                        </div>
                        <div className="text-sm">
                          Based on {business.totalReviews || 0} reviews
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Link href={`/businesses/${business.id || business._id}`}>
                    <Button variant="outline" size="sm">
                      View Business Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What&apos;s Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional service delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quality materials and equipment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Experienced staff
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Clean and safe environment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Easy online booking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Flexible appointment times
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Confirmation via email/SMS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cancellation policy available
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  Reviews will be available soon
                </div>
                <Button variant="outline">View All Reviews</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Information - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8">
            <details className="bg-gray-100 rounded-lg p-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Debug Information (Development Only)
              </summary>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Service ID: {serviceId}</div>
                <div>Service Active: {service?.isActive ? "Yes" : "No"}</div>
                <div>
                  Business ID:{" "}
                  {typeof service?.business === "string"
                    ? service?.business
                    : service?.business?._id}
                </div>
                <div>
                  Category ID:{" "}
                  {typeof service?.category === "string"
                    ? service.category
                    : service?.category?._id}
                </div>
                <div>API Response: {JSON.stringify(serviceData, null, 2)}</div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
