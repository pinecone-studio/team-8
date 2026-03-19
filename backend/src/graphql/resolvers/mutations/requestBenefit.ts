import { and, eq, notInArray } from "drizzle-orm";
import { schema } from "../../../db";
import type { Employee } from "../../../db";
import { getOrCreateContractViewToken, getContractViewUrl } from "../../../contracts";
import { sendBenefitRequestSubmittedEmail, sendHrNewBenefitRequestEmail } from "../../../email/sendTransactionalEmail";
import type { GraphQLContext } from "../../context";
import { getInternalRole, requireAuth } from "../../../auth";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import { writeAuditLog } from "../helpers/audit";
import {
  AWAITING_FINANCE_REVIEW_STATUS,
  isFinanceBenefitFlowType,
} from "../../../benefits/finance";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getTenureMonths(hireDateIso: string, now: Date): number {
  const hireMs = new Date(hireDateIso).getTime();
  const days = Math.floor((now.getTime() - hireMs) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 30);
}

async function resolveEmployeeMonthlySalaryMnt(params: {
  envDb: D1Database;
  employeeId: string;
  employee: Pick<Employee, "id" | "role" | "department" | "responsibilityLevel">;
}): Promise<number> {
  // Prefer a real salary column when available. If the current environment
  // doesn't carry payroll data, fall back to a stable role/level estimate so
  // the finance-benefit demo flow still works without crashing.
  const { envDb, employeeId, employee } = params;

  const estimateMonthlySalaryMnt = () => {
    const level = Math.max(1, employee.responsibilityLevel ?? 1);
    const role = String(employee.role ?? "").trim().toLowerCase();
    const department = String(employee.department ?? "").trim().toLowerCase();

    const baseByLevel: Record<number, number> = {
      1: 2200000,
      2: 3200000,
      3: 4500000,
      4: 6200000,
      5: 8000000,
    };

    let estimate = baseByLevel[level] ?? (8000000 + Math.max(0, level - 5) * 1200000);

    if (role.includes("intern")) estimate = Math.min(estimate, 1800000);
    else if (role.includes("manager")) estimate += 900000;
    else if (role.includes("lead")) estimate += 700000;
    else if (role.includes("senior")) estimate += 500000;
    else if (
      role.includes("engineer") ||
      role.includes("analyst") ||
      role.includes("designer") ||
      role.includes("specialist")
    ) {
      estimate += 300000;
    }

    if (department === "finance" || department === "engineering") {
      estimate += 200000;
    }

    return Math.round(estimate / 10000) * 10000;
  };

  const fallbackSalary = estimateMonthlySalaryMnt();

  const pragmaStmt = envDb.prepare("PRAGMA table_info(employees)");
  const pragma = (await pragmaStmt.all()) as unknown as {
    results?: Array<{ name: string }>;
  };

  const cols: string[] = (pragma.results ?? [])
    .map((r) => r.name)
    .filter((n) => n.trim().length > 0);

  // Prefer salary/wage/pay/income-like names.
  const candidates = cols.filter((c) => {
    const lc = c.toLowerCase();
    return (
      lc.includes("salary") ||
      lc.includes("wage") ||
      lc.includes("pay") ||
      lc.includes("income") ||
      lc.includes("gross") ||
      lc.includes("net") ||
      lc.includes("comp") ||
      lc.includes("earn")
    );
  });

  const pick = (names: string[], scoreFn: (n: string) => number) =>
    names.sort((a, b) => scoreFn(b) - scoreFn(a))[0];

  const chosen = pick(candidates, (n) => {
    const lc = n.toLowerCase();
    let score = 0;
    if (lc.includes("monthly") || lc.includes("month")) score += 5;
    if (lc.includes("mnt")) score += 4;
    if (lc === "salary") score += 3;
    if (lc.includes("salary")) score += 2;
    if (lc.includes("wage")) score += 2;
    if (lc.includes("income")) score += 2;
    return score;
  });

  if (candidates.length === 0) {
    console.warn(
      `[requestBenefit] Monthly salary column not found for employee ${employeeId}. Falling back to estimated salary ${fallbackSalary} MNT. Available columns: ${cols.join(", ")}`,
    );
    return fallbackSalary;
  }

  if (!chosen) {
    console.warn(
      `[requestBenefit] Monthly salary column could not be selected for employee ${employeeId}. Falling back to estimated salary ${fallbackSalary} MNT. Candidates: ${candidates.join(", ")}.`,
    );
    return fallbackSalary;
  }

  const salaryStmt = envDb.prepare(
    `SELECT ${chosen} AS monthly_salary_mnt FROM employees WHERE id = ?`,
  );
  const rows = (await salaryStmt.bind(employeeId).all()) as unknown as {
    results?: Array<{ monthly_salary_mnt: unknown }>;
  };

  const raw = rows?.results?.[0]?.monthly_salary_mnt ?? null;
  if (raw === null) {
    console.warn(
      `[requestBenefit] Monthly salary is NULL in column "${chosen}" for employee ${employeeId}. Falling back to estimated salary ${fallbackSalary} MNT.`,
    );
    return fallbackSalary;
  }
  const salary = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(salary) || salary <= 0) {
    console.warn(
      `[requestBenefit] Monthly salary in column "${chosen}" is invalid for employee ${employeeId} (value=${String(raw)}). Falling back to estimated salary ${fallbackSalary} MNT.`,
    );
    return fallbackSalary;
  }
  return Math.round(salary);
}

