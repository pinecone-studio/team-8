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
  approvedThisWeekCount: Scalars['Int']['output'];
  awaitingContractCount: Scalars['Int']['output'];
  benefitsMissingContracts: Scalars['Int']['output'];
  contractsExpiringSoon: Scalars['Int']['output'];
  financeQueueCount: Scalars['Int']['output'];
  hrQueueCount: Scalars['Int']['output'];
  lockReasons: Array<AdminDashboardBucket>;
  lockedBenefits: Scalars['Int']['output'];
  pendingRequests: Scalars['Int']['output'];
  suspendedEnrollments: Scalars['Int']['output'];
  totalEmployees: Scalars['Int']['output'];
  usageByCategory: Array<AdminDashboardBucket>;
};

export type AdminScreenTimeMonthBoard = {
  __typename?: 'AdminScreenTimeMonthBoard';
  benefitId: Scalars['String']['output'];
  monthKey: Scalars['String']['output'];
  program?: Maybe<ScreenTimeProgram>;
  rows: Array<AdminScreenTimeMonthRow>;
  slotDates: Array<Scalars['String']['output']>;
};

export type AdminScreenTimeMonthRow = {
  __typename?: 'AdminScreenTimeMonthRow';
  employeeEmail: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  employeeName: Scalars['String']['output'];
  result: ScreenTimeMonthlyResult;
};

export type AttendanceImportError = {
  __typename?: 'AttendanceImportError';
  identifier: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  row: Scalars['Int']['output'];
};

export type AttendanceImportResult = {
  __typename?: 'AttendanceImportResult';
  errors: Array<AttendanceImportError>;
  invalid: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  updated: Scalars['Int']['output'];
};

export type AttendanceRowInput = {
  checkInTime: Scalars['String']['input'];
  date: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
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
  amount?: Maybe<Scalars['Int']['output']>;
  approvalPolicy: Scalars['String']['output'];
  category: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  employeePercent: Scalars['Int']['output'];
  flowType: BenefitFlowType;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
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
  ScreenTime = 'screen_time',
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
  employeeContractKey?: Maybe<Scalars['String']['output']>;
  employeeId: Scalars['String']['output'];
  employeeSignedContract?: Maybe<EmployeeSignedContract>;
  id: Scalars['String']['output'];
  payment?: Maybe<BenefitRequestPayment>;
  repaymentMonths?: Maybe<Scalars['Int']['output']>;
  requestedAmount?: Maybe<Scalars['Int']['output']>;
  reviewedBy?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  viewContractUrl?: Maybe<Scalars['String']['output']>;
};

export type BenefitRequestPayment = {
  __typename?: 'BenefitRequestPayment';
  amount: Scalars['Int']['output'];
  benefitId: Scalars['String']['output'];
  bonumInvoiceId?: Maybe<Scalars['String']['output']>;
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['String']['output']>;
  failedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  localTransactionId: Scalars['String']['output'];
  paidAt?: Maybe<Scalars['String']['output']>;
  paymentVendor?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
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
  amount?: InputMaybe<Scalars['Int']['input']>;
  approvalPolicy?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  flowType?: InputMaybe<BenefitFlowType>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
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
  avatarUrl?: Maybe<Scalars['String']['output']>;
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

export type EmployeeSettings = {
  __typename?: 'EmployeeSettings';
  language: Scalars['String']['output'];
  notificationEligibility: Scalars['Boolean']['output'];
  notificationEmail: Scalars['Boolean']['output'];
  notificationRenewals: Scalars['Boolean']['output'];
  timezone: Scalars['String']['output'];
};

export type EmployeeSignedContract = {
  __typename?: 'EmployeeSignedContract';
  benefitId: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  hrContractHash?: Maybe<Scalars['String']['output']>;
  hrContractId?: Maybe<Scalars['String']['output']>;
  hrContractVersion?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  uploadedAt: Scalars['String']['output'];
  viewUrl?: Maybe<Scalars['String']['output']>;
};

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
  approveRuleProposal: RuleProposal;
  cancelBenefitRequest: BenefitRequest;
  confirmBenefitRequest: BenefitRequest;
  createBenefit: Benefit;
  createEligibilityRule: EligibilityRule;
  createEmployee: Employee;
  declineBenefitRequest: BenefitRequest;
  deleteBenefit: Scalars['Boolean']['output'];
  deleteEligibilityRule: Scalars['Boolean']['output'];
  deleteEmployee: Scalars['Boolean']['output'];
  importAttendance: AttendanceImportResult;
  markNotificationsRead: Scalars['Boolean']['output'];
  overrideEligibility: BenefitEligibility;
  proposeRuleChange: RuleProposal;
  rejectRuleProposal: RuleProposal;
  requestBenefit: BenefitRequest;
  seedScreenTimeSubmissions: Scalars['Int']['output'];
  syncOkrStatus: OkrSyncResult;
  updateBenefit: Benefit;
  updateEligibilityRule: EligibilityRule;
  updateEmployee?: Maybe<Employee>;
  updateMySettings: EmployeeSettings;
  upsertScreenTimeProgram: ScreenTimeProgram;
};


export type MutationApproveBenefitRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationApproveRuleProposalArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
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


export type MutationImportAttendanceArgs = {
  rows: Array<AttendanceRowInput>;
};


export type MutationMarkNotificationsReadArgs = {
  keys: Array<Scalars['String']['input']>;
};


export type MutationOverrideEligibilityArgs = {
  input: OverrideEligibilityInput;
};


export type MutationProposeRuleChangeArgs = {
  input: ProposeRuleChangeInput;
};


