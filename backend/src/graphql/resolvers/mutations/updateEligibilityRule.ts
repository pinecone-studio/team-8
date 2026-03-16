import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

/**
 * GOVERNANCE GATE — direct rule updates are intentionally disabled.
 *
 * All eligibility rule changes require a formal proposal (proposeRuleChange)
 * followed by a second HR admin's approval (approveRuleProposal).
 */
export const updateEligibilityRule = async (
  _: unknown,
  __: unknown,
  { currentEmployee }: GraphQLContext,
): Promise<never> => {
  requireHrAdmin(currentEmployee);
  throw new Error(
    "Direct rule updates are disabled. Submit a rule proposal via proposeRuleChange; a second HR admin must approve it before it takes effect.",
  );
};
