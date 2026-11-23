// Runs the Shop system locally without Docker: pricing :8082, orders :8081, web :3001.
// Usage (from any folder): node scripts/up.mjs [--pricing-impl ts|go|kotlin] [--pricing-port 8082] [--only pricing,orders,web]
// Env equivalents (a flag wins): PRICING_IMPL, PRICING_PORT, UP_ONLY. Ctrl+C stops everything.
// PRICING_IMPL picks which build of 2026-spd-shop-pricing runs (PRICE-42, docs/adr/ADR-008). Default: ts.
// Pricing runs from its built output, not a dev server; if the output is missing, the build command is printed.
import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const win = process.platform === "win32";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", ".."); // the folder that holds the sibling repos
const arg = (name) => { const i = process.argv.indexOf(`--${name}`); return i > 1 ? process.argv[i + 1] : undefined; };
const impl = arg("pricing-impl") ?? process.env.PRICING_IMPL ?? "ts";
const pricingPort = arg("pricing-port") ?? process.env.PRICING_PORT ?? "8082";
const only = (arg("only") ?? process.env.UP_ONLY ?? "pricing,orders,web").split(",").map((s) => s.trim());
const pricingUrl = `http://localhost:${pricingPort}`;
const pricingDir = join(root, "2026-spd-shop-pricing");

// Production-style start commands per implementation (pricing go/README.md, kotlin/README.md; ADR-008).
const exe = win ? "pricing.exe" : "pricing";
const PRICING = {
  ts: { cmd: process.execPath, args: ["dist/server.js"], needs: "dist/server.js", build: (d) => `npm --prefix ${d} ci, then npm --prefix ${d} run build` },
  go: { cmd: join(pricingDir, "go", exe), args: [], needs: `go/${exe}`, build: (d) => `go -C ${join(d, "go")} build -o ${exe} .` },
  kotlin: { cmd: "java", args: ["-jar", "kotlin/build/libs/pricing.jar"], needs: "kotlin/build/libs/pricing.jar", build: (d) => `${join(d, "kotlin", win ? "gradlew.bat" : "gradlew")} -p ${join(d, "kotlin")} build` },
};
if (!PRICING[impl]) { console.error(`PRICING_IMPL must be ts, go or kotlin (got "${impl}")`); process.exit(64); }
const p = PRICING[impl];

const services = [
  { name: "pricing", dir: pricingDir, cmd: p.cmd, args: p.args, env: { PORT: pricingPort } }, // PORT only here: Next.js reads it too
  { name: "orders", dir: join(root, "2026-spd-shop-orders"), cmd: win ? "gradlew.bat" : "./gradlew", args: ["bootRun", "--console=plain"], shell: win },
  { name: "web", dir: join(root, "2026-spd-shop-web"), cmd: "npm", args: ["run", "dev"], shell: win },
];
const revision = (dir) => { try { return execFileSync("git", ["-C", dir, "describe", "--always", "--dirty", "--abbrev=7"], { encoding: "utf8" }).trim(); } catch { return "unknown"; } };

const children = [];
for (const s of services.filter((x) => only.includes(x.name))) {
  if (!existsSync(s.dir)) { console.log(`[${s.name}] skipped: ${s.dir} not found`); continue; }
  if (s.name === "pricing") {
    if (!existsSync(join(s.dir, p.needs))) {
      console.error(`[pricing] ${p.needs} not found in ${s.dir}. Build it first: ${p.build(s.dir)}`);
      process.exit(1);
    }
    console.log(`[pricing] impl=${impl} revision=${revision(s.dir)} cmd="${[p.cmd, ...p.args].join(" ")}" url=${pricingUrl}`);
  }
  const cmd = s.shell && s.cmd.endsWith(".bat") ? `"${resolve(s.dir, s.cmd)}"` : s.cmd;
  const env = { ...process.env, PRICING_BASE_URL: pricingUrl, PRICING_URL: pricingUrl, ORDERS_URL: "http://localhost:8081", ...s.env };
  const child = spawn(cmd, s.args, { cwd: s.dir, shell: Boolean(s.shell), env });
  console.log(`[${s.name}] pid=${child.pid}`);
  child.stdout.on("data", (d) => process.stdout.write(`[${s.name}] ${d}`));
  child.stderr.on("data", (d) => process.stderr.write(`[${s.name}] ${d}`));
  child.on("exit", (code) => console.log(`[${s.name}] exited with ${code}`));
  children.push(child);
}

function stop() {
  for (const c of children) {
    // A shell-started child on Windows is cmd.exe: stop its whole tree by its PID.
    if (win) { try { execFileSync("taskkill", ["/PID", String(c.pid), "/T", "/F"], { stdio: "ignore" }); } catch { /* already gone */ } }
    else c.kill();
  }
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
