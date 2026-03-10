import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const child = spawn("npx", ["next", "lint"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    ESLINT_USE_FLAT_CONFIG: "false",
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
