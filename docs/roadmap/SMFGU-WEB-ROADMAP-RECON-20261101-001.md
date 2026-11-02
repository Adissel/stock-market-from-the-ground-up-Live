# Website Development Roadmap — November 1 Release and Curriculum Reconciliation

## Shared-engine Gate 2 checkpoint integrity — 2026-11-01

Basic Learning v3.3 / Lab v3.2 checkpoint persistence now fails closed after an unverified progress read: the browser cannot enable a revision-zero save until the existing member record or verified empty state has loaded successfully. This preserves existing progress and CAS isolation without adding a ledger, grade, entitlement, paid service or premium capability. Targeted Node verification passed locally; Python was unavailable on the host. Exact-main CI, Cloudflare parity and authenticated member persistence acceptance remain required, so no release-acceptance percentage changes.

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Website Development Roadmap |
| Document ID | SMFGU-WEB-ROADMAP-RECON-20261101-001 |
| Filename / file type | `SMFGU-WEB-ROADMAP-RECON-20261101-001.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/roadmap/` |
| Google Drive location / document ID | Not assigned / not created. GitHub is the current source of record. |
| Version / prepared | 1.21 / 2026-11-02 |
| Status | Source implemented; exact-head CI, Cloudflare matching deployment, genuine Owner browser and consolidated release acceptance tracked independently |
| Owner | Delegated project/editor/QA authority for source scope; only genuine authenticated OWNER may save roadmap completion or authorize private edits |
| Purpose | Bring the actual private /owner-roadmap.html forward from its Oct 28 audit snapshot without changing preserved project commitments or treating staged authoring, source code or CI as blanket production certification |
| Dependencies | AGENTS.md, PROJECT_SITEWIDE_RULES.md, README_START_HERE.md, 105 historical docs/releases records, current docs/learning engine architecture and tier register, protected Owner Roadmap API and existing Supabase site_settings, current Cloudflare Pages build |

## Scope and source of truth

The existing 281 original core items plus 94 October 18 additions remain **375 primary commitments**, supplemented by **1,815 historical requirement/reference items** = **2,190 unchanged canonical records**. No ID was removed, relabeled or silently marked accepted. Existing saved OWNER progress and audit history still win over delegated source evidence. The new reconciliation section is **read-only** and visible only after the existing server-side OWNER authorization and member-account-status checks. Ordinary Admin/Moderator, restricted, suspended, SHOWCASE and anonymous accounts remain denied by the existing endpoint. The historical eight deployment packages are retained as planning scope and not claimed completed.

The old `docs/CURRENT_RELEASE.md` (v0.14.0.12), `RELEASE_MANIFEST.json` (v0.14.0.17), root `release-manifest.json` (v0.14.0.155) and the October 28 audit snapshot are historical source records, **not a replacement for current-main, exact-head GitHub Actions and Cloudflare production evidence**. `README_START_HERE.md` explicitly makes current `main` authoritative.

## Reconciled planning facts (different denominators)

| Stream | Historical/review baseline reflected in private Owner page | Meaning and open approval |
|---|---|---|
| Lab registry | 419 canonical mapped Lab bridges / 30 competencies | Mapping and teaching-source evidence; individually reviewed, graded and historical provenance require separate decisions |
| Original Academy seven programs | 247/247 fictional day source-case presence | 225 were initially parent-derived; authoring is **not** independent advanced instruction or official grading |
| Fixed advanced-depth acceptance ledger | **93/380 = 24.47%** accepted restricted ungraded Beta units, 287 unaccepted | Supersedes the prior dated 91/380 and 88/380 reports. No independent professional accreditation inferred |
| Three invited Beta Boot Camps | 27/27 original instructional days accepted | Ungraded, invitation-only scope; public retail and protected grading remain on hold |
| Private three-course assessments | 41/54 complete drafts, 0/54 approved for scoring at the dated Oct 31 snapshot | Draft authoring `41/54` ≠ protected release, no server answer-key disclosure |
| B01 graded Beta preparation | 62% managerial weighted preparation | 0/20 private sets independently signed; grading release blocked |
| Indicator studies | 73 source-only original Tutor indicator guides (61 retained + 12 extensions) across nine families | 16 independently inventoried computed first-party prototype chart-study choices; 8 separate fictional source-only teaching computations. None of the three counts equals independently accepted editorial release |
| Talia | 134 research/tutor modules | Source catalog not universal individual editorial approval |
| Chart Studio | 3/14 fully accepted strict release gates | Ten partial, one open; historical half-credit estimate 57.1% not equivalent to signoff |
| Free V1 | Historical planning 88% | Five original ungraded Free days accepted in their narrow scope; two-account privacy, full accessibility and final release distinct |

No single percentage above is an independently verified whole-website build completion score.

## Controlling three-engine Owner policy

There are three separate future product families: Shared Learning Engine (Basic v3.3 source), Shared Lab Engine (Basic v3.2 source), and Talia Market Tutor (Foundation Basic v0.14.0.149 customer-facing label). Each may eventually offer separately priced advanced add-ons, but current higher editions, premium checkout, SKU prices, and full entitlement/expiry/revocation must not be inferred from a target row.

| Membership | Learning target | Lab target | Talia target |
|---|---|---|---|
| Free, Founding 14-Day, Pick What You Want | Basic | Basic | Foundation (Basic) |
| OnDemand | Based on individually verified product | Same | Same |
| Founding 30-Day | Advanced / next best | Advanced / next best | Advanced |
| Founding 60-Day, Full Monthly | Professional / best available | Professional / best available | Professional |
| Full Lifetime | Enterprise / best-of-best | Enterprise / best-of-best | Enterprise |
| Full Annual and legacy founding terms | Unassigned — Owner reconciliation required | Unassigned | Unassigned |

A source version, target product edition and real released server capability are different. Equal essential first-principles instruction, free explanations, worked calculations, correction, retries, transfer and grading security are guaranteed for each lesson that a member is already entitled to access. Premium may add independently accepted depth/workflows, not gate basic explanations or official answer keys.

## November 1 v1.1 six-gate read-only execution reconciliation

