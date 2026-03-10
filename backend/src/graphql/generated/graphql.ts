import { GraphQLResolveInfo } from 'graphql';
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
  createEmployee: Employee;
  deleteEmployee: Scalars['Boolean']['output'];
  updateEmployee?: Maybe<Employee>;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};

export type Query = {
  __typename?: 'Query';
  getEmployee?: Maybe<Employee>;
  getEmployees: Array<Employee>;
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
  Boolean: Scalars['Boolean']['output'];
  CreateEmployeeInput: CreateEmployeeInput;
  Employee: EmployeeModel;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  UpdateEmployeeInput: UpdateEmployeeInput;
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
  okrSubmitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  responsibilityLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['EmployeeRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationCreateEmployeeArgs, 'input'>>;
  deleteEmployee?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEmployeeArgs, 'id'>>;
  updateEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getEmployee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryGetEmployeeArgs, 'id'>>;
  getEmployees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Employee?: EmployeeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

