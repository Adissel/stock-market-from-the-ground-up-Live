# SITE-001–SITE-100: Member Acceptance Execution Matrix V1

| Document control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Document ID | SMFGU-SITE100-ACCESS-QA-20261103 |
| Date | November 3, 2026 |
| Version / status | 1.0 — source acceptance scenarios only; NOT real two-account/browser approval |
| Filename | `docs/qa/2026-11-03_SITE100_TWO_ACCOUNT_BROWSER_ACCEPTANCE_V1.md` (Markdown), `data/site100-member-journey-acceptance-matrix-v1.json` (JSON) |
| Repository | `Adissel/stock-market-from-the-ground-up-Live`, branch `batch/site100-member-journey-qa-20261103` |
| Google Drive | Not created; no Drive ID assigned |
| Purpose | Translate all 100 existing SITE Labs into complete, route-grounded 2-account and accessibility acceptance cases |
| Baseline SHA | `3b774200b9234efc8ad86247fc1a40148347250c` |
| Dependencies | Frozen Learning v3.3/Lab v3.2; canonical 419 Lab research; 25 internal SITE source groups; actual test accounts and authorized member browser session |

## Delivered scope

The 100 official SITE Lab IDs remain unmodified. This batch assigns **four distinct member-learning/QA activities to each of 25 product families**, grounded in **9 existing representative HTML routes and 50 internal JavaScript evidence pointers**.

Every case explicitly requires authenticated QA with separate identities, save/reload, cross-account authorization rejection, keyboard/mobile and screen-reader checks. **None of these real-world checks is marked as passed by this source batch**. The automated suite verifies the source matrix, actual HTML landmarks, candidate JavaScript path presence and frozen release controls, not authenticated business functionality.

**Critical:** A representative route may be shared by multiple tools. Its existence is NOT proof that a distinct named feature is live on that page, in the customer's membership, or usable by assistive technology.

## 25 member acceptance families

