import { getEmployees } from "./getEmployees";
import { getEmployee } from "./getEmployee";
import { getEmployeeByEmail } from "./getEmployeeByEmail";
import { getBenefits } from "./getBenefits";
import { getBenefitRequests } from "./getBenefitRequests";
import { getContracts } from "./getContracts";
import { getMyBenefits } from "./getMyBenefits";
import { getEmployeeBenefits } from "./getEmployeeBenefits";
import { getSession } from "./getSession";
import { getAdminDashboardSummary } from "./getAdminDashboardSummary";

export const queries = {
  adminDashboardSummary: getAdminDashboardSummary,
  getEmployees,
  getEmployee,
  getEmployeeByEmail,
  benefits: getBenefits,
  benefitRequests: getBenefitRequests,
  contracts: getContracts,
  myBenefits: getMyBenefits,
  getEmployeeBenefits,
  session: getSession,
};
