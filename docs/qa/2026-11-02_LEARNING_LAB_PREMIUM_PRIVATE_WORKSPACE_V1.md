# Learning/Lab Editions — Protected Workspace Implementation and Release Gate

**Document ID:** SMFGU-ENGINES-WORKSPACE-QA-001  
**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Filename:** `2026-11-02_LEARNING_LAB_PREMIUM_PRIVATE_WORKSPACE_V1.md`  
**File type:** Markdown  
**GitHub location:** `main/docs/qa/`  
**Google Drive location:** Not assigned; no Drive document ID created  
**Version:** 1.0  
**Status:** Database migration applied; source implementation committed; CI, genuine-member acceptance, and exact-current-SHA release signoff OPEN  
**Date:** November 2, 2026  
**Purpose:** Control the next Learning/Lab edition implementation without confusing written tests, source prototypes, and production acceptance  
**Dependencies:** Frozen Learning v3.3, Lab v3.2, 419 original Lab IDs, `site_subscriptions`, `toolAccess`, Supabase Auth, Cloudflare Pages, owner editorial approvals and existing source-rights restrictions.

## Implementation inventory

1. `supabase/migrations/20261102_learning_lab_edition_workspaces_v1.sql`: private additive table with user ID, family, edition, Lab case key, computed ungraded summary, revision and timestamps.
2. `functions/api/learning-lab-edition-exercise.js`: reusable authenticated plan/product-edition release verification, server-calculated fictional-only analysis.
3. `functions/api/learning-lab-edition-workspace.js`: private GET and revision-checked POST, denies expired, downgraded, revoked and unapproved edition grants; validates existing visible canonical Lab before storage.
4. `assets/js/learning-lab-edition-panel-v1.js`: keyboard-accessible optional Save/Restore; sign-out and account-change scrub; no stored answer keys or grades.
5. `assets/js/lab-player.js`: passes the existing canonical Lab ID through the authenticated authorized player, without changing the underlying nine-stage progress.
6. `tests/learning-lab-edition-workspace-v1.test.mjs`: simulated authorization, revocation, CAS conflict, stored-scope and canonical Lab contract checks.
7. `.github/workflows/learning-lab-premium-editions-v1.yml`: source syntax, authorization, workspace and member-UI test gates.

## Live Supabase evidence

The 20 independent, read-only preflight SQL audits succeeded. The new table did not previously exist. Its additive SQL migration was applied to the existing stock-site Supabase project. Postflight confirms: table exists; RLS enabled; anonymous SELECT denied; authenticated direct SELECT/INSERT denied; service-role INSERT permitted; zero records created. No existing Lab, Academy, Journal, commerce, book, question-bank or member data was changed by the migration.

The existing `site_subscriptions` table grants SELECT to authenticated users under a self-owned RLS policy and gives DML only to service role. No subscription currently carries `engine_edition_grants_v1` metadata. Therefore the new premium APIs are **not released to ordinary members** by plan target alone. No premium entitlements, Stripe products, charges or checkout flags were activated.

## Security and product boundaries

- Source-authoring and Owner instructional/editorial approval are preserved, but are not a technical or legal source-rights attestation.
- Lab IDs are verified against `platform_labs` with `active` and `registry_visible` requirements. SITE_EXCLUSIVE also requires `ONDEMAND_TRAINING` access.
- Direct membership does not create a premium engine grant: the API requires independently verified user identity, active tool authorization, an active subscription, explicit matching `engine_edition_grants_v1`, a nonexpired unrevoked family-tier grant, and an explicit server release flag.
- Only completed fictional OHLC data are used by this endpoint. Client-asserted historical provider rights and indicator results do not become trusted server evidence.
- No official mastery, protected grading, payment, order, journal or historical market-data writes.
- Saved summaries are server-recomputed, bounded and private; revisions protect against stale-write conflicts. Records are retained after a downgrade but denied until entitlement is reverified.
- Source tests are **not** equivalent to a real two-account or assistive-technology test. Claims of full accessibility, safety certification and complete Learning/Lab integration are not accepted here.

## Verification and release controls

**Passed:** 20 separate SQL preflight audits; Supabase migration result; RLS/grant/empty-table postflight checks; GitHub source commits.  
**Open:** GitHub Actions completion, dedicated source+API+workspace test conclusions, two genuine accounts with different grants, account switch and cancellation/expiry behavior in a browser, protected content verification, assistive-technology acceptance and exact latest-GitHub-SHA Cloudflare production success.

**Rollout:** Keep all `ENGINE_LEARNING_*_RELEASED` and `ENGINE_LAB_*_RELEASED` flags unenabled until evidence passes. Do not enable live checkout or seed subscriptions to work around missing grants.

**Rollback:** If the member interface or endpoint malfunctions, leave release flags disabled, revert the affected GitHub source commits, and redeploy only after exact-SHA acceptance. Preserve the empty additive table for rollback compatibility. Do not DROP a table containing member evidence; any eventual deletion requires a separately approved retention/export plan.

## Revision history

| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-11-02 | Applied the private edition workspace, documented tests, rights and release restrictions | Source implementation, release QA open |

**Footer:** SMFGU-ENGINES-WORKSPACE-QA-001 · v1.0 · November 2, 2026 · Owner editorial authorization preserved · Technical acceptance conditional.