| Product | Representative candidate page | Source files | Required negative path |
|---|---|---|---|
| Platform Navigation & Dashboard | `dashboard.html` | `dashboard.html `, `assets/js/dashboard.js` | Sign out and verify member progress, badges and identity are not revealed to a guest |
| Book Access & Lab Registry | `labs.html` | `lab-player.html `, `assets/js/lab-player.js` | Reject an unentitled direct deep-link without exposing protected exercises |
| No-Look-Ahead Historical Replay | `verified-replay.html` | `assets/js/verified-replay-v01492.js `, `assets/js/historical-replay-classroom-v1.js` | Resume after refresh without advancing to hidden future observations |
| Advanced Market Simulator & Replay | `simulator.html` | `assets/js/simulator.js `, `assets/js/crownlight-echarts-replay-v1.js` | Block a second account from reading the first account's simulated attempts |
| Trading Journal & Performance Analytics | `journal.html` | `assets/js/journal-analytics.js `, `assets/js/journal-v2-logic.js` | Enforce weekly limits, UTC reset, deletion/recreation and foreign-account denial |
| Market Tutor | `market-tutor.html` | `assets/js/market-tutor.js `, `assets/js/tutor-guided-practice-v1.js` | Deny access to another account's conversation and never reveal answer keys |
| Market Discovery Lab | `advanced-tool.html` | `assets/js/market-research-engine-v014145.js `, `assets/js/watchlist-research-core-v2.js` | Preserve empty results and unknown source values without fabricated outcomes |
| Scanner Builder & Historical Scanner Replay | `advanced-tool.html` | `assets/js/crownlight-scanner-rules-v1.js `, `assets/js/advanced-tools.js` | Reject protected Champion edits and cross-user saved-view access |
| Watchlist & Trade-Plan Workbench | `free-watchlist.html` | `assets/js/free-watchlist-v1.js `, `assets/js/advanced-trade-plan-v1.js` | Enforce account isolation, simultaneous limit checks and locked membership items |
| Catalyst & Filing Research Lab | `free-watchlist.html` | `functions/api/sec-issuer-research-v1.js `, `assets/js/watchlist-sec-research-v1.js` | Reject stale, unrelated or missing issuer evidence instead of inferring catalysts |
| Float & Supply Lab | `advanced-tool.html` | `assets/js/market-research-engine-v014145.js `, `assets/js/lab-player.js` | Reject missing or unlicensed provider observations without invented figures |
| Market Structure Lab | `advanced-tool.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/lab-player.js` | Prevent a signal from using post-decision swing points or future candles |
| Multi-Timeframe Synchronizer | `advanced-tool.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/crownlight-echarts-replay-v1.js` | Preserve timezone and right-hand blank future buffer without lookahead |
| Risk & Position Sizing Laboratory | `advanced-tool.html` | `assets/js/learning-quant-studies-v1.js `, `assets/js/advanced-trade-plan-v1.js` | Block invalid zero-distance stops, negative capital and unsafe cross-account writes |
| Execution Laboratory | `simulator.html` | `assets/js/trade-plan-order-lifecycle-v1.js `, `assets/js/simulator.js` | Reject stale unauthorized order updates and reconcile partial fills |
| Liquidity & Spread Laboratory | `advanced-tool.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/advanced-trade-plan-v1.js` | Treat missing quotes or halted markets as UNKNOWN rather than guaranteed liquidity |
| Order Flow & Tape Laboratory | `advanced-tool.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/lab-player.js` | Do not display unlicensed Level II/trade-print data or raw provider credentials |
| Strategy Validation | `journal-analytics.html` | `assets/js/journal-analytics.js `, `assets/js/journal-evidence-v1.js` | Reject made-up strategy performance and official grading from simulations |
| News & Source Verification | `free-watchlist.html` | `assets/js/watchlist-sec-research-v1.js `, `functions/api/sec-issuer-research-v1.js` | Mark conflicts unresolved instead of inventing a verified source |
| Corporate Actions & Adjustments | `free-watchlist.html` | `assets/js/market-research-engine-v014145.js `, `assets/js/watchlist-sec-research-v1.js` | Reject unsupported float calculations with missing action-effective dates |
| Extended-Hours Context | `verified-replay.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/historical-replay-classroom-v1.js` | Handle missing extended-hours bars and events without retroactive insertion |
| Halts & Limit Up-Limit Down | `verified-replay.html` | `assets/js/historical-replay-classroom-v1.js `, `assets/js/lab-player.js` | Block fill or price assertions during unknown halt-status intervals |
| Opening, Closing & Reopening Auctions | `verified-replay.html` | `assets/js/crownlight-chart-studio-v2.js `, `assets/js/lab-player.js` | Do not convert indicative prices into guaranteed executions |
| Order Types & Execution Control | `simulator.html` | `assets/js/trade-plan-order-lifecycle-v1.js `, `assets/js/advanced-trade-plan-v1.js` | Prevent a cancelled/expired simulation from creating a live order |
| Trade Review & Analytics | `journal-analytics.html` | `assets/js/journal-analytics.js `, `assets/js/journal-weekly-v2.js` | Deny another account's review and avoid claiming predictive performance |

## 100 canonical acceptance cases

