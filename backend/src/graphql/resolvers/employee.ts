import { getBenefitsForEmployee } from "./helpers/employeeBenefits";
import type { Database } from "../../db";

/** Resolve Employee.benefits: this employee's benefit eligibilities. */
export const Employee = {
  benefits(parent: { id: string }, _: unknown, context: { db: Database }) {
    return getBenefitsForEmployee(context.db, parent.id);
  },
};
