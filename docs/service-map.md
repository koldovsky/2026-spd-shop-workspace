# Service map

| Service | Repo | Stack | Port | Owner | Calls |
|---|---|---|---|---|---|
| web + BFF | `2026-spd-shop-web` | Next.js 16 | 3001 | web team | pricing, orders |
| orders | `2026-spd-shop-orders` | Kotlin, Spring Boot 4, PostgreSQL | 8081 | orders team | pricing |
| pricing | `2026-spd-shop-pricing` | TypeScript, Express 5 (default); Go and Kotlin builds via `PRICING_IMPL` (ADR-008) | 8082 | pricing team | — |

Flow: the web UI lists products and prices through its BFF (`/api/products` → pricing `/catalog`, `/prices/:sku`).
Placing an order: web → orders `POST /orders` → pricing `POST /quote` → orders stores the priced order.
