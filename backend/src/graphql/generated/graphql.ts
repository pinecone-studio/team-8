import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Employee as EmployeeModel } from '../../db/schema';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type BenefitEligibilityStatus =
  | 'ACTIVE'
  | 'ELIGIBLE'
  | 'LOCKED'
  | 'PENDING';

export type BenefitFlowType =
  | 'contract'
  | 'down_payment'
  | 'normal'
  | 'self_service';

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
  amount?: InputMaybe<Scalars['Int']['input']>;
  approvalPolicy?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
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

export type EmployeeRole =
  | 'engineer'
  | 'manager'
  | 'teacher'
  | 'ux_engineer';

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

export type EmploymentStatus =
  | 'active'
  | 'leave'
  | 'probation'
  | 'terminated';

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
  syncOkrStatus: OkrSyncResult;
  updateBenefit: Benefit;
  updateEligibilityRule: EligibilityRule;
  updateEmployee?: Maybe<Employee>;
  updateMySettings: EmployeeSettings;
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
  mySettings: EmployeeSettings;
  notifications: Array<Notification>;
  ruleProposals: Array<RuleProposal>;
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


export type QueryGetEmployeesArgs = {
  department?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRuleProposalsArgs = {
  benefitId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateBenefitInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  approvalPolicy?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AdminDashboardBucket: ResolverTypeWrapper<AdminDashboardBucket>;
  AdminDashboardSummary: ResolverTypeWrapper<AdminDashboardSummary>;
  AttendanceImportError: ResolverTypeWrapper<AttendanceImportError>;
  AttendanceImportResult: ResolverTypeWrapper<AttendanceImportResult>;
  AttendanceRowInput: AttendanceRowInput;
  AuditLog: ResolverTypeWrapper<AuditLog>;
  Benefit: ResolverTypeWrapper<Benefit>;
  BenefitEligibility: ResolverTypeWrapper<BenefitEligibility>;
  BenefitEligibilityStatus: BenefitEligibilityStatus;
  BenefitFlowType: BenefitFlowType;
  BenefitRequest: ResolverTypeWrapper<BenefitRequest>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contract: ResolverTypeWrapper<Contract>;
  ContractAcceptance: ResolverTypeWrapper<ContractAcceptance>;
  CreateBenefitInput: CreateBenefitInput;
  CreateEligibilityRuleInput: CreateEligibilityRuleInput;
  CreateEmployeeInput: CreateEmployeeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  EligibilityRule: ResolverTypeWrapper<EligibilityRule>;
  Employee: ResolverTypeWrapper<EmployeeModel>;
  EmployeeBenefitEnrollment: ResolverTypeWrapper<EmployeeBenefitEnrollment>;
  EmployeeRole: EmployeeRole;
  EmployeeSettings: ResolverTypeWrapper<EmployeeSettings>;
  EmployeeSignedContract: ResolverTypeWrapper<EmployeeSignedContract>;
  EmploymentStatus: EmploymentStatus;
  FailedRule: ResolverTypeWrapper<FailedRule>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<Notification>;
  OkrSyncError: ResolverTypeWrapper<OkrSyncError>;
  OkrSyncResult: ResolverTypeWrapper<OkrSyncResult>;
  OkrSyncRowInput: OkrSyncRowInput;
  OverrideEligibilityInput: OverrideEligibilityInput;
  ProposeRuleChangeInput: ProposeRuleChangeInput;
  Query: ResolverTypeWrapper<{}>;
  RequestBenefitInput: RequestBenefitInput;
  RuleEvaluation: ResolverTypeWrapper<RuleEvaluation>;
  RuleProposal: ResolverTypeWrapper<RuleProposal>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateBenefitInput: UpdateBenefitInput;
  UpdateEligibilityRuleInput: UpdateEligibilityRuleInput;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateMySettingsInput: UpdateMySettingsInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AdminDashboardBucket: AdminDashboardBucket;
  AdminDashboardSummary: AdminDashboardSummary;
  AttendanceImportError: AttendanceImportError;
  AttendanceImportResult: AttendanceImportResult;
  AttendanceRowInput: AttendanceRowInput;
  AuditLog: AuditLog;
  Benefit: Benefit;
  BenefitEligibility: BenefitEligibility;
  BenefitRequest: BenefitRequest;
  Boolean: Scalars['Boolean']['output'];
  Contract: Contract;
  ContractAcceptance: ContractAcceptance;
  CreateBenefitInput: CreateBenefitInput;
  CreateEligibilityRuleInput: CreateEligibilityRuleInput;
  CreateEmployeeInput: CreateEmployeeInput;
  DateTime: Scalars['DateTime']['output'];
  EligibilityRule: EligibilityRule;
  Employee: EmployeeModel;
  EmployeeBenefitEnrollment: EmployeeBenefitEnrollment;
  EmployeeSettings: EmployeeSettings;
  EmployeeSignedContract: EmployeeSignedContract;
  FailedRule: FailedRule;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Notification: Notification;
  OkrSyncError: OkrSyncError;
  OkrSyncResult: OkrSyncResult;
  OkrSyncRowInput: OkrSyncRowInput;
  OverrideEligibilityInput: OverrideEligibilityInput;
  ProposeRuleChangeInput: ProposeRuleChangeInput;
  Query: {};
  RequestBenefitInput: RequestBenefitInput;
  RuleEvaluation: RuleEvaluation;
  RuleProposal: RuleProposal;
  String: Scalars['String']['output'];
  UpdateBenefitInput: UpdateBenefitInput;
  UpdateEligibilityRuleInput: UpdateEligibilityRuleInput;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateMySettingsInput: UpdateMySettingsInput;
}>;

export type AdminDashboardBucketResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboardBucket'] = ResolversParentTypes['AdminDashboardBucket']> = ResolversObject<{
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdminDashboardSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboardSummary'] = ResolversParentTypes['AdminDashboardSummary']> = ResolversObject<{
  activeBenefits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  approvedThisWeekCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  awaitingContractCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  benefitsMissingContracts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractsExpiringSoon?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  financeQueueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hrQueueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lockReasons?: Resolver<Array<ResolversTypes['AdminDashboardBucket']>, ParentType, ContextType>;
  lockedBenefits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pendingRequests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  suspendedEnrollments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  usageByCategory?: Resolver<Array<ResolversTypes['AdminDashboardBucket']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AttendanceImportErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AttendanceImportError'] = ResolversParentTypes['AttendanceImportError']> = ResolversObject<{
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  row?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AttendanceImportResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AttendanceImportResult'] = ResolversParentTypes['AttendanceImportResult']> = ResolversObject<{
  errors?: Resolver<Array<ResolversTypes['AttendanceImportError']>, ParentType, ContextType>;
  invalid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuditLogResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLog'] = ResolversParentTypes['AuditLog']> = ResolversObject<{
  actionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actorEmployeeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actorRole?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  afterJson?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  beforeJson?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  benefitId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ipAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadataJson?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targetEmployeeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Benefit'] = ResolversParentTypes['Benefit']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  approvalPolicy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeePercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flowType?: Resolver<ResolversTypes['BenefitFlowType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  optionsDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subsidyPercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  vendorName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitEligibilityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitEligibility'] = ResolversParentTypes['BenefitEligibility']> = ResolversObject<{
  benefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType>;
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  failedRule?: Resolver<Maybe<ResolversTypes['FailedRule']>, ParentType, ContextType>;
  overrideBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overrideExpiresAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overrideReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overrideStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleEvaluation?: Resolver<Array<ResolversTypes['RuleEvaluation']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitEligibilityStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitRequestResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitRequest'] = ResolversParentTypes['BenefitRequest']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractAcceptedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractVersionAccepted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  declineReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeeApprovedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeeContractKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeSignedContract?: Resolver<Maybe<ResolversTypes['EmployeeSignedContract']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repaymentMonths?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requestedAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reviewedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewContractUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Contract'] = ResolversParentTypes['Contract']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  benefitName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  vendorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContractAcceptanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ContractAcceptance'] = ResolversParentTypes['ContractAcceptance']> = ResolversObject<{
  acceptedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ipAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EligibilityRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EligibilityRule'] = ResolversParentTypes['EligibilityRule']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  operator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = ResolversObject<{
  benefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hireDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lateArrivalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lateArrivalUpdatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  okrSubmitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  responsibilityLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeBenefitEnrollmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeBenefitEnrollment'] = ResolversParentTypes['EmployeeBenefitEnrollment']> = ResolversObject<{
  approvedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeePercentApplied?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subsidyPercentApplied?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeSettings'] = ResolversParentTypes['EmployeeSettings']> = ResolversObject<{
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notificationEligibility?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notificationEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notificationRenewals?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeSignedContractResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeSignedContract'] = ResolversParentTypes['EmployeeSignedContract']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hrContractHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hrContractId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hrContractVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FailedRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FailedRule'] = ResolversParentTypes['FailedRule']> = ResolversObject<{
  errorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  approveBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationApproveBenefitRequestArgs, 'requestId'>>;
  approveRuleProposal?: Resolver<ResolversTypes['RuleProposal'], ParentType, ContextType, RequireFields<MutationApproveRuleProposalArgs, 'id'>>;
  cancelBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationCancelBenefitRequestArgs, 'requestId'>>;
  confirmBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationConfirmBenefitRequestArgs, 'contractAccepted' | 'requestId'>>;
  createBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationCreateBenefitArgs, 'input'>>;
  createEligibilityRule?: Resolver<ResolversTypes['EligibilityRule'], ParentType, ContextType, RequireFields<MutationCreateEligibilityRuleArgs, 'input'>>;
  createEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationCreateEmployeeArgs, 'input'>>;
  declineBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationDeclineBenefitRequestArgs, 'requestId'>>;
  deleteBenefit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBenefitArgs, 'id'>>;
  deleteEligibilityRule?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEligibilityRuleArgs, 'id'>>;
  deleteEmployee?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEmployeeArgs, 'id'>>;
  importAttendance?: Resolver<ResolversTypes['AttendanceImportResult'], ParentType, ContextType, RequireFields<MutationImportAttendanceArgs, 'rows'>>;
  markNotificationsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkNotificationsReadArgs, 'keys'>>;
  overrideEligibility?: Resolver<ResolversTypes['BenefitEligibility'], ParentType, ContextType, RequireFields<MutationOverrideEligibilityArgs, 'input'>>;
  proposeRuleChange?: Resolver<ResolversTypes['RuleProposal'], ParentType, ContextType, RequireFields<MutationProposeRuleChangeArgs, 'input'>>;
  rejectRuleProposal?: Resolver<ResolversTypes['RuleProposal'], ParentType, ContextType, RequireFields<MutationRejectRuleProposalArgs, 'id' | 'reason'>>;
  requestBenefit?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationRequestBenefitArgs, 'input'>>;
  syncOkrStatus?: Resolver<ResolversTypes['OkrSyncResult'], ParentType, ContextType, RequireFields<MutationSyncOkrStatusArgs, 'rows'>>;
  updateBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationUpdateBenefitArgs, 'id' | 'input'>>;
  updateEligibilityRule?: Resolver<ResolversTypes['EligibilityRule'], ParentType, ContextType, RequireFields<MutationUpdateEligibilityRuleArgs, 'id' | 'input'>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'id' | 'input'>>;
  updateMySettings?: Resolver<ResolversTypes['EmployeeSettings'], ParentType, ContextType, RequireFields<MutationUpdateMySettingsArgs, 'input'>>;
}>;

