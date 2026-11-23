# Contracts index

All money is **integer cents**. Prices are computed only by shop-pricing.

## pricing

Full contract: [`contracts/openapi.yaml`](https://github.com/koldovsky/2026-spd-shop-pricing/blob/main/contracts/openapi.yaml) in shop-pricing (PRICE-42); the golden corpus there pins exact responses.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/catalog` | — | `[{ sku, name }]` |
| GET | `/prices/:sku?currency=EUR` | — | `{ sku, currency, baseCents }` |
| POST | `/quote` | `{ currency, lines: [{ sku, quantity }] }` | `{ currency, lines: [{ sku, quantity, unitCents, discountCents, lineCents }], subtotalCents, cartDiscountCents, taxCents, totalCents }` |

Currencies: EUR, USD, UAH. Quantity 1..100. Rounding: half-even, once per line and once per total (ADR-007).

## orders

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/orders` | `{ customerId, currency, lines: [{ sku, quantity }] }` | 201 order |
| GET | `/orders/{id}` | — | order |
| GET | `/orders?customerId=` | — | orders, newest first |
| POST | `/orders/{id}/cancel` · `/confirm` | — | order (only from NEW) |

Order: `{ id, customerId, currency, lines, totalCents, status: NEW|CONFIRMED|CANCELLED, createdAt }`.
