<!-- owner: @koldovsky · why: cross-repo work needs one place that sees the whole system · review-by: 2027-02-19 -->
# shop-workspace

Meta-repo of the Shop system. Holds what belongs to no single service: service map, contracts index,
cross-service ADRs, handoff notes, and a way to run everything locally. Service code lives in sibling repos.

## Cross-repo work starts here
- Clone the services next to this repo: `../shop-web`, `../shop-orders`, `../shop-pricing`.
- Start Claude here and add the services: `claude --add-dir ../shop-web --add-dir ../shop-pricing --add-dir ../shop-orders`.
- Added directories give file access only: **their `AGENTS.md`, rules, permissions and hooks do not load**.
  Before changing a service, read `../<service>/AGENTS.md` and follow it. A change inside one service → start Claude in that repo instead.

## Hard rules
- Contracts change in `docs/contracts.md` in the same PR series as the code, same ticket key in every repo.
- Decisions that span services get an ADR in `docs/adr/`.
- End every cross-repo session with a handoff note (`handoff` skill from team-core) in `handoffs/`.

## Map
- Who calls whom, owners, ports: `docs/service-map.md`
- APIs and events: `docs/contracts.md`
- Run locally without Docker: `node scripts/up.mjs` · with Docker: `compose.yaml`