export type MutationRejectRuleProposalArgs = {
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRequestBenefitArgs = {
  input: RequestBenefitInput;
};


export type MutationSeedScreenTimeSubmissionsArgs = {
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSyncOkrStatusArgs = {
  rows: Array<OkrSyncRowInput>;
};


export type MutationUpdateBenefitArgs = {
  id: Scalars['String']['input'];
  input: UpdateBenefitInput;
};


export type MutationUpdateEligibilityRuleArgs = {
  id: Scalars['String']['input'];
  input: UpdateEligibilityRuleInput;
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};


export type MutationUpdateMySettingsArgs = {
  input: UpdateMySettingsInput;
};


export type MutationUpsertScreenTimeProgramArgs = {
  input: UpsertScreenTimeProgramInput;
};

export type MyScreenTimeMonth = {
  __typename?: 'MyScreenTimeMonth';
  activeSlotDate?: Maybe<Scalars['String']['output']>;
  benefitId: Scalars['String']['output'];
  benefitStatus: BenefitEligibilityStatus;
  failedRuleMessage?: Maybe<Scalars['String']['output']>;
  isUploadOpenToday: Scalars['Boolean']['output'];
  month: ScreenTimeMonthlyResult;
  program?: Maybe<ScreenTimeProgram>;
  todayLocalDate: Scalars['String']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  body: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  linkPath?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type OkrSyncError = {
  __typename?: 'OkrSyncError';
  identifier: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  row: Scalars['Int']['output'];
};

export type OkrSyncResult = {
  __typename?: 'OkrSyncResult';
  errors: Array<OkrSyncError>;
  invalid: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  updated: Scalars['Int']['output'];
};

export type OkrSyncRowInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
  okrSubmitted: Scalars['Boolean']['input'];
  quarter?: InputMaybe<Scalars['String']['input']>;
};

export type OverrideEligibilityInput = {
  benefitId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  overrideStatus: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};

export type ProposeRuleChangeInput = {
  benefitId: Scalars['String']['input'];
  changeType: Scalars['String']['input'];
  proposedData: Scalars['String']['input'];
  ruleId?: InputMaybe<Scalars['String']['input']>;
  summary: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminBenefits: Array<Benefit>;
  adminDashboardSummary: AdminDashboardSummary;
  adminScreenTimeMonth: AdminScreenTimeMonthBoard;
  allBenefitRequests: Array<BenefitRequest>;
  auditLogActionTypes: Array<Scalars['String']['output']>;
  auditLogs: Array<AuditLog>;
  benefitRequests: Array<BenefitRequest>;
  benefits: Array<Benefit>;
  contractAcceptances: Array<ContractAcceptance>;
  contracts: Array<Contract>;
  eligibilityRules: Array<EligibilityRule>;
  enrollments: Array<EmployeeBenefitEnrollment>;
  getDepartments: Array<Scalars['String']['output']>;
  getEmployee?: Maybe<Employee>;
  getEmployeeBenefits: Array<BenefitEligibility>;
  getEmployeeByEmail?: Maybe<Employee>;
  getEmployees: Array<Employee>;
  myBenefits: Array<BenefitEligibility>;
  myScreenTimeMonth: MyScreenTimeMonth;
  mySettings: EmployeeSettings;
  notifications: Array<Notification>;
  ruleProposals: Array<RuleProposal>;
  screenTimeLeaderboard: Array<ScreenTimeLeaderboardRow>;
  session?: Maybe<Employee>;
};


export type QueryAdminScreenTimeMonthArgs = {
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
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


export type QueryGetEmployeesArgs = {
  department?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyScreenTimeMonthArgs = {
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRuleProposalsArgs = {
  benefitId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryScreenTimeLeaderboardArgs = {
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
};

export type RequestBenefitInput = {
  benefitId: Scalars['String']['input'];
  employeeContractKey?: InputMaybe<Scalars['String']['input']>;
  employeeSignedContractId?: InputMaybe<Scalars['String']['input']>;
  repaymentMonths?: InputMaybe<Scalars['Int']['input']>;
  requestedAmount?: InputMaybe<Scalars['Int']['input']>;
};

export type RuleEvaluation = {
  __typename?: 'RuleEvaluation';
  passed: Scalars['Boolean']['output'];
  reason: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
};

export type RuleProposal = {
  __typename?: 'RuleProposal';
  benefitId: Scalars['String']['output'];
  changeType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  proposedAt: Scalars['String']['output'];
  proposedByEmployeeId: Scalars['String']['output'];
  proposedData: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  reviewedAt?: Maybe<Scalars['String']['output']>;
  reviewedByEmployeeId?: Maybe<Scalars['String']['output']>;
  ruleId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  summary: Scalars['String']['output'];
};

export type ScreenTimeLeaderboardRow = {
  __typename?: 'ScreenTimeLeaderboardRow';
  approvedSlotCount: Scalars['Int']['output'];
  avgDailyMinutes?: Maybe<Scalars['Int']['output']>;
  awardedSalaryUpliftPercent: Scalars['Int']['output'];
  dueSlotCount: Scalars['Int']['output'];
  employeeEmail: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  employeeName: Scalars['String']['output'];
  isProvisional: Scalars['Boolean']['output'];
  monthKey: Scalars['String']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  requiredSlotCount: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type ScreenTimeMonthlyResult = {
  __typename?: 'ScreenTimeMonthlyResult';
  approvedAt?: Maybe<Scalars['String']['output']>;
  approvedByEmployeeId?: Maybe<Scalars['String']['output']>;
  approvedSlotCount: Scalars['Int']['output'];
  awardedSalaryUpliftPercent: Scalars['Int']['output'];
  benefitId: Scalars['String']['output'];
  decisionNote?: Maybe<Scalars['String']['output']>;
  dueSlotDates: Array<Scalars['String']['output']>;
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  missingDueSlotDates: Array<Scalars['String']['output']>;
  monthKey: Scalars['String']['output'];
  monthlyAvgDailyMinutes?: Maybe<Scalars['Int']['output']>;
  requiredSlotCount: Scalars['Int']['output'];
  requiredSlotDates: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  submissions: Array<ScreenTimeSubmission>;
  submittedSlotCount: Scalars['Int']['output'];
};

export type ScreenTimeProgram = {
  __typename?: 'ScreenTimeProgram';
  benefitId: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  screenshotRetentionDays: Scalars['Int']['output'];
  tiers: Array<ScreenTimeTier>;
};

export type ScreenTimeSubmission = {
  __typename?: 'ScreenTimeSubmission';
  avgDailyMinutes?: Maybe<Scalars['Int']['output']>;
  benefitId: Scalars['String']['output'];
  confidenceScore?: Maybe<Scalars['Int']['output']>;
  employeeId: Scalars['String']['output'];
  extractionStatus: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  monthKey: Scalars['String']['output'];
  periodType?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  reviewNote?: Maybe<Scalars['String']['output']>;
  reviewStatus: Scalars['String']['output'];
  reviewedAt?: Maybe<Scalars['String']['output']>;
  slotDate: Scalars['String']['output'];
  submittedAt: Scalars['String']['output'];
  viewUrl?: Maybe<Scalars['String']['output']>;
};

export type ScreenTimeTier = {
  __typename?: 'ScreenTimeTier';
  benefitId: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  maxDailyMinutes: Scalars['Int']['output'];
  salaryUpliftPercent: Scalars['Int']['output'];
};

export type ScreenTimeTierInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  maxDailyMinutes: Scalars['Int']['input'];
  salaryUpliftPercent: Scalars['Int']['input'];
};

export type UpdateBenefitInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  approvalPolicy?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  flowType?: InputMaybe<BenefitFlowType>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  requiresContract?: InputMaybe<Scalars['Boolean']['input']>;
  subsidyPercent?: InputMaybe<Scalars['Int']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateMySettingsInput = {
  language?: InputMaybe<Scalars['String']['input']>;
  notificationEligibility?: InputMaybe<Scalars['Boolean']['input']>;
  notificationEmail?: InputMaybe<Scalars['Boolean']['input']>;
  notificationRenewals?: InputMaybe<Scalars['Boolean']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertScreenTimeProgramInput = {
  benefitId: Scalars['String']['input'];
  screenshotRetentionDays?: InputMaybe<Scalars['Int']['input']>;
  tiers: Array<ScreenTimeTierInput>;
};

export type MarkNotificationsReadMutationVariables = Exact<{
  keys: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type MarkNotificationsReadMutation = { __typename?: 'Mutation', markNotificationsRead: boolean };

export type RequestBenefitMutationVariables = Exact<{
  input: RequestBenefitInput;
}>;


export type RequestBenefitMutation = { __typename?: 'Mutation', requestBenefit: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, declineReason?: string | null, employeeContractKey?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null, employeeSignedContract?: { __typename?: 'EmployeeSignedContract', id: string, fileName?: string | null, mimeType?: string | null, status: string, uploadedAt: string, viewUrl?: string | null } | null } };

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


export type CreateBenefitMutation = { __typename?: 'Mutation', createBenefit: { __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null } };

export type UpdateBenefitMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateBenefitInput;
}>;


export type UpdateBenefitMutation = { __typename?: 'Mutation', updateBenefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string } };

export type DeleteBenefitMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBenefitMutation = { __typename?: 'Mutation', deleteBenefit: boolean };

export type UpsertScreenTimeProgramMutationVariables = Exact<{
  input: UpsertScreenTimeProgramInput;
}>;


export type UpsertScreenTimeProgramMutation = { __typename?: 'Mutation', upsertScreenTimeProgram: { __typename?: 'ScreenTimeProgram', benefitId: string, screenshotRetentionDays: number, isActive: boolean, tiers: Array<{ __typename?: 'ScreenTimeTier', id: string, benefitId: string, label: string, maxDailyMinutes: number, salaryUpliftPercent: number, displayOrder: number }> } };

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

export type ProposeRuleChangeMutationVariables = Exact<{
  input: ProposeRuleChangeInput;
}>;


export type ProposeRuleChangeMutation = { __typename?: 'Mutation', proposeRuleChange: { __typename?: 'RuleProposal', id: string, benefitId: string, ruleId?: string | null, changeType: string, proposedData: string, summary: string, status: string, proposedByEmployeeId: string, proposedAt: string } };

export type ApproveRuleProposalMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type ApproveRuleProposalMutation = { __typename?: 'Mutation', approveRuleProposal: { __typename?: 'RuleProposal', id: string, status: string, reviewedByEmployeeId?: string | null, reviewedAt?: string | null, reason?: string | null } };

export type RejectRuleProposalMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectRuleProposalMutation = { __typename?: 'Mutation', rejectRuleProposal: { __typename?: 'RuleProposal', id: string, status: string, reviewedByEmployeeId?: string | null, reviewedAt?: string | null, reason?: string | null } };

export type SeedScreenTimeSubmissionsMutationVariables = Exact<{
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type SeedScreenTimeSubmissionsMutation = { __typename?: 'Mutation', seedScreenTimeSubmissions: number };

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

export type UpdateMySettingsMutationVariables = Exact<{
  input: UpdateMySettingsInput;
}>;


export type UpdateMySettingsMutation = { __typename?: 'Mutation', updateMySettings: { __typename?: 'EmployeeSettings', notificationEmail: boolean, notificationEligibility: boolean, notificationRenewals: boolean, language: string, timezone: string } };

export type GetAdminDashboardSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminDashboardSummaryQuery = { __typename?: 'Query', adminDashboardSummary: { __typename?: 'AdminDashboardSummary', totalEmployees: number, activeBenefits: number, pendingRequests: number, lockedBenefits: number, hrQueueCount: number, financeQueueCount: number, awaitingContractCount: number, approvedThisWeekCount: number, contractsExpiringSoon: number, benefitsMissingContracts: number, suspendedEnrollments: number, usageByCategory: Array<{ __typename?: 'AdminDashboardBucket', label: string, value: number }>, lockReasons: Array<{ __typename?: 'AdminDashboardBucket', label: string, value: number }> } };

export type GetAdminBenefitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminBenefitsQuery = { __typename?: 'Query', adminBenefits: Array<{ __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string, amount?: number | null }> };

export type GetAuditLogActionTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuditLogActionTypesQuery = { __typename?: 'Query', auditLogActionTypes: Array<string> };

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

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { __typename?: 'Query', notifications: Array<{ __typename?: 'Notification', id: string, type: string, title: string, body: string, linkPath?: string | null, createdAt: string, isRead: boolean }> };

export type GetRuleProposalsQueryVariables = Exact<{
  benefitId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRuleProposalsQuery = { __typename?: 'Query', ruleProposals: Array<{ __typename?: 'RuleProposal', id: string, benefitId: string, ruleId?: string | null, changeType: string, proposedData: string, summary: string, status: string, proposedByEmployeeId: string, reviewedByEmployeeId?: string | null, proposedAt: string, reviewedAt?: string | null, reason?: string | null }> };

export type GetBenefitsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBenefitsQuery = { __typename?: 'Query', benefits: Array<{ __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string, amount?: number | null, location?: string | null, imageUrl?: string | null }> };

export type GetMyBenefitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyBenefitsQuery = { __typename?: 'Query', myBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null, benefit: { __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null }> };

export type GetMyBenefitsFullQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyBenefitsFullQuery = { __typename?: 'Query', myBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null, benefit: { __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string, amount?: number | null, location?: string | null, imageUrl?: string | null }, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null }> };

export type GetBenefitRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBenefitRequestsQuery = { __typename?: 'Query', benefitRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, employeeApprovedAt?: string | null, declineReason?: string | null, employeeContractKey?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null, employeeSignedContract?: { __typename?: 'EmployeeSignedContract', id: string, fileName?: string | null, mimeType?: string | null, status: string, uploadedAt: string, viewUrl?: string | null } | null, payment?: { __typename?: 'BenefitRequestPayment', id: string, status: string, amount: number, currency: string, checkoutUrl?: string | null, expiresAt?: string | null, paidAt?: string | null, failedAt?: string | null, paymentVendor?: string | null, localTransactionId: string, bonumInvoiceId?: string | null, createdAt: string, updatedAt: string } | null }> };

export type GetAllBenefitRequestsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
  queue?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllBenefitRequestsQuery = { __typename?: 'Query', allBenefitRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, employeeApprovedAt?: string | null, declineReason?: string | null, createdAt: string, updatedAt: string, viewContractUrl?: string | null, employeeSignedContract?: { __typename?: 'EmployeeSignedContract', id: string, fileName?: string | null, mimeType?: string | null, status: string, uploadedAt: string, viewUrl?: string | null } | null, payment?: { __typename?: 'BenefitRequestPayment', id: string, status: string, amount: number, currency: string, expiresAt?: string | null, paidAt?: string | null, failedAt?: string | null, paymentVendor?: string | null, localTransactionId: string, bonumInvoiceId?: string | null, createdAt: string, updatedAt: string } | null }> };

export type GetEmployeeBenefitsQueryVariables = Exact<{
  employeeId: Scalars['String']['input'];
}>;


export type GetEmployeeBenefitsQuery = { __typename?: 'Query', getEmployeeBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, overrideStatus?: string | null, overrideBy?: string | null, overrideReason?: string | null, overrideExpiresAt?: string | null, benefit: { __typename?: 'Benefit', id: string, name: string, description?: string | null, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, isActive: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, approvalPolicy: string }, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null }> };

export type GetContractsForBenefitQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
}>;


export type GetContractsForBenefitQuery = { __typename?: 'Query', contracts: Array<{ __typename?: 'Contract', id: string, version: string, isActive: boolean, viewUrl?: string | null, vendorName: string, effectiveDate: string, expiryDate: string }> };

export type GetEligibilityRulesQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
}>;


export type GetEligibilityRulesQuery = { __typename?: 'Query', eligibilityRules: Array<{ __typename?: 'EligibilityRule', id: string, benefitId: string, ruleType: string, operator: string, value: string, errorMessage: string, priority: number, isActive: boolean }> };

export type GetMyScreenTimeMonthQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMyScreenTimeMonthQuery = { __typename?: 'Query', myScreenTimeMonth: { __typename?: 'MyScreenTimeMonth', benefitId: string, benefitStatus: BenefitEligibilityStatus, failedRuleMessage?: string | null, todayLocalDate: string, activeSlotDate?: string | null, isUploadOpenToday: boolean, program?: { __typename?: 'ScreenTimeProgram', benefitId: string, screenshotRetentionDays: number, isActive: boolean, tiers: Array<{ __typename?: 'ScreenTimeTier', id: string, benefitId: string, label: string, maxDailyMinutes: number, salaryUpliftPercent: number, displayOrder: number }> } | null, month: { __typename?: 'ScreenTimeMonthlyResult', id: string, benefitId: string, employeeId: string, monthKey: string, requiredSlotDates: Array<string>, dueSlotDates: Array<string>, missingDueSlotDates: Array<string>, requiredSlotCount: number, submittedSlotCount: number, approvedSlotCount: number, monthlyAvgDailyMinutes?: number | null, awardedSalaryUpliftPercent: number, status: string, approvedByEmployeeId?: string | null, approvedAt?: string | null, decisionNote?: string | null, submissions: Array<{ __typename?: 'ScreenTimeSubmission', id: string, benefitId: string, employeeId: string, monthKey: string, slotDate: string, avgDailyMinutes?: number | null, confidenceScore?: number | null, platform?: string | null, periodType?: string | null, extractionStatus: string, reviewStatus: string, reviewNote?: string | null, submittedAt: string, reviewedAt?: string | null, fileName?: string | null, viewUrl?: string | null }> } } };

export type GetAdminScreenTimeMonthQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAdminScreenTimeMonthQuery = { __typename?: 'Query', adminScreenTimeMonth: { __typename?: 'AdminScreenTimeMonthBoard', benefitId: string, monthKey: string, slotDates: Array<string>, program?: { __typename?: 'ScreenTimeProgram', benefitId: string, screenshotRetentionDays: number, isActive: boolean, tiers: Array<{ __typename?: 'ScreenTimeTier', id: string, benefitId: string, label: string, maxDailyMinutes: number, salaryUpliftPercent: number, displayOrder: number }> } | null, rows: Array<{ __typename?: 'AdminScreenTimeMonthRow', employeeId: string, employeeName: string, employeeEmail: string, result: { __typename?: 'ScreenTimeMonthlyResult', id: string, benefitId: string, employeeId: string, monthKey: string, requiredSlotDates: Array<string>, dueSlotDates: Array<string>, missingDueSlotDates: Array<string>, requiredSlotCount: number, submittedSlotCount: number, approvedSlotCount: number, monthlyAvgDailyMinutes?: number | null, awardedSalaryUpliftPercent: number, status: string, approvedByEmployeeId?: string | null, approvedAt?: string | null, decisionNote?: string | null, submissions: Array<{ __typename?: 'ScreenTimeSubmission', id: string, benefitId: string, employeeId: string, monthKey: string, slotDate: string, avgDailyMinutes?: number | null, confidenceScore?: number | null, platform?: string | null, periodType?: string | null, extractionStatus: string, reviewStatus: string, reviewNote?: string | null, submittedAt: string, reviewedAt?: string | null, fileName?: string | null, viewUrl?: string | null }> } }> } };

export type GetScreenTimeLeaderboardQueryVariables = Exact<{
  benefitId: Scalars['String']['input'];
  monthKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetScreenTimeLeaderboardQuery = { __typename?: 'Query', screenTimeLeaderboard: Array<{ __typename?: 'ScreenTimeLeaderboardRow', rank?: number | null, employeeId: string, employeeName: string, employeeEmail: string, monthKey: string, status: string, avgDailyMinutes?: number | null, awardedSalaryUpliftPercent: number, approvedSlotCount: number, dueSlotCount: number, requiredSlotCount: number, isProvisional: boolean }> };

export type GetDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDepartmentsQuery = { __typename?: 'Query', getDepartments: Array<string> };

export type GetEmployeesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEmployeesQuery = { __typename?: 'Query', getEmployees: Array<{ __typename?: 'Employee', id: string, avatarUrl?: string | null, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, createdAt: any, updatedAt: any }> };

export type GetEmployeeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetEmployeeQuery = { __typename?: 'Query', getEmployee?: { __typename?: 'Employee', id: string, avatarUrl?: string | null, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, lateArrivalUpdatedAt?: any | null, createdAt: any, updatedAt: any } | null };

export type GetEmployeeByEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetEmployeeByEmailQuery = { __typename?: 'Query', getEmployeeByEmail?: { __typename?: 'Employee', id: string, avatarUrl?: string | null, name: string, nameEng?: string | null, email: string, role: string, department: string, responsibilityLevel: number, employmentStatus: string, hireDate: any, okrSubmitted: number, lateArrivalCount: number, lateArrivalUpdatedAt?: any | null, createdAt: any, updatedAt: any } | null };

export type GetMySettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySettingsQuery = { __typename?: 'Query', mySettings: { __typename?: 'EmployeeSettings', notificationEmail: boolean, notificationEligibility: boolean, notificationRenewals: boolean, language: string, timezone: string } };


export const MarkNotificationsReadDocument = gql`
    mutation MarkNotificationsRead($keys: [String!]!) {
  markNotificationsRead(keys: $keys)
}
    `;
export type MarkNotificationsReadMutationFn = Apollo.MutationFunction<MarkNotificationsReadMutation, MarkNotificationsReadMutationVariables>;

/**
 * __useMarkNotificationsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationsReadMutation, { data, loading, error }] = useMarkNotificationsReadMutation({
 *   variables: {
 *      keys: // value for 'keys'
 *   },
 * });
 */
export function useMarkNotificationsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationsReadMutation, MarkNotificationsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationsReadMutation, MarkNotificationsReadMutationVariables>(MarkNotificationsReadDocument, options);
      }
export type MarkNotificationsReadMutationHookResult = ReturnType<typeof useMarkNotificationsReadMutation>;
export type MarkNotificationsReadMutationResult = Apollo.MutationResult<MarkNotificationsReadMutation>;
export type MarkNotificationsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationsReadMutation, MarkNotificationsReadMutationVariables>;
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
    employeeContractKey
    employeeSignedContract {
      id
      fileName
      mimeType
      status
      uploadedAt
      viewUrl
    }
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
    description
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
export const UpdateBenefitDocument = gql`
    mutation UpdateBenefit($id: String!, $input: UpdateBenefitInput!) {
  updateBenefit(id: $id, input: $input) {
    id
    name
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    isActive
    flowType
    optionsDescription
    approvalPolicy
  }
}
    `;
export type UpdateBenefitMutationFn = Apollo.MutationFunction<UpdateBenefitMutation, UpdateBenefitMutationVariables>;

/**
 * __useUpdateBenefitMutation__
 *
 * To run a mutation, you first call `useUpdateBenefitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBenefitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBenefitMutation, { data, loading, error }] = useUpdateBenefitMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBenefitMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBenefitMutation, UpdateBenefitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBenefitMutation, UpdateBenefitMutationVariables>(UpdateBenefitDocument, options);
      }
export type UpdateBenefitMutationHookResult = ReturnType<typeof useUpdateBenefitMutation>;
export type UpdateBenefitMutationResult = Apollo.MutationResult<UpdateBenefitMutation>;
export type UpdateBenefitMutationOptions = Apollo.BaseMutationOptions<UpdateBenefitMutation, UpdateBenefitMutationVariables>;
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
export const UpsertScreenTimeProgramDocument = gql`
    mutation UpsertScreenTimeProgram($input: UpsertScreenTimeProgramInput!) {
  upsertScreenTimeProgram(input: $input) {
    benefitId
    screenshotRetentionDays
    isActive
    tiers {
      id
      benefitId
      label
      maxDailyMinutes
      salaryUpliftPercent
      displayOrder
    }
  }
}
    `;
export type UpsertScreenTimeProgramMutationFn = Apollo.MutationFunction<UpsertScreenTimeProgramMutation, UpsertScreenTimeProgramMutationVariables>;

/**
 * __useUpsertScreenTimeProgramMutation__
 *
 * To run a mutation, you first call `useUpsertScreenTimeProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertScreenTimeProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertScreenTimeProgramMutation, { data, loading, error }] = useUpsertScreenTimeProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertScreenTimeProgramMutation(baseOptions?: Apollo.MutationHookOptions<UpsertScreenTimeProgramMutation, UpsertScreenTimeProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertScreenTimeProgramMutation, UpsertScreenTimeProgramMutationVariables>(UpsertScreenTimeProgramDocument, options);
      }
export type UpsertScreenTimeProgramMutationHookResult = ReturnType<typeof useUpsertScreenTimeProgramMutation>;
export type UpsertScreenTimeProgramMutationResult = Apollo.MutationResult<UpsertScreenTimeProgramMutation>;
export type UpsertScreenTimeProgramMutationOptions = Apollo.BaseMutationOptions<UpsertScreenTimeProgramMutation, UpsertScreenTimeProgramMutationVariables>;
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
export const ProposeRuleChangeDocument = gql`
    mutation ProposeRuleChange($input: ProposeRuleChangeInput!) {
  proposeRuleChange(input: $input) {
    id
    benefitId
    ruleId
    changeType
    proposedData
    summary
    status
    proposedByEmployeeId
    proposedAt
  }
}
    `;
export type ProposeRuleChangeMutationFn = Apollo.MutationFunction<ProposeRuleChangeMutation, ProposeRuleChangeMutationVariables>;

/**
 * __useProposeRuleChangeMutation__
 *
 * To run a mutation, you first call `useProposeRuleChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProposeRuleChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [proposeRuleChangeMutation, { data, loading, error }] = useProposeRuleChangeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProposeRuleChangeMutation(baseOptions?: Apollo.MutationHookOptions<ProposeRuleChangeMutation, ProposeRuleChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProposeRuleChangeMutation, ProposeRuleChangeMutationVariables>(ProposeRuleChangeDocument, options);
      }
export type ProposeRuleChangeMutationHookResult = ReturnType<typeof useProposeRuleChangeMutation>;
export type ProposeRuleChangeMutationResult = Apollo.MutationResult<ProposeRuleChangeMutation>;
export type ProposeRuleChangeMutationOptions = Apollo.BaseMutationOptions<ProposeRuleChangeMutation, ProposeRuleChangeMutationVariables>;
export const ApproveRuleProposalDocument = gql`
    mutation ApproveRuleProposal($id: String!, $reason: String) {
  approveRuleProposal(id: $id, reason: $reason) {
    id
    status
    reviewedByEmployeeId
    reviewedAt
    reason
  }
}
    `;
export type ApproveRuleProposalMutationFn = Apollo.MutationFunction<ApproveRuleProposalMutation, ApproveRuleProposalMutationVariables>;

/**
 * __useApproveRuleProposalMutation__
 *
 * To run a mutation, you first call `useApproveRuleProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveRuleProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveRuleProposalMutation, { data, loading, error }] = useApproveRuleProposalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useApproveRuleProposalMutation(baseOptions?: Apollo.MutationHookOptions<ApproveRuleProposalMutation, ApproveRuleProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveRuleProposalMutation, ApproveRuleProposalMutationVariables>(ApproveRuleProposalDocument, options);
      }
export type ApproveRuleProposalMutationHookResult = ReturnType<typeof useApproveRuleProposalMutation>;
export type ApproveRuleProposalMutationResult = Apollo.MutationResult<ApproveRuleProposalMutation>;
export type ApproveRuleProposalMutationOptions = Apollo.BaseMutationOptions<ApproveRuleProposalMutation, ApproveRuleProposalMutationVariables>;
export const RejectRuleProposalDocument = gql`
    mutation RejectRuleProposal($id: String!, $reason: String!) {
  rejectRuleProposal(id: $id, reason: $reason) {
    id
    status
    reviewedByEmployeeId
    reviewedAt
    reason
  }
}
    `;
export type RejectRuleProposalMutationFn = Apollo.MutationFunction<RejectRuleProposalMutation, RejectRuleProposalMutationVariables>;

/**
 * __useRejectRuleProposalMutation__
 *
 * To run a mutation, you first call `useRejectRuleProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectRuleProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectRuleProposalMutation, { data, loading, error }] = useRejectRuleProposalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useRejectRuleProposalMutation(baseOptions?: Apollo.MutationHookOptions<RejectRuleProposalMutation, RejectRuleProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectRuleProposalMutation, RejectRuleProposalMutationVariables>(RejectRuleProposalDocument, options);
      }
export type RejectRuleProposalMutationHookResult = ReturnType<typeof useRejectRuleProposalMutation>;
export type RejectRuleProposalMutationResult = Apollo.MutationResult<RejectRuleProposalMutation>;
export type RejectRuleProposalMutationOptions = Apollo.BaseMutationOptions<RejectRuleProposalMutation, RejectRuleProposalMutationVariables>;
export const SeedScreenTimeSubmissionsDocument = gql`
    mutation SeedScreenTimeSubmissions($benefitId: String!, $monthKey: String) {
  seedScreenTimeSubmissions(benefitId: $benefitId, monthKey: $monthKey)
}
    `;
export type SeedScreenTimeSubmissionsMutationFn = Apollo.MutationFunction<SeedScreenTimeSubmissionsMutation, SeedScreenTimeSubmissionsMutationVariables>;

/**
 * __useSeedScreenTimeSubmissionsMutation__
 *
 * To run a mutation, you first call `useSeedScreenTimeSubmissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSeedScreenTimeSubmissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [seedScreenTimeSubmissionsMutation, { data, loading, error }] = useSeedScreenTimeSubmissionsMutation({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *      monthKey: // value for 'monthKey'
 *   },
 * });
 */
export function useSeedScreenTimeSubmissionsMutation(baseOptions?: Apollo.MutationHookOptions<SeedScreenTimeSubmissionsMutation, SeedScreenTimeSubmissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SeedScreenTimeSubmissionsMutation, SeedScreenTimeSubmissionsMutationVariables>(SeedScreenTimeSubmissionsDocument, options);
      }
export type SeedScreenTimeSubmissionsMutationHookResult = ReturnType<typeof useSeedScreenTimeSubmissionsMutation>;
export type SeedScreenTimeSubmissionsMutationResult = Apollo.MutationResult<SeedScreenTimeSubmissionsMutation>;
export type SeedScreenTimeSubmissionsMutationOptions = Apollo.BaseMutationOptions<SeedScreenTimeSubmissionsMutation, SeedScreenTimeSubmissionsMutationVariables>;
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
export const UpdateMySettingsDocument = gql`
    mutation UpdateMySettings($input: UpdateMySettingsInput!) {
  updateMySettings(input: $input) {
    notificationEmail
    notificationEligibility
    notificationRenewals
    language
    timezone
  }
}
    `;
export type UpdateMySettingsMutationFn = Apollo.MutationFunction<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>;

/**
 * __useUpdateMySettingsMutation__
 *
 * To run a mutation, you first call `useUpdateMySettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMySettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMySettingsMutation, { data, loading, error }] = useUpdateMySettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMySettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>(UpdateMySettingsDocument, options);
      }
export type UpdateMySettingsMutationHookResult = ReturnType<typeof useUpdateMySettingsMutation>;
export type UpdateMySettingsMutationResult = Apollo.MutationResult<UpdateMySettingsMutation>;
export type UpdateMySettingsMutationOptions = Apollo.BaseMutationOptions<UpdateMySettingsMutation, UpdateMySettingsMutationVariables>;
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
    hrQueueCount
    financeQueueCount
    awaitingContractCount
    approvedThisWeekCount
    contractsExpiringSoon
    benefitsMissingContracts
    suspendedEnrollments
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
    description
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    isActive
    flowType
    optionsDescription
    approvalPolicy
    amount
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
export const GetAuditLogActionTypesDocument = gql`
    query GetAuditLogActionTypes {
  auditLogActionTypes
}
    `;

/**
 * __useGetAuditLogActionTypesQuery__
 *
 * To run a query within a React component, call `useGetAuditLogActionTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogActionTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogActionTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuditLogActionTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>(GetAuditLogActionTypesDocument, options);
      }
export function useGetAuditLogActionTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>(GetAuditLogActionTypesDocument, options);
        }
// @ts-ignore
export function useGetAuditLogActionTypesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>;
export function useGetAuditLogActionTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogActionTypesQuery | undefined, GetAuditLogActionTypesQueryVariables>;
export function useGetAuditLogActionTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>(GetAuditLogActionTypesDocument, options);
        }
export type GetAuditLogActionTypesQueryHookResult = ReturnType<typeof useGetAuditLogActionTypesQuery>;
export type GetAuditLogActionTypesLazyQueryHookResult = ReturnType<typeof useGetAuditLogActionTypesLazyQuery>;
export type GetAuditLogActionTypesSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogActionTypesSuspenseQuery>;
export type GetAuditLogActionTypesQueryResult = Apollo.QueryResult<GetAuditLogActionTypesQuery, GetAuditLogActionTypesQueryVariables>;
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
export const GetNotificationsDocument = gql`
    query GetNotifications {
  notifications {
    id
    type
    title
    body
    linkPath
    createdAt
    isRead
  }
}
    `;

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
// @ts-ignore
export function useGetNotificationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetNotificationsQuery | undefined, GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationsSuspenseQuery>;
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetRuleProposalsDocument = gql`
    query GetRuleProposals($benefitId: String, $status: String) {
  ruleProposals(benefitId: $benefitId, status: $status) {
    id
    benefitId
    ruleId
    changeType
    proposedData
    summary
    status
    proposedByEmployeeId
    reviewedByEmployeeId
    proposedAt
    reviewedAt
    reason
  }
}
    `;

/**
 * __useGetRuleProposalsQuery__
 *
 * To run a query within a React component, call `useGetRuleProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRuleProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRuleProposalsQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetRuleProposalsQuery(baseOptions?: Apollo.QueryHookOptions<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>(GetRuleProposalsDocument, options);
      }
export function useGetRuleProposalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>(GetRuleProposalsDocument, options);
        }
// @ts-ignore
export function useGetRuleProposalsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>;
export function useGetRuleProposalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetRuleProposalsQuery | undefined, GetRuleProposalsQueryVariables>;
export function useGetRuleProposalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>(GetRuleProposalsDocument, options);
        }
export type GetRuleProposalsQueryHookResult = ReturnType<typeof useGetRuleProposalsQuery>;
export type GetRuleProposalsLazyQueryHookResult = ReturnType<typeof useGetRuleProposalsLazyQuery>;
export type GetRuleProposalsSuspenseQueryHookResult = ReturnType<typeof useGetRuleProposalsSuspenseQuery>;
export type GetRuleProposalsQueryResult = Apollo.QueryResult<GetRuleProposalsQuery, GetRuleProposalsQueryVariables>;
export const GetBenefitsDocument = gql`
    query GetBenefits($category: String) {
  benefits(category: $category) {
    id
    name
    description
    nameEng
    category
    subsidyPercent
    employeePercent
    unitPrice
    vendorName
    requiresContract
    isActive
    flowType
    optionsDescription
    approvalPolicy
    amount
    location
    imageUrl
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
      description
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      isActive
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
export const GetMyBenefitsFullDocument = gql`
    query GetMyBenefitsFull {
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
      description
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      isActive
      flowType
      optionsDescription
      approvalPolicy
      amount
      location
      imageUrl
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
 * __useGetMyBenefitsFullQuery__
 *
 * To run a query within a React component, call `useGetMyBenefitsFullQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyBenefitsFullQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyBenefitsFullQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyBenefitsFullQuery(baseOptions?: Apollo.QueryHookOptions<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>(GetMyBenefitsFullDocument, options);
      }
export function useGetMyBenefitsFullLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>(GetMyBenefitsFullDocument, options);
        }
// @ts-ignore
export function useGetMyBenefitsFullSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>;
export function useGetMyBenefitsFullSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyBenefitsFullQuery | undefined, GetMyBenefitsFullQueryVariables>;
export function useGetMyBenefitsFullSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>(GetMyBenefitsFullDocument, options);
        }
export type GetMyBenefitsFullQueryHookResult = ReturnType<typeof useGetMyBenefitsFullQuery>;
export type GetMyBenefitsFullLazyQueryHookResult = ReturnType<typeof useGetMyBenefitsFullLazyQuery>;
export type GetMyBenefitsFullSuspenseQueryHookResult = ReturnType<typeof useGetMyBenefitsFullSuspenseQuery>;
export type GetMyBenefitsFullQueryResult = Apollo.QueryResult<GetMyBenefitsFullQuery, GetMyBenefitsFullQueryVariables>;
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
    employeeContractKey
    employeeSignedContract {
      id
      fileName
      mimeType
      status
      uploadedAt
      viewUrl
    }
    payment {
      id
      status
      amount
      currency
      checkoutUrl
      expiresAt
      paidAt
      failedAt
      paymentVendor
      localTransactionId
      bonumInvoiceId
      createdAt
      updatedAt
    }
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
    employeeSignedContract {
      id
      fileName
      mimeType
      status
      uploadedAt
      viewUrl
    }
    payment {
      id
      status
      amount
      currency
      expiresAt
      paidAt
      failedAt
      paymentVendor
      localTransactionId
      bonumInvoiceId
      createdAt
      updatedAt
    }
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
      description
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      isActive
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
export const GetMyScreenTimeMonthDocument = gql`
    query GetMyScreenTimeMonth($benefitId: String!, $monthKey: String) {
  myScreenTimeMonth(benefitId: $benefitId, monthKey: $monthKey) {
    benefitId
    benefitStatus
    failedRuleMessage
    todayLocalDate
    activeSlotDate
    isUploadOpenToday
    program {
      benefitId
      screenshotRetentionDays
      isActive
      tiers {
        id
        benefitId
        label
        maxDailyMinutes
        salaryUpliftPercent
        displayOrder
      }
    }
    month {
      id
      benefitId
      employeeId
      monthKey
      requiredSlotDates
      dueSlotDates
      missingDueSlotDates
      requiredSlotCount
      submittedSlotCount
      approvedSlotCount
      monthlyAvgDailyMinutes
      awardedSalaryUpliftPercent
      status
      approvedByEmployeeId
      approvedAt
      decisionNote
      submissions {
        id
        benefitId
        employeeId
        monthKey
        slotDate
        avgDailyMinutes
        confidenceScore
        platform
        periodType
        extractionStatus
        reviewStatus
        reviewNote
        submittedAt
        reviewedAt
        fileName
        viewUrl
      }
    }
  }
}
    `;

/**
 * __useGetMyScreenTimeMonthQuery__
 *
 * To run a query within a React component, call `useGetMyScreenTimeMonthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyScreenTimeMonthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyScreenTimeMonthQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *      monthKey: // value for 'monthKey'
 *   },
 * });
 */
export function useGetMyScreenTimeMonthQuery(baseOptions: Apollo.QueryHookOptions<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables> & ({ variables: GetMyScreenTimeMonthQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>(GetMyScreenTimeMonthDocument, options);
      }
export function useGetMyScreenTimeMonthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>(GetMyScreenTimeMonthDocument, options);
        }
// @ts-ignore
export function useGetMyScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>;
export function useGetMyScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyScreenTimeMonthQuery | undefined, GetMyScreenTimeMonthQueryVariables>;
export function useGetMyScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>(GetMyScreenTimeMonthDocument, options);
        }
export type GetMyScreenTimeMonthQueryHookResult = ReturnType<typeof useGetMyScreenTimeMonthQuery>;
export type GetMyScreenTimeMonthLazyQueryHookResult = ReturnType<typeof useGetMyScreenTimeMonthLazyQuery>;
export type GetMyScreenTimeMonthSuspenseQueryHookResult = ReturnType<typeof useGetMyScreenTimeMonthSuspenseQuery>;
export type GetMyScreenTimeMonthQueryResult = Apollo.QueryResult<GetMyScreenTimeMonthQuery, GetMyScreenTimeMonthQueryVariables>;
export const GetAdminScreenTimeMonthDocument = gql`
    query GetAdminScreenTimeMonth($benefitId: String!, $monthKey: String) {
  adminScreenTimeMonth(benefitId: $benefitId, monthKey: $monthKey) {
    benefitId
    monthKey
    slotDates
    program {
      benefitId
      screenshotRetentionDays
      isActive
      tiers {
        id
        benefitId
        label
        maxDailyMinutes
        salaryUpliftPercent
        displayOrder
      }
    }
    rows {
      employeeId
      employeeName
      employeeEmail
      result {
        id
        benefitId
        employeeId
        monthKey
        requiredSlotDates
        dueSlotDates
        missingDueSlotDates
        requiredSlotCount
        submittedSlotCount
        approvedSlotCount
        monthlyAvgDailyMinutes
        awardedSalaryUpliftPercent
        status
        approvedByEmployeeId
        approvedAt
        decisionNote
        submissions {
          id
          benefitId
          employeeId
          monthKey
          slotDate
          avgDailyMinutes
          confidenceScore
          platform
          periodType
          extractionStatus
          reviewStatus
          reviewNote
          submittedAt
          reviewedAt
          fileName
          viewUrl
        }
      }
    }
  }
}
    `;

/**
 * __useGetAdminScreenTimeMonthQuery__
 *
 * To run a query within a React component, call `useGetAdminScreenTimeMonthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminScreenTimeMonthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminScreenTimeMonthQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *      monthKey: // value for 'monthKey'
 *   },
 * });
 */
export function useGetAdminScreenTimeMonthQuery(baseOptions: Apollo.QueryHookOptions<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables> & ({ variables: GetAdminScreenTimeMonthQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>(GetAdminScreenTimeMonthDocument, options);
      }
export function useGetAdminScreenTimeMonthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>(GetAdminScreenTimeMonthDocument, options);
        }
// @ts-ignore
export function useGetAdminScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>;
export function useGetAdminScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>): Apollo.UseSuspenseQueryResult<GetAdminScreenTimeMonthQuery | undefined, GetAdminScreenTimeMonthQueryVariables>;
export function useGetAdminScreenTimeMonthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>(GetAdminScreenTimeMonthDocument, options);
        }
