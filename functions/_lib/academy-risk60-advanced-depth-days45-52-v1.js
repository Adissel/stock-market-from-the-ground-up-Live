/* SMFGU-RISK60-ADV-DEPTH-D45-52 v1.0 (November 2, 2026).
 * Eight independently framed original transfer-day fictional records.
 * Twelve ungraded formative prompts and one separate practicum per record.
 * Never expose protected answer keys, claim broker fills, or award mastery.
 * Canonical Risk60 Day 45-52 transfer lessons and topic-source days unchanged.
 */
const entries=[
 [45,"Multi-level depth shortfall and conditional cost",
  "A frozen fictional ask snapshot shows 35 shares at $12.10, 45 at $12.16 and 20 at $12.25 for a planned 130-share buy.",
  "How many planned shares lack an observed ask price?","Visible size is 35+45+20=100 shares, leaving 130−100=30 shares unpriced.",
  "What conditional weighted price applies only to the displayed 100 shares?","Displayed notional is $423.50+$547.20+$245.00=$1,215.70, or $12.157 per displayed share; it is not a 130-share fill.",
  "A new 95-share request sees 25 at $7.04 and 50 at $7.09. What remains unknown?","Seventy-five shares are displayed and twenty remain unpriced; only the 75-share subset has conditional arithmetic.",
  "What must happen if the displayed quantities cancel before routing?","Discard the old estimate and obtain a new timestamped book; canceled size cannot support an execution claim.",
  "Venue coverage, queue priority, hidden liquidity, cancellation timing and broker routing remain unavailable.",
  "Never extend the last displayed price to uncovered size or present frozen-book arithmetic as a confirmed fill.",
  ["difference",[130,100],30]],
 [46,"Optional rank cannot override a halt veto",
  "Fictional candidate R scores 8 of 10 research points, but the official venue status at 10:12 is HALTED; candidate S scores 6 and is open.",
  "How many more optional research points does R have than S?","The score difference is 8−6=2 points, which describes ranking only.",
  "Can R's two-point advantage authorize an order during the halt?","No. The mandatory trading-status gate rejects an order independently of optional ranking.",
  "A separate candidate scores 9 but has a 3.2% spread against a 1.5% ceiling. What controls?","The spread veto controls; a high optional score cannot waive a precommitted execution-risk maximum.",
  "What record is required after a halt ends?","Create a new timestamped decision with current status, quote, depth and source evidence rather than rewriting the halted record.",
  "Reopening price, queue, fresh spread, order acceptance and actual fills are unknown at the original cutoff.",
  "Research relevance and operational permission are separate; any mandatory veto controls regardless of rank.",
  ["difference",[8,6],2]],
 [47,"Risk, notional and concentration triple cap",
  "Fictional entry $18.40, invalidation $17.90, risk budget $110, notional cap $2,500 and sector cap 90 shares.",
  "What share ceiling follows from planned price risk?","Planned distance is $0.50; floor($110/$0.50)=220 shares.",
  "Which ceiling determines the final theoretical quantity?","Notional permits floor(2500/18.40)=135 shares, while sector policy permits 90; minimum of 220, 135 and 90 is 90.",
  "For entry $9.25, distance $0.25, risk $50, notional $1,200 and concentration cap 100, choose the bound.","Risk permits 200, notional permits floor(1200/9.25)=129, and concentration permits 100, so the ceiling is 100 shares.",
  "Does the 90-share calculation guarantee a $45 maximum realized loss?","No. Gaps, slippage, fees, halts and failed exits can exceed planned distance.",
  "Buying power, existing correlated positions, costs, borrow conditions and executable depth are not supplied.",
  "Apply every independent ceiling and select the smallest; never promise that a reference price caps realized loss.",
  ["min",[220,135,90],90]],
 [48,"Multiple partial exits and open-order reconciliation",
  "A fictional 240-share long has confirmed exits of 50 shares at $10.30 and 70 at $10.45; a further 40-share sell order is working.",
  "How many shares remain owned after confirmed exits?","Confirmed exits total 120 shares, so 240−120=120 shares remain; the working 40 does not reduce ownership.",
  "If entry was $10.00, what gross price difference is realized?","The confirmed differences are 50×$0.30=$15 and 70×$0.45=$31.50, totaling $46.50 before costs.",
  "A new 180-share position confirms 30 sold and 50 partially filled from another order. How many remain?","Eighty shares are confirmed sold, leaving 100 shares, regardless of any still-open remainder.",
  "How should a later cancellation of the working 40 be recorded?","Record cancellation as order status only; it neither changes the 120 owned shares nor creates proceeds.",
  "Fees, tax lots, settlement, rejected quantities and broker ledger reconciliation are unavailable.",
  "Only confirmed fills change position quantity or realized result; submissions, working orders and cancellations do not.",
  ["difference",[240,120],120]],
 [49,"Static weighted estimate with an uncovered tail",
  "A fictional ask book displays 20 at $4.90, 30 at $4.94 and 40 at $5.02 for a proposed 120-share order.",
  "How many shares are represented by displayed offers?","Displayed quantity is 20+30+40=90 shares, so 30 planned shares have no observed offer.",
  "What is the conditional average for only the displayed 90 shares?","Notional is $98+$148.20+$200.80=$447; $447/90=$4.9667 per displayed share.",
  "A different order sees 10 at $20.10 and 15 at $20.30 for 40 planned shares. What can be priced?","Only 25 displayed shares can be priced conditionally; fifteen shares remain without an observed level.",
  "May the $5.02 third level be assigned to the missing thirty shares?","No. Extending a displayed price beyond its supplied size fabricates liquidity.",
  "Book timestamp, venue aggregation, queue changes, hidden orders, fees and routed executions are missing.",
  "State the covered quantity beside every weighted estimate and refuse a full-order average when depth is incomplete.",
  ["weightedQty3",[20,4.9,30,4.94,40,5.02],4.966666666666667]],
 [50,"Confirmed downtrend with equal-pivot ambiguity",
  "Under a two-left/two-right completed-bar rule, fictional confirmed highs are $16.80 then $16.45 and lows $15.90 then $15.55.",
  "By how much do the confirmed highs and lows each decline?","Highs decline $0.35 and lows decline $0.35, supporting lower-high/lower-low structure through the cutoff.",
  "What if the later high equals $16.80 while the later low is $15.55?","The low is lower but the high is equal, so a complete lower-high/lower-low label is not supported.",
  "Fresh confirmed highs are $8.10 then $7.92 and lows $7.50 then $7.61. Is this a full downtrend sequence?","No. The high is lower but the low is higher; the two required relationships disagree.",
  "May an incomplete bar supply the missing lower pivot?","No. The declared confirmation rule requires completed right-side bars before a pivot becomes knowable.",
  "Future confirmation bars, intrabar price order, corporate-action adjustments and executable quotes remain unknown.",
  "Apply the same pivot rule to every case and label mixed or equal relationships without forcing a trend narrative.",
  ["difference",[16.8,16.45],0.35]],
 [51,"Observed decline versus unsupported cause",
  "A completed fictional interval falls from $34.00 to $32.98 while the current quote feed is six minutes stale under a two-minute maximum.",
  "What completed percentage decline is observable?","The decline is $1.02/$34.00=3.00% for the completed interval.",
  "What current-tradeability decision follows from the stale quote?","WAIT. The quote is four minutes beyond the policy maximum, so spread and depth are not current.",
  "A separate price falls $12.00 to $11.70 with a fresh quote but no issuer source. What is known?","The completed decline is 2.5%; present quote freshness passes, but catalyst and participant cause remain unknown.",
  "Can either decline prove panic, liquidation or short selling?","No. Price change alone does not identify participants, orders, motives or causal mechanism.",
  "Fresh depth, original issuer evidence, trade classifications and participant-level records are unavailable.",
  "Report magnitude, data freshness and causal uncertainty separately; a red interval is not a behavioral diagnosis.",
  ["returnPct",[34,32.98],-3]],
 [52,"Short loss, borrow charge and uncapped exposure",
  "A fictional 70-share short sells at $22.00 and covers at $25.60; a separately stated borrow estimate is $9, before other costs.",
  "What gross adverse price loss occurs before borrow and transaction costs?","The adverse move is $3.60 per share; 70×$3.60=$252 gross price loss.",
  "What subtotal results after including only the stated $9 borrow estimate?","The limited subtotal is $252+$9=$261, while commissions, fees and slippage remain excluded.",
  "A new 40-share short from $30 covers at $34.50 with a $6 borrow estimate. Calculate the same subtotal.","Gross price loss is 40×$4.50=$180; including only $6 gives $186.",
  "Does initial sale proceeds or a planned stop cap short loss?","No. Price can keep rising, and gaps, recalls or failed exits can worsen loss.",
  "Locate approval, changing borrow rate, recall timing, dividend obligations, margin and actual fills are unknown.",
  "Keep modeled price loss and borrow assumptions distinct, and never infer legal availability or a maximum loss from a chart.",
  ["sum",[252,9],261]]
];
const ids=new Set();
export const risk60DeepDays45to52V1=Object.freeze(Object.fromEntries(entries.map((
 [day,title,observation,calcQ,calcA,gateQ,gateA,altQ,altA,transferQ,transferA,evidenceCaution,decisionCaution,numericCheck]
)=>{
 const d=String(day).padStart(2,'0');
 const qa=[
  [calcQ,calcA],[gateQ,gateA],[altQ,altA],[transferQ,transferA],
  ['For Risk60 Day '+day+' ('+title+'), which original facts require independent verification before any live conclusion?',evidenceCaution],
  ['Which precommitted instructional boundary controls the '+title+' decision?',decisionCaution],
  ['At the fictional cutoff, what is directly observable in '+title+'?',observation+' Preserve its timestamp and separate it from later claims.'],
  ['Which units, denominator or arithmetic rule must remain fixed when reviewing '+title+'?',calcA+' Retain input units and timestamps rather than substituting later convenient values.'],
  ['Which evidence gap blocks a broker-fill, participant-intent or market-causation claim in '+title+'?',evidenceCaution+' Simulation and narration cannot replace authenticated execution evidence.'],
  ['How should a learner respond when hindsight appears to reward breaking the '+title+' rule?',decisionCaution+' Later price direction cannot alter evidence available at the original cutoff.'],
  ['Which unfamiliar alternative prevents memorizing the worked '+title+' calculation?',altA+' Recalculate from this independent fictional evidence.'],
  ['What separate transfer situation extends the '+title+' lesson?',transferA+' Any new decision still requires current evidence and every mandatory gate.']
 ];
 const formativeQuestions=qa.map(([prompt,review],i)=>Object.freeze({
  id:'risk60-D'+d+'-Q'+String(i+1).padStart(2,'0'),prompt,review,graded:false
 }));
 for(const q of formativeQuestions){if(ids.has(q.id)||q.prompt.length<35||q.review.length<45)throw Error('Duplicate or insufficient question '+q.id);ids.add(q.id);}
 const advanced=Object.freeze({
  id:'risk60-D'+d+'-A01',
  scenario:'Fictional independently authored decision for '+title+': '+observation,
  task:calcQ+' '+gateQ+' Explain what is known and unavailable at the frozen cutoff.',
  worked:calcA+' '+gateA+' '+evidenceCaution,
  pitfall:decisionCaution+' '+evidenceCaution+' No outcome, order fill, grade or mastery is established.',
  transfer:transferQ+' '+transferA+' '+altA
 });
 for(const k of ['scenario','task','worked','pitfall','transfer'])if(advanced[k].length<95)throw Error('Short advanced '+k+' D'+day);
 return [day,Object.freeze({
  instructionalFocus:title,formativeQuestions:Object.freeze(formativeQuestions),
  advancedPracticums:Object.freeze([advanced]),
  numericCheck:Object.freeze({operation:numericCheck[0],inputs:Object.freeze(numericCheck[1]),expected:numericCheck[2]}),
  sourceStatus:'AUTHOR_SOURCE_ONLY_INDEPENDENT_ACCEPTANCE_PENDING'
 })];
})));
if(Object.keys(risk60DeepDays45to52V1).length!==8)throw Error('Expected exactly 8 separate original Risk60 day records.');
