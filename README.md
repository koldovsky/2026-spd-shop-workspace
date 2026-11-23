# 2026-spd-shop-workspace

Meta-repo of the demo **Shop** system (SPD «Team AI Engineering», Workshop 1, Demo 2).

```bash
git clone https://github.com/koldovsky/2026-spd-shop-workspace
```

```bash
git clone https://github.com/koldovsky/2026-spd-shop-web
```

```bash
git clone https://github.com/koldovsky/2026-spd-shop-orders
```

```bash
git clone https://github.com/koldovsky/2026-spd-shop-pricing
```

All four side by side. Then from `2026-spd-shop-workspace`:

```bash
node scripts/up.mjs
```

| What | Where |
|---|---|
| Instructions for agents | `AGENTS.md` |
| Service map, contracts, ADRs | `docs/` |
| Handoff notes | `handoffs/` |
| Demo ticket | `tickets/SHOP-118.md` |
| Shared harness | `koldovsky/2026-spd-shop-harness`, enabled in `.claude/settings.json` |

`scripts/up.mjs` needs only Node 22.13+ and JDK 21, and starts pricing from its build output: run `npm ci` and
`npm run build` in `2026-spd-shop-pricing` first. `PRICING_IMPL=ts|go|kotlin` (or `--pricing-impl`) picks the TS, Go or
Kotlin build (ADR-008); `--only pricing` starts just that service. `compose.yaml` is for Docker users and wasn't tested
on the presenter's machine.
