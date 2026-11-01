# SMFGU-ENGINE-ARCH-001 — Three-Engine Classroom Runtime Contract

**Company:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**File/type:** `docs/learning/SMFGU-ENGINE-ARCH-001-v1-20261101.md` / Markdown  
**Document ID:** SMFGU-ENGINE-ARCH-001  
**Version:** 1.0 | **Date:** November 1, 2026  
**Status:** Shared read-only classroom contract implemented in source; full premium engines NOT released; production and real-member acceptance depend on exact-main CI and authentication  
**Google Drive folder:** Not created; GitHub main controlling  
**Google Drive document ID:** Unassigned  
**Purpose:** Protect Basic while the three existing shared engines develop independently into higher-capability editions, without duplicating access, grading, payment or progress systems.

## Controlling architecture
- Preserve **Shared Learning v3.3 Basic**, **Shared Lab v3.2 Basic**, **Talia Market Tutor v0.14.0.149 Basic** as frozen operational baselines.
- Separate (1) membership policy *target*, (2) source *presentation version*, (3) actually *released edition*, and (4) *authorized lesson/tool entitlement*. No value in one dimension grants another.
- `functions/_lib/engine-classroom-contract-v1.js` is the single source of the read-only classroom capability envelope. It consumes the existing `enginePolicyForPlan` rather than adding an entitlement lookup or ledger. Member API attaches `classroom` to its current response; no new endpoint or database table.
- Until premium editions are separately built and accepted, every engine reports operational **Basic**; a 419-Lab member is not restricted to the first 20 editorial-upgraded Labs. Available lessons remain governed by the existing entitlement service.
- Content quality: equal first-principles explanations, normal retries and worked arithmetic for every accessible lesson. Premium upgrades may add adaptive orchestration, visualization, comparisons, diagnostics and advanced tools, not exclusive essential explanations.
- No future historical bars before a decision; distinguish fictional, sourced historical, user-provided and trade-print feeds. Chart Study descriptions and mathematical limitations remain traceable.
- Existing member learning progress, protected answer keys, RLS, Chart Studio rights, Tutor paid inference opt-in/quota and Stripe billing are unchanged.

## Technology placement
- **React 19 + TypeScript:** complex member and prototype workspaces, deterministic state, component boundaries, ECharts lifecycle and accessible interaction.
- **Apache ECharts 6.1.0:** same-origin, locally hosted 2D candlesticks, volume, indicators, linked data-zoom, comparisons and analytics. No suggestion that all 61 researched indicator guides are operational computed studies.
- **JavaScript / Cloudflare Pages Functions:** authenticated APIs, dispatchers, existing edge runtime; Supabase maintains authorized progress, roles and access. Do not introduce Python into the Cloudflare JavaScript worker execution path.
- **HTML5 and CSS3:** semantic controls, accessible form/keyboard use, layouts, sizing, alignment, colors and responsive visual design; retain Owner-arrangeable prototype surfaces.
- **Python:** offline data preparation, reproducible quantitative calculations and editorial provenance checks only when free execution and source rights are verified. Python is not prerequisite to browser visuals.
- **3D / AI:** evaluate per feature for compatibility, license, accessible alternatives, performance and actual zero-cost limits; no provider inference or 3D engine is implicitly enabled by a presentation tier.

## Implementation gates (three engines before curriculum-scale authoring)
1. **Basic preservation:** source snapshot + protected grading, progress, entitlements, source-only Tutor, no pay-per-explanation.
2. **One cross-engine classroom envelope:** target versus effective Basic, source version, accessible-lesson boundaries, provenance. *Source implemented in this change; real member browser verification pending.*
3. **Learning Engine:** staged prerequisite diagnostics and adaptive examples with independent correction; no fake mastery.
4. **Lab Engine:** true completed-bar evidence, ECharts comparison, interactive mathematics, replay with no lookahead and protected independent assessment.
5. **Talia:** learning-context and chart-linked teaching with bounded, source-grounded responses; consent, zero-pay default, and usage limits.
6. **Three-engine integration:** account switch, downgrade and saved-progress isolation; Basic member never loses entitled explanations.
7. **Representative test set:** initial 20 revised Lab bridges, five Free Foundations days, selected Boot Camp days and all 61 indicator source briefs; not a claim that remaining 399 are editorially accepted.
8. **Member permissions:** per-plan and individual add-on access determined only from existing protected entitlements; release flags cannot be bypassed via client values.
9. **CI and deployment:** exact `main` SHA for source, sitewide Playwright, Node contracts, Cloudflare; maintain no-charge tests.
10. **Independent premium release:** Owner-authorized rollout only after genuine browser, accessibility, quantitative, source, security and commercial safeguards.

## Revision history
| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Engine-first decision established; cross-engine Basic-only runtime envelope, safety contracts, member status label and synthetic source tests. |

