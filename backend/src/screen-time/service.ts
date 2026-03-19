import { and, desc, eq, inArray } from "drizzle-orm";
import type {
  Database,
  Employee,
  ScreenTimeMonthlyResult as ScreenTimeMonthlyResultRow,
  ScreenTimeProgram,
  ScreenTimeProgramTier,
  ScreenTimeSubmission,
} from "../db";
import { schema } from "../db";
import { getBenefitsForEmployee } from "../graphql/resolvers/helpers/employeeBenefits";
import {
  compareDateStrings,
  getActiveMondaySlotDate,
  getDueMondaySlotDates,
  getMonthKeyFromDateString,
  getMondaySlotDates,
  resolveTodayLocalDateString,
} from "./calendar";

export type ScreenTimeProgramView = ScreenTimeProgram & {
  tiers: ScreenTimeProgramTier[];
};

export type ScreenTimeMonthlyResultView = {
  id: string;
  benefitId: string;
  employeeId: string;
  monthKey: string;
  requiredSlotDates: string[];
  dueSlotDates: string[];
  missingDueSlotDates: string[];
  requiredSlotCount: number;
  submittedSlotCount: number;
  approvedSlotCount: number;
  monthlyAvgDailyMinutes: number | null;
  awardedSalaryUpliftPercent: number;
  status: string;
  approvedByEmployeeId: string | null;
  approvedAt: string | null;
  decisionNote: string | null;
  submissions: ScreenTimeSubmission[];
};

export type ScreenTimeLeaderboardRowView = {
  rank: number | null;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  monthKey: string;
  status: string;
  avgDailyMinutes: number | null;
  awardedSalaryUpliftPercent: number;
  approvedSlotCount: number;
  dueSlotCount: number;
  requiredSlotCount: number;
  isProvisional: boolean;
};

type ScreenTimeLeaderboardDraftRow = {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  monthKey: string;
  status: string;
  avgDailyMinutes: number;
  awardedSalaryUpliftPercent: number;
  approvedSlotCount: number;
  dueSlotCount: number;
  requiredSlotCount: number;
  isProvisional: boolean;
};

const APPROVED_SUBMISSION_STATUSES = new Set(["auto_approved", "approved"]);
const SCREEN_TIME_VISIBLE_ELIGIBILITY_STATUSES = [
  "ACTIVE",
  "ELIGIBLE",
  "PENDING",
  "active",
  "eligible",
  "pending",
] as const;

function safeJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function averageRounded(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

function resolveAwardedPercent(
  tiers: ScreenTimeProgramTier[],
  avgDailyMinutes: number | null,
): number {
  if (avgDailyMinutes == null) return 0;

  const sorted = [...tiers].sort((left, right) => {
    if (left.maxDailyMinutes !== right.maxDailyMinutes) {
      return left.maxDailyMinutes - right.maxDailyMinutes;
    }
    return left.displayOrder - right.displayOrder;
  });

  const matched = sorted.find((tier) => avgDailyMinutes <= tier.maxDailyMinutes);
  return matched?.salaryUpliftPercent ?? 0;
}

function resolveAutomaticDecisionNote(status: string): string | null {
  switch (status) {
    case "eligible":
      return "Computed automatically from all required Monday screenshots.";
    case "not_qualified":
      return "Computed automatically; the monthly average did not meet a payout band.";
    case "ineligible_missing_slots":
      return "Computed automatically; at least one required Monday screenshot is missing.";
    default:
      return null;
  }
}

function buildApprovedSubmissionMap(
  submissions: ScreenTimeSubmission[],
): Map<string, ScreenTimeSubmission> {
  const latestBySlot = new Map<string, ScreenTimeSubmission>();
  for (const submission of submissions) {
    if (!APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus)) continue;
    const existing = latestBySlot.get(submission.slotDate);
    if (!existing || existing.updatedAt < submission.updatedAt) {
      latestBySlot.set(submission.slotDate, submission);
    }
  }
  return latestBySlot;
}

