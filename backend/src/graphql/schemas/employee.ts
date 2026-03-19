import gql from "graphql-tag";

export const employeeTypeDefs = gql`
  enum EmployeeRole {
    teacher
    engineer
    ux_engineer
    manager
  }

  enum EmploymentStatus {
    active
    probation
    leave
    terminated
  }

  type Employee {
    id: String!
    email: String!
    avatarUrl: String
    name: String!
    nameEng: String
    role: String!
    department: String!
    responsibilityLevel: Int!
    employmentStatus: String!
    hireDate: DateTime!
    okrSubmitted: Int!
    lateArrivalCount: Int!
    lateArrivalUpdatedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    benefits: [BenefitEligibility!]!
  }

  input CreateEmployeeInput {
    email: String!
    name: String!
    nameEng: String
    role: EmployeeRole!
    department: String!
    responsibilityLevel: Int
    employmentStatus: EmploymentStatus
    hireDate: String!
  }

  input UpdateEmployeeInput {
    email: String
    name: String
    nameEng: String
    role: EmployeeRole
    department: String
    responsibilityLevel: Int
    employmentStatus: EmploymentStatus
    okrSubmitted: Int
    lateArrivalCount: Int
    lateArrivalUpdatedAt: String
  }

  type EmployeeSettings {
    notificationEmail: Boolean!
    notificationEligibility: Boolean!
    notificationRenewals: Boolean!
    language: String!
    timezone: String!
  }

  input UpdateMySettingsInput {
    notificationEmail: Boolean
    notificationEligibility: Boolean
    notificationRenewals: Boolean
    language: String
    timezone: String
  }

  extend type Query {
    getEmployees(search: String, department: String, limit: Int): [Employee!]!
    getDepartments: [String!]!
    getEmployee(id: String!): Employee
    getEmployeeByEmail(email: String!): Employee
    session: Employee
    mySettings: EmployeeSettings!
  }

  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(id: String!): Boolean!
    updateMySettings(input: UpdateMySettingsInput!): EmployeeSettings!
  }
`;
