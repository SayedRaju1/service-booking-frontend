"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function BusinessesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Business Management
          </h1>
          <p className="text-gray-600 mt-1">
            Approve and manage all registered businesses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              The Business Management section will be implemented in the next
              phase. You&apos;ll be able to approve new business registrations,
              manage existing businesses, and handle business-related
              administrative tasks here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
