# Crownlight SEC Scanner — Batch 2: Server-Tier Enforcement and Owner Administration

| Document-control field | Recorded value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SEC-SCANNER-TIER-ENFORCEMENT-002 |
| File | `docs/research/scanner/2026-11-03_SEC_SCANNER_BATCH2_TIER_ENFORCEMENT.md` |
| Type | Markdown (.md) |
| Version | 1.0 |
| Status | DEVELOPMENT PR — security CI and authenticated release acceptance pending |
| Date | November 3, 2026 |
| Google Drive location | Not created; GitHub is the current source of truth |
| Google Drive document ID | Not assigned |
| Parent | PR #54, four-tier SEC source catalog and form filter |
| Dependencies | Existing advanced-tool authorization, Catalyst Research entitlement, SEC global fair-access budget, official SEC issuer normalizer, Cloudflare Pages, ECharts, Supabase Auth and PostgreSQL |

## Scope developed in this batch

- New SEC Scanner read-only API `/api/sec-scanner-tier-v1` computes effective tier on each authenticated request.
- New `/api/sec-scanner-research-v1` isolates Basic/Plus/Advanced responses, uses the original official SEC issuer retrieval engine and the preexisting database-coordinated SEC request budget.
- Existing `/api/sec-issuer-research-v1` remains the legacy WATCHLIST_WORKBENCH endpoint, with its preexisting tool entitlement and response shape; its core is exported for safe code reuse rather than copied.
- Baseline BASIC requires an active CATALYST_RESEARCH entitlement. Existing Watchlist entitlement is never replaced or silently downgraded. No free-tier grants are created.
- A member receives PLUS/ADVANCED only when a valid, nonexpired, active, versioned server-side SEC grant exists. Revoked/expired grants revert to BASIC, provided the underlying Catalyst tool entitlement remains valid. Unknown/malformed grants deny access.
- BASIC returns verified issuer and filing-date research without the Plus timestamp evidence fields. PLUS receives the filing-acceptance research and the prior 24h/72h verified evaluator. ADVANCED can request official financial observations. PROFESSIONAL is not grantable or implemented.
- Add owner-only `/api/owner-sec-scanner-tier-v1`, one-account lookup, expected-revision update, reasons, expiry, and ledger auditing. OWNER is checked by server against trusted role records and independently by the SQL function.
- Add private Supabase migration `20261103_sec_scanner_tier_grants_v1.sql` containing a restricted user-tier table, an append-only audit table, row-level security, least-privilege grants, a transaction-scoped advisory lock, and a service-role-only owner-validated RPC. **Migration is staged only; do not deploy directly until source CI is green.**
- Add read-only entitled Catalyst UI, SEC filing chronology, Plus acceptance-time display, Advanced XBRL table/chart, source-link checks, session revalidation, accessibility labels and responsive styles. Optional Owner controls become visible only after server Owner verification.
- Add the dedicated Batch 2 CI workflow and hostile-case tests with the original SEC budget and legacy Watchlist contract in the regression chain.

## Source-verified boundaries

SEC submissions and companyfacts are authoritative **issuer-reported records**, not exchange price feeds, trades or recommendations. SEC EDGAR acceptance timestamps do not establish earliest public dissemination, member observation time or trade-entry eligibility. A failed source fetch, expired grant, missing issuer identity, SEC budget exhaustion, or changed authentication must fail closed; unknown timestamps must not be treated as zero or a negative filing match.

SEC primary sources: [EDGAR API documentation](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) and [SEC automated access requirements](https://www.sec.gov/about/webmaster-frequently-asked-questions). Supabase security reference: [database function security](https://supabase.com/docs/guides/database/functions).

## First-source security gates

| Gate | Current scope | Acceptance |
| --- | --- | --- |
| Auth | Verified Supabase bearer token and Catalyst entitlement | Unit/fixture CI, then genuine two-account authenticated browser test |
| Tier rights | Basic/Plus/Advanced validated server-side; no query-supplied tier | CI + database migration acceptance |
| Data minimization | Basic cannot access acceptance-time details; Plus cannot request companyfacts | Endpoint regressions + browser verification |
| Privileged grant | Owner-only role check, transactionally audited optimistic revision control | SQL staging plus owner/stale/conflict tests |
| Budget | Reuse shared Supabase SEC request budget | Existing source tests + beta quota verification |
| Privacy | No public migrations, no service keys to browser, no cross-account grants | Pages build + two-account authenticated acceptance |
| Presentation | Accessible numeric table and source links, keyboard/mobile controls | Source tests + manual screen-reader/mobile QA |
| Release | Exact merged commit SHA and deployed Cloudflare identifier | Not yet accepted |

## Next execution, in strict order

1. Open this batch as a stacked PR against the parent SEC-tier PR; run all new and existing relevant CI.
2. Resolve every regression failure on the exact branch head; do not suppress tests.
3. Verify the additive migration under the correct Supabase project. Apply it only after SQL review and source CI; no existing grants or billing records are touched by the migration.
4. Run read-only RLS, role permissions, function execute grants and audit history checks; verify that PUBLIC, anon and authenticated cannot call privileged functions.
5. In the existing owner test identities, validate real authenticated grant writes with expected revision, wrong-account denial, expired/revoked fallback, and no cross-account leakage.
6. Verify real SEC retrieval is controlled by the shared budget; no free access, batch all-issuer polling, unlicensed redistribution or live trading signals.
7. Complete screen-reader/keyboard/mobile and refreshed sign-in QA, Cloudflare preview and exact deployed SHA; then make separately approved rollout decisions.
8. Preserve Professional multi-issuer and market-wide monitoring as blocked scope. Preserve Champion signatures, original stock presets, paid subscriptions, Free access, Founder access and existing Watchlist SEC privileges.

## Revision record

| Version | Date | Description |
| --- | --- | --- |
| 1.0 | 2026-11-03 | Server-side SEC tier scoping, Owner audit ledger/API, single-issuer research UI, tests and staged migration |

Footer: SEC Scanner development candidate, not a LIVE release, independently audited security system, investment recommendation, professional legal opinion or Stripe price approval.
