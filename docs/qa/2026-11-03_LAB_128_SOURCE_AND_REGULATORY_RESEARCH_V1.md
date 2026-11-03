# Learning/Lab — Source-Research Wave 2 (128 Existing Labs)

| Document control | Value |
|---|---|
| Document ID | SMFGU-LELAB-RESEARCH-128-20261103 |
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Version / status | 1.0 / Research candidates only; NOT legal/editorial/member-release accepted |
| Date | 2026-11-03 |
| Filename / type | `docs/qa/2026-11-03_LAB_128_SOURCE_AND_REGULATORY_RESEARCH_V1.md` / Markdown |
| Manifest / tests | `data/lab-128-source-regulatory-research-v1.json` (JSON); `tests/lab-128-topic-source-integrity-v1.test.mjs` (Node ESM) |
| GitHub storage | `Adissel/stock-market-from-the-ground-up-Live` · branch `batch/128-lab-regulatory-topic-source-20261103` |
| Google Drive location | Not created or assigned; do not infer Drive ID |
| Purpose | Source-triage 128 additional canonical Labs, identify legal-method changes and review defects, preserving 419 original Lab IDs |
| Dependencies | Canonical 419-row source candidate CSV, preceding 64-Lab research wave, approved Basic engines, publisher rights restrictions, 30 official competencies |

## Research outcome

Source-topic research completed for 128 *additional* existing canonical Lab IDs, ordinal 65–192 of the controlled 419-row candidate CSV. These comprise **18 subject families**, with **18 unique research reference IDs**, and **24 records requiring flagged investigation**. No existing teaching was modified or accepted from this classification alone. The source-candidate registry still has all 419 mapping statuses unaccepted pending independent claim review.

### Material 2026 compliance discovery

The June 4, 2026 effective date of new FINRA intraday margin standards and the permitted broker transition to October 20, 2027 materially affect Labs DT-C04-L01–L03. **Broker adoption is not uniform during the transition.** These three records must present date-and-firm-specific rules, avoid a universal claim that the old pattern-day-trader $25,000 minimum applies to every broker today, and require licensed regulatory review before publication. Primary information: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/margin> and FINRA <https://syndication.finra.org/content/understanding-new-intraday-margin-requirements>.

Separate risks: original F3-C04/C05 EMA and F3-C06 VWAP titles are uninformative ID placeholders; this is a **candidate CSV metadata defect**, not evidence that the authored lessons are missing. Data-method specifications must distinguish exact transaction-print VWAP from bar-based proxies, as documented in the seven-method research batch. Clinical/FDA event lessons require specific regulator/issuer sources, not a generic EDGAR search.

## Research families

