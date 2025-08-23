import { DashboardLayout } from "@/components/dashboard";
import { ServiceCategoriesManagement } from "@/components/admin/service-categories-management";

export default function AdminCategoriesPage() {
  return (
    <DashboardLayout>
      <ServiceCategoriesManagement />
    </DashboardLayout>
  );
}

