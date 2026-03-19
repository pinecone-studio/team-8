import { createClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import type { Database, Employee } from "../db";
import { schema } from "../db";
import type { Env } from "../graphql/context";

type EmployeeProfileFields = Pick<
  Employee,
  "id" | "email" | "clerkUserId" | "avatarUrl"
>;

type ClerkEmailAddressLike = {
  id: string;
  emailAddress: string;
};

type ClerkUserLike = {
  id: string;
  imageUrl: string;
  primaryEmailAddressId: string | null;
  emailAddresses: ClerkEmailAddressLike[];
};

type SyncedProfile = {
  clerkUserId: string;
  avatarUrl: string | null;
};

const CLERK_BATCH_SIZE = 100;

function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function getClerkEmails(user: ClerkUserLike): string[] {
  const emailSet = new Set(
    user.emailAddresses
      .map((email) => normalizeEmail(email.emailAddress))
      .filter((value): value is string => Boolean(value)),
  );

  const primaryEmail =
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  const normalizedPrimaryEmail = normalizeEmail(primaryEmail);
  if (normalizedPrimaryEmail) {
    emailSet.add(normalizedPrimaryEmail);
  }

  return Array.from(emailSet);
}

export async function syncEmployeeProfiles<T extends EmployeeProfileFields>(
  db: Database,
  env: Env,
  employeeRows: T[],
): Promise<T[]> {
  if (!env.CLERK_SECRET_KEY || employeeRows.length === 0) {
    return employeeRows;
  }

  const emails = Array.from(
    new Set(
      employeeRows
        .map((row) => normalizeEmail(row.email))
        .filter((value): value is string => Boolean(value)),
    ),
  );

  if (emails.length === 0) {
    return employeeRows;
  }

  const clerkClient = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
  });

  const syncedProfilesByEmail = new Map<string, SyncedProfile>();

  try {
    for (const batch of chunkArray(emails, CLERK_BATCH_SIZE)) {
      const response = await clerkClient.users.getUserList({
        emailAddress: batch,
        limit: batch.length,
      });

      for (const user of response.data as ClerkUserLike[]) {
        const profile = {
          clerkUserId: user.id,
          avatarUrl: user.imageUrl ?? null,
        } satisfies SyncedProfile;

        for (const email of getClerkEmails(user)) {
          syncedProfilesByEmail.set(email, profile);
        }
      }
    }
  } catch (error) {
    console.error("[employee-profile-sync] failed to fetch Clerk profiles:", error);
    return employeeRows;
  }

  for (const row of employeeRows) {
    const email = normalizeEmail(row.email);
    if (!email) continue;
    const profile = syncedProfilesByEmail.get(email);
    if (!profile) continue;
    const clerkUserIdMatches = row.clerkUserId === profile.clerkUserId;
    const avatarUrlMatches = row.avatarUrl === profile.avatarUrl;
    if (clerkUserIdMatches && avatarUrlMatches) continue;

    try {
      await db
        .update(schema.employees)
        .set({
          clerkUserId: profile.clerkUserId,
          avatarUrl: profile.avatarUrl,
        })
        .where(eq(schema.employees.id, row.id));
    } catch (error) {
      console.error(
        `[employee-profile-sync] failed to persist Clerk profile for employee ${row.id}:`,
        error,
      );
    }
  }

  return employeeRows.map((row) => {
    const email = normalizeEmail(row.email);
    if (!email) return row;
    const profile = syncedProfilesByEmail.get(email);
    if (!profile) return row;
    return {
      ...row,
      clerkUserId: profile.clerkUserId,
      avatarUrl: profile.avatarUrl,
    };
  });
}

export async function syncEmployeeProfile<T extends EmployeeProfileFields>(
  db: Database,
  env: Env,
  employeeRow: T | null,
): Promise<T | null> {
  if (!employeeRow) {
    return null;
  }

  const [syncedRow] = await syncEmployeeProfiles(db, env, [employeeRow]);
  return syncedRow ?? employeeRow;
}