| Family | CSV positions | Labs | Reference IDs | Review limitation |
|---|---|---:|---|---|
| breakout_retests | 65–68 | 4 | CS_LEVELS, CS_CANDLES | Probe, failed breakout, re-entry and reclaim require completed-candle chronology; no trade recommendations. |
| pullbacks_gaps | 69–73 | 5 | CS_LEVELS, CS_CANDLES | Gaps, pullbacks and consolidation are observational; gap-fills cannot be promised. |
| candle_patterns | 74–77 | 4 | CS_CANDLES, CS_LEVELS | Candlestick pattern and first-red-candle recognition require no-lookahead completed bars; later outcome is separate. |
| ema_method | 78–84 | 7 | CS_MA, CS_LEVELS | Original CSV titles are placeholders, not meaningful lesson titles; examine authored Lab body before claim-level acceptance. |
| vwap_method | 85–90 | 6 | TOS_VWAP, TV_VWAP | Original CSV titles are placeholders; exact transaction-print VWAP is not equal to HLC3 bar-volume proxy VWAP. |
| rsi_macd_bands | 91–94 | 4 | CS_RSI, CS_MACD, CS_BB | Momentum/volatility signals are not automatic buy or sell actions; verify original fictional inputs and study seed. |
| intraday_definition_sessions | 95–103 | 9 | NYSE_TRADING, SEC_ORDERS | NYSE core-session examples are not proof of universal brokerage extended-hours access or historical timestamp quality. |
| margin_transition | 104–106 | 3 | SEC_MARGIN, FINRA_INTRADAY, SEC_T1 | Rule 4210 margin changes effective June 4, 2026 with transition through October 20, 2027; broker adoption and house margins vary. Mandatory dated legal/compliance review. |
| risk_and_replay | 107–112 | 6 | SEC_ORDERS, SEC_ORDER_BULLETIN | Separate planned stop distance from attainable fill; no guaranteed stop, live trade, or retroactive lookahead. |
| structure_and_timeframes | 113–118 | 6 | CS_LEVELS, CS_CANDLES | A larger interval cannot reconstruct the internal intrabar sequence. Earlier periods must not use later observations. |
| volume_liquidity | 119–124 | 6 | NYSE_TRADING, SEC_ORDERS | Reported volume alone does not establish displayed depth, fill certainty, liquidity or real-time trade intent. |
| intraday_vwap_levels | 125–130 | 6 | TOS_VWAP, CS_MA, CS_LEVELS | State exact reset anchor, input source and confirmed-bar price; measured levels are not future-price guarantees. |
| gaps_and_halting | 131–139 | 9 | NYSE_TRADING, NYSE_HALTS | LULD halts, opening auction and session behavior depend on venue and dated market rules; no invented real-time examples. |
| stock_candidacy_scanners | 140–151 | 12 | SEC_ORDERS, NYSE_TRADING | Scanner candidates and source timestamps are illustrative only; source price or volume rights must be separately verified. |
| float_filings_research | 152–163 | 12 | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Ticker/issuer identification must resolve CIK, report type, filing date, acceptance time, corporate actions and float scope. |
| offering_and_catalysts | 164–172 | 9 | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Offerings, splits, FDA/clinical events and sector catalysts need event-specific issuer/agency records; generalized EDGAR search is not claim-level support. |
| tape_watchlists_planning | 173–184 | 12 | SEC_EDGAR, NYSE_TRADING | Not all price movement has a verified catalyst; maintain no-trade, source timestamps, private watchlists and original research cases. |
| breakout_pullback_vwap | 185–192 | 8 | CS_LEVELS, TOS_VWAP, CS_CANDLES | A trigger requires completed evidence, with VWAP methodology specified; no forecast or graded assessment inferred. |

## Canonical 128-Lab crosswalk

