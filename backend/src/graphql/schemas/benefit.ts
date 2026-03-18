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
    description: String
    nameEng: String
    category: String!
    subsidyPercent: Int!
    employeePercent: Int!
    unitPrice: Int
    vendorName: String
    requiresContract: Boolean!
    flowType: BenefitFlowType!
    optionsDescription: String
    approvalPolicy: String!
    amount: Int
    location: String
    imageUrl: String
  }

  type BenefitEligibility {
    benefitId: String!
    benefit: Benefit!
    status: BenefitEligibilityStatus!
    ruleEvaluation: [RuleEvaluation!]!
    failedRule: FailedRule
    overrideStatus: String
    overrideBy: String
    overrideReason: String
    overrideExpiresAt: String
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

  type RuleProposal {
    id: String!
    benefitId: String!
    ruleId: String
    changeType: String!
    proposedData: String!
    summary: String!
    status: String!
    proposedByEmployeeId: String!
    reviewedByEmployeeId: String
    proposedAt: String!
    reviewedAt: String
    reason: String
  }

  extend type Query {
    benefits(category: String): [Benefit!]!
    adminBenefits: [Benefit!]!
    myBenefits: [BenefitEligibility!]!
    getEmployeeBenefits(employeeId: String!): [BenefitEligibility!]!
    benefitRequests: [BenefitRequest!]!
    allBenefitRequests(status: String, queue: String): [BenefitRequest!]!
    contracts(benefitId: String): [Contract!]!
    eligibilityRules(benefitId: String!): [EligibilityRule!]!
    ruleProposals(benefitId: String, status: String): [RuleProposal!]!
  }

  input CreateBenefitInput {
    name: String!
    description: String
    category: String!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
    approvalPolicy: String
    amount: Int
    location: String
    imageUrl: String
  }

  input UpdateBenefitInput {
    name: String
    description: String
    category: String
    subsidyPercent: Int
    vendorName: String
    requiresContract: Boolean
    approvalPolicy: String
    amount: Int
    location: String
    imageUrl: String
  }

  input RequestBenefitInput {
    benefitId: String!
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

  input OverrideEligibilityInput {
    employeeId: String!
    benefitId: String!
    overrideStatus: String!
    reason: String!
    expiresAt: String
  }

  input ProposeRuleChangeInput {
    benefitId: String!
    ruleId: String
    changeType: String!
    proposedData: String!
    summary: String!
  }

  extend type Mutation {
    createBenefit(input: CreateBenefitInput!): Benefit!
    updateBenefit(id: String!, input: UpdateBenefitInput!): Benefit!
    deleteBenefit(id: String!): Boolean!
    requestBenefit(input: RequestBenefitInput!): BenefitRequest!
    confirmBenefitRequest(requestId: String!, contractAccepted: Boolean!): BenefitRequest!
    approveBenefitRequest(requestId: String!): BenefitRequest!
    declineBenefitRequest(requestId: String!, reason: String): BenefitRequest!
    cancelBenefitRequest(requestId: String!): BenefitRequest!
    overrideEligibility(input: OverrideEligibilityInput!): BenefitEligibility!
    createEligibilityRule(input: CreateEligibilityRuleInput!): EligibilityRule!
    updateEligibilityRule(id: String!, input: UpdateEligibilityRuleInput!): EligibilityRule!
    deleteEligibilityRule(id: String!): Boolean!
    proposeRuleChange(input: ProposeRuleChangeInput!): RuleProposal!
    approveRuleProposal(id: String!, reason: String): RuleProposal!
    rejectRuleProposal(id: String!, reason: String!): RuleProposal!
  }
`;
