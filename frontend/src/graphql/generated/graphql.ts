import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AdminDashboardBucket = {
  __typename?: 'AdminDashboardBucket';
  label: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type AdminDashboardSummary = {
  __typename?: 'AdminDashboardSummary';
  activeBenefits: Scalars['Int']['output'];
  lockReasons: Array<AdminDashboardBucket>;
  lockedBenefits: Scalars['Int']['output'];
  pendingRequests: Scalars['Int']['output'];
  totalEmployees: Scalars['Int']['output'];
  usageByCategory: Array<AdminDashboardBucket>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  actionType: Scalars['String']['output'];
  actorEmployeeId?: Maybe<Scalars['String']['output']>;
  actorRole: Scalars['String']['output'];
  afterJson?: Maybe<Scalars['String']['output']>;
  beforeJson?: Maybe<Scalars['String']['output']>;
  benefitId?: Maybe<Scalars['String']['output']>;
  contractId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  metadataJson?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  targetEmployeeId?: Maybe<Scalars['String']['output']>;
};

export type Benefit = {
  __typename?: 'Benefit';
  approvalPolicy: Scalars['String']['output'];
  category: Scalars['String']['output'];
  employeePercent: Scalars['Int']['output'];
  flowType: BenefitFlowType;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nameEng?: Maybe<Scalars['String']['output']>;
  optionsDescription?: Maybe<Scalars['String']['output']>;
  requiresContract: Scalars['Boolean']['output'];
  subsidyPercent: Scalars['Int']['output'];
  unitPrice?: Maybe<Scalars['Int']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  benefitId: Scalars['String']['output'];
  failedRule?: Maybe<FailedRule>;
  overrideBy?: Maybe<Scalars['String']['output']>;
  overrideExpiresAt?: Maybe<Scalars['String']['output']>;
  overrideReason?: Maybe<Scalars['String']['output']>;
  overrideStatus?: Maybe<Scalars['String']['output']>;
  ruleEvaluation: Array<RuleEvaluation>;
  status: BenefitEligibilityStatus;
};

export enum BenefitEligibilityStatus {
  Active = 'ACTIVE',
  Eligible = 'ELIGIBLE',
  Locked = 'LOCKED',
  Pending = 'PENDING'
}

export enum BenefitFlowType {
  Contract = 'contract',
  DownPayment = 'down_payment',
  Normal = 'normal',
  SelfService = 'self_service'
}

export type BenefitRequest = {
  __typename?: 'BenefitRequest';
  benefitId: Scalars['String']['output'];
  contractAcceptedAt?: Maybe<Scalars['String']['output']>;
  contractVersionAccepted?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  declineReason?: Maybe<Scalars['String']['output']>;
  employeeApprovedAt?: Maybe<Scalars['String']['output']>;
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  repaymentMonths?: Maybe<Scalars['Int']['output']>;
  requestedAmount?: Maybe<Scalars['Int']['output']>;
  reviewedBy?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  viewContractUrl?: Maybe<Scalars['String']['output']>;
};

export type Contract = {
  __typename?: 'Contract';
  benefitId: Scalars['String']['output'];
  benefitName?: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['String']['output'];
  expiryDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  vendorName: Scalars['String']['output'];
  version: Scalars['String']['output'];
  viewUrl?: Maybe<Scalars['String']['output']>;
};

export type ContractAcceptance = {
  __typename?: 'ContractAcceptance';
  acceptedAt: Scalars['String']['output'];
  benefitId: Scalars['String']['output'];
  contractHash: Scalars['String']['output'];
  contractId: Scalars['String']['output'];
  contractVersion: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
};

export type CreateBenefitInput = {
  approvalPolicy?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requiresContract?: InputMaybe<Scalars['Boolean']['input']>;
  subsidyPercent: Scalars['Int']['input'];
  vendorName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEligibilityRuleInput = {
  benefitId: Scalars['String']['input'];
  errorMessage: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CreateEmployeeInput = {
  department: Scalars['String']['input'];
  email: Scalars['String']['input'];
  employmentStatus?: InputMaybe<EmploymentStatus>;
  hireDate: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameEng?: InputMaybe<Scalars['String']['input']>;
  responsibilityLevel?: InputMaybe<Scalars['Int']['input']>;
  role: EmployeeRole;
};

export type EligibilityRule = {
  __typename?: 'EligibilityRule';
  benefitId: Scalars['String']['output'];
  errorMessage: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  operator: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  ruleType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Employee = {
  __typename?: 'Employee';
  benefits: Array<BenefitEligibility>;
  createdAt: Scalars['DateTime']['output'];
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  employmentStatus: Scalars['String']['output'];
  hireDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lateArrivalCount: Scalars['Int']['output'];
  lateArrivalUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  nameEng?: Maybe<Scalars['String']['output']>;
  okrSubmitted: Scalars['Int']['output'];
  responsibilityLevel: Scalars['Int']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EmployeeBenefitEnrollment = {
  __typename?: 'EmployeeBenefitEnrollment';
  approvedBy?: Maybe<Scalars['String']['output']>;
  benefitId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  employeePercentApplied?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  requestId?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['String']['output'];
  status: Scalars['String']['output'];
  subsidyPercentApplied?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
};

export enum EmployeeRole {
  Engineer = 'engineer',
  Manager = 'manager',
  Teacher = 'teacher',
  UxEngineer = 'ux_engineer'
}

export enum EmploymentStatus {
  Active = 'active',
  Leave = 'leave',
  Probation = 'probation',
  Terminated = 'terminated'
}

export type FailedRule = {
  __typename?: 'FailedRule';
  errorMessage: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveBenefitRequest: BenefitRequest;
  cancelBenefitRequest: BenefitRequest;
  confirmBenefitRequest: BenefitRequest;
  createBenefit: Benefit;
  createEligibilityRule: EligibilityRule;
  createEmployee: Employee;
  declineBenefitRequest: BenefitRequest;
  deleteBenefit: Scalars['Boolean']['output'];
  deleteEligibilityRule: Scalars['Boolean']['output'];
  deleteEmployee: Scalars['Boolean']['output'];
  overrideEligibility: BenefitEligibility;
  requestBenefit: BenefitRequest;
  updateEligibilityRule: EligibilityRule;
  updateEmployee?: Maybe<Employee>;
};


export type MutationApproveBenefitRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationCancelBenefitRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationConfirmBenefitRequestArgs = {
  contractAccepted: Scalars['Boolean']['input'];
  requestId: Scalars['String']['input'];
};


export type MutationCreateBenefitArgs = {
  input: CreateBenefitInput;
};


export type MutationCreateEligibilityRuleArgs = {
  input: CreateEligibilityRuleInput;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationDeclineBenefitRequestArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['String']['input'];
};


export type MutationDeleteBenefitArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEligibilityRuleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type MutationOverrideEligibilityArgs = {
  input: OverrideEligibilityInput;
};


export type MutationRequestBenefitArgs = {
  input: RequestBenefitInput;
};


export type MutationUpdateEligibilityRuleArgs = {
  id: Scalars['String']['input'];
  input: UpdateEligibilityRuleInput;
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};

export type OverrideEligibilityInput = {
  benefitId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  overrideStatus: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminBenefits: Array<Benefit>;
  adminDashboardSummary: AdminDashboardSummary;
  allBenefitRequests: Array<BenefitRequest>;
  auditLogs: Array<AuditLog>;
  benefitRequests: Array<BenefitRequest>;
  benefits: Array<Benefit>;
  contractAcceptances: Array<ContractAcceptance>;
  contracts: Array<Contract>;
  eligibilityRules: Array<EligibilityRule>;
  enrollments: Array<EmployeeBenefitEnrollment>;
  getEmployee?: Maybe<Employee>;
  getEmployeeBenefits: Array<BenefitEligibility>;
  getEmployeeByEmail?: Maybe<Employee>;
  getEmployees: Array<Employee>;
  myBenefits: Array<BenefitEligibility>;
  session?: Maybe<Employee>;
};


export type QueryAllBenefitRequestsArgs = {
  queue?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAuditLogsArgs = {
  actionType?: InputMaybe<Scalars['String']['input']>;
  benefitId?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBenefitsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryContractAcceptancesArgs = {
  benefitId?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
  requestId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryContractsArgs = {
  benefitId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEligibilityRulesArgs = {
  benefitId: Scalars['String']['input'];
};


export type QueryEnrollmentsArgs = {
  benefitId?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetEmployeeBenefitsArgs = {
  employeeId: Scalars['String']['input'];
};


export type QueryGetEmployeeByEmailArgs = {
  email: Scalars['String']['input'];
};

export type RequestBenefitInput = {
  benefitId: Scalars['String']['input'];
  repaymentMonths?: InputMaybe<Scalars['Int']['input']>;
  requestedAmount?: InputMaybe<Scalars['Int']['input']>;
};

export type RuleEvaluation = {
  __typename?: 'RuleEvaluation';
  passed: Scalars['Boolean']['output'];
  reason: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
};

export type UpdateEligibilityRuleInput = {
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  operator?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleType?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employmentStatus?: InputMaybe<EmploymentStatus>;
  lateArrivalCount?: InputMaybe<Scalars['Int']['input']>;
  lateArrivalUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameEng?: InputMaybe<Scalars['String']['input']>;
  okrSubmitted?: InputMaybe<Scalars['Int']['input']>;
  responsibilityLevel?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<EmployeeRole>;
};

export type RequestBenefitMutationVariables = Exact<{
  input: RequestBenefitInput;
}>;


export type RequestBenefitMutation = { __typename?: 'Mutation', requestBenefit: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, declineReason?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null } };

export type ConfirmBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
  contractAccepted: Scalars['Boolean']['input'];
}>;


export type ConfirmBenefitRequestMutation = { __typename?: 'Mutation', confirmBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, createdAt: string, updatedAt: string } };

export type ApproveBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type ApproveBenefitRequestMutation = { __typename?: 'Mutation', approveBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, reviewedBy?: string | null, createdAt: string, updatedAt: string } };

export type DeclineBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeclineBenefitRequestMutation = { __typename?: 'Mutation', declineBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, declineReason?: string | null, createdAt: string, updatedAt: string } };

export type CancelBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type CancelBenefitRequestMutation = { __typename?: 'Mutation', cancelBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, createdAt: string, updatedAt: string } };

export type CreateBenefitMutationVariables = Exact<{
  input: CreateBenefitInput;
}>;


export type CreateBenefitMutation = { __typename?: 'Mutation', createBenefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null } };

export type DeleteBenefitMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBenefitMutation = { __typename?: 'Mutation', deleteBenefit: boolean };

export type CreateEligibilityRuleMutationVariables = Exact<{
  input: CreateEligibilityRuleInput;
}>;


export type CreateEligibilityRuleMutation = { __typename?: 'Mutation', createEligibilityRule: { __typename?: 'EligibilityRule', id: string, benefitId: string, ruleType: string, operator: string, value: string, errorMessage: string, priority: number, isActive: boolean } };

export type UpdateEligibilityRuleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateEligibilityRuleInput;
}>;


export type UpdateEligibilityRuleMutation = { __typename?: 'Mutation', updateEligibilityRule: { __typename?: 'EligibilityRule', id: string, benefitId: string, ruleType: string, operator: string, value: string, errorMessage: string, priority: number, isActive: boolean } };

export type DeleteEligibilityRuleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteEligibilityRuleMutation = { __typename?: 'Mutation', deleteEligibilityRule: boolean };

export type OverrideEligibilityMutationVariables = Exact<{
  input: OverrideEligibilityInput;
}>;


export type OverrideEligibilityMutation = { __typename?: 'Mutation', overrideEligibility: { __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null } };

export type CreateEmployeeMutationVariables = Exact<{
  input: CreateEmployeeInput;
}>;


export type CreateEmployeeMutation = { __typename?: 'Mutation', createEmployee: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, createdAt: any } };

export type UpdateEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
}>;


