import { createEmployee } from "./createEmployee";
import { updateEmployee } from "./updateEmployee";
import { deleteEmployee } from "./deleteEmployee";
import { createBenefit } from "./createBenefit";
import { updateBenefit } from "./updateBenefit";
import { setBenefitRules } from "./setBenefitRules";
import { requestBenefit } from "./requestBenefit";
import { updateBenefitRequestStatus } from "./updateBenefitRequestStatus";
import { acceptBenefitContract } from "./acceptBenefitContract";

export const mutations = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  createBenefit,
  updateBenefit,
  setBenefitRules,
  requestBenefit,
  updateBenefitRequestStatus,
  acceptBenefitContract,
};
