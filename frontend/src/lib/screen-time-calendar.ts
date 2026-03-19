function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateString(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addUtcDays(dateString: string, deltaDays: number): string {
  const date = parseDateString(dateString);
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return formatDateString(date);
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
  while (cursor <= endDate) {
    const monthKey = cursor.slice(0, 7);
    counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
    cursor = addUtcDays(cursor, 1);
  }

  return [...counts.entries()].sort((left, right) => {
    if (left[1] !== right[1]) return right[1] - left[1];
    return left[0].localeCompare(right[0]);
  })[0]?.[0] ?? slotDate.slice(0, 7);
}

export function getInitialScreenTimeMonthKey(now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "0");
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const today = `${year}-${pad2(month)}-${pad2(day)}`;

  if (weekday === "Fri") {
    return getAssignedMonthKeyForSlotDate(today);
  }

  return today.slice(0, 7);
}
