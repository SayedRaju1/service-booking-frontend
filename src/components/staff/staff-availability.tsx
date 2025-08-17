"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { staffApi } from "@/lib/api/staff";
import { Staff } from "@/types/api";

interface StaffAvailabilityProps {
  staffId: string;
  staffName: string;
  onClose?: () => void;
}

export function StaffAvailability({
  staffId,
  staffName,
  onClose,
}: StaffAvailabilityProps) {
  const queryClient = useQueryClient();
  const [availability, setAvailability] = useState({
    monday: { startTime: "09:00", endTime: "17:00", isAvailable: true },
    tuesday: { startTime: "09:00", endTime: "17:00", isAvailable: true },
    wednesday: { startTime: "09:00", endTime: "17:00", isAvailable: true },
    thursday: { startTime: "09:00", endTime: "17:00", isAvailable: true },
    friday: { startTime: "09:00", endTime: "17:00", isAvailable: true },
    saturday: { startTime: "10:00", endTime: "16:00", isAvailable: false },
    sunday: { startTime: "10:00", endTime: "16:00", isAvailable: false },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (data: any) => staffApi.updateStaffAvailability(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-staff"] });
      if (onClose) onClose();
    },
  });

  const handleSave = () => {
    updateAvailabilityMutation.mutate(availability);
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {staffName} - Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.key}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <div className="w-24">
                <span className="font-medium">{day.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    availability[day.key as keyof typeof availability]
                      .isAvailable
                  }
                  onChange={(e) => {
                    setAvailability((prev) => ({
                      ...prev,
                      [day.key]: {
                        ...prev[day.key as keyof typeof availability],
                        isAvailable: e.target.checked,
                      },
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Available</span>
              </div>

              {availability[day.key as keyof typeof availability]
                .isAvailable && (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      value={
                        availability[day.key as keyof typeof availability]
                          .startTime
                      }
                      onChange={(e) => {
                        setAvailability((prev) => ({
                          ...prev,
                          [day.key]: {
                            ...prev[day.key as keyof typeof availability],
                            startTime: e.target.value,
                          },
                        }));
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={
                        availability[day.key as keyof typeof availability]
                          .endTime
                      }
                      onChange={(e) => {
                        setAvailability((prev) => ({
                          ...prev,
                          [day.key]: {
                            ...prev[day.key as keyof typeof availability],
                            endTime: e.target.value,
                          },
                        }));
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </>
              )}

              {!availability[day.key as keyof typeof availability]
                .isAvailable && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-600"
                >
                  Unavailable
                </Badge>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={updateAvailabilityMutation.isPending}
              className="flex-1"
            >
              {updateAvailabilityMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Availability
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
