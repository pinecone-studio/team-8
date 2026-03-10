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

  # type
  type Employee {
    id: String!
    email: String!
    name: String!
    nameEng: String
    role: EmployeeRole!
    department: String!
    responsibilityLevel: Int!
    employmentStatus: EmploymentStatus!
    hireDate: String!
    okrSubmitted: Int!
    okrScore: Int!
    lateArrivalCount: Int!
    lateArrivalUpdatedAt: String
    createdAt: String!
    updatedAt: String!
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
    okrScore: Int
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
    okrScore: Int
    lateArrivalCount: Int
    lateArrivalUpdatedAt: String
  }

  # Query
  extend type Query {
    getEmployees: [Employee!]!
    getEmployee(id: String!): Employee
  }

  # Mutation
  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(id: String!): Boolean!
  }
`;