/** Derive initial request status from benefit's approvalPolicy.
 *  Contract benefits enter awaiting_contract_acceptance first — except
 *  down_payment (Finance Benefit): employee submits amount first; HR contract
 *  is signed only after dual approval.
 *  Contract acceptance is ONLY recorded via confirmBenefitRequest. */
function deriveInitialStatus(
  approvalPolicy: string,
  requiresContract: boolean,
  financeFirstPhase: boolean,
): string {
  if (financeFirstPhase) {
    return AWAITING_FINANCE_REVIEW_STATUS;
  }
  if (requiresContract) {
    return "awaiting_contract_acceptance";
  }
  if (approvalPolicy === "finance") {
    return AWAITING_FINANCE_REVIEW_STATUS;
  }
  // hr or dual → HR reviews first
  return "awaiting_hr_review";
}

export const requestBenefit = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      benefitId: string;
      requestedAmount?: number | null;
      repaymentMonths?: number | null;
      employeeContractKey?: string | null;
      employeeSignedContractId?: string | null;
    };
  },
  { db, env, baseUrl, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const now = new Date();
  const {
    benefitId,
    requestedAmount,
    repaymentMonths,
    employeeContractKey,
    employeeSignedContractId,
  } = input;

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  const benefitFromDb = benefitRows[0];

  if (!benefitFromDb) {
    throw new Error("Benefit not found.");
  }

  if (!benefitFromDb.isActive) {
    throw new Error("This benefit is no longer available.");
  }

  if (benefitFromDb.flowType === "self_service") {
    throw new Error(
      "This benefit updates automatically based on your eligibility. No request is needed.",
    );
  }

  const approvalPolicy = benefitFromDb.approvalPolicy ?? "hr";
  const flowNorm = String(benefitFromDb.flowType ?? "").trim().toLowerCase();
  const isDownPaymentFlow = flowNorm === "down_payment";

  const eligibilities = await getBenefitsForEmployee(db, employee.id);
  const eligibility = eligibilities.find((item) => item.benefitId === benefitId);

  if (!eligibility) {
    throw new Error("No eligibility information found for this benefit.");
  }

  const canRequestFromStatus =
    eligibility.status === "ELIGIBLE" ||
    (isDownPaymentFlow && eligibility.status === "ACTIVE");

  if (!canRequestFromStatus) {
    throw new Error(
      eligibility.failedRule?.errorMessage ??
        "You are not currently eligible to request this benefit.",
    );
  }

  // Duplicate-request guard: reject if an active (non-terminal) request for this
  // benefit already exists for this employee.  This prevents accidental double-
  // submissions from rapid clicks or retried network requests.
  const TERMINAL_STATUSES = isDownPaymentFlow
    ? (["cancelled", "declined", "rejected", "approved"] as const)
    : (["cancelled", "declined", "rejected"] as const);
  const existingActive = await db
    .select({ id: schema.benefitRequests.id })
    .from(schema.benefitRequests)
    .where(
      and(
        eq(schema.benefitRequests.employeeId, employee.id),
        eq(schema.benefitRequests.benefitId, benefitId),
        notInArray(schema.benefitRequests.status, [...TERMINAL_STATUSES]),
      ),
    )
    .limit(1);
  if (existingActive.length > 0) {
    throw new Error(
      "You already have an active request for this benefit. " +
        "Cancel the existing request before submitting a new one.",
    );
  }

  const amt = requestedAmount ?? null;
  const months = repaymentMonths ?? null;
  const hasValidLoanFields =
    amt != null &&
    Number.isFinite(amt) &&
    amt > 0 &&
    months != null &&
    Number.isFinite(months) &&
    months > 0;
  /** Loan request first; signed contract only after approvals (down_payment or dual+contract with loan fields). */
  const financeFirstPhase =
    isDownPaymentFlow ||
    (approvalPolicy === "dual" &&
      benefitFromDb.requiresContract &&
      hasValidLoanFields);

  if (isDownPaymentFlow && !hasValidLoanFields) {
    throw new Error(
      "Finance benefits require a requested loan amount and repayment term (months).",
    );
  }

  // ── Additional finance-loan validations ────────────────────────────────
  // The user's required business rules for "зээл олгох" (down_payment finance benefit):
  //  1) Tenure: employee must have been working for 6+ months.
  //  2) Cap: monthly loan installment must be <= 30% of employee monthly salary.
  //  3) Previous loans: any previous approved down_payment request must be fully repaid.
  if (isDownPaymentFlow) {
    // 1) Tenure >= 6 months
    const tenureMonths = getTenureMonths(employee.hireDate, now);
    if (tenureMonths < 6) {
      throw new Error("Available after 6 months of employment.");
    }

    // 2) Monthly installment cap (interest: 2.0% per month)
    //    For reducing-balance loans, the maximum installment happens in month 1,
    //    so we conservatively check month-1 against the 30% salary cap.
    const interestRateMonthly = 0.02; // 2.0% per month
    const monthlyPrincipal = (amt as number) / (months as number);
    const monthlyInterestFirstMonth = (amt as number) * interestRateMonthly;
    const monthlyInstallmentFirstMonth = monthlyPrincipal + monthlyInterestFirstMonth;

    const monthlySalaryMnt = await resolveEmployeeMonthlySalaryMnt({
      envDb: env.DB,
      employeeId: employee.id,
      employee,
    });

    const cappedInstallment = Math.ceil(monthlyInstallmentFirstMonth);
    const maxAllowed = Math.floor(monthlySalaryMnt * 0.3);
    if (cappedInstallment > maxAllowed) {
      throw new Error(
        `Monthly installment exceeds the 30% salary cap. Max allowed: ${maxAllowed}₮.`,
      );
    }

    // 3) Previous approved loans must be fully repaid
    //    We treat a down_payment request as "active loan" only after contract upload,
    //    which sets `status=approved` and `employeeApprovedAt`.
    const prevLoanRows = await db
      .select({
        id: schema.benefitRequests.id,
        status: schema.benefitRequests.status,
        requestedAmount: schema.benefitRequests.requestedAmount,
        repaymentMonths: schema.benefitRequests.repaymentMonths,
        employeeApprovedAt: schema.benefitRequests.employeeApprovedAt,
        benefitId: schema.benefitRequests.benefitId,
        benefitFlowType: schema.benefits.flowType,
      })
      .from(schema.benefitRequests)
      .innerJoin(
        schema.benefits,
        eq(schema.benefits.id, schema.benefitRequests.benefitId),
      )
      .where(
        and(
          eq(schema.benefitRequests.employeeId, employee.id),
          eq(schema.benefitRequests.status, "approved"),
          eq(schema.benefits.flowType, "down_payment"),
        ),
      );

    for (const row of prevLoanRows) {
      const start = row.employeeApprovedAt ? new Date(row.employeeApprovedAt) : null;
      const termMonths = row.repaymentMonths;
      if (!start || !termMonths || !Number.isFinite(termMonths) || termMonths <= 0) {
        // If we can't compute repayment end, we block to be safe.
        throw new Error("Previous loan is not fully repaid yet.");
      }

      const repaidAt = addMonths(start, termMonths);
      if (now.getTime() < repaidAt.getTime()) {
        throw new Error("Previous loan is not fully repaid yet.");
      }
    }
  }

  const initialStatus = deriveInitialStatus(
    approvalPolicy,
    benefitFromDb.requiresContract,
    financeFirstPhase,
  );

  let resolvedEmployeeContractKey: string | null = null;
  let attachedEmployeeSignedContractId: string | null = null;

  if (benefitFromDb.requiresContract && !financeFirstPhase) {
    if (!employeeSignedContractId && !employeeContractKey) {
      throw new Error(
        "Please upload your signed contract before submitting this request.",
      );
    }

    const contractRows = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, benefitId));
    const activeHrContract = contractRows.find((row) => row.isActive);
    if (!activeHrContract) {
      throw new Error(
        "No active HR contract is available for this benefit. Please contact HR.",
      );
    }

    let signedContract:
      | typeof schema.employeeSignedContracts.$inferSelect
      | undefined;

    if (employeeSignedContractId) {
      const rows = await db
        .select()
        .from(schema.employeeSignedContracts)
        .where(eq(schema.employeeSignedContracts.id, employeeSignedContractId))
        .limit(1);
      signedContract = rows[0];
    } else if (employeeContractKey) {
      const rows = await db
        .select()
        .from(schema.employeeSignedContracts)
        .where(
          and(
            eq(schema.employeeSignedContracts.employeeId, employee.id),
            eq(schema.employeeSignedContracts.benefitId, benefitId),
            eq(schema.employeeSignedContracts.r2ObjectKey, employeeContractKey),
          ),
        )
        .limit(1);
      signedContract = rows[0];
    }

    if (!signedContract) {
      throw new Error(
        "We could not find your uploaded signed contract. Please upload it again before submitting.",
      );
    }

    if (signedContract.employeeId !== employee.id) {
      throw new Error("Uploaded contract does not belong to the current employee.");
    }
    if (signedContract.benefitId !== benefitId) {
      throw new Error("Uploaded contract does not match the selected benefit.");
    }
    if (signedContract.status !== "uploaded") {
      throw new Error(
        "This signed contract copy is no longer the latest uploaded version. Please upload a fresh scanned copy.",
      );
    }
    if (signedContract.requestId) {
      throw new Error(
        "This signed contract copy is already attached to a previous request. Please upload a fresh scanned copy.",
      );
    }
    if (signedContract.hrContractId !== activeHrContract.id) {
      throw new Error(
        "The HR contract has changed since you uploaded your signed copy. Please review the latest contract and upload a new signed copy.",
      );
    }
    if (
      signedContract.hrContractVersion !== activeHrContract.version ||
      signedContract.hrContractHash !== activeHrContract.sha256Hash
    ) {
      throw new Error(
        "Your signed contract copy does not match the current HR contract version. Please upload a new signed copy.",
      );
    }

    resolvedEmployeeContractKey = signedContract.r2ObjectKey;
    attachedEmployeeSignedContractId = signedContract.id;
  }

  const [inserted] = await db
    .insert(schema.benefitRequests)
    .values({
      employeeId: employee.id,
      benefitId,
      status: initialStatus,
      requestedAmount: requestedAmount ?? null,
      repaymentMonths: repaymentMonths ?? null,
      employeeContractKey:
        resolvedEmployeeContractKey ?? employeeContractKey ?? null,
    })
    .returning();

  if (!inserted) throw new Error("Failed to create benefit request");

  if (attachedEmployeeSignedContractId) {
    await db
      .update(schema.employeeSignedContracts)
      .set({
        requestId: inserted.id,
        status: "attached_to_request",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.employeeSignedContracts.id, attachedEmployeeSignedContractId))
      .catch((err) => {
        console.error(
          `[requestBenefit] Failed to attach employee signed contract ${attachedEmployeeSignedContractId} to request ${inserted.id}:`,
          err,
        );
      });
  }

  // Audit log for request submission
  await writeAuditLog({
    db,
    actor: employee,
    actionType: "REQUEST_SUBMITTED",
    entityType: "benefit_request",
    entityId: inserted.id,
    targetEmployeeId: employee.id,
    benefitId,
    requestId: inserted.id,
    metadata: {
      status: initialStatus,
      approvalPolicy,
      employeeSignedContractId: attachedEmployeeSignedContractId,
    },
  });

  await sendBenefitRequestSubmittedEmail(
    env,
    employee,
    benefitFromDb,
    initialStatus,
  );

  // Notify active HR managers about the new request.
  // Awaited via Promise.all so emails are sent before the Worker response
  // completes (avoids being killed mid-flight by the Workers runtime).
  const activeReviewers = await db
    .select({
      email: schema.employees.email,
      department: schema.employees.department,
      responsibilityLevel: schema.employees.responsibilityLevel,
    })
    .from(schema.employees)
    .where(eq(schema.employees.employmentStatus, "active"));
  const displayName = employee.nameEng?.trim() || employee.name.trim() || employee.email;
  const reviewerEmails = activeReviewers
    .filter((reviewer) => {
      const role = getInternalRole(reviewer as any);
      if (isFinanceBenefitFlowType(benefitFromDb.flowType)) {
        return role === "finance_admin" || role === "finance_manager";
      }
      return role === "hr_admin" || role === "hr_manager";
    })
    .map((reviewer) => reviewer.email);
  await Promise.all(
    reviewerEmails.map((email) =>
      sendHrNewBenefitRequestEmail(env, email, displayName, benefitFromDb.name).catch(
        (err) => console.error("[requestBenefit] HR alert email failed:", err),
      ),
    ),
  );

  const requiresContract = benefitFromDb.requiresContract;
  let viewContractUrl: string | null = null;
  if (requiresContract && env.CONTRACT_VIEW_TOKENS) {
    const contracts = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, benefitId));
    const active = contracts.find((c) => c.isActive);
    if (active) {
      const token = await getOrCreateContractViewToken(
        env.CONTRACT_VIEW_TOKENS,
        active.r2ObjectKey,
        undefined,
        { employeeId: employee.id, contractId: active.id },
      );
      if (token) {
        viewContractUrl = getContractViewUrl(baseUrl, token);
      }
    }
  }

  return { ...inserted, viewContractUrl };
};
