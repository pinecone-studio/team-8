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
  }

  extend type Query {
    adminDashboardSummary: AdminDashboardSummary!
  }
`;
