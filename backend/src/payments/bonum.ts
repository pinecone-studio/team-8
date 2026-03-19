import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { Database, BonumAuthToken } from "../db";
import { schema } from "../db";
import type { Env } from "../graphql/context";
import { fetchWithRetry } from "../lib/retry";

type BonumAuthResponse = {
  tokenType?: string;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  refreshExpiresIn?: number;
};

type BonumConfig = {
  apiBaseUrl: string;
  appSecret: string;
  terminalId: string;
  acceptLanguage: string;
  callbackUrl?: string;
  returnUrl?: string;
  checksumKey?: string;
  defaultInvoiceExpiresInSeconds: number;
};

export type BonumInvoiceCreateInput = {
  amountMnt: number;
  transactionId: string;
  callbackUrl: string;
  expiresInSeconds?: number;
  itemTitle?: string;
  itemRemark?: string;
};

export type BonumInvoiceCreateResult = {
  invoiceId: string;
  followUpLink: string;
  expiresInSeconds: number;
  rawResponse: unknown;
};

const DEFAULT_BONUM_API_BASE_URL = "https://testapi.bonum.mn";
const DEFAULT_ACCEPT_LANGUAGE = "mn";
const DEFAULT_INVOICE_EXPIRES_SECONDS = 1_800;
const REQUEST_TIMEOUT_MS = 15_000;
const TOKEN_BUFFER_MS = 60_000;

const toClean = (value: string | undefined | null) => (value ?? "").trim();
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function getBonumConfig(env: Env): BonumConfig {
  return {
    apiBaseUrl: trimTrailingSlash(
      toClean(env.BONUM_API_BASE_URL) || DEFAULT_BONUM_API_BASE_URL,
    ),
    appSecret: toClean(env.BONUM_APP_SECRET),
    terminalId: toClean(env.BONUM_TERMINAL_ID),
    acceptLanguage:
      toClean(env.BONUM_ACCEPT_LANGUAGE) || DEFAULT_ACCEPT_LANGUAGE,
    callbackUrl: toClean(env.BONUM_CALLBACK_URL) || undefined,
    returnUrl: toClean(env.BONUM_RETURN_URL) || undefined,
    checksumKey: toClean(env.BONUM_MERCHANT_CHECKSUM_KEY) || undefined,
    defaultInvoiceExpiresInSeconds:
      Number.parseInt(env.BONUM_INVOICE_EXPIRES_SECONDS ?? "", 10) > 0
        ? Number.parseInt(env.BONUM_INVOICE_EXPIRES_SECONDS ?? "", 10)
        : DEFAULT_INVOICE_EXPIRES_SECONDS,
  };
}

function assertBonumAuthConfig(config: BonumConfig) {
  if (!config.appSecret) throw new Error("BONUM_APP_SECRET is not configured.");
  if (!config.terminalId) {
    throw new Error("BONUM_TERMINAL_ID is not configured.");
  }
}

