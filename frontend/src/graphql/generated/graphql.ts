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

export type Benefit = {
  __typename?: 'Benefit';
  category: Scalars['String']['output'];
  duration?: Maybe<Scalars['String']['output']>;
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
  benefit?: Maybe<Benefit>;
  benefitId: Scalars['String']['output'];
  contractAcceptedAt?: Maybe<Scalars['String']['output']>;
  contractVersionAccepted?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  declineReason?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<Employee>;
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
  confirmBenefitRequest: BenefitRequest;
  createEmployee: Employee;
  declineBenefitRequest: BenefitRequest;
  deleteEmployee: Scalars['Boolean']['output'];
  requestBenefit: BenefitRequest;
  updateEmployee?: Maybe<Employee>;
};


export type MutationApproveBenefitRequestArgs = {
  requestId: Scalars['String']['input'];
  reviewedBy: Scalars['String']['input'];
};


export type MutationConfirmBenefitRequestArgs = {
  contractAccepted: Scalars['Boolean']['input'];
  requestId: Scalars['String']['input'];
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationDeclineBenefitRequestArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['String']['input'];
  reviewedBy: Scalars['String']['input'];
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
  getBenefitRequest?: Maybe<BenefitRequest>;
  getEmployee?: Maybe<Employee>;
  getEmployeeBenefits: Array<BenefitEligibility>;
<<<<<<< Updated upstream
  getEmployeeByEmail?: Maybe<Employee>;
=======
  getEmployeeRequests: Array<BenefitRequest>;
>>>>>>> Stashed changes
  getEmployees: Array<Employee>;
  myBenefits: Array<BenefitEligibility>;
  pendingBenefitRequests: Array<BenefitRequest>;
  session?: Maybe<Employee>;
};


export type QueryBenefitsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetBenefitRequestArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetEmployeeBenefitsArgs = {
  employeeId: Scalars['String']['input'];
};


<<<<<<< Updated upstream
export type QueryGetEmployeeByEmailArgs = {
  email: Scalars['String']['input'];
=======
export type QueryGetEmployeeRequestsArgs = {
  employeeId: Scalars['String']['input'];
>>>>>>> Stashed changes
};


export type QueryMyBenefitsArgs = {
  employeeId: Scalars['String']['input'];
};


export type QuerySessionArgs = {
  employeeId?: InputMaybe<Scalars['String']['input']>;
};

export type RequestBenefitInput = {
  benefitId: Scalars['String']['input'];
  contractAcceptedAt?: InputMaybe<Scalars['String']['input']>;
  contractVersionAccepted?: InputMaybe<Scalars['String']['input']>;
  employeeId: Scalars['String']['input'];
  repaymentMonths?: InputMaybe<Scalars['Int']['input']>;
  requestedAmount?: InputMaybe<Scalars['Int']['input']>;
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

export type RequestBenefitMutationVariables = Exact<{
  input: RequestBenefitInput;
}>;


export type RequestBenefitMutation = { __typename?: 'Mutation', requestBenefit: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, viewContractUrl?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, createdAt: string, updatedAt: string } };

export type ConfirmBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
  contractAccepted: Scalars['Boolean']['input'];
}>;


export type ConfirmBenefitRequestMutation = { __typename?: 'Mutation', confirmBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, createdAt: string, updatedAt: string } };

export type ApproveBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
  reviewedBy: Scalars['String']['input'];
}>;


export type ApproveBenefitRequestMutation = { __typename?: 'Mutation', approveBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, reviewedBy?: string | null, createdAt: string, updatedAt: string } };

export type DeclineBenefitRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
  reviewedBy: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeclineBenefitRequestMutation = { __typename?: 'Mutation', declineBenefitRequest: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, reviewedBy?: string | null, declineReason?: string | null, createdAt: string, updatedAt: string } };

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

export type MyBenefitsQueryVariables = Exact<{
  employeeId: Scalars['String']['input'];
}>;


export type MyBenefitsQuery = { __typename?: 'Query', myBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null, benefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, duration?: string | null } }> };

