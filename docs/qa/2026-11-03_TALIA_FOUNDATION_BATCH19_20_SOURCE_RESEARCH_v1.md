# Talia Foundation Source Quality — Batches 19 and 20

| Document control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor |
| Document ID | SMFGU-TALIA-SOURCE-QUALITY-026 |
| Filename/type | `docs/qa/2026-11-03_TALIA_FOUNDATION_BATCH19_20_SOURCE_RESEARCH_v1.md` / Markdown |
| Google Drive location / ID | Not created / unassigned (repository record only) |
| Version / date | 1.0 / 2026-11-03 |
| Status | Forty internal source-research triage decisions; publication HOLD |
| Dependencies | Foundation 600 source audit, approved learning-engine boundaries, Batch 17–18 source checks |
| Purpose | Replace forty generic EDGAR search links with topic-scoped research evidence and preserve explicit independent review gates |

## Change scope

- Batch 19: 20 lessons, positions 361–380. Financial statement recognition, receivables, inventory, depreciation, working capital, valuation, cash flows, EPS, fiscal period comparisons and dilution. SEC financial-statement primer, SEC non-GAAP guidance, FINRA book-value/P-B reference and SEC small-business glossary are cited only for their demonstrated relevant scope.
- Batch 20: 20 lessons, positions 381–400. Point-in-time vintage history, timestamping, venue coverage, missing data, corporate actions, VWAP, replay integrity, survivorship, overfitting, simulated costs and confidence. The references distinguish SEC market-structure, FRED vintage, StockCharts indicator formulas, and QuantConnect research documentation.
- Batch 19 negative-base revenue lesson corrected across worked example, teaching explanation, transfer and common error. A negative denominator can produce a mechanical percentage that does not mean ordinary growth; a zero denominator makes the ratio undefined.
- Every updated source has a bounded supported-scope note and an explicit limitation. The original codes, count, program integration and member progress are unchanged.
- One source test suite is added to the Market Tutor CI workflow for all forty references and the negative-base arithmetic.

## Acceptance and release limitations

All 40 records retain `independentEditorialApproved:false`, `officialCompetency:false`, `independentPublicationAccepted:false`; new math-acceptance, publication-acceptance and source-redistribution flags are all false. These references are not accounting standard conformance opinions, rights grants, independently signed proof of arithmetic, official competency awards, or legally approved market-data use.

**Audit correction (same-day):** The original broad-source scanner omitted the SEC EDGAR search-index URL. The earlier 121 count covers legacy generic links but excluded all 40 Batch 19–20 EDGAR links. The corrected scanner adds EDGAR to its known generic-link set and separately reports \`genericEdgarSearchReferences\`. The exact-SHA Tutor audit reports **143** known broad-reference occurrences: 121 legacy generic references plus 22 EDGAR search-index references (20 in Batch 26 and 2 in Batch 10). These totals are URL-pattern indicators, not a claim-level editorial quality score. Exact-SHA CI must verify this revised count; historical denominators are not directly comparable. These are URL-pattern counts, not a substitute for claim-level research review. A narrower page citation is not itself full claim-level editorial approval. Future reviewers must validate ASC 606, 326, 260 and other pertinent standards as needed, GAAP/IFRS scope, data rights, earnings definitions, chronology and real-world financial facts.

No billing, trading execution, grading, official assessments, publication flag, database schema, data redistribution or membership entitlement changes.

## Revision history

| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 2026-11-03 | 40 claim-specific internal source decisions, negative-base math clarification, Tutor CI regression | Internal implementation; independent publication HOLD |

Footer: SMFGU-TALIA-SOURCE-QUALITY-026 · v1.0 · 2026-11-03 · Independent editorial and licensed-data approval outstanding.
