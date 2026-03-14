import type { GraphQLContext } from "../../context";

/** Returns the currently authenticated employee derived from the request auth. */
export const getSession = async (
  _: unknown,
  __: unknown,
  { currentEmployee }: GraphQLContext,
) => {
  return currentEmployee ?? null;
};
