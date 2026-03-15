import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

/**
 * GOVERNANCE GATE — direct rule creation is intentionally disabled.
 *
 * All eligibility rule changes require a formal proposal (proposeRuleChange)
 * followed by a second HR admin's approval (approveRuleProposal).
 * This ensures every rule change has an audit trail and second-approver sign-off.
 *
 * The mutation remains in the schema so legacy clients receive a clear error
 * rather than an unknown-field failure.
 */
export const createEligibilityRule = async (
  _: unknown,
  __: unknown,
  { currentEmployee }: GraphQLContext,
): Promise<never> => {
  requireHrAdmin(currentEmployee);
  throw new Error(
    "Direct rule creation is disabled. Submit a rule proposal via proposeRuleChange; a second HR admin must approve it before it takes effect.",
  );
};
