import { and, eq, notInArray } from "drizzle-orm";
import { schema } from "../../../db";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import { sendBenefitRequestSubmittedEmail, sendHrNewBenefitRequestEmail } from "../../../email/sendTransactionalEmail";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import { writeAuditLog } from "../helpers/audit";

/** Derive initial request status from benefit's approvalPolicy.
 *  Contract benefits ALWAYS enter awaiting_contract_acceptance first.
 *  Contract acceptance is ONLY recorded via confirmBenefitRequest. */
function deriveInitialStatus(
  approvalPolicy: string,
  requiresContract: boolean,
): string {
  if (requiresContract) {
    return "awaiting_contract_acceptance";
  }
  if (approvalPolicy === "finance") {
    return "awaiting_finance_review";
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

  const eligibilities = await getBenefitsForEmployee(db, employee.id);
  const eligibility = eligibilities.find((item) => item.benefitId === benefitId);

  if (!eligibility) {
    throw new Error("No eligibility information found for this benefit.");
  }

  if (eligibility.status !== "ELIGIBLE") {
    throw new Error(
      eligibility.failedRule?.errorMessage ??
        "You are not currently eligible to request this benefit.",
    );
  }

  // Duplicate-request guard: reject if an active (non-terminal) request for this
  // benefit already exists for this employee.  This prevents accidental double-
  // submissions from rapid clicks or retried network requests.
  const TERMINAL_STATUSES = ["cancelled", "declined"] as const;
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

  const approvalPolicy = benefitFromDb.approvalPolicy ?? "hr";
  const initialStatus = deriveInitialStatus(approvalPolicy, benefitFromDb.requiresContract);

  let resolvedEmployeeContractKey: string | null = null;
  let attachedEmployeeSignedContractId: string | null = null;

  if (benefitFromDb.requiresContract) {
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
  const hrManagers = await db
    .select({ email: schema.employees.email })
    .from(schema.employees)
    .where(
      and(
        eq(schema.employees.employmentStatus, "active"),
        eq(schema.employees.role, "hr_manager"),
      ),
    );
  const displayName = employee.nameEng?.trim() || employee.name.trim() || employee.email;
  await Promise.all(
    hrManagers.map((hr) =>
      sendHrNewBenefitRequestEmail(env, hr.email, displayName, benefitFromDb.name).catch(
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
      const token = await createContractViewToken(
        env.CONTRACT_VIEW_TOKENS,
        active.r2ObjectKey,
        undefined,
        { employeeId: employee.id, contractId: active.id },
      );
      viewContractUrl = getContractViewUrl(baseUrl, token);
    }
  }

  return { ...inserted, viewContractUrl };
};