function resolveLeaderboardSnapshot(input: {
  result: ScreenTimeMonthlyResultView;
  tiers: ScreenTimeProgramTier[];
}): {
  avgDailyMinutes: number;
  awardedSalaryUpliftPercent: number;
  approvedSlotCount: number;
  dueSlotCount: number;
  requiredSlotCount: number;
  isProvisional: boolean;
} | null {
  const { result, tiers } = input;
  if (result.dueSlotDates.length === 0) return null;

  const approvedBySlot = buildApprovedSubmissionMap(result.submissions);
  const dueMinutes: number[] = [];
  for (const slotDate of result.dueSlotDates) {
    const submission = approvedBySlot.get(slotDate);
    if (!submission || typeof submission.avgDailyMinutes !== "number") {
      return null;
    }
    dueMinutes.push(submission.avgDailyMinutes);
  }

  const avgDailyMinutes = averageRounded(dueMinutes);
  if (avgDailyMinutes == null) return null;

  return {
    avgDailyMinutes,
    awardedSalaryUpliftPercent: resolveAwardedPercent(tiers, avgDailyMinutes),
    approvedSlotCount: dueMinutes.length,
    dueSlotCount: result.dueSlotDates.length,
    requiredSlotCount: result.requiredSlotCount,
    isProvisional: result.dueSlotDates.length < result.requiredSlotCount,
  };
}

function buildMonthlyResultView(input: {
  benefitId: string;
  employeeId: string;
  monthKey: string;
  tiers: ScreenTimeProgramTier[];
  submissions: ScreenTimeSubmission[];
  storedResult?: ScreenTimeMonthlyResultRow | null;
  todayLocalDate?: string;
}): ScreenTimeMonthlyResultView {
  const {
    benefitId,
    employeeId,
    monthKey,
    tiers,
    submissions,
    storedResult,
    todayLocalDate = resolveTodayLocalDateString(),
  } = input;

  const requiredSlotDates = getMondaySlotDates(monthKey);
  const dueSlotDates = getDueMondaySlotDates(monthKey, todayLocalDate);

  const latestBySlot = new Map<string, ScreenTimeSubmission>();
  for (const submission of submissions) {
    const existing = latestBySlot.get(submission.slotDate);
    if (!existing || existing.updatedAt < submission.updatedAt) {
      latestBySlot.set(submission.slotDate, submission);
    }
  }

  const orderedSubmissions = [...latestBySlot.values()].sort((left, right) =>
    compareDateStrings(left.slotDate, right.slotDate),
  );

  const missingDueSlotDates = dueSlotDates.filter((slotDate) => {
    const submission = latestBySlot.get(slotDate);
    if (!submission) return true;
    return submission.reviewStatus === "rejected";
  });

  const approvedSubmissions = orderedSubmissions.filter((submission) =>
    APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus),
  );

  const hasAllApprovedSlots =
    requiredSlotDates.length > 0 &&
    requiredSlotDates.every((slotDate) => {
      const submission = latestBySlot.get(slotDate);
      return submission != null && APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus);
    });

  const monthlyAvgDailyMinutes = hasAllApprovedSlots
    ? averageRounded(
        requiredSlotDates
          .map((slotDate) => latestBySlot.get(slotDate)?.avgDailyMinutes ?? null)
          .filter((value): value is number => typeof value === "number"),
      )
    : null;
  const awardedSalaryUpliftPercent = resolveAwardedPercent(tiers, monthlyAvgDailyMinutes);

  let status = "in_progress";
  if (missingDueSlotDates.length > 0) {
    status = "ineligible_missing_slots";
  } else if (!hasAllApprovedSlots) {
    status = "in_progress";
  } else if (awardedSalaryUpliftPercent <= 0) {
    status = "not_qualified";
  } else {
    status = "eligible";
  }
  const decisionNote = resolveAutomaticDecisionNote(status);

  return {
    id: storedResult?.id ?? `${benefitId}:${employeeId}:${monthKey}`,
    benefitId,
    employeeId,
    monthKey,
    requiredSlotDates,
    dueSlotDates,
    missingDueSlotDates,
    requiredSlotCount: requiredSlotDates.length,
    submittedSlotCount: orderedSubmissions.length,
    approvedSlotCount: approvedSubmissions.length,
    monthlyAvgDailyMinutes,
    awardedSalaryUpliftPercent,
    status,
    approvedByEmployeeId: null,
    approvedAt: null,
    decisionNote,
    submissions: orderedSubmissions,
  };
}

