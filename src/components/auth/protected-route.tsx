"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "service_provider" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        if (user.role === "service_provider") {
          router.push("/dashboard/business");
        } else {
          router.push("/dashboard/customer");
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (
    !isAuthenticated ||
    (requiredRole && user && user.role !== requiredRole)
  ) {
    return null;
  }

  return <>{children}</>;
}
