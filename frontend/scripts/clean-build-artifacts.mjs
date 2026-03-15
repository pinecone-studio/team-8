import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".open-next", ".next"];

for (const target of targets) {
  const fullPath = resolve(process.cwd(), target);
  if (!existsSync(fullPath)) continue;
  try {
    execFileSync("/bin/rm", ["-rf", fullPath], { stdio: "ignore" });
  } catch {
    rmSync(fullPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}
