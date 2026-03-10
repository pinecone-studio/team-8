import { eq, inArray } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";
import { evaluateBenefitEligibility } from "../benefits/eligibility";

export const getBenefitEligibility = async (
  _: unknown,
  { employeeId, requestedUnits }: { employeeId: string; requestedUnits?: number },
  { db }: GraphQLContext
) => {
    const employees = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.id, employeeId));
    const employee = employees[0];
    if (!employee) {
      throw new Error("Employee not found.");
    }

    const benefits = await db.select().from(schema.benefits);
    if (benefits.length === 0) {
      return [];
    }

    const benefitIds = benefits.map((b) => b.id);
    const rules = await db
      .select()
      .from(schema.benefitRules)
      .where(inArray(schema.benefitRules.benefitId, benefitIds));
    const rulesByBenefit = new Map<string, typeof rules>();
    for (const rule of rules) {
      const list = rulesByBenefit.get(rule.benefitId) || [];
      list.push(rule);
      rulesByBenefit.set(rule.benefitId, list);
    }

    const contractAcceptances = await db
      .select()
      .from(schema.benefitContractAcceptances)
      .where(eq(schema.benefitContractAcceptances.employeeId, employeeId));

    return benefits.map((benefit) => {
      const benefitRules = rulesByBenefit.get(benefit.id) || [];
      const eligibility = evaluateBenefitEligibility({
        employee,
        rules: benefitRules,
        requestedUnits: requestedUnits ?? undefined,
        contractAcceptances,
      });

      return {
        benefit,
        status: eligibility.status,
        blockingMessages: eligibility.blockingMessages,
      };
    });
  };