export type GetAdminScreenTimeMonthQueryHookResult = ReturnType<typeof useGetAdminScreenTimeMonthQuery>;
export type GetAdminScreenTimeMonthLazyQueryHookResult = ReturnType<typeof useGetAdminScreenTimeMonthLazyQuery>;
export type GetAdminScreenTimeMonthSuspenseQueryHookResult = ReturnType<typeof useGetAdminScreenTimeMonthSuspenseQuery>;
export type GetAdminScreenTimeMonthQueryResult = Apollo.QueryResult<GetAdminScreenTimeMonthQuery, GetAdminScreenTimeMonthQueryVariables>;
export const GetScreenTimeLeaderboardDocument = gql`
    query GetScreenTimeLeaderboard($benefitId: String!, $monthKey: String) {
  screenTimeLeaderboard(benefitId: $benefitId, monthKey: $monthKey) {
    rank
    employeeId
    employeeName
    employeeEmail
    monthKey
    status
    avgDailyMinutes
    awardedSalaryUpliftPercent
    approvedSlotCount
    dueSlotCount
    requiredSlotCount
    isProvisional
  }
}
    `;

/**
 * __useGetScreenTimeLeaderboardQuery__
 *
 * To run a query within a React component, call `useGetScreenTimeLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScreenTimeLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScreenTimeLeaderboardQuery({
 *   variables: {
 *      benefitId: // value for 'benefitId'
 *      monthKey: // value for 'monthKey'
 *   },
 * });
 */
