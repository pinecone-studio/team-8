import { requireHrAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { buildAdminScreenTimeMonthBoard, ensureScreenTimeBenefit } from "../../../screen-time/service";
import { resolveScreenTimeDebugDate } from "../../../screen-time/debug";

export const getAdminScreenTimeMonth = async (
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
  requireHrAdmin(currentEmployee);
  await ensureScreenTimeBenefit(db, benefitId);
  return buildAdminScreenTimeMonthBoard(
    db,
    benefitId,
    monthKey,
    resolveScreenTimeDebugDate(env, baseUrl),
  );
};