export async function getScreenTimeProgramByBenefit(
  db: Database,
  benefitId: string,
): Promise<ScreenTimeProgramView | null> {
  const [program, tiers] = await Promise.all([
    db
      .select()
      .from(schema.screenTimePrograms)
      .where(eq(schema.screenTimePrograms.benefitId, benefitId))
      .limit(1),
    db
      .select()
      .from(schema.screenTimeProgramTiers)
      .where(eq(schema.screenTimeProgramTiers.benefitId, benefitId)),
  ]);

  const row = program[0];
  if (!row) return null;

  return {
    ...row,
    tiers: tiers.sort((left, right) => left.displayOrder - right.displayOrder),
  };
}

export async function ensureScreenTimeBenefit(
  db: Database,
  benefitId: string,
) {
  const rows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId))
    .limit(1);
  const benefit = rows[0];
  if (!benefit) {
    throw new Error("Benefit not found.");
  }
  if (benefit.flowType !== "screen_time") {
    throw new Error("This benefit is not configured as a screen time program.");
  }
  return benefit;
}

export async function recomputeScreenTimeMonthlyResult(
  db: Database,
  input: {
    benefitId: string;
    employeeId: string;
    monthKey: string;
    todayLocalDate?: string;
  },
): Promise<ScreenTimeMonthlyResultView> {
  const { benefitId, employeeId, monthKey, todayLocalDate } = input;
  const program = await getScreenTimeProgramByBenefit(db, benefitId);
  if (!program) {
    throw new Error("Screen time program is not configured for this benefit.");
  }

  const [submissionRows, existingRows] = await Promise.all([
    db
      .select()
      .from(schema.screenTimeSubmissions)
      .where(
        and(
          eq(schema.screenTimeSubmissions.benefitId, benefitId),
          eq(schema.screenTimeSubmissions.employeeId, employeeId),
          eq(schema.screenTimeSubmissions.monthKey, monthKey),
        ),
      ),
    db
      .select()
      .from(schema.screenTimeMonthlyResults)
      .where(
        and(
          eq(schema.screenTimeMonthlyResults.benefitId, benefitId),
          eq(schema.screenTimeMonthlyResults.employeeId, employeeId),
          eq(schema.screenTimeMonthlyResults.monthKey, monthKey),
        ),
      )
      .limit(1),
  ]);

  const existing = existingRows[0] ?? null;
  const view = buildMonthlyResultView({
    benefitId,
    employeeId,
    monthKey,
    tiers: program.tiers,
    submissions: submissionRows,
    storedResult: existing,
    todayLocalDate,
  });

  if (existing) {
    await db
      .update(schema.screenTimeMonthlyResults)
      .set({
        requiredSlotCount: view.requiredSlotCount,
        submittedSlotCount: view.submittedSlotCount,
        approvedSlotCount: view.approvedSlotCount,
        missingDueSlotDatesJson: JSON.stringify(view.missingDueSlotDates),
        monthlyAvgDailyMinutes: view.monthlyAvgDailyMinutes,
        awardedSalaryUpliftPercent: view.awardedSalaryUpliftPercent,
        status: view.status,
        approvedByEmployeeId: null,
        approvedAt: null,
        decisionNote: view.decisionNote,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.screenTimeMonthlyResults.id, existing.id));
  } else {
    await db.insert(schema.screenTimeMonthlyResults).values({
      benefitId,
      employeeId,
      monthKey,
      requiredSlotCount: view.requiredSlotCount,
      submittedSlotCount: view.submittedSlotCount,
      approvedSlotCount: view.approvedSlotCount,
      missingDueSlotDatesJson: JSON.stringify(view.missingDueSlotDates),
      monthlyAvgDailyMinutes: view.monthlyAvgDailyMinutes,
      awardedSalaryUpliftPercent: view.awardedSalaryUpliftPercent,
      status: view.status,
      decisionNote: view.decisionNote,
    });
  }

  const refreshedRows = await db
    .select()
    .from(schema.screenTimeMonthlyResults)
    .where(
      and(
        eq(schema.screenTimeMonthlyResults.benefitId, benefitId),
        eq(schema.screenTimeMonthlyResults.employeeId, employeeId),
        eq(schema.screenTimeMonthlyResults.monthKey, monthKey),
      ),
    )
    .limit(1);

  return buildMonthlyResultView({
    benefitId,
    employeeId,
    monthKey,
    tiers: program.tiers,
    submissions: submissionRows,
    storedResult: refreshedRows[0] ?? null,
    todayLocalDate,
  });
}

