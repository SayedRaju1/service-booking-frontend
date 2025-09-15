"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BookingFlow } from "./booking-flow";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  businessId: string;
  onSuccess?: (bookingId: string) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  serviceId,
  businessId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSuccess,
}: BookingModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBooking, setIsBooking] = useState(false);

  const handleCancel = () => {
    if (!isBooking) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Book Appointment</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isBooking}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <BookingFlow
            businessId={businessId}
            initialServiceId={serviceId}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
