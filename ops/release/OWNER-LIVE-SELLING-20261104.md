# Owner decision — Crownlight LIVE sales during Founding Beta

Document ID: SMFGU-OWNER-LIVE-SELLING-20261104  
Project: THE STOCK MARKET: FROM THE GROUND UP  
Repository: Adissel/stock-market-from-the-ground-up-Live  
Filename: ops/release/OWNER-LIVE-SELLING-20261104.md  
Type: Markdown  
Version: 1.0  
Decision effective: 2026-11-04 (America/Chicago)  
Status: OWNER-AUTHORIZED LIVE SALES; SKU-SPECIFIC FULFILLMENT ACCEPTANCE REQUIRED  
Google Drive location: Not created; GitHub is source of record.  
Google Drive file ID: Not assigned.  
Dependencies: Stripe LIVE account and signed webhooks, Supabase private fulfillment, canonical Cloudflare production, catalog sale-readiness, independent customer QA.  
Purpose: Preserve the Owner's explicit live-selling decision while enforcing truthful product-by-product readiness.

## Binding Owner decision

The Owner explicitly confirmed on 2026-11-04 that the website is LIVE selling in the existing Founding beta phase, and the six Cloudflare production variables **must remain literal `true`**:

- `GU_PAYMENT_LIVE_LAUNCH_APPROVED`
- `GU58_LIVE_CHECKOUT_ENABLED`
- `GU58_LIVE_WEBHOOK_ENABLED`
- `GU_F600_LIVE_CHECKOUT_ENABLED`
- `GU_F600_LIVE_WEBHOOK_ENABLED`
- `GU_F600_LIVE_FULFILLMENT_APPROVED`

Correct the prior prelaunch guard: inspect the approved Yahoo-master Cloudflare account and production branch; fail closed if one of these six is missing, not plaintext, or not `true`. This decision does **not** permit deploying to another Cloudflare account, inventing a GitHub secret, skipping signed Stripe webhook verification, or granting unauthorized products.

## Confirmed commercial scope and remaining SKU gates

Founding 14-, 30-, and 60-day plans: intended for LIVE sale; inspect actual Stripe prices, the shared 600-capacity ledger, renewals, cancellation, reversals and genuine member grants before declaring full acceptance.

Five books: Owner requests LIVE sale. Production lists all five in Stripe and holds private EPUB versions and rights attestations. At audit, the first three Foundations books and Reading the Tape were marked sale-ready; Day Trading still had unreleased catalog and sale controls. Do not claim the fifth book is sellable until those are reconciled and current private delivery proves eligible.

Lumen Store: Existing member-funded **redemptions** are distinct from new cash purchases of credits. The five newer Stripe bundle IDs in the database were TEST-mode and issued shadow credits only; do not repoint them at LIVE or label them sellable until a Stripe LIVE price, signed webhook, real-wallet credit, refund/reversal, non-expiry and concurrency path pass independent tests. Keep unreleased awards and gifts guarded.

Do not charge real customer payment methods merely for QA. Continue to publish what is actually ready for beta and distinguish coming-soon SKUs clearly.

## Release controls

1. Six LIVE flags must be `true`; GitHub Actions secret `SMFGU_LIVES_PAGES_DEPLOY` remains required for authenticated provider inspection.
2. Canonical Pages project, account, repository, branch and production SHA must match.
3. Stripe LIVE price, amount, recurring cadence and webhook destination must match server-owned catalog records for each sellable SKU.
4. Fulfillment must be signed, idempotent, private and reversible; downloads must be rights-attested.
5. Do not release unreviewed graded awards, gifts, physical items, proprietary data, unaccepted Boot Camps or research claims just because the website is commercially LIVE.

## Revision history

| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 2026-11-04 | Recorded explicit Owner LIVE selling decision and SKU-specific release boundaries | Owner decision recorded; verification in progress |

Footer: SMFGU-OWNER-LIVE-SELLING-20261104 | v1.0 | A sales flag is not proof of regulatory, legal, or fulfillment readiness.
