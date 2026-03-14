import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";

export const requestBenefit = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      employeeId: string;
      benefitId: string;
      contractVersionAccepted?: string | null;
      contractAcceptedAt?: string | null;
      requestedAmount?: number | null;
      repaymentMonths?: number | null;
    };
  },
  { db, env, baseUrl, currentUser }: GraphQLContext
) => {
  const {
    employeeId,
    benefitId,
    contractVersionAccepted,
    contractAcceptedAt,
    requestedAmount,
    repaymentMonths,
  } = input;

  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== employeeId) {
    throw new Error("You can only request benefits for your own employee profile.");
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  const benefitFromDb = benefitRows[0];

  if (!benefitFromDb) throw new Error("Benefit not found.");
  if (!benefitFromDb.isActive) throw new Error("This benefit is no longer available.");

  const eligibilities = await getBenefitsForEmployee(db, employeeId);
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
      employeeId,
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
      const token = await createContractViewToken(env.CONTRACT_VIEW_TOKENS, active.r2ObjectKey);
      viewContractUrl = getContractViewUrl(baseUrl, token);
    }
  }

  return { ...inserted, viewContractUrl };
};
