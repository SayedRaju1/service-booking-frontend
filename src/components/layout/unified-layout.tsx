"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/ui/header";
import { DashboardSubHeader } from "@/components/dashboard/dashboard-sub-header";

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

export function UnifiedLayout({ children }: UnifiedLayoutProps) {
  const pathname = usePathname();

  // Determine if we should show the dashboard sub-header based on the current route
  const shouldShowDashboardHeader =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/customer");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header - always visible */}
      <Header />

      {/* Dashboard Sub-Header - only show on dashboard/admin pages */}
      {shouldShowDashboardHeader && <DashboardSubHeader />}

      {/* Page content */}
      <main className={`${shouldShowDashboardHeader ? "py-6" : ""}`}>
        <div
          className={`${
            shouldShowDashboardHeader
              ? "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
              : ""
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