export async function buildMyScreenTimeMonth(
  db: Database,
  employee: Employee,
  benefitId: string,
  monthKey?: string | null,
  todayLocalDateOverride?: string | null,
) {
  const todayLocalDate = resolveTodayLocalDateString(todayLocalDateOverride);
  const normalizedMonthKey = monthKey || getMonthKeyFromDateString(todayLocalDate);
  const activeSlotDate = getActiveMondaySlotDate(normalizedMonthKey, todayLocalDate);

  const [program, benefits] = await Promise.all([
    getScreenTimeProgramByBenefit(db, benefitId),
    getBenefitsForEmployee(db, employee.id),
  ]);

  const eligibility = benefits.find((item) => item.benefitId === benefitId);
  if (!eligibility) {
    throw new Error("No eligibility information found for this benefit.");
  }

  const month = program
    ? await recomputeScreenTimeMonthlyResult(db, {
        benefitId,
        employeeId: employee.id,
        monthKey: normalizedMonthKey,
        todayLocalDate,
      })
    : buildMonthlyResultView({
        benefitId,
        employeeId: employee.id,
        monthKey: normalizedMonthKey,
        tiers: [],
        submissions: [],
        storedResult: null,
        todayLocalDate,
      });

  return {
    benefitId,
    benefitStatus: eligibility.status,
    failedRuleMessage: eligibility.failedRule?.errorMessage ?? null,
    todayLocalDate,
    activeSlotDate,
    isUploadOpenToday:
      (eligibility.status === "ELIGIBLE" || eligibility.status === "ACTIVE") &&
      Boolean(activeSlotDate) &&
      Boolean(program?.isActive),
    program,
    month,
  };
}

export async function buildAdminScreenTimeMonthBoard(
  db: Database,
  benefitId: string,
  monthKey?: string | null,
  todayLocalDateOverride?: string | null,
) {
  const todayLocalDate = resolveTodayLocalDateString(todayLocalDateOverride);
  const normalizedMonthKey = monthKey || getMonthKeyFromDateString(todayLocalDate);
  const program = await getScreenTimeProgramByBenefit(db, benefitId);
  if (!program) {
    return {
      benefitId,
      monthKey: normalizedMonthKey,
      slotDates: getMondaySlotDates(normalizedMonthKey),
      program: null,
      rows: [],
    };
  }

  const [resultRows, submissionRows, eligibilityRows, employees] = await Promise.all([
    db
      .select()
      .from(schema.screenTimeMonthlyResults)
      .where(
        and(
          eq(schema.screenTimeMonthlyResults.benefitId, benefitId),
          eq(schema.screenTimeMonthlyResults.monthKey, normalizedMonthKey),
        ),
      ),
    db
      .select()
      .from(schema.screenTimeSubmissions)
      .where(
        and(
          eq(schema.screenTimeSubmissions.benefitId, benefitId),
          eq(schema.screenTimeSubmissions.monthKey, normalizedMonthKey),
        ),
      )
      .orderBy(desc(schema.screenTimeSubmissions.submittedAt)),
    db
      .select({
        employeeId: schema.benefitEligibility.employeeId,
        status: schema.benefitEligibility.status,
      })
      .from(schema.benefitEligibility)
      .where(
        and(
          eq(schema.benefitEligibility.benefitId, benefitId),
          inArray(
            schema.benefitEligibility.status,
            [...SCREEN_TIME_VISIBLE_ELIGIBILITY_STATUSES],
          ),
        ),
      ),
    db.select().from(schema.employees),
  ]);

  const employeeIds = new Set<string>();
  for (const row of eligibilityRows) employeeIds.add(row.employeeId);
  for (const row of resultRows) employeeIds.add(row.employeeId);
  for (const row of submissionRows) employeeIds.add(row.employeeId);

  const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
  const resultMap = new Map(resultRows.map((row) => [row.employeeId, row]));
  const submissionsByEmployee = new Map<string, ScreenTimeSubmission[]>();
  for (const submission of submissionRows) {
    const list = submissionsByEmployee.get(submission.employeeId) ?? [];
    list.push(submission);
    submissionsByEmployee.set(submission.employeeId, list);
  }

  const rows = [...employeeIds]
    .map((employeeId) => {
      const employee = employeeMap.get(employeeId);
      if (!employee) return null;

      const result = buildMonthlyResultView({
        benefitId,
        employeeId,
        monthKey: normalizedMonthKey,
        tiers: program.tiers,
        submissions: submissionsByEmployee.get(employeeId) ?? [],
        storedResult: resultMap.get(employeeId) ?? null,
        todayLocalDate,
      });

      return {
        employeeId,
        employeeName: employee.nameEng?.trim() || employee.name,
        employeeEmail: employee.email,
        result,
      };
    })
    .filter(
      (
        row,
      ): row is {
        employeeId: string;
        employeeName: string;
        employeeEmail: string;
        result: ScreenTimeMonthlyResultView;
      } => row !== null,
    )
    .sort((left, right) => left.employeeName.localeCompare(right.employeeName));

  return {
    benefitId,
    monthKey: normalizedMonthKey,
    slotDates: getMondaySlotDates(normalizedMonthKey),
    program,
    rows,
  };
}

