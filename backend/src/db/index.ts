import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { schema } from "./schema";

export type Database = DrizzleD1Database<typeof schema>;

export function createDb(d1: D1Database): Database {
  // Drizzle-д schema-г дамжуулахдаа object хэлбэрээр өгнө
  return drizzle(d1, { schema });
}

export * from "./schema";
