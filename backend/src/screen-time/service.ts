import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import type {
  Database,
  Employee,
  ScreenTimeMonthlyResult as ScreenTimeMonthlyResultRow,
  ScreenTimeProgram,
  ScreenTimeSubmission,
} from "../db";
import { schema } from "../db";
import { getBenefitsForEmployee } from "../graphql/resolvers/helpers/employeeBenefits";
import {
  getActiveFridaySlotDate,
  getAssignedMonthKeyForSlotDate,
  getDueFridaySlotDates,
  getFridaySlotDates,
  getMonthKeyFromDateString,
  resolveTodayLocalDateString,
} from "./calendar";

export type ScreenTimeProgramView = ScreenTimeProgram;

export type ScreenTimeMonthlyResultView = {
  id: string;
  benefitId: string;
  employeeId: string;
  monthKey: string;
  requiredSlotDates: string[];
  dueSlotDates: string[];
  missingDueSlotDates: string[];
  rejectedDueSlotDates: string[];
  requiredSlotCount: number;
  dueSlotCount: number;
  submittedSlotCount: number;
  approvedSlotCount: number;
  monthlyAvgDailyMinutes: number | null;
  competitionParticipantCount: number;
  rankedParticipantCount: number;
  rankPosition: number | null;
  winnerCutoffRank: number;
  isWinner: boolean;
  rewardAmountMnt: number;
  isProvisional: boolean;
  status: string;
  approvedByEmployeeId: string | null;
  approvedAt: string | null;
  decisionNote: string | null;
  disqualificationReason: string | null;
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
  rewardAmountMnt: number;
  approvedSlotCount: number;
  dueSlotCount: number;
  requiredSlotCount: number;
  isProvisional: boolean;
  winnerCutoffRank: number;
  competitionParticipantCount: number;
};

type ScreenTimeCompetitionRowView = {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  benefitStatus: string;
  result: ScreenTimeMonthlyResultView;
};

const APPROVED_SUBMISSION_STATUSES = new Set(["auto_approved", "approved"]);
const COMPETITION_ELIGIBILITY_STATUSES = new Set(["ACTIVE", "ELIGIBLE", "PENDING"]);

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

function normalizeBenefitStatus(status: string | null | undefined): string {
  const normalized = String(status ?? "").trim().toUpperCase();
  if (normalized === "ACTIVE") return "ACTIVE";
  if (normalized === "ELIGIBLE") return "ELIGIBLE";
  if (normalized === "PENDING") return "PENDING";
  return "LOCKED";
}

function isCompetitionEligibleStatus(status: string): boolean {
  return COMPETITION_ELIGIBILITY_STATUSES.has(normalizeBenefitStatus(status));
}

function getEmployeeDisplayName(employee: Employee): string {
  return employee.nameEng?.trim() || employee.name;
}

function buildLatestSubmissionBySlot(
  submissions: ScreenTimeSubmission[],
): Map<string, ScreenTimeSubmission> {
  const latestBySlot = new Map<string, ScreenTimeSubmission>();
  for (const submission of submissions) {
    const existing = latestBySlot.get(submission.slotDate);
    if (!existing || existing.updatedAt < submission.updatedAt) {
      latestBySlot.set(submission.slotDate, submission);
    }
  }
  return latestBySlot;
}

function resolveAutomaticDecisionNote(input: {
  status: string;
  winnerPercent: number;
  rewardAmountMnt: number;
  isProvisional: boolean;
}): string | null {
  const { status, winnerPercent, rewardAmountMnt, isProvisional } = input;
  switch (status) {
    case "winner":
      return isProvisional
        ? `Currently inside the provisional top ${winnerPercent}% winner zone for ${rewardAmountMnt.toLocaleString()} MNT.`
        : `Finished inside the top ${winnerPercent}% winner zone and receives ${rewardAmountMnt.toLocaleString()} MNT.`;
    case "qualified":
      return isProvisional
        ? `All due Friday slots are approved, but the current rank is outside the provisional top ${winnerPercent}%.`
        : `All required Friday slots are approved, but the final rank finished outside the top ${winnerPercent}%.`;
    case "disqualified_missing_slot":
      return "Disqualified automatically because at least one required Friday slot is missing.";
    case "disqualified_rejected_submission":
      return "Disqualified automatically because a required Friday submission was rejected.";
    case "in_progress":
      return isProvisional
        ? "Waiting for all due Friday submissions to be approved before ranking."
        : "Waiting for all required Friday submissions to be approved before final ranking.";
    case "not_eligible":
      return "This employee is not eligible for the screen time competition right now.";
    default:
      return null;
  }
}