The current verified indicator source inventory is **73/73** original Tutor study guides, not 73 production overlays. The first-party computed prototype registry has **16** distinct study selections (source: `scripts/guided-platform-quality-audit-v1.mjs` and `scripts/learning-echarts-beta-audit-v1.mjs`). The eight original fictional source-only Tutor computations are a *third* quantity. An indicator guide, a computed prototype study and an independently approved member learning outcome must be counted separately.

1. **Latest production CI:** GitHub Actions is measured by the full set of required checks on a frozen exact SHA; a Cloudflare successful build alone does not certify CI. During this refresh, continuous pushes and failed or cancelled runs prevent final current-head acceptance. The latest CI SHA must be re-established after the last mutation.
2. **Privileged RPCs:** Supabase live read-only catalog contained 87 authenticated `SECURITY DEFINER` functions, including four also executable to anonymous users. All had an explicit `search_path`; 24 included `public`. Static and targeted function-body examination found role checks in selected Owner/moderator functions, *not* a full negative-authorization certification. Review public-path resolution, function-specific grants and account separation; never blanket revoke.
3. **73-guide teaching review:** All 73 unique guides have mathematical/reference/fictional teaching fields, with 165 aggregate source-link entries. Independently checked selected examples and source conventions, including NVI, DPO and CHOP; keep per-claim formula, warm-up, historical cutoff, copyright/data-rights and individual publication approvals open.
4. **Risk60 Days 21–40:** All 20 have distinct fictional guided-rehearsal source rows. Days 21–22 also include a separate 12-question formative package and advanced practicum; **Days 23–40 lack an equivalent individual deep package in the currently inspected module**. Do not increment the fixed original advanced-depth acceptance ledger from source presence. Controlling Academy result remains **93/380 = 24.47%** accepted, 287 open.
5. **Authenticated acceptance:** Existing private Academy stage checkpoint storage has RLS enabled, with ordinary `anon` and `authenticated` roles lacking direct SELECT. This is security evidence, not an actual signed-in multi-account browser acceptance. Preserve original 419 official Lab IDs, nine non-Free Academy program scope, and protected grading.
6. **Release documentation:** GitHub P0-06 / P0-05 / Tutor research acceptance issues remain authoritative for findings and blockers. No user payments, new fake member grades, service grants, or premium releases are implied by this read-only roadmap revision.

**Codex budget:** No Codex used for this reconciliation. **Website-wide release percent:** Not assigned without a complete, evidence-supported weighted denominator.

## Ten controlling next execution gates

1. **CI:** select stable `main` SHA, finish mandatory workflows without counting pending/cancelled checks, verify same successful Cloudflare Pages SHA.
2. **Genuine staff browser:** Owner/Admin and denied-role auth, three protected A/B/C prototype experiences, sign-out, session expiry and revocation.
3. **419 Lab parity:** ten visible teaching steps, five original facets, numerical reasoning, adaptive correction, retry, fresh transfer, server-owned scoring.
4. **Academy 380-unit depth:** separately verify each day, especially remaining 287 advanced-depth units, ungraded 27-day invited Beta, draft/public boundaries, prerequisites and Talia.
5. **73 indicator teaching guides:** individual published authority/formula/unit/warm-up/session interpretation/limitation, original research guide vs 15 real calculations.
6. **16 computed prototype chart studies:** independent OHLCV numerical reference, no lookahead, initial/warm-up/reset/missing bar/parameter cases.
7. **Professional ECharts:** React/TypeScript and locally hosted Apache ECharts 6.1, linked charts, pan/zoom/release, overlays, pane resizing, mobile and keyboard acceptance.
8. **Two independent genuine accounts:** secure entitlement and mutual denial across Labs, Academy, Tutor, Watchlist, Replay, Journal and Studio.
9. **Accessibility and educational integrity:** actual screen-reader review, focus/keyboard/reduced motion, source-level trading/regulatory/market-data correctness, actual separate reviewers where required.
10. **Consolidated production release:** exact SHA, full CI, provider deployment, payments/legal/publishing/consent/security/rollback acceptance, explicit Owner disposition, no speculative launch.

Add-on sales, private official grading, KDP/market-data rights and full LIVE payment authorization are separate open gates, not automatic consequences of this read-only roadmap update. No production database migration, money transfer, new user record or premium feature is introduced.

## Files changed

- `functions/_lib/owner-roadmap-release-reconciliation-v1.js` — private, versioned evidence, policy and ten execution gates (not deployed as public data).
- `functions/api/owner-roadmap.js` — extends the existing OWNER-protected GET and compact delivery summary without altering POST, role check, metadata or 2,190-record catalog.
- `owner-roadmap.html` — a new current-release section above the preserved eight-package plan; October 28 header correctly labeled historical.
- `assets/js/owner-roadmap-release-reconciliation-v1.js` — textContent-based accessible renderer loaded after actual OWNER GET; no private writes and no innerHTML.
- `assets/js/owner-roadmap.js` — connects authorized API evidence to read-only renderer without changing progress/Owner actions.
- `assets/css/owner-roadmap.css` — responsive evidence cards, navigable membership table and ten-gate execution list.
- `tests/test_owner_roadmap_release_reconciliation_v1.mjs` — historical ID preservation, revised denominators, membership matrix, authorization boundary, no price activation.
- `.github/workflows/owner-roadmap-workflow-v014063.yml` — validates new module syntax, tests and deployment build privacy.

## Acceptance and rollout

The source change is a **scoped product/engineering implementation** only. CI success and live Cloudflare deployment must be recorded at the current exact SHA after the final code commit. Actual signed-in OWNER visual/keyboard use, access revocation and content approval require separate evidence. No previous documented Owner saved status is overwritten; no new percentages are artificially assigned to all completed work.

**Rollback:** Revert the new source, private API view field, HTML section, browser asset, stylesheet addition, new contract test and workflow references together on `main`. Preserve existing protected checklist, stored Owner progress and audit history; no Supabase migration or Stripe rollback.

## November 1 accelerated source-evidence batch

Latest controlled evidence: `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md`, a separately versioned QA document. The existing protected OWNER completion state, original **2,190 roadmap IDs**, and final approval requirements are **unchanged**.

