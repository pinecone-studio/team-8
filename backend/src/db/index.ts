import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as employeeSchema from "./employee"; // Нэрийг нь тодорхой болгох

// Бүх schema-г нэгтгэж байна (хэрэв дараа нь олон файл болвол энд нэмнэ)
export const schema = { ...employeeSchema };

export type Database = DrizzleD1Database<typeof schema>;

export function createDb(d1: D1Database): Database {
  // Drizzle-д schema-г дамжуулахдаа object хэлбэрээр өгнө
  return drizzle(d1, { schema });
}

// GraphQL Codegen-д зориулж table-үүдийг нэг бүрчлэн гаргаж өгөх (Re-export)
export * from "./employee";