function buildEmptyMonthlyResultView(input: {
  benefitId: string;
  employeeId: string;
  monthKey: string;
  todayLocalDate: string;
}): ScreenTimeMonthlyResultView {
  const requiredSlotDates = getFridaySlotDates(input.monthKey);
  const dueSlotDates = getDueFridaySlotDates(input.monthKey, input.todayLocalDate);

  return {
    id: `${input.benefitId}:${input.employeeId}:${input.monthKey}`,
    benefitId: input.benefitId,
    employeeId: input.employeeId,
    monthKey: input.monthKey,
    requiredSlotDates,
    dueSlotDates,
    missingDueSlotDates: [],
    rejectedDueSlotDates: [],
    requiredSlotCount: requiredSlotDates.length,
    dueSlotCount: dueSlotDates.length,
    submittedSlotCount: 0,
    approvedSlotCount: 0,
    monthlyAvgDailyMinutes: null,
    competitionParticipantCount: 0,
    rankedParticipantCount: 0,
    rankPosition: null,
    winnerCutoffRank: 0,
    isWinner: false,
    rewardAmountMnt: 0,
    isProvisional: dueSlotDates.length < requiredSlotDates.length,
    status: "not_eligible",
    approvedByEmployeeId: null,
    approvedAt: null,
    decisionNote: "This screen time program is not configured yet.",
    disqualificationReason: null,
    submissions: [],
  };
}

function buildBaseMonthlyResultView(input: {
  benefitId: string;
  employeeId: string;
  monthKey: string;
  benefitStatus: string;
  submissions: ScreenTimeSubmission[];
  storedResult?: ScreenTimeMonthlyResultRow | null;
  todayLocalDate: string;
}): ScreenTimeMonthlyResultView {
  const requiredSlotDates = getFridaySlotDates(input.monthKey);
  const dueSlotDates = getDueFridaySlotDates(input.monthKey, input.todayLocalDate);
  const latestBySlot = buildLatestSubmissionBySlot(input.submissions);
  const orderedSubmissions = requiredSlotDates
    .map((slotDate) => latestBySlot.get(slotDate))
    .filter((submission): submission is ScreenTimeSubmission => submission != null);

  const missingDueSlotDates = dueSlotDates.filter((slotDate) => !latestBySlot.has(slotDate));
  const rejectedDueSlotDates = dueSlotDates.filter(
    (slotDate) => latestBySlot.get(slotDate)?.reviewStatus === "rejected",
  );
  const submittedSlotCount = requiredSlotDates.filter((slotDate) => latestBySlot.has(slotDate)).length;
  const approvedSlotCount = requiredSlotDates.filter((slotDate) => {
    const submission = latestBySlot.get(slotDate);
    return submission != null && APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus);
  }).length;

  const approvedDueMinutes = dueSlotDates
    .map((slotDate) => latestBySlot.get(slotDate))
    .filter(
      (submission): submission is ScreenTimeSubmission =>
        submission != null &&
        APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus) &&
        typeof submission.avgDailyMinutes === "number",
    )
    .map((submission) => submission.avgDailyMinutes as number);

  const hasAllDueApproved =
    dueSlotDates.length > 0 &&
    dueSlotDates.every((slotDate) => {
      const submission = latestBySlot.get(slotDate);
      return submission != null && APPROVED_SUBMISSION_STATUSES.has(submission.reviewStatus);
    });

  const isProvisional = dueSlotDates.length < requiredSlotDates.length;
  const monthlyAvgDailyMinutes = hasAllDueApproved
    ? averageRounded(approvedDueMinutes)
    : null;

  let status = "qualified";
  let disqualificationReason: string | null = null;

  if (!isCompetitionEligibleStatus(input.benefitStatus)) {
    status = "not_eligible";
  } else if (rejectedDueSlotDates.length > 0) {
    status = "disqualified_rejected_submission";
    disqualificationReason = "A required Friday submission was rejected.";
  } else if (missingDueSlotDates.length > 0) {
    status = "disqualified_missing_slot";
    disqualificationReason = "A required Friday slot is missing.";
  } else if (!hasAllDueApproved) {
    status = "in_progress";
  }

  return {
    id: input.storedResult?.id ?? nanoid(),
    benefitId: input.benefitId,
    employeeId: input.employeeId,
    monthKey: input.monthKey,
    requiredSlotDates,
    dueSlotDates,
    missingDueSlotDates,
    rejectedDueSlotDates,
    requiredSlotCount: requiredSlotDates.length,
    dueSlotCount: dueSlotDates.length,
    submittedSlotCount,
    approvedSlotCount,
    monthlyAvgDailyMinutes,
    competitionParticipantCount: 0,
    rankedParticipantCount: 0,
    rankPosition: null,
    winnerCutoffRank: 0,
    isWinner: false,
    rewardAmountMnt: 0,
    isProvisional,
    status,
    approvedByEmployeeId: null,
    approvedAt: null,
    decisionNote: null,
    disqualificationReason,
    submissions: orderedSubmissions,
  };
}

