# Group 1 — Twenty Independently Executed Live Supabase Checks

**Document ID:** SMFGU-QA-GROUP1-SUPABASE-020-20261102
**Project:** THE STOCK MARKET: FROM THE GROUND UP
**Version:** 1.0
**Status:** LIVE READ-ONLY CHECKS COMPLETED; TARGETED PUBLIC COPY FIX APPLIED; FULL RELEASE ACCEPTANCE OPEN
**Recorded:** November 2, 2026
**Filename:** `2026-11-02_GROUP1_20_LIVE_SUPABASE_CHECKS_V1.md`
**File type:** Markdown
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main`
**Google Drive location:** None; no Drive document ID was created.
**Dependencies:** Supabase project `oxihglyfgzywsupnyicb`, founder plan contract, canonical 419-Lab registry, Cloudflare CI, authenticated role/browser acceptance
**Purpose:** Preserve the exact scope of twenty independent live SQL verification operations and their actionable findings; distinguish an owner's content approval from tested production behavior.

## 1. Independently executed checks

| # | SQL verification | Result | Interpretation |
|---|---|---|---|
| T01 | Publicly visible membership plans | Exactly FREE, FOUNDING_14, FOUNDING_30, FOUNDING_60 at 0, 2299, 4999, 5999 cents | PASS: public plan inventory |
| T02 | Hidden-vs-visible plan totals | 4 visible; 7 hidden | PASS: plan visibility configuration |
| T03 | Publicly visible tool release/checkout states | INTERACTIVE_LEARNING, JOURNAL_ANALYTICS, MARKET_SIMULATOR, MARKET_TUTOR each active, live, public_visible, checkout_enabled | VERIFIED CONFIGURATION ONLY: no purchase transaction tested |
| T04 | RLS on Chart workspace / Academy progress / Lab progress | Four checked tables all have RLS on | PASS: RLS enabled, not proof of every policy |
| T05 | Direct grants for private Chart workspace and Academy progress | No direct anon/member SELECT or anon INSERT on sensitive checked tables | PASS: observed permission boundary |
| T06 | Learning table inventory | Required Academy/Lab tables present, including registry, attempts and protected cases | PASS: schema inventory, not content validity |
| T07 | Canonical platform Lab row count | 419 | PASS: registry total |
| T08 | Canonical Lab column structure | Contains IDs, title, registry visibility, sample flag, historical metadata | PASS: expected schema |
| T09 | Boot Camp Academy audit structure | Program code, day, member, event kind, revision before/after and timestamps present | PASS: audit schema; event content not evaluated |
| T10 | Academy protected cases/checkpoint/enrollment and Lab attempt RLS | Five relevant tables all have RLS on | PASS: RLS existence |
| T11 | Direct protected-training data grants | No anon or authenticated SELECT on checked protected cases, sets, or attempts | PASS: direct exposure boundary |
| T12 | Public member-plan descriptions | Founding 14-Day description used legacy Sparks term; other founder cadences and Free plan inspected | DEFECT FOUND, subsequently corrected |
| T13 | Private chart workspace policies | No public pg_policies rows for workspace table | EXPECTED WITH DIRECT GRANTS REVOKED: access through privileged validated API requires separate acceptance |
| T14 | Lab ID uniqueness | 419 rows, 419 unique Lab IDs | PASS |
| T15 | Lab active/registry/sample flags | 419 active; 419 registry-visible; 3 public samples | PASS: flags, not per-Lab completion |
| T16 | Lab title and ID completeness | 0 missing titles; 0 missing IDs | PASS |
| T17 | Historical ticker/date field coverage | 122 with both fields; 297 with neither | INVENTORY ONLY: conceptual Labs may legitimately lack market-specific historical examples |
| T18 | Lab public-sample distribution | 3 public sample, 416 not public sample; all active and registry-visible | PASS: verified metadata |
| T19 | Legacy Sparks label in public plan descriptions | FOUNDING_14 had legacy wording, others did not | DEFECT FOUND; corrected |
| T20 | Legacy Sparks label in public tool descriptions | None in 4 active, public tools | PASS |

**Execution count:** 20 separate SQL statements executed against the connected live Supabase database; no SQL simulations, test fixtures, or fabricated success results are counted. These are verification executions, not 20 deploys or 20 completed user-facing features.

## 2. Corrective action and independent verification

Applied a narrow, member-facing terminology update to `public.platform_plans` for `FOUNDING_14` only: `Crownlight Sparks` → `Crownlight Lumens`. An independent post-update SELECT confirmed `legacy_label=false`, `correct_label=true`, `price_cents=2299`, `active=true`, and `public_visible=true`. No charge, account entitlement, credit balance, pricing or visibility flag was changed.

The idempotent source counterpart is `supabase/migrations/20261102_founder14_public_lumens_label_v1.sql`.

## 3. Controlling owner approval and independent-release boundary

The owner's November 2 approval of **all Boot Camps, all Labs and learning records** is already recorded in `docs/learning/2026-11-02_OWNER_APPROVAL_ALL_LABS_AND_BOOT_CAMPS_V1.md`. That document remains controlling. This technical batch does not override its boundary: course content is owner-approved, while authenticated member acceptance, graded-answer protection, independent course/day review, paid entitlements, and final release CI remain separate verification requirements.

The count 419/419 refers to published registry records, **not** 419/419 independent educational acceptance. The checked 122 historical mappings are **not** equivalent to all historical provenance being complete.

## 4. Pending release gates

1. Resolve exact current Cloudflare build failures with identifiable failure logs before modifying code blindly.
2. Verify authenticated Free/Founding/Owner/Admin/Moderator navigation and cross-account Lab/Chart progress isolation.
3. Complete the real Chromium homepage hover / keyboard and Chart Studio visual acceptance.
4. Reconcile source and production SHAs; accept only successfully tested exact commit.
5. Preserve `main`-only workflow, existing providers, $0 additional paid services and no live charges.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Recorded 20 independently executed live SQL checks and the narrowly scoped naming correction |

**Footer:** Crown & Lantern Press · SMFGU-QA-GROUP1-SUPABASE-020-20261102 · v1.0 · Verified configuration only; final production acceptance open.