export type UpdateEmployeeMutation = { __typename?: 'Mutation', updateEmployee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, updatedAt: any } | null };

export type DeleteEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteEmployeeMutation = { __typename?: 'Mutation', deleteEmployee: boolean };

export type GetAdminDashboardSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminDashboardSummaryQuery = { __typename?: 'Query', adminDashboardSummary: { __typename?: 'AdminDashboardSummary', totalEmployees: number, activeBenefits: number, pendingRequests: number, lockedBenefits: number, usageByCategory: Array<{ __typename?: 'AdminDashboardBucket', label: string, value: number }>, lockReasons: Array<{ __typename?: 'AdminDashboardBucket', label: string, value: number }> } };

export type GetAdminBenefitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminBenefitsQuery = { __typename?: 'Query', adminBenefits: Array<{ __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }> };

export type GetAuditLogsQueryVariables = Exact<{
  employeeId?: InputMaybe<Scalars['String']['input']>;
  benefitId?: InputMaybe<Scalars['String']['input']>;
  actionType?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogs: Array<{ __typename?: 'AuditLog', id: string, actorEmployeeId?: string | null, actorRole: string, actionType: string, entityType: string, entityId: string, targetEmployeeId?: string | null, benefitId?: string | null, requestId?: string | null, contractId?: string | null, reason?: string | null, beforeJson?: string | null, afterJson?: string | null, metadataJson?: string | null, ipAddress?: string | null, createdAt: string }> };

