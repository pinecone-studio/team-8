import { sql } from "drizzle-orm";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";

/**
 * Inserts read records for the given notification keys for the current employee.
 *
 * Uses raw "INSERT OR IGNORE" (SQLite/D1 native syntax) to atomically skip
 * duplicate (employee_id, notification_key) pairs — avoids UNIQUE constraint
 * errors from concurrent or repeated calls.
 */
export const markNotificationsRead = async (
  _: unknown,
  { keys }: { keys: string[] },
  { db, currentEmployee }: GraphQLContext & { db: Database },
): Promise<boolean> => {
  if (!currentEmployee) throw new Error("Not authenticated.");
  if (!keys || keys.length === 0) return true;

  const now = new Date().toISOString();

  const valuesSql = sql.join(
    keys.map((key) => sql`(${currentEmployee.id}, ${key}, ${now})`),
    sql`, `,
  );

  await db.run(
    sql`INSERT OR IGNORE INTO notification_reads (employee_id, notification_key, read_at) VALUES ${valuesSql}`,
  );

  return true;
};
