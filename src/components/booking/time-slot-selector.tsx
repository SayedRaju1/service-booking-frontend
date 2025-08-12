"use client";

import { useState, useMemo } from "react";
import { TimeSlot } from "@/types/api";
import { formatTimeTo12Hour, formatDuration } from "@/lib/utils/date-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  User,
  Info,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  selectedTimeSlot?: TimeSlot | null;
  staffName?: string;
  serviceName?: string;
  selectedDate?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function TimeSlotSelector({
  timeSlots,
  onTimeSlotSelect,
  selectedTimeSlot,
  staffName,
  serviceName,
  selectedDate,
  isLoading = false,
  error = null,
}: TimeSlotSelectorProps) {
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter time slots based on time of day
  const filteredTimeSlots = useMemo(() => {
    if (timeFilter === "all") return timeSlots;

    return timeSlots.filter((slot) => {
      const hour = new Date(slot.start).getHours();
      switch (timeFilter) {
        case "morning":
          return hour >= 6 && hour < 12;
        case "afternoon":
          return hour >= 12 && hour < 17;
        case "evening":
          return hour >= 17 && hour < 21;
        default:
          return true;
      }
    });
  }, [timeSlots, timeFilter]);

  // Group time slots by time periods
  const groupedTimeSlots = useMemo(() => {
    const groups: { [key: string]: TimeSlot[] } = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    filteredTimeSlots.forEach((slot) => {
      const hour = new Date(slot.start).getHours();
      if (hour >= 6 && hour < 12) {
        groups.morning.push(slot);
      } else if (hour >= 12 && hour < 17) {
        groups.afternoon.push(slot);
      } else if (hour >= 17 && hour < 21) {
        groups.evening.push(slot);
      }
    });

    return groups;
  }, [filteredTimeSlots]);

  // Get time period label
  const getTimePeriodLabel = (period: string) => {
    switch (period) {
      case "morning":
        return "Morning (6 AM - 12 PM)";
      case "afternoon":
        return "Afternoon (12 PM - 5 PM)";
      case "evening":
        return "Evening (5 PM - 9 PM)";
      default:
        return period;
    }
  };

  // Get time period icon
  const getTimePeriodIcon = (period: string) => {
    switch (period) {
      case "morning":
        return "🌅";
      case "afternoon":
        return "☀️";
      case "evening":
        return "🌆";
      default:
        return "🕐";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading time slots
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Failed to load available time slots"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No time slots available
        </h3>
        <p className="text-gray-600">
          There are no available time slots for the selected date and staff
          member. Please try a different date or staff member.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Time Slot
        </h2>
        <p className="text-gray-600">
          Choose from the available time slots for your appointment
        </p>
      </div>

      {/* Appointment Summary */}
      {(staffName || serviceName || selectedDate) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {staffName && (
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    <strong>Staff:</strong> {staffName}
                  </span>
                </div>
              )}
              {serviceName && (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    <strong>Service:</strong> {serviceName}
                  </span>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and View Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Time of Day:
          </span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Times</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex border border-gray-300 rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-r border-gray-300"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Time Slots Display */}
      {viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredTimeSlots.map((slot, index) => {
            const isSelected = selectedTimeSlot?.start === slot.start;
            const startTime = new Date(slot.start);
            const endTime = new Date(slot.end);

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`h-20 flex flex-col items-center justify-center p-2 ${
                  isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                }`}
                onClick={() => onTimeSlotSelect(slot)}
                disabled={!slot.available}
              >
                <div className="text-lg font-semibold">
                  {formatTimeTo12Hour(
                    startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDuration(slot.duration)}
                </div>
                {!slot.available && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Unavailable
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {Object.entries(groupedTimeSlots).map(([period, slots]) => {
            if (slots.length === 0) return null;

            return (
              <Card key={period}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>{getTimePeriodIcon(period)}</span>
                    {getTimePeriodLabel(period)}
                    <Badge variant="secondary" className="text-xs">
                      {slots.length} slots
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {slots.map((slot, index) => {
                      const isSelected = selectedTimeSlot?.start === slot.start;
                      const startTime = new Date(slot.start);
                      const endTime = new Date(slot.end);

                      return (
                        <Button
                          key={index}
                          variant={isSelected ? "default" : "outline"}
                          className={`justify-start h-12 ${
                            isSelected
                              ? "ring-2 ring-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => onTimeSlotSelect(slot)}
                          disabled={!slot.available}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">
                              {formatTimeTo12Hour(
                                startTime.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({formatDuration(slot.duration)})
                            </span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Selected Time Slot Info */}
      {selectedTimeSlot && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">
                  Selected Time:{" "}
                  {formatTimeTo12Hour(
                    new Date(selectedTimeSlot.start).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )
                  )}
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Duration: {formatDuration(selectedTimeSlot.duration)} | End
                  Time:{" "}
                  {formatTimeTo12Hour(
                    new Date(selectedTimeSlot.end).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredTimeSlots.length} of {timeSlots.length} time slots
        {timeFilter !== "all" && ` for ${timeFilter} time`}
      </div>
    </div>
  );
}