export async function upsertScreenTimeProgramConfig(
  db: Database,
  input: {
    benefitId: string;
    screenshotRetentionDays?: number | null;
    tiers: Array<{
      id?: string | null;
      label: string;
      maxDailyMinutes: number;
      salaryUpliftPercent: number;
      displayOrder?: number | null;
    }>;
  },
) {
  const now = new Date().toISOString();
  const existingProgram = await db
    .select()
    .from(schema.screenTimePrograms)
    .where(eq(schema.screenTimePrograms.benefitId, input.benefitId))
    .limit(1);

  if (existingProgram[0]) {
    await db
      .update(schema.screenTimePrograms)
      .set({
        screenshotRetentionDays:
          input.screenshotRetentionDays ?? existingProgram[0].screenshotRetentionDays,
        updatedAt: now,
      })
      .where(eq(schema.screenTimePrograms.benefitId, input.benefitId));
  } else {
    await db.insert(schema.screenTimePrograms).values({
      benefitId: input.benefitId,
      screenshotRetentionDays: input.screenshotRetentionDays ?? 30,
      isActive: true,
    });
  }

  await db
    .delete(schema.screenTimeProgramTiers)
    .where(eq(schema.screenTimeProgramTiers.benefitId, input.benefitId));

  if (input.tiers.length > 0) {
    await db.insert(schema.screenTimeProgramTiers).values(
      input.tiers.map((tier, index) => ({
        benefitId: input.benefitId,
        label: tier.label,
        maxDailyMinutes: tier.maxDailyMinutes,
        salaryUpliftPercent: tier.salaryUpliftPercent,
        displayOrder: tier.displayOrder ?? index,
      })),
    );
  }

  const program = await getScreenTimeProgramByBenefit(db, input.benefitId);
  if (!program) {
    throw new Error("Failed to save the screen time program configuration.");
  }
  return program;
}

