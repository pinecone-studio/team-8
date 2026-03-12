import { eq } from "drizzle-orm";
import { schema } from "../../../db";

/** Session nemeh esehee shiideh: returns current employee when employeeId is provided (e.g. from session/token). */
export const getSession = async (
  _: unknown,
  { employeeId }: { employeeId?: string | null },
  { db }: { db: import("../../../db").Database }
) => {
  if (!employeeId) return null;
  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, employeeId));
  return results[0] ?? null;
};
