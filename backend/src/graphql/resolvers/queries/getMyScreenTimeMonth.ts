import { requireAuth } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { buildMyScreenTimeMonth, ensureScreenTimeBenefit } from "../../../screen-time/service";
import { resolveScreenTimeDebugDate } from "../../../screen-time/debug";

export const getMyScreenTimeMonth = async (
  _: unknown,
  {
    benefitId,
    monthKey,
  }: {
    benefitId: string;
    monthKey?: string | null;
  },
  { db, env, baseUrl, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  await ensureScreenTimeBenefit(db, benefitId);
  return buildMyScreenTimeMonth(
    db,
    employee,
    benefitId,
    monthKey,
    resolveScreenTimeDebugDate(env, baseUrl),
  );
};
