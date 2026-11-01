# Talia Intelligence Upgrade — Baseline, Implementation and Acceptance Register

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Tutor intelligence |
| Document ID | SMFGU-TALIA-INTELLIGENCE-EXEC-001 |
| Filename / type | `docs/qa/2026-11-01_TALIA_INTELLIGENCE_BASELINE_AND_EXECUTION_v1.md` / Markdown |
| Google Drive location / ID | Not created / unassigned. GitHub `main` remains the source of record. |
| Version / date | 1.0 / 2026-11-01 |
| Status | Partial source implementation. **Not** a completed nine-gate release or production acceptance. |
| Authority | Delegated noncommercial source, editorial and QA decisions; live payment and restricted provider activation unchanged. |
| Purpose | Reconcile real Tutor/Lab/Academy/indicator source inventory with actual platform flags; preserve verifiable action and follow-up evidence. |
| Dependencies | `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `docs/learning/SMFGU-ENGINE-ARCH-001-v1-20261101.md`, existing Tutor/Lab/Academy registries, chart-math adapter, Cloudflare/Supabase roles and the existing CI workflows. |

## Verified source inventory (different denominators)
- 419 canonical mapped Lab identifiers and 30 public competency links: `data/competency-lab-paths-v01499.json`. These public mappings are **provisional**, not 419 independently scored approved Labs.
- Ten Academy programs comprise 247 original days plus 27 separately staged Beta days, or 274 source positions: `functions/_lib/bootcamp-academy-v014168.js`, `scripts/learning-echarts-beta-audit-v1.mjs`. Protected grading and public retail entitlement are independent approval gates.
- 134 original ungraded Talia guided modules, including 61 indicator briefs, 53 calculated fictional teaching demonstrations, eight interpretation-only guides, 22 watchlist guides, 50 strategies, and one event chronology: `data/tutor-guided-practice-v1.json`.
- Current first-party prototype chart adapter defines **16** distinct computed chart-study choices, including EMA 200: `assets/js/prototype-indicator-workbench-v2.js`. Do **not** conflate these 16 chart choices with 53 Tutor fictional calculations or 61 research briefs. Older dated documents may still record 15.
- Existing member Tutor has source-grounded official and supplemental guides, private-history controls, optional provider routing, consent and protected Lab guidance; current instructional approval may be narrower than source presence.
- Existing staff-only React 19/TypeScript prototype and locally hosted ECharts are presentation and noncommercial learning tools, not proof of authenticated member release, model activation or historical-feed rights.

## Verified current production AI configuration (Cloudflare Pages API; 2026-11-01)
`AI_SERVICE_ENABLED=false`, `AI_COST_MODE=free_only`, `AI_TUTOR_PROVIDER=cloudflare`, `AI_CLOUDFLARE_FREE_TIER_VERIFIED=false`, `AI_CLOUDFLARE_MODEL_LICENSE_APPROVED=false`, `AI_PAID_PROVIDER_OWNER_APPROVED=false`. Configuration is evidence of intentional **source-only/default AI-OFF** behavior; browser-level outcome still requires authenticated QA. Do not alter these flags or enable paid inference in this workstream. No provider keys or secrets are copied to this register.

## Completed bounded source changes (main only)
1. `c94557e99e141475b3764855c1b7591a16889a08` — `scripts/learning-echarts-beta-audit-v1.mjs`: derive counted chart studies from the actual 16-study first-party adapter, fail on distinct-ID mismatch or missing EMA 200, and expose registry IDs in the audit artifact. Prevent a stale hard-coded count from being mistaken for validation.
2. `0a6c2eda0eb975086ab8beeb183cbf6b8a112ec6` — `assets/js/crownlight-chart-tutor-v1.js`: add source-only EMA 200 explanation tied to mathematically valid 200 completed closes; return “not ready” before warmup, with no invented future candles or execution signal.
3. `46e1488a8cdfd62254810e0c59186f2d4fe2c492` — `tests/prototype-indicator-workbench-v2.test.mjs`: verify 199-bar unavailability, 200-bar SMA-seeded EMA parity, latest completed-bar parity and non-advisory interpretation.

These are real repository changes. Source-review acceptance is separate from exact-head CI, matching Cloudflare deployment and genuine signed-in teaching acceptance.

## Nine-gate progress — fixed denominators
For the first gate only, the following seven evidence checks define its percentage: (1) Tutor code inspected, (2) curriculum source inventory inspected, (3) controlling release documentation inspected, (4) Pages production deployment inspected, (5) model environment gates inspected, (6) exact-head CI results verified, (7) real independently authenticated member consent/history tests performed. Checks 1–5 have source/config evidence, checks 6–7 remain open. **Gate 1 = 5/7 = 71.43% evidence collected**. The Cloudflare deployment initially inspected preceded the latest source commits; repeat exact-commit verification before marking (6) accepted.

**Overall release acceptance = 0/9 complete gates = 0%.** This is an acceptance metric for the newly defined upgrade, not a claim that the existing Tutor is 0% built. Never infer source implementation percentage from this denominator, and do not double-count completed preliminary code as production-ready.

| Gate | Status / next required verified evidence |
|---|---|
| 1. Tutor baseline audit | **IN PROGRESS** — exact-head workflow conclusions, exact-head Pages deploy, genuine member consent/history/entitlement tests. |
| 2. Curriculum intelligence | **IN PROGRESS** — normalize existing source IDs, approvals, provenance and learning stage metadata without duplicating 419/274/61 registries. |
| 3. Adaptive teaching | **IN PROGRESS** — EMA 200 chart coaching delivered in source; still require broader prerequisite diagnosis, numeric scaffolds and independently reviewed transfer. |
| 4. Personalized learning | **PARTIAL BASELINE** — reuse existing signed-in practice aggregates; no new PII, grading, duplicate progress tables or unapproved behavioral profiling. |
| 5. ECharts / Chart Studio | **PARTIAL BASELINE** — prototype contains 16 computed studies; staff and member observation boundaries, timeframes and chart-linked Talia workflows require genuine tests. |
| 6. Teaching/evaluation suite | **IN PROGRESS** — new EMA 200 deterministic test; run exact-head CI and add source, access, anti-leak, no-lookahead and educational quality acceptance. |
| 7. Admin Tutor Training Center | **NOT ACCEPTED** — reuse existing Admin/RBAC/authoring, implement explicit source publication/version audit with least privilege. |
| 8. Optional model enhancement | **HOLD / AI OFF** — evaluate licensing, free quota, privacy, latency and correctness without provider charge or activation. |
| 9. Authenticated member acceptance | **NOT ACCEPTED** — real Free/Founding/Owner/denied-role evidence, isolation, screen reader, protected grade, production exact SHA. |

## Engineering placement and restrictions
React 19 + TypeScript for complex member workspaces; ECharts 6.1 for existing calculated chart visualization and analytics; JavaScript/Cloudflare Pages Functions for authenticated APIs; Supabase/Postgres with existing RLS and authorized progress; HTML5/CSS3 for semantic and accessible presentation; Python only for justified offline deterministic finance/research QA. No new server, GPU, schema, Stripe product, charge, model activation, data-license assumption or duplicate learning database is authorized.

Preserve member-available first-principles explanations, retries, step-by-step math and ungraded corrections at the same instructional quality. Never leak protected assessment rubrics, future candles, raw personal journals or personally tailored trading directions.

## Tests, remaining acceptance and rollback
- Source patch targets/commit SHAs were verified by GitHub writes; **do not report CI success until complete exact-head GitHub Actions workflow conclusions are available**.
- Existing `learning-engine-member-versions-v1.yml`, `prototype-center-v1.yml`, `sitewide-playwright-v014136.yml` execute the relevant Node/script acceptance surfaces when triggered. Source contract tests are not signed-in browser proof.
- Cloudflare production deployment remains subject to newest commit and successful deploy-stage comparison. A skipped superseded deployment is not a passing acceptance test.
- No SQL migration or monetary/provider action. Rollback is reversal of the specific three source changes with their associated test expectations, using main-only source control; re-run all affected CI checks and verify deployed SHA afterward.

## Revision history
| Version | Date | Change | Sign-off |
|---|---|---|---|
| 1.0 | 2026-11-01 | Initial audited baseline, verified AI-OFF production gates, 16-study source count correction, EMA 200 Tutor teaching and test, nine-gate execution status | Noncommercial source scope recorded; CI/production/member release **not signed off** |

**Footer:** SMFGU-TALIA-INTELLIGENCE-EXEC-001 · v1.0 · Source and policy evidence only · No independent grading/market-data/financial/legal certification or production release approval.
