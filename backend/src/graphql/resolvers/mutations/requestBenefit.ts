import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { evaluateBenefit, getBenefitConfig } from "../../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

export const requestBenefit = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      benefitId: string;
      contractVersionAccepted?: string | null;
      contractAcceptedAt?: string | null;
      requestedAmount?: number | null;
      repaymentMonths?: number | null;
    };
  },
  { db, env, baseUrl, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const {
    benefitId,
    contractVersionAccepted,
    contractAcceptedAt,
    requestedAmount,
    repaymentMonths,
  } = input;

  const benefitConfig = getBenefitConfig(benefitId);
  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  const benefitFromDb = benefitRows[0];

  if (benefitConfig) {
    const evaluated = evaluateBenefit(employee, benefitId);
    if (evaluated.status === "locked") {
      throw new Error(
        evaluated.failedRule?.errorMessage ?? "Not eligible for this benefit.",
      );
    }
    if (benefitConfig.flowType === "self_service") {
      throw new Error(
        "This benefit does not require a request; it is self-service.",
      );
    }
  } else {
    if (!benefitFromDb) throw new Error("Benefit not found.");
    if (!benefitFromDb.isActive)
      throw new Error("This benefit is no longer available.");
  }

  const [inserted] = await db
    .insert(schema.benefitRequests)
    .values({
      employeeId: employee.id,
      benefitId,
      status: "pending",
      contractVersionAccepted: contractVersionAccepted ?? null,
      contractAcceptedAt: contractAcceptedAt ?? null,
      requestedAmount: requestedAmount ?? null,
      repaymentMonths: repaymentMonths ?? null,
    })
    .returning();

  if (!inserted) throw new Error("Failed to create benefit request");

  const requiresContract =
    benefitConfig?.requiresContract ?? benefitFromDb?.requiresContract ?? false;
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
