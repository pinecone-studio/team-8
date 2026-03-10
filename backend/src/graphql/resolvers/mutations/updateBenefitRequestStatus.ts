import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const updateBenefitRequestStatus = async (
  _: unknown,
  {
    id,
    input,
  }: {
    id: string;
    input: {
      status: string;
      statusReason?: string;
      managerApproved?: number;
      financeApproved?: number;
    };
  },
  { db }: GraphQLContext
) => {
    const [request] = await db
      .update(schema.benefitRequests)
      .set({
        status: input.status,
        statusReason: input.statusReason ?? null,
        managerApproved: input.managerApproved ?? undefined,
        financeApproved: input.financeApproved ?? undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.benefitRequests.id, id))
      .returning();
    return request || null;
  };
