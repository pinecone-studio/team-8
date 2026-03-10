import { getBenefitsForEmployee } from "../helpers/employeeBenefits";

/** Admin: view a specific employee's benefit eligibilities. Same data as myBenefits(employeeId). */
export const getEmployeeBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db }: { db: import("../../../db").Database }
) => getBenefitsForEmployee(db, employeeId);
