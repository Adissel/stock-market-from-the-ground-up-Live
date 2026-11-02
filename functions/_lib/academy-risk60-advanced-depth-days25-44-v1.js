/* SMFGU-RISK60-ADV-DEPTH-D25-44 v1.0 (November 2, 2026).
 * Twenty independently framed original-day fictional instructional records.
 * Twelve ungraded formative prompts and a separate transfer per record.
 * Never expose protected answer keys, claim broker fills, or award mastery.
 * Original source references, canonical IDs and risk60 progression unchanged.
 */
const entries=[
  [
    25,
    "Static offer-depth shortfall",
    "A fictional 260-share buy confronts 75 offers at $9.10 and 125 at $9.14, with no further prices.",
    "How many requested shares have no observed ask price?",
    "Visible quantity is 75+125=200 shares; 260−200=60 shares lack a quoted level, so a full-order price is uncalculable.",
    "May the two-level conditional price be represented as a confirmed execution?",
    "No. The static visible 200-share estimate is $9.125 per share, not a routed 260-share fill.",
    "If a new 130-share order sees only 40 at $6.25 and 70 at $6.29, what is missing?",
    "Only 110 shares appear; 20 remain unpriced, even though the first 110 could be priced conditionally.",
    "What changes if displayed volume disappears before the order reaches the market?",
    "The original price estimate no longer represents executable depth; obtain new quotes, timestamps and routing evidence.",
    "Snapshot age, order-book cancellations, venue depth and execution routing are not independently available.",
    "Never infer a complete fill from prices for only a subset of planned shares.",
    [
      "difference",
      [
        260,
        200
      ],
      60
    ]
  ],
  [
    26,
    "Scanner ranking versus spread veto",
    "Candidate M scores seven scanner points, N five; M quotes $3.95/$4.05 at a $4 midpoint under a 1% maximum spread.",
    "What is candidate M's midpoint-normalized quoted spread?",
    "The ten-cent offer-minus-bid spread divided by the $4 midpoint is 2.5%.",
    "May M's higher scanner score override the written 1% spread maximum?",
    "No. The independently binding 1% spread limit rejects M before optional ranking.",
    "What changes when a separate $8.04/$8.08 quote has a narrower spread but no original issuer source?",
    "Its $0.04/$8.06 midpoint spread is about 0.50%, but the missing verified catalyst independently requires WAIT.",
    "If M later moves higher, should the original spread cutoff be rewritten?",
    "No. Preserve the 2.5% rejected snapshot and record any later observation separately.",
    "Quote freshness, ask depth, original catalyst and trading status remain unverified.",
    "A filter score measures research ranking, not mandatory trade permission or real execution.",
    [
      "spreadPct",
      [
        3.95,
        4.05
      ],
      2.5
    ]
  ],
  [
    27,
    "Risk and notional dual cap",
    "Fictional entry $32, invalidation reference $31.50, budget $75 and notional cap $3,200.",
    "How many shares does the theoretical per-share risk calculation permit?",
    "Risk per share is $32−$31.50=$0.50 and floor($75/$0.50)=150 shares.",
    "What final planned size respects both the risk and notional limits?",
    "Notional shares floor($3,200/$32)=100; minimum of 150 and 100 is 100 hypothetical shares.",
    "For a separate $18 entry, $17.40 reference, $48 risk and $900 notional ceiling, choose the smaller bound.",
    "Risk permits floor(48/0.60)=80; notional permits floor(900/18)=50, so 50 is the theoretical size ceiling.",
    "Does a stop reference guarantee that realized loss cannot exceed the planned budget?",
    "No. Slippage, gaps, fees and unfilled exit orders can produce a different realized loss.",
    "Broker buying power, execution fees, gaps and stop-order behavior are outside this calculation.",
    "Both sizing ceilings must be checked; never choose the larger or promise a capped realized loss.",
    [
      "floorDiv",
      [
        3200,
        32
      ],
      100
    ]
  ],
  [
    28,
    "Confirmed partial exits",
    "A fictional 180-share long entered at $6 has a confirmed 60-share sale at $6.30 and a further 40-share sell request still working.",
    "How many shares remain after confirmed fills?",
    "Only 60 shares are confirmed sold, leaving 180−60=120 shares; a pending 40-share request does not reduce ownership.",
    "How much gross price difference was realized on the confirmed sale?",
    "The confirmed sale generates 60×($6.30−$6.00)=$18 gross trading difference before fees.",
    "In a separate 90-share position, 25 sold and another 30 only offered, how many remain?",
    "Ninety minus twenty-five confirmed shares equals 65 shares still held; open orders do not count as fills.",
    "Can a submitted but unfilled exit be booked as settled cash?",
    "No. Submission, acceptance, partial execution and settlement are distinct states.",
    "Order status, costs and actual broker clearing evidence are absent from fictional records.",
    "Never reduce risk exposure or increase realized P&L from orders without confirmed executions.",
    [
      "difference",
      [
        180,
        60
      ],
      120
    ]
  ],
  [
    29,
    "Frozen-book weighted price",
    "A hypothetical static book displays 45 asks at $7.20 and 55 at $7.24 for a fictional 100-share request.",
    "What is the conditional cost of the visible 100 shares?",
    "The conditional amount is 45×$7.20+55×$7.24=$722.20, excluding transaction costs.",
    "What is the weighted per-share price for that frozen snapshot?",
    "$722.20/100=$7.222 per share; a three-decimal weighted estimate is not an executed fill.",
    "An 85-share request sees only 25 at $5.10 and 50 at $5.14. How much is unpriced?",
    "Only 75 visible shares are represented; the remaining ten have no supplied price.",
    "Could the weighted average be guaranteed if the ask queue changes?",
    "No. The hypothetical arithmetic requires the book to remain fixed and both displayed levels to be reachable.",
    "Quote timestamp, cancellation rate, depth venue, fill priority, commissions and routing are unavailable.",
    "Do not label indicative order-book arithmetic as realized account transactions.",
    [
      "weighted2",
      [
        45,
        7.2,
        55,
        7.24
      ],
      7.222
    ]
  ],
  [
    30,
    "Completed-bar pivot confirmation",
    "Under a two-left/two-right completed-candle rule, confirmed highs rise from $9.10 to $9.40 and lows from $8.30 to $8.55.",
    "By how much did the two confirmed highs differ?",
    "The confirmed later high exceeds the earlier high by $9.40−$9.10=$0.30 per share.",
    "When may the learner assert higher-high and higher-low structure?",
    "Only once the required two right-side candles have fully completed; a still-open candle is not a pivot.",
    "For confirmed highs $10.30 then $10.05 and lows $9.70 then $9.45, classify the alternative.",
    "Both highs and lows decline by $0.25, yielding confirmed lower-high/lower-low structure through that cutoff.",
    "May a later closing candle retrospectively make an earlier live pivot certain?",
    "No. Mark each pivot's availability only at its actual right-side confirmation time.",
    "The new open candle and any not-yet-confirmed future bars are unavailable to the earlier decision.",
    "Confirmations have an explicit lag; never use future bars to manufacture real-time certainty.",
    [
      "difference",
      [
        9.4,
        9.1
      ],
      0.3
    ]
  ],
  [
    31,
    "Price fall versus stale quote",
    "A completed fictional move is $15.00 to $14.55 while the last quote is twelve minutes old under a three-minute freshness ceiling.",
    "Calculate the observed completed-price return.",
    "($14.55−$15.00)/$15.00×100=−3.00% for the completed interval.",
    "What decision follows a twelve-minute-old quote under the three-minute policy?",
    "WAIT; the quote exceeds the freshness maximum by nine minutes regardless of the observed completed-bar change.",
    "An unrelated $11.20 to $10.92 move occurs with an unavailable quote. What can be concluded?",
    "The completed decline is 2.5%, but executable spread, available depth and immediate liquidity remain unknown.",
    "Does a red candle prove panic selling or forced liquidation?",
    "No. Its OHLC movement does not identify counterparties, motivation or exact fill conditions.",
    "Verified up-to-date bid/ask, live venue status and original catalyst sources are missing.",
    "Do not infer participant intent or executability from a completed red bar.",
    [
      "returnPct",
      [
        15,
        14.55
      ],
      -3
    ]
  ],
  [
    32,
    "Adverse short cover and borrow risk",
    "A fictional short of 80 shares starts at $25 and is covered at $28.25, excluding all borrowing and transaction expenses.",
    "What is the gross adverse price move per shorted share?",
    "The cover price exceeds the short sale by $28.25−$25.00=$3.25 per share.",
    "What is the gross price loss before excluded expenses?",
    "The short loses 80×$3.25=$260 on price difference, before borrow fees and other costs.",
    "For a different 60-share short from $15 to $17.40, what is the gross adverse difference?",
    "The adverse difference is $2.40 per share; 60×$2.40=$144 gross price loss.",
    "Is a short position's loss capped by the original short-sale proceeds?",
    "No. Price increases can exceed the sale price and generate losses beyond the initial proceeds.",
    "Availability of borrow, margin rules, recalls, locate, dividend obligations and gap effects are not supplied.",
    "Never equate a planned short stop or a theoretical borrow assumption with a guaranteed exit.",
    [
      "product",
      [
        80,
        3.25
      ],
      260
    ]
  ],
  [
    33,
    "Promotional selection denominator",
    "A fictional promotion shows fourteen winning screenshots among sixteen selected images from a fifty-event trading history with undisclosed remaining outcomes.",
    "What is the observed winning fraction in the selected screenshots?",
    "Fourteen divided by sixteen equals 87.5% for the curated subset only.",
    "Can the 87.5% figure be called the complete fifty-event win rate?",
    "No. The remaining thirty-four events and their results are unknown.",
    "Another marketer shows eighteen winning screenshots without the full sample size. What rate can be verified?",
    "No denominator is supplied, so no all-trades win percentage can be computed.",
    "What happens to an audit if losing or missing trades are omitted selectively?",
    "Selection bias exaggerates apparent results and destroys the fixed-universe comparison.",
    "The full order ledger, losing events, net fees, account reconciliations and selection criteria are unavailable.",
    "Never treat promotional screenshots as an independently audited total-return distribution.",
    [
      "percent",
      [
        14,
        16
      ],
      87.5
    ]
  ],
  [
    34,
    "Short-squeeze attribution boundary",
    "A completed price rises from $40 to $48.80 but the available published short-interest figure is ten days old.",
    "What percentage price rise is demonstrated?",
    "The completed difference is $8.80; $8.80/$40.00×100=22%.",
    "Does the twenty-two-percent rise prove short covering caused the move?",
    "No. The price path does not identify buyers or explain motivations; the short-interest publication is stale.",
    "A different fictional issuer moves $5.00 to $5.70 after earnings. Calculate the rise.",
    "The difference is $0.70, so 0.70/5.00×100=14%; earnings context alone does not establish participant identity.",
    "Can old reported short interest be interpreted as a current participant-level order log?",
    "No. Reports represent their own as-of dates and can differ from contemporaneous short positions.",
    "Current position disclosures, timestamped trades, exchange records and causal evidence are missing.",
    "A percentage price move is an observation, not proof of a specific short squeeze.",
    [
      "returnPct",
      [
        40,
        48.8
      ],
      22
    ]
  ],
  [
    35,
    "Breakout with spread ceiling",
    "A completed fictional candle closes $9.12 above an earlier $9.00 resistance reference, but the decision quote spread is 1.6% against a written 1.0% maximum.",
    "How far above the earlier reference is the completed close?",
    "The completed price closes $9.12−$9.00=$0.12 above the historical reference.",
    "Does a confirmed break allow an order despite a 1.6% spread?",
    "No. The independent 1.0% quoted-spread ceiling rejects the proposed order.",
    "A different chart confirms a reversal but a regulatory halt applies. Is entry allowed?",
    "No. The trading-status veto controls independently of the price structure or score.",
    "If a later candle rises, may the learner retroactively lower the earlier spread?",
    "No. Retain the fixed observed spread and the contemporaneous decision without hindsight.",
    "Fresh book depth, venue status, original-source time and a confirmed execution are not provided.",
    "A price-pattern label cannot supersede a precommitted hard execution-risk veto.",
    [
      "difference",
      [
        9.12,
        9
      ],
      0.12
    ]
  ],
  [
    36,
    "Original filing availability cutoff",
    "A speculative social report appears at 08:10, the decision freezes at 08:15 and the genuine issuer filing becomes public at 08:22.",
    "How many minutes after the frozen decision did the official filing become available?",
    "08:22 minus 08:15 equals seven minutes; that filing is later than the decision.",
    "May a later verified filing validate an otherwise unsourced earlier decision?",
    "No. The decision must use only evidence actually public and retrieved by its own cutoff.",
    "An unrelated 09:06 decision precedes a 09:12 source amendment. What is known by 09:06?",
    "The later amendment arrives six minutes afterward and must be excluded from the earlier evidence set.",
    "Should a social assertion at 08:10 be upgraded into verified filing data at 08:15?",
    "No. Publication of a similar claim before official disclosure is not proof of primary-source verification.",
    "Original availability, publication and retrieval timestamps must be independently recorded.",
    "Post-cutoff documents may inform a new decision but cannot be backdated into the old one.",
    [
      "difference",
      [
        22,
        15
      ],
      7
    ]
  ],
  [
    37,
    "Attempt cap with canceled and rejected submissions",
    "A practice account has an announced maximum of three submitted attempts; its first cancels, second partially fills and third rejects.",
    "How many submitted attempts have occurred before another order is considered?",
    "Three submitted attempts have occurred: canceled, partially filled and rejected all count as submissions.",
    "Does the fourth order satisfy the original three-submission ceiling?",
    "No. A fourth submission exceeds the recorded cap by one attempt.",
    "A separate policy permits only two submissions; one cancels and one fills. May a third be sent?",
    "No. Both attempts count under the specified submission definition, regardless of fill outcome.",
    "Can a canceled order be removed from the attempt count after the price rises?",
    "No. That would rewrite the agreed risk rule after observing consequences.",
    "Execution states and real account fills are illustrative; submitted-at times require recorded broker evidence in real use.",
    "Do not change the attempt definition from submitted orders to profitable fills after outcomes are visible.",
    [
      "difference",
      [
        4,
        3
      ],
      1
    ]
  ],
  [
    38,
    "Immutable source amendments",
    "A fictional issuer update at 09:00 describes exploratory talks; at 10:30 it officially announces the talks ended.",
    "How much time elapsed between the two official publication events?",
    "The interval from 09:00 to 10:30 is ninety minutes.",
    "Should the 09:00 research entry be silently overwritten with the later outcome?",
    "No. Keep the original time-stamped hypothesis and create a new 10:30 version removing eligibility.",
    "What happens when an unrelated rumor is subsequently denied by the issuer?",
    "Store a separate denial record with its release time, link and explicit watchlist removal rule.",
    "Could a 09:15 decision legitimately rely on the 10:30 reversal?",
    "No. That conclusion was unavailable at 09:15 and would violate the original evidence cutoff.",
    "Exact issuer identification, version IDs, original links and retrieval time require source documentation.",
    "Retrospective corrections must amend future eligibility, not falsify a previously frozen decision.",
    [
      "difference",
      [
        90,
        0
      ],
      90
    ]
  ],
  [
    39,
    "Hindsight-free WAIT decisions",
    "A fictional candidate is rejected at 09:40 because the quote is unavailable; by 10:30 its recorded price is six percent higher.",
    "How many minutes separate the original WAIT and the later observed price?",
    "The later observation occurs fifty minutes after the 09:40 no-trade decision.",
    "Does the six-percent later rise establish a missed realized profit?",
    "No. No order was placed and no fill was executed; it is merely a later hypothetical observation.",
    "A separate validly planned simulated position gaps down and loses two planned R. What should be reviewed?",
    "Review process compliance and gap assumptions separately from observed results; the planned risk was not a guaranteed realized cap.",
    "Could a favorable backfilled trade be inserted into the original journal?",
    "No. That would fabricate an execution and erase the contemporaneous unknown quote.",
    "Actual tradable bid/ask, venue condition, order timestamp and broker confirmation were not established.",
    "A correct WAIT decision remains correct when mandatory evidence was missing, regardless of later direction.",
    [
      "difference",
      [
        50,
        0
      ],
      50
    ]
  ],
  [
    40,
    "Separate research and risk-process denominators",
    "In twenty-five fictional study plans, twenty have dated sources and fifteen have complete precommitted risk plans.",
    "Calculate independently the rate of plans with timely sources.",
    "Source completeness is 20/25×100=80%; retain all twenty-five in its denominator.",
    "What is the separately measured rate of complete risk plans?",
    "Fifteen of twenty-five is 60%; this does not justify inventing a seventy-percent proficiency average.",
    "An unrelated twenty-case cohort has fourteen timely sources and eighteen valid risk plans. Give both rates.",
    "The distinct process rates are 14/20=70% and 18/20=90%, not a combined return or mastery score.",
    "Can these two process rates establish learner trading profitability?",
    "No. No audited executed trades, costs, gains or statistical performance model were supplied.",
    "Missing five source records and ten risk plans must remain in the fixed cohort.",
    "Never average unrelated completeness metrics into a fabricated percentage of trading expertise.",
    [
      "percent",
      [
        20,
        25
      ],
      80
    ]
  ],
  [
    41,
    "Identity and source-time independent transfer",
    "At 09:04 a source displays a similarly named issuer; the correct verified filing is not available until 09:20.",
    "How far after the frozen 09:04 cutoff is the official filing?",
    "Sixteen minutes elapse from 09:04 to 09:20, so the verified filing is future evidence.",
    "Can ticker resemblance establish that the 09:04 research subject was the same legal issuer?",
    "No. Without verified legal identity and contemporaneous CIK mapping the case remains WAIT.",
    "An unrelated 07:59 ticker change is corrected by the issuer at 08:08. Can the earlier record use it?",
    "No. The correction occurs nine minutes after the earlier cutoff and must form a distinct update.",
    "What independent identifier is preferable to a similar display name?",
    "Check the original legal issuer and properly attributable CIK or canonical security identifier before reclassifying.",
    "Original issuer identifiers, effective corporate action dates and publication/retrieval times are missing at cutoff.",
    "Do not backfill later issuer verification into a predecessor training decision.",
    [
      "difference",
      [
        20,
        4
      ],
      16
    ]
  ],
  [
    42,
    "Price return versus quoted spread independent transfer",
    "A fictional completed price moves from $20.00 to $21.00, while a later bid of $21.30 and ask of $21.60 imply a $21.45 midpoint.",
    "Calculate the midpoint-normalized spread at the quote cutoff.",
    "The $0.30 spread divided by $21.45 midpoint equals about 1.3986%.",
    "May the earlier five-percent return override a documented one-percent spread ceiling?",
    "No. The separate contemporaneous spread check exceeds the one-percent rule and rejects the candidate.",
    "Could a stock have a negative completed return but a narrow current spread?",
    "Yes. The return and current spread use different observations and denominators and need not share direction.",
    "Does the $21.45 arithmetic midpoint guarantee an order could be completed there?",
    "No. Midpoint, depth and actual execution are different claims.",
    "Quote freshness, level sizes, venue eligibility and actual routing outcome remain unverified.",
    "Do not mix prior-close percentage changes with current bid/ask cost measures.",
    [
      "spreadPct",
      [
        21.3,
        21.6
      ],
      1.3986013986013985
    ]
  ],
  [
    43,
    "Source-completeness unfamiliar cohort",
    "A fictional fixed sample contains thirty-five decisions, twenty-eight with timely original-source records and seven missing documentation.",
    "What proportion of the entire universe is source-complete?",
    "Twenty-eight divided by thirty-five equals exactly 80%.",
    "May the seven undocumented cases be deleted to report a perfect sample?",
    "No. A fixed-universe audit retains all 35 events and separately reports the seven source gaps.",
    "A fresh 40-event review has thirty-three complete before-decision sources. Give the new percentage.",
    "33/40=82.5% of the defined events, leaving seven missing for separate remediation.",
    "Do later profitable outcomes increase the at-cutoff source-quality percentage?",
    "No. Later price direction is distinct from whether timely evidence was present during the actual decision.",
    "Original source URLs, retrieved-at timestamps and missing-record categories need verification.",
    "Selection and survivorship distort the metric when excluded cases are chosen after results.",
    [
      "percent",
      [
        28,
        35
      ],
      80
    ]
  ],
  [
    44,
    "Float turnover independent transfer",
    "A dated estimate states a float of 900,000 shares; a later fictional session records 450,000 shares traded.",
    "What is the session's mechanical turnover relative to that estimated float?",
    "450,000/900,000=0.50 times, or fifty percent of the dated float denominator.",
    "Can this fifty-percent ratio be read as fifty percent of unique shareholders trading?",
    "No. Multiple trades of the same shares and dated float estimates prevent an owner-count inference.",
    "For a separate 620,000-share session and dated 310,000-share float, compute the ratio.",
    "The mechanical ratio is 620,000/310,000=2.0×, which still does not measure unique participants.",
    "Does a turnover ratio establish immediately executable 500-share ask depth?",
    "No. Historical share-volume flow and present resting quotes are different datasets.",
    "Float age, share class, corporate actions, quote depth and executed order evidence are unknown.",
    "Never mistake a float-normalized aggregate turnover statistic for account ownership or guaranteed liquidity.",
    [
      "ratio",
      [
        450000,
        900000
      ],
      0.5
    ]
  ]
];
const ids=new Set();
export const risk60DeepDays25to44V1=Object.freeze(Object.fromEntries(entries.map((
 [day,title,observation,calcQ,calcA,gateQ,gateA,altQ,altA,transferQ,transferA,evidenceCaution,decisionCaution,numericCheck]
)=>{
 const d=String(day).padStart(2,'0');
 const qa=[
 [calcQ,calcA],[gateQ,gateA],[altQ,altA],[transferQ,transferA],
 ['For Risk60 Day '+day+' ('+title+'), which original facts need independent evidence before a live-trading conclusion?',evidenceCaution],
 ['Which precommitted instructional risk boundary controls the '+title+' case?',decisionCaution],
 ['At the fictional decision cutoff, what exactly is observable in '+title+'?',observation+' Record the original fictional cutoff and distinguish it from any later claim.'],
 ['Which denominator, units or calculation rule must be preserved when auditing '+title+'?',calcA+' Document the units and input timestamps rather than substituting a convenient later quote.'],
 ['What evidence gap would prevent a broker-fill or market-causation conclusion in '+title+'?',evidenceCaution+' Do not substitute a narrated or simulated fill for a broker confirmation.'],
 ['How should a learner respond if a later price outcome seems to reward breaking the '+title+' rule?',decisionCaution+' A later outcome cannot change the original evidence available at cutoff.'],
 ['Which independent alternative prevents mechanical reuse of a memorized worked example in '+title+'?',altA+' Treat this as a new fictional observation, not a replay of the initial answer.'],
 ['What separate scenario transfers the '+title+' lesson beyond its original example?',transferA+' The alternative decision still requires verified data and a precommitted gate.']
 ];
 const formativeQuestions=qa.map(([prompt,review],i)=>Object.freeze({
  id:'risk60-D'+d+'-Q'+String(i+1).padStart(2,'0'),prompt,review,graded:false
 }));
 for(const q of formativeQuestions){if(ids.has(q.id)||q.prompt.length<35||q.review.length<45)throw Error('Duplicate or insufficient question '+q.id);ids.add(q.id);}
 const advanced=Object.freeze({
  id:'risk60-D'+d+'-A01',
  scenario:'Fictional independently authored decision for '+title+': '+observation,
  task:calcQ+' '+gateQ+' Explain which information is and is not available at the cutoff.',
  worked:calcA+' '+gateA+' '+evidenceCaution,
  pitfall:decisionCaution+' '+evidenceCaution+' No outcome, order fill or mastery is proven.',
  transfer:transferQ+' '+transferA+' '+altA
 });
 for(const k of ['scenario','task','worked','pitfall','transfer'])if(advanced[k].length<95)throw Error('Short advanced '+k+' D'+day);
 return [day,Object.freeze({
 instructionalFocus:title,formativeQuestions:Object.freeze(formativeQuestions),
 advancedPracticums:Object.freeze([advanced]),numericCheck:Object.freeze({operation:numericCheck[0],inputs:Object.freeze(numericCheck[1]),expected:numericCheck[2]}),
 sourceStatus:'AUTHOR_SOURCE_ONLY_INDEPENDENT_ACCEPTANCE_PENDING'})];
})));
if(Object.keys(risk60DeepDays25to44V1).length!==20)throw Error('Expected exactly 20 separate original Risk60 day records.');
