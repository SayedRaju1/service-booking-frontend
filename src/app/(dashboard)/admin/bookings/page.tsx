import { DashboardLayout } from "@/components/dashboard";
import { SystemBookings } from "@/components/admin/system-bookings";

export default function AdminBookingsPage() {
  return (
    <DashboardLayout>
      <SystemBookings />
    </DashboardLayout>
  );
}
