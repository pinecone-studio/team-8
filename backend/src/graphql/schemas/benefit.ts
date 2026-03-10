import gql from "graphql-tag";

export const benefitTypeDefs = gql`
  enum BenefitCategory {
    wellness
    equipment_career
    financial_flexibility
  }

  enum BenefitRuleType {
    employment_status
    okr_gate
    attendance_gate
    responsibility_level
    role
    tenure
    contract_acceptance
    manager_approval
    finance_approval
    okr_score
    allocation
  }

  enum BenefitEligibilityStatus {
    eligible
    ineligible
    requires_approval
  }

  enum BenefitRequestStatus {
    pending
    approved
    rejected
  }

  type BenefitRule {
    id: String!
    benefitId: String!
    ruleType: BenefitRuleType!
    conditionJson: String!
    blockingMessage: String
    priority: Int!
    isBlocking: Int!
  }

  type Benefit {
    id: String!
    name: String!
    category: BenefitCategory!
    description: String
    subsidyPercent: Int!
    isCore: Int!
    active: Int!
    createdAt: String!
    updatedAt: String!
    rules: [BenefitRule!]!
  }

  type BenefitEligibility {
    benefit: Benefit!
    status: BenefitEligibilityStatus!
    blockingMessages: [String!]!
  }

  type BenefitRequest {
    id: String!
    benefitId: String!
    employeeId: String!
    requestedUnits: Int!
    status: BenefitRequestStatus!
    statusReason: String
    managerApproved: Int!
    financeApproved: Int!
    createdAt: String!
    updatedAt: String!
  }

  input BenefitInput {
    name: String!
    category: BenefitCategory!
    description: String
    subsidyPercent: Int
    isCore: Int
    active: Int
  }

  input BenefitRuleInput {
    ruleType: BenefitRuleType!
    conditionJson: String!
    blockingMessage: String
    priority: Int
    isBlocking: Int
  }

  input BenefitRequestInput {
    benefitId: String!
    employeeId: String!
    requestedUnits: Int
  }

  input BenefitRequestStatusInput {
    status: BenefitRequestStatus!
    statusReason: String
    managerApproved: Int
    financeApproved: Int
  }

  extend type Query {
    getBenefits: [Benefit!]!
    getBenefit(id: String!): Benefit
    getBenefitEligibility(
      employeeId: String!
      requestedUnits: Int
    ): [BenefitEligibility!]!
    getBenefitRequests(employeeId: String!): [BenefitRequest!]!
  }

  extend type Mutation {
    createBenefit(input: BenefitInput!): Benefit!
    updateBenefit(id: String!, input: BenefitInput!): Benefit
    setBenefitRules(
      benefitId: String!
      rules: [BenefitRuleInput!]!
    ): [BenefitRule!]!
    requestBenefit(input: BenefitRequestInput!): BenefitRequest!
    updateBenefitRequestStatus(
      id: String!
      input: BenefitRequestStatusInput!
    ): BenefitRequest
    acceptBenefitContract(employeeId: String!, vendor: String!): Boolean!
  }
`;
