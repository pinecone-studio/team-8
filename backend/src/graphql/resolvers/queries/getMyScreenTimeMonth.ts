import { requireAuth } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { buildMyScreenTimeMonth, ensureScreenTimeBenefit } from "../../../screen-time/service";

function resolveDebugDate(env: GraphQLContext["env"]): string | null {
  if (env.ENVIRONMENT !== "development") return null;
  return env.SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE ?? null;
}

export const getMyScreenTimeMonth = async (
  _: unknown,
  {
    benefitId,
    monthKey,
  }: {
    benefitId: string;
    monthKey?: string | null;
  },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  await ensureScreenTimeBenefit(db, benefitId);
  return buildMyScreenTimeMonth(
    db,
    employee,
    benefitId,
    monthKey,
    resolveDebugDate(env),
  );
};
