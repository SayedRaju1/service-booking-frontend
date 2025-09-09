"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ExternalLink,
  Shield,
  User,
  Building2,
} from "lucide-react";

interface RoleRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "admin" | "service_provider" | "customer" | null;
}

export function RoleRestrictionModal({
  isOpen,
  onClose,
  userRole,
}: RoleRestrictionModalProps) {
  const router = useRouter();

  const getRoleInfo = () => {
    switch (userRole) {
      case "admin":
        return {
          icon: Shield,
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          title: "Admin Account Detected",
          description:
            "You're currently logged in as an administrator. Only customer accounts can make bookings through this interface.",
          suggestions: [
            "Switch to a customer account to make bookings",
            "Use the admin dashboard to manage existing bookings",
            "Contact support if you need to test the booking system",
          ],
          primaryAction: {
            label: "Go to Admin Dashboard",
            onClick: () => {
              router.push("/admin");
              onClose();
            },
          },
          secondaryAction: {
            label: "Switch Account",
            onClick: () => {
              router.push("/login");
              onClose();
            },
          },
        };
      case "service_provider":
        return {
          icon: Building2,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          title: "Service Provider Account Detected",
          description:
            "You're currently logged in as a service provider. Only customer accounts can make bookings through this interface.",
          suggestions: [
            "Switch to a customer account to make bookings",
            "Use your dashboard to manage your services and availability",
            "Contact support if you need assistance",
          ],
          primaryAction: {
            label: "Go to Dashboard",
            onClick: () => {
              router.push("/dashboard");
              onClose();
            },
          },
          secondaryAction: {
            label: "Switch Account",
            onClick: () => {
              router.push("/login");
              onClose();
            },
          },
        };
      default:
        return {
          icon: User,
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100",
          title: "Booking Not Allowed",
          description:
            "Only customer accounts can make bookings. Please log in with a customer account to proceed.",
          suggestions: [
            "Log in with a customer account",
            "Create a new customer account if you don't have one",
            "Contact support if you believe this is an error",
          ],
          primaryAction: {
            label: "Go to Login",
            onClick: () => {
              router.push("/login");
              onClose();
            },
          },
          secondaryAction: {
            label: "Create Account",
            onClick: () => {
              router.push("/register");
              onClose();
            },
          },
        };
    }
  };

  const roleInfo = getRoleInfo();
  const IconComponent = roleInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-full ${roleInfo.iconBg} flex items-center justify-center`}
            >
              <IconComponent className={`h-5 w-5 ${roleInfo.iconColor}`} />
            </div>
            <DialogTitle className="text-left">{roleInfo.title}</DialogTitle>
          </div>
          <DialogDescription className="text-left text-base leading-relaxed">
            {roleInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              What you can do:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              {roleInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={roleInfo.secondaryAction.onClick}
            className="w-full sm:w-auto"
          >
            {roleInfo.secondaryAction.label}
          </Button>
          <Button
            onClick={roleInfo.primaryAction.onClick}
            className="w-full sm:w-auto"
          >
            {roleInfo.primaryAction.label}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
