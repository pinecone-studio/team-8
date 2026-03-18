import type { Env } from "../graphql/context";
import { fetchWithRetry } from "../lib/retry";

export type ScreenTimeExtraction = {
  isValidScreenTimeScreenshot: boolean;
  platform: "ios" | "android" | "unknown";
  periodType: "last_7_days" | "other";
  avgDailyMinutes: number;
  confidenceScore: number;
  reason: string;
};

type GeminiCandidateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeExtraction(raw: unknown): ScreenTimeExtraction {
  const object = typeof raw === "object" && raw !== null ? raw as Record<string, unknown> : {};
  const platformRaw = String(object.platform ?? "unknown").toLowerCase();
  const periodTypeRaw = String(object.periodType ?? "other").toLowerCase();

  return {
    isValidScreenTimeScreenshot: Boolean(object.isValidScreenTimeScreenshot),
    platform:
      platformRaw === "ios" || platformRaw === "android" ? platformRaw : "unknown",
    periodType: periodTypeRaw === "last_7_days" ? "last_7_days" : "other",
    avgDailyMinutes: Math.max(0, Math.round(Number(object.avgDailyMinutes ?? 0))),
    confidenceScore: clampConfidence(Number(object.confidenceScore ?? 0)),
    reason: String(object.reason ?? ""),
  };
}

export async function extractScreenTimeWithGemini(input: {
  env: Env;
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
}): Promise<ScreenTimeExtraction> {
  const { env, fileName, mimeType, bytes } = input;
  const apiKey = env.GEMINI_API_KEY?.trim();
  const model = env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = [
    "You extract structured data from smartphone screen-time screenshots.",
    "Accepted screenshots are ONLY Apple iPhone Screen Time or Android Digital Wellbeing screenshots that clearly show a LAST 7 DAYS / WEEKLY average daily screen time summary.",
    "Read the average daily screen time and return it as whole minutes.",
    "If the screenshot is not a valid 7-day average screen-time summary, return isValidScreenTimeScreenshot=false, periodType=other, avgDailyMinutes=0, and explain why.",
    "Do not infer or guess if the value is unclear.",
    `File name: ${fileName}`,
  ].join(" ");

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: arrayBufferToBase64(bytes),
            },
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: {
        type: "OBJECT",
        required: [
          "isValidScreenTimeScreenshot",
          "platform",
          "periodType",
          "avgDailyMinutes",
          "confidenceScore",
          "reason",
        ],
        properties: {
          isValidScreenTimeScreenshot: { type: "BOOLEAN" },
          platform: {
            type: "STRING",
            enum: ["ios", "android", "unknown"],
          },
          periodType: {
            type: "STRING",
            enum: ["last_7_days", "other"],
          },
          avgDailyMinutes: { type: "INTEGER" },
          confidenceScore: { type: "INTEGER" },
          reason: { type: "STRING" },
        },
      },
    },
  };

  const response = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini extraction failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as GeminiCandidateResponse;
  const text = json.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!text) {
    throw new Error("Gemini response did not contain structured JSON output.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned malformed JSON output.");
  }

  return normalizeExtraction(parsed);
}
