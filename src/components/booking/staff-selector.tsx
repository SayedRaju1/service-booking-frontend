"use client";

import { useState } from "react";
import { StaffWithAvailability } from "@/types/api";
import { formatTimeTo12Hour } from "@/lib/utils/date-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Star,
  Calendar,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface StaffSelectorProps {
  staff: StaffWithAvailability[];
  onStaffSelect: (staff: StaffWithAvailability) => void;
  selectedStaff?: StaffWithAvailability | null;
  selectedDate?: string; // Add selected date prop
  isLoading?: boolean;
  error?: Error | null;
}

export function StaffSelector({
  staff,
  onStaffSelect,
  selectedStaff,
  selectedDate,
  isLoading = false,
  error = null,
}: StaffSelectorProps) {
  const [filterByAvailability, setFilterByAvailability] =
    useState<boolean>(false);

  // Normalize staff data to ensure availability is always an object
  const normalizedStaff = staff.map((member) => {
    // If availability is not an object, provide a default structure
    if (!member.availability || typeof member.availability !== "object") {
      console.warn(
        "Normalizing staff member availability:",
        member.name,
        member.availability
      );
      return {
        ...member,
        availability: undefined,
        existingBookings: 0,
        maxBookingsPerDay: 8,
      };
    }

    // Debug: Log the actual availability data for each staff member
    console.log(`👤 Staff ${member.name} availability:`, member.availability);

    return member;
  });

  // Get available dates for the next 7 days
  // const getAvailableDates = () => {
  //   const dates: string[] = [];
  //   const today = new Date();

  //   for (let i = 0; i < 7; i++) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() + i);
  //     dates.push(formatDateToYYYYMMDD(date));
  //   }

  //   return dates;
  // };

  const filteredStaff =
    selectedDate && filterByAvailability
      ? normalizedStaff.filter((member) => {
          const dayOfWeek = new Date(selectedDate)
            .toLocaleDateString("en-US", {
              weekday: "long",
            })
            .toLowerCase();
          // Add proper type checking for availability
          return (
            member.availability &&
            member.availability.dayOfWeek === dayOfWeek &&
            member.availability.isAvailable
          );
        })
      : normalizedStaff;

  const getAvailabilityStatus = (member: StaffWithAvailability) => {
    if (!selectedDate) return "unknown";

    const dayOfWeek = new Date(selectedDate)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    // Add proper type checking for availability
    if (!member.availability) {
      console.warn("Member availability is null:", member.availability);
      return "unknown";
    }

    // Check if the staff member is available on the selected day
    if (
      member.availability.dayOfWeek !== dayOfWeek ||
      !member.availability.isAvailable
    ) {
      return "unavailable";
    }

    if (
      member.existingBookings &&
      member.maxBookingsPerDay &&
      member.existingBookings >= member.maxBookingsPerDay
    )
      return "fully-booked";
    return "available";
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100";
      case "unavailable":
        return "text-red-600 bg-red-100";
      case "fully-booked":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "unavailable":
        return "Unavailable";
      case "fully-booked":
        return "Fully Booked";
      default:
        return "Check Availability";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
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
          Error loading staff
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Failed to load available staff members"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Staff Member
        </h2>
        <p className="text-gray-600">
          Choose from our available staff members for your appointment
        </p>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
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
              <p className="text-sm text-blue-700 mt-1">
                Showing staff available for this date
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toggle */}
      <div className="flex items-center justify-center">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterByAvailability}
            onChange={(e) => setFilterByAvailability(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Show only available staff
          </span>
        </label>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No staff members found
          </h3>
          <p className="text-gray-600">
            {filterByAvailability && selectedDate
              ? "No staff members are available on the selected date"
              : "No staff members are currently available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => {
            const isSelected = selectedStaff?._id === member._id;
            const availabilityStatus = getAvailabilityStatus(member);
            const availabilityColor = getAvailabilityColor(availabilityStatus);
            const availabilityText = getAvailabilityText(availabilityStatus);

            return (
              <Card
                key={member._id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:border-gray-300"
                } ${availabilityStatus === "unavailable" ? "opacity-60" : ""}`}
                onClick={() =>
                  availabilityStatus === "available" && onStaffSelect(member)
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={member.profileImage}
                          alt={member.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {member.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {member.position || "Staff Member"}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Rating */}
                  {member.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(member.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {member.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {/* Availability Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`${availabilityColor} text-xs`}>
                        {availabilityText}
                      </Badge>
                    </div>

                    {member.existingBookings && member.maxBookingsPerDay && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Bookings:</span>
                        <span className="font-medium">
                          {member.existingBookings}/{member.maxBookingsPerDay}
                        </span>
                      </div>
                    )}

                    {member.experience && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">
                          {member.experience} years
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Working Hours (if date is selected) */}
                  {selectedDate && member.availability && (
                    <div className="border-t pt-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Working Hours</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>
                          {formatTimeTo12Hour(member.availability.startTime)} -{" "}
                          {formatTimeTo12Hour(member.availability.endTime)}
                        </span>
                        {member.availability.breakStart &&
                          member.availability.breakEnd && (
                            <div className="text-xs text-gray-500 mt-1">
                              Break:{" "}
                              {formatTimeTo12Hour(
                                member.availability.breakStart
                              )}{" "}
                              -{" "}
                              {formatTimeTo12Hour(member.availability.breakEnd)}
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={isSelected ? "default" : "outline"}
                    disabled={availabilityStatus !== "available"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (availabilityStatus === "available") {
                        onStaffSelect(member);
                      }
                    }}
                  >
                    {isSelected
                      ? "Selected"
                      : availabilityStatus === "available"
                      ? "Select Staff Member"
                      : availabilityText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      {filteredStaff.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredStaff.length} of {staff.length} staff members
        </div>
      )}
    </div>
  );
}
