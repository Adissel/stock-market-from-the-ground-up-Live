/* Deep Risk60 independent learning: original canonical D06–D07, source
 * topics 8 and 10. Fictional arithmetic; no graded cases, trade claims, or member writes.
 */
export const risk60DepthDay06to07V1=Object.freeze({
 "6": {
  "sourceDay": 8,
  "formativeQuestions": [
   {
    "id": "risk60-D06-Q01",
    "prompt": "A scanner reports a $3–$15 price filter pass. Does that establish an executable quote?",
    "review": "No. A scan match says a selected filter matched its feed; it does not supply synchronized bid, ask, displayed depth, or guaranteed execution."
   },
   {
    "id": "risk60-D06-Q02",
    "prompt": "At $4.90 bid and $4.99 offer, calculate the dollar quoted spread.",
    "review": "The offer minus bid is $4.99−$4.90=$0.09 per share; both quotes must be observed on a consistent timestamp and coverage basis."
   },
   {
    "id": "risk60-D06-Q03",
    "prompt": "Calculate the quoted midpoint for the $4.90/$4.99 snapshot.",
    "review": "The arithmetic midpoint is ($4.90+$4.99)/2=$4.945 per share for the described hypothetical inside quote."
   },
   {
    "id": "risk60-D06-Q04",
    "prompt": "Calculate midpoint spread percentage for that quoted $0.09 spread.",
    "review": "The ratio $0.09/$4.945×100≈1.820%, or 1.82%; report the named midpoint denominator rather than prior-close price."
   },
   {
    "id": "risk60-D06-Q05",
    "prompt": "A mandatory 1% maximum-spread policy meets the measured 1.82% spread. What follows?",
    "review": "Reject the candidate under the declared spread gate; its positive relative-volume scan match cannot override the mandatory rule."
   },
   {
    "id": "risk60-D06-Q06",
    "prompt": "What is the correct evaluation order for scan rank and precommitted risk vetoes?",
    "review": "Verify eligibility, source identity, quote age, spread and required liquidity first; rank only candidates not excluded by hard vetoes."
   },
   {
    "id": "risk60-D06-Q07",
    "prompt": "Does 2× relative volume establish that a candidate has two times the displayed executable depth?",
    "review": "No. Relative historical volume and contemporaneous visible size are different measurements, with different sources and time windows."
   },
   {
    "id": "risk60-D06-Q08",
    "prompt": "A quote is twelve minutes old against a five-minute freshness policy. Is the candidate eligible?",
    "review": "No. Twelve exceeds the five-minute threshold; mark the quote stale and refresh before evaluating spread-based entry."
   },
   {
    "id": "risk60-D06-Q09",
    "prompt": "A symbol passes the spread rule but the claimed catalyst has no verifiable original issuer source. What decision follows?",
    "review": "Apply the independent source-verification veto; record WAIT/NO TRADE until the primary release or filing is identified and dated."
   },
   {
    "id": "risk60-D06-Q10",
    "prompt": "Which denominator should define a 1.82% quoted-spread reading?",
    "review": "Use the contemporaneous bid/ask midpoint if that is the documented spread convention, and retain the $0.09 dollars/share numerator."
   },
   {
    "id": "risk60-D06-Q11",
    "prompt": "An eligible scanner result changes after the decision cutoff. May the learner edit the first decision with the later screen?",
    "review": "No. Freeze the first decision, note the new data publication time and perform a separate analysis under the later cutoff."
   },
   {
    "id": "risk60-D06-Q12",
    "prompt": "Transfer: a $5.00/$5.03 quote passes a 1% threshold but a required SEC source is absent. Is it eligible?",
    "review": "Spread is $0.03/$5.015×100≈0.598%, so that gate passes; missing original-source verification still triggers WAIT under the separate veto."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D06-A01",
    "scenario": "At 09:34 ET a fictional scanner flags a $4.99 symbol at 2× relative volume, with $4.90 bid and $4.99 ask; the policy caps spreads at 1%.",
    "task": "Compute the spread and midpoint-normalized spread, apply mandatory vetoes ahead of ranking, and identify any missing source evidence.",
    "worked": "Quoted spread $0.09/share; midpoint ($4.90+$4.99)/2=$4.945; percentage=0.09/4.945×100≈1.82%, exceeding the 1% cap. Reject the candidate even if the scanner score is favorable; confirm fresh quotes and original source separately.",
    "pitfall": "A scanner alert and high relative volume do not override the spread threshold or establish actual liquidity, a fill or a verified company catalyst.",
    "transfer": "For an independent $5.00 bid/$5.03 ask at 2.5× relative volume, compute ~0.598% quoted spread and reject or WAIT if the claimed issuer news remains unverifiable."
   }
  ]
 },
 "7": {
  "sourceDay": 10,
  "formativeQuestions": [
   {
    "id": "risk60-D07-Q01",
    "prompt": "A fictional long entry is $24.00 and invalidation is $23.60. Calculate risk per share.",
    "review": "Idealized reference distance is $24.00−$23.60=$0.40/share, before slippage, trading fees and stop-trigger execution differences."
   },
   {
    "id": "risk60-D07-Q02",
    "prompt": "Given an $80 planned dollar-risk budget and $0.40 distance, compute whole-share ceiling.",
    "review": "Floor($80/$0.40)=200 whole shares; the budget is an intended risk model, not a guaranteed maximum realized loss."
   },
   {
    "id": "risk60-D07-Q03",
    "prompt": "At $24.00 entry, what notional is required for 200 shares?",
    "review": "200×$24.00=$4,800 of hypothetical purchased notional, excluding commission and applicable buying-power requirements."
   },
   {
    "id": "risk60-D07-Q04",
    "prompt": "A separate maximum exposure rule limits position notional to $2,400. What is the tighter share cap?",
    "review": "Floor($2,400/$24.00)=100 shares, tighter than the 200-share risk-based cap; therefore use at most 100."
   },
   {
    "id": "risk60-D07-Q05",
    "prompt": "If the stop-reference distance doubles to $0.80 with the same $80 risk budget, what risk cap applies?",
    "review": "Floor($80/$0.80)=100 shares before fees, demonstrating the inverse dependence of calculated quantity on risk per share."
   },
   {
    "id": "risk60-D07-Q06",
    "prompt": "Why is a protective stop reference not insurance against losses beyond the stated dollar budget?",
    "review": "Market gaps, halts, spread widening, latency and adverse executions can cause a realized fill worse than the trigger reference."
   },
   {
    "id": "risk60-D07-Q07",
    "prompt": "For a different $16.50 entry and $16.10 invalidation, what is the per-share distance?",
    "review": "$16.50−$16.10=$0.40/share for this fictional long; distinguish the invalidation hypothesis from an actual executable stop."
   },
   {
    "id": "risk60-D07-Q08",
    "prompt": "Using a $50 budget and $0.40 reference distance, compute the rounded whole-share risk cap.",
    "review": "Floor($50/$0.40)=125 shares, before the independent buying-power, leverage and notional constraints are checked."
   },
   {
    "id": "risk60-D07-Q09",
    "prompt": "If account buying power can cover only 90 shares, which constraint governs the 125-share risk cap?",
    "review": "The lower buying-power ceiling, 90 shares, governs; a risk budget does not grant purchasing power or unlimited margin."
   },
   {
    "id": "risk60-D07-Q10",
    "prompt": "A paper order is estimated at 125 shares but the current offer depth is only 40 shares. Is the fill guaranteed?",
    "review": "No. Quoted top-level size covers only 40 and can cancel; price and availability for the remaining 85 are not established."
   },
   {
    "id": "risk60-D07-Q11",
    "prompt": "How should a short-side position-sizing exercise reverse the stop-distance calculation?",
    "review": "For a short, use protective reference above intended entry: stop−entry positive dollars/share, then divide budget and apply size limits."
   },
   {
    "id": "risk60-D07-Q12",
    "prompt": "Transfer: with $25 risk and a $0.30 stop reference, how many theoretical whole shares can be planned?",
    "review": "Floor($25/$0.30)=83 shares, implying $24.90 reference risk; actual loss can exceed it through adverse execution."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D07-A01",
    "scenario": "A fictional plan has long entry $24.00, stop reference $23.60, $80 risk budget, but a separate $2,400 maximum notional and only 90-share current buying-power limit.",
    "task": "Compute share caps from risk, notional and buying power, select the tightest, and identify why a stop reference does not guarantee loss.",
    "worked": "Risk/share=$0.40; risk cap=floor($80/0.40)=200 shares. Notional cap=floor($2,400/$24)=100. Buying-power cap=90; the limiting hypothetical size is 90 shares, reference risk $36 and notional $2,160. Gap/slippage risk remains.",
    "pitfall": "Sizing solely from an $80 intended loss ignores tighter notional and purchasing-power limits, while stop price is not an executed-loss guarantee.",
    "transfer": "Independently derive limits for a $16.50 fictional long, $16.10 stop, $50 risk and a $1,650 notional cap; require the lower applicable cap."
   }
  ]
 }
});
