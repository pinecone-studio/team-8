import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { syncOkrStatusCore } from "../../../okr/sync-core";

export type { OkrSyncRowInput, OkrSyncError, OkrSyncResult } from "../../../okr/sync-core";

// ---------------------------------------------------------------------------
// GraphQL resolver — thin wrapper over the shared syncOkrStatusCore
// ---------------------------------------------------------------------------

export const syncOkrStatus = async (
  _: unknown,
  { rows }: { rows: import("../../../okr/sync-core").OkrSyncRowInput[] },
  { db, env, currentEmployee }: GraphQLContext,
): Promise<import("../../../okr/sync-core").OkrSyncResult> => {
  const actor = requireHrAdmin(currentEmployee);
  return syncOkrStatusCore(db, rows ?? [], actor, env.ELIGIBILITY_CACHE);
};
