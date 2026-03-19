export const SCREEN_TIME_TIMEZONE = "Asia/Ulaanbaatar";

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

export function getMondaySlotDates(monthKey: string): string[] {
  const { year, month } = parseMonthKey(monthKey);
  const dates: string[] = [];
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    if (utcDate.getUTCDay() === 1) {
      dates.push(`${year}-${pad2(month)}-${pad2(day)}`);
    }
  }

  return dates;
}

export function getDueMondaySlotDates(
  monthKey: string,
  todayLocalDate: string,
): string[] {
  const slotDates = getMondaySlotDates(monthKey);
  const todayMonthKey = getMonthKeyFromDateString(todayLocalDate);

  if (monthKey > todayMonthKey) return [];
  if (monthKey < todayMonthKey) return slotDates;

  return slotDates.filter((slotDate) => compareDateStrings(slotDate, todayLocalDate) <= 0);
}

export function getActiveMondaySlotDate(
  monthKey: string,
  todayLocalDate: string,
): string | null {
  const todayMonthKey = getMonthKeyFromDateString(todayLocalDate);
  if (todayMonthKey !== monthKey) return null;

  const slotDates = getMondaySlotDates(monthKey);
  return slotDates.includes(todayLocalDate) ? todayLocalDate : null;
}

export function isMonthClosed(
  monthKey: string,
  todayLocalDate: string,
): boolean {
  const todayMonthKey = getMonthKeyFromDateString(todayLocalDate);
  if (monthKey < todayMonthKey) return true;
  if (monthKey > todayMonthKey) return false;

  const slotDates = getMondaySlotDates(monthKey);
  const lastSlotDate = slotDates[slotDates.length - 1];
  if (!lastSlotDate) return false;

  return compareDateStrings(todayLocalDate, lastSlotDate) > 0;
}
