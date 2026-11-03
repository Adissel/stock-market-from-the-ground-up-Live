# Scanner & SEC filing-catalyst source reconciliation — Wave 3

Project: THE STOCK MARKET: FROM THE GROUND UP
Document ID: SMFGU-SEC-SCANNER-20261103
Filename: docs/research/scanner/2026-11-03_SEC_CATALYST_EVIDENCE_WAVE3.md
File type: Markdown (.md)
Google Drive location: Not created
Google Drive document ID: Not assigned
GitHub: Adissel/stock-market-from-the-ground-up-Live
Version: 1.0
Status: Research and source-code validation; not independently approved for live filtering
Date: November 3, 2026
Dependencies: Locked Phase 8 and Academy Filings7 research; existing protected SEC API and source normalizer; owner-supplied screenshots.

## Scope and source controls
Owner's screenshots include filings today / 24h / 72h. Our existing SEC backend only provides authenticated, entitlement-gated, issuer-specific SEC filings and financial facts, not a live all-market catalyst monitor. This Wave 3 module consumes **already-authorized SEC responses**; it makes no network calls, changes no billing, and does not bypass request budgets.

The original SEC Filings7 study material covers CIK identity, 8-K chronology, financing and dilution, and differences between SEC acceptance and a press release. The DT-C21–24 source crosswalk entries are not independent editorial acceptance.

## Decision-time requirements
1. Deny inference from wrong issuer, absent CIK, unverifiable SEC source, malformed archive path, or evidence observed after the evaluation cutoff.
2. Treat missing exact SEC acceptance as unknown, not no filing and not zero.
3. Exclude future acceptances and those outside a requested 24h or 72h retrospective window.
4. SEC acceptance is not verified first public dissemination or proof of trading opportunity.
5. Earnings calendars and news are separate data streams and not inferred from filing metadata.
6. No mass issuer scanning, live L2 depth or third-party redistribution.
7. Champion configurations, Phase 7 statistical validation holds, member benefits and Stripe LIVE prices remain unchanged.

## Files, dependencies and acceptance
Source module: assets/js/crownlight-scanner-sec-evidence-v1.js
Unit tests: tests/test_crownlight_scanner_sec_evidence_v1.mjs
Research registry: data/crownlight-scanner-sec-catalyst-research-v1.json
CI workflow: .github/workflows/crownlight-scanner-sec-evidence-wave3.yml
The existing Watchlist SEC research UI remains the authenticated manual research path. This research-only module does not activate automatic scanner SEC conditions.
Run source tests, SEC budget regressions, exact build check, authenticated two-account QA and deployed SHA before independent acceptance.

Revision history: v1.0 / November 3, 2026 / created read-only SEC acceptance-time evidence and research mapping.
Footer: Not an investment recommendation, data license, editorial acceptance or billing authorization.

## Revision 1.1 — secured SEC / Watchlist / Talia handoff
- Evidence after the server's SEC observation time is excluded, even where earlier than a client-side decision timestamp.
- SEC acceptance-time evaluation is displayed only after the existing authenticated single-issuer API succeeds; user selects 24 or 72 hours without new requests.
- Scanner results navigate by symbol to the existing entitled Watchlist Workbench; navigation never automatically retrieves records or grants tool access.
- Original Talia RESEARCH teaching prompts support evidence evaluation; graded content remains protected.
- Official references reviewed 2026-11-03: https://www.sec.gov/search-filings/edgar-application-programming-interfaces ; https://www.sec.gov/about/webmaster-frequently-asked-questions ; https://www.sec.gov/about/developer-resources .
- Two-account and screen-reader browser QA, independent release acceptance and exact Cloudflare SHA remain pending. Source engineering only.

Revision history: v1.1 / 2026-11-03 / chronology hardening and protected issuer research UI.