| Position | Canonical ID | Existing title | Source family | Candidate references | Review flags |
|---:|---|---|---|---|---|
| 65 | F3-C01-L04 | Breakdown, Retest From Below, and Reclaim | breakout_retests | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 66 | F3-C01-L05 | Breakout, Brief Follow-Through, Then Re-Entry | breakout_retests | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 67 | F3-C01-L06 | Failed downside break / rapid reclaim | breakout_retests | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 68 | F3-C01-L07 | Ambiguous repeated interaction / no clean breakout | breakout_retests | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 69 | F3-C02-L01 | Pullback after an early advance | pullbacks_gaps | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 70 | F3-C02-L02 | Consolidation that can be bracketed as a range | pullbacks_gaps | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 71 | F3-C02-L03 | Gap up that completely fills | pullbacks_gaps | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 72 | F3-C02-L04 | Gap down that only partially fills in the observation window | pullbacks_gaps | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 73 | F3-C02-L05 | Gap strength versus actual post-open structure | pullbacks_gaps | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 74 | F3-C03-L01 | Bearish Engulfing configuration and later outcome | candle_patterns | CS_CANDLES, CS_LEVELS | Individual claim review open |
| 75 | F3-C03-L02 | Bullish Engulfing configuration and later outcome | candle_patterns | CS_CANDLES, CS_LEVELS | Individual claim review open |
| 76 | F3-C03-L03 | Exact Doji without a guaranteed reversal | candle_patterns | CS_CANDLES, CS_LEVELS | Individual claim review open |
| 77 | F3-C03-L04 | RCT recognition only — first red 5-minute reference | candle_patterns | CS_CANDLES, CS_LEVELS | Individual claim review open |
| 78 | F3-C04-L01 | F3-C04-L01 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 79 | F3-C04-L02 | F3-C04-L02 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 80 | F3-C04-L03 | F3-C04-L03 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 81 | F3-C05-L01 | F3-C05-L01 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 82 | F3-C05-L02 | F3-C05-L02 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 83 | F3-C05-L03 | F3-C05-L03 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 84 | F3-C05-L04 | F3-C05-L04 | ema_method | CS_MA, CS_LEVELS | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY |
| 85 | F3-C06-L01 | F3-C06-L01 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 86 | F3-C06-L02 | F3-C06-L02 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 87 | F3-C06-L03 | F3-C06-L03 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 88 | F3-C06-L04 | F3-C06-L04 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 89 | F3-C06-L05 | F3-C06-L05 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 90 | F3-C06-L06 | F3-C06-L06 | vwap_method | TOS_VWAP, TV_VWAP | TITLE_IS_CANONICAL_ID_PLACEHOLDER_VERIFY_AUTHORED_LESSON_BODY; VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 91 | F3-C07-L01 | RSI overbought is not a reversal command | rsi_macd_bands | CS_RSI, CS_MACD, CS_BB | Individual claim review open |
| 92 | F3-C07-L02 | RSI oversold is not an automatic buy | rsi_macd_bands | CS_RSI, CS_MACD, CS_BB | Individual claim review open |
| 93 | F3-C07-L03 | MACD lag after a fast price impulse | rsi_macd_bands | CS_RSI, CS_MACD, CS_BB | Individual claim review open |
| 94 | F3-C07-L04 | Momentum whipsaw in a narrow price window | rsi_macd_bands | CS_RSI, CS_MACD, CS_BB | Individual claim review open |
| 95 | DT-C01-L01 | Day Trading: What It Is and What It Is Not — The defining boundary | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 96 | DT-C01-L02 | Day Trading: What It Is and What It Is Not — What day trading demands | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 97 | DT-C01-L03 | Day Trading: What It Is and What It Is Not — What the Day Trader Actually Controls | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 98 | DT-C02-L01 | How a Day Trade Actually Works — From idea to qualified opportunity | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 99 | DT-C02-L02 | How a Day Trade Actually Works — Management begins at entry | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 100 | DT-C02-L03 | How a Day Trade Actually Works — Stage 2 — Build the Thesis in Conditional Language | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 101 | DT-C03-L01 | The Trading Day — Premarket | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 102 | DT-C03-L02 | The Trading Day — Midday | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 103 | DT-C03-L03 | The Trading Day — 9:30-10:00 a.m. ET: Price Discovery and Compression of Decisions | intraday_definition_sessions | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 104 | DT-C04-L01 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Margin accounts and the 2026 transition | margin_transition | SEC_MARGIN, FINRA_INTRADAY, SEC_T1 | FINRA_RULE_4210_2026_TRANSITION_REQUIRES_LICENSED_COMPLIANCE_REVIEW; BROKER_HOUSE_MARGIN_ADOPTION_AND_EFFECTIVE_DATE_REQUIRED |
| 105 | DT-C04-L02 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Buying power and house requirements | margin_transition | SEC_MARGIN, FINRA_INTRADAY, SEC_T1 | FINRA_RULE_4210_2026_TRANSITION_REQUIRES_LICENSED_COMPLIANCE_REVIEW; BROKER_HOUSE_MARGIN_ADOPTION_AND_EFFECTIVE_DATE_REQUIRED |
| 106 | DT-C04-L03 | Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Margin Accounts: Buying Power Is a Credit and Risk Function | margin_transition | SEC_MARGIN, FINRA_INTRADAY, SEC_T1 | FINRA_RULE_4210_2026_TRANSITION_REQUIRES_LICENSED_COMPLIANCE_REVIEW; BROKER_HOUSE_MARGIN_ADOPTION_AND_EFFECTIVE_DATE_REQUIRED |
| 107 | DT-C05-L01 | Risk Comes Before Profit — Risk per trade | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 108 | DT-C05-L02 | Risk Comes Before Profit — Reward does not erase risk | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 109 | DT-C05-L03 | Risk Comes Before Profit — Add Execution Risk to the Model | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 110 | DT-C06-L01 | Building Your Day-Trading Laboratory — Freeze the workspace | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 111 | DT-C06-L02 | Building Your Day-Trading Laboratory — Use progressive reveal | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 112 | DT-C06-L03 | Building Your Day-Trading Laboratory — Set the Historical Clock Before Looking at the Chart | risk_and_replay | SEC_ORDERS, SEC_ORDER_BULLETIN | Individual claim review open |
| 113 | DT-C07-L01 | Intraday Price Action and Market Structure — Higher highs and higher lows | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 114 | DT-C07-L02 | Intraday Price Action and Market Structure — Range and mixed structure | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 115 | DT-C07-L03 | Intraday Price Action and Market Structure — Expansion and Contraction | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 116 | DT-C08-L01 | Using Multiple Timeframes — Higher-timeframe context | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 117 | DT-C08-L02 | Using Multiple Timeframes — One- and three-minute timing | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 118 | DT-C08-L03 | Using Multiple Timeframes — Higher-Timeframe Context Changes the Meaning of the Same Intraday Pattern | structure_and_timeframes | CS_LEVELS, CS_CANDLES | Individual claim review open |
| 119 | DT-C09-L01 | Volume in Day Trading — Absolute and relative volume | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 120 | DT-C09-L02 | Volume in Day Trading — Volume contraction | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 121 | DT-C09-L03 | Volume in Day Trading — What One Volume Bar Actually Represents | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 122 | DT-C10-L01 | Liquidity, Spread, Slippage, and Execution Quality — Recognize & Classify | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 123 | DT-C10-L02 | Liquidity, Spread, Slippage, and Execution Quality — Trade frequency and depth | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 124 | DT-C10-L03 | Liquidity, Spread, Slippage, and Execution Quality — Bid, Ask, Midpoint, and Spread | volume_liquidity | NYSE_TRADING, SEC_ORDERS | Individual claim review open |
| 125 | DT-C11-L01 | VWAP and Moving Averages in Intraday Trading — VWAP as a session reference | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 126 | DT-C11-L02 | VWAP and Moving Averages in Intraday Trading — Reclaim and rejection | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 127 | DT-C11-L03 | VWAP and Moving Averages in Intraday Trading — Session VWAP as an Intraday Reference | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 128 | DT-C12-L01 | The Levels Day Traders Watch — Premarket high and low | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | Individual claim review open |
| 129 | DT-C12-L02 | The Levels Day Traders Watch — High of day and low of day | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | Individual claim review open |
| 130 | DT-C12-L03 | The Levels Day Traders Watch — Premarket High and Low | intraday_vwap_levels | TOS_VWAP, CS_MA, CS_LEVELS | Individual claim review open |
| 131 | DT-C13-L01 | Gaps and the Opening Period — Gap context | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 132 | DT-C13-L02 | Gaps and the Opening Period — Acceptance versus rejection | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 133 | DT-C13-L03 | Gaps and the Opening Period — Why the Opening Auction Matters | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 134 | DT-C14-L01 | Midday, Afternoon, and the Close — Midday compression | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 135 | DT-C14-L02 | Midday, Afternoon, and the Close — Power hour | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 136 | DT-C14-L03 | Midday, Afternoon, and the Close — Afternoon Reactivation | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 137 | DT-C15-L01 | Trading Halts and Abnormal Market Conditions — Halt risk | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 138 | DT-C15-L02 | Trading Halts and Abnormal Market Conditions — Other abnormal conditions | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 139 | DT-C15-L03 | Trading Halts and Abnormal Market Conditions — What Happens to Your Position During a Halt | gaps_and_halting | NYSE_TRADING, NYSE_HALTS | Individual claim review open |
| 140 | DT-C16-L01 | What Makes a Stock Tradable Today? — Movement | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 141 | DT-C16-L02 | What Makes a Stock Tradable Today? — Structure | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 142 | DT-C16-L03 | What Makes a Stock Tradable Today? — Participation: Volume and Trade Count | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 143 | DT-C17-L01 | Why Is the Stock Moving? — Company events | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 144 | DT-C17-L02 | Why Is the Stock Moving? — Technical and unexplained activity | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 145 | DT-C17-L03 | Why Is the Stock Moving? — Market and Sector Catalysts | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 146 | DT-C18-L01 | Building the Discovery Universe and Using Scanners Correctly — Start With an Eligible Universe | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 147 | DT-C18-L02 | Building the Discovery Universe and Using Scanners Correctly — Timestamp Every Scan | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 148 | DT-C18-L03 | Building the Discovery Universe and Using Scanners Correctly — Empty Results Are Information | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 149 | DT-C19-L01 | Measuring Price, Gap, Volume, Dollar Volume, and Relative Volume — Percentage Change | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 150 | DT-C19-L02 | Measuring Price, Gap, Volume, Dollar Volume, and Relative Volume — Share Volume | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 151 | DT-C19-L03 | Measuring Price, Gap, Volume, Dollar Volume, and Relative Volume — Range and Volatility | stock_candidacy_scanners | SEC_ORDERS, NYSE_TRADING | Individual claim review open |
| 152 | DT-C20-L01 | Float, Market Capitalization, Shares Outstanding, and Security Type — Security Type Comes First | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 153 | DT-C20-L02 | Float, Market Capitalization, Shares Outstanding, and Security Type — Decision Gate | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 154 | DT-C20-L03 | Float, Market Capitalization, Shares Outstanding, and Security Type — Key Statistics Panel: Fast Context, Not a Setup | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 155 | DT-C21-L01 | How to Find the Catalyst — Begin With the Price-Move Timeline | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 156 | DT-C21-L02 | How to Find the Catalyst — Check SEC EDGAR | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 157 | DT-C21-L03 | How to Find the Catalyst — Search by Ticker, Company Name, and Key Phrase | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 158 | DT-C22-L01 | Verifying Catalysts, Timestamps, and Source Quality — Build a Source Hierarchy | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 159 | DT-C22-L02 | Verifying Catalysts, Timestamps, and Source Quality — Acceptance Time and Filing Time | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 160 | DT-C22-L03 | Verifying Catalysts, Timestamps, and Source Quality — Resolve Conflicts Explicitly | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 161 | DT-C23-L01 | SEC Filings for Day Traders — EDGAR Is a Primary Research Tool | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 162 | DT-C23-L02 | SEC Filings for Day Traders — Forms 10-Q and 10-K | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 163 | DT-C23-L03 | SEC Filings for Day Traders — Ownership and Insider Forms | float_filings_research | SEC_STOCKS, SEC_EDGAR, SEC_EDGAR_GUIDE | Individual claim review open |
| 164 | DT-C24-L01 | Offerings, ATM Programs, Warrants, Convertibles, and Dilution Risk — Public and Registered Direct Offerings | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 165 | DT-C24-L02 | Offerings, ATM Programs, Warrants, Convertibles, and Dilution Risk — Decision Gate | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 166 | DT-C24-L03 | Offerings, ATM Programs, Warrants, Convertibles, and Dilution Risk — Reverse Splits and Share Authorization | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 167 | DT-C25-L01 | Earnings, FDA Events, Contracts, Mergers, and Other Catalyst Families — Earnings and Guidance | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | AGENCY_EVENT_SPECIFIC_EVIDENCE_NOT_IN_EDGAR_GENERIC_SOURCE |
| 168 | DT-C25-L02 | Earnings, FDA Events, Contracts, Mergers, and Other Catalyst Families — Clinical-Trial Results | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | AGENCY_EVENT_SPECIFIC_EVIDENCE_NOT_IN_EDGAR_GENERIC_SOURCE |
| 169 | DT-C25-L03 | Earnings, FDA Events, Contracts, Mergers, and Other Catalyst Families — Corporate Actions | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | AGENCY_EVENT_SPECIFIC_EVIDENCE_NOT_IN_EDGAR_GENERIC_SOURCE |
| 170 | DT-C26-L01 | Sector, Sympathy, Macro, and Cross-Market Catalysts — Company-Specific Versus Group Movement | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 171 | DT-C26-L02 | Sector, Sympathy, Macro, and Cross-Market Catalysts — Leader and Follower | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 172 | DT-C26-L03 | Sector, Sympathy, Macro, and Cross-Market Catalysts — ETF and Index Context | offering_and_catalysts | SEC_EDGAR, SEC_EDGAR_GUIDE, SEC_STOCKS | Individual claim review open |
| 173 | DT-C27-L01 | Unexplained Order Flow and Technical Runners — Exhaust the Basic Catalyst Search First | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 174 | DT-C27-L02 | Unexplained Order Flow and Technical Runners — Technical Runner Versus Illiquidity | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 175 | DT-C27-L03 | Unexplained Order Flow and Technical Runners — Re-Ignition Without New News | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 176 | DT-C28-L01 | Building a Day-Trading Watchlist — Candidate quality | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 177 | DT-C28-L02 | Building a Day-Trading Watchlist — Ranking and re-ranking | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 178 | DT-C28-L03 | Building a Day-Trading Watchlist — Required Watchlist Fields | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 179 | DT-C29-L01 | Ranking the Watchlist and Building the Premarket Plan — Build the Candidate Record | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 180 | DT-C29-L02 | Ranking the Watchlist and Building the Premarket Plan — Separate Research Priority From Entry Priority | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 181 | DT-C29-L03 | Ranking the Watchlist and Building the Premarket Plan — Version the Watchlist | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 182 | DT-C30-L01 | What a Day-Trading Setup Actually Is — Six Components of a Setup | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 183 | DT-C30-L02 | What a Day-Trading Setup Actually Is — Trigger Is Not Prediction | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 184 | DT-C30-L03 | What a Day-Trading Setup Actually Is — Setup Quality Is Multidimensional | tape_watchlists_planning | SEC_EDGAR, NYSE_TRADING | Individual claim review open |
| 185 | DT-C31-L01 | Breakouts, High-of-Day Breaks, and Premarket-High Breaks — Define the Level Before the Break | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 186 | DT-C31-L02 | Breakouts, High-of-Day Breaks, and Premarket-High Breaks — Probe Versus Acceptance | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 187 | DT-C31-L03 | Breakouts, High-of-Day Breaks, and Premarket-High Breaks — Volume at the Break | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 188 | DT-C32-L01 | Pullbacks and Higher-Low Continuation — Impulse and Pullback | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 189 | DT-C32-L02 | Pullbacks and Higher-Low Continuation — Higher Low Is Confirmed, Not Imagined | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 190 | DT-C32-L03 | Pullbacks and Higher-Low Continuation — Trigger Choices | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | Individual claim review open |
| 191 | DT-C33-L01 | VWAP Holds, Reclaims, Rejections, and Failures — Recognize & Classify | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |
| 192 | DT-C33-L02 | VWAP Holds, Reclaims, Rejections, and Failures — VWAP Rejection | breakout_pullback_vwap | CS_LEVELS, TOS_VWAP, CS_CANDLES | VWAP_TRANSACTION_VERSUS_BAR_PROXY_CONVENTION_MUST_BE_DECLARED |

