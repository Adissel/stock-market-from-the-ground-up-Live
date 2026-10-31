/* 16 original advanced tape exercises distributed across 10 study days.
 * Fictional price/time examples. Unscored, not private graded assessment.
 */
export const tapeAdvancedV1=Object.freeze({
 "1": [
  {
   "id": "tape10-D01-A01",
   "scenario": "A 09:31:00 quote is $10.00/$10.04. At 09:31:02 a trade prints 40 shares at $10.03.",
   "task": "Classify the print relative to the recorded quote, and decide whether the $10.04 ask filled.",
   "worked": "$10.03 lies within the earlier $0.04 spread. The printed notional is 40 × $10.03 = $401.20. No common order identifier or contemporaneous venue information establishes that the quoted ask filled.",
   "pitfall": "Treating the two-second-old quote as a guaranteed match falsely assigns trade side and execution origin.",
   "transfer": "Change the print to $10.04 on another venue. Preserve unknown routing and ask what timestamp/feed evidence would be required."
  },
  {
   "id": "tape10-D01-A02",
   "scenario": "Venue A publishes a quote at 09:30:00; Venue B reports a trade at 09:30:04; the learner's screen refreshes at 09:30:07.",
   "task": "Construct a three-time evidence ledger and specify the first valid decision cutoff.",
   "worked": "Record quote event 09:30:00, execution event 09:30:04, and display retrieval 09:30:07 in distinct columns. At 09:30:02 the print cannot be cited, regardless of its later visibility.",
   "pitfall": "Using retrieval time as execution time or backdating a later print creates hindsight.",
   "transfer": "Freeze a decision at 09:30:05 and explain what becomes available only if the trade feed was actually published by then."
  }
 ],
 "2": [
  {
   "id": "tape10-D02-A01",
   "scenario": "A fictional best bid is $8.90 for 300 shares and the best ask is $8.96 for 100 shares.",
   "task": "Calculate spread dollars and percent of midpoint with explicit denominator.",
   "worked": "Spread is $8.96 − $8.90 = $0.06/share. Midpoint is ($8.90+$8.96)/2=$8.93; spread/midpoint=0.06/8.93 ×100≈0.672%. Quote size describes displayed shares, not filled shares.",
   "pitfall": "Quoting '0.67%' without stating the midpoint denominator confuses spread with percentage return.",
   "transfer": "Recalculate if the offer widens to $9.02, and explain why the price is not a guaranteed execution."
  },
  {
   "id": "tape10-D02-A02",
   "scenario": "Best offers show 100 shares at $4.01 and 200 at $4.04; a learner proposes a 250-share aggressive buy.",
   "task": "Calculate static average and show why this is not a fill guarantee.",
   "worked": "At unchanged displayed depth, 100×$4.01=$401 and 150×$4.04=$606; total $1,007 /250=$4.028/share before fees. Price and size may cancel before the order executes.",
   "pitfall": "Using only the $4.01 best ask for the full 250 shares ignores finite displayed liquidity.",
   "transfer": "If the $4.01 size cancels, say why the original price estimate cannot be reused and identify a no-trade condition."
  }
 ],
 "3": [
  {
   "id": "tape10-D03-A01",
   "scenario": "Three ask levels display 80 at $12.02, 120 at $12.05 and 150 at $12.08 shares.",
   "task": "Estimate average for 300 shares using only these three levels.",
   "worked": "The first 80 cost $961.60; next 120 cost $1,446; remaining 100 cost $1,208; total $3,615.60 /300=$12.052/share, under a frozen static book.",
   "pitfall": "Calling the estimate the realized fill ignores order routing, hidden liquidity and quote mutation.",
   "transfer": "Repeat with a buy limit $12.05 and explain why the final 100 shares may remain unfilled."
  },
  {
   "id": "tape10-D03-A02",
   "scenario": "Visible best bid has 500 shares at $6.00. A separate depth display shows another 900 shares at lower prices.",
   "task": "Explain what the apparent 1,400-share total does and does not imply.",
   "worked": "500+900=1,400 displayed bid shares across stated levels. They are resting buy interest, not available offers for a market buy and not proof of a future 1,400-share executed sale.",
   "pitfall": "Confusing same-side resting bid depth with guaranteed opposite-side liquidity produces false size assumptions.",
   "transfer": "Change to a market sell and record venue coverage, quote timestamps and possible queue/cancel behavior."
  }
 ],
 "4": [
  {
   "id": "tape10-D04-A01",
   "scenario": "Two fictional Time & Sales prints show 75 shares at $12.04 and 25 at $12.02.",
   "task": "Calculate traded notional and explain whether the transaction initiator is known.",
   "worked": "75×$12.04=$903; 25×$12.02=$300.50; combined $1,203.50 for 100 executed shares. Side assignment needs synchronized venue-correct quotes and remains uncertain.",
   "pitfall": "Color-coding prints green/red does not establish the true initiator without a documented classification convention.",
   "transfer": "Introduce a delayed quote feed and identify which side labels must be marked unclassified."
  },
  {
   "id": "tape10-D04-A02",
   "scenario": "The earlier quote is $7.00/$7.04 at 09:35:00; a 50-share trade at $7.02 is reported at 09:35:05.",
   "task": "Assess price location and the difference between trade time and report time.",
   "worked": "Relative to that quote, $7.02 is the midpoint of $7.00 and $7.04. The displayed historical quote may be stale; report timestamps need not equal trade timestamps.",
   "pitfall": "A midpoint print is not automatically a buyer-initiated or seller-initiated trade.",
   "transfer": "Compare with an event-matched quote at $7.01/$7.03; preserve why midpoint classification still does not identify account intent."
  }
 ],
 "5": [
  {
   "id": "tape10-D05-A01",
   "scenario": "Displayed ask liquidity is 100 shares at $5.00 and 200 at $5.05; the proposed market buy is 400 shares.",
   "task": "Compute known level capacity and identify the execution-size shortfall.",
   "worked": "Visible described liquidity covers 100+200=300 shares; 400−300=100 shares lack visible price/size support. First 300 static notional is $500+$1,010=$1,510; the remaining price is unknown.",
   "pitfall": "Extrapolating the last displayed $5.05 to 100 additional shares creates an invented quote and fill.",
   "transfer": "Apply a $5.05 buy limit and explain partial fills, cancellation and the alternative of no trade."
  },
  {
   "id": "tape10-D05-A02",
   "scenario": "A hypothetical long entry is $10.00 with stop reference $9.80, planned risk $50, and spread $0.08.",
   "task": "Compute the idealized whole-share size and identify why actual downside is not capped.",
   "worked": "Planned risk per share $10−$9.80=$0.20, so floor($50/$0.20)=250 shares before fees. At 250 shares an extra $0.08 adverse execution costs $20; gaps can exceed that.",
   "pitfall": "A stop trigger is not an insurance contract limiting the realized loss to the planned $50.",
   "transfer": "Recalculate if the spread doubles and document whether the setup violates the predefined risk budget."
  }
 ],
 "6": [
  {
   "id": "tape10-D06-A01",
   "scenario": "Venue A shows $9.98/$10.05 and Venue B $10.00/$10.03 at synchronized eligible times.",
   "task": "Compute the hypothetical inside and identify its provenance.",
   "worked": "Highest eligible bid is $10.00 at B and lowest eligible ask $10.03 at B; spread $0.03. This assumes both sources are protected/eligible and synchronous.",
   "pitfall": "One venue's Level II or an out-of-date screen is not a sufficient national best bid/offer source.",
   "transfer": "Make B's quote stale and explain why the combined inside must be withheld pending fresh data."
  },
  {
   "id": "tape10-D06-A02",
   "scenario": "An ATS trade prints $10.02 while an earlier protected displayed inside is $10.00/$10.03.",
   "task": "Assess the trade without asserting an unsupported legal violation.",
   "worked": "The print lies within the earlier spread. Whether it respects applicable protections requires contemporaneous protected quotes, order type, venue context and regulatory exceptions. Price alone is insufficient.",
   "pitfall": "Claiming every off-exchange execution is illegal or unprotected disregards applicable market rules and timing.",
   "transfer": "Add a later quote change and document which observations cannot justify a historical trade-through allegation."
  }
 ],
 "7": [
  {
   "id": "tape10-D07-A01",
   "scenario": "A fictional order book shows bid depth 900 shares and offer depth 600 shares across the same two levels.",
   "task": "Compute normalized visible imbalance and state its inferential ceiling.",
   "worked": "(900−600)/(900+600)=300/1,500=0.20, or +20% normalized imbalance. It describes the specified snapshot only, not a calibrated chance of an upward move.",
   "pitfall": "The numerical imbalance does not identify manipulative intent, hidden orders, or directional certainty.",
   "transfer": "Remove 450 displayed bid shares and recompute, then explain the value of a time-series rather than a single snapshot."
  }
 ],
 "8": [
  {
   "id": "tape10-D08-A01",
   "scenario": "A stock prints $3.20 before a trading pause, and after resumption the quoted bid/ask becomes $2.85/$3.10.",
   "task": "Describe the resumption spread and the risk to a $3.00 stop reference.",
   "worked": "Reopening spread is $0.25/share. A hypothetical sell at $2.85 would be $0.15 below a $3.00 stop reference; actual execution requires a documented order and fill. No stop can guarantee price across a halt.",
   "pitfall": "Treating an indicative quote as a confirmed fill or assuming stops execute during a halt misstates execution risks.",
   "transfer": "Use the exchange's current status and a frozen-time source log before allowing any resumption-dependent decision."
  }
 ],
 "9": [
  {
   "id": "tape10-D09-A01",
   "scenario": "At 10:00:00 the quote is $7.00/$7.04 with 100 shares shown at the ask; prints report 50 at $7.04 and 25 at $7.02.",
   "task": "Combine observable transaction amounts with missing book evidence.",
   "worked": "Reported volume is 75 shares, with $352+$175.50=$527.50 traded notional. Neither print establishes whose displayed ask was filled nor whether 100 shares remained. Event timing and venue scope govern interpretation.",
   "pitfall": "Subtracting print size from displayed depth without order identifiers assumes a particular cancellation/execution sequence.",
   "transfer": "Propose a synchronized event timeline and classify uncertain initiator/remaining depth as unknown."
  }
 ],
 "10": [
  {
   "id": "tape10-D10-A01",
   "scenario": "A fictional integrated practicum combines synchronized $10.00/$10.03 NBBO, 80 shares offered at $10.03, and a desired 150-share buy.",
   "task": "Construct an execution-risk memo, not a fabricated fill report.",
   "worked": "Visible inside covers 80 shares; 70 remain outside quoted size. First-level notional could be 80×$10.03=$802.40 if available, but the other 70 lack a verified price. Decision: withhold or constrain a limit/size under a declared budget.",
   "pitfall": "A marketable order does not transform one observed top-of-book quote into full-size assured liquidity.",
   "transfer": "Write a second decision for a changed spread and a halt notice, keeping all later events outside the first decision cutoff."
  }
 ]
});
