# Talia Market Tutor — Four-Edition Cumulative Feature Matrix and Foundation V1 Improvement

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Market Tutor |
| Document ID | SMFGU-TALIA-FOUR-EDITION-MATRIX-001 |
| Filename / type | `docs/learning/SMFGU-TALIA-FOUR-EDITION-MATRIX-001-v1-20261101.md` / Markdown |
| Google Drive / document ID | Not created; unassigned. GitHub `main` is the controlling record. |
| Version / date | 1.0 / 2026-11-01 |
| Status | Owner-approved additive edition specification; Foundation math source implemented, exact-head CI and real authenticated acceptance separately required |
| Dependencies | `AGENTS.md`, `docs/learning/SMFGU-TALIA-EDITION-001-v1-20261101.md`, `functions/api/market-tutor-v01492.js`, `functions/_lib/original-competency-tutor-v014100.js`, existing member RBAC, protected Labs and private history |
| Purpose | Fix the edition allocation and prevent future premium editions from withholding essential teaching or accidentally granting unreleased or billable features. |

## Immutable cumulative product rule
- Foundation (Basic) is the complete core teaching baseline.
- Advanced = all Foundation features + approved adaptation/prerequisite capabilities.
- Professional = all Advanced features + approved chart/replay/contextual analysis workspaces.
- Enterprise = all Professional features + approved multi-source research, configurable comparison and higher-level learning workflow capabilities.
- Higher-tier plan *target*, server-authorized effective Tutor edition, content entitlement and separately consented/cost-gated optional inference are four distinct properties. Source presence and UI affordances do not themselves release a premium edition.
- Basic explanations, in-depth examples, mathematical instruction, practice, corrective feedback and ordinary retries remain free for each accessible lesson across **all** editions. No paid-unlock explanations.
- No edition, including Enterprise, may reveal protected rubrics, private answers, unseen replay evidence, personalized buy/sell advice or unauthorized member records; no AI calls without allowed provider, consent, quota and cost safeguards.

## Membership mapping — unchanged
| Membership | Target Tutor edition | Operational status |
|---|---|---|
| Free | Foundation | Current Basic source; authenticated acceptance pending |
| Founding 14-Day | Foundation | Current Basic source; authenticated acceptance pending |
| Pick What You Want | Foundation plus independently verified add-ons | No implied add-on grant |
| Founding 30-Day | Advanced | Not yet released |
| Founding 60-Day | Professional | Not yet released |
| Full Monthly | Professional | Not yet released |
| Lifetime | Enterprise | Not yet released |
| OnDemand Monthly | Product-dependent | Requires independently verified entitlement |
| Full Annual and historical plans | Unassigned | Requires independent terms reconciliation |

## Precise edition capabilities
Legend: BASE means required at Foundation and inherited unchanged; ADD means first introduced in that edition; INHERIT means available by inheritance. Premium items are **requirements, not verified deployed features**.

| Capability | Foundation | Advanced | Professional | Enterprise |
|---|---|---|---|---|
| Verified companion-source retrieval and original 30 competency guides | BASE | INHERIT | INHERIT | INHERIT |
| First-principles explanations, Explain, Teach Deeper, Guided Example, Try Another | BASE | INHERIT | INHERIT | INHERIT |
| Fictional numerical cases: OHLC, VWAP proxy, EMA, risk/share, position ceiling, relative sample volume, planned risk/reward | BASE | INHERIT | INHERIT | INHERIT |
| Step-by-step inputs/units/formulas, common mistakes, uncertainty, independent transfer | BASE | INHERIT | INHERIT | INHERIT |
| Ungraded self-check, correction, normal retry, authorized optional saved history | BASE | INHERIT | INHERIT | INHERIT |
| 61 indicator guide access with truthful calculated-versus-conceptual disclosure | BASE | INHERIT | INHERIT | INHERIT |
| Diagnostic prerequisite graph from approved recorded learning signals | — | ADD | INHERIT | INHERIT |
| Adaptive explanation selection and targeted misconception correction | — | ADD | INHERIT | INHERIT |
| Verified skill-based study recommendations and learning-path sequencing | — | ADD | INHERIT | INHERIT |
| Context-aware multi-indicator instruction with ECharts 6.1 | — | — | ADD | INHERIT |
| Server-bounded replay and chart decision-point coaching, no lookahead | — | — | ADD | INHERIT |
| Historical/fictional/source provenance comparisons and decision debriefs | — | — | ADD | INHERIT |
| Cross-course evidence-led research workflows and larger diagnostics | — | — | — | ADD |
| Configurable professional research comparisons and synthesis tools | — | — | — | ADD |
| Advanced workbench evidence/learning reporting with permitted sources | — | — | — | ADD |

