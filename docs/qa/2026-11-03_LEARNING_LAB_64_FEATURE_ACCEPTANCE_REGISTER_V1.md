# Learning and Lab Engines — 64-Feature Source-Evidence and Acceptance Register

| Document control | Value |
|---|---|
| Document ID | SMFGU-LE-LA-QA-064-20261103 |
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Repository | `Adissel/stock-market-from-the-ground-up-Live` |
| Google Drive location | Not assigned; GitHub repository is authoritative for this source register |
| Repository path / filename | `docs/qa/2026-11-03_LEARNING_LAB_64_FEATURE_ACCEPTANCE_REGISTER_V1.md` |
| File type | Markdown (`.md`) |
| Version | 1.0 |
| Status | Internal source-evidence compilation; NOT an independent member or premium release acceptance |
| Research / compilation date | 2026-11-03 |
| Review date | Not established |
| Source baseline | `main`, repository source revision `de452a150bf7e35de696e7de4360eaa78c256d52` |
| Dependencies | Shared Learning Engine v3.3, Shared Lab Engine v3.2, 419 canonical Labs, 30 competencies, entitlement and RLS controls, versioned tier audit v1.2 |
| Purpose | Crosswalk all 64 enumerated feature requirements to source artifacts, executable tests and unresolved acceptance gates without implying release readiness |

## Executive evidence summary

The governing inventory is `data/learning-lab-engine-feature-audit-v1.json` (v1.2). This report compiles that ledger and verifies corresponding repository file paths. It does **not** independently validate market-data rights, educational correctness, a real authenticated user journey, assistive technologies, payment acceptance or official assessment security.

| Measurement | Count | Percentage | Meaning |
|---|---:|---:|---|
| Fully integrated source items | 16/64 | 25.0% | Only Basic Learning and Basic Lab source requirements are counted as integrated; owner approval is recorded separately |
| Any source/prototype coverage | 58/64 | 90.6% | Includes 31 partial items and 11 prototypes; these do not count as fully integrated |
| Not implemented / not independently accepted | 6/64 | 9.4% | Six final tier-specific acceptance requirements, IDs listed below |
| Genuine member acceptance | 0/64 | 0% | None of the ledger features has an independent genuine member sign-off |
| Independent premium release acceptance | 0/48 | 0% | No Advanced, Professional or Enterprise source item has independent release approval |

**These figures are not the full website completion percentage.** No validated sitewide weighted denominator exists. The Basic 100% figure is source integration in this scoped 64-item ledger, not certification of every learner journey or sitewide production readiness.

## Tier-by-tier source and integrated coverage

| Engine and tier | Integrated | Partial | Prototype | Not implemented | Source/prototype coverage | Fully integrated |
|---|---:|---:|---:|---:|---:|---:|
| Learning — BASIC | 8/8 | 0 | 0 | 0 | 100.0% | 100.0% |
| Learning — ADVANCED | 0/8 | 7 | 0 | 1 | 87.5% | 0.0% |
| Learning — PROFESSIONAL | 0/8 | 7 | 0 | 1 | 87.5% | 0.0% |
| Learning — ENTERPRISE | 0/8 | 1 | 6 | 1 | 87.5% | 0.0% |
| Lab — BASIC | 8/8 | 0 | 0 | 0 | 100.0% | 100.0% |
| Lab — ADVANCED | 0/8 | 7 | 0 | 1 | 87.5% | 0.0% |
| Lab — PROFESSIONAL | 0/8 | 7 | 0 | 1 | 87.5% | 0.0% |
| Lab — ENTERPRISE | 0/8 | 2 | 5 | 1 | 87.5% | 0.0% |

## Source register — 64 individual requirements

Rows reproduce the controlling ledger's requirement IDs, current source classifications, named source references, executable test references and acceptance criteria. All 62 non-null evidence and test file paths were found in the audited repository tree. A referenced file establishes traceability, **not** verified operation in a real member account.

