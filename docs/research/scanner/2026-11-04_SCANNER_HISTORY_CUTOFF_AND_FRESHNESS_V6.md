# Scanner Historical Research — Calendar Cutoff and Observation Freshness

| Control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-HISTORY-V6-20261104 |
| GitHub location | `docs/research/scanner/2026-11-04_SCANNER_HISTORY_CUTOFF_AND_FRESHNESS_V6.md` |
| Filename | `2026-11-04_SCANNER_HISTORY_CUTOFF_AND_FRESHNESS_V6.md` |
| Type | Markdown |
| Version | 1.0 |
| Date | 2026-11-04 |
| Status | DEVELOPMENT SOURCE; CI, real member acceptance and LIVE exact-SHA verification pending |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | Existing Wave 5 importer and no-lookahead engine, 48 scanner presets, Wave 5 GitHub workflow, license/provenance review |
| Purpose | Reject impossible historical as-of calendar dates and disclose missing observations before cutoff |

## Finding and corrective implementation

The existing historical scanner accepted some impossible as-of dates because JavaScript's `Date.parse()` silently rolled dates such as 2026-02-30 into March. The as-of cutoff now validates calendar days including leap years, hours/minutes/seconds and the physical UTC ±14:00 offset limit before parsing. Explicit offsets remain distinct during repeated daylight-saving wall-clock hours. Neither the local file nor the server obtains external exchange data.

Historical snapshots now disclose `cutoffLagMinutes` and `sourceFreshness`. A gap of at least one five-minute interval before the requested cutoff is labeled `NO_OBSERVATION_AT_CUTOFF`, including an explanatory warning; it is not silently treated as an up-to-date observation. Research results remain non-transactional, unverified and non-predictive. The existing `tradeSignal:false`, `marketDataVerified:false`, local-only chart, and source-rights requirements remain unchanged.

## Acceptance and control

- New regression: `tests/test_crownlight_scanner_historical_cutoff_v6.mjs`.
- Existing mandatory workflow: `.github/workflows/crownlight-scanner-wave5.yml`.
- Verify same-commit source tests and all relevant GitHub statuses; source CI is not proof of authenticated testing.
- Genuine two-member isolation, keyboard/screen-reader behavior, provider data rights, certified session calendar and exact-SHA Cloudflare LIVE acceptance remain **NOT ACCEPTED**.
- Payment products, memberships, Lumens, SEC scanner and verified historical dataset publication remain unchanged.
- No additional scanner milestone accepted; previously recorded ledger is 7/32 until separately reconciled.
- Rollback: revert this atomic main commit after reviewing dependent changes and verifying the rollback SHA.

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-04 | Strict historical cutoff calendar and five-minute lag evidence; regression added |

Footer: Internal technical research; no licensed live feed, trading advice, production signoff or rights approval.
