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

export type Benefit = {
  __typename?: 'Benefit';
  category: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nameEng?: Maybe<Scalars['String']['output']>;
  requiresContract: Scalars['Boolean']['output'];
  subsidyPercent: Scalars['Int']['output'];
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  benefitId: Scalars['String']['output'];
  failedRule?: Maybe<FailedRule>;
  ruleEvaluation: Array<RuleEvaluation>;
  status: BenefitEligibilityStatus;
};

export type BenefitEligibilityStatus =
  | 'ACTIVE'
  | 'ELIGIBLE'
  | 'LOCKED'
  | 'PENDING';

export type BenefitRequest = {
  __typename?: 'BenefitRequest';
  benefitId: Scalars['String']['output'];
  contractAcceptedAt?: Maybe<Scalars['String']['output']>;
  contractVersionAccepted?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  reviewedBy?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  viewContractUrl?: Maybe<Scalars['String']['output']>;
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

export type Employee = {
  __typename?: 'Employee';
  benefits: Array<BenefitEligibility>;
  createdAt: Scalars['DateTime']['output'];
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  employmentStatus: EmploymentStatus;
  hireDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lateArrivalCount: Scalars['Int']['output'];
  lateArrivalUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  nameEng?: Maybe<Scalars['String']['output']>;
  okrSubmitted: Scalars['Int']['output'];
  responsibilityLevel: Scalars['Int']['output'];
  role: EmployeeRole;
  updatedAt: Scalars['DateTime']['output'];
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

export type FailedRule = {
  __typename?: 'FailedRule';
  errorMessage: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmBenefitRequest: BenefitRequest;
  createEmployee: Employee;
  deleteEmployee: Scalars['Boolean']['output'];
  requestBenefit: BenefitRequest;
  updateEmployee?: Maybe<Employee>;
};


export type MutationConfirmBenefitRequestArgs = {
  contractAccepted: Scalars['Boolean']['input'];
  requestId: Scalars['String']['input'];
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type MutationRequestBenefitArgs = {
  input: RequestBenefitInput;
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};

export type Query = {
  __typename?: 'Query';
  benefits: Array<Benefit>;
  getEmployee?: Maybe<Employee>;
  getEmployeeBenefits: Array<BenefitEligibility>;
  getEmployeeByEmail?: Maybe<Employee>;
  getEmployees: Array<Employee>;
  myBenefits: Array<BenefitEligibility>;
};


export type QueryBenefitsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
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


export type QueryMyBenefitsArgs = {
  employeeId: Scalars['String']['input'];
};

export type RequestBenefitInput = {
  benefitId: Scalars['String']['input'];
  contractAcceptedAt?: InputMaybe<Scalars['String']['input']>;
  contractVersionAccepted?: InputMaybe<Scalars['String']['input']>;
  employeeId: Scalars['String']['input'];
};

export type RuleEvaluation = {
  __typename?: 'RuleEvaluation';
  passed: Scalars['Boolean']['output'];
  reason: Scalars['String']['output'];
  ruleType: Scalars['String']['output'];
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
  Benefit: ResolverTypeWrapper<Benefit>;
  BenefitEligibility: ResolverTypeWrapper<BenefitEligibility>;
  BenefitEligibilityStatus: BenefitEligibilityStatus;
  BenefitRequest: ResolverTypeWrapper<BenefitRequest>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateEmployeeInput: CreateEmployeeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Employee: ResolverTypeWrapper<EmployeeModel>;
  EmployeeRole: EmployeeRole;
  EmploymentStatus: EmploymentStatus;
  FailedRule: ResolverTypeWrapper<FailedRule>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RequestBenefitInput: RequestBenefitInput;
  RuleEvaluation: ResolverTypeWrapper<RuleEvaluation>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateEmployeeInput: UpdateEmployeeInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Benefit: Benefit;
  BenefitEligibility: BenefitEligibility;
  BenefitRequest: BenefitRequest;
  Boolean: Scalars['Boolean']['output'];
  CreateEmployeeInput: CreateEmployeeInput;
  DateTime: Scalars['DateTime']['output'];
  Employee: EmployeeModel;
  FailedRule: FailedRule;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  RequestBenefitInput: RequestBenefitInput;
  RuleEvaluation: RuleEvaluation;
  String: Scalars['String']['output'];
  UpdateEmployeeInput: UpdateEmployeeInput;
}>;

export type BenefitResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Benefit'] = ResolversParentTypes['Benefit']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requiresContract?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subsidyPercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  vendorName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitEligibilityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitEligibility'] = ResolversParentTypes['BenefitEligibility']> = ResolversObject<{
  benefit?: Resolver<ResolversTypes['Benefit'], ParentType, ContextType>;
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  failedRule?: Resolver<Maybe<ResolversTypes['FailedRule']>, ParentType, ContextType>;
  ruleEvaluation?: Resolver<Array<ResolversTypes['RuleEvaluation']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BenefitEligibilityStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BenefitRequestResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BenefitRequest'] = ResolversParentTypes['BenefitRequest']> = ResolversObject<{
  benefitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractAcceptedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contractVersionAccepted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewContractUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EmployeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = ResolversObject<{
  benefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentStatus?: Resolver<ResolversTypes['EmploymentStatus'], ParentType, ContextType>;
  hireDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lateArrivalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lateArrivalUpdatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  okrSubmitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  responsibilityLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['EmployeeRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FailedRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FailedRule'] = ResolversParentTypes['FailedRule']> = ResolversObject<{
  errorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  confirmBenefitRequest?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationConfirmBenefitRequestArgs, 'contractAccepted' | 'requestId'>>;
  createEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationCreateEmployeeArgs, 'input'>>;
  deleteEmployee?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEmployeeArgs, 'id'>>;
  requestBenefit?: Resolver<ResolversTypes['BenefitRequest'], ParentType, ContextType, RequireFields<MutationRequestBenefitArgs, 'input'>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  benefits?: Resolver<Array<ResolversTypes['Benefit']>, ParentType, ContextType, Partial<QueryBenefitsArgs>>;
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'id'>>;
  getEmployeeBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType, RequireFields<QueryGetEmployeeBenefitsArgs, 'employeeId'>>;
  getEmployeeByEmail?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeByEmailArgs, 'email'>>;
  getEmployees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  myBenefits?: Resolver<Array<ResolversTypes['BenefitEligibility']>, ParentType, ContextType, RequireFields<QueryMyBenefitsArgs, 'employeeId'>>;
}>;

export type RuleEvaluationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RuleEvaluation'] = ResolversParentTypes['RuleEvaluation']> = ResolversObject<{
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Benefit?: BenefitResolvers<ContextType>;
  BenefitEligibility?: BenefitEligibilityResolvers<ContextType>;
  BenefitRequest?: BenefitRequestResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Employee?: EmployeeResolvers<ContextType>;
  FailedRule?: FailedRuleResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RuleEvaluation?: RuleEvaluationResolvers<ContextType>;
}>;

