import { DashboardLayout } from "@/components/dashboard";
import { BusinessManagement } from "@/components/admin/business-management";

export default function AdminBusinessesPage() {
  return (
    <DashboardLayout>
      <BusinessManagement />
    </DashboardLayout>
  );
}

