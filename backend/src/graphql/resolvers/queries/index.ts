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
import { getContractAcceptances } from "./getContractAcceptances";
import { getEnrollments } from "./getEnrollments";
import { getDepartments } from "./getDepartments";

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
  contractAcceptances: getContractAcceptances,
  enrollments: getEnrollments,
  getDepartments,
};