## Foundation implementation started — SMFGU-TALIA-FOUNDATION-MATH-001
Target: improve instructional depth at zero provider expenditure, without a parallel curriculum.

1. `functions/_lib/tutor-foundation-worked-math-v1.js` holds **two genuinely different fictional cases each for seven canonical guide IDs**: `CANDLE_READING`, `VWAP_CONTEXT`, `EMA_CONTEXT`, `RISK_PER_SHARE`, `POSITION_SIZING`, `VOLUME_ANALYSIS`, `RISK_REWARD`.
2. `functions/_lib/original-competency-tutor-v014100.js` attaches the structured worked calculations to canonical source-only **explain** and **deeper explain** responses. Assessment-style question/review remains independent and ungraded. Every case has original arithmetic, declared units, limits, and a fresh transfer prompt.
3. `assets/js/market-tutor.js` provides a functional “Try another worked example (source-only)” prompt when an eligible canonical teaching topic is present. Consent to optional AI inference is explicitly unchecked for that action.
4. `functions/api/market-tutor-v01492.js` recognizes another-example intent and selects deterministic source-only guidance before attempting a provider draft. The same authenticated request, consent, member history and security controls still apply.
5. `tests/talia-foundation-worked-math-v1.test.mjs` checks seven numerical first/alternate fixtures, public official-guide reuse, Explain vs Question/Review separation, no forbidden trade claims and the no-charge UI/server routing. Existing `.github/workflows/learning-tutor-v01492.yml` invokes new syntax and regression tests.

**Scope:** Original hypothetical 2D teaching cases only. The three-bar HLC3-volume VWAP result is NOT a tick-exact VWAP. The EMA illustration uses a disclosed three-bar period and does NOT mislabel itself as EMA 9/20/200. A fictional stop reference does not guarantee fill or a maximum actual loss. No historical market-data license, trading edge or grading approval is inferred.

**Source QA:** Each canonical explanation and free deeper explanation is checked against the same reference source ID; the more complex member teaching and production service remain gated on CI and actual signed-in tests. No database migration, price change, role assignment, payment operation or provider activation.

## Foundation acceptance sequence (current execution order)
1. Confirm source builds, exact `main` Tutor workflow, legacy privacy, no-grade, consent, model-denial, guided-example and deep-teaching regressions.
2. Confirm the new seven-topic arithmetic and alternate-case actions in authenticated Free/Founder Basic sessions; verify topic routing, references, source-only flags and no paid request.
3. Extend original canonical arithmetic after individually verified curriculum content, especially VWAP, EMA 9/20 and 200 warmup, candles, volume, spread, position/risk, levels and MFE/MAE; do not invent unsupported evidence.
4. Verify source-only answer quality across all 30 competencies and 61 original indicator guides, including explanation depth and misconception correction; make first-principles teaching as capable as available authorized data permits.
5. Finish independent editor, accessibility and authenticated member acceptance for Foundation; preserve privacy and no-lookahead. Only then mark Foundation complete.

## Subsequent build sequence
- **Advanced:** prerequisite signals → adaptive diagnostics → targeted learning paths → secure member acceptance.
- **Professional:** bounded current chart/replay evidence → ECharts multi-study interactions → interactive debrief and cross-tool workflow → production acceptance.
- **Enterprise:** deeper multi-course research orchestration → governed evidence synthesis → configurable workbench → acceptance.
- All editions: server-controlled entitlements, fallback to Foundation, downgrade without progress loss, no automatic inference cost, explicit versioned Admin/Owner source approval and rollback.

## Release status / percentages
- Edition policy allocation: **4/4 defined = 100%**.
- Premium editions independently accepted/released: **0/3 = 0%**.
- Foundation feature build completion: **not measured** until a fixed audited Foundation requirement denominator and authenticated acceptance exist. Do not confuse seven first-source cases or the existing 30/61/419 inventory with 100% instructional completion.
- The earlier nine-gate whole-Tutor audit should not be treated as the work breakdown for this narrower four-edition development plan.

## Rollback and revision
- Source rollback: revert the bounded Worked Mathematics module, companion source-guide and API integrations, UI action, tests and workflow wiring as one coherent main-branch change; preserve current member history, security settings, product mappings and premium policy.
- No secrets copied to source, no production schema touched, no paid service switched on.

| Version | Date | Change | Approval |
|---|---|---|---|
| 1.0 | 2026-11-01 | Freeze cumulative four-edition matrix; begin Foundation with seven original source-only worked-math case pairs, browser action and CI contract | Owner-delegated noncommercial source decision; release acceptance pending |

**Footer:** SMFGU-TALIA-FOUR-EDITION-MATRIX-001 v1.0 · GitHub main controlling · No payment authorization, personalized investment advice, protected assessment certification or blanket production sign-off.
