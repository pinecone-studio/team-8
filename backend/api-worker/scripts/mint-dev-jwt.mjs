import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { SignJWT } from "jose";

function loadDevVars() {
  const file = resolve(process.cwd(), ".dev.vars");

  if (!existsSync(file)) {
    return {};
  }

  const lines = readFileSync(file, "utf8").split("\n");
  const out = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    out[key] = value;
  }

  return out;
}

const [, , userId = "emp-demo-001", role = "employee", email] = process.argv;
const envFile = loadDevVars();
const secret = process.env.AUTH_JWT_SECRET || envFile.AUTH_JWT_SECRET;

if (!secret) {
  throw new Error("AUTH_JWT_SECRET not found. Put it in .dev.vars or export it in the shell.");
}

const token = await new SignJWT({
  role,
  email: email || `${userId}@local.test`
})
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(userId)
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(new TextEncoder().encode(secret));

console.log(token);
