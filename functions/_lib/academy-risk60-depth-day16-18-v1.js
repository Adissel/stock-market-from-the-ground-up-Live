/* Original canonical Risk60 D16–D18; no-lookahead source timing,
 * submitted-order attempt limits and versioned watchlist evidence.
 * Original fictional cases, ungraded; no protected answers or real trades.
 */
export const risk60DepthDay16to18V1=Object.freeze({
 "16": {
  "sourceDay": 24,
  "formativeQuestions": [
   {
    "id": "risk60-D16-Q01",
    "prompt": "What does an issuer filing's reported fiscal period end establish about its public release time?",
    "review": "A reporting-period end marks the accounting interval; it is not necessarily the SEC acceptance, public publication, or trainee retrieval timestamp."
   },
   {
    "id": "risk60-D16-Q02",
    "prompt": "A social-media post appears at 08:13 ET; its issuer document becomes accessible at 08:20. May an 08:15 decision cite that later issuer document?",
    "review": "No. At 08:15 the particular 08:20 document is outside the available information set and cannot retroactively substantiate the earlier decision."
   },
   {
    "id": "risk60-D16-Q03",
    "prompt": "How many minutes separate a fictional 08:13 post and an 08:20 accessible filing?",
    "review": "08:20 minus 08:13 equals seven minutes; the post precedes the documented original filing availability by seven minutes."
   },
   {
    "id": "risk60-D16-Q04",
    "prompt": "The 08:20 issuer filing calls financing proposed, while the 08:13 post says completed. What is supported at the later cutoff?",
    "review": "The dated primary document supports a proposed financing at 08:20, not a consummated financing or evidence of received proceeds."
   },
   {
    "id": "risk60-D16-Q05",
    "prompt": "What two identifier types distinguish a legal filer from a specific EDGAR submission?",
    "review": "The central index key identifies the legal filer, while the accession identifies the specific submission; verify both and the form type."
   },
   {
    "id": "risk60-D16-Q06",
    "prompt": "Does a future amended filing prove a transaction closed at the original headline time?",
    "review": "No. Later amendments are separate chronological evidence and cannot automatically convert an earlier proposal into a previously completed deal."
   },
   {
    "id": "risk60-D16-Q07",
    "prompt": "Why must source retrieval time be recorded separately from public acceptance time?",
    "review": "A filing could be accepted before the learner actually retrieved it; a decision-time audit must establish what was available and observed."
   },
   {
    "id": "risk60-D16-Q08",
    "prompt": "What may a current price quote establish about whether contractual funding was received?",
    "review": "A stock quote observes price interest at a time; it is not documentary proof of financing close, payment receipt, or accounting recognition."
   },
   {
    "id": "risk60-D16-Q09",
    "prompt": "An exhibit includes conditions precedent. May the transaction amount be treated as unconditional cash immediately?",
    "review": "No. Conditions precedent must be verified as satisfied before drawing claims about closing or cash availability."
   },
   {
    "id": "risk60-D16-Q10",
    "prompt": "A research note was frozen at 09:12; an original filing first appears at 09:18. May the later exhibit enter the frozen note?",
    "review": "No. Keep the 09:12 answer unchanged and record a separately dated update after verified 09:18 access."
   },
   {
    "id": "risk60-D16-Q11",
    "prompt": "What must a comparable filing transfer case change to demonstrate independent document-reading skill?",
    "review": "Use a different fictional issuer, accession, filing date and terms, while preserving the same verification procedure and evidence cutoff."
   },
   {
    "id": "risk60-D16-Q12",
    "prompt": "Transfer: a filing first becomes accessible at 11:05 after an initial 10:58 rumor. What is defensible at 11:00?",
    "review": "The 11:00 record may describe an unverified rumor but cannot cite the later 11:05 filing; a new assessment can use it afterward."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D16-A01",
    "scenario": "At 08:13 ET a fictional market post claims a $6 million financing has closed. The issuer's first primary document becomes accessible at 08:20 and calls the financing proposed, subject to approval.",
    "task": "Compute the seven-minute chronology, classify what could be known at 08:15 and 08:25, and separate proposed terms from verified closing and receipt.",
    "worked": "The filing trails the post by seven minutes (08:20−08:13). At 08:15 only the unverified secondary claim is documented; the later source is unavailable. At 08:25 the issuer's proposed financing may be cited, but completed issuance and $6 million cash receipt remain unproven.",
    "pitfall": "Backdating the primary filing or equating proposed consideration with settled financing fabricates source availability and accounting outcomes.",
    "transfer": "At a different 09:10 headline followed by an original 09:18 disclosure, document exactly what a 09:12 independent decision can and cannot substantiate."
   }
  ]
 },
 "17": {
  "sourceDay": 25,
  "formativeQuestions": [
   {
    "id": "risk60-D17-Q01",
    "prompt": "A fictional plan permits at most three submitted order attempts per session. Three attempts have occurred. Is a fourth authorized?",
    "review": "No. If the frozen rule counts submitted attempts, a fourth violates the maximum regardless of any later price pattern or outcome."
   },
   {
    "id": "risk60-D17-Q02",
    "prompt": "Why should the definition of an order attempt be written before trading starts?",
    "review": "The record must specify whether submitted, canceled, partially filled, rejected and replaced orders count to avoid changing the denominator afterward."
   },
   {
    "id": "risk60-D17-Q03",
    "prompt": "Under a rule counting submitted orders, does a submitted-and-canceled order consume one attempt?",
    "review": "Yes. A cancellation does not erase that a submission occurred when the precommitted policy counts every submitted attempt."
   },
   {
    "id": "risk60-D17-Q04",
    "prompt": "A two-attempt policy has one submitted-canceled order and one filled order. Is a third submission permitted?",
    "review": "No. Both orders consumed attempts under the defined submission-based rule; a third would exceed two."
   },
   {
    "id": "risk60-D17-Q05",
    "prompt": "An attractive breakout occurs after the third submitted attempt. May a favorable next candle override the limit?",
    "review": "No. Subsequent opportunity or hypothetical profitability cannot waive a precommitted session risk control after the fact."
   },
   {
    "id": "risk60-D17-Q06",
    "prompt": "How many remaining attempts are available under a three-attempt rule after two eligible submissions?",
    "review": "Three minus two equals one remaining permitted attempt, assuming there are no separate stricter platform restrictions."
   },
   {
    "id": "risk60-D17-Q07",
    "prompt": "How should a rejected order be classified when policy says every submitted instruction counts?",
    "review": "Retain it as a submitted attempt and separately label its rejection; the policy definition controls counting even if no shares traded."
   },
   {
    "id": "risk60-D17-Q08",
    "prompt": "Why is an attempt counter not identical to the count of confirmed fills?",
    "review": "One submitted attempt may be rejected, canceled or partially filled, while a fill is an independently confirmed execution event."
   },
   {
    "id": "risk60-D17-Q09",
    "prompt": "Can a winning fictional trade reset a session attempt counter to zero?",
    "review": "No. Outcome does not alter the predetermined attempt count unless an authorized rule written before the session explicitly specifies a reset."
   },
   {
    "id": "risk60-D17-Q10",
    "prompt": "What independent risk condition can bar a trade even if attempts remain?",
    "review": "A stale quote, unverified issuer source, breach of risk budget or trading halt can independently veto an otherwise available attempt."
   },
   {
    "id": "risk60-D17-Q11",
    "prompt": "How should a trainee record an opportunity ignored after the attempt cap is exhausted?",
    "review": "Log a nontrading observation with its timestamp and process reason, not an invented filled order or hypothetical mastered result."
   },
   {
    "id": "risk60-D17-Q12",
    "prompt": "Transfer: a two-attempt rule includes one canceled and one executed submission. What must a trainee do at a third setup?",
    "review": "Record NO TRADE because two qualifying submissions already occurred, preserving both attempts and the original rule definition."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D17-A01",
    "scenario": "A fictional session policy allows at most three submitted order attempts. At 09:35 an order is rejected, at 10:00 another is canceled and at 10:40 a third is filled. An attractive fourth setup appears at 11:00.",
    "task": "Apply the frozen definition that all submitted attempts count, classify three different statuses, and determine whether the fourth order may be placed.",
    "worked": "Submitted count is 1 rejected+1 canceled+1 filled=3 of 3 allowed. No submissions remain. At 11:00 the correct process response is NO TRADE, regardless of later favorable movement or the absence of execution in the first two attempts.",
    "pitfall": "Counting only successful fills, or changing what qualifies as an attempt after seeing a breakout, defeats the originally defined session limit.",
    "transfer": "For a separate two-attempt plan with one submitted cancellation and one executed order, decide whether a third new order is allowed and explain why."
   }
  ]
 },
 "18": {
  "sourceDay": 26,
  "formativeQuestions": [
   {
    "id": "risk60-D18-Q01",
    "prompt": "A fictional watchlist entry is verified against issuer news at 09:00. Is it an automatic market-buy instruction?",
    "review": "No. A watchlist stores a dated candidate research state and next verification conditions, not standing authorization for live execution."
   },
   {
    "id": "risk60-D18-Q02",
    "prompt": "An amendment at 10:15 contradicts the 09:00 catalyst thesis. What should happen to the existing entry?",
    "review": "Preserve the earlier research snapshot and create a new dated status version reflecting the contradictory primary evidence."
   },
   {
    "id": "risk60-D18-Q03",
    "prompt": "How much time separates a 09:00 research snapshot and a 10:15 amendment?",
    "review": "Ten fifteen minus nine o'clock is one hour fifteen minutes, or 75 minutes of elapsed time between the stated observations."
   },
   {
    "id": "risk60-D18-Q04",
    "prompt": "A five-minute quote-freshness policy sees a twenty-minute-old quote. May the watchlist candidate be treated as execution-ready?",
    "review": "No. The quote is four times the maximum allowed age, so it fails the separate freshness condition until a new quote arrives."
   },
   {
    "id": "risk60-D18-Q05",
    "prompt": "What identifiers should a watchlist verification record keep for issuer evidence?",
    "review": "Retain legal issuer identity, the original filing or issuer URL, source publication and retrieval times, and any later amended source links."
   },
   {
    "id": "risk60-D18-Q06",
    "prompt": "A candidate becomes ineligible after contradictory evidence. Can the 09:00 eligible state simply be erased?",
    "review": "No. Revision history must preserve the original 09:00 observation and document the later reason for ineligibility."
   },
   {
    "id": "risk60-D18-Q07",
    "prompt": "What differs between a candidate watchlist status and a verified trading entry decision?",
    "review": "The watchlist maintains conditional research eligibility, whereas entry additionally needs current execution quotes, risk limits, source evidence and order instructions."
   },
   {
    "id": "risk60-D18-Q08",
    "prompt": "Does an unverified rumor automatically restore a candidate removed by a primary-source amendment?",
    "review": "No. A rumor cannot override a dated original issuer correction without independent evidence and re-verification."
   },
   {
    "id": "risk60-D18-Q09",
    "prompt": "Why should changing a watchlist status include a review trigger?",
    "review": "A specific event, issuer publication or time deadline makes the next review auditable rather than indefinite or arbitrary."
   },
   {
    "id": "risk60-D18-Q10",
    "prompt": "If no valid current bid and offer are available, which status is consistent with a trade-readiness gate?",
    "review": "Set the candidate to research-only or WAIT; missing executable quote evidence precludes claiming an immediate tradable opportunity."
   },
   {
    "id": "risk60-D18-Q11",
    "prompt": "May a later positive price trend be inserted into the earlier 09:00 research record as information already known?",
    "review": "No. Price observations after the cutoff belong to subsequent research versions rather than rewriting the earlier evidence set."
   },
   {
    "id": "risk60-D18-Q12",
    "prompt": "Transfer: an issuer approval expires while social posts claim renewal without a primary filing. How should the watchlist be handled?",
    "review": "Keep the expired status documented, require an original renewed approval or filing, and withhold eligibility until that evidence is verified."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D18-A01",
    "scenario": "A fictional ticker is entered on a research watchlist at 09:00 on an issuer announcement. At 10:15 an amended filing contradicts the catalyst, and the most recent executable quote is twenty minutes old under a five-minute freshness gate.",
    "task": "Calculate the age and source-version interval, preserve the historical snapshot, apply both source and quote vetoes and specify a re-verification trigger.",
    "worked": "The later filing follows initial verification by 75 minutes. The twenty-minute-old quote exceeds the five-minute limit by fifteen minutes. Archive the 09:00 hypothesis unchanged, record a 10:15 ineligible/review state with the amended source, and choose WAIT; neither the old quote nor prior headline authorizes execution.",
    "pitfall": "Silently rewriting a frozen watchlist version and treating an old quote as live proof of liquidity destroys both provenance and process acceptance.",
    "transfer": "For a different symbol with an expired approval and a later unverified renewal rumor, construct a dated removal and primary-source re-entry criterion."
   }
  ]
 }
});
