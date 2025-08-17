"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StaffManagement } from "@/components/dashboard/staff-management";

export default function StaffPage() {
  return (
    <DashboardLayout>
      <StaffManagement />
    </DashboardLayout>
  );
}
