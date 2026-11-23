# PRICE-42 — Migrate pricing to Kotlin and Go; parity 100% on the corpus; p95 within the budget

shop-pricing (TypeScript/Express) is reimplemented twice, in Kotlin (Java 21 + Gradle wrapper, as in shop-orders)
and in Go, each in its own folder of `2026-spd-shop-pricing`. Consumers must not notice: shop-web calls
`GET /catalog` and `GET /prices/{sku}`, shop-orders calls `POST /quote` and reads `totalCents`.

The oracle was built and merged before any migration commit (pricing PRs #3–#8): contract
`contracts/openapi.yaml`, golden corpus `parity/corpus/corpus.json` (130 gating cases recorded from TS),
differential tester, black-box suite, benchmark, and a hook that blocks agent edits to all of them.
Spec: `2026-spd-shop-pricing/docs/specs/PRICE-42.md`. Baseline evidence: `docs/evidence/PRICE-42/oracle.md` there.

**Acceptance (each stack)**
- `node parity/check.mjs --base <url>`: **100% of the 130 gating corpus cases** (the 6 recorded TS quirks do not gate).
- `node parity/contract.mjs --base <url>` and `node parity/blackbox/run.mjs --base <url>` pass.
- `node parity/diff/diff.mjs --a <TS> --b <url> --seed 42 --n 1000` shows 0 differences, plus one reviewer-chosen seed.
- **p95 budget:** median p95 of 3 runs of `bench/run.mjs` (default profile) is not above the TS median p95 measured
  in the same session on the same machine. Recorded TS reference: **5.64 ms** p95, 15430.7 RPS
  (`bench/results/ts-baseline.json`, median of 3, 64 connections, 2026-11-23). The same TS code measured
  5.22–5.64 ms p95 in two recorded sessions, so the comparison is back to back, not against a fixed number.
- RPS, p99, peak RSS and cold start are reported as measured; no claim without a run.
- Slice PRs under 400 changed lines, key `PRICE-42` in title, branch and `Refs:` trailers, evidence naming the
  verified SHA (shop-harness gates). The cutover is a separate PR in this repo, with an ADR.

**Expected trap:** half-even rounding (ADR-007). 5 x SKU-1 in EUR has a cart discount of 1348.5 → **1348**;
`HALF_UP` / `math.Round` give 1349. The corpus case `trap-cart-discount-tie-even` must go red if a stack gets it wrong.

**Run the migrating agent inside `2026-spd-shop-pricing`, not from this workspace with `--add-dir`:** hooks of
added directories do not load, so the oracle lock would not apply.

**Out of scope:** behaviour changes, containers and image size (no Docker on the presenter machine), switching
consumers before both parity and the budget are met.