function sortCompetitionRows(
  left: ScreenTimeCompetitionRowView,
  right: ScreenTimeCompetitionRowView,
): number {
  const leftRank = left.result.rankPosition ?? Number.POSITIVE_INFINITY;
  const rightRank = right.result.rankPosition ?? Number.POSITIVE_INFINITY;
  if (leftRank !== rightRank) return leftRank - rightRank;

  const statusOrder = new Map<string, number>([
    ["winner", 0],
    ["qualified", 1],
    ["in_progress", 2],
    ["disqualified_missing_slot", 3],
    ["disqualified_rejected_submission", 4],
    ["not_eligible", 5],
  ]);

  const leftStatus = statusOrder.get(left.result.status) ?? 99;
  const rightStatus = statusOrder.get(right.result.status) ?? 99;
  if (leftStatus !== rightStatus) return leftStatus - rightStatus;

  return left.employeeName.localeCompare(right.employeeName);
}

async function recomputeScreenTimeCompetitionMonth(
  db: Database,
  input: {
    benefitId: string;
    monthKey: string;
    todayLocalDate: string;
  },
): Promise<{
  benefitId: string;
  monthKey: string;
  slotDates: string[];
  program: ScreenTimeProgramView;
  rows: ScreenTimeCompetitionRowView[];
  competitionParticipantCount: number;
  winnerCount: number;
}> {
  const program = await getScreenTimeProgramByBenefit(db, input.benefitId);
  if (!program) {
    throw new Error("Screen time program is not configured for this benefit.");
  }

  const [employees, eligibilityRows, submissionRows, existingRows] = await Promise.all([
    db.select().from(schema.employees),
    db
      .select({
        employeeId: schema.benefitEligibility.employeeId,
        status: schema.benefitEligibility.status,
      })
      .from(schema.benefitEligibility)
      .where(eq(schema.benefitEligibility.benefitId, input.benefitId)),
    db
      .select()
      .from(schema.screenTimeSubmissions)
      .where(
        and(
          eq(schema.screenTimeSubmissions.benefitId, input.benefitId),
          eq(schema.screenTimeSubmissions.monthKey, input.monthKey),
        ),
      ),
    db
      .select()
      .from(schema.screenTimeMonthlyResults)
      .where(
        and(
          eq(schema.screenTimeMonthlyResults.benefitId, input.benefitId),
          eq(schema.screenTimeMonthlyResults.monthKey, input.monthKey),
        ),
      ),
  ]);

  const eligibilityByEmployee = new Map(
    eligibilityRows.map((row) => [row.employeeId, normalizeBenefitStatus(row.status)]),
  );
  const existingByEmployee = new Map(existingRows.map((row) => [row.employeeId, row]));
  const submissionsByEmployee = new Map<string, ScreenTimeSubmission[]>();

  for (const submission of submissionRows) {
    const list = submissionsByEmployee.get(submission.employeeId) ?? [];
    list.push(submission);
    submissionsByEmployee.set(submission.employeeId, list);
  }

  const rows = employees.map((employee) => ({
    employeeId: employee.id,
    employeeName: getEmployeeDisplayName(employee),
    employeeEmail: employee.email,
    benefitStatus: eligibilityByEmployee.get(employee.id) ?? "LOCKED",
    result: buildBaseMonthlyResultView({
      benefitId: input.benefitId,
      employeeId: employee.id,
      monthKey: input.monthKey,
      benefitStatus: eligibilityByEmployee.get(employee.id) ?? "LOCKED",
      submissions: submissionsByEmployee.get(employee.id) ?? [],
      storedResult: existingByEmployee.get(employee.id) ?? null,
      todayLocalDate: input.todayLocalDate,
    }),
  }));

  const winnerPercent = Math.min(100, Math.max(1, program.winnerPercent || 20));
  const competitionParticipantCount = rows.filter((row) =>
    isCompetitionEligibleStatus(row.benefitStatus),
  ).length;
  const winnerCount =
    competitionParticipantCount > 0
      ? Math.max(1, Math.ceil((competitionParticipantCount * winnerPercent) / 100))
      : 0;

  const rankedRows = rows
    .filter(
      (row) =>
        row.result.status === "qualified" &&
        typeof row.result.monthlyAvgDailyMinutes === "number",
    )
    .sort((left, right) => {
      const leftMinutes = left.result.monthlyAvgDailyMinutes ?? Number.POSITIVE_INFINITY;
      const rightMinutes = right.result.monthlyAvgDailyMinutes ?? Number.POSITIVE_INFINITY;
      if (leftMinutes !== rightMinutes) return leftMinutes - rightMinutes;
      return left.employeeName.localeCompare(right.employeeName);
    });

  rankedRows.forEach((row, index) => {
    const rankPosition = index + 1;
    row.result.rankPosition = rankPosition;
    row.result.rankedParticipantCount = rankedRows.length;
    row.result.competitionParticipantCount = competitionParticipantCount;
    row.result.winnerCutoffRank = winnerCount;
    if (winnerCount > 0 && rankPosition <= winnerCount) {
      row.result.isWinner = true;
      row.result.status = "winner";
      row.result.rewardAmountMnt = program.rewardAmountMnt;
    }
  });

  for (const row of rows) {
    if (row.result.rankPosition == null) {
      row.result.competitionParticipantCount = competitionParticipantCount;
      row.result.rankedParticipantCount = rankedRows.length;
      row.result.winnerCutoffRank = winnerCount;
    }

    row.result.decisionNote = resolveAutomaticDecisionNote({
      status: row.result.status,
      winnerPercent,
      rewardAmountMnt: program.rewardAmountMnt,
      isProvisional: row.result.isProvisional,
    });
  }

  const now = new Date().toISOString();
  await Promise.all(
    rows.map((row) => {
      const existing = existingByEmployee.get(row.employeeId);
      const payload = {
        benefitId: input.benefitId,
        employeeId: row.employeeId,
        monthKey: input.monthKey,
        requiredSlotCount: row.result.requiredSlotCount,
        submittedSlotCount: row.result.submittedSlotCount,
        approvedSlotCount: row.result.approvedSlotCount,
        missingDueSlotDatesJson: JSON.stringify(row.result.missingDueSlotDates),
        monthlyAvgDailyMinutes: row.result.monthlyAvgDailyMinutes,
        competitionParticipantCount: row.result.competitionParticipantCount,
        rankedParticipantCount: row.result.rankedParticipantCount,
        rankPosition: row.result.rankPosition,
        winnerCutoffRank: row.result.winnerCutoffRank,
        isWinner: row.result.isWinner,
        rewardAmountMnt: row.result.rewardAmountMnt,
        disqualificationReason: row.result.disqualificationReason,
        status: row.result.status,
        approvedByEmployeeId: null,
        approvedAt: null,
        decisionNote: row.result.decisionNote,
        updatedAt: now,
      };

      if (existing) {
        return db
          .update(schema.screenTimeMonthlyResults)
          .set(payload)
          .where(eq(schema.screenTimeMonthlyResults.id, existing.id));
      }

      return db.insert(schema.screenTimeMonthlyResults).values({
        id: row.result.id,
        ...payload,
      });
    }),
  );

  return {
    benefitId: input.benefitId,
    monthKey: input.monthKey,
    slotDates: getFridaySlotDates(input.monthKey),
    program,
    rows: [...rows].sort(sortCompetitionRows),
    competitionParticipantCount,
    winnerCount,
  };
}