## Reference index (research only; no republication rights)

| ID | Reference | Organization/source type | URL |
|---|---|---|---|
| CS_LEVELS | Technical support and resistance | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/support-and-resistance |
| CS_CANDLES | Candlestick formation and limitation | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/introduction-to-candlesticks |
| CS_MA | SMA-seeded moving averages | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential |
| CS_RSI | Wilder relative strength index | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi |
| CS_MACD | MACD warmup, line and signal | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/macd-moving-average-convergence-divergence-oscillator |
| CS_BB | Bollinger bands, SMA and deviation | Technical methodology | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/bollinger-bands |
| TOS_VWAP | Transaction-weighted VWAP | Provider technical reference | https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/V-Z/VWAP |
| TV_VWAP | Bar-source VWAP proxy variants | Provider technical reference | https://www.tradingview.com/support/solutions/43000502018-volume-weighted-average-price-vwap/ |
| SEC_ORDERS | Types of orders and execution-price uncertainty | SEC investor education | https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders |
| SEC_ORDER_BULLETIN | Orders, stops and broker differences | SEC investor bulletin | https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14 |
| SEC_MARGIN | SEC bulletin: 2026 margin transition and firm differences | SEC investor bulletin | https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/margin |
| FINRA_INTRADAY | FINRA: new intraday margin risk standards and transition | FINRA investor education | https://syndication.finra.org/content/understanding-new-intraday-margin-requirements |
| SEC_T1 | SEC: settlement transitioned to T+1 on May 28, 2024 | SEC public announcement | https://www.sec.gov/newsroom/press-releases/2024-62 |
| NYSE_TRADING | NYSE: trading sessions, volatility safeguards and auction | Exchange primary reference | https://www.nyse.com/trade/trading-information |
| NYSE_HALTS | NYSE: trading halt classifications and time labels | Exchange primary reference | https://www.nyse.com/trade/trading-halts |
| SEC_EDGAR | SEC EDGAR company and filing search | SEC primary reference | https://www.sec.gov/search-filings |
| SEC_EDGAR_GUIDE | Investor.gov: researching 10-K, 10-Q, 8-K | SEC investor education | https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments |
| SEC_STOCKS | SEC Investor.gov: stock ownership and market capitalization concepts | SEC investor education | https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks |

