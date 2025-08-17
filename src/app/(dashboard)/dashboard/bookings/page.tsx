"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CustomerBookings } from "@/components/dashboard/customer-bookings";

export default function BookingsPage() {
  return (
    <DashboardLayout>
      <CustomerBookings />
    </DashboardLayout>
  );
}
