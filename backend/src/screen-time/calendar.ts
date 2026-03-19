export const SCREEN_TIME_TIMEZONE = "Asia/Ulaanbaatar";
const SCREEN_TIME_SUBMISSION_WEEKDAY = 5;

type LocalDateParts = {
  year: number;
  month: number;
  day: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getLocalDateParts(
  date: Date,
  timeZone = SCREEN_TIME_TIMEZONE,
): LocalDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "0");
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");
  return { year, month, day };
}

export function formatLocalDateString(
  parts: LocalDateParts,
): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

export function getTodayLocalDateString(
  now = new Date(),
  timeZone = SCREEN_TIME_TIMEZONE,
): string {
  return formatLocalDateString(getLocalDateParts(now, timeZone));
}

export function normalizeLocalDateOverride(
  override?: string | null,
): string | null {
  if (!override) return null;
  const match = override.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function resolveTodayLocalDateString(
  override?: string | null,
  now = new Date(),
  timeZone = SCREEN_TIME_TIMEZONE,
): string {
  return normalizeLocalDateOverride(override) ?? getTodayLocalDateString(now, timeZone);
}

export function getCurrentMonthKey(
  now = new Date(),
  timeZone = SCREEN_TIME_TIMEZONE,
): string {
  const parts = getLocalDateParts(now, timeZone);
  return `${parts.year}-${pad2(parts.month)}`;
}

export function parseMonthKey(monthKey: string): {
  year: number;
  month: number;
} {
  const match = monthKey.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    throw new Error("monthKey must be in YYYY-MM format.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid monthKey.");
  }

  return { year, month };
}

export function getMonthKeyFromDateString(dateString: string): string {
  return dateString.slice(0, 7);
}

export function compareDateStrings(left: string, right: string): number {
  return left.localeCompare(right);
}

function parseDateString(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error("dateString must be in YYYY-MM-DD format.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    throw new Error("Invalid dateString.");
  }

  return { year, month, day };
}

function addUtcDays(dateString: string, deltaDays: number): string {
  const { year, month, day } = parseDateString(dateString);
  const utcDate = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return formatLocalDateString({
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
  });
}

function getMonthStartDate(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey);
  return `${year}-${pad2(month)}-01`;
}

function getMonthEndDate(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${pad2(month)}-${pad2(daysInMonth)}`;
}

export function getScreenTimeWindowForSlotDate(slotDate: string): {
  startDate: string;
  endDate: string;
} {
  return {
    startDate: addUtcDays(slotDate, -6),
    endDate: slotDate,
  };
}

export function getAssignedMonthKeyForSlotDate(slotDate: string): string {
  const { startDate, endDate } = getScreenTimeWindowForSlotDate(slotDate);
  const counts = new Map<string, number>();

  let cursor = startDate;
  while (compareDateStrings(cursor, endDate) <= 0) {
    const monthKey = getMonthKeyFromDateString(cursor);
    counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
    cursor = addUtcDays(cursor, 1);
  }

  const sorted = [...counts.entries()].sort((left, right) => {
    if (left[1] !== right[1]) return right[1] - left[1];
    return left[0].localeCompare(right[0]);
  });
  return sorted[0]?.[0] ?? getMonthKeyFromDateString(slotDate);
}

function isSubmissionWeekday(dateString: string): boolean {
  const { year, month, day } = parseDateString(dateString);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay() === SCREEN_TIME_SUBMISSION_WEEKDAY;
}

export function getFridaySlotDates(monthKey: string): string[] {
  const dates: string[] = [];
  const scanStart = addUtcDays(getMonthStartDate(monthKey), -6);
  const scanEnd = addUtcDays(getMonthEndDate(monthKey), 6);

  let cursor = scanStart;
  while (compareDateStrings(cursor, scanEnd) <= 0) {
    if (
      isSubmissionWeekday(cursor) &&
      getAssignedMonthKeyForSlotDate(cursor) === monthKey
    ) {
      dates.push(cursor);
    }
    cursor = addUtcDays(cursor, 1);
  }

  return dates;
}

export function getDueFridaySlotDates(
  monthKey: string,
  todayLocalDate: string,
): string[] {
  const slotDates = getFridaySlotDates(monthKey);
  const todayMonthKey = getMonthKeyFromDateString(todayLocalDate);

  if (monthKey > todayMonthKey) return [];
  if (monthKey < todayMonthKey) return slotDates;

  return slotDates.filter((slotDate) => compareDateStrings(slotDate, todayLocalDate) <= 0);
}

export function getActiveFridaySlotDate(
  monthKey: string,
  todayLocalDate: string,
): string | null {
  if (!isSubmissionWeekday(todayLocalDate)) return null;
  if (getAssignedMonthKeyForSlotDate(todayLocalDate) !== monthKey) return null;
  return todayLocalDate;
}

export function isMonthClosed(
  monthKey: string,
  todayLocalDate: string,
): boolean {
  const todayMonthKey = getMonthKeyFromDateString(todayLocalDate);
  if (monthKey < todayMonthKey) return true;
  if (monthKey > todayMonthKey) return false;

  const slotDates = getFridaySlotDates(monthKey);
  const lastSlotDate = slotDates[slotDates.length - 1];
  if (!lastSlotDate) return false;

  return compareDateStrings(todayLocalDate, lastSlotDate) > 0;
}
