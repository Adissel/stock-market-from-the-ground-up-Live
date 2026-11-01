# SMFGU-COORD-005 — Five-Chat Parallel Engineering Coordination Register

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Website |
| Document ID | SMFGU-COORD-005 |
| Filename / type | `SMFGU-FIVE-CHAT-COORDINATION-REGISTER-v1.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/sitewide/` |
| Google Drive location / document ID | Not created / not assigned; GitHub main is source of record |
| Version / prepared | 1.0 / 2026-11-01 |
| Status | COORDINATION RULES RECORDED; cross-chat acknowledgement, CI and live release acceptance OPEN |
| Last inspected GitHub head (not accepted SHA) | `bff048e543ab5d79f09ce21964963d4d3e714d4c` at drafting; may change during concurrent writes |
| Dependencies | AGENTS.md, PROJECT_SITEWIDE_RULES.md, current roadmap, protected shared learning/lab/tutor engines, existing ECharts assets |
| Purpose | Reduce conflicting edits and redundant builds while preserving five concurrent zero-cost Chat/Plugin workstreams |

## Operating decision

The Owner has five **separate chats**, all contributing to **one** canonical GitHub `main` repository. This document is an advisory ownership and integration register, not a repository lock, automatic notification channel, or claim that other chats have read or accepted it. Direct-to-main and no paid Work Mode remain controlling. The Owner retains approval over billing, security-sensitive and destructive actions. Cloudflare build success is distinct from complete CI and real signed-in release acceptance.

## Named workstreams and file ownership

| Chat (exact name) | Primary responsibility | Source examples / advisory ownership | Must not silently override |
|---|---|---|---|
| Indicator Implementation | Indicator formulas, seed/warm-up conventions, input validation, no-lookahead calculations, Python numerical reference and indicator source review | `assets/js/crownlight-indicator-math-v2.js`; `scripts/chart-independent-quant-reference-v1.py`; indicator math/registry tests and source documents | ECharts presentation, protected grades or server entitlements |
| Branch · Learning And Lab Engines | Shared Learning v3.3 Basic / Lab v3.2 Basic; guided/practice stages, private grading, prerequisites, saved progress and teaching evidence | `assets/js/lab-engine-v32-universal.js`; `assets/js/learning-adaptive-diagnostic-v1.js`; `assets/js/learning-evidence-diagnostic-v1.js`; Lab/Academy contracts | Independent indicator source-of-truth formulas or Tutor subscription/billing controls |
| Tutor Training | Talia instructional methodology, authored explanations, dialogue quality, misconception feedback, provenance and editorial acceptance | Tutor training data, curricula, editorial review scripts and `docs/learning/` Tutor acceptance reports (coordinate individual shared files) | Member-facing React component ownership or ECharts drawing code |
| Build Interactive Tutor Website | Signed-in member tutoring UI, interaction state, Tutor-chart integration, accessible React/TypeScript prototypes and guarded API wiring | `assets/js/crownlight-chart-tutor-v1.js`; member-facing Tutor routes, React/TSX workstations and their interaction tests | Protected server assessment, canonical indicator math or unrelated Admin analytics |
| ECharts Dashboard Implementation | Same-origin Apache ECharts graphics, dashboard data presentation, accessible chart patterns, color/theme, responsive layouts, and reusable chart components | `assets/js/crownlight-echarts-admin-v1.js`; `assets/js/free-foundations-echarts-v1.js`; `assets/js/learning-progress-echarts-v1.js`; `assets/js/crownlight-visual-kit-v1.js`; their associated visual CSS/tests | Formulas, scoring, server permissions, private learner records or Tutor teaching decisions |

These paths are **advisory ownership**, not exclusive global locks. Existing combined files such as `lab-player.html`, `dashboard.html`, `assets/js/crownlight-learning-echarts-v1.js`, `assets/js/crownlight-echarts-replay-v1.js`, `prototype.html`, `market-tutor.html`, `assets/js/dashboard.js`, and CI YAML are **shared integration surfaces**. Every writer must fetch fresh content and blob SHA before editing and preserve other chats' changes. A source change to a shared file requires explicit interface compatibility checks.

