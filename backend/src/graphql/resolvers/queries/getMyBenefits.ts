import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

export const getMyBenefits = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  return getBenefitsForEmployee(db, employee.id);
};
