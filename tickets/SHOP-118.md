# SHOP-118 — Show discounted prices on product cards

Product cards in shop-web show only the base price. SKU-3 has a 15% promo that customers see only at checkout.

**Acceptance**
- pricing `GET /prices/:sku` also returns `discountedCents` (promo applied, half-even, ADR-007) and the contract is updated.
- shop-web product cards show the discounted price, with the base price struck through when they differ.
- Tests in both repos; same ticket key in every PR.
