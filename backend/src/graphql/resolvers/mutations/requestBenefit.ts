import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";

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