export type GetContractAcceptancesQueryVariables = Exact<{
  employeeId?: InputMaybe<Scalars['String']['input']>;
  benefitId?: InputMaybe<Scalars['String']['input']>;
  requestId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetContractAcceptancesQuery = { __typename?: 'Query', contractAcceptances: Array<{ __typename?: 'ContractAcceptance', id: string, employeeId: string, benefitId: string, contractId: string, contractVersion: string, contractHash: string, acceptedAt: string, ipAddress?: string | null, requestId?: string | null, createdAt: string }> };

export type GetEnrollmentsQueryVariables = Exact<{
  employeeId?: InputMaybe<Scalars['String']['input']>;
  benefitId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEnrollmentsQuery = { __typename?: 'Query', enrollments: Array<{ __typename?: 'EmployeeBenefitEnrollment', id: string, employeeId: string, benefitId: string, requestId?: string | null, status: string, subsidyPercentApplied?: number | null, employeePercentApplied?: number | null, approvedBy?: string | null, startedAt: string, endedAt?: string | null, createdAt: string, updatedAt: string }> };

export type GetBenefitsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBenefitsQuery = { __typename?: 'Query', benefits: Array<{ __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }> };

export type GetMyBenefitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyBenefitsQuery = { __typename?: 'Query', myBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null, benefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null }> };

export type GetBenefitRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBenefitRequestsQuery = { __typename?: 'Query', benefitRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, employeeApprovedAt?: string | null, declineReason?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null }> };

export type GetAllBenefitRequestsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
  queue?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllBenefitRequestsQuery = { __typename?: 'Query', allBenefitRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, employeeApprovedAt?: string | null, declineReason?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null }> };

export type GetEmployeeBenefitsQueryVariables = Exact<{
  employeeId: Scalars['String']['input'];
}>;


export type GetEmployeeBenefitsQuery = { __typename?: 'Query', getEmployeeBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null, benefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null }> };

export type GetContractsForBenefitQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
}>;


export type GetContractsForBenefitQuery = { __typename?: 'Query', contracts: Array<{ __typename?: 'Contract', id: string, version: string, isActive: boolean, viewUrl?: string | null, vendorName: string, effectiveDate: string, expiryDate: string }> };

export type GetEligibilityRulesQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
}>;


export type GetEligibilityRulesQuery = { __typename?: 'Query', eligibilityRules: Array<{ __typename?: 'EligibilityRule', id: string, benefitId: string, ruleType: string, operator: string, value: string, errorMessage: string, priority: number, isActive: boolean }> };

export type GetEmployeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmployeesQuery = { __typename?: 'Query', getEmployees: Array<{ __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, createdAt: any, updatedAt: any }> };

export type GetEmployeeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetEmployeeQuery = { __typename?: 'Query', getEmployee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, lateArrivalUpdatedAt?: any | null, createdAt: any, updatedAt: any } | null };

export type GetEmployeeByEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetEmployeeByEmailQuery = { __typename?: 'Query', getEmployeeByEmail?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, lateArrivalUpdatedAt?: any | null, createdAt: any, updatedAt: any } | null };


export const RequestBenefitDocument = gql`
    mutation RequestBenefit($input: RequestBenefitInput!) {
  requestBenefit(input: $input) {
    id
    employeeId
    benefitId
    status
    reviewedBy
    requestedAmount
    repaymentMonths
    declineReason
    createdAt
    updatedAt
    viewContractUrl
  }
}
    `;
export type RequestBenefitMutationFn = Apollo.MutationFunction<RequestBenefitMutation, RequestBenefitMutationVariables>;

/**
 * __useRequestBenefitMutation__
 *
 * To run a mutation, you first call `useRequestBenefitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestBenefitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestBenefitMutation, { data, loading, error }] = useRequestBenefitMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestBenefitMutation(baseOptions?: Apollo.MutationHookOptions<RequestBenefitMutation, RequestBenefitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestBenefitMutation, RequestBenefitMutationVariables>(RequestBenefitDocument, options);
      }
export type RequestBenefitMutationHookResult = ReturnType<typeof useRequestBenefitMutation>;
export type RequestBenefitMutationResult = Apollo.MutationResult<RequestBenefitMutation>;
export type RequestBenefitMutationOptions = Apollo.BaseMutationOptions<RequestBenefitMutation, RequestBenefitMutationVariables>;
export const ConfirmBenefitRequestDocument = gql`
    mutation ConfirmBenefitRequest($requestId: String!, $contractAccepted: Boolean!) {
  confirmBenefitRequest(
    requestId: $requestId
    contractAccepted: $contractAccepted
  ) {
    id
    employeeId
    benefitId
    status
    contractVersionAccepted
    contractAcceptedAt
    createdAt
    updatedAt
  }
}
    `;
export type ConfirmBenefitRequestMutationFn = Apollo.MutationFunction<ConfirmBenefitRequestMutation, ConfirmBenefitRequestMutationVariables>;

/**
 * __useConfirmBenefitRequestMutation__
 *
 * To run a mutation, you first call `useConfirmBenefitRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmBenefitRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmBenefitRequestMutation, { data, loading, error }] = useConfirmBenefitRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      contractAccepted: // value for 'contractAccepted'
 *   },
 * });
 */
export function useConfirmBenefitRequestMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmBenefitRequestMutation, ConfirmBenefitRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmBenefitRequestMutation, ConfirmBenefitRequestMutationVariables>(ConfirmBenefitRequestDocument, options);
      }
export type ConfirmBenefitRequestMutationHookResult = ReturnType<typeof useConfirmBenefitRequestMutation>;
export type ConfirmBenefitRequestMutationResult = Apollo.MutationResult<ConfirmBenefitRequestMutation>;
export type ConfirmBenefitRequestMutationOptions = Apollo.BaseMutationOptions<ConfirmBenefitRequestMutation, ConfirmBenefitRequestMutationVariables>;
export const ApproveBenefitRequestDocument = gql`
    mutation ApproveBenefitRequest($requestId: String!) {
  approveBenefitRequest(requestId: $requestId) {
    id
    employeeId
    benefitId
    status
    reviewedBy
    createdAt
    updatedAt
  }
}
    `;
export type ApproveBenefitRequestMutationFn = Apollo.MutationFunction<ApproveBenefitRequestMutation, ApproveBenefitRequestMutationVariables>;

