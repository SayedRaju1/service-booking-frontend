import { DashboardLayout } from "@/components/dashboard";
import { UserManagement } from "@/components/admin/user-management";

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
}

