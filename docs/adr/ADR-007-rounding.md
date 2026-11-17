# ADR-007 — Money rounding: half-even, in pricing only

- **Status:** accepted · 2026-10-02 · owners: pricing team
- **Context:** totals differed by a cent between the UI, orders and pricing because each rounded on its own.
- **Decision:** shop-pricing computes with decimals and rounds half-even once per line and once per total.
  Every other service passes integer cents through unchanged; the UI only formats.
- **Consequences:** any new price shown in the UI (for example a discounted price) must come from pricing as cents.