## Required QA and publication boundaries

All 128 items require independent claim-level editorial review and original lesson examples. Rights to copy, train on, ingest or republish external charts, proprietary feeds, books, videos and API results are **not** assumed. No transaction instructions, investor-specific recommendations, graded awards, live market-data redistribution, entitlement changes, or billing actions result from this research batch.

The automated tests check identity, CSV exact matching, distinct sources and 2026 transition flags. They **cannot** establish all external pages are valid indefinitely, individual lesson correctness, real-member accessibility, legal compliance or production launch acceptance.

### Percentage reporting

- Shared Learning/Lab integrated completion stays **16/64 = 25.0%**; 58/64 = **90.6%** source/prototype coverage. These are an *eight-edition 64-item product-feature ledger*, not 419 individually accepted Lab source mappings.
- Source research-triage inventory after Waves 1 and 2 covers **192/419 = 45.8%** of original Lab source-candidate *metadata*, not approved lessons or overall platform completion. The full website has no validated release-ready completion percentage.

## Revision history

| Version | Date | Change | Authority |
|---|---|---|---|
| 1.0 | 2026-11-03 | Added 128 Lab source candidates, 18 family controls, FINRA 2026 transition and source-rights flags | Internal research triage; independent acceptance pending |

**Footer:** SMFGU-LELAB-RESEARCH-128-20261103 · v1.0 · Research only · Publication and rights holds active.
