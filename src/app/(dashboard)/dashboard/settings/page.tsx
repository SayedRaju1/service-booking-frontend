"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Shield,
  Globe,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingReminders: boolean;
  promotionalEmails: boolean;
  reminderTime: "1_hour" | "2_hours" | "1_day" | "2_days";
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends_only";
  showEmail: boolean;
  showPhone: boolean;
  allowContactFromBusinesses: boolean;
}

interface PreferencesSettings {
  language: "en" | "es" | "fr" | "de";
  timezone: string;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  theme: "light" | "dark" | "system";
}

export default function CustomerSettingsPage() {
  const { logout, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingReminders: true,
      promotionalEmails: false,
      reminderTime: "1_day",
    });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowContactFromBusinesses: true,
  });

  const [preferencesSettings, setPreferencesSettings] =
    useState<PreferencesSettings>({
      language: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: "USD",
      theme: "system",
    });

  const queryClient = useQueryClient();

  // Update settings mutation (using the new updateSettings function)
  const updateSettingsMutation = useMutation({
    mutationFn: (data: {
      notifications: NotificationSettings;
      privacy: PrivacySettings;
      preferences: PreferencesSettings;
    }) => authApi.updateSettings(data),
    onSuccess: (response) => {
      if (response.data?.user) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setIsSaving(false);
        setHasUnsavedChanges(false);
        setSaveStatus("success");
        // Reset success status after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      setIsSaving(false);
      setSaveStatus("error");
      // Reset error status after 5 seconds
      setTimeout(() => setSaveStatus("idle"), 5000);
    },
  });

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean | string
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePrivacyChange = (
    key: keyof PrivacySettings,
    value: boolean | string
  ) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePreferenceChange = (
    key: keyof PreferencesSettings,
    value: string
  ) => {
    setPreferencesSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      await updateSettingsMutation.mutateAsync({
        notifications: notificationSettings,
        privacy: privacySettings,
        preferences: preferencesSettings,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const timezoneOptions = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings, notifications, and preferences
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSaveAll} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        {/* Save Status Messages */}
        {saveStatus === "success" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span>Settings saved successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {saveStatus === "error" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Error saving settings. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Notification Channels
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("pushNotifications", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Notification Types
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="booking-reminders">Booking Reminders</Label>
                    <Switch
                      id="booking-reminders"
                      checked={notificationSettings.bookingReminders}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("bookingReminders", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promotional-emails">
                      Promotional Emails
                    </Label>
                    <Switch
                      id="promotional-emails"
                      checked={notificationSettings.promotionalEmails}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("promotionalEmails", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Reminder Time</Label>
                  <Select
                    value={notificationSettings.reminderTime}
                    onValueChange={(value) =>
                      handleNotificationChange("reminderTime", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_hour">1 hour before</SelectItem>
                      <SelectItem value="2_hours">2 hours before</SelectItem>
                      <SelectItem value="1_day">1 day before</SelectItem>
                      <SelectItem value="2_days">2 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Profile Visibility
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">
                      Profile Visibility
                    </Label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value) =>
                        handlePrivacyChange("profileVisibility", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends_only">
                          Friends Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-email">Show Email to Others</Label>
                    <Switch
                      id="show-email"
                      checked={privacySettings.showEmail}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("showEmail", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-phone">Show Phone to Others</Label>
                    <Switch
                      id="show-phone"
                      checked={privacySettings.showPhone}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("showPhone", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Contact Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-business-contact">
                      Allow Business Contact
                    </Label>
                    <Switch
                      id="allow-business-contact"
                      checked={privacySettings.allowContactFromBusinesses}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange(
                          "allowContactFromBusinesses",
                          checked
                        )
                      }
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your privacy settings help control
                    how much information is visible to other users and
                    businesses on the platform.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Language & Region</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={preferencesSettings.language}
                      onValueChange={(value) =>
                        handlePreferenceChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={preferencesSettings.timezone}
                      onValueChange={(value) =>
                        handlePreferenceChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezoneOptions.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={preferencesSettings.currency}
                      onValueChange={(value) =>
                        handlePreferenceChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Appearance</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={preferencesSettings.theme}
                      onValueChange={(value) =>
                        handlePreferenceChange("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Theme changes will be applied
                    immediately. System theme follows your device&apos;s
                    appearance settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Logout</h4>
                  <p className="text-sm text-red-700">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div>
                  <h4 className="font-medium text-yellow-900">
                    Delete Account
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
