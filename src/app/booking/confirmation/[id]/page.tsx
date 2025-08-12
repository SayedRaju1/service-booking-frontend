"use client";

import { Header } from "@/components/ui/header";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingConfirmation />
      </div>
    </div>
  );
}
