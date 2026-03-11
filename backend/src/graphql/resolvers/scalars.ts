/** DateTime: ISO 8601 string. Serialize as-is; parse from string. */
export const DateTime = {
  serialize(value: unknown): string {
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString();
    throw new Error("DateTime must be ISO 8601 string or Date");
  },
  parseValue(value: unknown): string {
    if (typeof value !== "string") throw new Error("DateTime must be string");
    return value;
  },
  parseLiteral(ast: { kind: string; value?: string }): string {
    if (ast.kind !== "StringValue" || typeof ast.value !== "string") {
      throw new Error("DateTime must be string literal");
    }
    return ast.value;
  },
};
