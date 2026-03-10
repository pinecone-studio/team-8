import { GraphQLResolveInfo } from 'graphql';
import { Employee as EmployeeModel, Benefit as BenefitModel, BenefitRule as BenefitRuleModel, BenefitRequest as BenefitRequestModel } from '../../db/schema';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Benefit = {
  __typename?: 'Benefit';
  active: Scalars['Int']['output'];
  category: BenefitCategory;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isCore: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rules: Array<BenefitRule>;
  subsidyPercent: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type BenefitCategory =
  | 'equipment_career'
  | 'financial_flexibility'
  | 'wellness';

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  blockingMessages: Array<Scalars['String']['output']>;
  status: BenefitEligibilityStatus;
};

export type BenefitEligibilityStatus =
  | 'eligible'
  | 'ineligible'
  | 'requires_approval';

export type BenefitInput = {
  active?: InputMaybe<Scalars['Int']['input']>;
  category: BenefitCategory;
  description?: InputMaybe<Scalars['String']['input']>;
  isCore?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  subsidyPercent?: InputMaybe<Scalars['Int']['input']>;
};

export type BenefitRequest = {
  __typename?: 'BenefitRequest';
  benefitId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  financeApproved: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  managerApproved: Scalars['Int']['output'];
  requestedUnits: Scalars['Int']['output'];
  status: BenefitRequestStatus;
  statusReason?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type BenefitRequestInput = {
  benefitId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
  requestedUnits?: InputMaybe<Scalars['Int']['input']>;
};

export type BenefitRequestStatus =
  | 'approved'
  | 'pending'
  | 'rejected';

export type BenefitRequestStatusInput = {
  financeApproved?: InputMaybe<Scalars['Int']['input']>;
  managerApproved?: InputMaybe<Scalars['Int']['input']>;
  status: BenefitRequestStatus;
  statusReason?: InputMaybe<Scalars['String']['input']>;
};

export type BenefitRule = {
  __typename?: 'BenefitRule';
  benefitId: Scalars['String']['output'];
  blockingMessage?: Maybe<Scalars['String']['output']>;
  conditionJson: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isBlocking: Scalars['Int']['output'];
  priority: Scalars['Int']['output'];
  ruleType: BenefitRuleType;
};

export type BenefitRuleInput = {
  blockingMessage?: InputMaybe<Scalars['String']['input']>;
  conditionJson: Scalars['String']['input'];
  isBlocking?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleType: BenefitRuleType;
};

export type BenefitRuleType =
  | 'allocation'
  | 'attendance_gate'
  | 'contract_acceptance'
  | 'employment_status'
  | 'finance_approval'
  | 'manager_approval'
  | 'okr_gate'
  | 'okr_score'
  | 'responsibility_level'
  | 'role'
  | 'tenure';

export type CreateEmployeeInput = {
  department: Scalars['String']['input'];
  email: Scalars['String']['input'];
  employmentStatus?: InputMaybe<EmploymentStatus>;
  hireDate: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameEng?: InputMaybe<Scalars['String']['input']>;
  okrScore?: InputMaybe<Scalars['Int']['input']>;
  responsibilityLevel?: InputMaybe<Scalars['Int']['input']>;
  role: EmployeeRole;
};

export type Employee = {
  __typename?: 'Employee';
  createdAt: Scalars['String']['output'];
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  employmentStatus: EmploymentStatus;
  hireDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lateArrivalCount: Scalars['Int']['output'];
  lateArrivalUpdatedAt?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nameEng?: Maybe<Scalars['String']['output']>;
  okrScore: Scalars['Int']['output'];
  okrSubmitted: Scalars['Int']['output'];
  responsibilityLevel: Scalars['Int']['output'];
  role: EmployeeRole;
  updatedAt: Scalars['String']['output'];
};

export type EmployeeRole =
  | 'engineer'
  | 'manager'
  | 'teacher'
  | 'ux_engineer';

export type EmploymentStatus =
  | 'active'
  | 'leave'
  | 'probation'
  | 'terminated';

export type Mutation = {
  __typename?: 'Mutation';
  acceptBenefitContract: Scalars['Boolean']['output'];
  createBenefit: Benefit;
  createEmployee: Employee;
  deleteEmployee: Scalars['Boolean']['output'];
  requestBenefit: BenefitRequest;
  setBenefitRules: Array<BenefitRule>;
  updateBenefit?: Maybe<Benefit>;
  updateBenefitRequestStatus?: Maybe<BenefitRequest>;
  updateEmployee?: Maybe<Employee>;
};


export type MutationAcceptBenefitContractArgs = {
  employeeId: Scalars['String']['input'];
  vendor: Scalars['String']['input'];
};


export type MutationCreateBenefitArgs = {
  input: BenefitInput;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type MutationRequestBenefitArgs = {
  input: BenefitRequestInput;
};


export type MutationSetBenefitRulesArgs = {
  benefitId: Scalars['String']['input'];
  rules: Array<BenefitRuleInput>;
};


export type MutationUpdateBenefitArgs = {
  id: Scalars['String']['input'];
  input: BenefitInput;
};


export type MutationUpdateBenefitRequestStatusArgs = {
  id: Scalars['String']['input'];
  input: BenefitRequestStatusInput;
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};

export type Query = {
  __typename?: 'Query';
  getBenefit?: Maybe<Benefit>;
  getBenefitEligibility: Array<BenefitEligibility>;
  getBenefitRequests: Array<BenefitRequest>;
  getBenefits: Array<Benefit>;
  getEmployee?: Maybe<Employee>;
  getEmployees: Array<Employee>;
};


export type QueryGetBenefitArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetBenefitEligibilityArgs = {
  employeeId: Scalars['String']['input'];
  requestedUnits?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetBenefitRequestsArgs = {
  employeeId: Scalars['String']['input'];
};


export type QueryGetEmployeeArgs = {
  id: Scalars['String']['input'];
};

export type UpdateEmployeeInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employmentStatus?: InputMaybe<EmploymentStatus>;
  lateArrivalCount?: InputMaybe<Scalars['Int']['input']>;
  lateArrivalUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameEng?: InputMaybe<Scalars['String']['input']>;
  okrScore?: InputMaybe<Scalars['Int']['input']>;
  okrSubmitted?: InputMaybe<Scalars['Int']['input']>;
  responsibilityLevel?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<EmployeeRole>;
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
  Benefit: ResolverTypeWrapper<BenefitModel>;
  BenefitCategory: BenefitCategory;
  BenefitEligibility: ResolverTypeWrapper<Omit<BenefitEligibility, 'benefit'> & { benefit: ResolversTypes['Benefit'] }>;
  BenefitEligibilityStatus: BenefitEligibilityStatus;
  BenefitInput: BenefitInput;
  BenefitRequest: ResolverTypeWrapper<BenefitRequestModel>;
  BenefitRequestInput: BenefitRequestInput;
  BenefitRequestStatus: BenefitRequestStatus;
  BenefitRequestStatusInput: BenefitRequestStatusInput;
  BenefitRule: ResolverTypeWrapper<BenefitRuleModel>;
  BenefitRuleInput: BenefitRuleInput;
  BenefitRuleType: BenefitRuleType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateEmployeeInput: CreateEmployeeInput;
  Employee: ResolverTypeWrapper<EmployeeModel>;
  EmployeeRole: EmployeeRole;
  EmploymentStatus: EmploymentStatus;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateEmployeeInput: UpdateEmployeeInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Benefit: BenefitModel;
  BenefitEligibility: Omit<BenefitEligibility, 'benefit'> & { benefit: ResolversParentTypes['Benefit'] };
  BenefitInput: BenefitInput;
  BenefitRequest: BenefitRequestModel;
  BenefitRequestInput: BenefitRequestInput;
  BenefitRequestStatusInput: BenefitRequestStatusInput;
  BenefitRule: BenefitRuleModel;
  BenefitRuleInput: BenefitRuleInput;
  Boolean: Scalars['Boolean']['output'];
  CreateEmployeeInput: CreateEmployeeInput;
  Employee: EmployeeModel;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  UpdateEmployeeInput: UpdateEmployeeInput;
}>;

export type BenefitResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Benefit'] = ResolversParentTypes['Benefit']> = ResolversObject<{
  active?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['BenefitCategory'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isCore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rules?: Resolver<Array<ResolversTypes['BenefitRule']>, ParentType, ContextType>;
  subsidyPercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitEligibilityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitEligibility'] = ResolversParentTypes['BenefitEligibility']> = ResolversObject<{
  benefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType>;
  blockingMessages?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitEligibilityStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitRequestResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitRequest'] = ResolversParentTypes['BenefitRequest']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  financeApproved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  managerApproved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requestedUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitRequestStatus'], ParentType, ContextType>;
  statusReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitRule'] = ResolversParentTypes['BenefitRule']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockingMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditionJson?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isBlocking?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['BenefitRuleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentStatus?: Resolver<ResolversTypes['EmploymentStatus'], ParentType, ContextType>;
  hireDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lateArrivalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lateArrivalUpdatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  okrScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  okrSubmitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  responsibilityLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['EmployeeRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  acceptBenefitContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAcceptBenefitContractArgs, 'employeeId' | 'vendor'>>;
  createBenefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType, RequireFields<MutationCreateBenefitArgs, 'input'>>;
  createEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationCreateEmployeeArgs, 'input'>>;
  deleteEmployee?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEmployeeArgs, 'id'>>;
  requestBenefit?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationRequestBenefitArgs, 'input'>>;
  setBenefitRules?: Resolver<Array<ResolversTypes['BenefitRule']>, ParentType, ContextType, RequireFields<MutationSetBenefitRulesArgs, 'benefitId' | 'rules'>>;
  updateBenefit?: Resolver<Maybe<ResolversTypes['Benefit']>, ParentType, ContextType, RequireFields<MutationUpdateBenefitArgs, 'id' | 'input'>>;
  updateBenefitRequestStatus?: Resolver<Maybe<ResolversTypes['BenefitRequest']>, ParentType, ContextType, RequireFields<MutationUpdateBenefitRequestStatusArgs, 'id' | 'input'>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getBenefit?: Resolver<Maybe<ResolversTypes['Benefit']>, ParentType, ContextType, RequireFields<QueryGetBenefitArgs, 'id'>>;
  getBenefitEligibility?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType, RequireFields<QueryGetBenefitEligibilityArgs, 'employeeId'>>;
  getBenefitRequests?: Resolver<Array<ResolversTypes['BenefitRequest']>, ParentType, ContextType, RequireFields<QueryGetBenefitRequestsArgs, 'employeeId'>>;
  getBenefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType>;
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'id'>>;
  getEmployees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Benefit?: BenefitResolvers<ContextType>;
  BenefitEligibility?: BenefitEligibilityResolvers<ContextType>;
  BenefitRequest?: BenefitRequestResolvers<ContextType>;
  BenefitRule?: BenefitRuleResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

