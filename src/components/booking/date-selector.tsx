"use client";

import { useState, useMemo } from "react";
import {
  formatDateToYYYYMMDD,
  isToday,
  isPastDate,
  isWeekend,
  getDayOfWeek,
} from "@/lib/utils/date-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { StaffWithAvailability } from "@/types/api";

interface DateSelectorProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  availableDates?: string[];
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  isLoading?: boolean;
  // Add new props for staff availability checking
  availableStaff?: StaffWithAvailability[];
  selectedServiceId?: string;
  // Add prop for date availability function
  isDateAvailable?: (date: string) => boolean;
}

export function DateSelector({
  onDateSelect,
  selectedDate,
  availableDates = [],
  businessHours,
  isLoading = false,
  availableStaff = [],
  selectedServiceId,
  isDateAvailable: hookIsDateAvailable,
}: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Generate calendar grid
    const calendar: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isPast: boolean;
      isWeekend: boolean;
    }> = [];

    // Add previous month's days to fill first week
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      calendar.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isPast: isPastDate(date),
        isWeekend: isWeekend(date),
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendar.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        isPast: isPastDate(date),
        isWeekend: isWeekend(date),
      });
    }

    // Add next month's days to fill last week
    const remainingDays = 42 - calendar.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      calendar.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isPast: isPastDate(date),
        isWeekend: isWeekend(date),
      });
    }

    return calendar;
  }, [currentMonth]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Check if a date is available for booking
  const isDateAvailable = (date: Date) => {
    const dateString = formatDateToYYYYMMDD(date);

    // Use the hook's isDateAvailable function if provided
    if (hookIsDateAvailable) {
      return hookIsDateAvailable(dateString);
    }

    // If no available dates specified, check business hours
    if (availableDates.length === 0 && businessHours) {
      const dayOfWeek = date
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase();
      return businessHours[dayOfWeek]?.isOpen && !isPastDate(date);
    }

    // Check against available dates
    if (availableDates.includes(dateString)) {
      return true;
    }

    // NEW: Check if staff are available for the selected service on this date
    if (selectedServiceId && availableStaff.length > 0) {
      const dayOfWeek = getDayOfWeek(dateString);
      // Map the day to match backend format (monday, tuesday, etc.)
      const backendDayOfWeek = dayOfWeek === "sunday" ? "sunday" : dayOfWeek;
      return availableStaff.some(
        (staff) =>
          staff.availability?.dayOfWeek === backendDayOfWeek &&
          staff.availability?.isAvailable
      );
    }

    return false;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date) && !isPastDate(date)) {
      onDateSelect(formatDateToYYYYMMDD(date));
    }
  };

  // Get month name and year
  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-80 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Date</h2>
        <p className="text-gray-600">
          Choose a date for your appointment from the available options
        </p>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => {
              const dateString = formatDateToYYYYMMDD(day.date);
              const isSelected = selectedDate === dateString;
              const isAvailable = isDateAvailable(day.date);
              const canSelect = isAvailable && !day.isPast;

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.date)}
                  disabled={!canSelect}
                  className={`
                    relative p-3 text-sm rounded-lg transition-all duration-200
                    ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    ${day.isToday ? "font-bold bg-blue-50 text-blue-600" : ""}
                    ${isSelected ? "bg-blue-500 text-white font-semibold" : ""}
                    ${
                      canSelect && !isSelected
                        ? "hover:bg-gray-100 cursor-pointer"
                        : ""
                    }
                    ${!canSelect ? "cursor-not-allowed opacity-50" : ""}
                    ${day.isPast ? "text-gray-400" : ""}
                  `}
                >
                  <span>{day.date.getDate()}</span>

                  {/* Availability indicator */}
                  {isAvailable && !day.isPast && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Weekend indicator */}
                  {day.isWeekend && !day.isPast && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">
                  Selected Date:{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                {businessHours && (
                  <p className="text-sm text-blue-700 mt-1">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Business Hours:{" "}
                    {(() => {
                      const dayOfWeek = new Date(selectedDate)
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase();
                      const hours = businessHours[dayOfWeek];
                      return hours?.isOpen
                        ? `${hours.open} - ${hours.close}`
                        : "Closed";
                    })()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Date Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Quick Selection</h4>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const quickDates = [];
            const today = new Date();

            // Next 7 days
            for (let i = 1; i <= 7; i++) {
              const date = new Date(today);
              date.setDate(today.getDate() + i);
              if (isDateAvailable(date)) {
                quickDates.push(date);
              }
            }

            return quickDates.slice(0, 5).map((date) => {
              const dateString = formatDateToYYYYMMDD(date);
              const isSelected = selectedDate === dateString;

              return (
                <Button
                  key={dateString}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateSelect(date)}
                  className="text-xs"
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Button>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
