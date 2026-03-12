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
  # role болон employmentStatus-ийг String болгосон: өгөгдлийн сан дахь бүх утга (Designer, Analyst, on_leave, resigned г.м) front руу гарна
  type Employee {
    id: String!
    email: String!
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

  # Query — session nemeh esehee shiideh: check current user from session
  extend type Query {
    getEmployees: [Employee!]!
    getEmployee(id: String!): Employee
    getEmployeeByEmail(email: String!): Employee
    session(employeeId: String): Employee
  }

  # Mutation
  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(id: String!): Boolean!
  }
`;
