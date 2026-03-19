import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".open-next", ".next"];

function removeDir(fullPath) {
  if (process.platform === "win32") {
    rmSync(fullPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    return;
  }
  try {
    execFileSync("/bin/rm", ["-rf", fullPath], { stdio: "ignore" });
  } catch {
    rmSync(fullPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

for (const target of targets) {
  const fullPath = resolve(process.cwd(), target);
  if (!existsSync(fullPath)) continue;
  removeDir(fullPath);
}
