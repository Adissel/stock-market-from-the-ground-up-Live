# Talia Mercer — 45-Review Instructional Batch and 40-Scenario QA

| Control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| New document ID | SMFGU-TALIA-TRAIN-045-001 |
| Source | GitHub main, `docs/learning/2026-11-01_TALIA_MASTER_TRAINING_45_REVIEWS_v1.md` |
| Google Drive | Not created; document ID unassigned |
| Version/date | 1.1 / November 1, 2026 |
| Status | Internal instructional revision completed; independent editorial and member release NOT accepted |
| Dependencies | AGENTS.md, SMFGU-COORD-005, Learning v3.3, Lab v3.2, source-only Tutor, 600 explanation target slots |
| Purpose | 45 individual corrective teaching reviews, 40 executable scenario evaluations, provenance and reproducible acceptance record |

## Executed review

**45/45 distinct internal reviews and revisions:** 20 Batch13 lessons, 20 Batch14 lessons and five priority Foundation topics 104, 105, 119, 129, 133. Each has a unique diagnostic question, specific corrective teaching, research limitation, ungraded transfer exercise and individual release hold.

The complete itemized register is `data/talia-training-editorial45-v1.json`; its records include lesson codes, original examples, applied corrections, source candidate/checked evidence, revision state and source SHAs. Edited teaching material remains in the original `data/talia-foundation-explanations-batch06-v1.json`, `batch07-v1.json`, `batch13-v1.json` and `batch14-v1.json`; existing Tutor controllers, permissions, grading and engines were not edited.

Material corrections:
- A displayed quote neither confirms a buy-limit fill nor confirms zero fills; execution requires order-specific evidence. SEC Investor.gov order types: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders
- The SEC's 2023 share-repurchase disclosure rule was vacated effective December 19, 2023; archived speech cannot be taught as effective current law: https://www.sec.gov/rules-regulations/2024/03/s7-21-21
- Portfolio HHI sums squared decimal weights, e.g., 0.38 for 50/30/20; it does not measure correlation or certify safety: https://www.ssga.com/us/en/individual/insights/concentration-is-up-diversification-isnt-gone
- An EDGAR acceptance timestamp does NOT prove the exact second a filing first became publicly available, so a chart replay must preserve uncertainty: https://www.sec.gov/about/webmaster-frequently-asked-questions
- Preferred cumulative/noncumulative rights are instrument-specific and maturity differs from bond duration: https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks ; https://syndication.finra.org/content/duration-what-interest-rate-hike-could-do-your-bond-portfolio

**Source-contract fix:** The existing Tutor loader requires exactly one allowlisted canonical URL per guide. Additional corrective references were moved to editorial metadata instead of weakening loader validation. Four unsupported Nasdaqtrader canonical URLs in Batch14 were replaced with SEC/Investor.gov source-scope candidates; the original vendor links remain internal research candidates. Those SEC pages do NOT establish all order-book feed details, so source rights and precise scope remain OPEN.

## Forty actually executed evaluation scenarios

`data/talia-tutor-evaluation40-v1.json` contains 40 distinct lesson-specific test cases, grouped 10 foundation, 10 mathematics, 10 misconception/follow-up, 10 historical-risk/transfer. `tests/talia-training45-evaluation40-v1.test.mjs` invokes the current source-only `answerFromGuide`, checks original worked cases, unique diagnostics, corrections, risk boundaries, transfer exercises and protected-grade integrity. It was added to existing `scripts/build-pages.sh` without replacing other tests.

**Actual Cloudflare source-test outcomes:** **20 PASS / 20 PARTIAL / 0 FAIL / 0 BLOCKED / 0 NOT EXECUTED**. Exactly 40 `EVAL40` log lines and the 45-entry integrity test passed at deployed SHA `2e3173045c496c9edc53b2bab612a2d7cb96eb36`, deployment ID `b9d0b26a-e9cf-4224-b926-a0b5508b753c`. The PARTIAL outcomes explicitly require genuine authenticated memory, live chart as-of, cross-member and retry acceptance. These are internal code-driven tests, not independent blinded pedagogical evaluation or commercial publication approval.

## Source and release boundaries

