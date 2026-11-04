# Scanner SEC Wave4 — Main-first integration and exception register

Project: THE STOCK MARKET: FROM THE GROUND UP
Document ID: SMFGU-SCANNER-SEC-WAVE4-MAIN-RECON-001
Filename: docs/research/scanner/2026-11-03_SCANNER_WAVE4_MAIN_RECONCILIATION.md
File type: Markdown
Version: 1.0
Status: SEC source-integrated; UI and member acceptance still on hold
Date: November 3, 2026
Google Drive location: Not created
Google Drive document ID: Not assigned

## Source integration
Main remains the only website source branch. PR34 was based before the accepted Wave4 handoff, the 48 scanner presets, Wave5 and the Prototype Center.
Keep the current main scanner visual, Watchlist SEC panel, existing entitlement validation and SEC retrospective brief. Older overlapping page and prefill logic must not overwrite the newer implementation.
Integrate the SEC evidence engine restriction that acceptedAt must not be later than observedAt, plus its direct regression suite. This is a point-in-time evidence safeguard, NOT a trade signal.
Retain the new standalone SEC research-view JavaScript source file on main as an unmounted, nonactive development component. The existing Wave4 SEC retrospective panel remains the displayed view.
Copy PR34 source research document and SEC supplement as evidence only.

## Deliberately superseded source material
- Prior full advanced-tool.html replacement, which would remove later presets and historical scripts.
- Duplicated visual Watchlist handoff and input prefill, already in main.
- Proposed milestone increase from 7 of 32 to 8 of 32 without independent accepted gate evidence.
- Source-only UI acceptance test and workflow reference for the unmounted duplicate SEC view.
- No change to Phase 8 Champion scans, paid tiers, SEC request budget, Lumens or protected grades.

## Acceptance
Accepted scanner scorecard remains 7/32 (21.875%). Genuine two-account privacy, member accessibility, provider permissions, exact Cloudflare production SHA, commercial billing and SEC data-use scope are separate release gates.
SEC acceptance time alone is not first public dissemination. No release of the duplicated view is claimed.

Revision history: 1.0 / 2026-11-03 / merge historical SEC source while retaining current main and accepted scorecard.
Footer: Development evidence, not investment advice, financial execution, licensing approval or production signoff.
