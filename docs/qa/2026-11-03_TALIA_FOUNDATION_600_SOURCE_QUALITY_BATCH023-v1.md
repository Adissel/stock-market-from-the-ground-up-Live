# Talia Market Tutor — Foundation 600 Source-Quality Batch 023

| Control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor |
| Document ID | SMFGU-TALIA-SOURCE-QUALITY-023 |
| Filename / type | docs/qa/2026-11-03_TALIA_FOUNDATION_600_SOURCE_QUALITY_BATCH023-v1.md / Markdown |
| Google Drive / ID | Not created / unassigned |
| Version / date | 1.2 / 2026-11-03 |
| Status | Internal QA; exact-SHA CI pending; independent publication HOLD |
| Dependencies | Owner seven-priority approval, 30 source batches, existing Tutor CI |
| Purpose | Identify claim-specific source review work across all 600 drafted lessons without asserting release acceptance. |

The workflow executes `scripts/qa/talia-foundation-source-quality-v1.mjs` and retains `artifacts/talia-foundation-source-quality-v1.json`. It checks all 600 unique draft identifiers and per-batch review state, generic introductory citations, missing source pointers, rights status, and missing review objects. Issue rows are internal editorial triage only. A citation does not prove formula support, licensing, or publication readiness.

This batch neither changes membership entitlements nor generates official grades, protected assessments, paid inference, trading recommendations, market data, or database writes.

Revision history: v1.0 (2026-11-03) — source-quality artifact and GitHub Actions integration. Final independent acceptance remains open.

Footer: SMFGU-TALIA-SOURCE-QUALITY-023 · v1.0 · Internal QA.

## Version 1.1 — explicit pending review records (November 3, 2026)

The first five batches (100 lessons) previously lacked `editorSourceReview` objects; the first four (80 lessons) also lacked `sourceRightsStatus`. Metadata was added with `reviewer: null`, `reviewedAt: null`, `reviewStatus: NOT_REVIEWED`, independent formula/source acceptance `false`, and third-party publication rights `not_cleared`. This does **not** establish that a source was checked, a formula independently calculated, a license granted, or a lesson approved.

The automated audit now fails if any of the 600 lessons lacks an explicit source-rights or editorial-review field. Expected missing metadata after this change: 0 review objects and 0 rights-status fields. Expected actual independent approval remains 0/600. Broad references remain a separate 187-occurrence research backlog, with 100 explicit pending-review flags (some overlapping).

| Version | Date | Change | Approval |
|---|---|---|---|
| 1.1 | 2026-11-03 | Added 100 explicit NOT_REVIEWED objects, 80 unverified rights statuses, and CI field-presence assertions | Internal metadata remediation only; publication HOLD |

## Version 1.2 — six claim-specific source replacements

The six broad Batch 02 references for EMA9, EMA20, EMA200, population/sample standard deviation, annualization, and prior-high drawdown were replaced with specifically relevant StockCharts, NIST and CFA Institute primary educational references. Research triage was recorded per lesson, including limits on seed parity, completed-bar inference, n vs n−1, annualization assumptions, and rolling versus all-time drawdown. No independent formula, publication or rights approval was granted. The total generic reference count should decline from 187 to **181**; independently published lessons remain **0/600**. Details and tests: `data/talia-foundation-explanations-batch02-v1.json` and `tests/talia-foundation-explanations-batch02-v1.test.mjs`.

| Version | Date | Change | Acceptance |
|---|---|---|---|
| 1.2 | 2026-11-03 | Six direct source-pointer and limitation checks in Batch 02 | Internal research only; independent release HOLD |

## Version 1.3 — production Tutor loading compatibility

Claim-specific references exposed a legitimate loader restriction: every Foundation guide had previously been restricted to exactly one source URL and a closed list of research domains. Batch 02 now needs up to two safe HTTPS references for StockCharts population SD plus NIST sample SD, and CFA Institute for volatility annualization. The source-only loader retains strict URL host, protocol, credential and port validation and rejects batches containing untrusted references. New tests prove both an allowed multi-source lesson and blocked untrusted-host fallback. No third-party source copying or independent lesson publication is approved.

| Version | Date | Change | Acceptance |
|---|---|---|---|
| 1.3 | 2026-11-03 | Hardened two-citation allowlist, preserved fail-closed behavior and added source-loader regression | Internal technical; release HOLD |

## Version 1.4 — inherited tests honor bounded two-source contract

The Batch 04 and Batch 05 legacy aggregate tests assumed every one of the first 100 supplemental lessons contains exactly one research citation. That fixture assumption prevented valid two-source population/sample standard deviation evidence from passing. The tests now accept **one or two HTTPS sources** while the production loader independently enforces the restricted research-host list, zero URL credentials and zero custom ports. No lesson is published or graded; exact lesson title lookup and fail-closed untrusted host tests remain required.

| Version | Date | Change | Acceptance |
|---|---|---|---|
| 1.4 | 2026-11-03 | Reconciled legacy 80/100 lesson source-count tests with bounded validated two-citation contract | CI and editorial release separate |

## Version 1.5 — Batch 15 source-specific research for nine topics

Nine broad introductory source URLs in the original Foundation lesson positions 281–300 were replaced with narrower public SEC, Investor.gov and StockCharts pages: quote midpoint, relative spread, arrival-price impact, transaction fees, asset-weight drift, drawdown recovery, planned risk plus fee, fee-adjusted break-even and share-issuance market capitalization. The review explicitly distinguishes general source support from independent approval of the example's mathematics or trading assumptions.

The article titled **Dollar cost of an incomplete round trip** currently gives a *completed* full-size fictional buy and sell example. This content-title mismatch remains **HOLD FOR EDITORIAL CORRECTION**; a source-pointer update does not clear it. No third-party material is copied. If the source audit is unchanged otherwise, broad introductory citation occurrences decrease from **181 to 172**, and independent publication remains **0/600**.

A new nine-topic source and arithmetic regression is included in `tests/talia-foundation-batches15-16-gates-v1.test.mjs`. Every original grade, entitlement, rights and independent publication flag remains disabled.

| Version | Date | Change | Acceptance |
|---|---|---|---|
| 1.5 | 2026-11-03 | Nine sourced Batch 15 research candidates and arithmetic boundaries; identified title mismatch | Internal source-triage only; editorial release HOLD |