export type GetEmployeeBenefitsQueryVariables = Exact<{
  employeeId: Scalars['String']['input'];
}>;


export type GetEmployeeBenefitsQuery = { __typename?: 'Query', getEmployeeBenefits: Array<{ __typename?: 'BenefitEligibility', benefitId: string, status: BenefitEligibilityStatus, ruleEvaluation: Array<{ __typename?: 'RuleEvaluation', ruleType: string, passed: boolean, reason: string }>, failedRule?: { __typename?: 'FailedRule', ruleType: string, errorMessage: string } | null, benefit: { __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, duration?: string | null } }> };

export type GetBenefitRequestQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBenefitRequestQuery = { __typename?: 'Query', getBenefitRequest?: { __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, contractVersionAccepted?: string | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, requestedAmount?: number | null, repaymentMonths?: number | null, employeeApprovedAt?: string | null, declineReason?: string | null, viewContractUrl?: string | null, createdAt: string, updatedAt: string, employee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string, role: EmployeeRole } | null, benefit?: { __typename?: 'Benefit', id: string, name: string, category: string, duration?: string | null, vendorName?: string | null } | null } | null };

export type GetEmployeeRequestsQueryVariables = Exact<{
  employeeId: Scalars['String']['input'];
}>;


export type GetEmployeeRequestsQuery = { __typename?: 'Query', getEmployeeRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, requestedAmount?: number | null, repaymentMonths?: number | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, declineReason?: string | null, viewContractUrl?: string | null, createdAt: string, updatedAt: string, benefit?: { __typename?: 'Benefit', id: string, name: string, category: string, duration?: string | null, vendorName?: string | null } | null }> };

export type PendingBenefitRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingBenefitRequestsQuery = { __typename?: 'Query', pendingBenefitRequests: Array<{ __typename?: 'BenefitRequest', id: string, employeeId: string, benefitId: string, status: string, requestedAmount?: number | null, repaymentMonths?: number | null, contractAcceptedAt?: string | null, reviewedBy?: string | null, declineReason?: string | null, viewContractUrl?: string | null, createdAt: string, updatedAt: string, employee?: { __typename?: 'Employee', id: string, name: string, nameEng?: string | null, email: string } | null, benefit?: { __typename?: 'Benefit', id: string, name: string, category: string, duration?: string | null, vendorName?: string | null } | null }> };

