// Runs the Shop system locally without Docker: pricing :8082, orders :8081, web :3001.
// Usage (from 2026-spd-shop-workspace): node scripts/up.mjs   — Ctrl+C stops everything.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const win = process.platform === "win32";
const services = [
  { name: "pricing", dir: "../2026-spd-shop-pricing", cmd: "npm", args: ["run", "dev"] },
  { name: "orders", dir: "../2026-spd-shop-orders", cmd: win ? "gradlew.bat" : "./gradlew", args: ["bootRun", "--console=plain"] },
  { name: "web", dir: "../2026-spd-shop-web", cmd: "npm", args: ["run", "dev"] },
];
const children = [];
for (const s of services) {
  if (!existsSync(s.dir)) {
    console.log(`[${s.name}] skipped: ${s.dir} not found`);
    continue;
  }
  const cmd = win && s.cmd.endsWith(".bat") ? `"${resolve(s.dir, s.cmd)}"` : s.cmd;
  const child = spawn(cmd, s.args, { cwd: s.dir, shell: win, env: { ...process.env, PRICING_BASE_URL: "http://localhost:8082", PRICING_URL: "http://localhost:8082", ORDERS_URL: "http://localhost:8081" } });
  child.stdout.on("data", (d) => process.stdout.write(`[${s.name}] ${d}`));
  child.stderr.on("data", (d) => process.stderr.write(`[${s.name}] ${d}`));
  children.push(child);
}
process.on("SIGINT", () => { for (const c of children) c.kill(); process.exit(0); });
