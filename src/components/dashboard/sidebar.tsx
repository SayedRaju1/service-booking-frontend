"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import {
  Home,
  Calendar,
  User,
  LogOut,
  X,
  ChevronRight,
  Building,
  Users,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Role-based navigation configuration
const getNavigationByRole = (role: string) => {
  switch (role) {
    case "admin":
      return [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "User Management", href: "/admin/users", icon: Users },
        {
          name: "Business Management",
          href: "/admin/businesses",
          icon: Building,
        },
        {
          name: "Service Categories",
          href: "/admin/categories",
          icon: Briefcase,
        },
        {
          name: "System Bookings",
          href: "/admin/bookings",
          icon: Calendar,
        },
      ];

    case "service_provider":
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Business", href: "/dashboard/business", icon: Building },
        { name: "My Services", href: "/dashboard/services", icon: Briefcase },
        {
          name: "Customer Bookings",
          href: "/dashboard/bookings",
          icon: Calendar,
        },
        { name: "Staff Management", href: "/dashboard/staff", icon: Users },
        {
          name: "Business Analytics",
          href: "/dashboard/analytics",
          icon: BarChart3,
        },
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

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userRole = user?.role || "customer";
  const navigation = getNavigationByRole(userRole);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "service_provider":
        return "Service Provider";
      case "customer":
        return "Customer";
      default:
        return "User";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "service_provider":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Service Booking
            </Link>
          </div>

          {/* Back to Main App Link */}
          <div className="border-b border-gray-200 pb-4">
            <Link
              href="/"
              className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-2 rounded-md transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Main App
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              isActive ? "text-blue-600" : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* User section */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        userRole
                      )}`}
                    >
                      {getRoleDisplayName(userRole)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Service Booking
          </Link>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Back to Main App Link - Mobile */}
        <div className="border-b border-gray-200 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-2 rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Main App
          </Link>
        </div>

        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-6 py-4">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }
                      `}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    userRole
                  )}`}
                >
                  {getRoleDisplayName(userRole)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
