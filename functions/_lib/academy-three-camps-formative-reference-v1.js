/* Hand-authored formative benchmark for first days of each NEW Boot Camp.
 * Not private official exam questions, score keys, or competency evidence.
 * The other 24 days are explicitly NOT certified to the 12-question floor.
 */
const bank={
 "tape10": [
  {
   "prompt": "At 09:31:00 a fictional stock shows $10.00 bid and $10.04 offer. In plain language, which side expresses displayed buying interest?",
   "review": "The bid represents displayed buying interest at $10.00, not a completed purchase."
  },
  {
   "prompt": "Calculate this fictional quote's per-share spread; identify the units and arithmetic.",
   "review": "$10.04 minus $10.00 equals $0.04 per share at the quoted instant."
  },
  {
   "prompt": "Calculate the midpoint of the $10.00/$10.04 quote and explain whether it is a guaranteed fill price.",
   "review": "The midpoint is ($10.00 + $10.04)/2 = $10.02 per share. It is a reference, not a promise of execution."
  },
  {
   "prompt": "A print at $10.03 is time-stamped two seconds after the quote. What exactly has been observed?",
   "review": "An execution at $10.03 occurred at the reported trade time. The quote is earlier; the print alone does not identify its initiator."
  },
  {
   "prompt": "Would a $10.03 print establish that the $10.04 displayed offer executed? Identify a missing fact.",
   "review": "No. The prices differ and timing, venue, order conditions, and quote continuity are not established."
  },
  {
   "prompt": "Name two time fields needed before matching an exchange print to a displayed bid/ask snapshot.",
   "review": "Collect source/reporting timestamps and quote/trade event timestamps, including the relevant feed latency or delay."
  },
  {
   "prompt": "If a different venue reports an offer of $10.02 at the same instant, can the first venue's $10.04 be called the national best offer?",
   "review": "No. A contemporaneous eligible $10.02 offer may improve the national inside, but eligibility and coverage must be verified."
  },
  {
   "prompt": "A five-second-old bid remains displayed during a fast move. State a risk of treating it as currently executable.",
   "review": "Quotes can change or cancel; latency makes the old quote unreliable as a fill assumption."
  },
  {
   "prompt": "Suppose the fictional bid becomes $9.98 while the ask stays $10.04. Recalculate spread and identify what changed.",
   "review": "The displayed spread becomes $0.06 per share; the bid moved down by $0.02 while the offer did not move."
  },
  {
   "prompt": "A platform colors the $10.03 trade green despite no synchronized $10.03 offer. What inference should you withhold?",
   "review": "Do not assert a buyer-initiated or ask-side trade from color alone; demand contemporaneous quote rules and timestamp scope."
  },
  {
   "prompt": "List two explanations for why trade and quote timestamps can disagree without anyone acting deceptively.",
   "review": "Different venue feeds, aggregation, reporting/processing delays, and quote changes can explain mismatches."
  },
  {
   "prompt": "Write a no-trade or no-conclusion rule for a snapshot with stale quotes, missing venues, or ambiguous prints.",
   "review": "Withhold an execution inference or trade until timestamp alignment, venue scope, and relevant risk controls are verified."
  }
 ],
 "indicators10": [
  {
   "prompt": "A moving-average input is called 'price.' What must be specified before reproducing its value?",
   "review": "Specify whether price is a trade, completed close, or bar-derived value and the instrument, timestamp, and data source."
  },
  {
   "prompt": "Compute the simple mean of two fictional completed closes, $10.00 and $11.00, with units.",
   "review": "($10.00 + $11.00)/2 = $10.50 per share; this is a two-value simple mean."
  },
  {
   "prompt": "Does the $10.50 result predict a third close? Explain the time cutoff.",
   "review": "No. It describes two observed closes; a future close is unknown at the cutoff."
  },
  {
   "prompt": "An EMA marked '9' appears on a one-minute and a daily chart. Are the data windows interchangeable?",
   "review": "No. Both may use a period parameter of nine, but their inputs and horizons are entirely different."
  },
  {
   "prompt": "Why can a moving average change while an intrabar candle is still forming?",
   "review": "The current incomplete bar value changes; the calculation is provisional until that bar is complete unless the method explicitly includes live updates."
  },
  {
   "prompt": "Name the numerator and denominator of a trade-based VWAP and their units.",
   "review": "Cumulative price-times-shares yields dollars in the numerator; cumulative shares are the denominator; the quotient is dollars/share."
  },
  {
   "prompt": "Compute fictional dollar turnover for 100 shares at $10 and 300 shares at $11.",
   "review": "$1,000 + $3,300 = $4,300 across those two trades."
  },
  {
   "prompt": "Calculate VWAP for the same two trades and explain why it differs from the simple price mean.",
   "review": "$4,300 / 400 shares = $10.75 per share. The $11 trade has greater volume weight; simple mean is $10.50."
  },
  {
   "prompt": "If the $11 trade is absent at a 09:30 decision pause, what is the only VWAP supported by the earlier $10 trade?",
   "review": "$10.00 per share for the defined observed population; later $11 data must not leak backward."
  },
  {
   "prompt": "A trader combines regular-session data with extended-hours trades but labels the result regular-session VWAP. What is wrong?",
   "review": "The data population does not match the declared session; recompute with the correct boundary or relabel explicitly."
  },
  {
   "prompt": "Name two decisions that cannot be justified solely because price is above a smoothing line.",
   "review": "You cannot infer a guaranteed rise or a guaranteed achievable execution; trend, liquidity, time and risk require separate evidence."
  },
  {
   "prompt": "Formulate a no-trade rule for indicator screenshots lacking bar interval, feed source, and session settings.",
   "review": "Withhold a signal-based trade until interval, input convention, completeness, session scope and execution constraints are checked."
  }
 ],
 "filings7": [
  {
   "prompt": "In EDGAR, what does a CIK identify, and why does it matter for similarly named issuers?",
   "review": "A CIK identifies the filer. It helps distinguish legal registrants with similar public-facing names."
  },
  {
   "prompt": "For a filing with a June 30 reporting-period end and August 8 acceptance, which date describes the financial reporting window?",
   "review": "June 30 is the period end. August 8 is the separately recorded acceptance date."
  },
  {
   "prompt": "A screenshot shows an 8-K headline but no accession. Which identity field would you retrieve before quoting it?",
   "review": "Retrieve the actual issuer/filer CIK and accession number, plus the filing URL, form, and relevant item/exhibit."
  },
  {
   "prompt": "Is the SEC acceptance timestamp necessarily the time a particular learner first obtained the filing?",
   "review": "No. Record retrieval time separately; any dissemination and access delays matter to a decision cutoff."
  },
  {
   "prompt": "Which original evidence would you inspect to verify a report described as a 10-Q?",
   "review": "Open the SEC submission record, confirm filer/CIK and form, and inspect filing metadata and the primary document."
  },
  {
   "prompt": "A search result lists two companies called Harbor Works. How do you prevent mistaken issuer attribution?",
   "review": "Cross-check CIK, legal filer name, ticker/security relationship and SEC accession before using the claim."
  },
  {
   "prompt": "At 16:00 a trader reviews a source; a filing is accepted at 16:12. Can they honestly say that exact filing was known at 16:00?",
   "review": "No. The filing's later acceptance is future evidence relative to 16:00; do not backfill it into the earlier decision."
  },
  {
   "prompt": "What is the difference between a filing's report period and its form type?",
   "review": "The report period indicates covered accounting time; the form type indicates the regulatory disclosure category."
  },
  {
   "prompt": "Why does reading an exhibit often change the interpretation of a corporate announcement?",
   "review": "Exhibits may contain conditions, definitions, closing terms and limitations omitted from headline summaries."
  },
  {
   "prompt": "A financial headline says 'profits doubled' but only shows revenue figures. What is the unsupported inference?",
   "review": "Revenue growth alone does not establish a rise in net income, earnings per share or profit without costs and accounting context."
  },
  {
   "prompt": "Explain why a later corrected exhibit should not replace earlier information in a frozen-time decision reconstruction.",
   "review": "It was unavailable at the earlier cutoff and can be considered only when reviewing events later, not to justify the original decision."
  },
  {
   "prompt": "Draft a no-conclusion rule for a claimed corporate catalyst without a verified original filing, issuer identity or publication time.",
   "review": "Withhold attribution and trade conclusions; first verify SEC source identity, exact wording, timestamp and alternative information."
  }
 ]
};
export const formativeReferenceV1=Object.freeze(Object.fromEntries(Object.entries(bank).map(([code,questions])=>
 [code,Object.freeze(questions.map((row,i)=>Object.freeze({id:code+'-D01-F'+String(i+1).padStart(2,'0'),...row})))])));
export const formativeReferenceDays=Object.freeze({tape10:1,indicators10:1,filings7:1});
if(Object.values(formativeReferenceV1).some(questions=>questions.length!==12||
 new Set(questions.map(x=>x.prompt)).size!==12||
 questions.some(x=>x.prompt.length<30||x.review.length<30)))
 throw Error('Formative benchmark content is incomplete');