/**
 * __useApproveBenefitRequestMutation__
 *
 * To run a mutation, you first call `useApproveBenefitRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveBenefitRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveBenefitRequestMutation, { data, loading, error }] = useApproveBenefitRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useApproveBenefitRequestMutation(baseOptions?: Apollo.MutationHookOptions<ApproveBenefitRequestMutation, ApproveBenefitRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveBenefitRequestMutation, ApproveBenefitRequestMutationVariables>(ApproveBenefitRequestDocument, options);
      }
export type ApproveBenefitRequestMutationHookResult = ReturnType<typeof useApproveBenefitRequestMutation>;
export type ApproveBenefitRequestMutationResult = Apollo.MutationResult<ApproveBenefitRequestMutation>;
export type ApproveBenefitRequestMutationOptions = Apollo.BaseMutationOptions<ApproveBenefitRequestMutation, ApproveBenefitRequestMutationVariables>;
export const DeclineBenefitRequestDocument = gql`
    mutation DeclineBenefitRequest($requestId: String!, $reason: String) {
  declineBenefitRequest(requestId: $requestId, reason: $reason) {
    id
    employeeId
    benefitId
    status
    declineReason
    createdAt
    updatedAt
  }
}
    `;
export type DeclineBenefitRequestMutationFn = Apollo.MutationFunction<DeclineBenefitRequestMutation, DeclineBenefitRequestMutationVariables>;

/**
 * __useDeclineBenefitRequestMutation__
 *
 * To run a mutation, you first call `useDeclineBenefitRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineBenefitRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineBenefitRequestMutation, { data, loading, error }] = useDeclineBenefitRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useDeclineBenefitRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeclineBenefitRequestMutation, DeclineBenefitRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineBenefitRequestMutation, DeclineBenefitRequestMutationVariables>(DeclineBenefitRequestDocument, options);
      }
export type DeclineBenefitRequestMutationHookResult = ReturnType<typeof useDeclineBenefitRequestMutation>;
export type DeclineBenefitRequestMutationResult = Apollo.MutationResult<DeclineBenefitRequestMutation>;
export type DeclineBenefitRequestMutationOptions = Apollo.BaseMutationOptions<DeclineBenefitRequestMutation, DeclineBenefitRequestMutationVariables>;
export const CancelBenefitRequestDocument = gql`
    mutation CancelBenefitRequest($requestId: String!) {
  cancelBenefitRequest(requestId: $requestId) {
    id
    employeeId
    benefitId
    status
    createdAt
    updatedAt
  }
}
    `;
export type CancelBenefitRequestMutationFn = Apollo.MutationFunction<CancelBenefitRequestMutation, CancelBenefitRequestMutationVariables>;

/**
 * __useCancelBenefitRequestMutation__
 *
 * To run a mutation, you first call `useCancelBenefitRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelBenefitRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelBenefitRequestMutation, { data, loading, error }] = useCancelBenefitRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useCancelBenefitRequestMutation(baseOptions?: Apollo.MutationHookOptions<CancelBenefitRequestMutation, CancelBenefitRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelBenefitRequestMutation, CancelBenefitRequestMutationVariables>(CancelBenefitRequestDocument, options);
      }
export type CancelBenefitRequestMutationHookResult = ReturnType<typeof useCancelBenefitRequestMutation>;
export type CancelBenefitRequestMutationResult = Apollo.MutationResult<CancelBenefitRequestMutation>;
export type CancelBenefitRequestMutationOptions = Apollo.BaseMutationOptions<CancelBenefitRequestMutation, CancelBenefitRequestMutationVariables>;
export const CreateBenefitDocument = gql`
    mutation CreateBenefit($input: CreateBenefitInput!) {
  createBenefit(input: $input) {
    id
    name
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    flowType
    optionsDescription
  }
}
    `;
export type CreateBenefitMutationFn = Apollo.MutationFunction<CreateBenefitMutation, CreateBenefitMutationVariables>;

/**
 * __useCreateBenefitMutation__
 *
 * To run a mutation, you first call `useCreateBenefitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBenefitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBenefitMutation, { data, loading, error }] = useCreateBenefitMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBenefitMutation(baseOptions?: Apollo.MutationHookOptions<CreateBenefitMutation, CreateBenefitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBenefitMutation, CreateBenefitMutationVariables>(CreateBenefitDocument, options);
      }
export type CreateBenefitMutationHookResult = ReturnType<typeof useCreateBenefitMutation>;
export type CreateBenefitMutationResult = Apollo.MutationResult<CreateBenefitMutation>;
export type CreateBenefitMutationOptions = Apollo.BaseMutationOptions<CreateBenefitMutation, CreateBenefitMutationVariables>;
export const DeleteBenefitDocument = gql`
    mutation DeleteBenefit($id: String!) {
  deleteBenefit(id: $id)
}
    `;
export type DeleteBenefitMutationFn = Apollo.MutationFunction<DeleteBenefitMutation, DeleteBenefitMutationVariables>;

/**
 * __useDeleteBenefitMutation__
 *
 * To run a mutation, you first call `useDeleteBenefitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBenefitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBenefitMutation, { data, loading, error }] = useDeleteBenefitMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBenefitMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBenefitMutation, DeleteBenefitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBenefitMutation, DeleteBenefitMutationVariables>(DeleteBenefitDocument, options);
      }
export type DeleteBenefitMutationHookResult = ReturnType<typeof useDeleteBenefitMutation>;
export type DeleteBenefitMutationResult = Apollo.MutationResult<DeleteBenefitMutation>;
export type DeleteBenefitMutationOptions = Apollo.BaseMutationOptions<DeleteBenefitMutation, DeleteBenefitMutationVariables>;
export const CreateEligibilityRuleDocument = gql`
    mutation CreateEligibilityRule($input: CreateEligibilityRuleInput!) {
  createEligibilityRule(input: $input) {
    id
    benefitId
    ruleType
    operator
    value
    errorMessage
    priority
    isActive
  }
}
    `;
export type CreateEligibilityRuleMutationFn = Apollo.MutationFunction<CreateEligibilityRuleMutation, CreateEligibilityRuleMutationVariables>;

/**
 * __useCreateEligibilityRuleMutation__
 *
 * To run a mutation, you first call `useCreateEligibilityRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEligibilityRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEligibilityRuleMutation, { data, loading, error }] = useCreateEligibilityRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEligibilityRuleMutation(baseOptions?: Apollo.MutationHookOptions<CreateEligibilityRuleMutation, CreateEligibilityRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEligibilityRuleMutation, CreateEligibilityRuleMutationVariables>(CreateEligibilityRuleDocument, options);
      }
export type CreateEligibilityRuleMutationHookResult = ReturnType<typeof useCreateEligibilityRuleMutation>;
export type CreateEligibilityRuleMutationResult = Apollo.MutationResult<CreateEligibilityRuleMutation>;
export type CreateEligibilityRuleMutationOptions = Apollo.BaseMutationOptions<CreateEligibilityRuleMutation, CreateEligibilityRuleMutationVariables>;
export const UpdateEligibilityRuleDocument = gql`
    mutation UpdateEligibilityRule($id: String!, $input: UpdateEligibilityRuleInput!) {
  updateEligibilityRule(id: $id, input: $input) {
    id
    benefitId
    ruleType
    operator
    value
    errorMessage
    priority
    isActive
  }
}
    `;
export type UpdateEligibilityRuleMutationFn = Apollo.MutationFunction<UpdateEligibilityRuleMutation, UpdateEligibilityRuleMutationVariables>;

/**
 * __useUpdateEligibilityRuleMutation__
 *
 * To run a mutation, you first call `useUpdateEligibilityRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEligibilityRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEligibilityRuleMutation, { data, loading, error }] = useUpdateEligibilityRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEligibilityRuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEligibilityRuleMutation, UpdateEligibilityRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEligibilityRuleMutation, UpdateEligibilityRuleMutationVariables>(UpdateEligibilityRuleDocument, options);
      }
export type UpdateEligibilityRuleMutationHookResult = ReturnType<typeof useUpdateEligibilityRuleMutation>;
export type UpdateEligibilityRuleMutationResult = Apollo.MutationResult<UpdateEligibilityRuleMutation>;
export type UpdateEligibilityRuleMutationOptions = Apollo.BaseMutationOptions<UpdateEligibilityRuleMutation, UpdateEligibilityRuleMutationVariables>;
export const DeleteEligibilityRuleDocument = gql`
    mutation DeleteEligibilityRule($id: String!) {
  deleteEligibilityRule(id: $id)
}
    `;
export type DeleteEligibilityRuleMutationFn = Apollo.MutationFunction<DeleteEligibilityRuleMutation, DeleteEligibilityRuleMutationVariables>;

/**
 * __useDeleteEligibilityRuleMutation__
 *
 * To run a mutation, you first call `useDeleteEligibilityRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEligibilityRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEligibilityRuleMutation, { data, loading, error }] = useDeleteEligibilityRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEligibilityRuleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEligibilityRuleMutation, DeleteEligibilityRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEligibilityRuleMutation, DeleteEligibilityRuleMutationVariables>(DeleteEligibilityRuleDocument, options);
      }
export type DeleteEligibilityRuleMutationHookResult = ReturnType<typeof useDeleteEligibilityRuleMutation>;
export type DeleteEligibilityRuleMutationResult = Apollo.MutationResult<DeleteEligibilityRuleMutation>;
export type DeleteEligibilityRuleMutationOptions = Apollo.BaseMutationOptions<DeleteEligibilityRuleMutation, DeleteEligibilityRuleMutationVariables>;
export const OverrideEligibilityDocument = gql`
    mutation OverrideEligibility($input: OverrideEligibilityInput!) {
  overrideEligibility(input: $input) {
    benefitId
    status
    overrideStatus
    overrideBy
    overrideReason
    overrideExpiresAt
  }
}
    `;
export type OverrideEligibilityMutationFn = Apollo.MutationFunction<OverrideEligibilityMutation, OverrideEligibilityMutationVariables>;

/**
 * __useOverrideEligibilityMutation__
 *
 * To run a mutation, you first call `useOverrideEligibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOverrideEligibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [overrideEligibilityMutation, { data, loading, error }] = useOverrideEligibilityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOverrideEligibilityMutation(baseOptions?: Apollo.MutationHookOptions<OverrideEligibilityMutation, OverrideEligibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OverrideEligibilityMutation, OverrideEligibilityMutationVariables>(OverrideEligibilityDocument, options);
      }
export type OverrideEligibilityMutationHookResult = ReturnType<typeof useOverrideEligibilityMutation>;
export type OverrideEligibilityMutationResult = Apollo.MutationResult<OverrideEligibilityMutation>;
export type OverrideEligibilityMutationOptions = Apollo.BaseMutationOptions<OverrideEligibilityMutation, OverrideEligibilityMutationVariables>;
export const CreateEmployeeDocument = gql`
    mutation CreateEmployee($input: CreateEmployeeInput!) {
  createEmployee(input: $input) {
    id
    name
    nameEng
    email
    role
    department
    responsibilityLevel
    employmentStatus
    hireDate
    createdAt
  }
}
    `;
export type CreateEmployeeMutationFn = Apollo.MutationFunction<CreateEmployeeMutation, CreateEmployeeMutationVariables>;

/**
 * __useCreateEmployeeMutation__
 *
 * To run a mutation, you first call `useCreateEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmployeeMutation, { data, loading, error }] = useCreateEmployeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmployeeMutation, CreateEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmployeeMutation, CreateEmployeeMutationVariables>(CreateEmployeeDocument, options);
      }
export type CreateEmployeeMutationHookResult = ReturnType<typeof useCreateEmployeeMutation>;
export type CreateEmployeeMutationResult = Apollo.MutationResult<CreateEmployeeMutation>;
export type CreateEmployeeMutationOptions = Apollo.BaseMutationOptions<CreateEmployeeMutation, CreateEmployeeMutationVariables>;
export const UpdateEmployeeDocument = gql`
    mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {
  updateEmployee(id: $id, input: $input) {
    id
    name
    nameEng
    email
    role
    department
    responsibilityLevel
    employmentStatus
    updatedAt
  }
}
    `;
export type UpdateEmployeeMutationFn = Apollo.MutationFunction<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>;

/**
 * __useUpdateEmployeeMutation__
 *
 * To run a mutation, you first call `useUpdateEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmployeeMutation, { data, loading, error }] = useUpdateEmployeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>(UpdateEmployeeDocument, options);
      }
export type UpdateEmployeeMutationHookResult = ReturnType<typeof useUpdateEmployeeMutation>;
export type UpdateEmployeeMutationResult = Apollo.MutationResult<UpdateEmployeeMutation>;
export type UpdateEmployeeMutationOptions = Apollo.BaseMutationOptions<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>;
export const DeleteEmployeeDocument = gql`
    mutation DeleteEmployee($id: String!) {
  deleteEmployee(id: $id)
}
    `;
export type DeleteEmployeeMutationFn = Apollo.MutationFunction<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>;

/**
 * __useDeleteEmployeeMutation__
 *
 * To run a mutation, you first call `useDeleteEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmployeeMutation, { data, loading, error }] = useDeleteEmployeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>(DeleteEmployeeDocument, options);
      }
export type DeleteEmployeeMutationHookResult = ReturnType<typeof useDeleteEmployeeMutation>;
export type DeleteEmployeeMutationResult = Apollo.MutationResult<DeleteEmployeeMutation>;
export type DeleteEmployeeMutationOptions = Apollo.BaseMutationOptions<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>;
export const GetAdminDashboardSummaryDocument = gql`
    query GetAdminDashboardSummary {
  adminDashboardSummary {
    totalEmployees
    activeBenefits
    pendingRequests
    lockedBenefits
    usageByCategory {
      label
      value
    }
    lockReasons {
      label
      value
    }
  }
}
    `;

/**
 * __useGetAdminDashboardSummaryQuery__
 *
 * To run a query within a React component, call `useGetAdminDashboardSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminDashboardSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminDashboardSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminDashboardSummaryQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>(GetAdminDashboardSummaryDocument, options);
      }
export function useGetAdminDashboardSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>(GetAdminDashboardSummaryDocument, options);
        }
// @ts-ignore
export function useGetAdminDashboardSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>;
export function useGetAdminDashboardSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminDashboardSummaryQuery | undefined, GetAdminDashboardSummaryQueryVariables>;
export function useGetAdminDashboardSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>(GetAdminDashboardSummaryDocument, options);
        }
export type GetAdminDashboardSummaryQueryHookResult = ReturnType<typeof useGetAdminDashboardSummaryQuery>;
export type GetAdminDashboardSummaryLazyQueryHookResult = ReturnType<typeof useGetAdminDashboardSummaryLazyQuery>;
export type GetAdminDashboardSummarySuspenseQueryHookResult = ReturnType<typeof useGetAdminDashboardSummarySuspenseQuery>;
export type GetAdminDashboardSummaryQueryResult = Apollo.QueryResult<GetAdminDashboardSummaryQuery, GetAdminDashboardSummaryQueryVariables>;
export const GetAdminBenefitsDocument = gql`
    query GetAdminBenefits {
  adminBenefits {
    id
    name
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    flowType
    optionsDescription
    approvalPolicy
  }
}
    `;

/**
 * __useGetAdminBenefitsQuery__
 *
 * To run a query within a React component, call `useGetAdminBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminBenefitsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminBenefitsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>(GetAdminBenefitsDocument, options);
      }
export function useGetAdminBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>(GetAdminBenefitsDocument, options);
        }
// @ts-ignore
export function useGetAdminBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>;
export function useGetAdminBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminBenefitsQuery | undefined, GetAdminBenefitsQueryVariables>;
export function useGetAdminBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>(GetAdminBenefitsDocument, options);
        }
export type GetAdminBenefitsQueryHookResult = ReturnType<typeof useGetAdminBenefitsQuery>;
export type GetAdminBenefitsLazyQueryHookResult = ReturnType<typeof useGetAdminBenefitsLazyQuery>;
export type GetAdminBenefitsSuspenseQueryHookResult = ReturnType<typeof useGetAdminBenefitsSuspenseQuery>;
export type GetAdminBenefitsQueryResult = Apollo.QueryResult<GetAdminBenefitsQuery, GetAdminBenefitsQueryVariables>;
export const GetAuditLogsDocument = gql`
    query GetAuditLogs($employeeId: String, $benefitId: String, $actionType: String, $fromDate: String, $toDate: String, $limit: Int) {
  auditLogs(
    employeeId: $employeeId
    benefitId: $benefitId
    actionType: $actionType
    fromDate: $fromDate
    toDate: $toDate
    limit: $limit
  ) {
    id
    actorEmployeeId
    actorRole
    actionType
    entityType
    entityId
    targetEmployeeId
    benefitId
    requestId
    contractId
    reason
    beforeJson
    afterJson
    metadataJson
    ipAddress
    createdAt
  }
}
    `;

/**
 * __useGetAuditLogsQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *      benefitId: // value for 'benefitId'
 *      actionType: // value for 'actionType'
 *      fromDate: // value for 'fromDate'
 *      toDate: // value for 'toDate'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetAuditLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
      }
export function useGetAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
// @ts-ignore
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogsQuery | undefined, GetAuditLogsQueryVariables>;
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export type GetAuditLogsQueryHookResult = ReturnType<typeof useGetAuditLogsQuery>;
export type GetAuditLogsLazyQueryHookResult = ReturnType<typeof useGetAuditLogsLazyQuery>;
export type GetAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsSuspenseQuery>;
export type GetAuditLogsQueryResult = Apollo.QueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetContractAcceptancesDocument = gql`
    query GetContractAcceptances($employeeId: String, $benefitId: String, $requestId: String) {
  contractAcceptances(
    employeeId: $employeeId
    benefitId: $benefitId
    requestId: $requestId
  ) {
    id
    employeeId
    benefitId
    contractId
    contractVersion
    contractHash
    acceptedAt
    ipAddress
    requestId
    createdAt
  }
}
    `;

/**
 * __useGetContractAcceptancesQuery__
 *
 * To run a query within a React component, call `useGetContractAcceptancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContractAcceptancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContractAcceptancesQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *      benefitId: // value for 'benefitId'
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useGetContractAcceptancesQuery(baseOptions?: Apollo.QueryHookOptions<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>(GetContractAcceptancesDocument, options);
      }
export function useGetContractAcceptancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>(GetContractAcceptancesDocument, options);
        }
// @ts-ignore
export function useGetContractAcceptancesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>;
export function useGetContractAcceptancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractAcceptancesQuery | undefined, GetContractAcceptancesQueryVariables>;
export function useGetContractAcceptancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>(GetContractAcceptancesDocument, options);
        }
export type GetContractAcceptancesQueryHookResult = ReturnType<typeof useGetContractAcceptancesQuery>;
export type GetContractAcceptancesLazyQueryHookResult = ReturnType<typeof useGetContractAcceptancesLazyQuery>;
export type GetContractAcceptancesSuspenseQueryHookResult = ReturnType<typeof useGetContractAcceptancesSuspenseQuery>;
export type GetContractAcceptancesQueryResult = Apollo.QueryResult<GetContractAcceptancesQuery, GetContractAcceptancesQueryVariables>;
export const GetEnrollmentsDocument = gql`
    query GetEnrollments($employeeId: String, $benefitId: String) {
  enrollments(employeeId: $employeeId, benefitId: $benefitId) {
    id
    employeeId
    benefitId
    requestId
    status
    subsidyPercentApplied
    employeePercentApplied
    approvedBy
    startedAt
    endedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetEnrollmentsQuery__
 *
 * To run a query within a React component, call `useGetEnrollmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEnrollmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEnrollmentsQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *      benefitId: // value for 'benefitId'
 *   },
 * });
 */
