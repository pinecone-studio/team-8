import gql from "graphql-tag";
import { employeeTypeDefs } from "./employee";

const baseSchema = gql`
  type Query
  type Mutation
`;

export const typeDefs = [baseSchema, employeeTypeDefs];
