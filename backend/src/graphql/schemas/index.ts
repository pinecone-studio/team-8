import gql from "graphql-tag";
import { employeeTypeDefs } from "./employee";
import { benefitTypeDefs } from "./benefit";
import { adminTypeDefs } from "./admin";

const baseSchema = gql`
  scalar DateTime

  type Query
  type Mutation
`;

export const typeDefs = [baseSchema, employeeTypeDefs, benefitTypeDefs, adminTypeDefs];