export function useGetEnrollmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>(GetEnrollmentsDocument, options);
      }
export function useGetEnrollmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>(GetEnrollmentsDocument, options);
        }
// @ts-ignore
export function useGetEnrollmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>;
export function useGetEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEnrollmentsQuery | undefined, GetEnrollmentsQueryVariables>;
export function useGetEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>(GetEnrollmentsDocument, options);
        }
export type GetEnrollmentsQueryHookResult = ReturnType<typeof useGetEnrollmentsQuery>;
export type GetEnrollmentsLazyQueryHookResult = ReturnType<typeof useGetEnrollmentsLazyQuery>;
export type GetEnrollmentsSuspenseQueryHookResult = ReturnType<typeof useGetEnrollmentsSuspenseQuery>;
export type GetEnrollmentsQueryResult = Apollo.QueryResult<GetEnrollmentsQuery, GetEnrollmentsQueryVariables>;
export const GetBenefitsDocument = gql`
    query GetBenefits($category: String) {
  benefits(category: $category) {
    id
    name
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    flowType
    optionsDescription
    approvalPolicy
  }
}
    `;

/**
 * __useGetBenefitsQuery__
 *
 * To run a query within a React component, call `useGetBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBenefitsQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useGetBenefitsQuery(baseOptions?: Apollo.QueryHookOptions<GetBenefitsQuery, GetBenefitsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBenefitsQuery, GetBenefitsQueryVariables>(GetBenefitsDocument, options);
      }
export function useGetBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBenefitsQuery, GetBenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBenefitsQuery, GetBenefitsQueryVariables>(GetBenefitsDocument, options);
        }
// @ts-ignore
export function useGetBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBenefitsQuery, GetBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitsQuery, GetBenefitsQueryVariables>;
export function useGetBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitsQuery, GetBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitsQuery | undefined, GetBenefitsQueryVariables>;
export function useGetBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitsQuery, GetBenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBenefitsQuery, GetBenefitsQueryVariables>(GetBenefitsDocument, options);
        }
export type GetBenefitsQueryHookResult = ReturnType<typeof useGetBenefitsQuery>;
export type GetBenefitsLazyQueryHookResult = ReturnType<typeof useGetBenefitsLazyQuery>;
export type GetBenefitsSuspenseQueryHookResult = ReturnType<typeof useGetBenefitsSuspenseQuery>;
export type GetBenefitsQueryResult = Apollo.QueryResult<GetBenefitsQuery, GetBenefitsQueryVariables>;
export const GetMyBenefitsDocument = gql`
    query GetMyBenefits {
  myBenefits {
    benefitId
    status
    overrideStatus
    overrideBy
    overrideReason
    overrideExpiresAt
    benefit {
      id
      name
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      flowType
      optionsDescription
      approvalPolicy
    }
    ruleEvaluation {
      ruleType
      passed
      reason
    }
    failedRule {
      ruleType
      errorMessage
    }
  }
}
    `;

/**
 * __useGetMyBenefitsQuery__
 *
 * To run a query within a React component, call `useGetMyBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyBenefitsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyBenefitsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>(GetMyBenefitsDocument, options);
      }
export function useGetMyBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>(GetMyBenefitsDocument, options);
        }
// @ts-ignore
export function useGetMyBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>;
export function useGetMyBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyBenefitsQuery | undefined, GetMyBenefitsQueryVariables>;
export function useGetMyBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>(GetMyBenefitsDocument, options);
        }
export type GetMyBenefitsQueryHookResult = ReturnType<typeof useGetMyBenefitsQuery>;
export type GetMyBenefitsLazyQueryHookResult = ReturnType<typeof useGetMyBenefitsLazyQuery>;
export type GetMyBenefitsSuspenseQueryHookResult = ReturnType<typeof useGetMyBenefitsSuspenseQuery>;
export type GetMyBenefitsQueryResult = Apollo.QueryResult<GetMyBenefitsQuery, GetMyBenefitsQueryVariables>;
export const GetBenefitRequestsDocument = gql`
    query GetBenefitRequests {
  benefitRequests {
    id
    employeeId
    benefitId
    status
    contractVersionAccepted
    contractAcceptedAt
    reviewedBy
    requestedAmount
    repaymentMonths
    employeeApprovedAt
    declineReason
    createdAt
    updatedAt
    viewContractUrl
  }
}
    `;

/**
 * __useGetBenefitRequestsQuery__
 *
 * To run a query within a React component, call `useGetBenefitRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBenefitRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBenefitRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBenefitRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>(GetBenefitRequestsDocument, options);
      }
export function useGetBenefitRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>(GetBenefitRequestsDocument, options);
        }
// @ts-ignore
export function useGetBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>;
export function useGetBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitRequestsQuery | undefined, GetBenefitRequestsQueryVariables>;
export function useGetBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>(GetBenefitRequestsDocument, options);
        }
export type GetBenefitRequestsQueryHookResult = ReturnType<typeof useGetBenefitRequestsQuery>;
export type GetBenefitRequestsLazyQueryHookResult = ReturnType<typeof useGetBenefitRequestsLazyQuery>;
export type GetBenefitRequestsSuspenseQueryHookResult = ReturnType<typeof useGetBenefitRequestsSuspenseQuery>;
export type GetBenefitRequestsQueryResult = Apollo.QueryResult<GetBenefitRequestsQuery, GetBenefitRequestsQueryVariables>;
export const GetAllBenefitRequestsDocument = gql`
    query GetAllBenefitRequests($status: String, $queue: String) {
  allBenefitRequests(status: $status, queue: $queue) {
    id
    employeeId
    benefitId
    status
    contractVersionAccepted
    contractAcceptedAt
    reviewedBy
    requestedAmount
    repaymentMonths
    employeeApprovedAt
    declineReason
    createdAt
    updatedAt
    viewContractUrl
  }
}
    `;

/**
 * __useGetAllBenefitRequestsQuery__
 *
 * To run a query within a React component, call `useGetAllBenefitRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBenefitRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBenefitRequestsQuery({
 *   variables: {
 *      status: // value for 'status'
 *      queue: // value for 'queue'
 *   },
 * });
 */
