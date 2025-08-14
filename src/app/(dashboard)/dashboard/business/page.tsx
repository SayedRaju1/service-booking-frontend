"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { BusinessManagement } from "@/components/dashboard/business-management";

export default function BusinessPage() {
  return (
    <DashboardLayout>
      <BusinessManagement />
    </DashboardLayout>
  );
}
