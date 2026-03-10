import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { evaluateBenefit, getBenefitConfig } from "../../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";

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
    };
  },
  { db, env, baseUrl }: GraphQLContext
) => {
  const { employeeId, benefitId, contractVersionAccepted, contractAcceptedAt } = input;

  const employees = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, employeeId));
  const employee = employees[0];
  if (!employee) throw new Error("Employee not found");

  const evaluated = evaluateBenefit(employee, benefitId);
  if (evaluated.status === "locked") {
    throw new Error(evaluated.failedRule?.errorMessage ?? "Not eligible for this benefit.");
  }

  const [inserted] = await db
    .insert(schema.benefitRequests)
    .values({
      employeeId,
      benefitId,
      status: "pending",
      contractVersionAccepted: contractVersionAccepted ?? null,
      contractAcceptedAt: contractAcceptedAt ?? null,
    })
    .returning();

  if (!inserted) throw new Error("Failed to create benefit request");

  let viewContractUrl: string | null = null;
  const benefitConfig = getBenefitConfig(benefitId);
  if (benefitConfig?.requiresContract && env.CONTRACT_VIEW_TOKENS) {
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
