# Free Market Tutor — Production Entitlement and Authenticated Browser Acceptance

**Document ID:** SMFGU-TALIA-FREE-026
**Project:** THE STOCK MARKET: FROM THE GROUND UP
**Version:** 1.1
**Owner:** Project Owner; implementation delegated to ChatGPT
**Created / verified:** 2026-10-31
**Status:** FREE SOURCE-ONLY TUTOR ACCEPTED FOR TESTED PRODUCTION ACCOUNT; FULL-SITE / FOUNDER / EDITORIAL ACCEPTANCE OPEN
**Filename:** 2026-10-31_free_tutor_production_acceptance_v1.md
**File type:** Markdown
**Google Drive location:** Not created. GitHub Research is the current controlling repository.
**Repository location:** docs/research/talia/2026-10-31_free_tutor_production_acceptance_v1.md
**Branch:** main; direct commits, no feature branches and no force push
**Purpose:** Record the actual live Free Tutor authorization correction, live member QA results, security controls, source truth and unresolved independent acceptance evidence.
**Dependencies:** public.user_has_tool_access(uuid,text); gu_product_access_config_v1; public.platform_tools; public.platform_plans; market-tutor-v01492 API; member-tool-access.js; original source claim register (17 canonical Lab bridges); existing encrypted QA secrets; the existing Cloudflare Pages site.
**Supersedes finding:** Free-plan Market Tutor authorization discrepancy documented in SMFGU-TALIA-QA-025 v1.2; the discrepancy is now resolved for the verified production Free QA account. Other QA-025 blockers are not automatically accepted.

## Approved scope and controlling decision
Market Tutor's original source-based explanations, ungraded concept questions and original approved public-source citations are an eligible Free-member learning benefit. Instructional quality must not change by membership tier once teaching is accessible. This does NOT grant arbitrary paid-only tools, activate optional paid inference, remove quotas, convert resources to proprietary historical data, grant live-market execution, or change membership or Stripe prices.

## Root cause
- Production table `public.gu_product_access_config_v1` had `MARKET_TUTOR.free_access=true` and `policy_mode='legacy'`.
- Production `FREE` plan was active but `includes_all_tools=false`, with no direct Market Tutor plan mapping and no current Free user-plan grants.
- The authoritative `public.user_has_tool_access(uuid,text)` function previously inspected paid/administrative plan grants, subscriptions and tool passes, but did not read the existing `free_access` flag. Thus a signed-in member's basic Free entitlement was absent even while member-facing product configuration said Free was available.
- A `plan_tool_access` mapping alone would not solve accounts without explicit Free grants; changing `includes_all_tools` would unintentionally unlock every premium tool. Neither was used.

## Live change and migration
**Path:** `supabase/migrations/20261031_market_tutor_free_source_access_v1.sql`
**GitHub commits:** `410f37f7991eb108070a1460ec2823d859df20b6` initial; `ddf418de48132c000cdfe87936c1b0d428714ef3` SQL terminator fix.
**Supabase project:** stock-market-from-the-ground-up (ref `oxihglyfgzywsupnyicb`).
**Migration:** `market_tutor_free_source_access_v1`, successfully applied after the initial syntax validation rejection. The initial attempt did not apply a change.
**Server rule:** only when `target_tool='MARKET_TUTOR'`, the released tool is active/live-or-beta, the `FREE` plan is active, and the stored `MARKET_TUTOR.free_access` flag is true may a verified eligible member receive this baseline source-based entitlement. Existing account-kind, deleted-account, suspension/restriction, SHOWCASE_VIEWER, and original paid grant/billing-term checks remain unchanged.
**Privacy and cost:** No paid provider, billing, membership, Stripe, private note, protected grade, Lab ID, or account record was changed. Requests still pass the existing rate/cost boundaries; the model path requires explicit member opt-in and independent paid provider approval and metering.

## Verification after the migration
Read-only live SQL checks returned:
- Installed exact Free entitlement branch: true
- Free-access flag: true; released Tutor enabled: true; Free plan active: true
- Pre-existing verified Free QA identity `MARKET_TUTOR` entitlement: true
- Nonexistent account: false
- Unknown tool code: false
- Free user-plan grants: zero; this is expected and proves no paid/explicit Free grant was necessary.

**Source contract:** `tests/test_talia_free_authoritative_entitlement_v1.mjs` runs in the existing Market Tutor Trust CI. It asserts the specific allowlist, released-tool and identity guards, original paid-term conditions, model opt-in/verified quota, no private history bypass, the safe initialization gate, and truthful Store labeling.

## Real authenticated QA — accepted
**Workflow:** `.github/workflows/talia-free-genuine-browser-qa-v1.yml`
**Test:** `tests/test_talia_free_genuine_browser_qa_v1.mjs`
**Authentication:** Existing pre-approved James_Test identity using encrypted GitHub Actions QA secrets. Sign-in verified expected user ID before any Tutor request. The test refuses to bypass CAPTCHA, charges no money, calls no model provider and does not save private Tutor history.
**Completed production browser:** GitHub Actions run `41219372687` (the 16-check successful run on the deployed Tutor-readiness fix lineage).

