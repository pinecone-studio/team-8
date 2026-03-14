import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";

export const getMyBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== employeeId) {
    throw new Error("Not authorized to view benefits for this employee.");
  }

  return getBenefitsForEmployee(db, employeeId);
};
