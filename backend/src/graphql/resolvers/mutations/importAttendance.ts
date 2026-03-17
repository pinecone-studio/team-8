import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import {
  importAttendanceCore,
  type AttendanceRowInput,
  type AttendanceImportResult,
} from "../helpers/attendanceCore";

export type { AttendanceRowInput, AttendanceImportResult };

// ---------------------------------------------------------------------------
// GraphQL resolver — thin wrapper over importAttendanceCore
// ---------------------------------------------------------------------------

export const importAttendance = async (
  _: unknown,
  { rows }: { rows: AttendanceRowInput[] },
  { db, env, currentEmployee }: GraphQLContext,
): Promise<AttendanceImportResult> => {
  const actor = requireHrAdmin(currentEmployee);
  return importAttendanceCore(db, rows ?? [], actor, env.ELIGIBILITY_CACHE);
};