export function useGetAllBenefitRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>(GetAllBenefitRequestsDocument, options);
      }
export function useGetAllBenefitRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>(GetAllBenefitRequestsDocument, options);
        }
// @ts-ignore
export function useGetAllBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>;
export function useGetAllBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllBenefitRequestsQuery | undefined, GetAllBenefitRequestsQueryVariables>;
export function useGetAllBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>(GetAllBenefitRequestsDocument, options);
        }
export type GetAllBenefitRequestsQueryHookResult = ReturnType<typeof useGetAllBenefitRequestsQuery>;
export type GetAllBenefitRequestsLazyQueryHookResult = ReturnType<typeof useGetAllBenefitRequestsLazyQuery>;
export type GetAllBenefitRequestsSuspenseQueryHookResult = ReturnType<typeof useGetAllBenefitRequestsSuspenseQuery>;
export type GetAllBenefitRequestsQueryResult = Apollo.QueryResult<GetAllBenefitRequestsQuery, GetAllBenefitRequestsQueryVariables>;
export const GetEmployeeBenefitsDocument = gql`
    query GetEmployeeBenefits($employeeId: String!) {
  getEmployeeBenefits(employeeId: $employeeId) {
    benefitId
    status
    overrideStatus
    overrideBy
    overrideReason
    overrideExpiresAt
    benefit {
      id
      name
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      flowType
      optionsDescription
      approvalPolicy
    }
    ruleEvaluation {
      ruleType
      passed
      reason
    }
    failedRule {
      ruleType
      errorMessage
    }
  }
}
    `;