| Program | Updated non-release metric | Interpretation |
|---|---:|---|
| Tutor explanation authoring | 240/600 = 40.00% | Existing original explanatory source drafts; 360 future slots are NOT authored |
| Multi-curriculum evidence generator | 1,366/1,366 identities accounted for | 600 Tutor targets + 73 indicator guides + 419 Labs + 274 Academy study days; identity catalog only |
| New Foundation source-review batch | 40/40 recorded; 6/40 selected pages fact checked | Individual content and source scope records 101–140; NO final commercial publication or legal approval |
| Independent 15-indicator cross-implementation batch | 15/15 test results matched Python/JavaScript in Cloudflare build | Fictional OHLCV fixture and declared EMA/warmup, NOT platform-agnostic or full 73-study final approval |
| Source-only Tutor follow-up contract | Targeted Node regression passed in Cloudflare build | Verified prior question retrieval, excludes browser-supplied history and answer keys; not real authenticated conversation acceptance |
| Remaining indicators | 73/73 source guides drafted | Full individual formula variants, warmup and publication-rights acceptance remains OPEN |
| Learning + Lab versions | Basic shared v3.3 / v3.2 retained; Advanced/Professional/Enterprise not released | No false percent for source prototypes or new paid SKUs |

The nine-level source directory is authoritative for research selection, not blanket rights: a verified fact or a correct independent formula does not grant copyright, exchange data, market-feed, redistribution or external model-training permission. The original `STT.zip` binary was not available to re-open in this execution; the prior preserved GitHub archive-review records remain the documented provenance boundary.

**Active next batch:** complete remaining 34 claim-specific primary-source visits, finish and broaden indicator-platform convention testing, execute genuine Free/Founding/Owner and screen-reader acceptance, and freeze a matching full GitHub Actions + Cloudflare production SHA before new releases. The Owner Roadmap's total website percent remains **unassigned**, not retroactively derived from these source counts.


## Section C — first coordinated indicator-visualization batch (2026-11-01)

**Execution scope:** First-party ECharts Studio optional analytics, existing member-tier menu and shared indicator mathematics. **Status:** source committed to main; new exact-head CI and signed-in production acceptance pending independent evidence. Does not advance the 73 source-only guides to publication-approved status.

**Files modified:** `assets/js/crownlight-echarts-studio-v1.js`, `assets/css/crownlight-echarts-v1.css`, `tests/test_crownlight_echarts_indicator_section_c_v1.mjs` (new), and `.github/workflows/crownlight-chart-studio-browser-v2.yml`. No DB migration, paid data provider, new API, membership entitlement, grading or saved member data change.

**Existing source math reused:** EMA 9/20/200, SMA 20, session HLC3 VWAP proxy, Bollinger 20/2, observed session HOD/LOD, volume SMA 20, confirmed right-side structure. Accessible revealed-candle inspection also includes Wilder RSI 14, ATR 14 and core OHLCV. MACD remains available from the shared math for later dedicated oscillator panels. No replacement of the live Lightweight Charts renderer.

**Source changes:** Per-study visibility toggles, EMA 9 line color, line style, chronological structure marks, warmup disclosures, precise source labeling, numerical table of the latest 30 already-revealed candles, session-sensitive calculations, account-switch scrub, responsive and keyboard-focus styling.

**QA coverage introduced:** Real offline Chromium ECharts 6.1 rendering on 225 deterministic fictional OHLCV candles; numerical comparison with existing shared calculation outputs; EMA200 first-valid index, honest null warmup, revealed-only rewind, source table, controls, session teardown. Existing independent Python-vs-JavaScript cross-language acceptance tests remain mandatory. An offline fixture test is not independent claim review or real signed-in browser acceptance.

**Denominator control:** 73/73 source guide records; existing 15/73 Python/JS checked instructional computations (20.55% mathematical comparison coverage; different from final item-level verification); 16/16 implemented prototype registry choices (not 16 accepted Tutor lessons); 0/73 independently approved for commercial publication in the inspected registers. Canonical mapping identifiers 419 Labs / 274 Academy days remain unchanged; no new independently evidenced indicator-by-course acceptance is claimed. Higher engine tiers remain unreleased, and final website-wide completion remains unassigned.

**Research and rights:** Uploaded Master Research Source Directory is a source-assignment aid, not a blanket license or editorial approval. No third-party paid code, outside charts, restricted feed or trade execution introduced.

**Acceptance before production sign-off:** exact-SHA required GitHub Actions, same-SHA Cloudflare build, verified signed-in Free/Founding/Owner tiers, mobile/keyboard/screen-reader, zero-lookahead and individual curriculum editorial reviews. Fail/cancel/pending must not be counted as passed.


## Section C continued — numerical boundaries and linked ECharts panels (2026-11-01)

**Status:** Source committed on `main`. ECharts runtime and cross-language edge regressions added to the Chart Studio Chromium gate. Exact-final-SHA CI, Cloudflare matching deployment, independently verified publications and genuine signed-in acceptance are separately OPEN.

**New committed capabilities:** One multi-grid ECharts display with independently scaled RSI 14, MACD 12/26/9 and ATR 14 subpanels, shared chronological x-axis pointer and zoom, individual height sliders, numerical columns for all MACD components, and responsive semantic controls. Price and volume remain the first two chart series. Canonical shared JS math is reused; do not infer a new compiled React/TypeScript production application or replacement of Lightweight Charts.

**Mathematical edge controls:** Hardened ECharts OHLCV intake against null/missing/blank required properties before numerical coercion. New independent Python Decimal reference and Node cross-check cover SMA gaps, EMA seed/gap conventions, flat RSI, premarket-to-regular VWAP reset, zero-volume carry, ATR true-range price gaps, zero-variance Bollinger bands, and the quantitative distinction between trade-print VWAP and bar HLC3 proxy. Existing independent 1/3/5-minute aggregation and 200-bar EMA checks remain preserved.

**QA source paths:** `scripts/qa/section_c_indicator_edge_reference_v1.py`, `tests/test_section_c_indicator_edge_crosslanguage_v1.mjs`, expanded `tests/test_crownlight_echarts_indicator_section_c_v1.mjs`, and active `.github/workflows/crownlight-chart-studio-browser-v2.yml`. Real authenticated users, full WCAG/assistive technology, multi-account persisted preferences, and exact-main release gates remain unaccepted.

**Research document:** `Master Research Source Directory(6).odt` independently reviewed as assignment source for original math, source selection, provenance and redistribution controls. Its internal claim of general source approval is not legal permission to redistribute exchange feeds, proprietary charts, vendor study code or copyrighted media.

