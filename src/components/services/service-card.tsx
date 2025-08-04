"use client";

import Link from "next/link";
import { Clock, DollarSign, Calendar, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/api";

interface ServiceCardProps {
  service: Service;
  businessName?: string;
  showBusinessInfo?: boolean;
}

export function ServiceCard({
  service,
  businessName,
  showBusinessInfo = false,
}: ServiceCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {service.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
              {service.description}
            </CardDescription>
            {showBusinessInfo && (
              <div className="text-xs text-gray-500 mt-2">
                {businessName ||
                  (typeof service.business === "string"
                    ? service.business
                    : service.business.name)}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="ml-2">
            {typeof service.category === "string"
              ? service.category
              : service.category.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Price and Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-semibold text-lg text-gray-900">
                  {formatPrice(service.price)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>{formatDuration(service.duration)}</span>
              </div>
            </div>
          </div>

          {/* Rating (if available) */}
          {service.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(service.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                {service.rating?.toFixed(1) || "0.0"}
              </span>
              {service.reviewCount && (
                <span className="text-sm text-gray-500">
                  ({service.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 flex items-center gap-2"
              asChild
            >
              <Link href={`/services/${service._id}`}>
                <Calendar className="h-4 w-4" />
                Book Now
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/services/${service._id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
