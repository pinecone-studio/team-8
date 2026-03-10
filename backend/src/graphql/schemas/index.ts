import gql from "graphql-tag";
import { employeeTypeDefs } from "./employee";
import { benefitTypeDefs } from "./benefit";

const baseSchema = gql`
  type Query
  type Mutation
`;

export const typeDefs = [baseSchema, employeeTypeDefs, benefitTypeDefs];
