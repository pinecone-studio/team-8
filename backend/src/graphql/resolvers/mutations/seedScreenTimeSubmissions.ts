import { requireAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import {
  ensureScreenTimeBenefit,
  seedScreenTimeSubmissionsForAllEmployees,
} from "../../../screen-time/service";
import {
  getActiveFridaySlotDate,
  getAssignedMonthKeyForSlotDate,
  getMonthKeyFromDateString,
  resolveTodayLocalDateString,
} from "../../../screen-time/calendar";

export const seedScreenTimeSubmissions = async (
  _: unknown,
  { benefitId, monthKey }: { benefitId: string; monthKey?: string | null },
  { db, currentEmployee }: GraphQLContext,
) => {
  console.log(`[seed] received benefitId=${JSON.stringify(benefitId)} monthKey=${JSON.stringify(monthKey)}`);
  console.log(`[seed] currentEmployee id=${currentEmployee?.id} role=${currentEmployee?.role} dept=${currentEmployee?.department} level=${currentEmployee?.responsibilityLevel}`);

  try {
    requireAdmin(currentEmployee);
  } catch (authErr) {
    console.error("[seed] AUTH FAILED:", authErr);
    throw authErr;
  }

  let benefit;
  try {
    benefit = await ensureScreenTimeBenefit(db, benefitId);
    console.log(`[seed] benefit found: id=${benefit.id} flowType=${benefit.flowType}`);
  } catch (benefitErr) {
    console.error("[seed] BENEFIT CHECK FAILED:", benefitErr);
    throw benefitErr;
  }

  const todayLocalDate = resolveTodayLocalDateString();
  const activeSlotMonthKey = getAssignedMonthKeyForSlotDate(todayLocalDate);
  const resolvedMonthKey =
    monthKey ??
    (getActiveFridaySlotDate(activeSlotMonthKey, todayLocalDate) != null
      ? activeSlotMonthKey
      : getMonthKeyFromDateString(todayLocalDate));
  console.log(`[seed] resolvedMonthKey=${resolvedMonthKey}`);

  try {
    const count = await seedScreenTimeSubmissionsForAllEmployees(db, benefitId, resolvedMonthKey);
    console.log(`[seed] SUCCESS — seeded ${count} employees`);
    return count;
  } catch (seedErr) {
    console.error("[seed] SEED FAILED:", seedErr);
    throw seedErr;
  }
};
