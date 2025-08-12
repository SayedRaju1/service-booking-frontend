"use client";

import { useState } from "react";
import { Service, StaffWithAvailability, TimeSlot } from "@/types/api";
import { formatTimeTo12Hour, formatDuration } from "@/lib/utils/date-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Edit3,
} from "lucide-react";

interface BookingConfirmationProps {
  service: Service;
  staff: StaffWithAvailability;
  selectedDate: string;
  timeSlot: TimeSlot;
  onConfirm: (notes?: string) => Promise<void>;
  onEdit: (step: "service" | "staff" | "date" | "time") => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function BookingConfirmation({
  service,
  staff,
  selectedDate,
  timeSlot,
  onConfirm,
  onEdit,
  isLoading = false,
  error = null,
}: BookingConfirmationProps) {
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate total duration including buffer time
  const totalDuration = service.duration + (service.bufferTime || 0);

  // Format the appointment date and time
  const appointmentDateTime = new Date(timeSlot.start);
  const formattedDate = appointmentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = formatTimeTo12Hour(
    appointmentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  // Handle booking confirmation
  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(notes);
    } catch (error) {
      console.error("Booking confirmation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-80 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error confirming booking
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Failed to confirm your booking. Please try again."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirm Your Booking
        </h2>
        <p className="text-gray-600">
          Please review your appointment details before confirming
        </p>
      </div>

      {/* Booking Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Info className="h-5 w-5" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Details */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">
                ${service.price}
              </div>
              <div className="text-sm text-gray-500">
                {formatDuration(service.duration)}
              </div>
            </div>
          </div>

          {/* Staff Details */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{staff.name}</h4>
                <p className="text-sm text-gray-600">
                  {staff.position || "Staff Member"}
                </p>
                {staff.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">
                      {staff.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(staff.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit("staff")}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Change
            </Button>
          </div>

          {/* Date and Time Details */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{formattedDate}</h4>
                <p className="text-sm text-gray-600">
                  {formattedTime} ({formatDuration(totalDuration)} total)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  End time:{" "}
                  {formatTimeTo12Hour(
                    new Date(timeSlot.end).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit("date")}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes (Optional)</CardTitle>
          <p className="text-sm text-gray-600">
            Add any special requests or notes for your appointment
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Please call when you arrive, I have allergies to certain products, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Service Price</span>
              <span className="font-medium">${service.price}</span>
            </div>
            {service.bufferTime && service.bufferTime > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Buffer Time ({formatDuration(service.bufferTime)})</span>
                <span>Included</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">${service.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Payment will be processed at the time of service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <h4 className="font-medium mb-2">Important Information</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Please arrive 10 minutes before your appointment time</li>
                <li>Cancellations must be made at least 24 hours in advance</li>
                <li>Late arrivals may result in reduced service time</li>
                <li>Bring any required documents or forms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => onEdit("service")}
          className="flex-1"
          disabled={isSubmitting}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Change Service
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>

      {/* Terms and Conditions */}
      <div className="text-center text-xs text-gray-500">
        By confirming this booking, you agree to our{" "}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
