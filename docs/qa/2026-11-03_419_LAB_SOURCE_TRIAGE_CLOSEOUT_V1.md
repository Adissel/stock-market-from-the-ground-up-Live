# 419-Lab Source-Triage Inventory — Research Wave 3 (227 Remaining Labs)

| Document control | Value |
|---|---|
| Document ID | SMFGU-LABS-WAVE3-227-20261103 |
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Version | 1.0 |
| Status | Research candidates/inventory only; zero independent source or production acceptance implied |
| Date | November 3, 2026 |
| GitHub repository / base SHA | `Adissel/stock-market-from-the-ground-up-Live` / `423253664e73dcefb0544a90f7e52553f47790fd` |
| Filename / type | `docs/qa/2026-11-03_419_LAB_SOURCE_TRIAGE_CLOSEOUT_V1.md` (Markdown); `data/lab-227-remaining-source-internal-evidence-v1.json` (JSON); `tests/lab-227-remaining-source-evidence-v1.test.mjs` (Node ESM) |
| Google Drive | Not created or assigned; GitHub is the authoritative file location |
| Purpose | Finish source-inventory triage of canonical rows 193–419 and distinguish market-feed methodology from this platform's own implementation evidence |
| Dependencies | Immutable 419-row source CSV; Wave 1 first 64; Wave 2 next 128; owner-approved teaching; frozen Learning v3.3/Lab v3.2; 30 competencies; independent publication and release holds |

## Results and scope

This research phase catalogs **all 419 existing canonical Lab source-candidate mappings** in three disjoint waves: **64 + 128 + 227 = 419**. Wave 3 comprises **52 advanced day-trading**, **75 Tape-reading**, and **100 SITE workflow** instructional candidate records. This means **419/419 metadata rows have been triaged**; it does **not** mean any new lesson has independently passed source claim, accessibility, legal-rights, protected assessment, or real member acceptance. The original 419-row CSV is retained unchanged, including unaccepted status fields.

Unlike market education, the `SITE-001`–`SITE-100` lessons must be reviewed against **this repository's actual implementation**. This batch verifies **50 internal file reference pointers** across **25 SITE subject families** exist at the base SHA, but existence alone is not proof that any feature works in production, is keyboard accessible, or properly protects account data.

## Scope split

| Canonical ordinal | Count | Area | Source standard |
|---|---:|---|---|
| 193–244 | 52 | Advanced Day Trading | External technical/SEC/NYSE references; exact fictional or licensed replay evidence |
| 245–319 | 75 | Tape Reading | External market-structure research; Level II/time-and-sales rights, latency and attribution warnings |
| 320–419 | 100 | SITE workflow lessons | Internal GitHub implementation candidate files with real member QA and privacy gates |

## Market-education source families

| Family | Ordinals | Topic sources | Limitation |
|---|---|---|---|
| vwap_and_range | 193–196 | TOS_VWAP, CS_LEVELS | Historical completed VWAP and price-zone evidence only; no hidden tape access. |
| gap_opening_reversals | 197–202 | CS_CANDLES, CS_LEVELS | Gaps, opening range and reversal require predeclared no-lookahead windows. |
| halt_resume | 203–205 | NYSE_HALTS, NYSE_TRADING | Halt and reopening rules vary across venue and time; not a guaranteed fill or exit. |
| trade_plan_entry | 206–211 | SEC_ORDERS, CS_LEVELS | Planning and entry are fictional education, not a broker or position recommendation. |
| position_orders_stops | 212–220 | SEC_ORDERS, NYSE_TRADING | Nominal planned risk, queue priority and actual fills differ; no guarantee stop or limit fills. |
| targets_open_management | 221–226 | SEC_ORDERS, CS_LEVELS | Target and trailing mechanisms are conditional; protect assessment answers. |
| failed_trades_reentries_psychology | 227–234 | CS_LEVELS, SEC_ORDERS | Failed setups and reentry do not justify continuing loss exposure or claim forward outcomes. |
| regime_journal_replay_readiness | 235–244 | NYSE_TRADING, SEC_ORDERS | Historical GRML replay needs actual archived source rights and timestamp QA; no graded award. |
| tape_evidence_layers | 245–259 | NYSE_TRADING, SEC_ORDERS | Quotes, prints and displayed depth are distinct; colors and reports cannot identify intent. |
| aggressor_print_speed | 260–268 | NYSE_TRADING, SEC_ORDERS | Aggressor inference is fallible; order splitting or reporting cannot identify participants. |
| level2_book_liquidity | 269–280 | NYSE_TRADING, SEC_ORDERS | Level II is partial depth and often a licensed feed; no provider permission or participant identity inferred. |
| tape_chart_vwap_breakouts | 281–289 | CS_LEVELS, TOS_VWAP | Tape/VWAP interpretation requires synchronized evidence and exact declared calculation provenance. |
| tape_feed_limits_and_decisions | 290–301 | NYSE_TRADING, SEC_ORDERS | Feed latency, trade conditions, venue reporting and decision journals require source-specific checks. |
| advanced_tape_visualizations | 302–319 | NYSE_TRADING, TOS_VWAP | DOM, heatmaps, footprints and market-by-order displays require explicit rights and source/type visibility; no raw licensed feed redistributed. |

## SITE product source families

