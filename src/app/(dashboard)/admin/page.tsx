import { DashboardLayout } from "@/components/dashboard";
import { AdminOverview } from "@/components/admin/admin-overview";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <AdminOverview />
    </DashboardLayout>
  );
}

