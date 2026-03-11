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

  type Benefit {
    id: String!
    name: String!
    nameEng: String
    category: String!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean!
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
    createdAt: String!
    updatedAt: String!
    viewContractUrl: String
  }

  extend type Query {
    benefits(category: String): [Benefit!]!
    myBenefits(employeeId: String!): [BenefitEligibility!]!
    getEmployeeBenefits(employeeId: String!): [BenefitEligibility!]!
  }

  input RequestBenefitInput {
    employeeId: String!
    benefitId: String!
    contractVersionAccepted: String
    contractAcceptedAt: String
  }

  extend type Mutation {
    requestBenefit(input: RequestBenefitInput!): BenefitRequest!
    confirmBenefitRequest(requestId: String!, contractAccepted: Boolean!): BenefitRequest!
  }
`;
