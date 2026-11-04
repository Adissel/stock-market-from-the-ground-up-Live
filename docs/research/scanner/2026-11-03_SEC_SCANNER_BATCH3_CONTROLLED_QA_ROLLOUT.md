# Crownlight SEC Scanner — Batch 3 QA Rollout and Release-Gate Controls

| Document field | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SEC-SCANNER-QA-ROLLOUT-003 |
| Filename | `docs/research/scanner/2026-11-03_SEC_SCANNER_BATCH3_CONTROLLED_QA_ROLLOUT.md` |
| File type | Markdown |
| Version | 1.1 |
| Status | DEVELOPMENT / QA-ONLY; NOT GENERAL COMMERCIAL RELEASE |
| Effective date | November 3, 2026 |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | PR #54 merged; PR #56 source-tier implementation; existing `WATCHLIST_WORKBENCH` and `CATALYST_RESEARCH` tool contracts; controlled Supabase SEC grants; Cloudflare Pages Free 64-binding ceiling; SEC fair-access coordination |
| Purpose | Preserve SEC source access as an audited single-member QA cohort until actual authenticated issuer research and all release gates are accepted |

## Owner-control decision

The user's screenshots describe **STOCK scanner presets**, not SEC filing presets. The SEC research product is a separate issuer-file search with Basic, Plus, Advanced and future Professional. This batch does not change the existing five legacy stock presets, 43 additional stock rule recipes, Champion configurations, membership plans, Founder access, Stripe billing, credit wallets or educational assessments.

## Source-activation policy

**Free-plan binding constraint and verified incident:** The connected production Pages deployment failed when three proposed SEC variables increased the Worker from 64 to **67** bindings (60 customer variables plus four platform bindings, plus three additional variables). The three newly added SEC variables were removed. Production returned to its original **60** customer-defined variables. The exact original source deployment was retried, and no paid-plan upgrade is authorized.

**Default QA access:** When the Cloudflare `SEC_EDGAR_BETA_ENABLED` binding is **absent**, SEC retrieval defaults to **audited QA-only**. The server checks an active authenticated member session, current Catalyst or Watchlist product access, and an active, nonexpired SEC tier grant on the same user ID. Unknown, revoked or malformed grants fail closed **before** any SEC request or global quota charge. The owner-controlled grant ledger already exists; no new database activation table or Cloudflare variable is required.

**Emergency OFF:** Setting `SEC_EDGAR_BETA_ENABLED=false` explicitly denies SEC retrieval, including for QA members. The preview environment currently has this setting and **no Supabase service secrets**. Production has no SEC environment variables. Revoking the QA account's audited SEC grant also blocks its source access immediately without changing its normal membership or Watchlist entitlement.

**SEC contact identification:** The server uses the verified organizational contact identifier `Crownlight Research stockmarketfromthegroundup@gmail.com` when no environment override is set. This is public contact information, not a secret. Malformed or header-injection values are rejected. The SEC's publicly documented automation limit remains 10 requests per second across machines; the original Supabase-coordinated budget is still mandatory.

**General release remains held:** An explicit general-member release would require **both** `SEC_EDGAR_BETA_ENABLED=true` and `SEC_EDGAR_GENERAL_RELEASE_APPROVED=true`, as well as independent acceptance. Neither binding is configured in production, and this batch does not authorize enabling them, pricing new tiers or creating broad access.

**Data model:** One issuer per authenticated request. Filing acceptance does not prove first public dissemination or intraday trade eligibility. No automatic market-wide scan, live exchange data, trading signals, promotional claims, Professional monitoring or real-money transaction functions.

## Zero-new-binding environment procedure

1. Preserve the original Cloudflare production variables, current secret bindings, existing SEC shared request-budget RPC and FREE plan. Do not enable a paid Workers tier.
2. Reverify that the three temporary production SEC variables were removed; confirm the project is back to 60 named production bindings and preview is disabled.
3. Confirm a successful deployment at the exact approved merge SHA. A GitHub CI pass does not establish Cloudflare deployment success.
4. QA source release, when the code is deployed, is allowed only for a genuine authenticated and audited SEC-granted member; new customer accounts cannot inherit a QA grant.
5. Revoke the QA grant with the existing Owner-only audited RPC if an emergency restriction is needed; preserve the member's purchased tools and account.
6. Verify the unauthenticated 401, non-entitled 403, entitled-without-grant 403, QA with verified issuer and global quota 200/429, and source unavailable 503 behaviors using actual signed-in sessions.
7. Real two-account browser access, screen reader, mobile and keyboard acceptance remain separate human-observed release gates. Do not represent synthetic fixtures as genuine sessions.
8. Keep Professional comparisons, 24/7 polling, trading recommendations and commercial SEC membership activation unavailable pending separate implementation and reviews.

## SEC member and Owner tests

- Empty grant → denied in controlled beta; active audit grant → allowed; expired/revoked → denied; malformed data → source unavailable.
- Original Watchlist SEC route and new SEC Scanner route both share the same pre-network restriction, with separate original entitlement checks.
- Basic/Plus/Advanced authorization remains server-derived. Only Advanced may request XBRL; Plus receives accepted-time evidence; Basic cannot request those attributes through the new SEC endpoint.
- Owner grant editor may save only after loading the same selected target and current revision; an edited account UUID requires explicit reload.
- Database audit is append-only by application permissions, optimistic locking rejects stale versions; service-role-only RPC verifies Owner from stored roles.
- Two distinct **authenticated** members, browser keyboard/screen-reader/mobile tests and live source response checks remain independent of Node fixture tests.
- Temporary QA grants should have explicit expiry and reasons; no paid billing changes or test account passwords are required or recorded here.

## Technical acceptance

| Gate | Evidence required | V1 status |
|---|---|---|
| Parent SEC four-tier source PR | 45 passing workflows, production SHA | Accepted source-level |
| Batch 2 owner ledger and API | 46 passing workflows, RLS and audit | Source/database verified; general release held |
| Batch 3 QA source guard | GitHub exact commit and dedicated tests | Pending current CI |
| Cloudflare guarded production activation | Exact SHA, config variables and source-budget probe | Pending |
| Real two-account SEC access denial/isolation | Signed-in accounts, save/reload/source access | Pending |
| Accessibility | Actual keyboard, mobile and reader evidence | Pending |
| LIVE approval | Commercial rights, pricing/entitlement acceptance and formal release | HOLD |

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-03 | QA-only SEC upstream guard, explicit general release flag, source-contact validation, target account revision guard and regression tests |
| 1.1 | 2026-11-03 | Restore Cloudflare Free-plan binding ceiling; eliminate added production SEC variables; default source access to audited QA grants and preserve explicit emergency OFF |

**Footer:** Controlled source engineering artifact. Does not certify SEC redistribution rights, precise public dissemination timing, financial advice, legal compliance, or member-facing commercial release.
