import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";

/** Admin: view a specific employee's benefit eligibilities. Same data as myBenefits(employeeId). */
export const getEmployeeBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view employee benefits.");
  }

  return getBenefitsForEmployee(db, employeeId);
};
