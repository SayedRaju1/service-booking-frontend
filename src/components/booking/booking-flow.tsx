"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useStaffBooking } from "@/hooks/useStaffBooking";
import { servicesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { ServiceSelector } from "./service-selector";
import { StaffSelector } from "./staff-selector";
import { DateSelector } from "./date-selector";
import { TimeSlotSelector } from "./time-slot-selector";
import { BookingConfirmation } from "./booking-confirmation";

interface BookingFlowProps {
  businessId?: string;
  initialServiceId?: string;
  onClose?: () => void;
}

export function BookingFlow({
  businessId: propBusinessId,
  initialServiceId,
  onClose,
}: BookingFlowProps) {
  const params = useParams();
  const router = useRouter();
  const businessId = propBusinessId || (params.businessId as string);

  // Get business services
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["business-services", businessId],
    queryFn: () => servicesApi.getServicesByBusiness(businessId),
    enabled: !!businessId,
  });

  const services = useMemo(
    () => servicesData?.data?.services || [],
    [servicesData?.data?.services]
  );

  // Use the custom hook for booking state management
  const {
    selectedService,
    selectedStaff,
    selectedDate,
    selectedTimeSlot,
    currentStep,
    availableStaff,
    timeSlots,
    isLoadingStaff,
    isLoadingTimeSlots,
    isCreatingBooking,
    staffError,
    timeSlotsError,
    bookingError,
    handleServiceSelect,
    handleStaffSelect,
    handleDateSelect,
    handleTimeSlotSelect,
    goToPreviousStep,
    goToStep,
    createBooking,
    canProceedToNextStep,
    isDateAvailable,
  } = useStaffBooking();

  // Set initial service if provided
  useEffect(() => {
    if (initialServiceId && services.length > 0) {
      const service = services.find((s) => s._id === initialServiceId);
      if (service) {
        handleServiceSelect(service);
      }
    }
  }, [initialServiceId, services, handleServiceSelect]);

  // Handle step navigation
  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      switch (currentStep) {
        case "service":
          goToStep("date");
          break;
        case "date":
          goToStep("staff");
          break;
        case "staff":
          goToStep("time");
          break;
        case "time":
          goToStep("confirm");
          break;
        default:
          break;
      }
    }
  };

  // Handle step editing
  const handleEditStep = (step: "service" | "date" | "staff" | "time") => {
    goToStep(step);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (notes?: string) => {
    try {
      const result = await createBooking(notes);
      // Use the real booking ID returned from the backend
      // The API returns data.booking._id, not data._id
      if (result?.data?.booking?._id) {
        router.push(`/booking/success?bookingId=${result.data.booking._id}`);
      } else {
        // Fallback if no booking ID (shouldn't happen in normal flow)
        console.error("No booking ID returned from backend", result);
        router.push("/booking/success?error=no-booking-id");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      // Error is handled by the hook
    }
  };

  // Get step information
  const getStepInfo = () => {
    const steps = [
      { key: "service", label: "Service", description: "Choose a service" },
      { key: "date", label: "Date", description: "Pick appointment date" },
      { key: "staff", label: "Staff", description: "Select staff member" },
      { key: "time", label: "Time", description: "Choose time slot" },
      { key: "confirm", label: "Confirm", description: "Review & confirm" },
    ];

    return steps.map((step, index) => ({
      ...step,
      index,
      isActive: step.key === currentStep,
      isCompleted: steps.findIndex((s) => s.key === currentStep) > index,
      isAccessible: index <= steps.findIndex((s) => s.key === currentStep),
    }));
  };

  const stepInfo = getStepInfo();
  const currentStepIndex = stepInfo.findIndex(
    (step) => step.key === currentStep
  );

  // Loading state for initial services
  if (isLoadingServices) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Services
          </h2>
          <p className="text-gray-600">
            Please wait while we load the available services...
          </p>
        </div>
      </div>
    );
  }

  // No services available
  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Services Available
          </h2>
          <p className="text-gray-600 mb-6">
            This business doesn&apos;t have any services available for booking
            at the moment.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h1>
              <p className="text-sm text-gray-600">
                Step {currentStepIndex + 1} of {stepInfo.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:block w-64">
              <Progress
                value={((currentStepIndex + 1) / stepInfo.length) * 100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {stepInfo.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.isCompleted
                        ? "bg-green-500 text-white"
                        : step.isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {index < stepInfo.length - 1 && (
                  <div className="mx-4 w-3 sm:w-8 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Content */}
          <div className="mb-8">
            {currentStep === "service" && (
              <ServiceSelector
                services={services}
                onServiceSelect={handleServiceSelect}
                selectedService={selectedService}
                isLoading={isLoadingServices}
              />
            )}

            {currentStep === "date" && selectedService && (
              <DateSelector
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                availableStaff={availableStaff}
                selectedServiceId={selectedService._id}
                isDateAvailable={isDateAvailable}
              />
            )}

            {currentStep === "staff" && selectedService && selectedDate && (
              <StaffSelector
                staff={availableStaff}
                onStaffSelect={handleStaffSelect}
                selectedStaff={selectedStaff}
                selectedDate={selectedDate}
                isLoading={isLoadingStaff}
                error={staffError}
              />
            )}

            {currentStep === "time" &&
              selectedDate &&
              selectedStaff &&
              selectedService && (
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedTimeSlot={selectedTimeSlot}
                  staffName={selectedStaff.name}
                  serviceName={selectedService?.name}
                  selectedDate={selectedDate}
                  serviceDuration={selectedService?.duration}
                  isLoading={isLoadingTimeSlots}
                  error={timeSlotsError}
                />
              )}

            {currentStep === "confirm" &&
              selectedTimeSlot &&
              selectedService &&
              selectedStaff && (
                <BookingConfirmation
                  service={selectedService}
                  staff={selectedStaff}
                  selectedDate={selectedDate}
                  timeSlot={selectedTimeSlot}
                  onConfirm={handleConfirmBooking}
                  onEdit={handleEditStep}
                  isLoading={isCreatingBooking}
                  error={bookingError}
                />
              )}
          </div>

          {/* Navigation Buttons */}
          {currentStep !== "confirm" && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === "service"}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {currentStep === "service" && (
                  <Button
                    variant="outline"
                    onClick={onClose || (() => router.back())}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className="flex items-center gap-2"
                >
                  {currentStep === "time" ? "Review Booking" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Error Display - Only show for staff and time slot errors, not booking errors */}
          {(staffError || timeSlotsError) && (
            <Card className="mt-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-900">Error</h4>
                    <p className="text-sm text-red-700 mt-1">
                      {staffError?.message ||
                        timeSlotsError?.message ||
                        "An error occurred"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
