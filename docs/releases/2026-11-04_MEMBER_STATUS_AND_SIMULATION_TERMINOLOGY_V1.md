# Crownlight Site Copy & Source Provenance — Controlled Release
Project: THE STOCK MARKET: FROM THE GROUND UP
Filename: 2026-11-04_MEMBER_STATUS_AND_SIMULATION_TERMINOLOGY_V1.md
File type: Markdown | Version: 1.0 | Status: Committed source candidate; browser acceptance pending
Date: 2026-11-04 | GitHub location: docs/releases/
Google Drive location: Not created; no connected Drive file. Document ID: not assigned.

## Approved Owner request
1. Member Status visible metric labels are exactly **Online members** and **Registered members**. They are already present in the canonical JS and are retained.
2. Remove the small **EXAMPLE DATA** / **ILLUSTRATIVE** subtitle from the percentage gauge entirely; no replacement subtitle appears when demonstration counts are shown.
3. Simplify end-user training vocabulary to **Simulated** and **Demonstration** in controlled public homepage and beginner practice surfaces, while maintaining data provenance. No generated chart or unverified member count is represented as actual exchange data or verified user statistics.
4. Update the existing publicly accessible Practice Data & Market Source Policy (v1.1) with a governing disclosure until each separate chart has independently verified data.
5. Keep EXAMPLE badge in Owner-configured range/custom mode, including the user's current mode=range, and retain LIVE DATA only for real aggregate mode. It is not acceptable to label generated counts live. This preserves the approved distinction and avoids misleading marketing.

## Files changed
- assets/js/home-community.js — remove gauge subtitle and simplify explanatory metadata
- index.html — homepage text, SVG accessible source and cache-busting member statistics script
- practice-data-policy.html — section 5 provenance clause and 1.1 document control
- assets/js/free-watchlist-fictional-echarts-v1.js — visible beginner chart vocabulary
- assets/js/fictional-simulator-starter-v1.js — human-facing synthetic practice labels
- tests/community-source-copy-and-disclosure-v1.test.mjs — protected source and provenance assertions

## Release gates
- [ ] All current main commit workflows green
- [ ] Rendered homepage confirms 2 correct labels, empty gauge subtitle, EXAMPLE badge
- [ ] Browser cache refresh uses versioned home-community.js asset
- [ ] Confirm zero unverified claims of live chart/membership data
- [ ] Continue site-wide surface-by-surface copy audit: Prototypes, Labs, Academy, Tutor, Replay, Watchlist, Marketing, Footer, Legal and dynamic API-generated messages
- [ ] Independently review policy changes for jurisdiction and disclosure sufficiency; do not claim attorney approval

## Revision history
1.0 · 2026-11-04 · Public member-statistics label cleanup, educational simulation vocabulary, and policy notice.