| Family | SITE positions | Product | Primary candidate files |
|---|---|---|---|
| navigation_dashboard | SITE-001–SITE-004 | Platform Navigation & Dashboard | dashboard.html; assets/js/dashboard.js |
| book_lab_registry | SITE-005–SITE-008 | Book Access & Lab Registry | lab-player.html; assets/js/lab-player.js |
| historical_replay | SITE-009–SITE-012 | No-Look-Ahead Historical Replay | assets/js/verified-replay-v01492.js; assets/js/historical-replay-classroom-v1.js |
| simulator_replay | SITE-013–SITE-016 | Advanced Market Simulator & Replay | assets/js/simulator.js; assets/js/crownlight-echarts-replay-v1.js |
| journal_analytics | SITE-017–SITE-020 | Trading Journal & Performance Analytics | assets/js/journal-analytics.js; assets/js/journal-v2-logic.js |
| market_tutor | SITE-021–SITE-024 | Market Tutor | assets/js/market-tutor.js; assets/js/tutor-guided-practice-v1.js |
| market_discovery | SITE-025–SITE-028 | Market Discovery Lab | assets/js/market-research-engine-v014145.js; assets/js/watchlist-research-core-v2.js |
| scanner_builder | SITE-029–SITE-032 | Scanner Builder & Historical Scanner Replay | assets/js/crownlight-scanner-rules-v1.js; assets/js/advanced-tools.js |
| watchlist_trade_plan | SITE-033–SITE-036 | Watchlist & Trade-Plan Workbench | assets/js/free-watchlist-v1.js; assets/js/advanced-trade-plan-v1.js |
| catalyst_filings | SITE-037–SITE-040 | Catalyst & Filing Research Lab | functions/api/sec-issuer-research-v1.js; assets/js/watchlist-sec-research-v1.js |
| float_supply | SITE-041–SITE-044 | Float & Supply Lab | assets/js/market-research-engine-v014145.js; assets/js/lab-player.js |
| market_structure | SITE-045–SITE-048 | Market Structure Lab | assets/js/crownlight-chart-studio-v2.js; assets/js/lab-player.js |
| multi_timeframe | SITE-049–SITE-052 | Multi-Timeframe Synchronizer | assets/js/crownlight-chart-studio-v2.js; assets/js/crownlight-echarts-replay-v1.js |
| position_sizing | SITE-053–SITE-056 | Risk & Position Sizing Laboratory | assets/js/learning-quant-studies-v1.js; assets/js/advanced-trade-plan-v1.js |
| execution_lab | SITE-057–SITE-060 | Execution Laboratory | assets/js/trade-plan-order-lifecycle-v1.js; assets/js/simulator.js |
| liquidity_spread | SITE-061–SITE-064 | Liquidity & Spread Laboratory | assets/js/crownlight-chart-studio-v2.js; assets/js/advanced-trade-plan-v1.js |
| orderflow_tape | SITE-065–SITE-068 | Order Flow & Tape Laboratory | assets/js/crownlight-chart-studio-v2.js; assets/js/lab-player.js |
| strategy_validation | SITE-069–SITE-072 | Strategy Validation | assets/js/journal-analytics.js; assets/js/journal-evidence-v1.js |
| source_verification | SITE-073–SITE-076 | News & Source Verification | assets/js/watchlist-sec-research-v1.js; functions/api/sec-issuer-research-v1.js |
| corporate_actions | SITE-077–SITE-080 | Corporate Actions & Adjustments | assets/js/market-research-engine-v014145.js; assets/js/watchlist-sec-research-v1.js |
| extended_hours | SITE-081–SITE-084 | Extended-Hours Context | assets/js/crownlight-chart-studio-v2.js; assets/js/historical-replay-classroom-v1.js |
| luld_halts | SITE-085–SITE-088 | Halts & Limit Up-Limit Down | assets/js/historical-replay-classroom-v1.js; assets/js/lab-player.js |
| auctions | SITE-089–SITE-092 | Opening, Closing & Reopening Auctions | assets/js/crownlight-chart-studio-v2.js; assets/js/lab-player.js |
| order_types_execution | SITE-093–SITE-096 | Order Types & Execution Control | assets/js/trade-plan-order-lifecycle-v1.js; assets/js/advanced-trade-plan-v1.js |
| trade_review | SITE-097–SITE-100 | Trade Review & Analytics | assets/js/journal-analytics.js; assets/js/journal-weekly-v2.js |

## 227 canonical source-evidence candidates

