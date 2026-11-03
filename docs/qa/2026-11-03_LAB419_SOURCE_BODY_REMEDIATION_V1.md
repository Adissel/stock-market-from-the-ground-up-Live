# Canonical 419 Labs — Source, Body and Transfer Evidence Reconciliation V1

| Document control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Document ID | SMFGU-LAB419-BODY-RECON-20261103 |
| Document version | 1.0 |
| Date | November 3, 2026 |
| Status | Source/lesson quality audit with independently unaccepted repair backlog |
| Filename and type | `docs/qa/2026-11-03_LAB419_SOURCE_BODY_REMEDIATION_V1.md` — Markdown; `data/lab-419-editorial-reconciliation-register-v1.json` — JSON |
| GitHub location | `Adissel/stock-market-from-the-ground-up-Live`, branch `batch/lab419-editorial-reconciliation-20261103` |
| Google Drive location | Not created; GitHub retains source-of-record status |
| Owner baseline | Original 419 canonical Labs, 30 competency codes, Basic Learning v3.3 / Lab v3.2; all previous authored owner signoffs preserved |
| Source baseline SHA | `3b774200b9234efc8ad86247fc1a40148347250c` |
| Dependencies | Three Lab research waves (64 + 128 + 227); 419 canonical source-candidate CSV; 419 actual-body QA CSV; 419 bridge-quality-defect CSV |
| Purpose | Reconcile what exists in Lab teaching content, what evidence is missing, and the next remediation priority without substituting keyword matches for independent publication approval |

## Verified source-data findings

| Finding | Count | Interpretation |
|---|---:|---|
| Canonical Labs and cross-wave records matched | **419/419** | Complete traceability, not source-claim acceptance |
| Individual source-candidate mappings still marked not accepted | **419/419** | Owner's separately recorded authored-content approval is preserved |
| Generic/reused bridge templates | **413/419** | Insufficient subject specificity; needs content repair or independent review |
| No explicit fresh-transfer field in inspected bridge | **419/419** | Other instructor/assessment sources may contain transfer; do not claim none exists platform-wide |
| No detectable numerical worked example in inspected bridge | **405/419** | Numeric examples are only obligatory when relevant to that Lab's learning objective |
| No verified historical OHLCV data in bridge QA | **419/419** | Original fictional examples can be taught without third-party feeds; archive rights separate |
| Self-check present in bridge QA | **419/419** | Structural presence, not validated learning outcome or official grading |
| Public/private answer keys detected | **0/419** | Does not establish that private assessment services are secure; evaluate those separately |

The extracted body source was previously reviewed via the GitHub blob API. The connector's direct file-content endpoint can return an empty body for the large `data/lab-teaching-bridges-v014168.json`. Consequently, this batch reconciles the **existing exported actual-body QA CSV**, not a newly fetched full body-text analysis. Each underlying CSV retains its dated baseline; absent evidence is not proof of absent functionality elsewhere.

## Review workload, not accepted completion

| Group | Canonical Lab count |
|---|---:|
| DT | 150 |
| F1 | 15 |
| F2 | 46 |
| F3 | 33 |
| SITE | 100 |
| TAPE | 75 |

| Priority | Number | Reason |
|---|---:|---|
| P0_SOURCE_OR_SAFETY | 7 |
| P1_MEMBER_DATA_AND_RIGHTS | 174 |
| P2_INSTRUCTIONAL_REBUILD | 238 |

**P0** flags are limited to explicit dated legal risk, archive rights, curriculum mapping defects or detected key exposure. A P0 flag demands human review and does not itself prove the existing lesson is legally wrong. **P1** prioritizes member-data or licensed-market-data acceptance; **P2** is ordinary teaching remediation. No automated tier or member acceptance changes are made.

## Immediate editorial execution queue — original canonical IDs

| ID | Existing Lab title | Priority | Source/quality flags |
|---|---|---|---|
| F2-C10-L01 | 1-Minute vs. 3-Minute vs. 5-Minute Compression | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; CURRICULAR_COMPETENCY_MISMATCH_CANDIDATE |
| DT-C04-L01 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Margin accounts and the 2026 transition | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; FINRA_INTRADAY_MARGIN_TRANSITION_LEGAL_REVIEW |
| DT-C04-L02 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Buying power and house requirements | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; FINRA_INTRADAY_MARGIN_TRANSITION_LEGAL_REVIEW |
| DT-C04-L03 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Margin Accounts: Buying Power Is a Credit and Risk Function | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; FINRA_INTRADAY_MARGIN_TRANSITION_LEGAL_REVIEW |
| DT-C50-L01 | Complete Historical Day-Trading Sessions — Case A - GRML: expansion after early instability | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; HISTORICAL_ARCHIVE_DATA_RIGHTS_REVIEW |
| DT-C50-L02 | Complete Historical Day-Trading Sessions — Case A — GRML: Opening Instability to Major Expansion | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; HISTORICAL_ARCHIVE_DATA_RIGHTS_REVIEW |
| TAPE-C17-L02 | What Your Feed Cannot Reveal — Identity and intent remain limited | P0_SOURCE_OR_SAFETY | GENERIC_TEMPLATE_REUSE; FRESH_TRANSFER_NOT_DEMONSTRATED_IN_BRIDGE; HISTORICAL_OHLCV_NOT_VERIFIED_IN_BRIDGE; NUMERIC_WORKED_EXAMPLE_NOT_DETECTED_RELEVANCE_REVIEW; INDIVIDUAL_SOURCE_CLAIM_NOT_VERIFIED; CANONICAL_MAPPING_EDITORIAL_UNACCEPTED; MARKET_DATA_PROVENANCE_AND_DISPLAY_RIGHTS_HOLD; CURRICULAR_COMPETENCY_MISMATCH_CANDIDATE |

## Acceptance protocol for each Lab

1. Inspect the full authored teaching body and its five official tabs; do not revise approved or frozen content based only on a keyword match or a generic source index.
2. Verify each material claim with subject-specific authority; retain source dates, exact formula/units, assumption scope, and any jurisdiction-dependent rule date.
3. Replace confirmed generic explanations with original subject-specific worked examples. Provide a counterexample and a separate fresh-data transfer task, but only where pedagogically appropriate.
4. For historical charts, preserve no-lookahead and record symbol, timeframe, timezone, event adjustments, actual licensed source, and display permission. Prefer original fictional cases when rights are not cleared.
5. Keep private answer keys server-side; verify assessment-stage boundaries, retry policy, no credit-for-explanation charges, and Talia source limitations.
6. Obtain genuine signed-in two-account QA of persistence/isolation, keyboard and screen-reader access, and the exact committed Cloudflare deployment before changing any release flag.

## Completion denominators

- **419/419 source-research records inventoried**; source/body publication acceptance **0 newly recorded in this batch**. No automatic credit for tests.
- Learning/Lab feature integration remains **16/64 = 25.0%**; source/prototype coverage remains **58/64 = 90.6%**.
- The 375-item whole-site source snapshot's **33.8%** is an old planning estimate, not independently current release-ready completion.

## Revision history

| Version | Date | Prepared change | Disposition |
|---|---|---|---|
| 1.0 | 2026-11-03 | Reconciled 419 canonical mapping, bridge structure, detected generic reuse, transfer, numeric evidence, legal/rights flags and zero-premature-approval regression | Research QA queue created; independent claim, member and LIVE acceptance pending |

**Footer:** SMFGU-LAB419-BODY-RECON-20261103 · v1.0 · QA source only · No live trading, premium releases, billing or member data mutation.
