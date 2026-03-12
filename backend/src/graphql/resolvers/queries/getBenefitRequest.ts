import { eq } from "drizzle-orm";
import { schema } from "../../../db";

/** Get a single benefit request by ID. */
export const getBenefitRequest = async (
  _: unknown,
  { id }: { id: string },
  { db }: { db: import("../../../db").Database }
) => {
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, id));
  return requests[0] ?? null;
};