| Ordinal | Lab ID | Original lesson title | Scope | Candidate references / internal source | QA flags |
|---:|---|---|---|---|---|
| 193 | DT-C33-L03 | VWAP Holds, Reclaims, Rejections, and Failures — Distance From VWAP | vwap_and_range | TOS_VWAP, CS_LEVELS | Claim-level review pending |
| 194 | DT-C34-L01 | Consolidations, Ranges, and Compression-to-Expansion Setups — Define the Box | vwap_and_range | TOS_VWAP, CS_LEVELS | Claim-level review pending |
| 195 | DT-C34-L02 | Consolidations, Ranges, and Compression-to-Expansion Setups — Dead Liquidity Is Not Productive Compression | vwap_and_range | TOS_VWAP, CS_LEVELS | Claim-level review pending |
| 196 | DT-C34-L03 | Consolidations, Ranges, and Compression-to-Expansion Setups — False Break and Range Failure | vwap_and_range | TOS_VWAP, CS_LEVELS | Claim-level review pending |
| 197 | DT-C35-L01 | Gap Continuation, Gap Failure, and Opening-Range Setups — Gap Context | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 198 | DT-C35-L02 | Gap Continuation, Gap Failure, and Opening-Range Setups — Define the Opening Range | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 199 | DT-C35-L03 | Gap Continuation, Gap Failure, and Opening-Range Setups — First-Candle Risk | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 200 | DT-C36-L01 | Reversals, Exhaustion, and Failed-Move Setups — Exhaustion Is a Condition, Not a Percentage | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 201 | DT-C36-L02 | Reversals, Exhaustion, and Failed-Move Setups — Lower High / Higher Low Confirmation | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 202 | DT-C36-L03 | Reversals, Exhaustion, and Failed-Move Setups — Countertrend Risk | gap_opening_reversals | CS_CANDLES, CS_LEVELS | Claim-level review pending |
| 203 | DT-C37-L01 | Trading Halts, Resumptions, Parabolic Moves, and Extreme Volatility — Why Trading Can Halt | halt_resume | NYSE_HALTS, NYSE_TRADING | Claim-level review pending |
| 204 | DT-C37-L02 | Trading Halts, Resumptions, Parabolic Moves, and Extreme Volatility — Resumption Is New Price Discovery | halt_resume | NYSE_HALTS, NYSE_TRADING | Claim-level review pending |
| 205 | DT-C37-L03 | Trading Halts, Resumptions, Parabolic Moves, and Extreme Volatility — Risk Through Gaps | halt_resume | NYSE_HALTS, NYSE_TRADING | Claim-level review pending |
| 206 | DT-C38-L01 | Building the Trade Plan — Thesis | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 207 | DT-C38-L02 | Building the Trade Plan — Invalidation | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 208 | DT-C38-L03 | Building the Trade Plan — The Trigger | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 209 | DT-C39-L01 | Making the Entry Decision — Confirmation versus chasing | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 210 | DT-C39-L02 | Making the Entry Decision — Entry location and risk | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 211 | DT-C39-L03 | Making the Entry Decision — Entry Location Determines Risk Geometry | trade_plan_entry | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 212 | DT-C40-L01 | Position Sizing, Reward-to-Risk, and Maximum Entry — Risk Per Share | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 213 | DT-C40-L02 | Position Sizing, Reward-to-Risk, and Maximum Entry — Slippage Reserve | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 214 | DT-C40-L03 | Position Sizing, Reward-to-Risk, and Maximum Entry — Position Value Versus Risk | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 215 | DT-C41-L01 | Order Selection, Fills, Partial Fills, and Execution Control — Market Orders | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 216 | DT-C41-L02 | Order Selection, Fills, Partial Fills, and Execution Control — Marketable Limit Orders | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 217 | DT-C41-L03 | Order Selection, Fills, Partial Fills, and Execution Control — Spread and Queue Position | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 218 | DT-C42-L01 | Stops and Invalidation — Structural invalidation | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 219 | DT-C42-L02 | Stops and Invalidation — Slippage and gaps | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 220 | DT-C42-L03 | Stops and Invalidation — Hard Stops | position_orders_stops | SEC_ORDERS, NYSE_TRADING | Claim-level review pending |
| 221 | DT-C43-L01 | Profit Targets and Exits — Structural targets | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 222 | DT-C43-L02 | Profit Targets and Exits — Trailing logic | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 223 | DT-C43-L03 | Profit Targets and Exits — Fixed-R Multiple Targets | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 224 | DT-C44-L01 | Managing an Open Day Trade — Protect the original risk | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 225 | DT-C44-L02 | Managing an Open Day Trade — Add, reduce, hold, or exit | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 226 | DT-C44-L03 | Managing an Open Day Trade — Distinguish Noise From Thesis Change | targets_open_management | SEC_ORDERS, CS_LEVELS | Claim-level review pending |
| 227 | DT-C45-L01 | Failed Trades, Failed Moves, and No Trade — Failed breakout | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 228 | DT-C45-L02 | Failed Trades, Failed Moves, and No Trade — No trigger | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 229 | DT-C45-L03 | Failed Trades, Failed Moves, and No Trade — Failed Reclaim | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 230 | DT-C46-L01 | Re-Entries, Scaling, Missed Trades, and When Not to Try Again — A Re-Entry Is a New Trade | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 231 | DT-C46-L02 | Re-Entries, Scaling, Missed Trades, and When Not to Try Again — Scaling In | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 232 | DT-C46-L03 | Re-Entries, Scaling, Missed Trades, and When Not to Try Again — Second-Chance Setups | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 233 | DT-C47-L01 | The Mistakes That Damage Day Traders — Chasing and FOMO | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 234 | DT-C47-L02 | The Mistakes That Damage Day Traders — Revenge Trading | failed_trades_reentries_psychology | CS_LEVELS, SEC_ORDERS | Claim-level review pending |
| 235 | DT-C48-L01 | Advanced Intraday Decision-Making and Market Regimes — Define the Regime You Are Trading | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 236 | DT-C48-L02 | Advanced Intraday Decision-Making and Market Regimes — Second Legs and Re-Ignition | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 237 | DT-C49-L01 | Journaling, MFE/MAE, Expectancy, and Strategy Validation — Decision Log Versus P/L Log | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 238 | DT-C49-L02 | Journaling, MFE/MAE, Expectancy, and Strategy Validation — Applied Assessment | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | PROTECTED_GRADED_ASSESSMENT_REMAINS_HELD |
| 239 | DT-C50-L01 | Complete Historical Day-Trading Sessions — Case A - GRML: expansion after early instability | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | ARCHIVED_SYMBOL_SOURCE_RIGHTS_AND_TIMEZONE_EVIDENCE_REQUIRED |
| 240 | DT-C50-L02 | Complete Historical Day-Trading Sessions — Case A — GRML: Opening Instability to Major Expansion | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | ARCHIVED_SYMBOL_SOURCE_RIGHTS_AND_TIMEZONE_EVIDENCE_REQUIRED |
| 241 | DT-C51-L01 | Your Historical-Replay Day-Trading Training Program — Stage 1 - observation | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 242 | DT-C51-L02 | Your Historical-Replay Day-Trading Training Program — Stage 1 — Observation Only | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 243 | DT-C52-L01 | Day-Trading Readiness Assessment — Knowledge gate | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | PROTECTED_GRADED_ASSESSMENT_REMAINS_HELD |
| 244 | DT-C52-L02 | Day-Trading Readiness Assessment — Graduation standard | regime_journal_replay_readiness | NYSE_TRADING, SEC_ORDERS | PROTECTED_GRADED_ASSESSMENT_REMAINS_HELD |
| 245 | TAPE-C01-L01 | What Tape Reading Is - and What It Is Not — Start with evidence, not a story | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 246 | TAPE-C01-L02 | What Tape Reading Is - and What It Is Not — Four evidence layers | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 247 | TAPE-C01-L03 | What Tape Reading Is - and What It Is Not — What tape reading cannot give you | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 248 | TAPE-C02-L01 | Build Your Tape-Reading Laboratory: the Platform and Practice Modes — First build a readable three-panel workspace | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 249 | TAPE-C02-L02 | Build Your Tape-Reading Laboratory: the Platform and Practice Modes — Give every panel one job | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 250 | TAPE-C02-L03 | Build Your Tape-Reading Laboratory: the Platform and Practice Modes — Read depth and color correctly | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 251 | TAPE-C03-L01 | The Auction Behind Every Print — Start with a share, not a flashing number | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 252 | TAPE-C03-L02 | The Auction Behind Every Print — Waiting versus accepting an available price | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 253 | TAPE-C03-L03 | The Auction Behind Every Print — What tape reading tries to answer | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 254 | TAPE-C04-L01 | Read the Quote Before the Tape — The quote is a pair of invitations | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 255 | TAPE-C04-L02 | Read the Quote Before the Tape — The spread measures a gap, not a forecast | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 256 | TAPE-C04-L03 | Read the Quote Before the Tape — Read changes on both sides | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 257 | TAPE-C05-L01 | Read a Time & Sales Row — A ledger of reports | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 258 | TAPE-C05-L02 | Read a Time & Sales Row — Read one row aloud | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 259 | TAPE-C05-L03 | Read a Time & Sales Row — Filters change the story you can tell | tape_evidence_layers | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 260 | TAPE-C06-L01 | Infer Aggressor Side Carefully — Two participants, different urgency | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 261 | TAPE-C06-L02 | Infer Aggressor Side Carefully — A method you can audit | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 262 | TAPE-C06-L03 | Infer Aggressor Side Carefully — Optional signed volume, with unknowns kept visible | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 263 | TAPE-C07-L01 | Print Size, Notional Value, and Clusters — Size needs a denominator | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 264 | TAPE-C07-L02 | Print Size, Notional Value, and Clusters — Split reports are not a participant list | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 265 | TAPE-C07-L03 | Print Size, Notional Value, and Clusters — Make the comparison fair | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 266 | TAPE-C08-L01 | Speed, Acceleration, and Deceleration — Fast compared with what? | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 267 | TAPE-C08-L02 | Speed, Acceleration, and Deceleration — Pair effort with result | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 268 | TAPE-C08-L03 | Speed, Acceleration, and Deceleration — A practical pace worksheet | aggressor_print_speed | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 269 | TAPE-C09-L01 | Read Level II as a Partial Order Book — Interest that has not yet traded | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 270 | TAPE-C09-L02 | Read Level II as a Partial Order Book — Walk through the display | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 271 | TAPE-C09-L03 | Read Level II as a Partial Order Book — Why a large wall can mislead | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 272 | TAPE-C10-L01 | Adding, Pulling, Refreshing, and Changing Liquidity — Read a sequence, not a photograph | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 273 | TAPE-C10-L02 | Adding, Pulling, Refreshing, and Changing Liquidity — Three examples with different evidence | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 274 | TAPE-C10-L03 | Adding, Pulling, Refreshing, and Changing Liquidity — What stronger evidence looks like | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 275 | TAPE-C11-L01 | Absorption and Stalled Price — Much activity, little progress | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 276 | TAPE-C11-L02 | Absorption and Stalled Price — Build a testable statement | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 277 | TAPE-C11-L03 | Absorption and Stalled Price — Why the next response matters | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 278 | TAPE-C12-L01 | Exhaustion, Sweeps, and Thin Liquidity — Exhaustion is an inference about fading participation | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 279 | TAPE-C12-L02 | Exhaustion, Sweeps, and Thin Liquidity — Sweeps describe rapid consumption across prices | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 280 | TAPE-C12-L03 | Exhaustion, Sweeps, and Thin Liquidity — Read the aftermath | level2_book_liquidity | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 281 | TAPE-C13-L01 | Put the Tape on a Chart — A chart supplies the map | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 282 | TAPE-C13-L02 | Put the Tape on a Chart — Support and resistance are zones to test | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 283 | TAPE-C13-L03 | Put the Tape on a Chart — Context includes the path into the zone | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 284 | TAPE-C14-L01 | VWAP, High of Day, Low of Day, and Location — Refresh: sessions, visible bars, and the VWAP start | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 285 | TAPE-C14-L02 | VWAP, High of Day, Low of Day, and Location — A volume-weighted reference price | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 286 | TAPE-C14-L03 | VWAP, High of Day, Low of Day, and Location — Read a VWAP interaction | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 287 | TAPE-C15-L01 | Breakouts, Retests, Acceptance, and Failed Breaks — The crossing is only the first event | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 288 | TAPE-C15-L02 | Breakouts, Retests, Acceptance, and Failed Breaks — Walk through two possible futures | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 289 | TAPE-C15-L03 | Breakouts, Retests, Acceptance, and Failed Breaks — A retest can help or fail | tape_chart_vwap_breakouts | CS_LEVELS, TOS_VWAP | Claim-level review pending |
| 290 | TAPE-C16-L01 | Different Stocks Produce Different Tape — Four different descriptions | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 291 | TAPE-C16-L02 | Different Stocks Produce Different Tape — Set a baseline for each instrument and session | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 292 | TAPE-C17-L01 | What Your Feed Cannot Reveal — Follow the information, not just the price | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | FEED_TIMESTAMP_COVERAGE_AND_LIMITATIONS_REQUIRE_REVIEW |
| 293 | TAPE-C17-L02 | What Your Feed Cannot Reveal — Identity and intent remain limited | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | FEED_TIMESTAMP_COVERAGE_AND_LIMITATIONS_REQUIRE_REVIEW; EMA_COMPETENCY_IN_FEED_LIMITATIONS_TOPIC_REQUIRES_REVIEW |
| 294 | TAPE-C18-L01 | Latency, Data Quality, and Knowing Which Market You Are Seeing — What it is and why it exists | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | FEED_TIMESTAMP_COVERAGE_AND_LIMITATIONS_REQUIRE_REVIEW |
| 295 | TAPE-C18-L02 | Latency, Data Quality, and Knowing Which Market You Are Seeing — What it looks like and every component | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | FEED_TIMESTAMP_COVERAGE_AND_LIMITATIONS_REQUIRE_REVIEW |
| 296 | TAPE-C19-L01 | Build a Repeatable Tape-Reading Observation Session — Establish data readiness before market interpretation | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | PROTECTED_GRADED_ASSESSMENT_REMAINS_HELD |
| 297 | TAPE-C19-L02 | Build a Repeatable Tape-Reading Observation Session — Where training simulator fits | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 298 | TAPE-C20-L01 | Build, Record, and Review a Decision — A decision has five layers | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 299 | TAPE-C20-L02 | Build, Record, and Review a Decision — Case B: crossing with a costly spread | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 300 | TAPE-C21-L01 | Execution, Position Risk, Slippage, and When Not to Trade — A good observation is not an executable plan | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 301 | TAPE-C21-L02 | Execution, Position Risk, Slippage, and When Not to Trade — Entry quality changes the calculation | tape_feed_limits_and_decisions | NYSE_TRADING, SEC_ORDERS | Claim-level review pending |
| 302 | TAPE-C22-L01 | Market-by-Price, Market-by-Order, and Queue Mechanics — What it is | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 303 | TAPE-C22-L02 | Market-by-Price, Market-by-Order, and Queue Mechanics — Appearance and every visual component | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 304 | TAPE-C23-L01 | Venues, Reporting Facilities, Trade Conditions, and Routing — What it is and basic mechanics | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 305 | TAPE-C23-L02 | Venues, Reporting Facilities, Trade Conditions, and Routing — Purpose and how to read it | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 306 | TAPE-C24-L01 | Lots, Size Filters, and the Information You Hide — What it is | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 307 | TAPE-C24-L02 | Lots, Size Filters, and the Information You Hide — What it looks like and every component | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 308 | TAPE-C25-L01 | Opening, Closing, and Reopening Auctions — What an auction is | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 309 | TAPE-C25-L02 | Opening, Closing, and Reopening Auctions — What an auction update looks like | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 310 | TAPE-C26-L01 | Execution Schedules: TWAP, VWAP, and Participation Concepts — What an execution schedule is | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 311 | TAPE-C26-L02 | Execution Schedules: TWAP, VWAP, and Participation Concepts — How to study a possible schedule | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 312 | TAPE-C27-L01 | DOM Ladders and Liquidity Heatmaps — What they are and basic mechanics | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 313 | TAPE-C27-L02 | DOM Ladders and Liquidity Heatmaps — What they are used for and how to read them | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 314 | TAPE-C28-L01 | Footprints, Volume at Price, Delta, and Book Imbalance — Part A - Footprints and Volume at Price | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 315 | TAPE-C28-L02 | Footprints, Volume at Price, Delta, and Book Imbalance — Calculation and basic mechanics | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED |
| 316 | TAPE-C29-L01 | Fast Order Behavior Without Mind Reading — What it is and basic mechanics | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 317 | TAPE-C29-L02 | Fast Order Behavior Without Mind Reading — What it is used for and how to read it | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 318 | TAPE-C30-L01 | Gaps, Squeezes, Conflicting Evidence, and Testing What You Think You See — What it is | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 319 | TAPE-C30-L02 | Gaps, Squeezes, Conflicting Evidence, and Testing What You Think You See — Every component, purpose, and reading procedure | advanced_tape_visualizations | NYSE_TRADING, TOS_VWAP | Claim-level review pending |
| 320 | SITE-001 | Platform Navigation & Dashboard — What It Is | navigation_dashboard | INTERNAL_SITE_01 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 321 | SITE-002 | Platform Navigation & Dashboard — Why It Matters & When to Use It | navigation_dashboard | INTERNAL_SITE_01 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 322 | SITE-003 | Platform Navigation & Dashboard — Step-by-Step Workflow | navigation_dashboard | INTERNAL_SITE_01 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 323 | SITE-004 | Platform Navigation & Dashboard — Failure Modes & Review | navigation_dashboard | INTERNAL_SITE_01 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 324 | SITE-005 | Book Access & Lab Registry — What It Is | book_lab_registry | INTERNAL_SITE_02 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 325 | SITE-006 | Book Access & Lab Registry — Why It Matters & When to Use It | book_lab_registry | INTERNAL_SITE_02 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 326 | SITE-007 | Book Access & Lab Registry — Step-by-Step Workflow | book_lab_registry | INTERNAL_SITE_02 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 327 | SITE-008 | Book Access & Lab Registry — Failure Modes & Review | book_lab_registry | INTERNAL_SITE_02 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 328 | SITE-009 | No-Look-Ahead Historical Replay — What It Is | historical_replay | INTERNAL_SITE_03 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 329 | SITE-010 | No-Look-Ahead Historical Replay — Why It Matters & When to Use It | historical_replay | INTERNAL_SITE_03 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 330 | SITE-011 | No-Look-Ahead Historical Replay — Step-by-Step Workflow | historical_replay | INTERNAL_SITE_03 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 331 | SITE-012 | No-Look-Ahead Historical Replay — Failure Modes & Review | historical_replay | INTERNAL_SITE_03 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 332 | SITE-013 | Advanced Market Simulator & Replay — What It Is | simulator_replay | INTERNAL_SITE_04 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 333 | SITE-014 | Advanced Market Simulator & Replay — Why It Matters & When to Use It | simulator_replay | INTERNAL_SITE_04 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 334 | SITE-015 | Advanced Market Simulator & Replay — Step-by-Step Workflow | simulator_replay | INTERNAL_SITE_04 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 335 | SITE-016 | Advanced Market Simulator & Replay — Failure Modes & Review | simulator_replay | INTERNAL_SITE_04 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 336 | SITE-017 | Trading Journal & Performance Analytics — What It Is | journal_analytics | INTERNAL_SITE_05 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 337 | SITE-018 | Trading Journal & Performance Analytics — Why It Matters & When to Use It | journal_analytics | INTERNAL_SITE_05 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 338 | SITE-019 | Trading Journal & Performance Analytics — Step-by-Step Workflow | journal_analytics | INTERNAL_SITE_05 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 339 | SITE-020 | Trading Journal & Performance Analytics — Failure Modes & Review | journal_analytics | INTERNAL_SITE_05 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 340 | SITE-021 | Market Tutor — What It Is | market_tutor | INTERNAL_SITE_06 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 341 | SITE-022 | Market Tutor — Why It Matters & When to Use It | market_tutor | INTERNAL_SITE_06 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 342 | SITE-023 | Market Tutor — Step-by-Step Workflow | market_tutor | INTERNAL_SITE_06 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 343 | SITE-024 | Market Tutor — Failure Modes & Review | market_tutor | INTERNAL_SITE_06 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 344 | SITE-025 | Market Discovery Lab — What It Is | market_discovery | INTERNAL_SITE_07 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 345 | SITE-026 | Market Discovery Lab — Why It Matters & When to Use It | market_discovery | INTERNAL_SITE_07 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 346 | SITE-027 | Market Discovery Lab — Step-by-Step Workflow | market_discovery | INTERNAL_SITE_07 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 347 | SITE-028 | Market Discovery Lab — Failure Modes & Review | market_discovery | INTERNAL_SITE_07 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 348 | SITE-029 | Scanner Builder & Historical Scanner Replay — What It Is | scanner_builder | INTERNAL_SITE_08 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 349 | SITE-030 | Scanner Builder & Historical Scanner Replay — Why It Matters & When to Use It | scanner_builder | INTERNAL_SITE_08 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 350 | SITE-031 | Scanner Builder & Historical Scanner Replay — Step-by-Step Workflow | scanner_builder | INTERNAL_SITE_08 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 351 | SITE-032 | Scanner Builder & Historical Scanner Replay — Failure Modes & Review | scanner_builder | INTERNAL_SITE_08 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 352 | SITE-033 | Watchlist & Trade-Plan Workbench — What It Is | watchlist_trade_plan | INTERNAL_SITE_09 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 353 | SITE-034 | Watchlist & Trade-Plan Workbench — Why It Matters & When to Use It | watchlist_trade_plan | INTERNAL_SITE_09 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 354 | SITE-035 | Watchlist & Trade-Plan Workbench — Step-by-Step Workflow | watchlist_trade_plan | INTERNAL_SITE_09 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 355 | SITE-036 | Watchlist & Trade-Plan Workbench — Failure Modes & Review | watchlist_trade_plan | INTERNAL_SITE_09 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 356 | SITE-037 | Catalyst & Filing Research Lab — What It Is | catalyst_filings | INTERNAL_SITE_10 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 357 | SITE-038 | Catalyst & Filing Research Lab — Why It Matters & When to Use It | catalyst_filings | INTERNAL_SITE_10 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 358 | SITE-039 | Catalyst & Filing Research Lab — Step-by-Step Workflow | catalyst_filings | INTERNAL_SITE_10 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 359 | SITE-040 | Catalyst & Filing Research Lab — Failure Modes & Review | catalyst_filings | INTERNAL_SITE_10 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 360 | SITE-041 | Float & Supply Lab — What It Is | float_supply | INTERNAL_SITE_11 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 361 | SITE-042 | Float & Supply Lab — Why It Matters & When to Use It | float_supply | INTERNAL_SITE_11 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 362 | SITE-043 | Float & Supply Lab — Step-by-Step Workflow | float_supply | INTERNAL_SITE_11 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 363 | SITE-044 | Float & Supply Lab — Failure Modes & Review | float_supply | INTERNAL_SITE_11 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 364 | SITE-045 | Market Structure Lab — What It Is | market_structure | INTERNAL_SITE_12 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 365 | SITE-046 | Market Structure Lab — Why It Matters & When to Use It | market_structure | INTERNAL_SITE_12 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 366 | SITE-047 | Market Structure Lab — Step-by-Step Workflow | market_structure | INTERNAL_SITE_12 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 367 | SITE-048 | Market Structure Lab — Failure Modes & Review | market_structure | INTERNAL_SITE_12 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 368 | SITE-049 | Multi-Timeframe Synchronizer — What It Is | multi_timeframe | INTERNAL_SITE_13 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 369 | SITE-050 | Multi-Timeframe Synchronizer — Why It Matters & When to Use It | multi_timeframe | INTERNAL_SITE_13 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 370 | SITE-051 | Multi-Timeframe Synchronizer — Step-by-Step Workflow | multi_timeframe | INTERNAL_SITE_13 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 371 | SITE-052 | Multi-Timeframe Synchronizer — Failure Modes & Review | multi_timeframe | INTERNAL_SITE_13 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 372 | SITE-053 | Risk & Position Sizing Laboratory — What It Is | position_sizing | INTERNAL_SITE_14 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 373 | SITE-054 | Risk & Position Sizing Laboratory — Why It Matters & When to Use It | position_sizing | INTERNAL_SITE_14 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 374 | SITE-055 | Risk & Position Sizing Laboratory — Step-by-Step Workflow | position_sizing | INTERNAL_SITE_14 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 375 | SITE-056 | Risk & Position Sizing Laboratory — Failure Modes & Review | position_sizing | INTERNAL_SITE_14 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 376 | SITE-057 | Execution Laboratory — What It Is | execution_lab | INTERNAL_SITE_15 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 377 | SITE-058 | Execution Laboratory — Why It Matters & When to Use It | execution_lab | INTERNAL_SITE_15 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 378 | SITE-059 | Execution Laboratory — Step-by-Step Workflow | execution_lab | INTERNAL_SITE_15 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 379 | SITE-060 | Execution Laboratory — Failure Modes & Review | execution_lab | INTERNAL_SITE_15 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 380 | SITE-061 | Liquidity & Spread Laboratory — What It Is | liquidity_spread | INTERNAL_SITE_16 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 381 | SITE-062 | Liquidity & Spread Laboratory — Why It Matters & When to Use It | liquidity_spread | INTERNAL_SITE_16 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 382 | SITE-063 | Liquidity & Spread Laboratory — Step-by-Step Workflow | liquidity_spread | INTERNAL_SITE_16 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 383 | SITE-064 | Liquidity & Spread Laboratory — Failure Modes & Review | liquidity_spread | INTERNAL_SITE_16 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 384 | SITE-065 | Order Flow & Tape Laboratory — What It Is | orderflow_tape | INTERNAL_SITE_17 | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED; INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 385 | SITE-066 | Order Flow & Tape Laboratory — Why It Matters & When to Use It | orderflow_tape | INTERNAL_SITE_17 | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED; INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 386 | SITE-067 | Order Flow & Tape Laboratory — Step-by-Step Workflow | orderflow_tape | INTERNAL_SITE_17 | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED; INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 387 | SITE-068 | Order Flow & Tape Laboratory — Failure Modes & Review | orderflow_tape | INTERNAL_SITE_17 | LEVEL2_OR_TRADE_PRINT_FEED_RIGHTS_NOT_GRANTED; INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 388 | SITE-069 | Strategy Validation — What It Is | strategy_validation | INTERNAL_SITE_18 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 389 | SITE-070 | Strategy Validation — Why It Matters & When to Use It | strategy_validation | INTERNAL_SITE_18 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 390 | SITE-071 | Strategy Validation — Step-by-Step Workflow | strategy_validation | INTERNAL_SITE_18 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 391 | SITE-072 | Strategy Validation — Failure Modes & Review | strategy_validation | INTERNAL_SITE_18 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 392 | SITE-073 | News & Source Verification — What It Is | source_verification | INTERNAL_SITE_19 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 393 | SITE-074 | News & Source Verification — Why It Matters & When to Use It | source_verification | INTERNAL_SITE_19 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 394 | SITE-075 | News & Source Verification — Step-by-Step Workflow | source_verification | INTERNAL_SITE_19 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 395 | SITE-076 | News & Source Verification — Failure Modes & Review | source_verification | INTERNAL_SITE_19 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 396 | SITE-077 | Corporate Actions & Adjustments — What It Is | corporate_actions | INTERNAL_SITE_20 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 397 | SITE-078 | Corporate Actions & Adjustments — Why It Matters & When to Use It | corporate_actions | INTERNAL_SITE_20 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 398 | SITE-079 | Corporate Actions & Adjustments — Step-by-Step Workflow | corporate_actions | INTERNAL_SITE_20 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 399 | SITE-080 | Corporate Actions & Adjustments — Failure Modes & Review | corporate_actions | INTERNAL_SITE_20 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 400 | SITE-081 | Extended-Hours Context — What It Is | extended_hours | INTERNAL_SITE_21 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 401 | SITE-082 | Extended-Hours Context — Why It Matters & When to Use It | extended_hours | INTERNAL_SITE_21 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 402 | SITE-083 | Extended-Hours Context — Step-by-Step Workflow | extended_hours | INTERNAL_SITE_21 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 403 | SITE-084 | Extended-Hours Context — Failure Modes & Review | extended_hours | INTERNAL_SITE_21 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 404 | SITE-085 | Halts & Limit Up-Limit Down — What It Is | luld_halts | INTERNAL_SITE_22 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 405 | SITE-086 | Halts & Limit Up-Limit Down — Why It Matters & When to Use It | luld_halts | INTERNAL_SITE_22 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 406 | SITE-087 | Halts & Limit Up-Limit Down — Step-by-Step Workflow | luld_halts | INTERNAL_SITE_22 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 407 | SITE-088 | Halts & Limit Up-Limit Down — Failure Modes & Review | luld_halts | INTERNAL_SITE_22 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 408 | SITE-089 | Opening, Closing & Reopening Auctions — What It Is | auctions | INTERNAL_SITE_23 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 409 | SITE-090 | Opening, Closing & Reopening Auctions — Why It Matters & When to Use It | auctions | INTERNAL_SITE_23 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 410 | SITE-091 | Opening, Closing & Reopening Auctions — Step-by-Step Workflow | auctions | INTERNAL_SITE_23 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 411 | SITE-092 | Opening, Closing & Reopening Auctions — Failure Modes & Review | auctions | INTERNAL_SITE_23 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 412 | SITE-093 | Order Types & Execution Control — What It Is | order_types_execution | INTERNAL_SITE_24 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 413 | SITE-094 | Order Types & Execution Control — Why It Matters & When to Use It | order_types_execution | INTERNAL_SITE_24 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 414 | SITE-095 | Order Types & Execution Control — Step-by-Step Workflow | order_types_execution | INTERNAL_SITE_24 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 415 | SITE-096 | Order Types & Execution Control — Failure Modes & Review | order_types_execution | INTERNAL_SITE_24 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 416 | SITE-097 | Trade Review & Analytics — What It Is | trade_review | INTERNAL_SITE_25 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 417 | SITE-098 | Trade Review & Analytics — Why It Matters & When to Use It | trade_review | INTERNAL_SITE_25 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 418 | SITE-099 | Trade Review & Analytics — Step-by-Step Workflow | trade_review | INTERNAL_SITE_25 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |
| 419 | SITE-100 | Trade Review & Analytics — Failure Modes & Review | trade_review | INTERNAL_SITE_25 | INTERNAL_SOURCE_FILE_EXISTS_NOT_GENUINE_AUTHENTICATED_MEMBER_ACCEPTANCE |