export function useGetScreenTimeLeaderboardQuery(baseOptions: Apollo.QueryHookOptions<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables> & ({ variables: GetScreenTimeLeaderboardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>(GetScreenTimeLeaderboardDocument, options);
      }
export function useGetScreenTimeLeaderboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>(GetScreenTimeLeaderboardDocument, options);
        }
// @ts-ignore
export function useGetScreenTimeLeaderboardSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>): Apollo.UseSuspenseQueryResult<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>;
export function useGetScreenTimeLeaderboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>): Apollo.UseSuspenseQueryResult<GetScreenTimeLeaderboardQuery | undefined, GetScreenTimeLeaderboardQueryVariables>;
export function useGetScreenTimeLeaderboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>(GetScreenTimeLeaderboardDocument, options);
        }
export type GetScreenTimeLeaderboardQueryHookResult = ReturnType<typeof useGetScreenTimeLeaderboardQuery>;
export type GetScreenTimeLeaderboardLazyQueryHookResult = ReturnType<typeof useGetScreenTimeLeaderboardLazyQuery>;
export type GetScreenTimeLeaderboardSuspenseQueryHookResult = ReturnType<typeof useGetScreenTimeLeaderboardSuspenseQuery>;
export type GetScreenTimeLeaderboardQueryResult = Apollo.QueryResult<GetScreenTimeLeaderboardQuery, GetScreenTimeLeaderboardQueryVariables>;
export const GetDepartmentsDocument = gql`
    query GetDepartments {
  getDepartments
}
    `;

