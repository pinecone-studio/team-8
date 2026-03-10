import { getEmployees } from "./getEmployees";
import { getEmployee } from "./getEmployee";
import { getBenefits } from "./getBenefits";
import { getMyBenefits } from "./getMyBenefits";

export const queries = {
  getEmployees,
  getEmployee,
  benefits: getBenefits,
  myBenefits: getMyBenefits,
};