## External source index

| Reference ID | Subject | URL | Rights status |
|---|---|---|---|
| CS_LEVELS | Technical support/resistance | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/support-and-resistance | Research citation only; market feed/chart redistribution not approved |
| CS_CANDLES | Candlestick OHLC evidence | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/introduction-to-candlesticks | Research citation only; market feed/chart redistribution not approved |
| TOS_VWAP | Transaction VWAP methodology | https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/V-Z/VWAP | Research citation only; market feed/chart redistribution not approved |
| NYSE_TRADING | NYSE market structure, LULD and sessions | https://www.nyse.com/trade/trading-information | Research citation only; market feed/chart redistribution not approved |
| NYSE_HALTS | NYSE official halts | https://www.nyse.com/trade/trading-halts | Research citation only; market feed/chart redistribution not approved |
| SEC_ORDERS | SEC investor order types | https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders | Research citation only; market feed/chart redistribution not approved |
| SEC_EDGAR | SEC official issuer filings | https://www.sec.gov/search-filings | Research citation only; market feed/chart redistribution not approved |
| SEC_T1 | SEC standard T+1 settlement announcement | https://www.sec.gov/newsroom/press-releases/2024-62 | Research citation only; market feed/chart redistribution not approved |

## Separate acceptance gates

1. **419/419 candidate metadata coverage is not 419/419 editorial approval**. Owners have approved authored content separately; each external claim still requires specific evidence and the source CSV remains `not_accepted`.
2. **75 Tape Labs** must explicitly distinguish trades, quotes, book depth, time-and-sales and market-by-order; no provider feed redistribution or inference of participant identity is authorized.
3. **100 SITE Labs** must pass actual logged-in member browser, two-account isolation, accessibility, storage/reload and privilege/revocation tests against the appropriate version. Source file existence is not production readiness.
4. **GRML historical replay** requires lawful private archive provenance, actual time-zone and tick/quote limitations; default to original fictional material until separately cleared.
5. Protected graded assessments, paid entitlements, LIVE checkout and Lumens remain unchanged and held.

## Measured progress versus release

- **Source-candidate triage coverage across all three waves: 419/419 = 100.0%**. Research inventory only; zero increment to product release acceptance.
- **Shared Learning/Lab feature integration: 16/64 = 25.0%**, source/prototype 58/64 = 90.6%. The denominators are separate: a 419-Lab research record is not one of the 64 tier feature integration acceptances.
- Website overall: no verified current whole-platform completion percentage. A separate 375-item historical planning register may contain estimates, not a present release-ready percentage.

## Revision history

| Version | Date | Scope | Acceptance |
|---|---|---|---|
| 1.0 | 2026-11-03 | 227 canonical row source triage plus internal file checks; closes 419-row research inventory | Source research only; independent claim, market-data rights, genuine member, and release holds remain open |

**Footer:** SMFGU-LABS-WAVE3-227-20261103 · 1.0 · Source-triage completeness only, not publication or LIVE release.