**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `docs/learning/SMFGU-TALIA-EDITION-001-v1-20261101.md`, `functions/_lib/learning-engine-tier-policy-v1.js`, `functions/api/member-learning-engine-versions.js`, existing private Supabase grading/entitlement services.

**Footer:** SMFGU-ENGINE-ARCH-001 · v1.0 · Source implementation ≠ premium release · No paid services or new member-data writes

## Engine-first progress addendum — Learning Engine formative diagnostics

**Feature:** SMFGU-ENGINE-ADAPT-001, November 1, 2026. **Status:** implemented in existing authorized Guided/Practice Lab Player, pending exact-main CI and authenticated browser acceptance.

The new shared-learning aid asks the learner to self-select a prerequisite difficulty and their confidence, then recommends one of four deterministic, lesson-grounded study paths: terminology, calculation, observable evidence, and decision rule. It uses only authorized Lab teaching fields. Missing worked calculations must be declared missing rather than invented.

This is optional formative teaching for all entitled Guided/Practice lessons. It does not create official mastery, separate progress, hidden answer access, user analytics, member writes, paid inference, or feature entitlement. Blind Decision and Assessment do not display this aid. No frozen engine copy was modified, and no premium edition was activated.

**Files:** `assets/js/learning-adaptive-diagnostic-v1.js`, `assets/css/learning-adaptive-diagnostic-v1.css`, `assets/js/lab-player.js`, `lab-player.html`, `tests/adaptive-learning-diagnostic-v1.test.mjs`.

**Next dependency:** quantitative/independent evidence diagnostics, synchronized ECharts Lab tools, then contextual Talia integration with server-authorized feature rights.

**Document control:** Same GitHub main document, no new Google Drive ID, no migration or new system; owner acceptance pending.

## Gate 3 — Evidence-backed calculation diagnosis (November 1, 2026)

**Document control:** SMFGU-ENGINE-ARCH-001 / v1.1 source addendum. GitHub main is the controlling record; Google Drive file and document IDs remain unassigned. **Status:** Source implemented, automated acceptance pending, actual Owner/member browser acceptance not signed off.

**Requirement:** SMFGU-ENGINE-ADAPT-003. The existing Shared Lab Engine sends accepted fictional practice inputs through `smfgu.learning.lab.practice-evidence.v1` to the Learning Engine; responses contain actual numeric comparison, a verified misconception label only for evidence-supported error patterns, a prerequisite, source-grounded correction, independently changed fictional practice, and explicit ungraded/no-mastery flags. Unclassified errors remain unclassified, rather than generating speculative learner diagnoses.

**Source:** `assets/js/learning-evidence-diagnostic-v1.js`; existing Lab journey integration `assets/js/lab-engine-v32-universal.js`, `lab-player.html`; styles appended to `assets/css/learning-adaptive-diagnostic-v1.css`. Unit coverage: `tests/learning-evidence-diagnostic-v1.test.mjs` and `.github/workflows/learning-lab-evidence-v1.yml`.

**Initial verified subjects:** Original authored fictional candle-body percentage and volume-weighted average practice. A different fictional independent calculation is generated, with a fresh numerical check; it has no financial feed, future historical bars, official grade or stored mastery. Expanding to all 419 Labs requires appropriate individually authored numeric or objectively verifiable evidence, not automated inference of misconceptions from arbitrary prose.

**Compatibility:** Both Basic snapshots untouched; original nine saved stage IDs, authorization, RLS, protected assessment, member checkpoint schema, rewards, purchasing and previous progress unchanged. The current combined experience uses JavaScript/HTML5/CSS3, retaining existing ECharts. React/TypeScript and Python are not required for this deterministic edge-compatible case.

**Remaining acceptance:** genuine signed-in member browser scenarios, accessible mobile rendering, independent grading guard check, and exact-main CI/deployment. Advanced/Professional edition release remains disabled.

## Gate 3/5 — Learning prerequisite recommendations, Version 1.2 source addendum

**Document ID:** SMFGU-ENGINE-ARCH-001. **Project:** The Stock Market: From the Ground Up. **File type:** Markdown. **Google Drive:** Not created; document ID unassigned. **Source:** GitHub main.
**Date:** 2026-11-01. **Status:** Implemented in source; exact-main CI and authenticated browser review pending.

**Implementation:** SMFGU-ENGINE-ADAPT-004 maps six verified fictional numerical mistakes to existing public competency guides via `GroundUpLearningEvidenceV1.recommendPrerequisites`. It reuses the existing server-authenticated `/api/competencies?action=summary` and the Lab's original study-guide catalog, rather than introducing new storage, scoring, roles, payments or services. No client formative practice attempt becomes an official grade; an unclassified mistake creates no invented failure. A qualified existing independent assessment status may be displayed separately. Account changes invalidate the existing Lab Player session.

**Dependencies:** Existing v3.3/v3.2 Basic engines, entitlement gates, 30 published competency guides, protected server assessment, tests and Cloudflare deployment.
**Next acceptance:** exact-commit CI, real signed-in member browser, account switching, screen reader and independent grading/quantitative checks.

