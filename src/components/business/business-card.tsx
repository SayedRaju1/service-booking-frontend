"use client";

import Link from "next/link";
import { Star, MapPin, Clock, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Business } from "@/types/api";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
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
    <Link href={`/businesses/${business._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                {business.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {business.description}
              </CardDescription>
            </div>
            <Badge className={`ml-2 ${getCategoryColor(business.category)}`}>
              {business.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(business.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                {business.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-sm text-gray-500">
                ({business.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">
                {business.address.street}, {business.address.city}
              </span>
            </div>

            {/* Contact */}
            {business.contact?.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{business.contact.phone}</span>
              </div>
            )}

            {/* Hours */}
            {business.operatingHours && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>
                  {Object.values(business.operatingHours).some(
                    (hours) => hours.isOpen
                  )
                    ? "Open now"
                    : "Closed"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