| ID | Activity | Feature | Member QA action | Approval status |
|---|---|---|---|---|
| SITE-001 | Understand | Platform Navigation & Dashboard | Locate the signed-in dashboard and verify feature-navigation route semantics | Pending authenticated and independent acceptance |
| SITE-002 | Recognize | Platform Navigation & Dashboard | Confirm a resumed member sees their own progress, not another member's | Pending authenticated and independent acceptance |
| SITE-003 | Apply | Platform Navigation & Dashboard | Navigate from the dashboard to the Lab registry and back without losing session state | Pending authenticated and independent acceptance |
| SITE-004 | Failure Modes & Review | Platform Navigation & Dashboard | Sign out and verify member progress, badges and identity are not revealed to a guest | Pending authenticated and independent acceptance |
| SITE-005 | Understand | Book Access & Lab Registry | Locate a canonical Lab using its registry ID and exact title | Pending authenticated and independent acceptance |
| SITE-006 | Recognize | Book Access & Lab Registry | Distinguish granted Labs from locked or unavailable Labs | Pending authenticated and independent acceptance |
| SITE-007 | Apply | Book Access & Lab Registry | Open a Lab, then return to the registry and reopen the same ID | Pending authenticated and independent acceptance |
| SITE-008 | Failure Modes & Review | Book Access & Lab Registry | Reject an unentitled direct deep-link without exposing protected exercises | Pending authenticated and independent acceptance |
| SITE-009 | Understand | No-Look-Ahead Historical Replay | Identify fictional versus authorized historical data labels | Pending authenticated and independent acceptance |
| SITE-010 | Recognize | No-Look-Ahead Historical Replay | Explain why future candles cannot be included in current replay decisions | Pending authenticated and independent acceptance |
| SITE-011 | Apply | No-Look-Ahead Historical Replay | Advance replay one completed candle and record source/timeframe context | Pending authenticated and independent acceptance |
| SITE-012 | Failure Modes & Review | No-Look-Ahead Historical Replay | Resume after refresh without advancing to hidden future observations | Pending authenticated and independent acceptance |
| SITE-013 | Understand | Advanced Market Simulator & Replay | Identify fictional simulator controls and data disclosure | Pending authenticated and independent acceptance |
| SITE-014 | Recognize | Advanced Market Simulator & Replay | Explain the difference between educational position planning and broker execution | Pending authenticated and independent acceptance |
| SITE-015 | Apply | Advanced Market Simulator & Replay | Save a simulated attempt under the active test account only | Pending authenticated and independent acceptance |
| SITE-016 | Failure Modes & Review | Advanced Market Simulator & Replay | Block a second account from reading the first account's simulated attempts | Pending authenticated and independent acceptance |
| SITE-017 | Understand | Trading Journal & Performance Analytics | Locate private journal records and the weekly period indicator | Pending authenticated and independent acceptance |
| SITE-018 | Recognize | Trading Journal & Performance Analytics | Explain why unrealized/planned returns differ from realized entries | Pending authenticated and independent acceptance |
| SITE-019 | Apply | Trading Journal & Performance Analytics | Save, reload and verify the same authenticated journal entry | Pending authenticated and independent acceptance |
| SITE-020 | Failure Modes & Review | Trading Journal & Performance Analytics | Enforce weekly limits, UTC reset, deletion/recreation and foreign-account denial | Pending authenticated and independent acceptance |
| SITE-021 | Understand | Market Tutor | Locate the typed Talia teaching interface and its method citations | Pending authenticated and independent acceptance |
| SITE-022 | Recognize | Market Tutor | Explain its source limitations and the protected assessment-answer boundary | Pending authenticated and independent acceptance |
| SITE-023 | Apply | Market Tutor | Request an original candlestick or VWAP explanation tied to observed chart evidence | Pending authenticated and independent acceptance |
| SITE-024 | Failure Modes & Review | Market Tutor | Deny access to another account's conversation and never reveal answer keys | Pending authenticated and independent acceptance |
| SITE-025 | Understand | Market Discovery Lab | Locate candidate search inputs and timestamp labeling | Pending authenticated and independent acceptance |
| SITE-026 | Recognize | Market Discovery Lab | Explain why research candidates are not automatically tradable securities | Pending authenticated and independent acceptance |
| SITE-027 | Apply | Market Discovery Lab | Save and reopen a source-timestamped fictional discovery record | Pending authenticated and independent acceptance |
| SITE-028 | Failure Modes & Review | Market Discovery Lab | Preserve empty results and unknown source values without fabricated outcomes | Pending authenticated and independent acceptance |
| SITE-029 | Understand | Scanner Builder & Historical Scanner Replay | Locate AND/OR/NOT rule configuration in the scanner workspace | Pending authenticated and independent acceptance |
| SITE-030 | Recognize | Scanner Builder & Historical Scanner Replay | Explain missing-value UNKNOWN semantics and supplied-data limitations | Pending authenticated and independent acceptance |
| SITE-031 | Apply | Scanner Builder & Historical Scanner Replay | Run a fictional nested-rule scan and inspect PASS/FAIL/UNKNOWN trace | Pending authenticated and independent acceptance |
| SITE-032 | Failure Modes & Review | Scanner Builder & Historical Scanner Replay | Reject protected Champion edits and cross-user saved-view access | Pending authenticated and independent acceptance |
| SITE-033 | Understand | Watchlist & Trade-Plan Workbench | Locate Free Watchlist and advisory membership limits | Pending authenticated and independent acceptance |
| SITE-034 | Recognize | Watchlist & Trade-Plan Workbench | Explain why a watchlist entry is not an execution signal | Pending authenticated and independent acceptance |
| SITE-035 | Apply | Watchlist & Trade-Plan Workbench | Save and reload a symbol within the 20-symbol Free entitlement | Pending authenticated and independent acceptance |
| SITE-036 | Failure Modes & Review | Watchlist & Trade-Plan Workbench | Enforce account isolation, simultaneous limit checks and locked membership items | Pending authenticated and independent acceptance |
| SITE-037 | Understand | Catalyst & Filing Research Lab | Locate SEC issuer and filing-research entry points | Pending authenticated and independent acceptance |
| SITE-038 | Recognize | Catalyst & Filing Research Lab | Explain CIK and acceptance timestamp versus article publication time | Pending authenticated and independent acceptance |
| SITE-039 | Apply | Catalyst & Filing Research Lab | Retrieve a candidate SEC filing with visible source and query timestamp | Pending authenticated and independent acceptance |
| SITE-040 | Failure Modes & Review | Catalyst & Filing Research Lab | Reject stale, unrelated or missing issuer evidence instead of inferring catalysts | Pending authenticated and independent acceptance |
| SITE-041 | Understand | Float & Supply Lab | Identify float, issued shares and market-cap calculation inputs | Pending authenticated and independent acceptance |
| SITE-042 | Recognize | Float & Supply Lab | Explain why unavailable float or stale shares data cannot be substituted | Pending authenticated and independent acceptance |
| SITE-043 | Apply | Float & Supply Lab | Demonstrate fictional float-versus-market-cap reasoning with explicit units | Pending authenticated and independent acceptance |
| SITE-044 | Failure Modes & Review | Float & Supply Lab | Reject missing or unlicensed provider observations without invented figures | Pending authenticated and independent acceptance |
| SITE-045 | Understand | Market Structure Lab | Locate the chart's completed-candle structure overlays | Pending authenticated and independent acceptance |
| SITE-046 | Recognize | Market Structure Lab | Explain higher-high/lower-low evidence and observation-window boundaries | Pending authenticated and independent acceptance |
| SITE-047 | Apply | Market Structure Lab | Compare a fictional four-swing HH/HL example against a mixed sequence | Pending authenticated and independent acceptance |
| SITE-048 | Failure Modes & Review | Market Structure Lab | Prevent a signal from using post-decision swing points or future candles | Pending authenticated and independent acceptance |
| SITE-049 | Understand | Multi-Timeframe Synchronizer | Locate interval/timeframe controls on a chart surface | Pending authenticated and independent acceptance |
| SITE-050 | Recognize | Multi-Timeframe Synchronizer | Explain why one-minute compression does not preserve intrabar ordering | Pending authenticated and independent acceptance |
| SITE-051 | Apply | Multi-Timeframe Synchronizer | Compare fictional 1-, 3- and 5-minute aggregation over the same history | Pending authenticated and independent acceptance |
| SITE-052 | Failure Modes & Review | Multi-Timeframe Synchronizer | Preserve timezone and right-hand blank future buffer without lookahead | Pending authenticated and independent acceptance |
| SITE-053 | Understand | Risk & Position Sizing Laboratory | Identify entry, stop and intended risk-per-share inputs | Pending authenticated and independent acceptance |
| SITE-054 | Recognize | Risk & Position Sizing Laboratory | Explain why stop distance is planned risk rather than realized fill risk | Pending authenticated and independent acceptance |
| SITE-055 | Apply | Risk & Position Sizing Laboratory | Compute a fictional position size including slippage reserve | Pending authenticated and independent acceptance |
| SITE-056 | Failure Modes & Review | Risk & Position Sizing Laboratory | Block invalid zero-distance stops, negative capital and unsafe cross-account writes | Pending authenticated and independent acceptance |
| SITE-057 | Understand | Execution Laboratory | Locate simulated order-selection and execution controls | Pending authenticated and independent acceptance |
| SITE-058 | Recognize | Execution Laboratory | Explain market/limit order uncertainty and potential partial fills | Pending authenticated and independent acceptance |
| SITE-059 | Apply | Execution Laboratory | Practice a fictional order-state transition without submitting live trade | Pending authenticated and independent acceptance |
| SITE-060 | Failure Modes & Review | Execution Laboratory | Reject stale unauthorized order updates and reconcile partial fills | Pending authenticated and independent acceptance |
| SITE-061 | Understand | Liquidity & Spread Laboratory | Locate displayed bid, ask, midpoint and spread definitions | Pending authenticated and independent acceptance |
| SITE-062 | Recognize | Liquidity & Spread Laboratory | Explain why a quote or displayed size is not guaranteed execution | Pending authenticated and independent acceptance |
| SITE-063 | Apply | Liquidity & Spread Laboratory | Compare two fictional quoted spreads with identical last-trade price | Pending authenticated and independent acceptance |
| SITE-064 | Failure Modes & Review | Liquidity & Spread Laboratory | Treat missing quotes or halted markets as UNKNOWN rather than guaranteed liquidity | Pending authenticated and independent acceptance |
| SITE-065 | Understand | Order Flow & Tape Laboratory | Locate source labels for time-and-sales or order-flow teaching | Pending authenticated and independent acceptance |
| SITE-066 | Recognize | Order Flow & Tape Laboratory | Explain why quote depth cannot reveal a participant's identity or intent | Pending authenticated and independent acceptance |
| SITE-067 | Apply | Order Flow & Tape Laboratory | Walk through a fictional order-book/tape snapshot with explicit venue scope | Pending authenticated and independent acceptance |
| SITE-068 | Failure Modes & Review | Order Flow & Tape Laboratory | Do not display unlicensed Level II/trade-print data or raw provider credentials | Pending authenticated and independent acceptance |
| SITE-069 | Understand | Strategy Validation | Locate research and journal performance summaries | Pending authenticated and independent acceptance |
| SITE-070 | Recognize | Strategy Validation | Explain in-sample selection, overfitting and outcome uncertainty | Pending authenticated and independent acceptance |
| SITE-071 | Apply | Strategy Validation | Compare fictional train and embargo/holdout windows without data leakage | Pending authenticated and independent acceptance |
| SITE-072 | Failure Modes & Review | Strategy Validation | Reject made-up strategy performance and official grading from simulations | Pending authenticated and independent acceptance |
| SITE-073 | Understand | News & Source Verification | Locate SEC and source-verification entry points | Pending authenticated and independent acceptance |
| SITE-074 | Recognize | News & Source Verification | Explain source hierarchy and exact event timestamp requirements | Pending authenticated and independent acceptance |
| SITE-075 | Apply | News & Source Verification | Open a fictional watchlist catalyst with a cited primary-source candidate | Pending authenticated and independent acceptance |
| SITE-076 | Failure Modes & Review | News & Source Verification | Mark conflicts unresolved instead of inventing a verified source | Pending authenticated and independent acceptance |
| SITE-077 | Understand | Corporate Actions & Adjustments | Locate issuer filing and corporate-action research references | Pending authenticated and independent acceptance |
| SITE-078 | Recognize | Corporate Actions & Adjustments | Explain split-adjusted versus unadjusted price/volume comparisons | Pending authenticated and independent acceptance |
| SITE-079 | Apply | Corporate Actions & Adjustments | Describe fictional reverse-split effects on price and share quantities | Pending authenticated and independent acceptance |
| SITE-080 | Failure Modes & Review | Corporate Actions & Adjustments | Reject unsupported float calculations with missing action-effective dates | Pending authenticated and independent acceptance |
| SITE-081 | Understand | Extended-Hours Context | Locate premarket, regular and after-hours session labels | Pending authenticated and independent acceptance |
| SITE-082 | Recognize | Extended-Hours Context | Explain exchange hours versus broker-specific execution availability | Pending authenticated and independent acceptance |
| SITE-083 | Apply | Extended-Hours Context | Replay a fictional premarket-to-regular transition with explicit timezone | Pending authenticated and independent acceptance |
| SITE-084 | Failure Modes & Review | Extended-Hours Context | Handle missing extended-hours bars and events without retroactive insertion | Pending authenticated and independent acceptance |
| SITE-085 | Understand | Halts & Limit Up-Limit Down | Locate halt/LULD annotations or source warning states | Pending authenticated and independent acceptance |
| SITE-086 | Recognize | Halts & Limit Up-Limit Down | Explain that halts affect order execution and reopening price discovery | Pending authenticated and independent acceptance |
| SITE-087 | Apply | Halts & Limit Up-Limit Down | Use a fictional halted/reopened sequence with no executable halted trades | Pending authenticated and independent acceptance |
| SITE-088 | Failure Modes & Review | Halts & Limit Up-Limit Down | Block fill or price assertions during unknown halt-status intervals | Pending authenticated and independent acceptance |
| SITE-089 | Understand | Opening, Closing & Reopening Auctions | Locate opening/closing/reopening auction research displays | Pending authenticated and independent acceptance |
| SITE-090 | Recognize | Opening, Closing & Reopening Auctions | Explain indicative auction information versus executed trade reports | Pending authenticated and independent acceptance |
| SITE-091 | Apply | Opening, Closing & Reopening Auctions | Review fictional auction updates against regular-trading observations | Pending authenticated and independent acceptance |
| SITE-092 | Failure Modes & Review | Opening, Closing & Reopening Auctions | Do not convert indicative prices into guaranteed executions | Pending authenticated and independent acceptance |
| SITE-093 | Understand | Order Types & Execution Control | Locate market, limit and stop order instructions | Pending authenticated and independent acceptance |
| SITE-094 | Recognize | Order Types & Execution Control | Explain adverse selection, slippage and order validity/expiration | Pending authenticated and independent acceptance |
| SITE-095 | Apply | Order Types & Execution Control | Practice a fictional partial fill, cancel and remaining-quantity reconciliation | Pending authenticated and independent acceptance |
| SITE-096 | Failure Modes & Review | Order Types & Execution Control | Prevent a cancelled/expired simulation from creating a live order | Pending authenticated and independent acceptance |
| SITE-097 | Understand | Trade Review & Analytics | Locate trading journal and analytics review records | Pending authenticated and independent acceptance |
| SITE-098 | Recognize | Trade Review & Analytics | Explain the difference between process quality, MFE/MAE and P/L | Pending authenticated and independent acceptance |
| SITE-099 | Apply | Trade Review & Analytics | Reopen a fictional record with consistent timestamps and fees | Pending authenticated and independent acceptance |
| SITE-100 | Failure Modes & Review | Trade Review & Analytics | Deny another account's review and avoid claiming predictive performance | Pending authenticated and independent acceptance |

