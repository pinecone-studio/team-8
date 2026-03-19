import { requireAuth } from "../../../auth";
import type { GraphQLContext } from "../../context";
import {
  buildScreenTimeLeaderboard,
  ensureScreenTimeBenefit,
} from "../../../screen-time/service";
import { resolveScreenTimeDebugDate } from "../../../screen-time/debug";

export const getScreenTimeLeaderboard = async (
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
  requireAuth(currentEmployee);
  await ensureScreenTimeBenefit(db, benefitId);
  return buildScreenTimeLeaderboard(
    db,
    benefitId,
    monthKey,
    resolveScreenTimeDebugDate(env, baseUrl),
  );
};
