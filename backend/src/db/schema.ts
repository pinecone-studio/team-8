import * as employeeSchema from "./employee";

// Combine schema pieces (extend here if more tables are added)
export const schema = { ...employeeSchema };

// Re-export tables and types for consumers and GraphQL codegen
export * from "./employee";
