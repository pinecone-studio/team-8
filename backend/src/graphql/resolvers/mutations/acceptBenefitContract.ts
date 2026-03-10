import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const acceptBenefitContract = async (
  _: unknown,
  { employeeId, vendor }: { employeeId: string; vendor: string },
  { db }: GraphQLContext
) => {
    const existing = await db
      .select()
      .from(schema.benefitContractAcceptances)
      .where(
        and(
          eq(schema.benefitContractAcceptances.employeeId, employeeId),
          eq(schema.benefitContractAcceptances.vendor, vendor)
        )
      );

    if (existing.length > 0) {
      return true;
    }

    await db.insert(schema.benefitContractAcceptances).values({
      employeeId,
      vendor,
    });

    return true;
  };
