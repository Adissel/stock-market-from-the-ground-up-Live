# Knowledge Database — Research Family Catalog Navigation

| Document Control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-KDB-TAXONOMY-001 |
| Filename | docs/qa/SMFGU-KDB-CATALOG-TAXONOMY-20261104.md |
| File type | Markdown |
| Version / Date | 1.0 / 2026-11-04 |
| Status | GitHub source implementation; production and genuine user acceptance pending |
| Google Drive | Not created; ID unassigned |
| Purpose | Improve discovery of the existing 260 article inventory using the current 15 families derived from 81 subject values, without rewriting canonical subjects or member plans |
| Dependencies | Existing published metadata API, standalone article URLs, safe browser rendering |
| New files | One deterministic test and this control memo; existing catalog script amended |

## Behavior and release bounds
- Derive the first family from current `subject` up to ` / `, preserving all 81 exact subject labels and all article IDs.
- Two-stage family then subject filter, combined with existing experience, membership and free-text metadata search.
- Render the first 50 article cards with a clearly labeled Show More control (50 more per activation).
- Correct legacy article UUID redirect pattern to canonical 8-4-4-4-12.
- Do not alter stored subject records, tuition SKUs, official Lab competencies, article access plans, or protected body contents.
- Does not claim true semantic/full-text search; article bodies remain hidden from public catalog. Full-text authenticated search requires separate security review.

## Acceptance
Automated source contract and then real desktop/mobile keyboard and screen-reader journeys, exact merged SHA, successful CI and matching Cloudflare deployment.

Revision: v1.0, 2026-11-04. Footer: SMFGU-KDB-TAXONOMY-001 / Controlled discoverability improvement.
