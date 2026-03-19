import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bonumAuthTokens = sqliteTable("bonum_auth_tokens", {
  terminalId: text("terminal_id").primaryKey(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenType: text("token_type"),
  expiresInSeconds: integer("expires_in_seconds").notNull().default(1800),
  refreshExpiresSeconds: integer("refresh_expires_seconds"),
  accessTokenExpiresAt: text("access_token_expires_at").notNull(),
  refreshTokenExpiresAt: text("refresh_token_expires_at"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type BonumAuthToken = typeof bonumAuthTokens.$inferSelect;
export type NewBonumAuthToken = typeof bonumAuthTokens.$inferInsert;