export async function getScreenTimeMonthlyResultById(
  db: Database,
  resultId: string,
) {
  const rows = await db
    .select()
    .from(schema.screenTimeMonthlyResults)
    .where(eq(schema.screenTimeMonthlyResults.id, resultId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getScreenTimeSubmissionById(
  db: Database,
  submissionId: string,
) {
  const rows = await db
    .select()
    .from(schema.screenTimeSubmissions)
    .where(eq(schema.screenTimeSubmissions.id, submissionId))
    .limit(1);
  return rows[0] ?? null;
}

export async function listEmployeeIdsWithSubmissionsForMonth(
  db: Database,
  benefitId: string,
  monthKey: string,
) {
  const rows = await db
    .select({ employeeId: schema.screenTimeSubmissions.employeeId })
    .from(schema.screenTimeSubmissions)
    .where(
      and(
        eq(schema.screenTimeSubmissions.benefitId, benefitId),
        eq(schema.screenTimeSubmissions.monthKey, monthKey),
      ),
    );
  return [...new Set(rows.map((row) => row.employeeId))];
}

export async function getMonthlyResultsForEmployees(
  db: Database,
  benefitId: string,
  employeeIds: string[],
  monthKey: string,
) {
  if (employeeIds.length === 0) return [];
  return db
    .select()
    .from(schema.screenTimeMonthlyResults)
    .where(
      and(
        eq(schema.screenTimeMonthlyResults.benefitId, benefitId),
        eq(schema.screenTimeMonthlyResults.monthKey, monthKey),
        inArray(schema.screenTimeMonthlyResults.employeeId, employeeIds),
      ),
    );
}

export function hydrateStoredMonthlyResult(
  stored: ScreenTimeMonthlyResultRow,
  submissions: ScreenTimeSubmission[],
): ScreenTimeMonthlyResultView {
  return {
    id: stored.id,
    benefitId: stored.benefitId,
    employeeId: stored.employeeId,
    monthKey: stored.monthKey,
    requiredSlotDates: getMondaySlotDates(stored.monthKey),
    dueSlotDates: getDueMondaySlotDates(stored.monthKey, resolveTodayLocalDateString()),
    missingDueSlotDates: safeJsonArray(stored.missingDueSlotDatesJson),
    requiredSlotCount: stored.requiredSlotCount,
    submittedSlotCount: stored.submittedSlotCount,
    approvedSlotCount: stored.approvedSlotCount,
    monthlyAvgDailyMinutes: stored.monthlyAvgDailyMinutes,
    awardedSalaryUpliftPercent: stored.awardedSalaryUpliftPercent,
    status: stored.status,
    approvedByEmployeeId: null,
    approvedAt: null,
    decisionNote: stored.decisionNote,
    submissions,
  };
}

export async function buildScreenTimeLeaderboard(
  db: Database,
  benefitId: string,
  monthKey?: string | null,
  todayLocalDateOverride?: string | null,
): Promise<ScreenTimeLeaderboardRowView[]> {
  const board = await buildAdminScreenTimeMonthBoard(
    db,
    benefitId,
    monthKey,
    todayLocalDateOverride,
  );

  const statusOrder = new Map<string, number>([
    ["eligible", 0],
    ["not_qualified", 1],
    ["in_progress", 2],
    ["ineligible_missing_slots", 3],
  ]);

  const sorted = [...board.rows].sort((left, right) => {
    const leftSnapshot = resolveLeaderboardSnapshot({
      result: left.result,
      tiers: board.program?.tiers ?? [],
    });
    const rightSnapshot = resolveLeaderboardSnapshot({
      result: right.result,
      tiers: board.program?.tiers ?? [],
    });
    const leftHasScore = leftSnapshot != null;
    const rightHasScore = rightSnapshot != null;

    if (leftHasScore !== rightHasScore) {
      return leftHasScore ? -1 : 1;
    }

    if (leftHasScore && rightHasScore) {
      if (leftSnapshot.avgDailyMinutes !== rightSnapshot.avgDailyMinutes) {
        return leftSnapshot.avgDailyMinutes - rightSnapshot.avgDailyMinutes;
      }
      if (leftSnapshot.awardedSalaryUpliftPercent !== rightSnapshot.awardedSalaryUpliftPercent) {
        return rightSnapshot.awardedSalaryUpliftPercent - leftSnapshot.awardedSalaryUpliftPercent;
      }
    }

    const leftStatus = statusOrder.get(left.result.status) ?? 99;
    const rightStatus = statusOrder.get(right.result.status) ?? 99;
    if (leftStatus !== rightStatus) return leftStatus - rightStatus;

    return left.employeeName.localeCompare(right.employeeName);
  });

  return sorted
    .map((row) => {
      const snapshot = resolveLeaderboardSnapshot({
        result: row.result,
        tiers: board.program?.tiers ?? [],
      });
      if (!snapshot) return null;

      return {
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        employeeEmail: row.employeeEmail,
        monthKey: row.result.monthKey,
        status: row.result.status,
        avgDailyMinutes: snapshot.avgDailyMinutes,
        awardedSalaryUpliftPercent: snapshot.awardedSalaryUpliftPercent,
        approvedSlotCount: snapshot.approvedSlotCount,
        dueSlotCount: snapshot.dueSlotCount,
        requiredSlotCount: snapshot.requiredSlotCount,
        isProvisional: snapshot.isProvisional,
      };
    })
    .filter((row): row is ScreenTimeLeaderboardDraftRow => row !== null)
    .map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
}

// ── Deterministic screen-time seed helpers ────────────────────────────────────

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Returns a deterministic avg daily minutes in [30, 300] based on the
 * employee id.  The distribution is intentionally wide so the leaderboard
 * shows a varied spread rather than everyone clustering around a single value.
 */
function deterministicBaseMinutes(employeeId: string): number {
  return 30 + (hashString(employeeId) % 271); // 30 … 300
}

/** Returns a small ±30 minute per-slot variation to make slots look natural. */
function deterministicSlotVariation(employeeId: string, slotDate: string): number {
  return (hashString(employeeId + slotDate) % 61) - 30; // -30 … +30
}

/**
 * For every active employee that does not yet have a screen-time submission for
 * each due Monday slot of `monthKey`, inserts a synthetic "auto-approved"
 * submission so the leaderboard is populated with real DB rows.
 *
 * Safe to call multiple times — existing submissions are never overwritten.
 * Returns the number of employees that had at least one new row inserted.
 */
export async function seedScreenTimeSubmissionsForAllEmployees(
  db: Database,
  benefitId: string,
  monthKey: string,
): Promise<number> {
  const todayLocalDate = resolveTodayLocalDateString();
  const dueSlotDates = getDueMondaySlotDates(monthKey, todayLocalDate);
  console.log(`[seed/service] monthKey=${monthKey} todayLocalDate=${todayLocalDate} dueSlotDates=${JSON.stringify(dueSlotDates)}`);
  if (dueSlotDates.length === 0) {
    console.log("[seed/service] no due slot dates — aborting");
    return 0;
  }

  // Ensure a screenTimePrograms row exists so buildAdminScreenTimeMonthBoard
  // does not exit early.  We create a bare program (no tiers) if absent.
  const existingProgram = await db
    .select()
    .from(schema.screenTimePrograms)
    .where(eq(schema.screenTimePrograms.benefitId, benefitId))
    .limit(1);
  if (!existingProgram[0]) {
    console.log("[seed/service] no screenTimePrograms row found — inserting default");
    await db.insert(schema.screenTimePrograms).values({
      benefitId,
      screenshotRetentionDays: 30,
      isActive: true,
    });
  }

  const [allEmployees, existingRows] = await Promise.all([
    db.select().from(schema.employees),
    db
      .select({
        employeeId: schema.screenTimeSubmissions.employeeId,
        slotDate: schema.screenTimeSubmissions.slotDate,
      })
      .from(schema.screenTimeSubmissions)
      .where(
        and(
          eq(schema.screenTimeSubmissions.benefitId, benefitId),
          eq(schema.screenTimeSubmissions.monthKey, monthKey),
        ),
      ),
  ]);
  console.log(`[seed/service] found ${allEmployees.length} employees, ${existingRows.length} existing submission rows`);

  const existingSet = new Set(existingRows.map((r) => `${r.employeeId}:${r.slotDate}`));
  const now = new Date().toISOString();

  type InsertRow = {
    benefitId: string;
    employeeId: string;
    monthKey: string;
    slotDate: string;
    avgDailyMinutes: number;
    confidenceScore: number;
    platform: string;
    periodType: string;
    extractionStatus: string;
    reviewStatus: string;
    reviewedAt: string;
    submittedAt: string;
  };

  const toInsert: InsertRow[] = [];

  for (const employee of allEmployees) {
    const base = deterministicBaseMinutes(employee.id);
    for (const slotDate of dueSlotDates) {
      if (existingSet.has(`${employee.id}:${slotDate}`)) continue;
      const variation = deterministicSlotVariation(employee.id, slotDate);
      const avgDailyMinutes = Math.max(15, Math.min(360, base + variation));
      toInsert.push({
        benefitId,
        employeeId: employee.id,
        monthKey,
        slotDate,
        avgDailyMinutes,
        confidenceScore: 95,
        platform: "ios",
        periodType: "weekly",
        extractionStatus: "accepted",
        reviewStatus: "auto_approved",
        reviewedAt: now,
        submittedAt: now,
      });
    }
  }

  if (toInsert.length === 0) return 0;

  console.log(`[seed/service] inserting ${toInsert.length} new submission rows`);
  if (toInsert.length === 0) return 0;

  // Drizzle/SQLite can fail with too many bound variables; batch in groups of 50
  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    await db.insert(schema.screenTimeSubmissions).values(toInsert.slice(i, i + BATCH));
  }

  // Return how many distinct employees had at least one new submission inserted
  const seededEmployeeIds = new Set(toInsert.map((r) => r.employeeId));
  console.log(`[seed/service] inserted rows for ${seededEmployeeIds.size} employees`);
  return seededEmployeeIds.size;
}