| Requirement | Source status | Requirement / purpose | Source file | Test reference | Acceptance criterion |
|---|---|---|---|---|---|
| LE-BAS-01 | integrated | First-principles lesson instruction | `assets/js/lab-v33-instructor.js` | `tests/test_v014099_curriculum_contract.mjs` | Authorized member sees correct teaching for selected canonical topic. |
| LE-BAS-02 | integrated | Worked EMA and risk calculations | `assets/js/learning-quant-studies-v1.js` | `tests/learning-quant-studies-v1.test.mjs` | Verify units, seeds, arithmetic and changed independent example in member Lab. |
| LE-BAS-03 | integrated | Evidence-led misconception feedback | `assets/js/learning-evidence-diagnostic-v1.js` | `tests/learning-evidence-diagnostic-v1.test.mjs` | Observed mistakes yield supported ungraded feedback without made-up mastery. |
| LE-BAS-04 | integrated | Prerequisite review from existing evidence | `assets/js/lab-engine-v32-universal.js` | `tests/engine-classroom-contract-v1.test.mjs` | Show only authorized prerequisite suggestions without changing stored competency. |
| LE-BAS-05 | integrated | Independent practice, retries and transfer | `assets/js/lab-engine-v32-universal.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Distinct ungraded transfer must not disclose answers before an attempt. |
| LE-BAS-06 | integrated | Complete indicator-topic teaching parity | `assets/js/learning-indicators-v1.js` | `tests/learning-indicators-v1.test.mjs` | All released EMA, RSI, MACD, ATR and Bollinger lessons have approved mappings. |
| LE-BAS-07 | integrated | Free Foundations and Academy progression parity | `assets/js/bootcamp-academy-v014168.js` | `tests/test_v014099_curriculum_contract.mjs` | Genuine learners maintain prerequisite and stage progress across courses. |
| LE-BAS-08 | integrated | Individually reviewed and accessible whole-catalogue instruction | `assets/js/lab-v33-instructor.js` | `tests/test_v014099_curriculum_contract.mjs` | All 419 Labs receive original reviewed lessons and accessible progression. |
| LA-BAS-01 | integrated | Preserved nine saved stages and ten visible steps | `assets/js/lab-engine-v32-universal.js` | `tests/test_v014099_curriculum_contract.mjs` | Stage identity, Calculate microstage and restoration work for actual member. |
| LA-BAS-02 | integrated | Canonical 419-Lab registry routing | `assets/js/lab-engine-v32-universal.js` | `tests/test_v014099_curriculum_contract.mjs` | All known IDs resolve only to authorized existing Lab sources. |
| LA-BAS-03 | integrated | Protected member instruction and grading separation | `functions/api/lab-content.js` | `tests/engine-classroom-contract-v1.test.mjs` | Member and anonymous permissions preserve official answer-key secrecy. |
| LA-BAS-04 | integrated | Guided fictional practice with instructor | `assets/js/lab-v33-instructor.js` | `tests/test_v014099_curriculum_contract.mjs` | Approved fictional activity uses correct per-stage concepts and feedback. |
| LA-BAS-05 | integrated | Ungraded retries and independent transfer | `assets/js/lab-engine-v32-universal.js` | `tests/learning-evidence-diagnostic-v1.test.mjs` | Transfer practice cannot award mastery or show protected grading keys. |
| LA-BAS-06 | integrated | 419 original individually authored Lab cases | `assets/js/lab-v33-instructor.js` | `tests/test_v014099_curriculum_contract.mjs` | Every canonical Lab has specific reviewed example, correction and transfer. |
| LA-BAS-07 | integrated | ECharts and quantitative study parity for all topical Labs | `assets/js/learning-quant-studies-ui-v1.js` | `tests/learning-quant-studies-v1.test.mjs` | Every relevant entitled Lab has verified math, chart and accessible fallback. |
| LA-BAS-08 | integrated | Authenticated Academy and Free stage continuity | `assets/js/lab-player.js` | `tests/engine-classroom-contract-v1.test.mjs` | Free and Academy checkpoints restore with signout and cross-member denial. |
| LE-ADV-01 | partial | Reviewed-signal prerequisite routing | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Serve a personalized route only with verified Advanced Learning grant. |
| LE-ADV-02 | partial | Targeted adaptive remediation | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Verify multi-step diagnosis using authorized learner records. |
| LE-ADV-03 | partial | Multi-indicator contextual explanation | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Compare independently validated indicators in an Advanced lesson. |
| LE-ADV-04 | partial | Advanced entitlement grant and revocation | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Enforce product grant, downgrade and denial server-side. |
| LE-ADV-05 | partial | Personalized multi-lesson course sequencing | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Prove adaptive transitions retain approved course prerequisites. |
| LE-ADV-06 | partial | Advanced learner-history isolation | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Member A cannot read or influence member B diagnostic decisions. |
| LE-ADV-07 | partial | Accessible Advanced learning controls | `assets/js/learning-lab-edition-panel-v1.js` | `tests/learning-lab-edition-member-surface-v1.test.mjs` | Work on keyboard, touch and screen reader with server edition checks. |
| LE-ADV-08 | not_implemented | Independent Advanced Learning production acceptance | `.github/workflows/learning-lab-premium-editions-v1.yml` | `tests/advanced-learning-lab-source-closeout-v1.test.mjs` | Pass exact SHA, QA, rights, accessibility, member security signoff. |
| LA-ADV-01 | partial | Linked completed-bar ECharts studies | `assets/js/learning-lab-edition-panel-v1.js` | `tests/learning-lab-edition-member-surface-v1.test.mjs` | Member-bound dual chart reflects only authorized completed evidence. |
| LA-ADV-02 | partial | Advanced multi-study evidence comparisons | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Compare bounded, independently checked methods for real entitled account. |
| LA-ADV-03 | partial | Prerequisite-focused remediation within a Lab | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Check reviewed prerequisite then route to correct Lab practice. |
| LA-ADV-04 | partial | Indicator calculations with explicit variant controls | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Configure and validate sanctioned studies by input and warmup. |
| LA-ADV-05 | partial | Server-controlled Advanced Lab grants | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Prove member plan cannot be forged and expired grant is denied. |
| LA-ADV-06 | partial | Protected Advanced assessment and mastery isolation | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Extra features never reveal keys or change authoritative grading. |
| LA-ADV-07 | partial | Advanced saved stage and downgrade continuity | `functions/api/learning-lab-edition-workspace.js` | `tests/learning-lab-edition-workspace-v1.test.mjs` | Maintain authorized past progress without retaining premium access. |
| LA-ADV-08 | not_implemented | Genuine Advanced mobile and assistive acceptance | `.github/workflows/learning-lab-premium-editions-v1.yml` | `tests/advanced-learning-lab-member-surface-browser-v1.mjs` | Test real eligible/restricted members, responsive layouts and CI. |
| LE-PRO-01 | partial | Comparative decision reasoning | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Give grounded debriefs limited to observable completed bars. |
| LE-PRO-02 | partial | No-lookahead replay instruction | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Use server-authenticated as-of cutoff at every learning decision. |
| LE-PRO-03 | partial | Original risk scenario comparisons | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Validate whole-share risk calculations, slippage cautions and transfer. |
| LE-PRO-04 | partial | Linked multi-indicator chart instruction | `assets/js/learning-lab-edition-panel-v1.js` | `tests/professional-learning-lab-member-surface-browser-v1.mjs` | Synchronize selected chart studies to Professional learner instruction. |
| LE-PRO-05 | partial | Persistent professional decision debrief | `functions/api/learning-lab-edition-workspace.js` | `tests/learning-lab-edition-workspace-v1.test.mjs` | Save, isolate and restore authorized decision evidence. |
| LE-PRO-06 | partial | Multi-timeframe prerequisite-aware learning workflow | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Verify time-aligned completed frames and contextual teaching. |
| LE-PRO-07 | partial | Professional entitlement, downgrade and expiry | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Enforce each request against server-owned professional rights. |
| LE-PRO-08 | not_implemented | Independent Professional Learning acceptance | `.github/workflows/learning-lab-premium-editions-v1.yml` | `tests/professional-learning-lab-source-closeout-v1.test.mjs` | Pass genuine member, no-lookahead, browser, accessibility and CI. |
| LA-PRO-01 | partial | Professional linked chart panels | `assets/js/learning-lab-edition-panel-v1.js` | `tests/professional-learning-lab-member-surface-browser-v1.mjs` | Expose two synchronized chart panels only to entitled member. |
| LA-PRO-02 | partial | Bounded historical Lab replay | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Authorize dataset and only completed observations for each step. |
| LA-PRO-03 | partial | Fictional scenario and risk case analysis | `functions/_lib/learning-lab-formative-editions-v1.js` | `tests/learning-lab-formative-editions-v1.test.mjs` | Deliver reviewed ungraded scenarios with measured outcomes. |
| LA-PRO-04 | partial | Explicit uncertainty evidence review | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Teach missing-information boundaries without invented mastery. |
| LA-PRO-05 | partial | Versioned professional Lab workspace persistence | `functions/api/learning-lab-edition-workspace.js` | `tests/learning-lab-edition-workspace-v1.test.mjs` | Save and restore per-user view without cross-account disclosure. |
| LA-PRO-06 | partial | Professional protected assessment compatibility | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Prove stable grading, no answer leakage and downgrade integrity. |
| LA-PRO-07 | partial | Professional Lab entitlement gate | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Deny Basic/expired/forged premium permission server-side. |
| LA-PRO-08 | not_implemented | Independent Professional Lab acceptance | `.github/workflows/learning-lab-premium-editions-v1.yml` | `tests/professional-learning-lab-member-surface-browser-v1.mjs` | Pass real account, accessibility and deployment verification. |
| LE-ENT-01 | prototype | Research sample statistics and limits | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Explain assumptions and calculations under licensed evidence bounds. |
| LE-ENT-02 | prototype | Chronological holdout and embargo methods | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Separate test data and prevent training contamination. |
| LE-ENT-03 | prototype | Sensitivity and validation-bias instruction | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Prevent test-set winner selection or unwarranted predictive claims. |
| LE-ENT-04 | prototype | Versioned provenance and rights manifest | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Require source rights, time, method version and reference. |
| LE-ENT-05 | partial | Governed cross-course research learning path | `assets/js/academy-enterprise-journey-v1.js` | `tests/enterprise-learning-member-journey-browser-v1.mjs` | Connect research tasks to existing authorized curriculum. |
| LE-ENT-06 | prototype | Entitled research citation and source rights | `functions/_lib/learning-lab-edition-exercises-v1.js` | `tests/learning-lab-edition-exercises-v1.test.mjs` | Validate as-of citations and rights for each member data source. |
| LE-ENT-07 | prototype | Enterprise grants, revocation, downgrade | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Server must deny revoked and cross-member research access. |
| LE-ENT-08 | not_implemented | Independent Enterprise Learning release | **Missing — acceptance gate** | **Missing — acceptance gate** | Pass real entitlement, data-rights, research QA and accessibility. |
| LA-ENT-01 | prototype | Governed research evidence manifests | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Bind rights-approved source metadata into Enterprise Lab. |
| LA-ENT-02 | prototype | Research-method sensitivity comparisons | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Use valid assumptions and preserve held-out evaluation data. |
| LA-ENT-03 | prototype | Chronological source holdout laboratory | `functions/_lib/learning-lab-research-evidence-v1.js` | `tests/learning-lab-research-evidence-v1.test.mjs` | Implement correct embargo and no future leakage in member stage. |
| LA-ENT-04 | partial | Enterprise cross-course research stage journey | `assets/js/learning-lab-edition-panel-v1.js` | `tests/enterprise-learning-lab-journey-browser-v1.mjs` | Map actual entitled research lessons into progression. |
| LA-ENT-05 | partial | Multi-source research Lab workbench | `assets/js/learning-lab-edition-panel-v1.js` | `tests/enterprise-learning-lab-journey-browser-v1.mjs` | Save member-owned approved source cases with audit history. |
| LA-ENT-06 | prototype | Enterprise dataset rights controls | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Reject missing provider rights before delivering any data. |
| LA-ENT-07 | prototype | Enterprise Lab entitlement and revocation | `functions/api/learning-lab-edition-exercise.js` | `tests/learning-lab-edition-api-v1.test.mjs` | Verify server grant, renewal, downgrade and isolation. |
| LA-ENT-08 | not_implemented | Independent Enterprise Lab acceptance | **Missing — acceptance gate** | **Missing — acceptance gate** | Pass genuine member, no-lookahead, screen-reader and CI. |

## Independent release and professional review holds

The following six entries are correctly classified `not_implemented`. Automated source checks and mocked Chromium tests are not evidence of independent genuine-member acceptance:
- **LE-ADV-08 — Independent Advanced Learning production acceptance:** Pass exact SHA, QA, rights, accessibility, member security signoff.. Exact-SHA Advanced source CI, fail-closed summary and Cloudflare production deployment passed on 184105c487a179035549e6cbec3a72c9317e1489. Independent rights, editorial, genuine entitled-member, assistive-technology and feature-release acceptance remain open; the premium release flag remains off.
- **LA-ADV-08 — Genuine Advanced mobile and assistive acceptance:** Test real eligible/restricted members, responsive layouts and CI.. Responsive Chromium, exact-SHA Advanced source CI and Cloudflare production deployment passed on 184105c487a179035549e6cbec3a72c9317e1489. Genuine eligible/restricted-member, real mobile device, assistive-technology, rights and independent editorial acceptance remain open; the premium release flag remains off.
- **LE-PRO-08 — Independent Professional Learning acceptance:** Pass genuine member, no-lookahead, browser, accessibility and CI.. Exact-SHA Professional source CI, Chromium, fail-closed summary and Cloudflare production deployment passed on fc449546e2bed70a36a4b9f92163fbed9aa2c5cd. Genuine entitled-member, no-lookahead historical-provider, rights, editorial, assistive-technology and feature-release acceptance remain open; Professional release flags remain off.
- **LA-PRO-08 — Independent Professional Lab acceptance:** Pass real account, accessibility and deployment verification.. Exact-SHA Professional source CI, responsive Chromium and Cloudflare production deployment passed on fc449546e2bed70a36a4b9f92163fbed9aa2c5cd. Genuine eligible/restricted-member, real device, assistive-technology, rights, editorial and feature-release acceptance remain open; Professional release flags remain off.
- **LE-ENT-08 — Independent Enterprise Learning release:** Pass real entitlement, data-rights, research QA and accessibility.. Enterprise Learning has no independently accepted member production release.
- **LA-ENT-08 — Independent Enterprise Lab acceptance:** Pass genuine member, no-lookahead, screen-reader and CI.. Enterprise Lab has no independently accepted member production release.

Required evidence before any premium activation: genuine two-account (entitled and restricted) access using independently authenticated sessions; expiry, downgrade, revocation and account switching; server-enforced RLS and private workspace boundaries; keyboard, real-device and screen-reader accessibility; controlled assessment no-lookahead and grading isolation; market-data provenance, redistribution and source-rights review; independent editorial and quantitative review; and full CI plus exact main SHA Cloudflare deployment reconciliation.

**Grading release hold:** Official grading remains disabled and unaccepted, separate from any source-tested teaching or simulated practice.

**Protected release boundaries:** Premium feature flags and add-on checkout remain false. Official grades, mastery, Lumens awards, entitlements, charges, and licensed market-data publication must not be enabled by this register or by its automated tests. Basic v3.3 Learning, Basic v3.2 Lab, 419 distinct Lab IDs and 30 competencies remain frozen.

## Batch execution and QA

- **Research:** Read the v1.2 ledger and enumerated all 64 unique IDs; compared every non-null source and test pointer with the repository tree, without relying on third-party data.
- **Compilation:** This register captures all eight features for each of two engines and four editions, with an explicit acceptance criterion and frozen release interpretation.
- **Upload:** Submit this Markdown document and `tests/learning-lab-feature-evidence-64.test.mjs` together in the controlled batch branch; use the dedicated Learning/Lab GitHub workflow to execute 64 feature-level integrity tests, eight tier-count tests, and three global release-governance assertions.
- **Limits:** Passing these 75 tests proves inventory consistency and evidence-path traceability only. It does not turn source coverage into the overall completion percentage or satisfy a genuine user signoff.

## What is next — execution order

1. Finish PR #22's Pre-LIVE build-guard exact-main security and full-site checks without changing release flags.
2. Run all 75 evidence tests against the current branch, fix traceability drift and obtain independent GitHub/Cloudflare build evidence.
3. Revalidate grant revocation and cross-account privacy in two real authenticated test sessions. James_Test may be used only within its actual authorized tier; a separate eligible Enterprise identity is needed to evaluate Enterprise independently.
4. Complete each of the six final `-08` acceptance gates with genuine member, screen-reader, editorial, data-rights and exact production SHA evidence.
5. Update the authoritative 64-item ledger only when the applicable evidence and acceptance criterion are satisfied. Recalculate tier and combined totals; do not invent a sitewide percentage.

## Revision history

| Version | Date | Author / custodian | Change | Status |
|---|---|---|---|---|
| 1.0 | 2026-11-03 | Acting technical project administrator (delegated) | Created a 64-feature evidence crosswalk and independent release-hold register from existing source ledger v1.2 | Source draft; no independent release approval |

**Document footer:** SMFGU-LE-LA-QA-064-20261103 · v1.0 · Internal research/source evidence only · Protected premium release HOLD · Page numbering not applicable to Markdown.
