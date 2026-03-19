import { getEmployees } from "./getEmployees";
import { getEmployee } from "./getEmployee";
import { getEmployeeByEmail } from "./getEmployeeByEmail";
import { getBenefits } from "./getBenefits";
import { getBenefitRequests } from "./getBenefitRequests";
import { getAllBenefitRequests } from "./getAllBenefitRequests";
import { getContracts } from "./getContracts";
import { getMyBenefits } from "./getMyBenefits";
import { getEmployeeBenefits } from "./getEmployeeBenefits";
import { getSession } from "./getSession";
import { getAdminDashboardSummary } from "./getAdminDashboardSummary";
import { getAdminBenefits } from "./getAdminBenefits";
import { getEligibilityRules } from "./getEligibilityRules";
import { getAuditLogs } from "./getAuditLogs";
import { getAuditLogActionTypes } from "./getAuditLogActionTypes";
import { getContractAcceptances } from "./getContractAcceptances";
import { getEnrollments } from "./getEnrollments";
import { getDepartments } from "./getDepartments";
import { getNotifications } from "./getNotifications";
import { getRuleProposals } from "./getRuleProposals";
import { getMySettings } from "./getMySettings";
import { getMyScreenTimeMonth } from "./getMyScreenTimeMonth";
import { getAdminScreenTimeMonth } from "./getAdminScreenTimeMonth";
import { getScreenTimeLeaderboard } from "./getScreenTimeLeaderboard";

export const queries = {
  adminDashboardSummary: getAdminDashboardSummary,
  adminBenefits: getAdminBenefits,
  getEmployees,
  getEmployee,
  getEmployeeByEmail,
  benefits: getBenefits,
  benefitRequests: getBenefitRequests,
  allBenefitRequests: getAllBenefitRequests,
  contracts: getContracts,
  myBenefits: getMyBenefits,
  getEmployeeBenefits,
  session: getSession,
  eligibilityRules: getEligibilityRules,
  auditLogs: getAuditLogs,
  auditLogActionTypes: getAuditLogActionTypes,
  contractAcceptances: getContractAcceptances,
  enrollments: getEnrollments,
  getDepartments,
  notifications: getNotifications,
  ruleProposals: getRuleProposals,
  mySettings: getMySettings,
  myScreenTimeMonth: getMyScreenTimeMonth,
  adminScreenTimeMonth: getAdminScreenTimeMonth,
  screenTimeLeaderboard: getScreenTimeLeaderboard,
};