## Required hand-off record (append within each workstream's own release note)

1. Chat / workstream, requirement IDs, file paths, and **exact base and resulting commit SHA**.
2. API/event contract name, version, schemas, source authority, entitlement and data provenance.
3. Impacted consumers and owners; migration or schema changes, if any; no hidden duplication.
4. Tests run **with outcomes** (PASS / FAIL / NOT RUN), with actual GitHub run link if available.
5. Cloudflare deployed SHA (when confirmed), signed-in QA, account-isolation, accessibility and rollback evidence.
6. Dependencies and open acceptance explicitly separated from source completion.

## Integration data boundaries

- **Indicators -> ECharts:** Indicator Implementation owns validated completed-bar calculation outputs, warmup/seed and units; visualization consumes immutable visible-through-bar series and may never calculate or reveal withheld future bars. An indicator guide is not automatically a supported computed overlay.
- **Learning/Labs -> ECharts:** Learning/Lab Engines own authenticated lesson identity, stage, ungraded/graded distinction and protected progress. Charts render only authorized aggregate or bounded instructional values; they never set mastery, award currency or read assessment answer keys.
- **Tutor Training -> Interactive Tutor:** Tutor training owns editorially reviewed explanation/feedback content and instructional rules. Interactive Tutor owns authorized member presentation and session handling, not grading.
- **Interactive Tutor <-> ECharts:** Versioned event/data interfaces link visible chart elements and Talia prompts; events are not authorization. Any market/replay interaction requires canonical current-bar cutoff and source labels.
- **Admin -> ECharts:** Existing authorized admin summary event only; chart display cannot grant Owner/Admin or expose private tables.
- **Shared chart kit:** Browser presentation-only, same-origin ECharts 6.1.0, no new API, database, entitlement, Stripe charge, Python edge runtime, or external CDN.

## Concurrency and CI protocol

1. Read current `main` immediately before modifying a shared path; use current blob SHA for contents writes, and retry **only after reconciling concurrent edits**. Do not overwrite from old drafts.
2. Develop/test independent paths in parallel. Prefer a small batch of cohesive source changes instead of repeatedly touching the same page or running redundant global test suites.
3. A run with cancelled/skipped checks due to a newer push is not a successful frozen-head release. Wait for a **coordinated final main SHA** for full CI and Cloudflare production verification.
4. Run targeted source/contract/math/browser checks continuously; run all mandatory regression/security/accessibility gates before final release. Test independence is not permission to weaken acceptance.
5. When pipelines fail, diagnose root cause and fix on main, then re-establish the acceptance SHA. Reuse successful evidence only if still applicable to that SHA.
6. No speculative overall completion. Distinguish source implementation, test passes, editorial decisions, member acceptance and deployed production.

## Shared release gate status (at document creation)

| Gate | Status / evidence |
|---|---|
| Five named workstream responsibilities recorded | SOURCE DOCUMENTED; no other-chat acknowledgement proven |
| Shared visualization interface register | Separate v1 contract required; consumer adoption independent |
| Free Foundations and Admin source chart batch | Source present; see `docs/releases/2026-11-01_ECHARTS_DASHBOARDS_SOURCE_v1.md` |
| Chromium ECharts regression | Browser suite authored; latest exact-SHA results NOT VERIFIED here |
| GitHub Actions current-head CI | NOT VERIFIED |
| Matching Cloudflare stable production deployment | NOT VERIFIED for resulting SHA |
| Signed-in Owner, Free member, account switch, accessibility | NOT VERIFIED |

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-01 | Exact five-chat scope, file ownership, dependency boundaries, concurrency and acceptance register |

**Footer:** SMFGU-COORD-005 · v1.0 · Source coordination only · No paid services, membership changes or production sign-off.