**Denominator protection:** 73/73 source guide records, original 15 existing canonical Python/JS indicator comparisons, 16 prototype choice registrations; no increase in 0/73 independently publication-approved guides or separately verified 419-Lab/274-Academy curriculum integrations based on this source-only batch. Basic engines remain canonical; Advanced/Professional/Enterprise release percentages and overall website completion remain unassigned until individual acceptance evidence exists.


## Section C — ECharts customization and private-workspace integration, v1.5

Date: 2026-11-01. Source committed to `main`; automated CI and independently authenticated acceptance remain subject to latest stable release SHA.

- ECharts source: member-selectable colors and independently selectable line styles for the available indicator visualizations, synchronized RSI/MACD/ATR lower panels and sliders, member-change in-memory reset, and `getPreferences` / `restorePreferences` controls.
- Existing authenticated private-workspace bridge: `CrownlightWorkspaceV2.persist` now includes bounded ECharts presentation preferences in its existing revision-protected PUT request. `restore` applies them after authorized GET when ECharts is mounted; delayed mounts are handled through existing tier-mounted/revealed-bars events. Supabase table, service tokens and protected grade storage are unchanged.
- Server-side source contract: `functions/api/chart-workspace.js` accepts only documented study IDs, Boolean visibility, six-digit color values, solid/dashed/dotted lines, valid panel sizes (110–285), and a valid stroke value. Unknown attributes including third-party bars and credential-like fields are dropped. No tier access is granted by these settings.
- Additional tests: `tests/test_crownlight_chart_workspace_v2.mjs` checks normalization/credential rejection; `tests/test_crownlight_echarts_indicator_section_c_v1.mjs` exercises a user presentation snapshot, remount/restore, replay rewind, and account-change isolation; `tests/test_section_c_indicator_edge_crosslanguage_v1.mjs` retains independent Python Decimal numerical boundaries.
- Acceptance hold: exact-commit CI success, Cloudflare matching production deployment, genuine two-account authenticated privacy, keyboard/screen reader and physical mobile acceptance, 16-study individual reviews, 73-guide editorial rights, Talia, 419 Lab and 274 Boot Camp learning journeys.
- Metrics remain evidence-scoped: 73/73 source guide inventory; 16/16 source study registrations; original 15/73 canonical math comparisons; no assertion of individually publication-approved guide progress. Basic engines v3.3/v3.2 retained; no invented percentage for Advanced/Professional/Enterprise editions or whole website.


## Section C — 16-study timestamp and source-math hardening (v1.6)

The operational 16-study prototype adapter now uses completed OHLCV calculations from the shared original indicator-math engine. For valid timestamped candles, observed HOD/LOD, opening range and HLC3 session VWAP use exchange-time session boundaries. For legacy undated fictional editor fixtures, a single synthetic-session model is preserved and explicitly nonhistorical. Mixed dated and undated candles fail closed rather than inventing a session. The VWAP view no longer trusts caller-provided precomputed `proxy` fields; it derives values from revealed OHLCV.

Source changes: `assets/js/prototype-indicator-workbench-v2.js`, `tests/prototype-indicator-workbench-v2.test.mjs`. New checks cover premarket-to-regular and next-day resets, opening-range warmup, fabricated-proxy rejection and invalid mixed timestamps. Existing 16-choice inventory remains 16/16; individual release signoff remains OPEN until the prototype workflow passes on one frozen SHA and all 16 calculation/unit criteria receive independent review.

No changes to chart backend pricing, member identity grants, saved grades, market feed licenses, or Stripe were included in this batch.

## Curriculum QA Batch 46–60 — read-only development reconciliation

The controlled source-of-record is `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md`, version 1.3. This update is documentary only; it does **not** change the authenticated Owner Roadmap's 2,190 original requirement IDs or any stored progress, entitlement, price, published curriculum or private API output.

| Stream | Updated verified source count | Release meaning |
|---|---:|---|
| Evidence target registry | 1,366/1,366 | 600 explanation slots + 73 studies + 419 Lab IDs + 274 Academy study days, one canonical identity each |
| Tutor Foundation source authoring | 260/600 = 43.33% | Twenty Batch-13 source-only lessons present; protected grading and independent release review remain open |
| Foundation claims 101–140 | 40/40 have individual source dispositions | 0/40 final publication-accepted; two historical-regulatory/timestamp corrections retained |
| Indicator research batch | 60/73 = 82.19% | Includes SCTR source research without numerical vendor emulation |
| Independent numerical example fixtures | 59/73 = 80.82% | Fourteen new original Python/JS tests for study IDs 46–60, excluding proprietary SCTR; **not** 59 accepted production indicator implementations |
| All 73 final formula/platform/data-rights approvals | 0/73 | Commercial reuse, live feed access, ECharts parity and platform-specific formula settings require review |
| Advanced/Professional/Enterprise Learning and Lab releases | 0% independently released per edition | Underlying source implementation may be more advanced; do not invent engineering-completion percentages |

**Execution order:** (1) preserve canonical IDs and source math; (2) complete 40 individual claim publication-ready mathematical/editorial remediation; (3) resolve 60–73 and SCTR restrictions; (4) authenticated multi-turn Tutor QA; (5) integrate completed-bar-only ECharts with server privileges; (6) full mandatory Actions matrix; (7) genuine member/staff/mobile/assistive QA; (8) exact-SHA Cloudflare production match; (9) independently accept only eligible functions; (10) start topics 261–280 when editorial prerequisites are accepted. The strict ten-gate completion is **1/10 = 10%** until each gate's stated complete requirements are actually satisfied. Overall website completion remains unassigned.

## Final 13 Indicator Subjects — Source QA 61–73

This update preserves the existing Owner completion denominator and does not modify authenticated milestone records. Source QA and publication acceptance are separately accounted for.

