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
    screen_time
  }

  type ScreenTimeTier {
    id: String!
    benefitId: String!
    label: String!
    maxDailyMinutes: Int!
    salaryUpliftPercent: Int!
    displayOrder: Int!
  }

  type ScreenTimeProgram {
    benefitId: String!
    screenshotRetentionDays: Int!
    isActive: Boolean!
    tiers: [ScreenTimeTier!]!
  }

  type ScreenTimeSubmission {
    id: String!
    benefitId: String!
    employeeId: String!
    monthKey: String!
    slotDate: String!
    avgDailyMinutes: Int
    confidenceScore: Int
    platform: String
    periodType: String
    extractionStatus: String!
    reviewStatus: String!
    reviewNote: String
    submittedAt: String!
    reviewedAt: String
    fileName: String
    viewUrl: String
  }

  type ScreenTimeMonthlyResult {
    id: String!
    benefitId: String!
    employeeId: String!
    monthKey: String!
    requiredSlotDates: [String!]!
    dueSlotDates: [String!]!
    missingDueSlotDates: [String!]!
    requiredSlotCount: Int!
    submittedSlotCount: Int!
    approvedSlotCount: Int!
    monthlyAvgDailyMinutes: Int
    awardedSalaryUpliftPercent: Int!
    status: String!
    approvedByEmployeeId: String
    approvedAt: String
    decisionNote: String
    submissions: [ScreenTimeSubmission!]!
  }

  type MyScreenTimeMonth {
    benefitId: String!
    benefitStatus: BenefitEligibilityStatus!
    failedRuleMessage: String
    todayLocalDate: String!
    activeSlotDate: String
    isUploadOpenToday: Boolean!
    program: ScreenTimeProgram
    month: ScreenTimeMonthlyResult!
  }

  type AdminScreenTimeMonthRow {
    employeeId: String!
    employeeName: String!
    employeeEmail: String!
    result: ScreenTimeMonthlyResult!
  }

  type AdminScreenTimeMonthBoard {
    benefitId: String!
    monthKey: String!
    slotDates: [String!]!
    program: ScreenTimeProgram
    rows: [AdminScreenTimeMonthRow!]!
  }

  type ScreenTimeLeaderboardRow {
    rank: Int
    employeeId: String!
    employeeName: String!
    employeeEmail: String!
    monthKey: String!
    status: String!
    avgDailyMinutes: Int
    awardedSalaryUpliftPercent: Int!
    approvedSlotCount: Int!
    dueSlotCount: Int!
    requiredSlotCount: Int!
    isProvisional: Boolean!
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
    isActive: Boolean!
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
    employeeContractKey: String
    employeeSignedContract: EmployeeSignedContract
    createdAt: String!
    updatedAt: String!
    viewContractUrl: String
  }

  type EmployeeSignedContract {
    id: String!
    employeeId: String!
    benefitId: String!
    requestId: String
    hrContractId: String
    hrContractVersion: String
    hrContractHash: String
    fileName: String
    mimeType: String
    status: String!
    uploadedAt: String!
    viewUrl: String
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
    myScreenTimeMonth(benefitId: String!, monthKey: String): MyScreenTimeMonth!
    adminScreenTimeMonth(benefitId: String!, monthKey: String): AdminScreenTimeMonthBoard!
    screenTimeLeaderboard(benefitId: String!, monthKey: String): [ScreenTimeLeaderboardRow!]!
  }

  input CreateBenefitInput {
    name: String!
    description: String
    category: String!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
    flowType: BenefitFlowType
    approvalPolicy: String
    flowType: BenefitFlowType
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
    flowType: BenefitFlowType
    isActive: Boolean
    approvalPolicy: String
    flowType: BenefitFlowType
    amount: Int
    location: String
    imageUrl: String
  }

  input ScreenTimeTierInput {
    label: String!
    maxDailyMinutes: Int!
    salaryUpliftPercent: Int!
    displayOrder: Int
  }

  input UpsertScreenTimeProgramInput {
    benefitId: String!
    screenshotRetentionDays: Int
    tiers: [ScreenTimeTierInput!]!
  }

  input RequestBenefitInput {
    benefitId: String!
    requestedAmount: Int
    repaymentMonths: Int
    employeeContractKey: String
    employeeSignedContractId: String
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
    upsertScreenTimeProgram(input: UpsertScreenTimeProgramInput!): ScreenTimeProgram!
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