/**
 * __useGetEmployeeBenefitsQuery__
 *
 * To run a query within a React component, call `useGetEmployeeBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeBenefitsQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *   },
 * });
 */
export function useGetEmployeeBenefitsQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables> & ({ variables: GetEmployeeBenefitsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>(GetEmployeeBenefitsDocument, options);
      }
export function useGetEmployeeBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>(GetEmployeeBenefitsDocument, options);
        }
// @ts-ignore
export function useGetEmployeeBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>;
export function useGetEmployeeBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeBenefitsQuery | undefined, GetEmployeeBenefitsQueryVariables>;
export function useGetEmployeeBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>(GetEmployeeBenefitsDocument, options);
        }
export type GetEmployeeBenefitsQueryHookResult = ReturnType<typeof useGetEmployeeBenefitsQuery>;
export type GetEmployeeBenefitsLazyQueryHookResult = ReturnType<typeof useGetEmployeeBenefitsLazyQuery>;
export type GetEmployeeBenefitsSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeBenefitsSuspenseQuery>;
export type GetEmployeeBenefitsQueryResult = Apollo.QueryResult<GetEmployeeBenefitsQuery, GetEmployeeBenefitsQueryVariables>;
export const GetContractsForBenefitDocument = gql`
    query GetContractsForBenefit($benefitId: String!) {
  contracts(benefitId: $benefitId) {
    id
    version
    isActive
    viewUrl
    vendorName
    effectiveDate
    expiryDate
  }
}
    `;

/**
 * __useGetContractsForBenefitQuery__
 *
 * To run a query within a React component, call `useGetContractsForBenefitQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContractsForBenefitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContractsForBenefitQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *   },
 * });
 */