## Gate 3 intermediate-method verification (2026-11-01)

**Document control:** SMFGU-ENGINE-ARCH-001 version 1.3 addendum; file type Markdown; project The Stock Market: From the Ground Up; source GitHub main; Google Drive location and document ID unassigned. Status source implemented; production browser acceptance pending. Dependencies: frozen Basic engines, authorized Lab Player, public fictional instructional cases, protected competency summary and tests.

**Design:** A learner may enter three intermediate values for either the public fictional candle percentage or trade-price VWAP exercise. The shared Learning Engine evaluates each *observable numeric mismatch*, provides authored corrections and existing competency-guide links, and offers a distinct fictional follow-up, without claiming to infer the learner's thoughts. No official answer bank, paid inference, stored progress, market feed, separate LMS or premium feature grant is introduced. Python standard-library Decimal performs independent numerical regression checks in CI; the Cloudflare runtime remains JavaScript and the existing ECharts chart remains unchanged.

**Research:** StocksToTrade public support pages are research comparators, not licensed content for reproduction. Original teaching text, calculations and graphics only. Review citation/redistribution rights independently.

## Gate 4 quantitative extensions — EMA, stop distance and position sizing (2026-11-01)

**Document control:** SMFGU-ENGINE-ARCH-001, v1.5 addendum. Project: The Stock Market: From the Ground Up. File: `docs/learning/SMFGU-ENGINE-ARCH-001-v1-20261101.md` (Markdown), source location: GitHub `main`; Google Drive location and ID not assigned. Status: source-integrated, CI / authenticated browser acceptance open. No new Google Drive file required.

**Requirement ID:** SMFGU-ENGINE-QUANT-001. Add original, ungraded fictional numerical studies for `EMA_CONTEXT`, `RISK_PER_SHARE` and `POSITION_SIZING` only when the already authorized Lab's *primary* competency and authored topic both match. Teaching and transfer use the existing member Lab Engine Guided/Practice stage, ECharts 6.1.0 locally hosted loader, and stable signed-in member entitlement path. They do not create a new grading service, progress ledger, billing entitlement, server, market feed or Python Cloudflare runtime.

**Formula distinctions:** EMA is explicitly period-3 with an SMA seed at completed close 3, with early values withheld until seed. It is *not* claimed to match thinkorswim's prefetched first-price EMA early bars. Shares are floored to whole numbers and constrained by both hypothetical risk budget and cash buying power. A stop order does not guarantee a maximum realized loss. All examples and new transfer cases are fictional, with no lookahead.

**Original research/verification records (research-only, no copied media/data):** Uploaded `Master Research Source Directory(2).odt`, levels 2, 7, 8 and 9, with EMA, position sizing, initialization, source rights and Python verification requirements. Official thinkorswim MovAvgExponential `https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/M-N/MovAvgExponential`; StockCharts ChartSchool `https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential`; Charles Schwab `https://www.schwab.com/learn/story/5-elements-smart-trade-plan`. Accessed 2026-11-01. Reference facts checked; no source-endorsed data-ingestion license asserted.

**Dependencies:** Owner-frozen Basic editions and authorized Lab registry; existing Supabase authenticated competency summary, server private rubric, and ECharts vendor asset. Files: `assets/js/learning-quant-studies-v1.js`, `assets/js/learning-quant-studies-ui-v1.js`, `assets/css/learning-quant-studies-v1.css`, `assets/js/lab-engine-v32-universal.js`, `lab-player.html`, `tests/learning-quant-studies-v1.test.mjs`, `.github/workflows/learning-lab-quant-studies-v1.yml`.

**Acceptance remaining:** source math tests, exact-commit full CI, Cloudflare commit, real signed-in Guide/Practice, mobile/keyboard/screen reader, account switching, ECharts fallback, protected Assessment/Blind with no leakage, and actual topic-specific editorial approval of every future case.

## Quantitative source registry and independent validation — 2026-11-01

**New source-validation record:** `data/learning-engine-quant-source-registry-v1.json` (JSON), document ID SMFGU-ENGINE-QUANT-SOURCE-001, version 1.0, status RESEARCH_REFERENCES_CHECKED_CALCULATION_TESTS_PENDING_INDEPENDENT_EDITORIAL_ACCEPTANCE. **Google Drive:** No file created; Google Drive document ID unassigned. **Dependencies:** Uploaded Master Research Source Directory(2).odt, official thinkorswim EMA docs, StockCharts formula conventions, Investor.gov order warnings, Schwab risk planning, original JavaScript arithmetic and Python Decimal QA.

**Change:** Records complete source metadata, fictional examples, separate source-use/rights categories, initialization/warmup and expected errors. Improves position-sizing cap to conservative floor without upward epsilon. Python verification uses no runtime API or additional paid infrastructure. Real browser/editorial/license sign-off remains separate.
