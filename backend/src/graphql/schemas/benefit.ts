import gql from "graphql-tag";

export const benefitTypeDefs = gql`
  enum BenefitEligibilityStatus {
    ACTIVE
    ELIGIBLE
    LOCKED
    PENDING
  }

  type RuleEvaluation {
    ruleType: String!
    passed: Boolean!
    reason: String!
  }

  type FailedRule {
    ruleType: String!
    errorMessage: String!
  }

  enum BenefitFlowType {
    contract
    normal
    down_payment
    self_service
  }

  type Benefit {
    id: String!
    name: String!
    nameEng: String
    category: String!
    subsidyPercent: Int!
    employeePercent: Int!
    unitPrice: Int
    vendorName: String
    requiresContract: Boolean!
    flowType: BenefitFlowType!
    optionsDescription: String
  }

  type BenefitEligibility {
    benefitId: String!
    benefit: Benefit!
    status: BenefitEligibilityStatus!
    ruleEvaluation: [RuleEvaluation!]!
    failedRule: FailedRule
  }

  type BenefitRequest {
    id: String!
    employeeId: String!
    benefitId: String!
    status: String!
    contractVersionAccepted: String
    contractAcceptedAt: String
    reviewedBy: String
    requestedAmount: Int
    repaymentMonths: Int
    employeeApprovedAt: String
    declineReason: String
    createdAt: String!
    updatedAt: String!
    viewContractUrl: String
  }

  type Contract {
    id: String!
    benefitId: String!
    benefitName: String
    vendorName: String!
    version: String!
    effectiveDate: String!
    expiryDate: String!
    isActive: Boolean!
    viewUrl: String
  }

  type EligibilityRule {
    id: String!
    benefitId: String!
    ruleType: String!
    operator: String!
    value: String!
    errorMessage: String!
    priority: Int!
    isActive: Boolean!
  }

  extend type Query {
    benefits(category: String): [Benefit!]!
    adminBenefits: [Benefit!]!
    myBenefits: [BenefitEligibility!]!
    getEmployeeBenefits(employeeId: String!): [BenefitEligibility!]!
    benefitRequests: [BenefitRequest!]!
    allBenefitRequests(status: String): [BenefitRequest!]!
    contracts(benefitId: String): [Contract!]!
    eligibilityRules(benefitId: String!): [EligibilityRule!]!
  }

  input CreateBenefitInput {
    name: String!
    category: String!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
  }

  input RequestBenefitInput {
    benefitId: String!
    contractVersionAccepted: String
    contractAcceptedAt: String
    requestedAmount: Int
    repaymentMonths: Int
  }

  input CreateEligibilityRuleInput {
    benefitId: String!
    ruleType: String!
    operator: String!
    value: String!
    errorMessage: String!
    priority: Int
  }

  input UpdateEligibilityRuleInput {
    ruleType: String
    operator: String
    value: String
    errorMessage: String
    priority: Int
    isActive: Boolean
  }

  extend type Mutation {
    createBenefit(input: CreateBenefitInput!): Benefit!
    deleteBenefit(id: String!): Boolean!
    requestBenefit(input: RequestBenefitInput!): BenefitRequest!
    confirmBenefitRequest(requestId: String!, contractAccepted: Boolean!): BenefitRequest!
    approveBenefitRequest(requestId: String!): BenefitRequest!
    declineBenefitRequest(requestId: String!, reason: String): BenefitRequest!
    cancelBenefitRequest(requestId: String!): BenefitRequest!
    createEligibilityRule(input: CreateEligibilityRuleInput!): EligibilityRule!
    updateEligibilityRule(id: String!, input: UpdateEligibilityRuleInput!): EligibilityRule!
    deleteEligibilityRule(id: String!): Boolean!
  }
`;