function parseJsonSafe(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function fetchBonum(
  env: Env,
  path: string,
  init: RequestInit,
): Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  payload: unknown;
}> {
  const config = getBonumConfig(env);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchWithRetry(`${config.apiBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      payload: parseJsonSafe(text),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractBonumErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  if (isRecord(payload)) {
    const message = payload.message;
    if (typeof message === "string" && message.trim()) return message.trim();
    const error = payload.error;
    if (typeof error === "string" && error.trim()) return error.trim();
  }
  return fallback;
}

async function upsertBonumToken(
  db: Database,
  terminalId: string,
  tokenPayload: BonumAuthResponse,
): Promise<void> {
  const now = Date.now();
  const expiresInSeconds =
    Number(tokenPayload.expiresIn) > 0
      ? Number(tokenPayload.expiresIn)
      : DEFAULT_INVOICE_EXPIRES_SECONDS;
  const refreshExpiresSeconds =
    Number(tokenPayload.refreshExpiresIn) > 0
      ? Number(tokenPayload.refreshExpiresIn)
      : null;

  const existing = await db
    .select()
    .from(schema.bonumAuthTokens)
    .where(eq(schema.bonumAuthTokens.terminalId, terminalId))
    .limit(1);

  const values = {
    accessToken: tokenPayload.accessToken ?? "",
    refreshToken: tokenPayload.refreshToken ?? null,
    tokenType: tokenPayload.tokenType ?? null,
    expiresInSeconds,
    refreshExpiresSeconds,
    accessTokenExpiresAt: new Date(now + expiresInSeconds * 1_000).toISOString(),
    refreshTokenExpiresAt: refreshExpiresSeconds
      ? new Date(now + refreshExpiresSeconds * 1_000).toISOString()
      : null,
    updatedAt: new Date(now).toISOString(),
  };

  if (existing[0]) {
    await db
      .update(schema.bonumAuthTokens)
      .set(values)
      .where(eq(schema.bonumAuthTokens.terminalId, terminalId));
    return;
  }

  await db.insert(schema.bonumAuthTokens).values({
    terminalId,
    ...values,
  });
}

async function requestNewBonumToken(
  env: Env,
  config: BonumConfig,
): Promise<BonumAuthResponse> {
  const response = await fetchBonum(env, "/bonum-gateway/ecommerce/auth/create", {
    method: "GET",
    headers: {
      Authorization: `AppSecret ${config.appSecret}`,
      "X-TERMINAL-ID": config.terminalId,
    },
  });

  if (!response.ok) {
    throw new Error(
      extractBonumErrorMessage(
        response.payload,
        `Bonum token create failed (${response.status}).`,
      ),
    );
  }

  if (!isRecord(response.payload) || !response.payload.accessToken) {
    throw new Error("Bonum token create response is invalid.");
  }

  return response.payload as BonumAuthResponse;
}

async function refreshBonumToken(
  env: Env,
  config: BonumConfig,
  refreshToken: string,
): Promise<BonumAuthResponse> {
  const response = await fetchBonum(env, "/bonum-gateway/ecommerce/auth/refresh", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "X-TERMINAL-ID": config.terminalId,
    },
  });

  if (!response.ok) {
    throw new Error(
      extractBonumErrorMessage(
        response.payload,
        `Bonum token refresh failed (${response.status}).`,
      ),
    );
  }

  if (!isRecord(response.payload) || !response.payload.accessToken) {
    throw new Error("Bonum token refresh response is invalid.");
  }

  return {
    ...response.payload,
    refreshToken,
  } as BonumAuthResponse;
}

function isTokenFreshEnough(token: BonumAuthToken | undefined, now: number): boolean {
  if (!token?.accessToken) return false;
  const expiresAt = new Date(token.accessTokenExpiresAt).getTime();
  return expiresAt - now > TOKEN_BUFFER_MS;
}

function isRefreshTokenFreshEnough(
  token: BonumAuthToken | undefined,
  now: number,
): boolean {
  if (!token?.refreshToken || !token.refreshTokenExpiresAt) return false;
  const expiresAt = new Date(token.refreshTokenExpiresAt).getTime();
  return expiresAt - now > TOKEN_BUFFER_MS;
}

export async function resolveBonumAccessToken(
  db: Database,
  env: Env,
): Promise<string> {
  const config = getBonumConfig(env);
  assertBonumAuthConfig(config);

  const now = Date.now();
  const cachedRows = await db
    .select()
    .from(schema.bonumAuthTokens)
    .where(eq(schema.bonumAuthTokens.terminalId, config.terminalId))
    .limit(1);
  const cached = cachedRows[0];

  if (isTokenFreshEnough(cached, now)) {
    return cached.accessToken;
  }

  if (isRefreshTokenFreshEnough(cached, now) && cached.refreshToken) {
    try {
      const refreshed = await refreshBonumToken(env, config, cached.refreshToken);
      await upsertBonumToken(db, config.terminalId, refreshed);
      if (!refreshed.accessToken) {
        throw new Error("Bonum refresh response does not contain accessToken.");
      }
      return refreshed.accessToken;
    } catch (error) {
      const stillValidAccessToken =
        cached?.accessToken &&
        new Date(cached.accessTokenExpiresAt).getTime() - now > 5_000;
      if (stillValidAccessToken) {
        return cached.accessToken;
      }
      console.warn(
        "[bonum] token refresh failed",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const fresh = await requestNewBonumToken(env, config);
  await upsertBonumToken(db, config.terminalId, fresh);
  if (!fresh.accessToken) {
    throw new Error("Bonum create-token response does not contain accessToken.");
  }
  return fresh.accessToken;
}

export async function createBonumInvoice(
  db: Database,
  env: Env,
  input: BonumInvoiceCreateInput,
): Promise<BonumInvoiceCreateResult> {
  const config = getBonumConfig(env);
  assertBonumAuthConfig(config);
  const accessToken = await resolveBonumAccessToken(db, env);
  const expiresInSeconds =
    input.expiresInSeconds && input.expiresInSeconds > 0
      ? input.expiresInSeconds
      : config.defaultInvoiceExpiresInSeconds;

  const response = await fetchBonum(env, "/bonum-gateway/ecommerce/invoices", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": config.acceptLanguage,
    },
    body: JSON.stringify({
      amount: input.amountMnt,
      callback: input.callbackUrl,
      transactionId: input.transactionId,
      expiresIn: expiresInSeconds,
      items: [
        {
          title: input.itemTitle ?? "PineQuest employee benefit payment",
          remark:
            input.itemRemark ??
            "Employee co-payment for an approved PineQuest benefit request",
          amount: input.amountMnt,
          count: 1,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      extractBonumErrorMessage(
        response.payload,
        `Bonum create invoice failed (${response.status}).`,
      ),
    );
  }

  const invoiceContainer =
    isRecord(response.payload) && isRecord(response.payload.data)
      ? response.payload.data
      : response.payload;

  if (!isRecord(invoiceContainer)) {
    throw new Error("Bonum create invoice response is invalid.");
  }

  const invoiceId =
    typeof invoiceContainer.invoiceId === "string"
      ? invoiceContainer.invoiceId
      : "";
  const followUpLink =
    typeof invoiceContainer.followUpLink === "string"
      ? invoiceContainer.followUpLink
      : "";

  if (!invoiceId || !followUpLink) {
    throw new Error("Bonum invoice response missing invoiceId/followUpLink.");
  }

  return {
    invoiceId,
    followUpLink,
    expiresInSeconds,
    rawResponse: response.payload,
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

export async function computeBonumChecksum(
  rawBody: string,
  checksumKey: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(checksumKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  return bytesToHex(new Uint8Array(signature));
}

export async function verifyBonumChecksum(
  rawBody: string,
  checksumHeader: string | null,
  checksumKey: string | undefined,
): Promise<boolean> {
  if (!checksumKey?.trim()) return false;
  if (!checksumHeader?.trim()) return false;
  const expected = await computeBonumChecksum(rawBody, checksumKey.trim());
  return expected === checksumHeader.trim().toLowerCase();
}

export async function generateBonumWebhookDedupeKey(
  rawBody: string,
): Promise<string> {
  return sha256Hex(rawBody);
}

export function generateLocalTransactionId(requestId: string): string {
  return `ebms-${requestId}-${Date.now()}-${nanoid(6)}`;
}

export function parseBonumDate(value: unknown): Date | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const fromNumber = new Date(value);
    if (!Number.isNaN(fromNumber.getTime())) return fromNumber;
  }
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const datetimeWithSpace =
    /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed);
  if (datetimeWithSpace) {
    const utc8 = new Date(`${trimmed.replace(" ", "T")}+08:00`);
    if (!Number.isNaN(utc8.getTime())) return utc8;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function resolveBonumCallbackUrl(request: Request, env: Env): string {
  const config = getBonumConfig(env);
  if (config.callbackUrl) return config.callbackUrl;
  const baseUrl = new URL(request.url);
  return `${baseUrl.origin}/api/payments/bonum/webhook`;
}

export function resolveBonumReturnUrl(request: Request, env: Env): string {
  const config = getBonumConfig(env);
  if (config.returnUrl) return config.returnUrl;

  const url = new URL(request.url);
  const hostname = url.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000/employee-panel/requests?payment=returned";
  }
  if (hostname.startsWith("team8-api.")) {
    return `${url.origin.replace("team8-api.", "team-8-frontend.")}/employee-panel/requests?payment=returned`;
  }
  return `${url.origin}/employee-panel/requests?payment=returned`;
}
