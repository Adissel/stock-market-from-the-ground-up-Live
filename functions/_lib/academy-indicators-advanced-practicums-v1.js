/* 16 individually authored advanced indicator cases across ten days.
 * All numbers fictional. No official grading, recommendations, or historical replay.
 */
export const indicatorsAdvancedV1=Object.freeze({
 "1": [
  {
   "id": "indicators10-D01-A01",
   "scenario": "Fictional trades comprise 100 shares at $10 and 300 shares at $11.",
   "task": "Compute trade-based weighted price and contrast it with the equal-weight price mean.",
   "worked": "Traded dollars $1,000+$3,300=$4,300; volume 400 shares; VWAP $4,300/400=$10.75/share. The two-price simple mean is ($10+$11)/2=$10.50.",
   "pitfall": "An average of distinct price observations is not a volume-weighted mean unless volume is equal.",
   "transfer": "Replace the second 300 shares with 100 and report the new volume, traded dollars, and VWAP."
  },
  {
   "id": "indicators10-D01-A02",
   "scenario": "A graphical indicator reads $10.75 while the newest unfinished candle briefly trades $11.20.",
   "task": "Separate an observed indicator value from a guaranteed new-bar close or predicted direction.",
   "worked": "VWAP summarizes qualifying prior and current trades; $11.20 is one reported price. Without the bar's closing status and feed convention, neither forecasts the next price.",
   "pitfall": "Describing one provisional price crossing a weighted average as a confirmed breakout is unjustified.",
   "transfer": "Move the learning cutoff to one second before the $11.20 print and state which evidence must be hidden."
  }
 ],
 "2": [
  {
   "id": "indicators10-D02-A01",
   "scenario": "A completed $5 candle has volume 400 shares; a completed $6 candle has volume 100.",
   "task": "Compute the dollar-weighted result from these two fictional representative bar prices.",
   "worked": "Under a stated close-price × volume approximation, numerator is $2,000+$600=$2,600; denominator 500; approximate VWAP=$5.20/share. Trade-by-trade VWAP can differ.",
   "pitfall": "This bar approximation is not proof of the true intrabar trade-weighted mean.",
   "transfer": "Introduce a $5.50 typical price for the first bar and recompute with the changed convention."
  },
  {
   "id": "indicators10-D02-A02",
   "scenario": "An exchange reports 500 shares in a one-minute bar; another five-minute bar reports 1,500 shares.",
   "task": "Calculate rate per minute and explain why raw bar volumes are not directly comparable.",
   "worked": "500/1 = 500 shares/minute; 1,500/5 = 300 shares/minute. Under the declared intervals the first has the higher volume rate despite lower total volume.",
   "pitfall": "Comparing unmatched volume bars without normalizing intervals can reverse the interpretation.",
   "transfer": "Add an incomplete five-minute bar and explain why its extrapolated rate is not a fixed realized volume."
  }
 ],
 "3": [
  {
   "id": "indicators10-D03-A01",
   "scenario": "A three-trade stream contains 100 at $9, 200 at $10, and 100 at $11.",
   "task": "Calculate numerator, denominator and VWAP step by step.",
   "worked": "Notionals: $900+$2,000+$1,100=$4,000; volume 100+200+100=400; VWAP=$10.00/share. At each point only already printed trades belong in the calculation.",
   "pitfall": "Using a later $11 trade to compute VWAP at the first $9 trade introduces lookahead.",
   "transfer": "Freeze after the second trade: numerator $2,900, denominator 300, VWAP ≈$9.6667/share."
  },
  {
   "id": "indicators10-D03-A02",
   "scenario": "A real chart uses bar high $12, low $10, close $11 and volume 300, while the exercise assumes typical price.",
   "task": "Calculate typical price and price-times-volume contribution, not an undocumented trade-vwap.",
   "worked": "Typical price (12+10+11)/3=$11; its bar-based dollar proxy is $11×300=$3,300. Without individual execution prices, exact trade-based VWAP remains unknown.",
   "pitfall": "Calling a typical-price bar method exact trade-weighted VWAP hides aggregation error.",
   "transfer": "Change close to $10 and show the new bar proxy with units and its limitation."
  }
 ],
 "4": [
  {
   "id": "indicators10-D04-A01",
   "scenario": "Regular-session trades: 100 at $5 and 100 at $6; a premarket print is 100 at $4.",
   "task": "Compute VWAP with and without extended hours, identifying the anchor.",
   "worked": "Regular only: ($500+$600)/200=$5.50. Including premarket: ($400+$500+$600)/300=$5.00. Both are valid only with explicit session labels.",
   "pitfall": "Treating two VWAP lines computed from different eligible trades as an identical benchmark is false.",
   "transfer": "Explain which records belong at a regular-session 09:30 start and which never retroactively enter the earlier quote."
  },
  {
   "id": "indicators10-D04-A02",
   "scenario": "A session VWAP is $10.20 and a new trade occurs 100 shares at $10.60; prior cumulative volume was 900.",
   "task": "Explain why the updated VWAP cannot be computed from the prior VWAP alone without units, then compute under the stated prior volume.",
   "worked": "Prior traded dollars $10.20×900=$9,180. Add $10.60×100=$1,060; total $10,240/1,000=$10.24/share. The previous VWAP must share the same population convention.",
   "pitfall": "Averages cannot be correctly combined without their associated denominators.",
   "transfer": "Recompute for an extra 900 shares at $10.60 and explain the larger weighting effect."
  }
 ],
 "5": [
  {
   "id": "indicators10-D05-A01",
   "scenario": "Completed closes are $8, $10 and $12, with the next completed close $14.",
   "task": "Compute SMA(3) seed, EMA(3) coefficient and next EMA.",
   "worked": "Three-close SMA=(8+10+12)/3=$10. With alpha=2/(3+1)=0.5, EMA next=$10+0.5×($14−$10)=$12. Seed/warmup policy must be specified.",
   "pitfall": "SMA(3) and EMA(3) do not assign the same full historical weighting after initialization.",
   "transfer": "Change new close to $9 and compute updated EMA from the same $10 seed."
  },
  {
   "id": "indicators10-D05-A02",
   "scenario": "Two chart providers show EMA(9) $10.20 and $10.28 on the same symbol.",
   "task": "Develop a reproducibility checklist before claiming a provider error.",
   "worked": "Require equal bar intervals, adjustment history, missing-data handling, completed-bar cutoff, seed, warmup length and input source. A discrepancy alone does not prove one line is wrong.",
   "pitfall": "Assuming indicator names imply identical implementation obscures input-policy differences.",
   "transfer": "Run both on a shared fictional four-bar sequence and document how an altered seed changes the first update."
  }
 ],
 "6": [
  {
   "id": "indicators10-D06-A01",
   "scenario": "EMA9 previous $10 and EMA20 previous $10; a completed close is $11.",
   "task": "Calculate both standard update coefficients and outputs, with rounded units.",
   "worked": "Alpha9=2/(9+1)=0.2 gives $10.20. Alpha20=2/(20+1)≈0.095238 gives $10.095238/share. Both depend on the stated prior seeds.",
   "pitfall": "A faster-moving average reacts more but does not establish participant intent or guarantee next price.",
   "transfer": "Apply a later completed $9 close to each resulting EMA and compare updated values."
  },
  {
   "id": "indicators10-D06-A02",
   "scenario": "A one-minute candle briefly trades $11 but finishes $10.50; the slower EMA before it was $10.",
   "task": "Distinguish provisional from completed-bar update for EMA20.",
   "worked": "With alpha20≈0.095238, provisional $11 produces $10.095238; the eventual $10.50 close yields $10.047619. The completion status changes the usable value.",
   "pitfall": "Backdating the finalized EMA to an earlier intrabar decision is lookahead.",
   "transfer": "Freeze at the wick high and label provisional inputs; then compute a second finished-bar scenario."
  }
 ],
 "7": [
  {
   "id": "indicators10-D07-A01",
   "scenario": "Price forms successive fictional higher highs of $10.50 and $10.70, while EMA20 slope remains negative.",
   "task": "State the competing evidence and a falsifiable, nonpredicted interpretation.",
   "worked": "Two dated swing highs rose by $0.20, while a slower smoothing measure may still decline. Record both with timeframe and compare swing lows, completed bars and invalidation before acting.",
   "pitfall": "A new higher high does not require a rising long moving average, nor guarantee continuation.",
   "transfer": "Move one swing high to an unfinished bar and reassess whether the market-structure observation is confirmed."
  }
 ],
 "8": [
  {
   "id": "indicators10-D08-A01",
   "scenario": "VWAP is $10.20; a completed close moves from $10.18 to $10.26, then another closes $10.19.",
   "task": "Evaluate an apparent reclaim and subsequent failure under a declared close-based rule.",
   "worked": "The first move closes $0.06 above the stated VWAP; the next closes $0.01 below. If the rule is a single close above then loss below, the pattern describes a failed reclaim; actual VWAP may also update each bar.",
   "pitfall": "Using one historical fixed VWAP value as if the live volume-weighted benchmark never updates misclassifies the next event.",
   "transfer": "Recompute after introducing a new 100-share print and document whether the failure criterion still holds."
  }
 ],
 "9": [
  {
   "id": "indicators10-D09-A01",
   "scenario": "Session VWAP is $12, EMA9 $12.10 and EMA20 $12.30; the latest completed close is $12.05.",
   "task": "Analyze signals without reducing their disagreement to an automatic trade recommendation.",
   "worked": "The close is $0.05 above VWAP, $0.05 below EMA9, and $0.25 below EMA20. The observations conflict: session cost basis and trend smoothing differ. Without market structure, volume, spread and invalidation, use NO TRADE.",
   "pitfall": "An above-VWAP close alone does not override weaker short and long EMAs or order-execution risk.",
   "transfer": "Alter the EMA20 to $11.90 and explain what improved but remains uncertain."
  }
 ],
 "10": [
  {
   "id": "indicators10-D10-A01",
   "scenario": "Three trades are 100 at $10, 300 at $11 and 100 at $9; EMA9 previous $10 and latest completed close $9.",
   "task": "Produce a reproducible multi-indicator memo with calculations, source scope and risk veto.",
   "worked": "VWAP=(1000+3300+900)/500=$10.40. EMA9 updated=$10+0.2×(9−10)=$9.80. The latest close $9 is below both, but that observation is not an independently justified trade without valid structure, spread and stop risk.",
   "pitfall": "Mixing the updated EMA with future trades not yet known at the frozen decision corrupts the comparison.",
   "transfer": "Recompute VWAP before the last $9 print, preserve the earlier time cutoff and explain the changed evidence."
  }
 ]
});
