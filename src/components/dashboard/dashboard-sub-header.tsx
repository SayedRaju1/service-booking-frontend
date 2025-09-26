"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import {
  Home,
  Calendar,
  User,
  Building,
  Users,
  BarChart3,
  Briefcase,
} from "lucide-react";

// Role-based navigation configuration
const getNavigationByRole = (role: string) => {
  switch (role) {
    case "admin":
      return [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Businesses", href: "/admin/businesses", icon: Building },
        { name: "Categories", href: "/admin/categories", icon: Briefcase },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
      ];

    case "service_provider":
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Business", href: "/dashboard/business", icon: Building },
        { name: "Services", href: "/dashboard/services", icon: Briefcase },
        { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
        { name: "Staff", href: "/dashboard/staff", icon: Users },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Profile", href: "/dashboard/profile", icon: User },
      ];

    case "customer":
    default:
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
        { name: "Profile", href: "/dashboard/profile", icon: User },
      ];
  }
};

export function DashboardSubHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const userRole = user?.role || "customer";
  const navigation = getNavigationByRole(userRole);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto py-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <item.icon
                  className={`h-4 w-4 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
