import gql from "graphql-tag";

export const employeeTypeDefs = gql`
  # enum
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

  # type (hireDate, createdAt, updatedAt = ISO 8601 via DateTime)
  type Employee {
    id: String!
    email: String!
    name: String!
    nameEng: String
    role: EmployeeRole!
    department: String!
    responsibilityLevel: Int!
    employmentStatus: EmploymentStatus!
    hireDate: DateTime!
    okrSubmitted: Int!
    lateArrivalCount: Int!
    lateArrivalUpdatedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    benefits: [BenefitEligibility!]!
  }

  # input
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

  # Query
  extend type Query {
    getEmployees: [Employee!]!
    getEmployee(id: String!): Employee
    getEmployeeByEmail(email: String!): Employee
  }

  # Mutation
  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(id: String!): Boolean!
  }
`;
