# Staff Management Integration

## Overview

This document describes the staff management integration that connects the booking system with staff availability and scheduling.

## Features Implemented

### 1. Staff API Integration (`src/lib/api/staff.ts`)

- **Complete CRUD operations** for staff management
- **Availability management** for each staff member
- **Service specialization** tracking
- **Rating and experience** tracking
- **Business-specific staff** filtering

### 2. Enhanced Booking Flow

- **Staff Selection**: Users can choose specific staff members during booking
- **Availability Checking**: Real-time staff availability verification
- **Service Matching**: Staff are filtered by service specialties

### 3. Staff Management Dashboard (`/dashboard/business/staff`)

- **Staff Overview**: Complete staff listing with stats
- **Performance Metrics**: Ratings, bookings, experience tracking
- **Role Management**: Admin, manager, staff role assignments
- **Status Management**: Active/inactive staff status

### 4. Availability Management

- **Weekly Schedule**: Set availability for each day of the week
- **Time Slots**: Configure start and end times for each day
- **Real-time Updates**: Instant availability updates

## API Endpoints

### Staff Management

```typescript
// Get all staff for a business
GET / businesses / { businessId } / staff;

// Get staff by ID
GET / staff / { staffId };

// Create new staff member
POST / staff;

// Update staff member
PUT / staff / { staffId };

// Delete staff member
DELETE / staff / { staffId };
```

### Availability Management

```typescript
// Get staff availability for a date
GET /staff/{staffId}/availability?date={date}

// Update staff availability
PUT /staff/{staffId}/availability

// Get available staff for a service
GET /services/{serviceId}/available-staff?date={date}&time={time}
```

## Data Models

### Staff Interface

```typescript
interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "staff" | "manager" | "admin";
  specialties?: string[]; // Service IDs they can perform
  business: string; // Business ID
  isActive: boolean;
  avatar?: string;
  bio?: string;
  experience?: number; // Years of experience
  rating?: number;
  totalBookings?: number;
  availability?: {
    [key: string]: {
      // Day of week (monday, tuesday, etc.)
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}
```

## Booking Flow Integration

### 1. Service Detail Page

- Shows available staff for the service
- Displays staff ratings and experience
- Links to staff profiles

### 2. Booking Form

- **Step 1**: Date selection
- **Step 2**: Time selection (based on staff availability)
- **Step 3**: Staff selection (optional)
- **Step 4**: Additional notes
- **Step 5**: Booking confirmation

### 3. Staff Selection Logic

```typescript
// Get available staff for service on specific date/time
const availableStaff = await staffApi.getAvailableStaffForService(
  serviceId,
  selectedDate,
  selectedTime
);
```

## Business Dashboard Integration

### Staff Management Section

- **Quick Stats**: Total staff, active staff, average rating, total bookings
- **Staff Cards**: Individual staff member information
- **Action Buttons**: Edit, delete, view availability
- **Status Indicators**: Active/inactive status badges

### Availability Management

- **Weekly Schedule**: Visual calendar for each staff member
- **Time Configuration**: Set working hours for each day
- **Real-time Updates**: Instant availability synchronization

## Mock Data Implementation

For testing purposes, the system includes mock data:

### Mock Staff Data

```typescript
const mockStaff: Staff[] = [
  {
    _id: "staff-1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    role: "staff",
    business: businessId,
    isActive: true,
    experience: 5,
    rating: 4.8,
    totalBookings: 156,
    bio: "Experienced massage therapist specializing in deep tissue and relaxation techniques.",
    specialties: ["massage", "spa"],
  },
  // ... more staff members
];
```

### Mock Time Slots

```typescript
// Generate mock time slots for weekdays
const mockTimeSlots = [];
const selectedDate = new Date(date);
const dayOfWeek = selectedDate.getDay();

if (dayOfWeek >= 1 && dayOfWeek <= 5) {
  // Monday to Friday
  for (let hour = 9; hour <= 17; hour++) {
    const timeString = `${hour.toString().padStart(2, "0")}:00`;
    mockTimeSlots.push(timeString);
  }
}
```

## Integration with Backend

### 1. Backend Requirements

The backend should implement these endpoints:

- `/staff` - Staff CRUD operations
- `/staff/{id}/availability` - Availability management
- `/services/{id}/available-staff` - Get available staff for service
- `/businesses/{id}/staff` - Get business staff

### 2. Data Synchronization

- **Real-time Updates**: Staff availability changes reflect immediately
- **Booking Conflicts**: Prevent double-booking of staff members
- **Service Matching**: Ensure staff can perform selected services

### 3. Business Logic

- **Availability Rules**: Staff can only be booked during their available hours
- **Service Specialization**: Staff are filtered by service capabilities
- **Booking Limits**: Prevent overbooking of staff members

## Future Enhancements

### 1. Advanced Scheduling

- **Recurring Availability**: Set weekly/monthly patterns
- **Break Times**: Configure lunch breaks and rest periods
- **Holiday Management**: Set holiday schedules

### 2. Staff Performance

- **Analytics Dashboard**: Track staff performance metrics
- **Commission Tracking**: Calculate staff earnings
- **Review System**: Customer reviews for individual staff

### 3. Communication

- **Staff Notifications**: Notify staff of new bookings
- **Calendar Integration**: Sync with external calendars
- **Mobile App**: Staff mobile app for schedule management

## Usage Instructions

### For Business Owners

1. Navigate to `/dashboard/business/staff`
2. Add staff members with their specialties
3. Set availability schedules for each staff member
4. Monitor staff performance and bookings

### For Customers

1. Browse services and select one
2. Choose date and time
3. Optionally select a specific staff member
4. Complete booking with staff assignment

### For Staff Members

1. View assigned bookings in dashboard
2. Update availability as needed
3. Track performance metrics
4. Manage service specializations

## Testing

The system includes comprehensive mock data for testing:

- Mock staff members with realistic data
- Mock time slots for weekdays
- Mock availability schedules
- Mock booking assignments

This allows full testing of the booking flow without requiring a complete backend implementation.
