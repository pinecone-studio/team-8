import * as employeeSchema from "./employee";
import * as benefitSchema from "./benefit";

// Combine schema pieces (extend here if more tables are added)
export const schema = { ...employeeSchema, ...benefitSchema };

// Re-export tables and types for consumers and GraphQL codegen
export * from "./employee";
export * from "./benefit";
