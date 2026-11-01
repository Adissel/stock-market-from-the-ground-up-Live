# Talia Foundation — Rule 605 Reference-Scope Triage for Topics 143–180

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Foundation editorial |
| Document ID | SMFGU-TALIA-R605-SCOPE-004 |
| Filename / file type | `docs/qa/2026-11-01_TALIA_RULE605_SCOPE_TRIAGE_004.md` / Markdown |
| Version / date | 1.0 / 2026-11-01 |
| Google Drive location / document ID | Not created / unassigned; GitHub `main` controls |
| Status | 14/14 scope classifications prepared; 0/14 independently published or licensed as a result |
| Dependencies | Foundation Batches 08–09; claim register 003; Master Research Source Directory; SEC 2026 Rule 605 staff FAQ; Nasdaq trade-message specifications |
| Purpose | Prevent misuse of SEC Rule 605 reporting guidance as a blanket source for tape heuristics, vendor UI conventions, borrow costs or execution promises |

## Regulatory source boundary

The SEC's April 1, 2026 Rule 605 staff FAQs apply from August 1, 2026, are expressly nonbinding staff views, and primarily explain covered-order execution-quality reporting. They are not a comprehensive order-book/feed tutorial. Do not infer securities-lending fees, live market-data redistribution rights, buyer/seller intention or platform color conventions from these FAQs.

Primary reviewed references:
- SEC 2026 staff FAQs, Rule 605 (nonbinding guidance): https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms
- SEC glossary, quoted spread: https://www.sec.gov/answers/spread.htm
- Nasdaq TotalView ITCH technical message specification (technical reference only; no data redistribution rights): https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf

## Item-specific scope decisions (all final-release HOLD)

| # | Individual topic | Reference-scope decision | Required independent disposition |
|---|---|---|---|
| 143 | Venue quote differences | Rule 605 addresses eligible national benchmarks, not comprehensive simultaneous multivenue feed analysis | Match per-venue timestamp claims with venue/feed specifications and quote-plan definitions |
| 144 | Bid-side print does not prove intent | Rule 605 does not prove participant motive; trade-vs-quote classification must be qualified | Validate quote synchronization and documented classifier limitations; no subjective intent label |
| 145 | Midpoint not executable | SEC Rule 605 supports arithmetic midpoint as benchmark, not executable shares at midpoint | Check full benchmark definition and separate unexecuted quote from actual fill evidence |
| 146 | Locked/crossed market | Rule 605 staff FAQ directly addresses locked/crossed NBBO benchmark treatment | Cite the exact FAQ examples and preserve different treatment by reporting context |
| 147 | Protected NBBO eligibility | Rule 605 uses NBBO and benchmark rules; broader quote eligibility requires Rule 600/quotation-plan definitions | Document precise eligible quote scope and odd-lot applicability as of exercise date |
| 150 | Quote/trade clock order | Rule 605 establishes order-receipt timestamp requirements; this is NOT a general feed-ordering specification | Compare venue event/receipt times, synchronization and sequence using feed standards |
| 151 | Trade count versus share volume | Rule 605 covers executed share-weighting; feed trade count is a separate message-unit concept | Verify relevant feed print-size fields and units separately |
| 152 | Tape print colors | Vendor-configurable green/red/white screen colors are OUTSIDE Rule 605 | Obtain actual versioned platform UI convention and distinguish heuristic from motive |
| 160 | One-sided quote lacks spread | SEC bid/ask glossary supports mathematical two-sided spread requirement, not a Rule 605 disclosure rule for every screen | Check stale-quote filtering and missing value handling; never present absent ask as $0 |
| 161 | Quoted versus effective spread | Rule 605 FAQ directly discusses midpoint, spread and share weighting | Reconcile trade side, covered-order timing, dollars versus basis points and precise convention |
| 162 | Price-improvement benchmark | Rule 605 FAQ Q38–40 addresses price improvement and eligible quote references | Verify November 1, 2026 best-displayed-price/odd-lot timing for examples |
| 176 | Borrow fee time basis | Securities borrowing and broker fee agreements are OUTSIDE Rule 605 | Obtain a current broker-specific fee schedule and contract day-count basis; 360-day assumption is declared fictional, not universal |
| 179 | Slippage benchmark | Rule 605 execution-price statistics are not a universal slippage definition | Declare hypothetical decision, arrival or quote benchmark, direction, account cost and units |
| 180 | Realized spread horizon | Rule 605 FAQ expressly defines multiple post-execution midpoint horizons | Validate correct horizon, trade sign and retrospective-only teaching; prevent future midpoint disclosure at replay decision point |

## Arithmetic checks kept separate from source acceptance

- Topic 161: quoted spread $10.10−$10.00=$0.10; buy effective spread 2×($10.08−$10.05)=$0.06, under the specified buy-side convention.
- Topic 162: example hypothetical buy price improvement $12.05−$12.03=$0.02/share relative to declared offer; no promise of future fills.
- Topic 176: fictional simple fee $5,000×0.36×5/360=$25; financing conventions and extra charges are broker- and contract-specific.
- Topic 179: $10.08−$10.00=$0.08/share adverse to a stated buy decision benchmark; 100-share difference=$8, excluding fees.
- Topic 180: retrospective buy realized spread 2×($10.08−$10.06)=$0.04/share at a specified ONE-MINUTE posttrade horizon; not observable at the earlier decision point.

## Release controls

All 14 topics remain `HOLD`. This triage records where the original broad SEC reference is relevant, insufficient or out of scope. It does NOT substitute for independently checked claim text, verified versioned sources, protected assessment review, source/data rights, a real signed-in learner acceptance run or the individual disposition of the remaining Foundation topics 101–180.

No live pricing, paid inference, exchange-feed ingestion, protected answer disclosure, or acceptance status change is authorized by this register.