/**
 * __useGetDepartmentsQuery__
 *
 * To run a query within a React component, call `useGetDepartmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepartmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepartmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDepartmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetDepartmentsQuery, GetDepartmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDepartmentsQuery, GetDepartmentsQueryVariables>(GetDepartmentsDocument, options);
      }
export function useGetDepartmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDepartmentsQuery, GetDepartmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDepartmentsQuery, GetDepartmentsQueryVariables>(GetDepartmentsDocument, options);
        }
// @ts-ignore
export function useGetDepartmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDepartmentsQuery, GetDepartmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export function useGetDepartmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDepartmentsQuery, GetDepartmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDepartmentsQuery | undefined, GetDepartmentsQueryVariables>;
export function useGetDepartmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDepartmentsQuery, GetDepartmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDepartmentsQuery, GetDepartmentsQueryVariables>(GetDepartmentsDocument, options);
        }
export type GetDepartmentsQueryHookResult = ReturnType<typeof useGetDepartmentsQuery>;
export type GetDepartmentsLazyQueryHookResult = ReturnType<typeof useGetDepartmentsLazyQuery>;
export type GetDepartmentsSuspenseQueryHookResult = ReturnType<typeof useGetDepartmentsSuspenseQuery>;
export type GetDepartmentsQueryResult = Apollo.QueryResult<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export const GetEmployeesDocument = gql`
    query GetEmployees($search: String, $department: String, $limit: Int) {
  getEmployees(search: $search, department: $department, limit: $limit) {
    id
    avatarUrl
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
 *      search: // value for 'search'
 *      department: // value for 'department'
 *      limit: // value for 'limit'
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
    avatarUrl
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
    avatarUrl
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
export const GetMySettingsDocument = gql`
    query GetMySettings {
  mySettings {
    notificationEmail
    notificationEligibility
    notificationRenewals
    language
    timezone
  }
}
    `;

/**
 * __useGetMySettingsQuery__
 *
 * To run a query within a React component, call `useGetMySettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMySettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMySettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMySettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetMySettingsQuery, GetMySettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMySettingsQuery, GetMySettingsQueryVariables>(GetMySettingsDocument, options);
      }
export function useGetMySettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMySettingsQuery, GetMySettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMySettingsQuery, GetMySettingsQueryVariables>(GetMySettingsDocument, options);
        }
// @ts-ignore
export function useGetMySettingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMySettingsQuery, GetMySettingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMySettingsQuery, GetMySettingsQueryVariables>;
export function useGetMySettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMySettingsQuery, GetMySettingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMySettingsQuery | undefined, GetMySettingsQueryVariables>;
export function useGetMySettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMySettingsQuery, GetMySettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMySettingsQuery, GetMySettingsQueryVariables>(GetMySettingsDocument, options);
        }
export type GetMySettingsQueryHookResult = ReturnType<typeof useGetMySettingsQuery>;
export type GetMySettingsLazyQueryHookResult = ReturnType<typeof useGetMySettingsLazyQuery>;
export type GetMySettingsSuspenseQueryHookResult = ReturnType<typeof useGetMySettingsSuspenseQuery>;
export type GetMySettingsQueryResult = Apollo.QueryResult<GetMySettingsQuery, GetMySettingsQueryVariables>;