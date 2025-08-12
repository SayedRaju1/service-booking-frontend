/**
 * Date and Time Utility Functions
 * Used throughout the staff-based booking system
 */

/**
 * Get the day of week from a date string
 * @param date - ISO date string or Date object
 * @returns day of week in lowercase (monday, tuesday, etc.)
 */
export function getDayOfWeek(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[dateObj.getDay()];
}

/**
 * Format a date to YYYY-MM-DD format
 * @param date - Date object or date string
 * @returns formatted date string
 */
export function formatDateToYYYYMMDD(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

/**
 * Format a time string to 12-hour format
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @returns formatted time string (e.g., "2:30 PM")
 */
export function formatTimeTo12Hour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a time string to 24-hour format
 * @param time - Time string in 12-hour format (e.g., "2:30 PM")
 * @returns formatted time string (e.g., "14:30")
 */
export function formatTimeTo24Hour(time: string): string {
  const date = new Date(`2000-01-01 ${time}`);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns boolean indicating if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return formatDateToYYYYMMDD(dateObj) === formatDateToYYYYMMDD(today);
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns boolean indicating if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
}

/**
 * Get the next available date (skipping past dates)
 * @param startDate - Starting date
 * @param maxDays - Maximum number of days to look ahead
 * @returns next available date
 */
export function getNextAvailableDate(
  startDate: Date = new Date(),
  maxDays: number = 30
): Date {
  const date = new Date(startDate);
  let daysChecked = 0;

  while (daysChecked < maxDays) {
    if (!isPastDate(date)) {
      return date;
    }
    date.setDate(date.getDate() + 1);
    daysChecked++;
  }

  return date;
}

/**
 * Convert minutes to hours and minutes format
 * @param minutes - Total minutes
 * @returns formatted string (e.g., "1h 30min")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Add minutes to a time string
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @param minutes - Minutes to add
 * @returns new time string
 */
export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Check if a time is between two other times
 * @param time - Time to check
 * @param startTime - Start time
 * @param endTime - End time
 * @returns boolean indicating if time is within range
 */
export function isTimeBetween(
  time: string,
  startTime: string,
  endTime: string
): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

/**
 * Convert time string to minutes since midnight
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @returns minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 * @param minutes - Minutes since midnight
 * @returns time string in 24-hour format
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Generate time slots between start and end time
 * @param startTime - Start time (e.g., "09:00")
 * @param endTime - End time (e.g., "17:00")
 * @param duration - Duration of each slot in minutes
 * @param bufferTime - Buffer time between slots in minutes
 * @returns array of time slot strings
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  bufferTime: number = 0
): string[] {
  const slots: string[] = [];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const totalDuration = duration + bufferTime;

  for (
    let time = startMinutes;
    time + duration <= endMinutes;
    time += totalDuration
  ) {
    slots.push(minutesToTime(time));
  }

  return slots;
}

/**
 * Check if a date is a weekend
 * @param date - Date to check
 * @returns boolean indicating if date is weekend
 */
export function isWeekend(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = dateObj.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Get business days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns array of business dates
 */
export function getBusinessDays(startDate: Date, endDate: Date): Date[] {
  const businessDays: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      businessDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}
