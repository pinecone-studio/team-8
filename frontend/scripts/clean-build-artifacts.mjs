import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".open-next", ".next"];

for (const target of targets) {
  const fullPath = resolve(process.cwd(), target);
  if (!existsSync(fullPath)) continue;
  rmSync(fullPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
