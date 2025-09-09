import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffBookingApi, bookingsApi } from "@/lib/api";
import {
  Service,
  StaffWithAvailability,
  TimeSlot,
  CreateBookingRequest,
  ApiResponse,
  AvailableStaffResponse,
} from "@/types/api";
import { formatDateToYYYYMMDD, getDayOfWeek } from "@/lib/utils/date-time";

/**
 * Custom hook for managing staff-based booking state and API calls
 */
export function useStaffBooking() {
  const queryClient = useQueryClient();

  // Booking flow state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] =
    useState<StaffWithAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState<
    "service" | "staff" | "date" | "time" | "confirm"
  >("service");

  // Get available staff for selected service and date
  const {
    data: availableStaffData,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useQuery({
    queryKey: ["available-staff", selectedService?._id, selectedDate],
    queryFn: () =>
      staffBookingApi.getAvailableStaffForService(
        selectedService!._id,
        selectedDate
      ),
    enabled: !!selectedService?._id && !!selectedDate,
  });

  // NEW: Get available staff for the next 30 days to show available dates
  const {
    data: availableStaffForDatesData,
    isLoading: isLoadingStaffForDates,
  } = useQuery({
    queryKey: ["available-staff-dates", selectedService?._id],
    queryFn: async () => {
      if (!selectedService?._id) return null;

      // Fetch available staff for the next 30 days
      const today = new Date();
      const dates: string[] = [];
      const staffPromises: Promise<ApiResponse<AvailableStaffResponse>>[] = [];

      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = formatDateToYYYYMMDD(date);
        dates.push(dateString);

        // Fetch staff availability for each date
        staffPromises.push(
          staffBookingApi.getAvailableStaffForService(
            selectedService._id,
            dateString
          )
        );
      }

      try {
        const results = await Promise.all(staffPromises);
        return {
          dates,
          staffData: results.map((result, index) => ({
            date: dates[index],
            staff: result.data?.availableStaff || [],
          })),
        };
      } catch (error) {
        console.error("Error fetching staff availability for dates:", error);
        return null;
      }
    },
    enabled: !!selectedService?._id,
  });

  // Get time slots for selected staff, service, and date
  const {
    data: timeSlotsData,
    isLoading: isLoadingTimeSlots,
    error: timeSlotsError,
  } = useQuery({
    queryKey: [
      "staff-time-slots",
      selectedStaff?._id,
      selectedService?._id,
      selectedDate,
    ],
    queryFn: () =>
      staffBookingApi.getStaffTimeSlots(
        selectedStaff!._id,
        selectedDate,
        selectedService!._id
      ),
    enabled: !!selectedStaff?._id && !!selectedService?._id && !!selectedDate,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingRequest) =>
      bookingsApi.createStaffBasedBooking(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["available-staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-time-slots"] });

      // Reset form state
      resetBookingState();
    },
    onError: (error) => {
      // The error will be handled by the component using the enhanced error object
      console.error("Booking creation failed:", error);
    },
  });

  // Service selection
  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedStaff(null);
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setCurrentStep("date");
  }, []);

  // Staff selection - now moves to time step after date is already selected
  const handleStaffSelect = useCallback((staff: StaffWithAvailability) => {
    setSelectedStaff(staff);
    // Keep the selected date, don't reset it
    setSelectedTimeSlot(null);
    setCurrentStep("time");
  }, []);

  // Date selection - now triggers staff availability check
  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    // Don't automatically move to time step - let user see available staff first
    setCurrentStep("staff");
  }, []);

  // Time slot selection
  const handleTimeSlotSelect = useCallback((timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep("confirm");
  }, []);

  // Go to previous step
  const goToPreviousStep = useCallback(() => {
    switch (currentStep) {
      case "date":
        setCurrentStep("service");
        break;
      case "staff":
        setCurrentStep("date");
        break;
      case "time":
        setCurrentStep("staff");
        break;
      case "confirm":
        setCurrentStep("time");
        break;
      default:
        break;
    }
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((step: typeof currentStep) => {
    setCurrentStep(step);
  }, []);

  // Create booking
  const createBooking = useCallback(
    async (notes?: string) => {
      if (!selectedService || !selectedStaff || !selectedTimeSlot) {
        throw new Error("Missing required booking information");
      }

      const bookingData: CreateBookingRequest = {
        serviceId: selectedService._id,
        businessId:
          typeof selectedService.business === "string"
            ? selectedService.business
            : selectedService.business._id,
        staffId: selectedStaff._id,
        appointmentDate: selectedTimeSlot.start,
        notes: notes || "",
      };

      return createBookingMutation.mutateAsync(bookingData);
    },
    [selectedService, selectedStaff, selectedTimeSlot, createBookingMutation]
  );

  // Reset all booking state
  const resetBookingState = useCallback(() => {
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setCurrentStep("service");
  }, []);

  // Check if we can proceed to next step
  const canProceedToNextStep = useCallback(() => {
    switch (currentStep) {
      case "service":
        return !!selectedService;
      case "staff":
        return !!selectedStaff && !!selectedDate; // Need both staff and date
      case "date":
        return !!selectedDate;
      case "time":
        return !!selectedTimeSlot;
      case "confirm":
        return (
          !!selectedService &&
          !!selectedStaff &&
          !!selectedDate &&
          !!selectedTimeSlot
        );
      default:
        return false;
    }
  }, [
    currentStep,
    selectedService,
    selectedStaff,
    selectedDate,
    selectedTimeSlot,
  ]);

  // Get available dates for the next 30 days
  const getAvailableDates = useCallback(() => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(formatDateToYYYYMMDD(date));
    }

    return dates;
  }, []);

  // Check if a date is available (has available staff)
  const isDateAvailable = useCallback(
    (date: string) => {
      console.log("🔍 Checking availability for date:", date);

      // First check if we have pre-fetched data for this date
      if (availableStaffForDatesData) {
        console.log("📅 Using pre-fetched data:", availableStaffForDatesData);
        const dateData = availableStaffForDatesData.staffData.find(
          (item: { date: string; staff: StaffWithAvailability[] }) =>
            item.date === date
        );
        console.log("📅 Found date data:", dateData);
        if (dateData && dateData.staff.length > 0) {
          console.log("✅ Date available via pre-fetched data");
          return true;
        }
      }

      // Fallback to checking against available staff data for selected date
      if (!availableStaffData?.data?.availableStaff) {
        console.log("❌ No available staff data for selected date");
        return false;
      }

      const dayOfWeek = getDayOfWeek(date);
      console.log("📅 Day of week:", dayOfWeek);
      console.log(
        "👥 Available staff data:",
        availableStaffData.data.availableStaff
      );

      const hasAvailableStaff = availableStaffData.data.availableStaff.some(
        (staff) => {
          console.log(
            "👤 Checking staff:",
            staff.name,
            "availability:",
            staff.availability
          );
          // Check if staff has availability for the selected day
          return (
            staff.availability &&
            staff.availability.dayOfWeek === dayOfWeek &&
            staff.availability.isAvailable
          );
        }
      );

      console.log("✅ Has available staff:", hasAvailableStaff);
      return hasAvailableStaff;
    },
    [availableStaffForDatesData, availableStaffData]
  );

  return {
    // State
    selectedService,
    selectedStaff,
    selectedDate,
    selectedTimeSlot,
    currentStep,

    // Data
    availableStaff: availableStaffData?.data?.availableStaff || [],
    timeSlots: timeSlotsData?.data?.timeSlots || [],
    staffAvailability: timeSlotsData?.data?.availability,
    availableStaffForDates: availableStaffForDatesData,

    // Loading states
    isLoadingStaff,
    isLoadingTimeSlots,
    isLoadingStaffForDates,
    isCreatingBooking: createBookingMutation.isPending,

    // Errors
    staffError,
    timeSlotsError,
    bookingError: createBookingMutation.error,

    // Actions
    handleServiceSelect,
    handleStaffSelect,
    handleDateSelect,
    handleTimeSlotSelect,
    goToPreviousStep,
    goToStep,
    createBooking,
    resetBookingState,

    // Utilities
    canProceedToNextStep,
    getAvailableDates,
    isDateAvailable,

    // Mutations
    createBookingMutation,
  };
}