| Controlled milestone | Current source evidence | Release interpretation |
|---|---|---|
| Foundation explanation target registry | 600 target identities, **260/600 (43.33%) source authored** | No additional grades or independent publication approvals |
| Indicator research inventory | **73/73 subject identities (100%)** | All study subjects now have source-level records; SCTR and official VIX vendor-methodology restrictions retained |
| Independently constructed numerical cases | **71/73 (97.26%) configured** | 12 added final-group Python/JavaScript cases; source QA and exact-commit CI cannot substitute for vendor-specific implementation acceptance |
| Vendor-defined benchmark/rank exceptions | **2/73** | StockCharts SCTR and Cboe VIX: no fabricated exact numeric calculation, redistributable dataset or vendor license |
| Final source-editorial/commercial approval | **0/73** | Rights, full formula variants, chart UX, authenticated session and protected grade acceptance pending |
| Foundation claims 101–140 | **40/40 ID-based source dispositions recorded** | Individual final mathematical/rights/legal acceptance open |
| Lab / Academy inventory | **419/419 Lab IDs; 274/274 Academy-day IDs** | Original nine-stage teaching and authenticated curriculum parity not independently accepted |
| Learning Engine / Lab Engine Basic | **v3.3 / v3.2 retained** | No fabricated full Basic completion percentage |
| Advanced / Professional / Enterprise | **0% premium release accepted** | Existing server gates, research prototypes and member-only features remain differentiated from release approval |

**Release controls:** Require exact GitHub Actions matrix, matching Cloudflare production commit, genuine Free/Founding/Owner authentication, no future-bar leakage in chart/tutor, independent source and data rights, original protected assessment answers and accessible browser tests before assigning release signoff.

Source QA record: `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md`, v1.4. Indicator details: `data/talia-indicators61-73-evidence-v1.json`. Research standards: approved directory and nine-level master source registry, but a source reference does not grant commercial chart, quote feed, code, or ML reuse rights.

## Acceptance reconciliation: actual Chart Studio and live Supabase — v1.9

This section updates the factual release evidence without changing the **2,190 original Owner Roadmap commitment IDs**, stored progress, checkout, member entitlements, official grading, or source-authoring objectives.

**Gate 3:** There are 73 unique Tutor research study guides, 71 original fictional numerical reference cases and two intentionally restricted vendor-defined calculations (SCTR and VIX). Actual ECharts Chart Studio exposes **13 presentation toggles** in `assets/js/crownlight-echarts-studio-v1.js`, and reuse of shared math does not equate to 73 live implementations. `tests/talia-release-evidence-crosswalk-v1.test.mjs` now enforces the separation in both existing Pages and Tutor CI. Full configurable indicator coverage, matched vendor conventions, real member replay and commercial display rights remain OPEN.

**Gate 7:** Live Supabase inspection of seven representative competency, Lab, Tutor, Chart Workspace and Academy tables found RLS enabled for all seven. Tutor conversation, Tutor exchange, Chart Workspace and Academy checkpoint tables have **no direct anonymous or ordinary authenticated SELECT/INSERT grants**, and existing Lab/competency policies use `auth.uid()=user_id`. This is not genuine two-account browser acceptance and does not certify all `SECURITY DEFINER` routes; complete user A/B, session revocation, and staff roles remain OPEN.

**Gate 8:** The formerly queued Pages SHA `48268413d477a8ebd02515044a257fe022aa46e7` is verified deployed. Newer concurrent commits and dedicated Actions require a fresh frozen-SHA acceptance; an empty GitHub combined commit-status response is not proof Actions did or did not pass.

**Gate 9:** Premium engine product/checkout flags remain disabled. A member's verified Professional **Chart Studio** tier is separate from any future independently released Professional **Shared Learning/Lab/Tutor** edition. Do not conflate the entitlements.

**Next executable sequence:** (1) pass the new source-vs-production CI crosswalk; (2) complete all 40 claim-specific editorial/mathematical remedies; (3) test current ECharts actual supported indicators on completed chronological data; (4) run authenticated Tutor 40-scenario A/B journeys; (5) verify authenticated member/role isolation on existing server endpoints; (6) verify full mandatory Actions, not only Pages; (7) freeze one SHA and match production deploy; (8) release only signed-off functionality; (9) continue 260/600 explanation authoring after relevant gates. Strict accelerated ten-gate completion remains **1/10 = 10%**, overall website percentage unassigned.

Detailed QA evidence: `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md`, v1.5. GitHub is the source of record; Google Drive document ID not assigned.

## Claim mathematical execution and Batch 14 sequenced scope — v1.10

**November 1, 2026 — Source-only reconciliation.** This is part of the controlling `SMFGU-WEB-ROADMAP-RECON-20261101-001` and does not alter 2,190 original authenticated Owner Roadmap items, saved progress, existing member purchases, private assessments or premium release approvals.

| Source milestone | Current progress | Completion boundary |
|---|---:|---|
| One canonical curriculum evidence register | 1,366/1,366 (100%) | Target identities, **not** individual lesson release approval |
| Foundation source-authored explanations | **280/600 = 46.67%** | Concurrent Batch14 source drafting added 20; 320 remain. Batch14 0/20 independent editorial approvals and Batch13 retains acceptance requirements |
| Forty claims 101–140 | 40/40 source dispositions; 35/35 numeric cases have independent Python+JS tests configured; 5 interpretation-only cases preserved | Await actual CI result for new tests and remaining independent source/legal/publication review. 104, 129, 133 remain notable corrections/mismatches |
| Claim-specific source correction research | Three additional precise research references for 129, 135 and 139 | Portfolio HHI, EBIT coverage and debt/book equity source precision; no imported vendor media or rights approval |
| Indicator research and numerical examples | 73/73 studied; 71/73 individual math case fixtures | VIX and SCTR rights/methodology held; ECharts currently has 13 distinct presentation toggles rather than 73 certified live indicators |
| Labs / Academy | 419/419 Lab and 274/274 day identities | Curriculum inventory only |
| Basic Learning / Basic Lab | v3.3 / v3.2 source retained | Engine-wide independent completion % not measured |
| Advanced, Professional, Enterprise engines | 0% premium independent release acceptance | Retain server authorization and no unapproved checkout grants |

**Order and inconsistency:** Owner previously directed Batch13 independent editorial acceptance before explanation drafting 261–280. A concurrent developer source commit created Batch14 anyway and added source-only member Tutor retrieval. Preserve these original ungraded drafts as provisional source work, flag sequencing conflict, and do not treat source accessibility as formal independent editorial approval, protected competence or commercial release.

