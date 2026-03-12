const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const envFile = fs.existsSync(path.join(__dirname, "..", ".env.local"))
  ? ".env.local"
  : ".env";

const result = spawnSync(
  "npx",
  ["dotenv", "-e", envFile, "--", "wrangler", "deploy"],
  { stdio: "inherit", shell: true, cwd: path.join(__dirname, "..") }
);
process.exit(result.status ?? 1);
