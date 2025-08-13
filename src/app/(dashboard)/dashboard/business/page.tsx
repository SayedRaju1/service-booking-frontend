"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function BusinessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Business</h1>
          <p className="text-gray-600 mt-1">
            Manage your business profile, settings, and information
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
              The My Business section will be implemented in the next phase.
              You'll be able to update your business details, manage operating
              hours, edit contact information, and configure business-specific
              settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