**Next ten gates:** Retain verified Gate1; resolve individual Gate2 source mathematics and corrective language; verify Gate3 member ECharts implementations/settings and vendor holds; run Gate4 signed-in Tutor conversations; verify Gate5 authoritative learning prerequisites and completed-bar coaching; obtain Gate6 all-mandatory Github Actions statuses; execute Gate7 genuine Free/Founder/Owner, mobile and screen-reader checks; freeze/deploy one SHA Gate8; release only independently accepted Gate9 functionality; and Gate10 continue source authoring only under recorded editorial prerequisites. Strict overall gate completion **1/10 = 10%**. No defensible overall website completion percentage yet.

**Evidence:** `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md` (v1.6), `data/talia-claim-source-remediation-129-135-139-v1.json`, `scripts/qa/talia_claims101_140_independent_python_v1.py`, `tests/talia-claims101-140-python-js-editorial-v1.test.mjs`, `tests/talia-source-remediation-specificity-v1.test.mjs`. Cloudflare and GitHub exact-SHA acceptance must be independently confirmed; pending runs do not count.

## Gate 2/3 acceptance work — five qualitative reviews and ECharts independent math

**Project/date/authority:** The Stock Market: From the Ground Up, 2026-11-01. Preserve all 2,190 controlling Owner Roadmap item identities and existing signoffs. This v1.11 reconciliation is evidence documentation, not a new milestone, deployed rights grant, billing authorization, or protected assessment change. Google Drive document ID is unassigned; GitHub `docs/roadmap/SMFGU-WEB-ROADMAP-RECON-20261101-001.md` is the controlling source path.

| Gate/substep | Executed evidence | Release boundary |
|---|---|---|
| 1 — canonical curriculum inventory | 1,366/1,366 target identities, conflict/duplicate source checks retained | Original 600 explanation slots, 73 guides, 419 Labs, 274 Academy days still controlling |
| 2 — claims 101–140 | 35/35 independently tested fictional arithmetic cases + 5/5 individual qualitative SEC/FINRA/accounting source-scope reviews; 40/40 separate dispositions | Claims 104 and 133 retain legal and historic-publication warning; claim 129 has supplementary specific concentration formula source; 0/40 individual final publication rights and legal/editorial approvals |
| 3 — ECharts source math | 18 independent Python-vs-production-JS complete series **passed** across 225 fictional, completed-bar observations; EMA warmup, RSI/ATR/MACD/Bollinger, HLC3 bar VWAP proxy, observed ranges, rewind consistency | Existing Chart Studio exposes 13 presentation toggles, NOT 73 certified live studies; 71/73 original per-subject math cases; VIX/SCTR research-only vendor holds; remaining settings/platform parity and authenticated browser UX still required |
| 4 — source Tutor continuity | Original followup and member-identity fixture tests retained | Real authenticated conversation quality/retry/persistence/transfer not yet accepted |
| 5 — paid advanced/professional source prototypes | Private server entitlement and revealed-bar contracts remain | Verified logged-in membership and premium product grants remain independently unaccepted |
| 6 and 8 — exact-SHA CI and Cloudflare | Cloudflare **success and deployed** SHA `0cced43ad705989bcfcbf933652402717a1773bd` with targeted new checks `ok` | Full mandatory GitHub Actions matrix on one frozen SHA not independently established; later doc SHA requires another matching deployment |
| 7 — genuine member/browser/accessibility | Previous seven-table RLS audit and existing source mock negative tests | Real Free/Founding/Owner, account A/B, staff and screen-reader verification remain OPEN |
| 9 — premium commercial release | 0% of Advanced/Professional/Enterprise Learning and Lab engine editions independently released | No unsupported premium access, checkout or vendor data rights granted |
| 10 — Foundation authoring | 280/600 = 46.67% source drafted; 320 not authored | Batch 13/14 0% independent publication signoff; do not infer official grade completion |

**Strict accelerated gate denominator remains 1/10 = 10%**, and the overall website completion percentage remains unassigned. Individual math-source tests close important technical substeps but not the entire gate's required authorization, editor approval, accessible UX, rights, complete CI and production SHA evidence.

**Accepted control sources:** `docs/qa/2026-11-01_TALIA_ACCELERATED_EVIDENCE_BATCH_016_v1.md`, version 1.7; `data/talia-claims-five-qualitative-editorial-review-v1.json`; `scripts/qa/talia_echarts_member_math_python_v1.py`; `tests/talia-echarts-independent-python-js-v1.test.mjs`. CI source is Cloudflare Pages deployment records and the existing GitHub workflow; absent full Actions outcomes are explicitly not marked green.

## Revision history

| Version | Date | Change | Owner disposition |
|---|---|---|---|
| 1.0 | 2026-11-01 | Reconcile release records, engine edition targets, 93/380 Academy acceptance, source/graded separations and ten ordered gates in the real authenticated Roadmap UI | Source implementation; final production signoff open |
| 1.1 | 2026-11-01 | Reconcile 73 Tutor study guides, 16 computed prototype studies, live Supabase/Risk60 audit findings and six prioritized execution gates | Read-only source evidence; independent release acceptance open |
| 1.2 | 2026-11-01 | Link 1,366 identity projection, 40-claim evidence batch, 15-indicator Python/JS regression and no-release research holds | Source progress accepted as development evidence only |
| 1.3 | 2026-11-01 | Implement first Section C ECharts overlay/control/table source batch; add offline Chromium CI gate; preserve denominator and release distinctions | Source implementation; exact-head CI, Cloudflare and authenticated acceptance open |
| 1.4 | 2026-11-01 | Add synchronized RSI/MACD/ATR panes, editable panel heights, strict OHLCV input control, independent Decimal edge fixtures, and expanded browser CI | Source committed; independent final release acceptance open |
| 1.5 | 2026-11-01 | Connect per-indicator ECharts settings to the existing authenticated versioned workspace, add server allowlist and client privacy/restore tests; preserve non-release mathematical and editorial denominators | Source committed; independent exact-main, Cloudflare and signed-in acceptance open |
| 1.6 | 2026-11-01 | Repair 16-study prototype session calculations and derived VWAP; expand multi-session and proxy-integrity regression tests | Source committed; workflow/external acceptance open |
| 1.7 | 2026-11-01 | Reconcile 60 studied subjects / 59 independent numeric fixtures, 260 authored explanations, source review identity fix and continued ten-gate controls | Source QA only; exact-head GitHub Actions, rights and real sessions open |
| 1.8 | 2026-11-01 | Add 61–73 subject QA, 12 cross-implementation fixtures, official Cboe VIX and StockCharts SCTR restricted exceptions, 71/73 configured math denominator | Internal source QA only; all genuine publication, account, legal and release acceptance open |
| 1.9 | 2026-11-01 | Verify actual 13-control ECharts UX vs 73 guide research, add CI crosswalk and live Supabase seven-table RLS/grants/policy audit | Production/member/rights acceptance still open |
| 1.10 | 2026-11-01 | 280/600 authored drafts with Batch14 held; claim-specific Python/JS 35-number audit; three source remediation references; unchanged ten release gates | Full CI, genuine auth, rights and editorial acceptance open |
| 1.11 | 2026-11-01 | Verified 5/5 qualitative source scopes, 18/18 independent complete ECharts math series, targeted Pages production deployment SHA | Source CI accepted only; full Actions, genuine logged-in users, rights and premium release remain open |

