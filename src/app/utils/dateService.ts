/**
 * Returns the weekday 2 days from today (skipping weekends)
 * @returns The name of the weekday (e.g., "Monday", "Tuesday", etc.)
 */
export function getNextWeekday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let daysToAdd = 2;

  // If today is Thursday (4), 2 weekdays later is Monday (add 4 days to skip weekend)
  if (dayOfWeek === 4) {
    daysToAdd = 4;
  }
  // If today is Friday (5), 2 weekdays later is Tuesday (add 4 days to skip weekend)
  else if (dayOfWeek === 5) {
    daysToAdd = 4;
  }
  // If today is Saturday (6), 2 weekdays later is Tuesday (add 3 days to skip Sunday)
  else if (dayOfWeek === 6) {
    daysToAdd = 3;
  }
  // If today is Sunday (0), 2 weekdays later is Tuesday (add 2 days)
  else if (dayOfWeek === 0) {
    daysToAdd = 2;
  }
  // Otherwise (Mon, Tue, Wed), just add 2 days
  else {
    daysToAdd = 2;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[nextDate.getDay()];
}

/**
 * Returns formatted text for arrival timing
 * @returns String like "by Monday", "by Tuesday", etc.
 */
export function getArrivalByText(): string {
  return `by ${getNextWeekday()}`;
}

/**
 * Returns just the weekday name (for shortened display)
 * @returns String like "Monday", "Tuesday", etc.
 */
export function getNextWeekdayName(): string {
  return getNextWeekday();
}

/**
 * Calculates the number of days until the next weekday (2 weekdays from today)
 */
export function getDaysUntilNextWeekday(): number {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // If today is Thursday (4), 2 weekdays later is Monday (4 days)
  if (dayOfWeek === 4) {
    return 4;
  }
  // If today is Friday (5), 2 weekdays later is Tuesday (4 days)
  else if (dayOfWeek === 5) {
    return 4;
  }
  // If today is Saturday (6), 2 weekdays later is Tuesday (3 days)
  else if (dayOfWeek === 6) {
    return 3;
  }
  // If today is Sunday (0), 2 weekdays later is Tuesday (2 days)
  else if (dayOfWeek === 0) {
    return 2;
  }
  // Otherwise (Mon, Tue, Wed), just add 2 days
  else {
    return 2;
  }
}

/**
 * Returns the ordinal suffix for a day (e.g., "st", "nd", "rd", "th")
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Formats a date as "October 3rd" or "November 6th"
 * Returns a React node with superscript ordinals
 */
function formatDate(date: Date): string {
  const day = date.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];

  return `${month} ${day}${getOrdinalSuffix(day)}`;
}

/**
 * Formats a date as JSX with superscript ordinals
 * Returns object with month, day, and suffix for rendering
 */
export function formatDateParts(date: Date): { month: string; day: number; suffix: string } {
  const day = date.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const suffix = getOrdinalSuffix(day);

  return { month, day, suffix };
}

/**
 * Returns the Monday of the following week
 * If today is weekend, returns the Monday after next (not the coming Monday)
 * @returns Formatted date string like "October 3rd"
 */
export function getNextWeekMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let daysToAdd: number;

  // If today is Saturday (6) or Sunday (0), get Monday of week after next
  if (dayOfWeek === 0) {
    // Sunday: add 8 days to get to Monday of week after next
    daysToAdd = 8;
  } else if (dayOfWeek === 6) {
    // Saturday: add 9 days to get to Monday of week after next
    daysToAdd = 9;
  } else {
    // Monday (1) through Friday (5): get next Monday
    // Days until next Monday: (8 - dayOfWeek) gets us to next week's Monday
    daysToAdd = 8 - dayOfWeek;
  }

  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysToAdd);

  return formatDate(nextMonday);
}

/**
 * Returns date parts for the Monday of the following week
 */
export function getNextWeekMondayParts(): { month: string; day: number; suffix: string } {
  const today = new Date();
  const dayOfWeek = today.getDay();

  let daysToAdd: number;

  if (dayOfWeek === 0) {
    daysToAdd = 8;
  } else if (dayOfWeek === 6) {
    daysToAdd = 9;
  } else {
    daysToAdd = 8 - dayOfWeek;
  }

  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysToAdd);

  return formatDateParts(nextMonday);
}

/**
 * Returns the 1st of next month, or first Monday if 1st falls on weekend
 * @returns Formatted date string like "November 3rd" or "December 1st"
 */
export function getNextMonthFirst(): string {
  const today = new Date();

  // Get first day of next month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const dayOfWeek = nextMonth.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // If 1st falls on Saturday (6), move to Monday (add 2 days)
  if (dayOfWeek === 6) {
    nextMonth.setDate(nextMonth.getDate() + 2);
  }
  // If 1st falls on Sunday (0), move to Monday (add 1 day)
  else if (dayOfWeek === 0) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }
  // Otherwise, 1st is a weekday, keep it as is

  return formatDate(nextMonth);
}

/**
 * Returns date parts for the 1st of next month (or first Monday)
 */
export function getNextMonthFirstParts(): { month: string; day: number; suffix: string } {
  const today = new Date();

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const dayOfWeek = nextMonth.getDay();

  if (dayOfWeek === 6) {
    nextMonth.setDate(nextMonth.getDate() + 2);
  } else if (dayOfWeek === 0) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  return formatDateParts(nextMonth);
}

/**
 * Returns date parts with short month name for the 1st of next month (or first Monday)
 */
export function getNextMonthFirstPartsShort(): { month: string; day: number; suffix: string } {
  const today = new Date();

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const dayOfWeek = nextMonth.getDay();

  if (dayOfWeek === 6) {
    nextMonth.setDate(nextMonth.getDate() + 2);
  } else if (dayOfWeek === 0) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  const day = nextMonth.getDate();
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = shortMonths[nextMonth.getMonth()];
  const suffix = getOrdinalSuffix(day);

  return { month, day, suffix };
}
