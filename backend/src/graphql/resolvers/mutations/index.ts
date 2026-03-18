import { createEmployee } from "./createEmployee";
import { updateEmployee } from "./updateEmployee";
import { deleteEmployee } from "./deleteEmployee";
import { requestBenefit } from "./requestBenefit";
import { confirmBenefitRequest } from "./confirmBenefitRequest";
import { approveBenefitRequest } from "./approveBenefitRequest";
import { declineBenefitRequest } from "./declineBenefitRequest";
import { cancelBenefitRequest } from "./cancelBenefitRequest";
import { createBenefit } from "./createBenefit";
import { updateBenefit } from "./updateBenefit";
import { deleteBenefit } from "./deleteBenefit";
import { createEligibilityRule } from "./createEligibilityRule";
import { updateEligibilityRule } from "./updateEligibilityRule";
import { deleteEligibilityRule } from "./deleteEligibilityRule";
import { overrideEligibility } from "./overrideEligibility";
import { proposeRuleChange } from "./proposeRuleChange";
import { approveRuleProposal } from "./approveRuleProposal";
import { rejectRuleProposal } from "./rejectRuleProposal";
import { markNotificationsRead } from "./markNotificationsRead";
import { importAttendance } from "./importAttendance";
import { syncOkrStatus } from "./syncOkrStatus";
import { updateMySettings } from "./updateMySettings";
import { upsertScreenTimeProgram } from "./upsertScreenTimeProgram";

export const mutations = {
  createBenefit,
  updateBenefit,
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
  proposeRuleChange,
  approveRuleProposal,
  rejectRuleProposal,
  markNotificationsRead,
  importAttendance,
  syncOkrStatus,
  updateMySettings,
  upsertScreenTimeProgram,
};
