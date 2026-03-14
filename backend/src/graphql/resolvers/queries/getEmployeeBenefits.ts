import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

/** Admin: view a specific employee's benefit eligibilities. */
export const getEmployeeBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  return getBenefitsForEmployee(db, employeeId);
};
