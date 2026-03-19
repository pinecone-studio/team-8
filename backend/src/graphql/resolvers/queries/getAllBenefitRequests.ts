import { desc, eq, inArray } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import {
  requireAdmin,
  canReadHrQueue,
  canReadFinanceQueue,
} from "../../../auth";

// All in-flight statuses (non-terminal)
const ALL_PENDING_STATUSES = [
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "awaiting_payment",
  "awaiting_payment_review",
  "hr_approved",
  "finance_approved",
];

// HR queue: requests that an HR admin should act on
const HR_QUEUE_STATUSES = [
  "awaiting_hr_review",
  "awaiting_payment_review",
  "finance_approved", // dual: Finance done, now HR second
  "pending",          // legacy (treated as HR by default)
];

// Finance queue: requests that a Finance admin should act on
const FINANCE_QUEUE_STATUSES = [
  "awaiting_finance_review",
  "hr_approved", // dual: HR done, now Finance second
];

/**
 * Return benefit requests with role-enforced queue authorization.
 *
 * queue="hr"      => HR admin only
 * queue="finance" => Finance admin only
 * no queue + status="pending" (legacy) => HR admin only (full oversight)
 * no queue + no status => HR admin sees all; Finance admin sees Finance queue only
 * specific status filter => HR admin only
 */
export const getAllBenefitRequests = async (
  _: unknown,
  { status, queue }: { status?: string | null; queue?: string | null },
  { db, currentEmployee }: GraphQLContext,
) => {
  // Gate: must be at least some kind of admin
  const admin = requireAdmin(currentEmployee);
  const isHr = canReadHrQueue(admin);
  const isFinance = canReadFinanceQueue(admin);

  // Explicit queue filter — enforce per-role
  if (queue === "hr") {
    if (!isHr) {
      throw new Error("HR queue requires HR admin access.");
    }
    return db
      .select()
      .from(schema.benefitRequests)
      .where(inArray(schema.benefitRequests.status, HR_QUEUE_STATUSES))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  if (queue === "finance") {
    if (!isFinance && !isHr) {
      throw new Error("Finance queue requires Finance or HR admin access.");
    }
    return db
      .select()
      .from(schema.benefitRequests)
      .where(inArray(schema.benefitRequests.status, FINANCE_QUEUE_STATUSES))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  // No explicit queue — derive access from role
  if (!isHr && isFinance) {
    // Finance-only admin: restrict to Finance queue automatically
    return db
      .select()
      .from(schema.benefitRequests)
      .where(inArray(schema.benefitRequests.status, FINANCE_QUEUE_STATUSES))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  // From here: HR admin (or dual-role) has full access
  if (!isHr) {
    throw new Error("HR admin access required to view all pending requests.");
  }

  // Legacy status="pending" → all in-flight statuses (HR has full overview)
  if (status === "pending") {
    return db
      .select()
      .from(schema.benefitRequests)
      .where(inArray(schema.benefitRequests.status, ALL_PENDING_STATUSES))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  // Specific status filter
  if (status) {
    return db
      .select()
      .from(schema.benefitRequests)
      .where(eq(schema.benefitRequests.status, status))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  // No filter — return all requests (HR admin global view)
  return db
    .select()
    .from(schema.benefitRequests)
    .orderBy(desc(schema.benefitRequests.createdAt));
};
