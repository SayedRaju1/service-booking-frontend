"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Award,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessApi } from "@/lib/api/business";

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;

  const {
    data: businessData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => businessApi.getBusinessById(businessId),
    enabled: !!businessId,
  });

  const business = businessData?.data;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/businesses">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Businesses
            </Button>
          </Link>
        </div>

        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  <Badge className={`${getCategoryColor(business.category)}`}>
                    {business.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(business.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {business.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-gray-600">
                    ({business.totalReviews || 0} reviews)
                  </span>
                </div>
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
                          (hours: { isOpen: boolean }) => hours.isOpen
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
              <Button size="lg" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Button>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Services Offered
          </h2>
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              Services will be available soon
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <Link href={`/services?businessId=${business._id}`}>
                  View All Services
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/services">Browse All Services</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Reviews Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(business.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {business.rating?.toFixed(1) || "0.0"} out of 5
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {business.totalReviews || 0} reviews
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
