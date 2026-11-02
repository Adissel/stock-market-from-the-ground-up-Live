# SMFGU — Shared Learning and Lab Engines: Feature-Level Completion Audit

## Gate 2 Basic progress-integrity correction — 2026-11-01

The existing v3.3 member checkpoint integration now remains fail-closed when its authoritative `site_lab_progress` read cannot be verified. Previously, the classroom displayed a load-failure warning but then re-enabled saves with an unverified revision; a legacy revision-zero record could therefore be replaced after a transient read failure. `assets/js/lab-engine-v32-universal.js` now enables checkpoint writes only after a successful load (including a verified empty result), and keeps the save control disabled after a load error. `tests/test_v33_member_checkpoint_resume.mjs` protects the new state transition alongside the existing serialization, CAS-conflict, account-change and protected-field checks.

This is a focused Basic reliability/security correction. It does not increase the 64-feature numerator, release a premium edition, alter grading, change entitlements, certify authenticated production persistence, or establish independent release acceptance. Local Node source and targeted engine tests passed; Python validation was not runnable because the execution host has no Python interpreter. Exact-head CI, matching Cloudflare deployment and genuine member browser acceptance remain open.

| Control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-LEARNING-LAB-FEATURE-AUDIT-001 |
| Filename / type | `SMFGU-LEARNING-LAB-FEATURE-AUDIT-001-v1-20261101.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/learning/` |
| Google Drive location / document ID | Not created / unassigned |
| Version / preparation date | 1.5 / November 2, 2026 |
| Status | SOURCE INVENTORY AUDITED; production and independent release approval OPEN |
| Data source | `data/learning-lab-engine-feature-audit-v1.json` |
| Calculator | `scripts/qa/learning-lab-engine-feature-audit-v1.mjs` |
| Regression | `tests/learning-lab-engine-feature-audit-v1.test.mjs` |
| Dependencies | Frozen Learning v3.3 Basic, Lab v3.2 Basic; 419 Labs, 30 competencies, 274 Academy days; Owner-approved 4-tier targets; existing member authorization, private grading, source-only research modules and CI |
| Purpose | Fix a verifiable denominator for each edition of each independent engine without counting policy targets, authored drafts or staff prototypes as production release. |

## Formula and evidence policy

### Batch A/B mapping-boundary reconciliation — v1.2

The six subject-specific Lab batch contracts still establish exactly **120/419** authored bridges, leaving **299**; no count was inferred from generic registry rows. At the member quantitative-workbench boundary, `learning-quant-studies-ui-v1.js` now independently revalidates the canonical Lab/topic/competency mapping selected by the shared engine. A browser caller therefore cannot convert tested but unmapped ATR or Bollinger mathematics into a released member lesson by passing a study ID directly. Existing mapped RSI, MACD, EMA and risk exercises retain their original authorization, fictional-data, retry, transfer and no-grade behavior.

This hardening advances `LE-BAS-06` and `LA-BAS-07` but does not satisfy their full parity criteria: ATR/Bollinger canonical lesson approval, all applicable Lab chart mappings, accessible browser acceptance, provenance/editorial decisions and independently verified learning results remain open. The repository contains the November 1 Master Research Source Directory v1.1 and its 73-source registry; the separately referenced November 2 upload was not accessible during this batch.

### Batch 07 curriculum authoring — v1.3

Twenty previously unauthored canonical Day Trading Labs, `DT-C14-L01` through `DT-C20-L02`, now contain distinct first-principles definitions, fictional worked evidence, misconception correction, retries and new-case transfers. Competencies come from the existing canonical competency-path registry. Every bridge remains `BATCH07_ORIGINAL_EDITORIAL_REVIEW_PENDING`, uses research candidates only, grants no publication/data-ingestion rights, contains no historical bars or protected grades, and has no member or independent editorial acceptance. Seven batch contracts now verify **140/419 authored and source-tested bridges; 279 remain**. `LE-BAS-08` and `LA-BAS-06` remain partial.

### ATR and Bollinger canonical source integration — v1.4

The existing shared indicator calculator and quantitative workbench now authorize ATR only for canonical Lab `DT-C19-L03` (Range and Volatility) and Bollinger Bands only for canonical Lab `F3-C07-L04` (narrow price-window whipsaw). Both mappings require the matching canonical topic, use completed fictional bars, declare USD/share units and calculation conventions, retain accessible-table requirements, and remain ungraded. Wrong-topic requests fail closed. Existing Batch 5 and Batch 7 authored instruction was preserved byte-for-content rather than replaced by an indicator-specific duplicate.

