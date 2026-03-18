import { requireAuth } from "../../../auth";
import type { GraphQLContext } from "../../context";
import {
  buildScreenTimeLeaderboard,
  ensureScreenTimeBenefit,
} from "../../../screen-time/service";

function resolveDebugDate(env: GraphQLContext["env"]): string | null {
  if (env.ENVIRONMENT !== "development") return null;
  return env.SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE ?? null;
}

export const getScreenTimeLeaderboard = async (
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
  requireAuth(currentEmployee);
  await ensureScreenTimeBenefit(db, benefitId);
  return buildScreenTimeLeaderboard(
    db,
    benefitId,
    monthKey,
    resolveDebugDate(env),
  );
};
