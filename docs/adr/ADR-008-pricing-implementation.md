# ADR-008 — Pricing implementation switch: TS, Go or Kotlin (PRICE-42)

- **Status:** proposed · 2026-11-23 · decides: @koldovsky (accountable for PRICE-42) · ticket: [`tickets/PRICE-42.md`](../../tickets/PRICE-42.md)
- **Context:** PRICE-42 reimplemented shop-pricing in Go and in Kotlin next to the TypeScript service, in
  [2026-spd-shop-pricing](https://github.com/koldovsky/2026-spd-shop-pricing) (`go/`, `kotlin/`). Both were written by
  Claude Code under a locked oracle (contract, golden corpus, differential tests, black-box suite, benchmark) that was
  merged before the first migration commit. Consumers (web, orders) call pricing over HTTP only, so the implementation
  can change behind the same port without touching them.

## Decision

1. `scripts/up.mjs` gets a switch `PRICING_IMPL=ts|go|kotlin` (flag `--pricing-impl`; also `--pricing-port`, `--only`).
   Each value starts the built output of the sibling pricing checkout with its production-style command:
   `node dist/server.js`, `go/pricing.exe` (`go/pricing` off Windows), `java -jar kotlin/build/libs/pricing.jar`.
   No dev servers (`tsx`, `go run`, `gradle run`).
2. **The default stays `ts`.** Which implementation becomes the default is the accountable person's decision when
   merging or in a follow-up PR; this ADR records the evidence for that decision, not the choice.

## Evidence (measured; pricing `main` at [e51f047](https://github.com/koldovsky/2026-spd-shop-pricing/commit/e51f047))

| | TS | Go | Kotlin |
|---|---|---|---|
| Corpus, gating cases | 130/130 (reference) | 130/130 | 130/130 |
| Contract · black-box | 125/125 · 16/16 | 125/125 · 16/16 | 125/125 · 16/16 |
| Differential vs TS, 1000 random inputs | — | 0 diffs, seeds 42 and 7 | 0 diffs, seeds 42, 7, 20261126 |
| p95 ms, rounds 1 / 2 | 5.12 / 5.10 | 2.64 / 2.65 | 0.92 / 0.91 |
| RPS, rounds 1 / 2 | 16958.98 / 17252.76 | 81518.08 / 81601.26 | 105779.52 / 106035.9 |
| Peak RSS MB, rounds 1 / 2 | 105.65 / 105.64 | 54.17 / 44.1 | 1354.34 / 1365.63 (304.44 with `-Xmx256m`) |
| Cold start ms, rounds 1 / 2 | 146.22 / 138.94 | 30.35 / 35.01 | 181.37 / 180.77 |
| Non-gating TS quirks reproduced | 6/6 | 0/6 | 2/6 |
| Agent effort (raw JSON; wall-clock from the run logs) | — | 6 iterations, 168 turns, $5.13; 32 min to convergence | 10 iterations, 219 turns, $7.74; 41 min to convergence |
| Human interventions (seeded demo commits included) | — | 4 (2 seeded) | 2 (1 seeded) |

Benchmark: median of 3 repeats, `bench/run.mjs` default profile, back to back on one Windows machine, native
processes, 0 errors in every run. Sources:
- Benchmark: [`bench-final.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/bench-final.md), PR [#23](https://github.com/koldovsky/2026-spd-shop-pricing/pull/23).
- Parity: [`go-5-contract-blackbox.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-5-contract-blackbox.md), [`kotlin-parity.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-parity.md).
- Effort: [`go-run-log.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-run-log.md), [`kotlin-run-log.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-run-log.md).
- This switch, run for each value against the corpus: [`docs/evidence/PRICE-42/cutover.md`](../evidence/PRICE-42/cutover.md).
- The full trail: [`docs/walkback/PRICE-42.md`](../walkback/PRICE-42.md).

## Not measured

- **Consumers end to end.** web and orders were not run against the Go or Kotlin service; parity is shown at the HTTP
  contract only.
- **Production-like conditions.** No containers, no CPU or memory limits, no Linux benchmark, no shadow run with
  mirrored traffic. The load client shared the machine with the service.
- **Off-sample behaviour.** Parity covers the corpus plus seeded random inputs, not every request. The 6 non-gating TS
  quirks differ (above), and Go prices bodies over 100 kB where TS returns 500.
- **Maintainability** of the generated code, and **human review**: the slice PRs were merged by Claude Code under
  the 23.11 permission without a separate human review (their merge commits say so).

## Rollback

- Run with `--pricing-impl ts` (or unset `PRICING_IMPL`) and restart: the TS service is unchanged and still the
  default. Pricing is stateless, so nothing needs migrating back.
- To remove the switch, revert this PR; no other repo changes.
