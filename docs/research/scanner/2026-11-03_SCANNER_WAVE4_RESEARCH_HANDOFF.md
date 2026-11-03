# Crownlight Scanner Wave 4 — authorized research handoff and SEC evidence

| Control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-WAVE4-20261103 |
| Filename | docs/research/scanner/2026-11-03_SCANNER_WAVE4_RESEARCH_HANDOFF.md |
| File type | Markdown |
| Version | 1.0 |
| Date | November 3, 2026 |
| Status | Source engineering; authenticated member acceptance pending |
| GitHub | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive ID | Not assigned |
| Dependencies | v145 scanner entitlement; Wave1/Wave2 original visual engine; Wave3 verified SEC event-time evaluator; existing WATCHLIST_WORKBENCH entitlement; protected SEC issuer API; Talia and Lab catalog |
| Purpose | Functional read-only handoff within established tools, without creating a parallel database, financial feed, payment workflow, or bypass of server authorization |

## Architecture and engineering decisions
1. The authenticated scanner displays original rule results from the member-supplied, dated CSV; each valid ticker gains explicit links to the existing protected premium Watchlist, Talia classroom and canonical Labs. The only query parameter transferred is the syntactically validated ticker.
2. The protected Watchlist, after its own entitlement validation, may prefill an empty ticker field and SEC lookup field. Prefilling never reads private scanner payloads, writes a research record, overwrites an edit, grants access, or copies sensitive observations.
3. The existing Watchlist SEC issuer endpoint remains the only source of issuer evidence. Its identity match, global request budget, feature switch, session check and entitlement checks are unchanged.
4. The Wave3 source evaluator runs locally on that already-authorized SEC response; an original accessible 24/72-hour view reports accepted records and missing/future/out-of-window/invalid timestamps.
5. No first public dissemination time, trade eligibility, earnings surprise, live price, ticker catalyst ranking, or statistical profitability is inferred. Filing acceptance is not a historical decision-time feed.
6. Talia remains the original instructor destination. This navigation does not transfer private answers, create assessments, or assert graded completion.

## Independent source references
- SEC, "EDGAR Data APIs": https://www.sec.gov/edgar/sec-api-documentation
- SEC, "SEC Data Resources": https://www.sec.gov/data-research/sec-data-resources
- SEC, "Webmaster FAQs / scripted fair access": https://www.sec.gov/about/webmaster-frequently-asked-questions

Research and original teaching descriptions are not permission to redistribute a data product. Existing fair-access budgets and licensing controls are preserved.

## Verification and blockers
New regression coverage includes ticker allowlists; no hidden data transfer; a locked tool-access gate; no overwritten user field; original 24/72-hour SEC evidence; unknown/future/invalid timestamps; existing protected SEC API; scanner regression; free watchlist; static Pages build; and private asset exclusion. All CI outcomes remain pending until evaluated against the exact branch commit.

**Independent holds:** genuine two-account authenticated persistence and isolation; keyboard/mobile/screen-reader acceptance; exact deployed Cloudflare SHA; SEC request budget in production; rights/first dissemination; membership-version and Stripe TEST approval. These gates are NOT claimed complete here. Existing 7/32 tier scorecard must not be inflated from source navigation alone.

## Revision history
| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-03 | Add guarded result navigation, watchlist-only ticker context, read-only SEC acceptance brief, original tests and CI |

**Footer:** Source-development artifact only. No legal review, investment recommendation, commercial subscription or production deployment signoff.
