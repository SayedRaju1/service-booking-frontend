"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { BookingFlow } from "@/components/booking/booking-flow";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const businessId = searchParams.get("businessId");

  if (!serviceId || !businessId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              Missing required booking information. Please select a service to
              book.
            </div>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Flow */}
        <BookingFlow initialServiceId={serviceId} businessId={businessId} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we load the booking page.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
