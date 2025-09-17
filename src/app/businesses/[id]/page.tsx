"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessApi } from "@/lib/api/business";
import { servicesApi } from "@/lib/api/services";
import { useState } from "react";
import { BookingFlow } from "@/components/booking/booking-flow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const {
    data: businessData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => businessApi.getBusiness(businessId),
    enabled: !!businessId,
  });

  const business = businessData?.data?.business;

  // Fetch services for this business
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["business-services", businessId],
    queryFn: () => servicesApi.getServicesByBusiness(businessId),
    enabled: !!businessId,
  });

  const services = servicesData?.data?.services || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Loading business details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business || !businessData?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              Failed to load business details. Please try again.
            </div>
            <Link href="/businesses">
              <Button>Back to Businesses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      salon: "bg-pink-100 text-pink-800",
      dental: "bg-blue-100 text-blue-800",
      beauty: "bg-purple-100 text-purple-800",
      spa: "bg-green-100 text-green-800",
      consulting: "bg-orange-100 text-orange-800",
      fitness: "bg-red-100 text-red-800",
      medical: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const handleBookNow = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {business.name}
                </h1>
                <Badge className={`${getCategoryColor(business.category)}`}>
                  {business.category}
                </Badge>
              </div>

              <p className="text-gray-600 mb-6">{business.description}</p>

              {/* Contact Info */}
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

                {business.contact?.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{business.contact.email}</span>
                  </div>
                )}

                {business.contact?.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-3 text-gray-400" />
                    <a
                      href={business.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {business.operatingHours && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">
                        {Object.values(business.operatingHours).some(
                          (hours) => (hours as { isOpen: boolean }).isOpen
                        )
                          ? "Open now"
                          : "Closed"}
                      </div>
                      <div className="text-sm">
                        Check hours for specific days
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Services Offered
            </h2>
            <Link href={`/services?businessId=${business._id}`}>
              <Button variant="outline" size="sm">
                View All Services
              </Button>
            </Link>
          </div>

          {servicesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className="text-gray-600">Loading services...</span>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {service.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {service.duration < 60
                            ? `${service.duration} min`
                            : `${Math.floor(service.duration / 60)}h ${
                                service.duration % 60
                              }min`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">
                          ${service.price}
                        </span>
                      </div>
                      {service.category && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Category:</span>
                          <Badge variant="secondary" className="text-xs">
                            {typeof service.category === "string"
                              ? service.category
                              : service.category.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/services/${service._id}`}>
                          View Details
                        </Link>
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookNow(service._id)}
                      >
                        Book Now
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                No services available at the moment
              </div>
              <Button variant="outline" asChild>
                <Link href="/services">Browse All Services</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 gap-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                About {business.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{business.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Book Appointment
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookingClose}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </DialogHeader>
          {selectedService && (
            <BookingFlow
              initialServiceId={selectedService}
              businessId={businessId}
              onClose={handleBookingClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
