# Guided Stock-Market Education and Practice — Competitive Benchmark V1

**Company:** Cyber Nexus / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — Crownlight guided-learning release
**Document ID:** SMFGU-GUIDED-LEARNING-BENCHMARK-001
**File type:** Markdown (.md)
**Filename:** SMFGU-GUIDED-LEARNING-BENCHMARK-001-v1.0-20261101.md
**Authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/competitive/` on `main`
**Google Drive location / document ID:** Not created / not assigned; a new Drive file is required if synchronized separately.
**Version:** 1.0
**Created / last reviewed:** November 1, 2026
**Status:** SOURCE-LEVEL COMPETITOR BENCHMARK AND REPRODUCIBLE SMFGU AUDIT IN PROGRESS; NOT MEMBER, EDITORIAL OR DEPLOYMENT ACCEPTED
**Purpose:** Establish a consistent, cost-free baseline against three direct guided-learning competitors and identify testable deficiencies in our existing, single shared learning architecture.
**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `docs/prototype/SMFGU-PROTOTYPE-012-v1.0-20261101.md`, `scripts/guided-platform-quality-audit-v1.mjs`, shared Lab Engine v3.2 / Learning Engine v3.3, the existing Owner-only Prototype Center, 419 canonical Labs, 274 Boot Camp study days, five Free Foundations days, Cloudflare Pages, Supabase/RLS, and private server-owned graded assessments.

## A. Competitor baseline — public first-party product claims, not a simulated user account

| Competitor | Official product evidence checked November 1, 2026 | What we can verify without a subscription | What remains unverified |
| --- | --- | --- | --- |
| Finelo | https://finelo.com/app | Advertises a 28-day guided challenge; one concept/day; quiz/scenario; simulator; explanatory AI Mentor; progress streaks | Actual onboarding friction, paid membership terms, correctness and timing of feedback, transfer quality, persistence under real accounts |
| Invstr | https://app.invstr.com/ | Advertises 159 Academy lessons in nine modules; quizzes; financial literacy score; $1 million virtual portfolio; leagues | Live beginner journey, grading validity, formative correction quality and cross-session continuity |
| Trading Game | https://tradinggame.com/ | Markets guided education, practice charts, simulated decisions and progress features | Current hands-on feature availability, numerical accuracy, account persistence, independent transfer quality |

These external features are provider-published claims, not independently observed member session outcomes. This register never treats inaccessible or subscription-gated features as tested.

## B. Standardized beginner workflow — same tasks for all four products

**Synthetic study case (our test fixture only, not a claim about competitors):** Completed five-minute OHLCV candle at 10:05 ET: O=$20.00, H=$21.50, L=$19.50, C=$21.00, V=1,000. Body=$1.00; range=$2.00; upper wick=$0.50; lower wick=$0.50; body-to-range=50%. If high equals low, body-to-range is undefined, not zero. No hypothetical next-bar signal or profit is implied.

1. **Onboarding/access:** Begin with no prior stock knowledge; inspect sign-in requirements, restricted curriculum and hidden paywalls without creating an actual paid purchase.
2. **Concept:** Locate beginner candlestick instruction and verify a plain-language explanation of OHLC, body, range, wick and volume.
3. **Worked math:** Recalculate the example with declared prices, units, complete-bar boundary and a zero-denominator limitation.
4. **Chart practice:** Interact with a completed-bar chart/replay; inspect evidence without revealing future candles.
5. **Independent decision:** Record a defensible observation and a WAIT/NO TRADE alternative; no simulated return determines correctness.
6. **Specific correction:** Submit a deliberately incorrect inference, then verify that corrective teaching identifies the precise mistake and explains it.
7. **Fresh transfer:** Present a different previously unseen fictional candle to test retained understanding without copying the worked solution.
8. **Save/resume:** Refresh, sign out, sign back in and verify that only the same authorized learner can retrieve progress; include keyboard/small-screen checks.

**Evidence notation:** DOCUMENTED (official source statement); SOURCE-TESTED (our own deterministic code); BROWSER-TESTED (synthetic/local browser); REAL-ACCOUNT-ACCEPTED (genuinely authenticated server persistence and authorization); NOT VERIFIED. No feature may be assigned a higher status through inference. A competitor has no “PASS” merely because its marketing copy says it offers a feature.

## C. Our verified source inventory and quality risk

- 419 canonical Labs, ten defined Academy programs totaling 274 study days (247 original, 27 restricted instructional Beta), five separate Free Foundations days.
- 30 official competency categories; 73 authored indicator briefs (61 base, 12 extended), 146 guided modules; exactly 16 computed Chart Studio studies. A conceptual Tutor guide is **not** automatically a mathematically computed overlay.
- Source parity defect fixed in `assets/js/prototype-curriculum-parity-v1.js`: Inspector must read both indicator-guide catalogs and both practice catalogs, preserve role gates, and refuse duplicate registry identities.
- GitHub source audit on November 1 found **419/419 explicit ungraded transfer draft objects**, not 419 approved independent transfer assessments.
- November 1 419-Lab source scan found **20/419 source-tagged original subject-specific batches (4.77%)**. **399/419** remaining Lab bodies still share several boilerplate paragraphs; the older exact 413/419 sentence is no longer the accurate current count. This is a repetitive-content editorial review flag, not proof every remaining lesson is factually wrong.
- `scripts/guided-platform-quality-audit-v1.mjs` produces a per-Lab machine-readable list and a SHA-256 source hash, flags high-frequency repeated content, verifies 73/146/274 identity constraints and reports editorial acceptance separately. CI must publish its artifact; pending until the matching workflow completes.

## D. Relative benchmark disposition

| Beginner evidence gate | SMFGU | Finelo | Invstr | Trading Game |
| --- | --- | --- | --- | --- |
| Officially documented guided curriculum | SOURCE-TESTED | DOCUMENTED | DOCUMENTED | DOCUMENTED |
| Worked first-principles calculations | PARTIALLY SOURCE-TESTED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Accessible chart interpretation | PARTIALLY BROWSER-TESTED | DOCUMENTED | DOCUMENTED | DOCUMENTED |
| Accurate error-specific free feedback | PARTIALLY SOURCE-TESTED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Fresh transfer with no-lookahead | DRAFTED; INDEPENDENT ACCEPTANCE OPEN | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Server-private official grades | PENDING FULL ACCEPTANCE | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Cross-account learning-record isolation | PENDING REAL-AUTH ACCEPTANCE | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| End-to-end new-learner completion | PENDING REAL-AUTH ACCEPTANCE | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |

**Do not compute a winner/score:** External onboarding and account conditions differ, no equivalent real-student sample has been evaluated, and a numeric rank would be fabricated.

## E. Technical execution and risk controls

- Keep Cloudflare Pages/Workers, Supabase PostgreSQL/RLS, existing shared learning/assessment engines, member progress, Chart Studio and local ECharts intact.
- React/TypeScript and Three.js remain appropriate for the existing staff-only premium Prototype Center; do not migrate public HTML5/CSS3 and JavaScript pages solely for technology novelty.
- Use ECharts for chart/replay and learning statistics where backed by legitimate data; calculate indicator values using completed bars and the existing first-party indicator math, with transparent warm-up, missing bars, session and VWAP-proxy caveats.
- Use Python in free CI/source audit or offline computation only where a concrete requirement benefits; do not add a Python hosting service or paid LLM provider by default.
- No action in this benchmark changes a private answer key, protected grade, account permission, Supabase migration, purchase entitlement, Stripe product or LIVE money flow.
- Do not infer independent human review from delegated product-owner editorial approval. Preserve finalized B01 and existing frozen policies.

## F. What is next, in execution order

1. Close the actual Prototype Center workflow for the full 73-guide inspector; inspect failed source/browser steps and correct exact errors until passed.
2. Execute and retain the first full 419-Lab quality audit artifact with true repeated-paragraph/subject-specific counts; preserve all 419 IDs and 419 ungraded transfer drafts.
3. Author/review subject-specific source material in meaningful batches. Each candidate requires distinct observed example, conditional inference, math or source procedure where relevant, common trading mistake, limits, and a truly different transfer.
4. Perform a real signed-in Free Foundations beginner sequence and verify member progress from the existing backend. Never award a real grade from the staff prototype.
5. Verify Talia corrections and source retrieval on the same revealed candle and check all 73 indicator teaching references.
6. Verify Chart Studio three-tier entitlement/persistence, 16 actual computed overlays, data licenses and no-lookahead behavior.
7. Close 274-day Academy editorial coverage and official protected-case approval; conduct two distinct authenticated account journeys.
8. Verify approved Founding Member and Lumens access, ledger, cancellation, refund and renewal lifecycle in TEST without LIVE charges.
9. Run equivalent hands-on benchmark journeys with lawful competitor access and a representative learner sample; record task completion and error-recovery outcomes.
10. Require exact-main CI, production SHA, security, accessibility and editorial acceptance before a full release signoff.

## Revision and acceptance history

| Version | Date | Revision | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Three-platform evidence comparison, reproducible instructional task, 419-source quality findings, acceptance matrix | Source record; independently verified deployment and learner outcomes outstanding |

**Document footer:** Cyber Nexus / Crown & Lantern Press — internal competitive engineering and educational acceptance evidence. All observed figures are source-inventory metrics unless expressly labeled otherwise. Not investment advice, a certification, or an independently audited learner-outcome claim.
