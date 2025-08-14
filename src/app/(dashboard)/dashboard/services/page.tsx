"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ServicesManagement } from "@/components/dashboard/services-management";

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <ServicesManagement />
    </DashboardLayout>
  );
}
