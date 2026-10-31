# First-42 Academy — Primary-Source Order Execution Verification (Batch Two)

**Document ID:** SMFGU-ACADEMY-REG-EVIDENCE-005  
**Project:** The Stock Market: From the Ground Up / Academy B01 and 42-Day Program  
**Version:** 1.0  
**Status:** AI evidence-checked narrow assertions, NOT whole-day or independently human-approved  
**Source reviewed:** October 31, 2026  
**Reviewer:** GPT-6 — AI working editorial reviewer appointed by Owner; no human editor signature  
**GitHub location:** `main/docs/research/stockstotrade/ACADEMY_FIRST42_ORDER_EXECUTION_PRIMARY_SOURCE_CHECK_2026-10-31.md`  
**File type:** Markdown  
**Google Drive location and ID:** Not created / not assigned  
**Dependencies:** `ACADEMY_FIRST42_NARROW_CLAIM_EVIDENCE_2026-10-31.csv`, `252_instruction_source_field_QA_v2.csv`, `MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv`, current 945-statement CI evidence  
**Purpose:** Verify a bounded set of order-execution claims using primary SEC education materials and preserve residual limitations.

## Current authority

1. [SEC Office of Investor Education and Assistance — Understanding Order Types](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14), updated **August 18, 2026**. States that a market order's execution price may deviate from a last-sale price/quotation; large market orders may fill in separate portions at different prices; a limit order may remain unfilled.
2. [SEC Office of Investor Education and Assistance — Stop, Stop-Limit and Trailing Stop Orders](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15), updated **August 18, 2026**. States that a triggered stop order becomes a market order, and the stop trigger does not assure the execution price.
3. [SEC — Webmaster Frequently Asked Questions](https://www.sec.gov/about/webmaster-frequently-asked-questions), accessed October 31, 2026. EDGAR system acceptance time may precede document availability on sec.gov; typical stated 1–3 minute delays are not guaranteed and can increase under load.

**Important scope:** SEC investor bulletins are educational staff materials, not a new legally binding SEC rule. These source documents do not demonstrate specific issuer histories, actual broker fills, or the validity of a synthetic price tape.

## Targeted individually assessed day/claim matches

| Day | Narrow question researched | Finding | Necessary limitation |
|---|---|---|---|
| `truth5:3` | Does EDGAR acceptance necessarily coincide with public website availability? | **SUPPORTED: NO**, EDGAR acceptance may precede sec.gov publication | Do not assert a guaranteed delay, or that a fictional trader saw the filing at acceptance time |
| `watchlist7:2` | Is observed last sale/volume enough to guarantee a later trade's executable price/size? | **SUPPORTED: NO** | Quote or last trade alone cannot fix the marketable price available to a later order |
| `watchlist7:5` | Can a bid–ask snapshot guarantee a broker's execution at the displayed level? | **SUPPORTED: NO** | Broker order type, routing, queue, liquidity and quote freshness matter |
| `scanners10:6` | Does a displayed best offer guarantee a larger marketable buy is fully filled at that price? | **SUPPORTED: NO** | Insufficient display size can result in multi-price partial executions |
| `scanners10:8` | Does a stale last-sale observation establish the current executable quote? | **SUPPORTED: NO** | Current quotation and available market liquidity must be independently checked |
| `foundations30:6` | May a displayed quote or depth later yield a different actual fill? | **SUPPORTED: YES** | Even contemporaneous depth need not survive until routing or execution |
| `foundations30:10` | Is a stop price a guaranteed exit price after trigger? | **SUPPORTED: NO** | A triggered stop-market can execute farther from stop; stop-limit constrains price but risks no execution |
| `foundations30:12` | Does a historical tape print alone prove a particular learner's hypothetical fill? | **SUPPORTED: NO** | A trade between others is not the learner's confirmed routed/executed order |

These are **eight individual narrow propositions** supported by the cited topical primary-source materials. This does not mark the other assertions in these days verified; nor does it constitute a new broker execution compliance determination. If an entire sentence mixes multiple assertions, separate review/limitations are still needed.

## Acceptance disposition

**Narrow authority matches newly recorded:** 8.  
**Previous distinct narrow regulatory authority matches:** 4 (separate companion `ACADEMY_FIRST42_REGULATORY_PRIMARY_SOURCE_CHECK_2026-10-31.md`).  
**Total separately documented narrow matches across those two check memos:** 12. This total is *not* 12/945 independently accepted statements; matching an authority at the concept/day level is not a full claim-location review.

**Unresolved:** individual claim-level evidence disposition for the remaining source-current 945-location audit; 42 day acceptances; 20 private set reviews, all 120 private questions and 200 feedback explanations; actual beta member signoffs; native browser and protected grading acceptance.

**Master register updates:** NONE. Both controlling files retain existing NOT_ACCEPTED / NOT_APPROVED decisions. **Official grading:** HOLD.

## Revision history

| Version | Date | Description | Approval |
|---|---|---|---|
| 1.0 | 2026-10-31 | Added eight narrow primary-source verifications for EDGAR publication timing, order execution, quote freshness, fills and stop orders | AI evidence finding; independent human review not performed |

**Footer:** Crown & Lantern Press / Cyber Nexus — Educational source audit, not brokerage advice, legal opinion, or formal individual editorial certification.
