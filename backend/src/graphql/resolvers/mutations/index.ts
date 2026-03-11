import { createEmployee } from "./createEmployee";
import { updateEmployee } from "./updateEmployee";
import { deleteEmployee } from "./deleteEmployee";
import { requestBenefit } from "./requestBenefit";
import { confirmBenefitRequest } from "./confirmBenefitRequest";
import { approveBenefitRequest } from "./approveBenefitRequest";
import { declineBenefitRequest } from "./declineBenefitRequest";

export const mutations = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  requestBenefit,
  confirmBenefitRequest,
  approveBenefitRequest,
  declineBenefitRequest,
};
