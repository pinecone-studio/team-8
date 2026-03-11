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
};

export type Benefit = {
  __typename?: 'Benefit';
  category: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export enum BenefitEligibilityStatus {
  Active = 'ACTIVE',
  Eligible = 'ELIGIBLE',
  Locked = 'LOCKED',
  Pending = 'PENDING'
}

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
  getEmployees: Array<Employee>;
  myBenefits: Array<BenefitEligibility>;
};


export type QueryBenefitsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEmployeeArgs = {
  id: Scalars['String']['input'];
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

export type CreateEmployeeMutationVariables = Exact<{
  input: CreateEmployeeInput;
}>;


export type CreateEmployeeMutation = { __typename?: 'Mutation', createEmployee: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: EmployeeRole, department: string, responsibilityLevel: number, employmentStatus: EmploymentStatus, hireDate: string, createdAt: string } };

export type UpdateEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
}>;


export type UpdateEmployeeMutation = { __typename?: 'Mutation', updateEmployee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: EmployeeRole, department: string, responsibilityLevel: number, employmentStatus: EmploymentStatus, updatedAt: string } | null };

export type DeleteEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteEmployeeMutation = { __typename?: 'Mutation', deleteEmployee: boolean };

export type GetEmployeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmployeesQuery = { __typename?: 'Query', getEmployees: Array<{ __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: EmployeeRole, department: string, responsibilityLevel: number, employmentStatus: EmploymentStatus, hireDate: string, okrSubmitted: number, lateArrivalCount: number, createdAt: string, updatedAt: string }> };

export type GetEmployeeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetEmployeeQuery = { __typename?: 'Query', getEmployee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: EmployeeRole, department: string, responsibilityLevel: number, employmentStatus: EmploymentStatus, hireDate: string, okrSubmitted: number, lateArrivalCount: number, lateArrivalUpdatedAt?: string | null, createdAt: string, updatedAt: string } | null };


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