export type BenefitsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type BenefitsQuery = { __typename?: 'Query', benefits: Array<{ __typename?: 'Benefit', id: string, name: string, nameEng?: string | null, category: string, subsidyPercent: number, employeePercent: number, unitPrice?: number | null, vendorName?: string | null, requiresContract: boolean, flowType: BenefitFlowType, optionsDescription?: string | null, duration?: string | null }> };

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
    contractVersionAccepted
    contractAcceptedAt
    viewContractUrl
    requestedAmount
    repaymentMonths
    createdAt
    updatedAt
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
    mutation ApproveBenefitRequest($requestId: String!, $reviewedBy: String!) {
  approveBenefitRequest(requestId: $requestId, reviewedBy: $reviewedBy) {
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
 *      reviewedBy: // value for 'reviewedBy'
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
    mutation DeclineBenefitRequest($requestId: String!, $reviewedBy: String!, $reason: String) {
  declineBenefitRequest(
    requestId: $requestId
    reviewedBy: $reviewedBy
    reason: $reason
  ) {
    id
    employeeId
    benefitId
    status
    reviewedBy
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
 *      reviewedBy: // value for 'reviewedBy'
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
export const MyBenefitsDocument = gql`
    query MyBenefits($employeeId: String!) {
  myBenefits(employeeId: $employeeId) {
    benefitId
    status
    ruleEvaluation {
      ruleType
      passed
      reason
    }
    failedRule {
      ruleType
      errorMessage
    }
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
      duration
    }
  }
}
    `;

/**
 * __useMyBenefitsQuery__
 *
 * To run a query within a React component, call `useMyBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyBenefitsQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *   },
 * });
 */
export function useMyBenefitsQuery(baseOptions: Apollo.QueryHookOptions<MyBenefitsQuery, MyBenefitsQueryVariables> & ({ variables: MyBenefitsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyBenefitsQuery, MyBenefitsQueryVariables>(MyBenefitsDocument, options);
      }
export function useMyBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyBenefitsQuery, MyBenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyBenefitsQuery, MyBenefitsQueryVariables>(MyBenefitsDocument, options);
        }
// @ts-ignore
export function useMyBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyBenefitsQuery, MyBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<MyBenefitsQuery, MyBenefitsQueryVariables>;
export function useMyBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyBenefitsQuery, MyBenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<MyBenefitsQuery | undefined, MyBenefitsQueryVariables>;
export function useMyBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyBenefitsQuery, MyBenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyBenefitsQuery, MyBenefitsQueryVariables>(MyBenefitsDocument, options);
        }
export type MyBenefitsQueryHookResult = ReturnType<typeof useMyBenefitsQuery>;
export type MyBenefitsLazyQueryHookResult = ReturnType<typeof useMyBenefitsLazyQuery>;
export type MyBenefitsSuspenseQueryHookResult = ReturnType<typeof useMyBenefitsSuspenseQuery>;
export type MyBenefitsQueryResult = Apollo.QueryResult<MyBenefitsQuery, MyBenefitsQueryVariables>;
export const GetEmployeeBenefitsDocument = gql`
    query GetEmployeeBenefits($employeeId: String!) {
  getEmployeeBenefits(employeeId: $employeeId) {
    benefitId
    status
    ruleEvaluation {
      ruleType
      passed
      reason
    }
    failedRule {
      ruleType
      errorMessage
    }
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
      duration
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
export const GetBenefitRequestDocument = gql`
    query GetBenefitRequest($id: String!) {
  getBenefitRequest(id: $id) {
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
    viewContractUrl
    createdAt
    updatedAt
    employee {
      id
      name
      nameEng
      email
      role
    }
    benefit {
      id
      name
      category
      duration
      vendorName
    }
  }
}
    `;

/**
 * __useGetBenefitRequestQuery__
 *
 * To run a query within a React component, call `useGetBenefitRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBenefitRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBenefitRequestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBenefitRequestQuery(baseOptions: Apollo.QueryHookOptions<GetBenefitRequestQuery, GetBenefitRequestQueryVariables> & ({ variables: GetBenefitRequestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>(GetBenefitRequestDocument, options);
      }
export function useGetBenefitRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>(GetBenefitRequestDocument, options);
        }
// @ts-ignore
export function useGetBenefitRequestSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>;
export function useGetBenefitRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>): Apollo.UseSuspenseQueryResult<GetBenefitRequestQuery | undefined, GetBenefitRequestQueryVariables>;
export function useGetBenefitRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>(GetBenefitRequestDocument, options);
        }
export type GetBenefitRequestQueryHookResult = ReturnType<typeof useGetBenefitRequestQuery>;
export type GetBenefitRequestLazyQueryHookResult = ReturnType<typeof useGetBenefitRequestLazyQuery>;
export type GetBenefitRequestSuspenseQueryHookResult = ReturnType<typeof useGetBenefitRequestSuspenseQuery>;
export type GetBenefitRequestQueryResult = Apollo.QueryResult<GetBenefitRequestQuery, GetBenefitRequestQueryVariables>;
export const GetEmployeeRequestsDocument = gql`
    query GetEmployeeRequests($employeeId: String!) {
  getEmployeeRequests(employeeId: $employeeId) {
    id
    employeeId
    benefitId
    status
    requestedAmount
    repaymentMonths
    contractAcceptedAt
    reviewedBy
    declineReason
    viewContractUrl
    createdAt
    updatedAt
    benefit {
      id
      name
      category
      duration
      vendorName
    }
  }
}
    `;

/**
 * __useGetEmployeeRequestsQuery__
 *
 * To run a query within a React component, call `useGetEmployeeRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeRequestsQuery({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *   },
 * });
 */
export function useGetEmployeeRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables> & ({ variables: GetEmployeeRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>(GetEmployeeRequestsDocument, options);
      }
export function useGetEmployeeRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>(GetEmployeeRequestsDocument, options);
        }
// @ts-ignore
export function useGetEmployeeRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>;
export function useGetEmployeeRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeRequestsQuery | undefined, GetEmployeeRequestsQueryVariables>;
export function useGetEmployeeRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>(GetEmployeeRequestsDocument, options);
        }
export type GetEmployeeRequestsQueryHookResult = ReturnType<typeof useGetEmployeeRequestsQuery>;
export type GetEmployeeRequestsLazyQueryHookResult = ReturnType<typeof useGetEmployeeRequestsLazyQuery>;
export type GetEmployeeRequestsSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeRequestsSuspenseQuery>;
export type GetEmployeeRequestsQueryResult = Apollo.QueryResult<GetEmployeeRequestsQuery, GetEmployeeRequestsQueryVariables>;
export const PendingBenefitRequestsDocument = gql`
    query PendingBenefitRequests {
  pendingBenefitRequests {
    id
    employeeId
    benefitId
    status
    requestedAmount
    repaymentMonths
    contractAcceptedAt
    reviewedBy
    declineReason
    viewContractUrl
    createdAt
    updatedAt
    employee {
      id
      name
      nameEng
      email
    }
    benefit {
      id
      name
      category
      duration
      vendorName
    }
  }
}
    `;

/**
 * __usePendingBenefitRequestsQuery__
 *
 * To run a query within a React component, call `usePendingBenefitRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePendingBenefitRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePendingBenefitRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePendingBenefitRequestsQuery(baseOptions?: Apollo.QueryHookOptions<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>(PendingBenefitRequestsDocument, options);
      }
export function usePendingBenefitRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>(PendingBenefitRequestsDocument, options);
        }
// @ts-ignore
export function usePendingBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>;
export function usePendingBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<PendingBenefitRequestsQuery | undefined, PendingBenefitRequestsQueryVariables>;
export function usePendingBenefitRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>(PendingBenefitRequestsDocument, options);
        }
export type PendingBenefitRequestsQueryHookResult = ReturnType<typeof usePendingBenefitRequestsQuery>;
export type PendingBenefitRequestsLazyQueryHookResult = ReturnType<typeof usePendingBenefitRequestsLazyQuery>;
export type PendingBenefitRequestsSuspenseQueryHookResult = ReturnType<typeof usePendingBenefitRequestsSuspenseQuery>;
export type PendingBenefitRequestsQueryResult = Apollo.QueryResult<PendingBenefitRequestsQuery, PendingBenefitRequestsQueryVariables>;
export const BenefitsDocument = gql`
    query Benefits($category: String) {
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
    duration
  }
}
    `;

/**
 * __useBenefitsQuery__
 *
 * To run a query within a React component, call `useBenefitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBenefitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBenefitsQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useBenefitsQuery(baseOptions?: Apollo.QueryHookOptions<BenefitsQuery, BenefitsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BenefitsQuery, BenefitsQueryVariables>(BenefitsDocument, options);
      }
export function useBenefitsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BenefitsQuery, BenefitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BenefitsQuery, BenefitsQueryVariables>(BenefitsDocument, options);
        }
// @ts-ignore
export function useBenefitsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BenefitsQuery, BenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<BenefitsQuery, BenefitsQueryVariables>;
export function useBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BenefitsQuery, BenefitsQueryVariables>): Apollo.UseSuspenseQueryResult<BenefitsQuery | undefined, BenefitsQueryVariables>;
export function useBenefitsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BenefitsQuery, BenefitsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BenefitsQuery, BenefitsQueryVariables>(BenefitsDocument, options);
        }
export type BenefitsQueryHookResult = ReturnType<typeof useBenefitsQuery>;
export type BenefitsLazyQueryHookResult = ReturnType<typeof useBenefitsLazyQuery>;
export type BenefitsSuspenseQueryHookResult = ReturnType<typeof useBenefitsSuspenseQuery>;
export type BenefitsQueryResult = Apollo.QueryResult<BenefitsQuery, BenefitsQueryVariables>;
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