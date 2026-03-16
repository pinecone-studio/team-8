import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
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
    };
  },
  { db, env, baseUrl, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const { benefitId, requestedAmount, repaymentMonths } = input;

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

  const approvalPolicy = benefitFromDb.approvalPolicy ?? "hr";
  const initialStatus = deriveInitialStatus(approvalPolicy, benefitFromDb.requiresContract);

  const [inserted] = await db
    .insert(schema.benefitRequests)
    .values({
      employeeId: employee.id,
      benefitId,
      status: initialStatus,
      requestedAmount: requestedAmount ?? null,
      repaymentMonths: repaymentMonths ?? null,
    })
    .returning();

  if (!inserted) throw new Error("Failed to create benefit request");

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
    metadata: { status: initialStatus, approvalPolicy },
  });

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
      );
      viewContractUrl = getContractViewUrl(baseUrl, token);
    }
  }

  return { ...inserted, viewContractUrl };
};