Focused source verification covers the period seed, Wilder recursion, gap-aware true range, population-deviation convention, warmup, finite-output rejection, changed transfer inputs and no-lookahead prefix independence. This establishes **5/5 named indicator studies with canonical source integration**, but the new ATR/Bollinger records remain `EDITORIAL_REVIEW_PENDING`; authenticated accessible member review, individual editorial approval, exact-SHA CI and matching deployment remain open. Consequently `LE-BAS-06` and `LA-BAS-07` remain partial under their registered full acceptance criteria.

Each of the eight combinations (two independent engines × four editions) has **exactly eight distinct additive feature requirements** recorded below. This v1.0 checklist is an auditable source-integration measure, **not an estimate of labor or total product completion**. A check is fully integrated only if the corresponding member-engine capability is present; `partial`, `prototype` and `not_implemented` contribute zero fully integrated checks.

**Source-integration percentage = 100 × fully integrated feature checks / 8.** Premium rows assess only **new capabilities for that premium edition**; inherited Basic features are not counted a second time. A source or test filename is evidence of a relevant implementation/contract, not proof that a fresh GitHub workflow, real member browser journey or independent editorial audit passed. Full release for each edition requires verified authorization, testing, licensing, accessibility and same-SHA deployment, separately.

## Audited source-integration matrix

| Engine | Edition | Integrated features | Integration % | Partial features | Safe prototypes | Independent edition release |
|---|---|---:|---:|---:|---:|---|
| Shared Learning | BASIC | 5/8 | 62.50% | 3 | 0 | Not independently released |
| Shared Learning | ADVANCED | 0/8 | 0.00% | 0 | 3 | Not independently released |
| Shared Learning | PROFESSIONAL | 0/8 | 0.00% | 0 | 4 | Not independently released |
| Shared Learning | ENTERPRISE | 0/8 | 0.00% | 0 | 4 | Not independently released |
| Shared Lab | BASIC | 5/8 | 62.50% | 3 | 0 | Not independently released |
| Shared Lab | ADVANCED | 0/8 | 0.00% | 0 | 4 | Not independently released |
| Shared Lab | PROFESSIONAL | 0/8 | 0.00% | 0 | 4 | Not independently released |
| Shared Lab | ENTERPRISE | 0/8 | 0.00% | 0 | 3 | Not independently released |

**Related curriculum denominator:** the latest source-tested fourteen-batch register contains **280/419 (66.83%) individually authored Lab teaching bridges**; 139 still require original subject-specific instruction. The 419 registered IDs and the 274 Academy study-day identities do **not** represent independent full teaching acceptance. The 280/419 curriculum statistic is NOT included in these engine integration percentages.

## Shared Learning Engine — detailed feature-by-feature findings