export type NotificationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  linkPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OkrSyncErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OkrSyncError'] = ResolversParentTypes['OkrSyncError']> = ResolversObject<{
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  row?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OkrSyncResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OkrSyncResult'] = ResolversParentTypes['OkrSyncResult']> = ResolversObject<{
  errors?: Resolver<Array<ResolversTypes['OkrSyncError']>, ParentType, ContextType>;
  invalid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  adminBenefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType>;
  adminDashboardSummary?: Resolver<ResolversTypes['AdminDashboardSummary'], ParentType, ContextType>;
  allBenefitRequests?: Resolver<Array<ResolversTypes['BenefitRequest']>, ParentType, ContextType, Partial<QueryAllBenefitRequestsArgs>>;
  auditLogActionTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  auditLogs?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, Partial<QueryAuditLogsArgs>>;
  benefitRequests?: Resolver<Array<ResolversTypes['BenefitRequest']>, ParentType, ContextType>;
  benefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType, Partial<QueryBenefitsArgs>>;
  contractAcceptances?: Resolver<Array<ResolversTypes['ContractAcceptance']>, ParentType, ContextType, Partial<QueryContractAcceptancesArgs>>;
  contracts?: Resolver<Array<ResolversTypes['Contract']>, ParentType, ContextType, Partial<QueryContractsArgs>>;
  eligibilityRules?: Resolver<Array<ResolversTypes['EligibilityRule']>, ParentType, ContextType, RequireFields<QueryEligibilityRulesArgs, 'benefitId'>>;
  enrollments?: Resolver<Array<ResolversTypes['EmployeeBenefitEnrollment']>, ParentType, ContextType, Partial<QueryEnrollmentsArgs>>;
  getDepartments?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'id'>>;
  getEmployeeBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType, RequireFields<QueryGetEmployeeBenefitsArgs, 'employeeId'>>;
  getEmployeeByEmail?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeByEmailArgs, 'email'>>;
  getEmployees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType, Partial<QueryGetEmployeesArgs>>;
  myBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
  mySettings?: Resolver<ResolversTypes['EmployeeSettings'], ParentType, ContextType>;
  notifications?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  ruleProposals?: Resolver<Array<ResolversTypes['RuleProposal']>, ParentType, ContextType, Partial<QueryRuleProposalsArgs>>;
  session?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
}>;

