"use client";

import { useAuthStore } from "@/stores/auth";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CustomerOverview } from "@/components/dashboard/customer-overview";
import { ServiceProviderOverview } from "@/components/dashboard/service-provider-overview";
import { AdminOverview } from "@/components/dashboard/admin-overview";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const userRole = user?.role || "customer";

  const renderOverviewByRole = () => {
    switch (userRole) {
      case "admin":
        return <AdminOverview />;
      case "service_provider":
        return <ServiceProviderOverview />;
      case "customer":
      default:
        return <CustomerOverview />;
    }
  };

  return <DashboardLayout>{renderOverviewByRole()}</DashboardLayout>;
}