### Verified browser assertions
1. A genuine pre-existing Free member signed in.
2. The production access API returned authorized and Free-eligible.
3. Tutor returned its original, source-grounded reply with `allowModel=false` and `saveHistory=false`.
4. No grading, competency mastery, or private history save occurred.
5. Canonical Lab ID `DT-C10-L03` and exact original Investor.gov source citation were present.
6. Assess mode did not disclose the public worked-case blob or complete source-specific worked calculation.
7. An unauthenticated Tutor call returned HTTP 401.
8. The real member-facing Tutor composer became ready, kept optional paid AI unchecked, accepted a question, rendered the answer and a direct safe public-source citation.
9. Logout cleared the session.

The successful run logged **16 passed acceptance checks**. The first QA automation attempt validated the substantive API but encountered a navigation race when waiting on sign-out; that test harness was corrected. A subsequent real UI test uncovered that an extremely early form click could be lost while source/member initialization was unfinished; production source was corrected by disabling Submit until initialization finishes.

## Member-facing initialization and product clarification
- `assets/js/market-tutor.js` waits for complete authorized identity/source initialization, then enables Submit; it refuses an early asynchronous request instead of silently losing it when the view is reset.
- `market-tutor.html` starts Submit disabled as safe static markup.
- `store-tool-market-tutor.html` explicitly distinguishes included Free source-based teaching from optional paid/approved AI-generated enhancements. No price, checkout, product or plan was changed.
- `tests/test_talia_member_entitlement_matrix_v1.mjs` now models baseline Free access without a plan grant, while still requiring a member identity and preserving suspended, restricted, Showcase, non-member and guest denial. Existing quota and private-history boundaries remain in the Tutor trust suite.

## Release / non-acceptance boundaries
**Accepted:** The actual Free-member production authorization and source-only Tutor browser workflow for the tested account, including rendered member-facing citation and protected Assess non-disclosure.
**Not accepted from this evidence alone:** Genuine Founding 14/30/60 subscriber sessions, optional paid AI provider, sitewide browser regression, authenticated private-history cross-account restoration, or the independent editorial/market-data provenance review of remaining 419-Lab / Academy positions. Zero paying Founding customers before launch remains expected and is not independently a product defect.

**Sitewide:** A previously isolated Lab-UX-STD-001 suite passed both 390px and 1280px for OHLC/VWAP; another test then failed on an obsolete Calculate-to-Experiment assumption. Later source changes corrected the related test fixtures, but a completed full-site exact-commit browser result remains the acceptance gate.

**Security advisor scope:** Database security advisors were consulted after the migration; broad existing informational RLS-without-policy notices span unrelated restricted/admin/private tables. This report does not treat those notices as findings introduced by the Free Tutor migration or assert they have all been independently audited.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Applied source-only Free entitlement, verified live SQL, fixed composer readiness and Store description, documented 16-pass genuine Free-member QA and remaining gates | Free Tutor accepted, other scope pending |

**No new Google Drive file is required until a Drive-controlled version is explicitly adopted.**

## Version 1.1 — Responsive regression and claim-specific source improvement
- Focused GitHub Actions `41219701385` on commit `739baaea7f1bf94c8dd5d85318b96b10233040af` **completed successfully**. All four browser tests passed: `test_lab_ux_std001_browser.mjs` (responsive chart-first/predict/Assess), `test_v33_talia_question_flow_browser.mjs` (ten-stage Talia teaching), `test_v33_reference_parity_browser.mjs` (OHLC/VWAP reference values), and `test_v36_candle_slider_and_worked_browser.mjs` (illustrated candle and responsive slider). This clears the specific historical Calculate→Experiment test regression at local source-fixture scope; the complete sitewide browser suite remains a separate acceptance.
- Research correction `11bbf2a4cee3067614109904635498df37f1110d`: Lab `DT-C10-L03` now cites the exact SEC Investor.gov `https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price` rather than a broad glossary-index page. The SEC page defines bid, ask and spread; midpoint/percent-spread examples are *original mathematical derivations*, independently checked rather than externally certified by a source URL.
- Independent arithmetic source guard `tests/test_talia_independent_calculations_v1.mjs` updated at `0a143b469a2daa1e5b57e2a81b9c43a623e7ae7e`; source records remain **17 individually ungraded claims** and three day-specific Academy lessons remain independently editorial-review pending.
- No protected question, market history, paid AI, pricing, or member billing rule was altered.

### Revision history supplement
| Version | Date | Change | Status |
|---|---|---|---|
| 1.1 | 2026-10-31 | Confirmed four focused responsive browser regressions pass and improved one exact SEC quote citation | Free Tutor accepted; complete sitewide / Founder / independent editorial still open |