## ECharts-to-Tutor Chromium mismatch correction — local execution evidence

Against clean source baseline `011bf12996d90e512d41c3d309c4a8d01b485919`, the reported account-mismatch Chromium timeout was reproduced. Inspection showed the browser fixture captured the identity during the popup's inherited `about:blank` document, so the supposed second account was actually `MemberA`. The fixture now resolves identity at Auth-read time after navigation. The source handoff also retries its short-lived, same-origin nonce readiness message to handle popup initialization ordering, and stops the retry on explicit account rejection or successful transfer. Account comparison, access entitlement, user-editable question, and no-auto-submit checks remain enforced.

**Local results:** The handoff Node contract and all five existing ECharts Chromium suites passed with pinned Playwright 1.56.1 and ECharts 6.1.0. This is mocked browser evidence. GitHub Actions on the resulting exact `main` SHA, Cloudflare production parity, real signed-in account A/B, keyboard/mobile and screen-reader acceptance remain OPEN until independently verified. No database/API schema, membership, protected grade, chart formula, or payment changes were made.

**Roadmap status:** This closes the local reproduction/correction substep for the chart-to-Tutor handoff. It does not close the full Tutor, ECharts, authentication, or production release gates. Existing 2,190 canonical Owner Roadmap items and all engine/product acceptance denominators remain unchanged.

**Revision history addition:** v1.12 / 2026-11-01 / Reproduced and corrected the chart-to-Tutor Chromium mismatch fixture; local Node and 5/5 ECharts Chromium suites pass; hosted exact-SHA CI, production, and genuine authenticated acceptance remain open.

## Hosted verification — chart-to-Tutor correction

The source correction commit `e2ffc6ccdbc590066177a3e2ae693d93be8f51f1` completed **27/27 GitHub Actions workflows successfully** on the exact SHA. The focused ECharts [workflow run 41378238461](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41378238461) passed both Node contract and real Chromium jobs. The full [Sitewide Playwright and Stripe Noncharging Regression run 41378238408](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41378238408) also passed both jobs. Stripe lifecycle coverage was mocked and noncharging.

Cloudflare Pages production `release-manifest.json` reported the same `gitCommit`; the changed JavaScript returned HTTP 200 and matched committed source after line-ending normalization. This verifies candidate source deployment parity, while the manifest still explicitly reports `productionAcceptance: not_certified`. Actual signed-in account A/B, Owner/Free/Founding roles, keyboard and screen-reader acceptance, editorial/source-rights approval, and consolidated Owner release acceptance remain OPEN.

**Revision history addition:** v1.13 / 2026-11-01 / Recorded all 27 exact-SHA workflow successes, the two focused handoff gates, and Cloudflare production manifest plus served-asset parity; genuine member and consolidated release acceptance remain open.

## Chart Studio 3.0 member workstation source batch

The actual `simulator.html` browser workspace now offers a chart-level fictional load action, explicitly classified dataset status and 21-bar selected fictional context. Its Lightweight Charts viewport retains configurable candle spacing/right buffer through redraws and keyboard panning. The optional provider verification panel follows the chart. The active Standard/Advanced/Professional view is identified separately from the server-verified maximum tier. A chart-level Ask Talia action reuses the existing nonce/account-verified, editable handoff. The separate server-controlled replay and its private decision boundary were not reclassified as local browser history.

Local fixture-authenticated Chromium tests cover 390/768/1440 px chart interaction, Free/guest/restricted paths, personal-provider import authorization, real Professional KLineChart rendering and workspace synchronization, and same-account/mismatched Tutor handoff. Independent Python and JavaScript tests agree across 18 full chart-study series and their warmups. [Detailed change and test register](../releases/2026-11-01_CROWNLIGHT_CHART_STUDIO_3_MEMBER_WORKSTATION_BATCH.md) and two labeled fixture screenshots are retained in this repository. These results do not constitute genuine member, provider, production, or accessibility acceptance. Existing 3/14 strict Chart Studio acceptance gates and all other website/engine denominators remain unchanged pending individual signoff.

**Revision history addition:** v1.14 / 2026-11-01 / Advanced the live member Chart Studio source and local desktop/mobile QA; exact-commit CI, deployment parity, genuine account/provider tests, rights, and consolidated release acceptance remain separate gates.

## Talia Tutor Training execution continuation — v1.15

**Source and live-build evidence (2026-11-01):** The original 45 individual Tutor instructional reviews (20 Batch 13, 20 Batch 14, five priority Foundation lessons) and 40 source-only scenario outcomes (20 PASS, 20 PARTIAL) remain controlling. New CI-tested integration calls the **existing authorized Tutor POST endpoint** with two simulated member identities for 40/40 exact guide scenarios, checks 403 suspension, validates same-member prior-question retrieval and cross-member conversation denial, and ignores forged browser history. This is synthetic API acceptance, **not** real Free/Founding/Owner credential testing. Cloudflare successfully built/deployed code with the new route, followup and adaptive tests in SHA `d2c5e5ca9134b7cfa109e09f9e5f8d51e66e2ee9`; the inspected logs contain no `not ok` and explicit PASS for the new regression groups.

