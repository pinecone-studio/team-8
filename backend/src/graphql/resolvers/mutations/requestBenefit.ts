import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";
import { evaluateBenefitEligibility } from "../benefits/eligibility";

export const requestBenefit = async (
  _: unknown,
  { input }: { input: { employeeId: string; benefitId: string; requestedUnits?: number } },
  { db }: GraphQLContext
) => {
  const employees = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, input.employeeId));
  const employee = employees[0];
  if (!employee) {
    throw new Error("Employee not found.");
  }

  const benefits = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, input.benefitId));
  const benefit = benefits[0];
  if (!benefit) {
    throw new Error("Benefit not found.");
  }

  const rules = await db
    .select()
    .from(schema.benefitRules)
    .where(eq(schema.benefitRules.benefitId, benefit.id));
  const contractAcceptances = await db
    .select()
    .from(schema.benefitContractAcceptances)
    .where(eq(schema.benefitContractAcceptances.employeeId, employee.id));

  const eligibility = evaluateBenefitEligibility({
    employee,
    rules,
    requestedUnits: input.requestedUnits ?? 1,
    contractAcceptances,
  });

  if (eligibility.status === "ineligible") {
    throw new Error(eligibility.blockingMessages[0] || "Not eligible.");
  }

  const [request] = await db
    .insert(schema.benefitRequests)
    .values({
      benefitId: input.benefitId,
      employeeId: input.employeeId,
      requestedUnits: input.requestedUnits ?? 1,
      status: "pending",
      statusReason:
        eligibility.status === "requires_approval"
          ? "Awaiting approval"
          : null,
    })
    .returning();

  return request;
};