### BASIC

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LE-BAS-01 | First-principles lesson instruction | integrated | `assets/js/lab-v33-instructor.js` · `tests/test_v014099_curriculum_contract.mjs` | Authorized member sees correct teaching for selected canonical topic. | Individual accuracy and genuine session review open. |
| LE-BAS-02 | Worked EMA and risk calculations | integrated | `assets/js/learning-quant-studies-v1.js` · `tests/learning-quant-studies-v1.test.mjs` | Verify units, seeds, arithmetic and changed independent example in member Lab. | Exact browser and editor acceptance open. |
| LE-BAS-03 | Evidence-led misconception feedback | integrated | `assets/js/learning-evidence-diagnostic-v1.js` · `tests/learning-evidence-diagnostic-v1.test.mjs` | Observed mistakes yield supported ungraded feedback without made-up mastery. | Real learner and independent editorial acceptance open. |
| LE-BAS-04 | Prerequisite review from existing evidence | integrated | `assets/js/lab-engine-v32-universal.js` · `tests/engine-classroom-contract-v1.test.mjs` | Show only authorized prerequisite suggestions without changing stored competency. | Cross-account member evaluation open. |
| LE-BAS-05 | Independent practice, retries and transfer | integrated | `assets/js/lab-engine-v32-universal.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Distinct ungraded transfer must not disclose answers before an attempt. | Protected grade and accessibility acceptance open. |
| LE-BAS-06 | Complete indicator-topic teaching parity | partial | `assets/js/learning-indicators-v1.js` · `tests/learning-indicators-v1.test.mjs` · `tests/basic-atr-bollinger-lessons-v1.test.mjs` | All released EMA, RSI, MACD, ATR and Bollinger lessons have approved mappings. | 5/5 named studies have canonical source mappings; ATR/Bollinger editorial approval and authenticated accessible acceptance remain open. |
| LE-BAS-07 | Free Foundations and Academy progression parity | partial | `assets/js/bootcamp-academy-v014168.js` · `tests/academy-member-day-restoration-v1.test.mjs` | Genuine learners maintain prerequisite and stage progress across courses. | Valid requested-day and first-unfinished restoration are source-tested; authenticated cross-course accessibility acceptance remains open. |
| LE-BAS-08 | Individually reviewed and accessible whole-catalogue instruction | partial | `assets/js/lab-v33-instructor.js` · `tests/lab-bridge-batch14-source-v1.test.mjs` | All 419 Labs receive original reviewed lessons and accessible progression. | Fourteen batches record 280/419 authored; 139 remain. |

### ADVANCED

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LE-ADV-01 | Reviewed-signal prerequisite routing | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Serve a personalized route only with verified Advanced Learning grant. | Pure helper exists, no released member integration. |
| LE-ADV-02 | Targeted adaptive remediation | prototype | `assets/js/learning-evidence-diagnostic-v1.js` · `tests/learning-evidence-diagnostic-v1.test.mjs` | Verify multi-step diagnosis using authorized learner records. | Basic diagnostic does not constitute Advanced release. |
| LE-ADV-03 | Multi-indicator contextual explanation | prototype | `assets/js/learning-indicators-v1.js` · `tests/learning-indicators-v1.test.mjs` | Compare independently validated indicators in an Advanced lesson. | No edition-authorized classroom integration. |
| LE-ADV-04 | Advanced entitlement grant and revocation | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Enforce product grant, downgrade and denial server-side. | Owner target is not a grant. |
| LE-ADV-05 | Personalized multi-lesson course sequencing | not implemented | No member implementation | Prove adaptive transitions retain approved course prerequisites. | No authenticated edition journey. |
| LE-ADV-06 | Advanced learner-history isolation | not implemented | No member implementation | Member A cannot read or influence member B diagnostic decisions. | No real member lifecycle acceptance. |
| LE-ADV-07 | Accessible Advanced learning controls | not implemented | No member implementation | Work on keyboard, touch and screen reader with server edition checks. | No released user interface. |
| LE-ADV-08 | Independent Advanced Learning production acceptance | not implemented | No member implementation | Pass exact SHA, QA, rights, accessibility, member security signoff. | No independent feature release. |

### PROFESSIONAL

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LE-PRO-01 | Comparative decision reasoning | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Give grounded debriefs limited to observable completed bars. | Pure source helper, not real member coach. |
| LE-PRO-02 | No-lookahead replay instruction | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Use server-authenticated as-of cutoff at every learning decision. | Source prefix alone cannot secure server replay. |
| LE-PRO-03 | Original risk scenario comparisons | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Validate whole-share risk calculations, slippage cautions and transfer. | Not integrated into Professional learning journey. |
| LE-PRO-04 | Linked multi-indicator chart instruction | prototype | `assets/js/lab-advanced-echarts-preview-v1.js` · `tests/lab-advanced-echarts-preview-v1.test.mjs` | Synchronize selected chart studies to Professional learner instruction. | Staff preview only. |
| LE-PRO-05 | Persistent professional decision debrief | not implemented | No member implementation | Save, isolate and restore authorized decision evidence. | No edition-specific protected history. |
| LE-PRO-06 | Multi-timeframe prerequisite-aware learning workflow | not implemented | No member implementation | Verify time-aligned completed frames and contextual teaching. | Not integrated in member product. |
| LE-PRO-07 | Professional entitlement, downgrade and expiry | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Enforce each request against server-owned professional rights. | Only target policy exists. |
| LE-PRO-08 | Independent Professional Learning acceptance | not implemented | No member implementation | Pass genuine member, no-lookahead, browser, accessibility and CI. | No accepted release. |

### ENTERPRISE

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LE-ENT-01 | Research sample statistics and limits | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Explain assumptions and calculations under licensed evidence bounds. | Standalone source methods, not member workflow. |
| LE-ENT-02 | Chronological holdout and embargo methods | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Separate test data and prevent training contamination. | No integrated enterprise research course. |
| LE-ENT-03 | Sensitivity and validation-bias instruction | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Prevent test-set winner selection or unwarranted predictive claims. | Only source utility. |
| LE-ENT-04 | Versioned provenance and rights manifest | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Require source rights, time, method version and reference. | Manifest unpublished, not user workflow. |
| LE-ENT-05 | Governed cross-course research learning path | not implemented | No member implementation | Connect research tasks to existing authorized curriculum. | No authenticated cross-course Enterprise research learning path is integrated. |
| LE-ENT-06 | Entitled research citation and source rights | not implemented | No member implementation | Validate as-of citations and rights for each member data source. | No enterprise source-rights acceptance. |
| LE-ENT-07 | Enterprise grants, revocation, downgrade | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Server must deny revoked and cross-member research access. | Owner policy only. |
| LE-ENT-08 | Independent Enterprise Learning release | not implemented | No member implementation | Pass real entitlement, data-rights, research QA and accessibility. | Enterprise Learning has no independently accepted member production release. |

## Shared Lab Engine — detailed feature-by-feature findings

### BASIC

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LA-BAS-01 | Preserved nine saved stages and ten visible steps | integrated | `assets/js/lab-engine-v32-universal.js` · `tests/test_v014099_curriculum_contract.mjs` | Stage identity, Calculate microstage and restoration work for actual member. | Real checkpoints and screen-reader verification open. |
| LA-BAS-02 | Canonical 419-Lab registry routing | integrated | `assets/js/lab-engine-v32-universal.js` · `tests/test_v014099_curriculum_contract.mjs` | All known IDs resolve only to authorized existing Lab sources. | Live member-by-member content parity open. |
| LA-BAS-03 | Protected member instruction and grading separation | integrated | `functions/api/lab-content.js` · `tests/engine-classroom-contract-v1.test.mjs` | Member and anonymous permissions preserve official answer-key secrecy. | Live A/B member and admin boundary acceptance open. |
| LA-BAS-04 | Guided fictional practice with instructor | integrated | `assets/js/lab-v33-instructor.js` · `tests/test_v014099_curriculum_contract.mjs` | Approved fictional activity uses correct per-stage concepts and feedback. | Per-Lab source/editorial review incomplete. |
| LA-BAS-05 | Ungraded retries and independent transfer | integrated | `assets/js/lab-engine-v32-universal.js` · `tests/learning-evidence-diagnostic-v1.test.mjs` | Transfer practice cannot award mastery or show protected grading keys. | Authentic browser assessment isolation pending. |
| LA-BAS-06 | 419 original individually authored Lab cases | partial | `assets/js/lab-v33-instructor.js` · `tests/test_v014099_curriculum_contract.mjs` | Every canonical Lab has specific reviewed example, correction and transfer. | 120/419 individually authored; 299 remain. |
| LA-BAS-07 | ECharts and quantitative study parity for all topical Labs | partial | `assets/js/learning-quant-studies-ui-v1.js` · `tests/learning-quant-studies-v1.test.mjs` | Every relevant entitled Lab has verified math, chart and accessible fallback. | Selective initial studies only; not universal parity. |
| LA-BAS-08 | Authenticated Academy and Free stage continuity | partial | `assets/js/lab-player.js` · `tests/academy-member-day-restoration-v1.test.mjs` | Free and Academy checkpoints restore with signout and cross-member denial. | Restoration order and authenticated write gates are source-tested; real member signout/account-switch/session-expiry and accessibility acceptance remain open. |

### ADVANCED

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LA-ADV-01 | Linked completed-bar ECharts studies | prototype | `assets/js/lab-advanced-echarts-preview-v1.js` · `tests/lab-advanced-echarts-preview-v1.test.mjs` | Member-bound dual chart reflects only authorized completed evidence. | Current chart is staff fictional prototype. |
| LA-ADV-02 | Advanced multi-study evidence comparisons | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Compare bounded, independently checked methods for real entitled account. | Research helper not member access. |
| LA-ADV-03 | Prerequisite-focused remediation within a Lab | prototype | `assets/js/learning-evidence-diagnostic-v1.js` · `tests/learning-evidence-diagnostic-v1.test.mjs` | Check reviewed prerequisite then route to correct Lab practice. | Existing Basic feedback has no Advanced-specific runtime. |
| LA-ADV-04 | Indicator calculations with explicit variant controls | prototype | `assets/js/learning-indicators-v1.js` · `tests/learning-indicators-v1.test.mjs` | Configure and validate sanctioned studies by input and warmup. | No Advanced member entitlement or complete settings. |
| LA-ADV-05 | Server-controlled Advanced Lab grants | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Prove member plan cannot be forged and expired grant is denied. | Plan targets only. |
| LA-ADV-06 | Protected Advanced assessment and mastery isolation | not implemented | No member implementation | Extra features never reveal keys or change authoritative grading. | No edition-specific security acceptance. |
| LA-ADV-07 | Advanced saved stage and downgrade continuity | not implemented | No member implementation | Maintain authorized past progress without retaining premium access. | No edition grant/revocation implementation. |
| LA-ADV-08 | Genuine Advanced mobile and assistive acceptance | not implemented | No member implementation | Test real eligible/restricted members, responsive layouts and CI. | No premium release evidence. |

### PROFESSIONAL

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LA-PRO-01 | Professional linked chart panels | prototype | `assets/js/lab-advanced-echarts-preview-v1.js` · `tests/lab-advanced-echarts-preview-v1.test.mjs` | Expose two synchronized chart panels only to entitled member. | Existing source is staff-only preview. |
| LA-PRO-02 | Bounded historical Lab replay | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Authorize dataset and only completed observations for each step. | Pure source helper not deployed permissioned replay. |
| LA-PRO-03 | Fictional scenario and risk case analysis | prototype | `functions/_lib/learning-lab-formative-editions-v1.js` · `tests/learning-lab-formative-editions-v1.test.mjs` | Deliver reviewed ungraded scenarios with measured outcomes. | Not integrated in premium Lab. |
| LA-PRO-04 | Explicit uncertainty evidence review | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Teach missing-information boundaries without invented mastery. | Research utility not tied to actual Lab member stages. |
| LA-PRO-05 | Versioned professional Lab workspace persistence | not implemented | No member implementation | Save and restore per-user view without cross-account disclosure. | Chart Studio persistence is separate engine. |
| LA-PRO-06 | Professional protected assessment compatibility | not implemented | No member implementation | Prove stable grading, no answer leakage and downgrade integrity. | No Professional grade pathway tested. |
| LA-PRO-07 | Professional Lab entitlement gate | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Deny Basic/expired/forged premium permission server-side. | Policy target not a grant. |
| LA-PRO-08 | Independent Professional Lab acceptance | not implemented | No member implementation | Pass real account, accessibility and deployment verification. | No member premium release. |

### ENTERPRISE

| ID | Feature | Source state | Evidence / existing test | Required acceptance | Remaining blocker |
|---|---|---|---|---|---|
| LA-ENT-01 | Governed research evidence manifests | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Bind rights-approved source metadata into Enterprise Lab. | Pure source helper. |
| LA-ENT-02 | Research-method sensitivity comparisons | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Use valid assumptions and preserve held-out evaluation data. | Source-only quantitative comparison. |
| LA-ENT-03 | Chronological source holdout laboratory | prototype | `functions/_lib/learning-lab-research-evidence-v1.js` · `tests/learning-lab-research-evidence-v1.test.mjs` | Implement correct embargo and no future leakage in member stage. | Not an authorized Lab experience. |
| LA-ENT-04 | Enterprise cross-course research stage journey | not implemented | No member implementation | Map actual entitled research lessons into progression. | No authorized Enterprise Lab research stage journey exists for members. |
| LA-ENT-05 | Multi-source research Lab workbench | not implemented | No member implementation | Save member-owned approved source cases with audit history. | No released workstation. |
| LA-ENT-06 | Enterprise dataset rights controls | not implemented | No member implementation | Reject missing provider rights before delivering any data. | No independently signed rights workflow. |
| LA-ENT-07 | Enterprise Lab entitlement and revocation | not implemented | `functions/_lib/learning-engine-tier-policy-v1.js` · `tests/learning-engine-tier-policy-v1.test.mjs` | Verify server grant, renewal, downgrade and isolation. | No effective edition entitlement. |
| LA-ENT-08 | Independent Enterprise Lab acceptance | not implemented | No member implementation | Pass genuine member, no-lookahead, screen-reader and CI. | Enterprise Lab has no independently accepted member production release. |

## Release controls and evidence gaps

1. Basic effective runtime remains Learning v3.3 / Lab v3.2; a 62.50% feature-checklist score does not mean Basic release readiness or Basic labor completion is 62.50%.
2. Advanced, Professional and Enterprise contain separately enumerated bounded source prototypes, but **0/8 fully integrated new member capabilities** for each edition; `premiumFeaturesReleased:false` and add-on checkout remain disabled.
3. All 64 feature checks have unresolved genuine-account, editorial, quantitative, rights, accessibility or edition-release acceptance. An audited source count is not a signed-off release.
4. The independent ten-gate engine release register remains open; the new score cannot supersede that register or claim a passed whole-system gate.
5. Do not infer live third-party market-data rights, exact broker formula parity, paid subscription releases, or permissions from a staff prototype or source-only module.
6. The machine-readable audit freezes the initial source status. A future editor must update a feature's evidence and acceptance record and rerun tests before changing its source-state numerator.

## What is next — in execution order

1. Run the new evidence/percentage guard as part of mandatory Pages CI. Repair any evidence-file or denominator mismatch; do not weaken tests.
2. Complete genuine Basic Free/Founding/Owner two-account source-and-grade acceptance, sign-out, device and assistive-tech evaluation.
3. Finish 299 original individual Lab teaching bridges (121–419) and verify each lesson's numerical, editorial and source facts.
4. Reconcile actual RSI, MACD, ATR, Bollinger, EMA and risk-study Lab bindings with complete warmup/unit mathematics and classroom chart accessibility.
5. Verify Free Foundations and seven Academy paths through private stage checkpoints, prerequisite guidance, ungraded retries and safe transfer.
6. Connect existing formative prerequisites, safe feedback and course routing to authenticated, server-entitled Advanced Learning and Lab variants.
7. Integrate Professional time-bounded chart/replay contracts and comparative calculations, verifying historical data rights and member entitlement.
8. Implement Enterprise versioned research workflows with as-of source governance, bias review and stored member isolation.
9. Run four-edition session revocation, downgrade, cross-account, keyboard/screen reader, quantitative and protected-assessment acceptance.
10. Freeze an exact commit, verify all mandatory GitHub workflows and matching Cloudflare deployment; record individual gate signoffs only when evidence exists.

## Revision history

| Version | Date | Change | Decision |
|---|---|---|
| v1.0 | 2026-11-01 | Established 64 feature requirements and eight source-integration denominators with per-feature blockers, source and test pointers | Source audit complete; real-member and premium release acceptance open |
| v1.1 | 2026-11-01 | Made Basic checkpoint writes fail closed until the authoritative member revision or verified empty state loads | Local targeted Node verification passed; exact-main CI, deployment and member acceptance open |
| v1.2 | 2026-11-01 | Reverified 120/419 authored bridges and required canonical mapping revalidation at the member quantitative UI boundary | Source hardening tested; six Basic parity rows remain partial and release acceptance unchanged |
| v1.3 | 2026-11-02 | Added and source-tested 20 distinct Day Trading bridges for a verified 140/419 authored denominator | Editorial, accessibility, authenticated member and publication acceptance remain open |
| v1.4 | 2026-11-02 | Added fail-closed canonical ATR and Bollinger source mappings without replacing existing authored lessons; verified 5/5 named studies at the source boundary | ATR/Bollinger editorial approval, authenticated accessibility, exact-SHA CI/deployment and full Lab parity remain open |
| v1.5 | 2026-11-02 | Recovered 13 canonical Foundation titles from two matching existing companion registries; recorded 40 Batch08-09 AI preflights; added Batch10 for 200/419 authored; reconciled Academy restoration evidence | Independent human editorial, authenticated continuity/accessibility, 219 Labs and complete topical-chart parity remain open |
| v1.6 | 2026-11-02 | Added Batch11 for 220/419 authored, completing source-authored bridges for the 13 recovered Foundation records; recorded 20 individual Batch10 AI preflights | Independent human editorial, authenticated continuity/accessibility, 199 Labs and complete topical-chart parity remain open |
| v1.7 | 2026-11-02 | Added Batch12 for 240/419 authored, including provenance-safe replay cases that do not invent named-security history; reconciled the Batch04 title-recovery research contract | Independent human editorial, authenticated continuity/accessibility, 179 Labs and complete topical-chart parity remain open |
| v1.8 | 2026-11-02 | Added Batch13 for 260/419 authored, extending replay/readiness and tape-reading instruction with explicit feed, timestamp, uncertainty and no-lookahead boundaries | Independent human editorial, authenticated continuity/accessibility, 159 Labs and complete topical-chart parity remain open |
| v1.9 | 2026-11-02 | Added Batch14 for 280/419 authored with auditable tape-rate, depth, liquidity-sequence, absorption and sweep instruction | Independent human editorial, authenticated continuity/accessibility, 139 Labs and complete topical-chart parity remain open |

**Footer:** SMFGU-LEARNING-LAB-FEATURE-AUDIT-001 · 2026-11-02 · v1.9 · GitHub `main` controlling · No payment, grade or premium grant.