export async function getScreenTimeProgramByBenefit(
  db: Database,
  benefitId: string,
): Promise<ScreenTimeProgramView | null> {
  const rows = await db
    .select()
    .from(schema.screenTimePrograms)
    .where(eq(schema.screenTimePrograms.benefitId, benefitId))
    .limit(1);

  return rows[0] ?? null;
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
  const todayLocalDate = input.todayLocalDate ?? resolveTodayLocalDateString();
  const board = await recomputeScreenTimeCompetitionMonth(db, {
    benefitId: input.benefitId,
    monthKey: input.monthKey,
    todayLocalDate,
  });

  const row = board.rows.find((item) => item.employeeId === input.employeeId);
  if (!row) {
    return buildEmptyMonthlyResultView({
      benefitId: input.benefitId,
      employeeId: input.employeeId,
      monthKey: input.monthKey,
      todayLocalDate,
    });
  }
  return row.result;
}

export async function buildMyScreenTimeMonth(
  db: Database,
  employee: Employee,
  benefitId: string,
  monthKey?: string | null,
  todayLocalDateOverride?: string | null,
) {
  const todayLocalDate = resolveTodayLocalDateString(todayLocalDateOverride);
  const activeSlotMonthKey = getAssignedMonthKeyForSlotDate(todayLocalDate);
  const defaultMonthKey =
    getActiveFridaySlotDate(activeSlotMonthKey, todayLocalDate) != null
      ? activeSlotMonthKey
      : getMonthKeyFromDateString(todayLocalDate);
  const normalizedMonthKey = monthKey || defaultMonthKey;
  const activeSlotDate = getActiveFridaySlotDate(normalizedMonthKey, todayLocalDate);

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
    : buildEmptyMonthlyResultView({
        benefitId,
        employeeId: employee.id,
        monthKey: normalizedMonthKey,
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
  const activeSlotMonthKey = getAssignedMonthKeyForSlotDate(todayLocalDate);
  const defaultMonthKey =
    getActiveFridaySlotDate(activeSlotMonthKey, todayLocalDate) != null
      ? activeSlotMonthKey
      : getMonthKeyFromDateString(todayLocalDate);
  const normalizedMonthKey = monthKey || defaultMonthKey;
  const program = await getScreenTimeProgramByBenefit(db, benefitId);
  if (!program) {
    return {
      benefitId,
      monthKey: normalizedMonthKey,
      slotDates: getFridaySlotDates(normalizedMonthKey),
      program: null,
      rows: [],
      competitionParticipantCount: 0,
      winnerCount: 0,
      totalEmployeeCount: 0,
    };
  }

  const board = await recomputeScreenTimeCompetitionMonth(db, {
    benefitId,
    monthKey: normalizedMonthKey,
    todayLocalDate,
  });

  return {
    benefitId,
    monthKey: normalizedMonthKey,
    slotDates: board.slotDates,
    program,
    rows: board.rows,
    competitionParticipantCount: board.competitionParticipantCount,
    winnerCount: board.winnerCount,
    totalEmployeeCount: board.rows.length,
  };
}

export async function upsertScreenTimeProgramConfig(
  db: Database,
  input: {
    benefitId: string;
    screenshotRetentionDays?: number | null;
    winnerPercent: number;
    rewardAmountMnt: number;
  },
) {
  const now = new Date().toISOString();
  const existingProgram = await db
    .select()
    .from(schema.screenTimePrograms)
    .where(eq(schema.screenTimePrograms.benefitId, input.benefitId))
    .limit(1);

  const normalizedWinnerPercent = Math.min(100, Math.max(1, Math.round(input.winnerPercent)));
  const normalizedRewardAmount = Math.max(0, Math.round(input.rewardAmountMnt));

  if (existingProgram[0]) {
    await db
      .update(schema.screenTimePrograms)
      .set({
        screenshotRetentionDays:
          input.screenshotRetentionDays ?? existingProgram[0].screenshotRetentionDays,
        winnerPercent: normalizedWinnerPercent,
        rewardAmountMnt: normalizedRewardAmount,
        updatedAt: now,
      })
      .where(eq(schema.screenTimePrograms.benefitId, input.benefitId));
  } else {
    await db.insert(schema.screenTimePrograms).values({
      benefitId: input.benefitId,
      screenshotRetentionDays: input.screenshotRetentionDays ?? 30,
      winnerPercent: normalizedWinnerPercent,
      rewardAmountMnt: normalizedRewardAmount,
      isActive: true,
    });
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
  const todayLocalDate = resolveTodayLocalDateString();
  const requiredSlotDates = getFridaySlotDates(stored.monthKey);
  const dueSlotDates = getDueFridaySlotDates(stored.monthKey, todayLocalDate);

  return {
    id: stored.id,
    benefitId: stored.benefitId,
    employeeId: stored.employeeId,
    monthKey: stored.monthKey,
    requiredSlotDates,
    dueSlotDates,
    missingDueSlotDates: safeJsonArray(stored.missingDueSlotDatesJson),
    rejectedDueSlotDates: [],
    requiredSlotCount: stored.requiredSlotCount,
    dueSlotCount: dueSlotDates.length,
    submittedSlotCount: stored.submittedSlotCount,
    approvedSlotCount: stored.approvedSlotCount,
    monthlyAvgDailyMinutes: stored.monthlyAvgDailyMinutes,
    competitionParticipantCount: stored.competitionParticipantCount,
    rankedParticipantCount: stored.rankedParticipantCount,
    rankPosition: stored.rankPosition,
    winnerCutoffRank: stored.winnerCutoffRank,
    isWinner: stored.isWinner,
    rewardAmountMnt: stored.rewardAmountMnt,
    isProvisional: dueSlotDates.length < requiredSlotDates.length,
    status: stored.status,
    approvedByEmployeeId: null,
    approvedAt: null,
    decisionNote: stored.decisionNote,
    disqualificationReason: stored.disqualificationReason,
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

  return board.rows
    .filter(
      (row) =>
        row.result.isWinner &&
        typeof row.result.monthlyAvgDailyMinutes === "number" &&
        row.result.rankPosition != null,
    )
    .sort(sortCompetitionRows)
    .map((row) => ({
      rank: row.result.rankPosition,
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      employeeEmail: row.employeeEmail,
      monthKey: row.result.monthKey,
      status: row.result.status,
      avgDailyMinutes: row.result.monthlyAvgDailyMinutes,
      rewardAmountMnt: row.result.rewardAmountMnt,
      approvedSlotCount: row.result.approvedSlotCount,
      dueSlotCount: row.result.dueSlotCount,
      requiredSlotCount: row.result.requiredSlotCount,
      isProvisional: row.result.isProvisional,
      winnerCutoffRank: row.result.winnerCutoffRank,
      competitionParticipantCount: row.result.competitionParticipantCount,
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
 * For every employee that does not yet have a screen-time submission for each
 * due Friday slot of `monthKey`, inserts a synthetic "auto-approved"
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
  const dueSlotDates = getDueFridaySlotDates(monthKey, todayLocalDate);
  console.log(`[seed/service] monthKey=${monthKey} todayLocalDate=${todayLocalDate} dueSlotDates=${JSON.stringify(dueSlotDates)}`);
  if (dueSlotDates.length === 0) {
    console.log("[seed/service] no due slot dates — aborting");
    return 0;
  }

  // Ensure a screenTimePrograms row exists so buildAdminScreenTimeMonthBoard
  // does not exit early. We create a bare program if absent.
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
