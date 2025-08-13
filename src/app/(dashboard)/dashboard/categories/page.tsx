"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Categories
          </h1>
          <p className="text-gray-600 mt-1">
            Manage service categories and classifications
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              The Service Categories section will be implemented in the next
              phase. You'll be able to create, edit, and manage service
              categories that businesses can use to organize their services.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
