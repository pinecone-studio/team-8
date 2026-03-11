import { getBenefitsForEmployee } from "../helpers/employeeBenefits";

export const getMyBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db }: { db: import("../../../db").Database }
) => getBenefitsForEmployee(db, employeeId);
