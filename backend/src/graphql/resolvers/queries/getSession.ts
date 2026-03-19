import type { GraphQLContext } from "../../context";
import { syncEmployeeProfile } from "../../../clerk/sync-employee-profiles";

/** Returns the currently authenticated employee derived from the request auth. */
export const getSession = async (
  _: unknown,
  __: unknown,
  { db, env, currentEmployee }: GraphQLContext,
) => {
  return syncEmployeeProfile(db, env, currentEmployee ?? null);
};