export function useGetContractsForBenefitQuery(baseOptions: Apollo.QueryHookOptions<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables> & ({ variables: GetContractsForBenefitQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>(GetContractsForBenefitDocument, options);
      }
export function useGetContractsForBenefitLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>(GetContractsForBenefitDocument, options);
        }
// @ts-ignore
export function useGetContractsForBenefitSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>;
export function useGetContractsForBenefitSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractsForBenefitQuery | undefined, GetContractsForBenefitQueryVariables>;
export function useGetContractsForBenefitSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>(GetContractsForBenefitDocument, options);
        }
export type GetContractsForBenefitQueryHookResult = ReturnType<typeof useGetContractsForBenefitQuery>;
export type GetContractsForBenefitLazyQueryHookResult = ReturnType<typeof useGetContractsForBenefitLazyQuery>;
export type GetContractsForBenefitSuspenseQueryHookResult = ReturnType<typeof useGetContractsForBenefitSuspenseQuery>;
export type GetContractsForBenefitQueryResult = Apollo.QueryResult<GetContractsForBenefitQuery, GetContractsForBenefitQueryVariables>;
export const GetEligibilityRulesDocument = gql`
    query GetEligibilityRules($benefitId: String!) {
  eligibilityRules(benefitId: $benefitId) {
    id
    benefitId
    ruleType
    operator
    value
    errorMessage
    priority
    isActive
  }
}
    `;

/**
 * __useGetEligibilityRulesQuery__
 *
 * To run a query within a React component, call `useGetEligibilityRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEligibilityRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEligibilityRulesQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *   },
 * });
 */
export function useGetEligibilityRulesQuery(baseOptions: Apollo.QueryHookOptions<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables> & ({ variables: GetEligibilityRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>(GetEligibilityRulesDocument, options);
      }
export function useGetEligibilityRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>(GetEligibilityRulesDocument, options);
        }
// @ts-ignore
export function useGetEligibilityRulesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>;
export function useGetEligibilityRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetEligibilityRulesQuery | undefined, GetEligibilityRulesQueryVariables>;
export function useGetEligibilityRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>(GetEligibilityRulesDocument, options);
        }
export type GetEligibilityRulesQueryHookResult = ReturnType<typeof useGetEligibilityRulesQuery>;
export type GetEligibilityRulesLazyQueryHookResult = ReturnType<typeof useGetEligibilityRulesLazyQuery>;
export type GetEligibilityRulesSuspenseQueryHookResult = ReturnType<typeof useGetEligibilityRulesSuspenseQuery>;
export type GetEligibilityRulesQueryResult = Apollo.QueryResult<GetEligibilityRulesQuery, GetEligibilityRulesQueryVariables>;
export const GetEmployeesDocument = gql`
    query GetEmployees {
  getEmployees {
    id
    name
    nameEng
    email
    role
    department
    responsibilityLevel
    employmentStatus
    hireDate
    okrSubmitted
    lateArrivalCount
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetEmployeesQuery__
 *
 * To run a query within a React component, call `useGetEmployeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEmployeesQuery(baseOptions?: Apollo.QueryHookOptions<GetEmployeesQuery, GetEmployeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeesQuery, GetEmployeesQueryVariables>(GetEmployeesDocument, options);
      }
export function useGetEmployeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeesQuery, GetEmployeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeesQuery, GetEmployeesQueryVariables>(GetEmployeesDocument, options);
        }
// @ts-ignore
export function useGetEmployeesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeesQuery, GetEmployeesQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeesQuery, GetEmployeesQueryVariables>;
export function useGetEmployeesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeesQuery, GetEmployeesQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeesQuery | undefined, GetEmployeesQueryVariables>;
export function useGetEmployeesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeesQuery, GetEmployeesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeesQuery, GetEmployeesQueryVariables>(GetEmployeesDocument, options);
        }
export type GetEmployeesQueryHookResult = ReturnType<typeof useGetEmployeesQuery>;
export type GetEmployeesLazyQueryHookResult = ReturnType<typeof useGetEmployeesLazyQuery>;
export type GetEmployeesSuspenseQueryHookResult = ReturnType<typeof useGetEmployeesSuspenseQuery>;
export type GetEmployeesQueryResult = Apollo.QueryResult<GetEmployeesQuery, GetEmployeesQueryVariables>;
export const GetEmployeeDocument = gql`
    query GetEmployee($id: String!) {
  getEmployee(id: $id) {
    id
    name
    nameEng
    email
    role
    department
    responsibilityLevel
    employmentStatus
    hireDate
    okrSubmitted
    lateArrivalCount
    lateArrivalUpdatedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetEmployeeQuery__
 *
 * To run a query within a React component, call `useGetEmployeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEmployeeQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeQuery, GetEmployeeQueryVariables> & ({ variables: GetEmployeeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeQuery, GetEmployeeQueryVariables>(GetEmployeeDocument, options);
      }
export function useGetEmployeeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeQuery, GetEmployeeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeQuery, GetEmployeeQueryVariables>(GetEmployeeDocument, options);
        }
// @ts-ignore
export function useGetEmployeeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeQuery, GetEmployeeQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeQuery, GetEmployeeQueryVariables>;
export function useGetEmployeeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeQuery, GetEmployeeQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeQuery | undefined, GetEmployeeQueryVariables>;
export function useGetEmployeeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeQuery, GetEmployeeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeQuery, GetEmployeeQueryVariables>(GetEmployeeDocument, options);
        }
export type GetEmployeeQueryHookResult = ReturnType<typeof useGetEmployeeQuery>;
export type GetEmployeeLazyQueryHookResult = ReturnType<typeof useGetEmployeeLazyQuery>;
export type GetEmployeeSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeSuspenseQuery>;
export type GetEmployeeQueryResult = Apollo.QueryResult<GetEmployeeQuery, GetEmployeeQueryVariables>;
export const GetEmployeeByEmailDocument = gql`
    query GetEmployeeByEmail($email: String!) {
  getEmployeeByEmail(email: $email) {
    id
    name
    nameEng
    email
    role
    department
    responsibilityLevel
    employmentStatus
    hireDate
    okrSubmitted
    lateArrivalCount
    lateArrivalUpdatedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetEmployeeByEmailQuery__
 *
 * To run a query within a React component, call `useGetEmployeeByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetEmployeeByEmailQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables> & ({ variables: GetEmployeeByEmailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>(GetEmployeeByEmailDocument, options);
      }
export function useGetEmployeeByEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>(GetEmployeeByEmailDocument, options);
        }
// @ts-ignore
export function useGetEmployeeByEmailSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>;
export function useGetEmployeeByEmailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeByEmailQuery | undefined, GetEmployeeByEmailQueryVariables>;
export function useGetEmployeeByEmailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>(GetEmployeeByEmailDocument, options);
        }
export type GetEmployeeByEmailQueryHookResult = ReturnType<typeof useGetEmployeeByEmailQuery>;
export type GetEmployeeByEmailLazyQueryHookResult = ReturnType<typeof useGetEmployeeByEmailLazyQuery>;
export type GetEmployeeByEmailSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeByEmailSuspenseQuery>;
export type GetEmployeeByEmailQueryResult = Apollo.QueryResult<GetEmployeeByEmailQuery, GetEmployeeByEmailQueryVariables>;