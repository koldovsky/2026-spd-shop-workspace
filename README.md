# shop-workspace

Meta-repo of the demo **Shop** system (SPD «Team AI Engineering», Workshop 1, Demo 2).

```bash
git clone https://github.com/koldovsky/shop-workspace
```

```bash
git clone https://github.com/koldovsky/shop-web
```

```bash
git clone https://github.com/koldovsky/shop-orders
```

```bash
git clone https://github.com/koldovsky/shop-pricing
```

All four side by side. Then from `shop-workspace`:

```bash
node scripts/up.mjs
```

| What | Where |
|---|---|
| Instructions for agents | `AGENTS.md` |
| Service map, contracts, ADRs | `docs/` |
| Handoff notes | `handoffs/` |
| Demo ticket | `tickets/SHOP-118.md` |
| Shared harness | `koldovsky/shop-harness`, enabled in `.claude/settings.json` |

`compose.yaml` is for Docker users and wasn't tested on the presenter's machine; `scripts/up.mjs` needs only Node 22.13+ and JDK 21.