**Actual Tutor improvement:** The existing source-only Foundation `review` now selects one of four authored topic-specific feedback scaffolds: uncertain learner, certainty wording, numeric explanation and evidence reasoning. Every one of the 45 reviewed lessons has separately exercised responses for all four text categories, while private reflection text is not echoed and no grade or mastery is assigned. The module is `functions/_lib/talia-foundation-reflection-coach-v1.js`, reused through the existing `original-competency-tutor-v014100.js`; no new paid inference, database, entitlement or engine created.

**Scope boundary:** A detected writing pattern is not proof of factual correctness, actual misconception, or a verified trader skill. Saved previous **question** context is server-scoped; it does not yet prove persistent personalized remediation across real member sessions. The 40 original source cases remain 20 PASS/20 PARTIAL for full teaching acceptance. The wider 600-topic curriculum is 280/600 authored. Independent lesson publication approval remains 0/45. Basic Learning v3.3 and Lab v3.2 are preserved, with complete engine-wide percentages unverified. Advanced/Professional/Enterprise Learning/Lab/Tutor premium release 0% independently accepted.

**CI and release:** One early intermediate Pages attempt timed out launching an independent Python Decimal indicator fixture within eight seconds; its cold-start timeout was increased to 30 seconds without changing numeric tolerances or formulas. Subsequent successful Pages tests do not certify all mandatory GitHub Actions on a frozen SHA. Exact final-head production parity, user A/B real sessions, chart entitlement/cutoff, mobile/screen readers and third-party source redistribution rights remain OPEN. **Overall ten-gate strict closure remains 1/10 = 10%**, sitewide percentage unscored. Controlling supplemental report: `docs/learning/2026-11-01_TALIA_MASTER_TRAINING_45_REVIEWS_v1.md`, version 1.1 (document ID `SMFGU-TALIA-TRAIN-045-001`), GitHub main; Google Drive document ID not assigned.

**Revision-history addition:** v1.15 / 2026-11-01 / Added actual-Tutor-route 40-case synthetic access QA, four member conversation protections, four-way per-topic ungraded coaching on 45 reviews, CI regression and Pages build verification. Independent commercial/member release still OPEN.

## Chart Studio 3.0 hosted source acceptance — v1.16

The Chart Studio correction SHA `c1792214c67907df07e4dd68215496cd5698432e` passed all **28/28** triggered Actions workflows, including real Chromium charts, source-scoped workspace, Replay Journal, and full Sitewide Playwright plus mocked, noncharging Stripe regression. Cloudflare production manifest matched the SHA and served changed chart assets matched committed bytes after line-ending normalization. The first source SHA had stale literal-source test failures that were repaired; cancelled or pending runs were not counted as passes. See the linked [Chart Studio release evidence](../releases/2026-11-01_CROWNLIGHT_CHART_STUDIO_3_MEMBER_WORKSTATION_BATCH.md).

This advances source/CI/deployment parity only. Genuine Free, Founding, Professional Owner, restricted and account A/B sessions, personal-provider rights, historical cutoff acceptance, screen-reader/manual keyboard review, and consolidated Owner release remain OPEN. No Chart Studio strict release gate or sitewide completion percentage was incremented from synthetic QA alone.

**Revision-history addition:** v1.16 / 2026-11-01 / Recorded 28/28 exact correction-SHA Actions successes and matching Cloudflare served-source parity for the Chart Studio member workstation batch; genuine release acceptance remains open.

**Revision-history addition:** v1.17 / 2026-11-01 / Corrected Basic shared-engine checkpoint fail-open behavior after an unverified member-progress read; targeted local Node tests passed, while exact-main CI, deployment and real-member acceptance remain open.

**Revision-history addition:** v1.18 / 2026-11-01 / Reverified 120/419 subject-specific Lab bridges and hardened the member quantitative UI against direct rendering of calculations without canonical lesson mappings. The six Basic parity features remain partial; exact-SHA CI/deployment for this change, 299 authored bridges, accessibility, editorial acceptance and the unavailable November 2 source-directory upload remain open.

**Revision-history addition:** v1.19 / 2026-11-02 / Added 20 distinct, rights-gated Day Trading teaching bridges (`DT-C14-L01`–`DT-C20-L02`) and verified all seven batch contracts at 140/419 authored. The new material remains editorial-review-pending; 279 bridges, member accessibility, publication and engine-wide release acceptance remain open.

**Revision-history addition:** v1.20 / 2026-11-02 / Bound existing ATR and Bollinger teaching workbenches to canonical Labs `DT-C19-L03` and `F3-C07-L04` with topic revalidation, completed-bar conventions, accessible-table requirements and independent numerical regression. All five named Basic indicator studies now have source mappings; editorial approval, authenticated accessibility, full topical-Lab parity, exact-SHA CI and production parity remain open.

**Revision-history addition:** v1.21 / 2026-11-02 / Recovered all 13 formerly ID-only Foundation titles from matching existing `data/labs.json` and `data/interactive-lab-index.json` companion concepts and updated the controlling catalog, competency map and bridge records together. Added twenty original Batch10 bridges (`DT-C34-L01`–`DT-C40-L02`) for 200/419 authored, and recorded forty individual Batch08-09 AI editorial preflights without claiming human approval. Academy requested-day/first-unfinished restoration remains source-tested; genuine authenticated continuity/accessibility and 219 unauthored Labs remain open.

**Revision-history addition:** v1.22 / 2026-11-02 / Added twenty original Batch11 bridges for 220/419 source-authored and source-tested, including all thirteen recovered Foundation records and seven Day Trading records. Completed individual Batch10 AI editorial preflight without claiming independent human approval. Genuine authenticated continuity/accessibility, independent editorial acceptance, publication rights and 199 unauthored Labs remain open.

**Revision-history addition:** v1.23 / 2026-11-02 / Added twenty original Batch12 Day Trading bridges (`DT-C43-L01`–`DT-C50-L02`) for 240/419 source-authored and source-tested. Named-security replay lessons use explicitly fictional analogues and retain rights holds. Corrected the mandatory research-rights contract after authoritative Foundation title recovery; independent human editorial, authenticated continuity/accessibility, publication rights and 179 unauthored Labs remain open.

**Footer:** SMFGU-WEB-ROADMAP-RECON-20261101-001 · v1.23 · Private Owner evidence snapshot · No payment, independent editorial, legal, graded-assessment or full website release certification.
