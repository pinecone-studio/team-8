import { eq, and, inArray } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";

/**
 * Upserts read records for the given notification keys for the current employee.
 *
 * SQLite doesn't support real upserts on composite PKs via Drizzle's onConflict
 * without some care, so we fetch existing keys first and only insert the new ones.
 * This keeps the operation cheap and idempotent.
 */
export const markNotificationsRead = async (
  _: unknown,
  { keys }: { keys: string[] },
  { db, currentEmployee }: GraphQLContext & { db: Database },
): Promise<boolean> => {
  if (!currentEmployee) throw new Error("Not authenticated.");
  if (!keys || keys.length === 0) return true;

  const now = new Date().toISOString();

  // Find which of these keys are already recorded as read
  const existing = await db
    .select({ notificationKey: schema.notificationReads.notificationKey })
    .from(schema.notificationReads)
    .where(
      and(
        eq(schema.notificationReads.employeeId, currentEmployee.id),
        inArray(schema.notificationReads.notificationKey, keys),
      ),
    );

  const alreadyRead = new Set(existing.map((r) => r.notificationKey));
  const toInsert = keys.filter((k) => !alreadyRead.has(k));

  if (toInsert.length > 0) {
    await db.insert(schema.notificationReads).values(
      toInsert.map((key) => ({
        employeeId: currentEmployee.id,
        notificationKey: key,
        readAt: now,
      })),
    );
  }

  return true;
};
