# Crownlight SEC Scanner — Batch 3 QA Rollout and Release-Gate Controls

| Document field | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SEC-SCANNER-QA-ROLLOUT-003 |
| Filename | `docs/research/scanner/2026-11-03_SEC_SCANNER_BATCH3_CONTROLLED_QA_ROLLOUT.md` |
| File type | Markdown |
| Version | 1.0 |
| Status | DEVELOPMENT / QA-ONLY; NOT GENERAL COMMERCIAL RELEASE |
| Effective date | November 3, 2026 |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | PR #54 merged; PR #56 source-tier implementation; existing `WATCHLIST_WORKBENCH` and `CATALYST_RESEARCH` tool contracts; controlled Supabase SEC grants; Cloudflare Pages variables; SEC fair-access coordination |
| Purpose | Preserve SEC source access as an audited single-member QA cohort until actual authenticated issuer research and all release gates are accepted |

## Owner-control decision

The user's screenshots describe **STOCK scanner presets**, not SEC filing presets. The SEC research product is a separate issuer-file search with Basic, Plus, Advanced and future Professional. This batch does not change the existing five legacy stock presets, 43 additional stock rule recipes, Champion configurations, membership plans, Founder access, Stripe billing, credit wallets or educational assessments.

## Source-activation policy

**Required base toggle:** `SEC_EDGAR_BETA_ENABLED=true`. Without it, the backend remains unavailable (HTTP 503).

**Required SEC identification:** `SEC_EDGAR_USER_AGENT` must contain a bounded contact-identifying value with a real organizational email address. Never place secrets or personal credentials in this value. Official SEC automated-access guidance currently states a 10-requests/second maximum across machines. The existing Supabase-coordinated request-budget RPC remains mandatory on all upstream requests, including company ticker index, submissions and XBRL company facts.

**Default audience:** When `SEC_EDGAR_GENERAL_RELEASE_APPROVED` is unset, empty or anything other than the exact string `true`, official SEC retrieval is restricted to a current authenticated member who has both (a) the original relevant tool entitlement and (b) an active, unexpired, audited SEC Scanner grant. The grant must be in the allowlisted set BASIC, PLUS or ADVANCED; revoked, expired, malformed or ambiguous records fail closed. The verification is performed **before** any SEC upstream network request or shared quota debit, in the **shared** issuer fetch engine used by both new SEC Scanner and existing Watchlist SEC endpoints. A browser header, query parameter, staff display role or client-side label does not grant access.

**General membership release:** `SEC_EDGAR_GENERAL_RELEASE_APPROVED=true` may be configured only after owner-authorized security, source-rights, authenticated multi-member acceptance and exact-SHA deployment evidence; it is independent of `SEC_EDGAR_BETA_ENABLED`. This batch does NOT approve general member activation or prices.

**Data model:** One issuer per authenticated request. Filing acceptance does not prove first public dissemination or intraday trade eligibility. No automatic market-wide scan, live exchange data, trading signals, promotional claims, Professional monitoring or real-money transaction functions.

## Secure environment procedure

1. Inspect the exact Cloudflare Pages project/account and production/preview binding names without reading or logging secret values.
2. Confirm production has existing `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. Missing preview secrets must **not** be filled with production secret keys.
3. Install and test this shared source gate behind 46/46 passing CI before enabling the beta switch. Deploy with `SEC_EDGAR_GENERAL_RELEASE_APPROVED` unset or explicitly `false`.
4. Set only a verified, organizational SEC User-Agent. Set `SEC_EDGAR_BETA_ENABLED=true` only after confirming the server-gated SHA is deployed.
5. Recheck all preexisting Pages variable names remain intact after any configuration change.
6. Validate an unauthenticated request is 401, non-entitled request is 403, entitled-but-no-QA-grant request is 403, and a valid QA member can retrieve a single issuer subject to the global SEC budget.
7. If signed-in QA credentials are unavailable, record browser source acceptance as NOT VERIFIED, not PASS. Do not issue or simulate JWTs or edit other member accounts.
8. Keep `SEC_EDGAR_GENERAL_RELEASE_APPROVED` false until formal LIVE gates complete. Roll back by disabling `SEC_EDGAR_BETA_ENABLED` if privacy, source identification, budget or account-isolation checks fail.

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

**Footer:** Controlled source engineering artifact. Does not certify SEC redistribution rights, precise public dissemination timing, financial advice, legal compliance, or member-facing commercial release.
