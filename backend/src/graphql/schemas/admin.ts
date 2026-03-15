import gql from "graphql-tag";

export const adminTypeDefs = gql`
  type AdminDashboardBucket {
    label: String!
    value: Int!
  }

  type AdminDashboardSummary {
    totalEmployees: Int!
    activeBenefits: Int!
    pendingRequests: Int!
    lockedBenefits: Int!
    usageByCategory: [AdminDashboardBucket!]!
    lockReasons: [AdminDashboardBucket!]!
    hrQueueCount: Int!
    financeQueueCount: Int!
    awaitingContractCount: Int!
    approvedThisWeekCount: Int!
    contractsExpiringSoon: Int!
    benefitsMissingContracts: Int!
    suspendedEnrollments: Int!
  }

  type Notification {
    id: String!
    type: String!
    title: String!
    body: String!
    linkPath: String
    createdAt: String!
    isRead: Boolean!
  }

  type AuditLog {
    id: String!
    actorEmployeeId: String
    actorRole: String!
    actionType: String!
    entityType: String!
    entityId: String!
    targetEmployeeId: String
    benefitId: String
    requestId: String
    contractId: String
    reason: String
    beforeJson: String
    afterJson: String
    metadataJson: String
    ipAddress: String
    createdAt: String!
  }

  type ContractAcceptance {
    id: String!
    employeeId: String!
    benefitId: String!
    contractId: String!
    contractVersion: String!
    contractHash: String!
    acceptedAt: String!
    ipAddress: String
    requestId: String
    createdAt: String!
  }

  type EmployeeBenefitEnrollment {
    id: String!
    employeeId: String!
    benefitId: String!
    requestId: String
    status: String!
    subsidyPercentApplied: Int
    employeePercentApplied: Int
    approvedBy: String
    startedAt: String!
    endedAt: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Mutation {
    markNotificationsRead(keys: [String!]!): Boolean!
  }

  extend type Query {
    adminDashboardSummary: AdminDashboardSummary!
    notifications: [Notification!]!
    auditLogs(
      employeeId: String
      benefitId: String
      actionType: String
      fromDate: String
      toDate: String
      limit: Int
    ): [AuditLog!]!
    contractAcceptances(
      employeeId: String
      benefitId: String
      requestId: String
    ): [ContractAcceptance!]!
    enrollments(employeeId: String, benefitId: String): [EmployeeBenefitEnrollment!]!
  }
`;
