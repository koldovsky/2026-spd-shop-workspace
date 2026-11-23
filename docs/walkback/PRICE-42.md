# Walk-back: PRICE-42, from the running service to the ticket

Start from what is running and follow links that the tools themselves record: revision, commit trailers, PR, gate
run, evidence file, raw agent log. Nothing here relies on someone remembering. Pricing links are pinned to
`e51f047` (pricing `main` after PR #23) unless they point at a PR, a run or a tag.

## 1. The running service → a revision

`node scripts/up.mjs --only pricing --pricing-impl go` prints the implementation, the pricing checkout's revision, the
command and the PID:

```text
[pricing] impl=go revision=e51f047 cmd="...\2026-spd-shop-pricing\go\pricing.exe" url=http://localhost:8082
[pricing] pid=12345
```

A Go binary also carries its own revision (Go stamps it at build time): `go version -m ../2026-spd-shop-pricing/go/pricing.exe`
shows `build vcs.revision=e51f047…` and `vcs.modified=false`. The TS and Kotlin builds carry no stamp, so their revision
is the checkout's (`git -C ../2026-spd-shop-pricing describe --always --dirty`).

## 2. The revision → commits, trailers, PRs

Every commit on the path carries `Refs: PRICE-42`; agent commits add `Assisted-by: Claude Code (claude-opus-5-5)`,
evidence commits add `Evidence: <file>`, and merge commits add `Accountable:`.

| Step | Where | Gate runs (Actions) |
|---|---|---|
| Ticket | workspace [`tickets/PRICE-42.md`](https://github.com/koldovsky/2026-spd-shop-workspace/blob/main/tickets/PRICE-42.md), PRs [#1](https://github.com/koldovsky/2026-spd-shop-workspace/pull/1), [#2](https://github.com/koldovsky/2026-spd-shop-workspace/pull/2) | the workspace had no gates before this PR |
| Gate rules | harness [`docs/gates.md` v1.6.1](https://github.com/koldovsky/2026-spd-shop-harness/blob/v1.6.1/docs/gates.md), [release v1.6.1](https://github.com/koldovsky/2026-spd-shop-harness/releases/tag/v1.6.1) | — |
| Gates wired in pricing | [#1](https://github.com/koldovsky/2026-spd-shop-pricing/pull/1) | [45228301283](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45228301283) green |
| Spec | [`docs/specs/PRICE-42.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/specs/PRICE-42.md) (merged in #7) | — |
| Oracle, before any migration commit | [#3](https://github.com/koldovsky/2026-spd-shop-pricing/pull/3) corpus · [#4](https://github.com/koldovsky/2026-spd-shop-pricing/pull/4) contract · [#5](https://github.com/koldovsky/2026-spd-shop-pricing/pull/5) diff, black-box · [#6](https://github.com/koldovsky/2026-spd-shop-pricing/pull/6) bench · [#7](https://github.com/koldovsky/2026-spd-shop-pricing/pull/7) lock hook, spec · [#8](https://github.com/koldovsky/2026-spd-shop-pricing/pull/8) lock protects itself; main = `128c922` | [45230401770](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45230401770) · [45230682757](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45230682757) · [45230876866](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45230876866) · [45231903105](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45231903105) · [45232344220](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45232344220) · [45233262349](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45233262349) |
| Go slices 1–5 | [#10](https://github.com/koldovsky/2026-spd-shop-pricing/pull/10) · [#11](https://github.com/koldovsky/2026-spd-shop-pricing/pull/11) · [#13](https://github.com/koldovsky/2026-spd-shop-pricing/pull/13) · [#15](https://github.com/koldovsky/2026-spd-shop-pricing/pull/15) · [#17](https://github.com/koldovsky/2026-spd-shop-pricing/pull/17) | parity-go [45236752589](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45236752589) · [45237369451](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45237369451) · [45238179177](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45238179177) · [45239051185](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45239051185) · [45239793695](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45239793695); trace+size [45236753506](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45236753506) · [45237370241](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45237370241) · [45238179951](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45238179951) · [45239052263](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45239052263) · [45239793897](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45239793897) |
| Go run log | [#20](https://github.com/koldovsky/2026-spd-shop-pricing/pull/20) | trace+size [45241513234](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45241513234) |
| Kotlin slices | [#9](https://github.com/koldovsky/2026-spd-shop-pricing/pull/9) · [#12](https://github.com/koldovsky/2026-spd-shop-pricing/pull/12) · [#14](https://github.com/koldovsky/2026-spd-shop-pricing/pull/14) · [#16](https://github.com/koldovsky/2026-spd-shop-pricing/pull/16) · [#18](https://github.com/koldovsky/2026-spd-shop-pricing/pull/18) · [#22](https://github.com/koldovsky/2026-spd-shop-pricing/pull/22) | parity-kotlin red by design until endpoints existed ([45236716054](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45236716054)); #18 red ([45240402180](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45240402180), missing `npm ci`) then green ([45240871878](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45240871878)); #22 green [45242625631](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45242625631); trace+size green on all |
| Rounding trap, SEEDED red (closed, not merged) | Go [#19](https://github.com/koldovsky/2026-spd-shop-pricing/pull/19), tags [`price-42-go-seeded`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/price-42-go-seeded), [`price-42-go-seeded-oracle`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/price-42-go-seeded-oracle) · Kotlin [#21](https://github.com/koldovsky/2026-spd-shop-pricing/pull/21), tag [`price-42-kotlin-seeded`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/price-42-kotlin-seeded) | Go red at `go test` [45240621161](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45240621161), at the oracle corpus step [45240838007](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45240838007); Kotlin red at build [45241985376](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45241985376) |
| Benchmark, TS vs Kotlin vs Go | [#23](https://github.com/koldovsky/2026-spd-shop-pricing/pull/23), merge `e51f047` | trace+size [45245462084](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45245462084) |
| Negative path: no key, no trailers, 450 lines | [#2](https://github.com/koldovsky/2026-spd-shop-pricing/pull/2), closed | both gates red [45228454506](https://github.com/koldovsky/2026-spd-shop-pricing/actions/runs/45228454506) |
| Cutover: this switch and ADR-008 | workspace [#3](https://github.com/koldovsky/2026-spd-shop-workspace/pull/3), open for the accountable person | runs listed on the PR |

**Who judged.** Every pricing PR above was opened and merged by Claude Code under the 23.11 permission, without a
separate human review; each merge commit says so in its `Accountable: @koldovsky (…)` trailer. No commit claims
`Reviewed-by:`. The cutover PR is the first in this chain left for a human to review and merge.

## 3. Evidence files (commands, outputs, exit codes, verified SHA)

- Oracle and baseline: [`oracle.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/oracle.md).
- Go, one per slice: [`go-1-skeleton-catalog.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-1-skeleton-catalog.md) · [`go-2-money-prices.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-2-money-prices.md) · [`go-3-quote-happy.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-3-quote-happy.md) · [`go-4-quote-validation.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-4-quote-validation.md) · [`go-5-contract-blackbox.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-5-contract-blackbox.md); seeded: [`go-seeded-halfup.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/PRICE-42-go-seeded-halfup/docs/evidence/PRICE-42/go-seeded-halfup.md) (branch only).
- Kotlin, one per slice: [`kotlin-skeleton.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-skeleton.md) · [`kotlin-pricing-core.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-pricing-core.md) · [`kotlin-json.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-json.md) · [`kotlin-prices.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-prices.md) · [`kotlin-quote.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-quote.md) · [`kotlin-parity.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-parity.md); seeded: [`kotlin-seeded-halfup.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-seeded-halfup.md).
- Run logs (iterations, prompts verbatim, turns, cost, interventions): [`go-run-log.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/go-run-log.md) · [`kotlin-run-log.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/kotlin-run-log.md); raw `claude -p` JSON: [`runs/go/`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/e51f047/docs/evidence/PRICE-42/runs/go) · [`runs/kotlin/`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/e51f047/docs/evidence/PRICE-42/runs/kotlin).
- Benchmark: [`bench-final.md`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/e51f047/docs/evidence/PRICE-42/bench-final.md) and its raw JSON in [`bench-final/`](https://github.com/koldovsky/2026-spd-shop-pricing/tree/e51f047/docs/evidence/PRICE-42/bench-final).
- This cutover: [`docs/evidence/PRICE-42/cutover.md`](../evidence/PRICE-42/cutover.md) · decision record: [ADR-008](../adr/ADR-008-pricing-implementation.md).

## 4. Do it yourself

From a folder with both repos cloned side by side. Each command is one line (PowerShell 5.1, cmd, Git Bash).

```text
git -C 2026-spd-shop-pricing log --oneline --grep PRICE-42
git -C 2026-spd-shop-pricing log -3 "--format=%h %s%n%(trailers)" 69f021c
git -C 2026-spd-shop-pricing log --merges --grep PRICE-42 "--format=%h %s | %(trailers:key=Accountable,valueonly)"
gh pr list -R koldovsky/2026-spd-shop-pricing --state all --search "PRICE-42 in:title" --limit 50
gh pr list -R koldovsky/2026-spd-shop-workspace --state all --search "PRICE-42 in:title"
gh pr checks 17 -R koldovsky/2026-spd-shop-pricing
gh run view 45240838007 -R koldovsky/2026-spd-shop-pricing
go version -m 2026-spd-shop-pricing/go/pricing.exe
```

`gh pr checks 17` exits 1: the Kotlin parity workflow also ran on that Go PR and was red (it does not build `go/`;
the PR has a comment saying so). Keep PR searches scoped to one repo and to titles (`-R <repo>`, `in:title`). An account-wide `gh search prs PRICE-42`
without `--match title` also lists unrelated repos of the same account.
