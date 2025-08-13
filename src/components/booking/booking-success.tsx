"use client";

import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BookingSuccessProps {
  booking: {
    _id: string;
    appointmentDate: string;
    appointmentTime: string;
    totalAmount: number;
    notes?: string;
  };
  service: {
    name: string;
    duration: number;
  };
  business: {
    name: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  onClose?: () => void;
}

export function BookingSuccess({
  booking,
  service,
  business,
  onClose,
}: BookingSuccessProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600">
              Your appointment has been successfully scheduled.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-gray-600">
                  {format(
                    new Date(booking.appointmentDate),
                    "EEEE, MMMM d, yyyy"
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-gray-600">
                  {booking.appointmentTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Service</div>
                <div className="text-sm text-gray-600">{service.name}</div>
                <div className="text-xs text-gray-500">
                  {formatDuration(service.duration)}
                </div>
              </div>
            </div>

            {business.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-gray-600">
                    {business.name}
                    <br />
                    {business.address.street}
                    <br />
                    {business.address.city}, {business.address.state}{" "}
                    {business.address.zipCode}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-blue-600">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            )}
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  window.location.href = "/";
                }
              }}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
