# Crownlight Scanner & Research — Wave 2 results and teaching source controls

| Control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-WAVE2-20261103 |
| Filename | docs/research/scanner/2026-11-03_SCANNER_WAVE2_RESULTS_AND_TEACHING.md |
| File type | Markdown |
| Version | 1.0 |
| Status | Development branch; CI and browser acceptance required |
| Date | November 3, 2026 |
| Source repository | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | Locked Phase 8; v145 CSV scanner; Wave 1 nested rule engine; authenticated SCANNER_BUILDER access; current private workspace; existing static build |
| Purpose | Make scanner result views original, customizable, source-bound, and independently testable without activating paid entitlements |

## Revision history
| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | November 3, 2026 | Add deterministic primary/secondary sort, whitelisted 12-column display, per-row rule explanations, saved view configuration, and five original teaching templates |

## Technical scope
- User-supplied CSV with existing strict headers; optional source fields are read only when supplied, never fetched or fabricated.
- Symbol remains always visible. Choose 1–12 additional allowed numeric columns; missing data are displayed as **Not supplied**.
- Primary and secondary sort each have independent ascending/descending preference; missing numeric values are last and symbol is the final deterministic tie-breaker.
- Each matching row can display a bounded, auditable condition trace with passed, failed or unknown leaf conditions. Nested group truth still follows the full validated expression, so a leaf failure in an OR group does not invalidate an otherwise passing result.
- Save/restore criteria, columns and sorting through the existing authenticated, user-scoped workspace; no market observations are stored as part of the preset. Real two-account private persistence remains an independent acceptance gate.
- Export/import conditions and validated view configuration as JSON, with backward compatibility for Wave 1 rules-only exports.
- Five source-independent original instructional rule examples, using explicitly fictional CSV. These do **not** reproduce vendor proprietary scans or establish investment advice or strategy profitability.

## Release boundaries
- No activation of $4.99/$9.99/$19.99 Stripe plans.
- No Level II or trade-print feed integration; no continuous real-time scanning.
- No reconstruction or alteration of 98 Phase 8 Champion production configurations.
- No automatic Challenger promotion; Phase 7 validated zero trading edges.
- No grading, Lumens awards, protected answer keys or founder changes.
- Data ingestion/publication rights remain provider-specific; the fictional fixture is explicitly original.

## Acceptance sequence
Run new rule, templates, results and UI source tests, the legacy scanner suite and Cloudflare build. Then verify authenticated save/reload and privacy using two real test accounts, browser accessibility, exact deployed SHA and license controls. CI completion alone is not release acceptance.

**Footer:** Crownlight Scanner research artifact · technical development only · not legal, investment or market-data licensing approval.