The user-supplied Master Research Source Directory is a research catalog. Free-reading sources cannot automatically be redistributed as course text, licensed chart data or vendor code. **45/45 internally revised; 0/45 independently publication-approved.** Broader Foundation authoring remains **280/600 = 46.67%**, official 30 competence IDs preserved. **73/73** indicator subjects researched, **71/73** targeted numerical fixtures, vendor-defined VIX and SCTR restricted. Advanced, Professional and Enterprise Tutor editions have **0% independently accepted premium release**; Basic full release percentage not established. Existing ten-gate website strict completion remains **1/10 = 10%** without real authenticated/rights/CI evidence.

## Codex / five-chat coordination

Owner advisory scope `docs/sitewide/SMFGU-FIVE-CHAT-COORDINATION-REGISTER-v1.md` assigns instructional content, source review and methodology to Tutor Training; separate chats own React UI, ECharts math/display and Learning/Lab engines. This batch touched training datasets and an additive Pages build command only. No CI YAML, payment, authentication, private assessments, entitlement or chart renderer was edited. Other chats have not acknowledged this handoff. Future integration must reconcile exact SHAs before editing shared surfaces.

## Next ten executable acceptance gates

1. Preserve all 1,366 source identities and retest complete allowlisted batch loading.
2. Complete external independent editorial and rights review for all 45 cases; keep false claims and candidate-only sources held.
3. Reexecute the 40 scenarios under genuinely signed-in Free/Founding/Owner sessions, recording each PASS/FAIL/PARTIAL.
4. Prove multi-turn remembered context and adaptive correction after repeated real errors, without exposing private answers.
5. Test server-authorized current completed-bar ECharts/Tutor coaching and negative future-bar access.
6. Reconcile the five-chat source, front-end and entitlement contracts; no duplicate engines or writes.
7. Test real member A/B account isolation, role downgrade, suspension, sign-out and privacy.
8. Finish accessible mobile/tablet/keyboard/screen-reader classroom journeys.
9. Require full mandatory GitHub Actions and exact matching Cloudflare production SHA, including rollback.
10. Obtain independent curriculum/rights signoffs and release only separately accepted Basic/premium functionality; resume further drafting after editorial prerequisites.

## Continuation acceptance — v1.1

Forty source-only training scenarios were exercised through the existing Tutor POST endpoint under two simulated GoTrue identities. Exact topic selection, protected-grade denial and suspended access passed in the Cloudflare build for SHA `bd9a904a96e07c3b0e5ec045feb96237cfe289de`. Four additional server-route tests for verified prior-question context, cross-member conversation denial, forged browser history and restricted membership passed in SHA `142cfd851af2cbeac4c75d7b761b02e2ff214a4c`.

Talia's existing Foundation review now provides four lesson-specific, **ungraded** adaptive writing modes: uncertainty support, certainty checks, arithmetic-unit verification and evidence-building. The 45-lesson, four-way source regression and private-text non-echo checks passed and deployed in SHA `e569b22fd110e89f267f33ea233919d28cb997b6`. This is deterministic source coaching, not real-account, persistent conversational, chart-rights, AI-model, or editorial-release acceptance.

The source-only Tutor integration added `functions/_lib/talia-foundation-reflection-coach-v1.js` and an additive import/review call in `original-competency-tutor-v014100.js`. The existing Tutor GitHub workflow was updated to trigger and run the new route/adaptive checks. An unrelated indicator QA Python subprocess timeout was expanded from eight to 30 seconds without changing the mathematical assertions.

**Status:** 45/45 internal revisions; 40/40 original source scenarios executed (20 PASS / 20 PARTIAL); 40 synthetic member-route cases passed; four conversation access fixtures passed; three adaptive regression groups passed. **Zero** independently approved publication rights or premium releases. All real member roles, screen readers, full mandatory GitHub Actions and exact-final-SHA acceptance remain OPEN.

## Revision history

| Version/date | Change | Signoff |
|---|---|---|
| 1.0 / 2026-11-01 | 45 individual pedagogical revisions; five factual risk corrections; 40 scenario source test evidence; source loader allowlist repair; coordination handoff | Internal source QA only, NO independent editorial, legal, member or commercial release approval |
| 1.1 / 2026-11-01 | 40 synthetic authenticated Tutor route checks, same-member history and cross-member denial, four adaptive response conditions for 45 lessons, existing CI integration | Source-level tests passed; real account, publishing rights, screen reader and full mandatory GitHub Actions acceptance OPEN |

**Footer:** SMFGU-TALIA-TRAIN-045-001 · v1.1 · GitHub main · Rights, genuine accounts and exact-head release acceptance remain OPEN.
