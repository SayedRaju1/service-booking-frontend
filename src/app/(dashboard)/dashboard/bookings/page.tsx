"use client";

import { useAuthStore } from "@/stores/auth";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CustomerBookings } from "@/components/dashboard/customer-bookings";
import { MyBookings } from "@/components/dashboard/my-bookings";

export default function BookingsPage() {
  const { user } = useAuthStore();
  const userRole = user?.role || "customer";

  const renderBookingsByRole = () => {
    switch (userRole) {
      case "service_provider":
        return <CustomerBookings />;
      case "customer":
      default:
        return <MyBookings />;
    }
  };

  return <DashboardLayout>{renderBookingsByRole()}</DashboardLayout>;
}