## QA execution process

1. Execute on the exact frozen GitHub SHA and matching successful Cloudflare deployment; record URL, session identity role, timestamp and viewport.
2. Authenticate with two separate valid nonstaff QA accounts created within the authorized testing program. These scenario labels are placeholders and do not supply account credentials.
3. Run each member's positive path; save/reload/resume and confirm the original record remains private to its owner.
4. Switch sessions and verify 401/403 or equivalent denial on another account's protected records. Check stale session and revoked permission behavior.
5. Complete keyboard focus/labels, large text, mobile/desktop and actual assistive technology validation. Record failures and evidence for independent reviewer acceptance.
6. Keep testing separate from Stripe LIVE charges, grading, private market-data feeds, Member Lumens and production feature grants.

## Original project decisions and percentage controls

419 Labs still have catalogued source candidates, but this SITE-100 QA matrix does not grant curricular or publication approval. Feature-ledger source integration remains **16/64 = 25.0%** and source/prototype coverage **58/64 = 90.6%**. The whole-site weighted 33.8% source snapshot is historical planning only, not current release-ready completion.

## Revision history

| Version | Date | Change | Acceptance |
|---|---|---|---|
| 1.0 | 2026-11-03 | Compiled 100 canonical four-stage member QA cases, 25 evidence groups, routes, two-account tests and accessibility/authorization holds | Test-scenario readiness only; genuine member QA and independent release still open |

**Footer:** SMFGU-SITE100-ACCESS-QA-20261103 · v1.0 · Read-only evidence matrix, no member writes.
