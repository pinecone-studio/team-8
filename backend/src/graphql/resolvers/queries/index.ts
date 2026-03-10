import { getEmployees } from "./getEmployees";
import { getEmployee } from "./getEmployee";
import { getBenefits } from "./getBenefits";
import { getMyBenefits } from "./getMyBenefits";
import { getEmployeeBenefits } from "./getEmployeeBenefits";

export const queries = {
  getEmployees,
  getEmployee,
  benefits: getBenefits,
  myBenefits: getMyBenefits,
  getEmployeeBenefits,
};
