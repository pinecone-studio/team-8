import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

type UpdateMySettingsInput = {
  notificationEmail?: boolean | null;
  notificationEligibility?: boolean | null;
  notificationRenewals?: boolean | null;
  language?: string | null;
  timezone?: string | null;
};

export const updateMySettings = async (
  _: unknown,
  { input }: { input: UpdateMySettingsInput },
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const now = new Date().toISOString();

  // Build update object from non-null fields only
  const updates: Record<string, unknown> = { updatedAt: now };
  if (input.notificationEmail != null) updates.notificationEmail = input.notificationEmail;
  if (input.notificationEligibility != null) updates.notificationEligibility = input.notificationEligibility;
  if (input.notificationRenewals != null) updates.notificationRenewals = input.notificationRenewals;
  if (input.language != null) updates.language = input.language.trim();
  if (input.timezone != null) updates.timezone = input.timezone.trim();

  const existing = await db
    .select({ employeeId: schema.employeeSettings.employeeId })
    .from(schema.employeeSettings)
    .where(eq(schema.employeeSettings.employeeId, employee.id))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(schema.employeeSettings)
      .set(updates)
      .where(eq(schema.employeeSettings.employeeId, employee.id))
      .returning();
    return updated!;
  }

  // First save — insert with provided values, defaults fill the rest
  const [inserted] = await db
    .insert(schema.employeeSettings)
    .values({
      employeeId: employee.id,
      notificationEmail: (updates.notificationEmail as boolean | undefined) ?? true,
      notificationEligibility: (updates.notificationEligibility as boolean | undefined) ?? true,
      notificationRenewals: (updates.notificationRenewals as boolean | undefined) ?? false,
      language: (updates.language as string | undefined) ?? "English",
      timezone: (updates.timezone as string | undefined) ?? "UTC",
      updatedAt: now,
    })
    .returning();
  return inserted!;
};