export type RuleEvaluationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RuleEvaluation'] = ResolversParentTypes['RuleEvaluation']> = ResolversObject<{
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RuleProposalResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RuleProposal'] = ResolversParentTypes['RuleProposal']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposedByEmployeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposedData?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewedByEmployeeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AdminDashboardBucket?: AdminDashboardBucketResolvers<ContextType>;
  AdminDashboardSummary?: AdminDashboardSummaryResolvers<ContextType>;
  AttendanceImportError?: AttendanceImportErrorResolvers<ContextType>;
  AttendanceImportResult?: AttendanceImportResultResolvers<ContextType>;
  AuditLog?: AuditLogResolvers<ContextType>;
  Benefit?: BenefitResolvers<ContextType>;
  BenefitEligibility?: BenefitEligibilityResolvers<ContextType>;
  BenefitRequest?: BenefitRequestResolvers<ContextType>;
  Contract?: ContractResolvers<ContextType>;
  ContractAcceptance?: ContractAcceptanceResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  EligibilityRule?: EligibilityRuleResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  EmployeeBenefitEnrollment?: EmployeeBenefitEnrollmentResolvers<ContextType>;
  EmployeeSettings?: EmployeeSettingsResolvers<ContextType>;
  EmployeeSignedContract?: EmployeeSignedContractResolvers<ContextType>;
  FailedRule?: FailedRuleResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  OkrSyncError?: OkrSyncErrorResolvers<ContextType>;
  OkrSyncResult?: OkrSyncResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RuleEvaluation?: RuleEvaluationResolvers<ContextType>;
  RuleProposal?: RuleProposalResolvers<ContextType>;
}>;

