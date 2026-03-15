import { createEmployee } from "./createEmployee";
import { updateEmployee } from "./updateEmployee";
import { deleteEmployee } from "./deleteEmployee";
import { requestBenefit } from "./requestBenefit";
import { confirmBenefitRequest } from "./confirmBenefitRequest";
import { approveBenefitRequest } from "./approveBenefitRequest";
import { declineBenefitRequest } from "./declineBenefitRequest";
import { cancelBenefitRequest } from "./cancelBenefitRequest";
import { createBenefit } from "./createBenefit";
import { deleteBenefit } from "./deleteBenefit";
import { createEligibilityRule } from "./createEligibilityRule";
import { updateEligibilityRule } from "./updateEligibilityRule";
import { deleteEligibilityRule } from "./deleteEligibilityRule";
import { overrideEligibility } from "./overrideEligibility";

export const mutations = {
  createBenefit,
  deleteBenefit,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  requestBenefit,
  confirmBenefitRequest,
  approveBenefitRequest,
  declineBenefitRequest,
  cancelBenefitRequest,
  createEligibilityRule,
  updateEligibilityRule,
  deleteEligibilityRule,
  overrideEligibility,
};
