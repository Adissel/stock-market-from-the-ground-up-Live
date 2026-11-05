# Knowledge Database — 25 Priority Claim/Source Candidates

| Field | Control |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP — Knowledge Database |
| Document ID | SMFGU-KDB-CLAIM-EVIDENCE-025 |
| Filename | docs/qa/SMFGU-KDB-CLAIM-EVIDENCE-025-20261104.md |
| File type | Markdown |
| Version and date | 1.0 / 2026-11-04 |
| Status | 25 claims registered as candidates; no independent reviews or reuse-rights clearance |
| Google Drive location / ID | Not created / unassigned; GitHub authoritative |
| Dependencies | Existing 260 published Knowledge articles, Owner account, source candidate registry, Labs/competency provisional mapping |
| New files required | Yes: private schema migration, seed SQL, JSON crosswalk, deterministic test, this memo |
| Purpose | Tie each priority numerical/regulatory/market-structure/right claim to its live article version and a candidate reference, recording explicit outstanding review obligations |

This is **not 25 independently fact-checked or article-upgraded lessons**. Each record retains a claim needing validation, exact existing URL/title, article version, proposed competency code when available, independent reviewer nullable, verification status candidate, source coverage candidate and redistribution rights not cleared.

## Structural design
- Private Supabase claim evidence and append-only event tables have RLS enabled and revoked browser roles. Only service_role sees them directly.
- A security-invoker freshness view compares claim-reviewed article version with live article version.
- Future review must record source page/section, date, independent reviewer, evidence notes and rights status; no automatic editorial acceptance based on an article being owner-published.
- 25 records target indicator arithmetic, options/futures, market microstructure, FINRA intraday margin transition, clearing, NYSE data rights and FRED series.
- Competency links remain provisional; **do not** treat them as mastered skills, grades, award credits or 419-Lab acceptance.
- No price, source-license, membership, trading or protected assessment modification is made.

## Risks and next acceptance
Validate each source's precise claim support, current regulation, calculation conventions and rights. Fix broad/landing-page URLs before marking supported. Require independent reviewer identity and genuine member browser acceptance. Add an authenticated Owner/Admin edit-and-review interface before relying on this for publishing certification.

## Revision history
v1.0 2026-11-04 — 25 version-anchored source candidates and secure review ledger.

Footer: SMFGU-KDB-CLAIM-EVIDENCE-025 • Candidate reference is not verification or republication permission.