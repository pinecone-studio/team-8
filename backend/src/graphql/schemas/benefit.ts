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

  extend type Query {
    benefits(category: String): [Benefit!]!
    myBenefits(employeeId: String!): [BenefitEligibility!]!
    getEmployeeBenefits(employeeId: String!): [BenefitEligibility!]!
    benefitRequests(employeeId: String!): [BenefitRequest!]!
    contracts(benefitId: String): [Contract!]!
  }

  input RequestBenefitInput {
    employeeId: String!
    benefitId: String!
    contractVersionAccepted: String
    contractAcceptedAt: String
    requestedAmount: Int
    repaymentMonths: Int
  }

  extend type Mutation {
    requestBenefit(input: RequestBenefitInput!): BenefitRequest!
    confirmBenefitRequest(requestId: String!, contractAccepted: Boolean!): BenefitRequest!
    approveBenefitRequest(requestId: String!, reviewedBy: String!): BenefitRequest!
    declineBenefitRequest(requestId: String!, reviewedBy: String!, reason: String): BenefitRequest!
  }
`;
