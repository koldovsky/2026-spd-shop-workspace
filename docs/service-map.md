# Service map

| Service | Repo | Stack | Port | Owner | Calls |
|---|---|---|---|---|---|
| web + BFF | `shop-web` | Next.js 16 | 3001 | web team | pricing, orders |
| orders | `shop-orders` | Kotlin, Spring Boot 4, PostgreSQL | 8081 | orders team | pricing |
| pricing | `shop-pricing` | TypeScript, Express 5 | 8082 | pricing team | — |

Flow: the web UI lists products and prices through its BFF (`/api/products` → pricing `/catalog`, `/prices/:sku`).
Placing an order: web → orders `POST /orders` → pricing `POST /quote` → orders stores the priced order.
