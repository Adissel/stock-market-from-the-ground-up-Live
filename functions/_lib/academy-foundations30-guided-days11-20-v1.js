/* Foundations30 D11–20: original, day-specific, ungraded Socratic questions and corrective reviews.
 * These are learner-facing practice prompts, never protected exam keys or independent editorial approval.
 */
const authored = {
  "11": [
    [
      "Before combining the two planned lots, which evidence would establish that either lot was actually executed?",
      "Record broker confirmations with timestamps, quantities, execution prices, and account identifiers. A modeled allocation is not proof of an executed position."
    ],
    [
      "Why is the original planned size not interchangeable with current exposure after a partial reduction?",
      "Track each independently verified addition or reduction in chronological order. Outstanding orders, partial fills, and cancellations may change exposure."
    ],
    [
      "Calculate the modeled weighted average for forty shares at $6.20 and sixty at $6.35.",
      "The hypothetical numerator is $248 plus $381, giving $629 over 100 shares or $6.29 per share. Fees and fills remain unverified."
    ],
    [
      "What does the $6.29 modeled average omit when evaluating total risk after an added lot?",
      "An average price alone omits intended exits, stop distance, remaining size, slippage, fees, and whether either order actually executed."
    ],
    [
      "Which journal fields must be recorded before asserting that a later exit changed the position?",
      "Keep planned versus broker-confirmed quantity, time, price, order state, remaining shares, and revised risk separately; do not backfill after seeing prices."
    ],
    [
      "A learner calls the average entry a confirmed cost basis without fill receipts. What inference is unsupported?",
      "There is no verified position or realized cost basis. The calculation describes fictional intended lots only; broker records are required for actual transactions."
    ],
    [
      "If sixty intended shares were cancelled rather than filled, what must happen to the computed position?",
      "The canceled lot must not be counted as exposure. Recalculate using only verifiable fills and retain the cancellation event in the audit trail."
    ],
    [
      "How would you document a proposed scale-out without claiming that the displayed target was reachable?",
      "Write the prospective order conditions, size, quote and time assumptions, then distinguish intended reduction from confirmed executed reduction."
    ],
    [
      "Give one prospective WAIT condition before increasing a modeled position after the first lot.",
      "Retain WAIT if the added quantity would breach risk or notional caps, current spread is unknown, or the first fill cannot be verified."
    ],
    [
      "Could a later favorable chart move prove the original scaling plan was sound? Explain the limitation.",
      "No. Later prices cannot establish what was knowable at the decision pause, whether risk rules were followed, or whether the intended orders filled."
    ],
    [
      "Design a new two-lot example whose size weights differ and state what new evidence would be needed.",
      "Compute total modeled consideration divided by total modeled shares. Independently request fill records, contemporaneous quotes, and revised exit-risk assumptions."
    ],
    [
      "When reviewing an unsuccessful fictional scale-out, what separates a process error from outcome variability?",
      "Compare the frozen original rule and known evidence with what was documented at execution time; do not label an outcome alone as a rule failure."
    ]
  ],
  "12": [
    [
      "What is the evidentiary difference between a market print, a displayed quote, a simulated order, and a brokerage fill?",
      "A print is a recorded transaction, a quote indicates displayed interest, simulation assumes execution, and a broker fill documents a specific account execution."
    ],
    [
      "Which source fields must be preserved with the fictional $10.05 reference quote?",
      "Record feed, time, session, bid, ask, size, and snapshot provenance. A single price without these details is incomplete execution evidence."
    ],
    [
      "Find the per-share difference between a $10.12 modeled fill and a $10.05 displayed reference.",
      "Subtract $10.05 from $10.12 to obtain a modeled $0.07 per share. It is not a verified real slippage measurement."
    ],
    [
      "If 100 hypothetical shares received the $0.07 modeled difference, what arithmetic follows and what does not?",
      "One hundred times $0.07 equals $7 of hypothetical price difference before fees. No actual cost or order execution can be inferred."
    ],
    [
      "Why can a quote be unusable even if its last price is identical to the model?",
      "The quote may be stale, from another session or venue, without sufficient displayed size, or not executable when the order would arrive."
    ],
    [
      "A member reports simulated order results as actual realized returns. What must the review correct?",
      "Reclassify them as fictional modeled outcomes. Only independently reconciled brokerage confirmations and cash records support actual realized performance."
    ],
    [
      "How do variable spread and depth affect a paper order whose simulator assumes an immediate fill?",
      "A simplified model may not capture queue position, partial fills, impact, latency, or available quantity. Treat its execution assumption explicitly."
    ],
    [
      "Which data would let an auditor reconcile an actual trade rather than just a simulated chart observation?",
      "Obtain dated account-specific order and execution records, fees, cancellations, quantities, and settlement information; chart candles alone are insufficient."
    ],
    [
      "State a NO TRADE or WAIT rule when the best quote is old or executable size is unknown.",
      "Do not infer executable liquidity. Require current source-backed bid, ask, depth and risk validation before making a real execution claim."
    ],
    [
      "Name two different explanations for a modeled difference that do not establish real slippage.",
      "Reference prices may use a different timestamp or side of market, and the simulation may use an arbitrary fill model rather than venue executions."
    ],
    [
      "Construct a new hypothetical limit-order example and identify both an unfilled and partially filled path.",
      "Represent acceptance, time, displayed conditions, eligible fill quantity, and cancellation separately; do not force the model to report a full fill."
    ],
    [
      "How should review notes separate a good simulation procedure from a favorable fictional profit outcome?",
      "Assess whether inputs, model limits, risk and source times were recorded before results; profit in one synthetic path is not independent validation."
    ]
  ],
  "13": [
    [
      "What observation rule would allow a trend-state label without assuming every security follows a fixed lifecycle?",
      "Declare measurable completed-bar conditions in advance, including timeframes and invalidations; permit ambiguous or unclassified states instead of forcing a sequence."
    ],
    [
      "How would you verify that eight observed intervals share the same timeframe and session convention?",
      "Use a single defined timeframe, time zone, completed-bar cutoff and price adjustment basis; mixed intervals cannot support the same state tally."
    ],
    [
      "Calculate the fraction of eight intervals that contain three prospectively defined transitions.",
      "Three divided by eight times 100 equals 37.5% of the observed intervals. This measures classification frequency, not trade success."
    ],
    [
      "What cannot be deduced from a 37.5% transition frequency about the next candle?",
      "No probability of the next direction, inevitability of a reversal, or universal stage order is demonstrated by this small fictional tally."
    ],
    [
      "Which completed observations could distinguish consolidation from an accelerating move?",
      "Check bounded price range, relative range expansion, volume window and completed-bar structure. The distinction may remain unknown with sparse data."
    ],
    [
      "A learner labels all eight intervals with a predetermined seven-stage path. Identify the bias.",
      "The labels were imposed by a narrative rather than earned by measurable evidence. Multiple pathways and missing state labels must remain possible."
    ],
    [
      "Which timestamp should be frozen before describing a transition that appears obvious after later bars?",
      "Use the final observation available at the decision pause, not the later reversal, breakout, or subsequently revised indicator history."
    ],
    [
      "Write a method for comparing two plausible next-state scenarios from the same observed bars.",
      "List evidence that would support continuation and evidence that would invalidate it; record both conditionally before the following candle appears."
    ],
    [
      "When should an instructor select WAIT instead of assigning a definitive movement phase?",
      "Use WAIT when bar completeness, time alignment, trend thresholds or causal observations are insufficient to distinguish the competing states."
    ],
    [
      "Why does the same price move admit more than one reasonable classification?",
      "Timeframe, baseline, liquidity and prior context may alter interpretation, and OHLC cannot reconstruct all underlying intrabar event sequences."
    ],
    [
      "Create a new ten-interval fictional sequence and define its transition-count denominator.",
      "Count only eligible completed intervals under a frozen classification rule; report unclassified observations separately rather than silently excluding them."
    ],
    [
      "How would an outcome-blind reviewer judge whether a prior state annotation followed its original method?",
      "Compare the archived criteria, data cutoff and observed bars to the labels; ignore whether a favorable later trade happened."
    ]
  ],
  "14": [
    [
      "What prior daily sequence is needed before calling a positive close a first-green-day observation?",
      "Verify the preceding declining or non-green context, exact daily session boundaries, corporate actions and a defined first-positive criterion."
    ],
    [
      "How does an $8.10 reference close differ from evidence about why the subsequent session moved?",
      "The prior close is a numerical baseline. It does not verify a catalyst, liquidity, a trade or the cause of later price changes."
    ],
    [
      "Calculate the percent change from the fictional $8.10 close to the completed $8.55 close.",
      "The change is $0.45 divided by $8.10, or approximately 5.56%. The denominator is the comparable prior close."
    ],
    [
      "Why must the session close be completed before asserting that the day finished green?",
      "An intraday upward move can reverse by the close; the daily bar classification is not final until the specified session boundary."
    ],
    [
      "Which corporate-action mismatch could make the $8.10 to $8.55 comparison misleading?",
      "A split or adjustment convention change can alter comparable share prices. Use a consistent series and the verified action-effective date."
    ],
    [
      "A learner concludes a green close guarantees a second green session. What evidence is missing?",
      "The first completed daily candle cannot establish the next session's price path, executable fills, independent catalyst strength or continuation odds."
    ],
    [
      "What additional source observations are relevant before studying the fictional green day as a setup?",
      "Check dated issuer news, quote/spread evidence, actual trading-session definition, previous trend and volume comparability, all at the proper cutoff."
    ],
    [
      "Build a prospective counterexample that would invalidate the setup classification.",
      "Specify missing prior decline, stale adjustment basis, incomplete daily bar or unverified catalyst as reasons not to apply the original label."
    ],
    [
      "When is WAIT preferable to calling an intraday green candle a confirmed first green day?",
      "Retain WAIT until the daily session is complete and the prior context and comparable data are verified. Do not substitute a five-minute bar."
    ],
    [
      "Could a post-close rally prove the original first-green-day selection was executable? Why not?",
      "A later rally does not provide actual order placement, contemporaneous depth or fill evidence and must not be backdated into the earlier decision."
    ],
    [
      "Design a fresh fictional daily comparison with a different preceding decline and an opposite session close.",
      "Use consistent completed daily closes and a new baseline; report the classification independently of whether later prices are favorable."
    ],
    [
      "How would you review a correct NO TRADE decision if the fictional security later rallies?",
      "Measure compliance with prospective evidence requirements, not the missed hypothetical upside. Preserve the original decision and its known limitations."
    ]
  ],
  "15": [
    [
      "Which dated price records define a prior resistance level before the current fictional breakout test?",
      "Use completed historical session observations with a verified adjustment basis and record the level before inspecting the later breakout candle."
    ],
    [
      "Why is a $12.25 marked guide not equivalent to a verified resting order at that price?",
      "A chart line records an analyst's reference, not an order book or commitment to supply liquidity; it cannot guarantee a fill."
    ],
    [
      "Compute how far the completed $12.60 close lies above the $12.25 marked level.",
      "Subtract $12.25 from $12.60 to obtain $0.35 per share. It is an observed price difference, not realized trade profit."
    ],
    [
      "What additional observations are needed before interpreting a break above the reference as confirmed participation?",
      "Check comparable session volume, quote freshness, depth and whether bars are complete; the positive difference alone is insufficient."
    ],
    [
      "Which time and data adjustments matter when using historical former-runner levels?",
      "Record original sessions, corporate actions, timeframe and source. A stale or split-inconsistent reference can generate a false breakout."
    ],
    [
      "A learner treats three prior touches as proof of an inevitable breakout. What is unsupported?",
      "Touch counts are descriptive, not a universal probability or causal force. A reference can fail without making earlier price observations invalid."
    ],
    [
      "Draft a separate confirmation scenario and failed-breakout scenario without assuming the following price.",
      "Define a qualifying completed close, participation threshold and disconfirmation or reversal condition beforehand; maintain both conditional pathways."
    ],
    [
      "What should the journal capture if a fictional break exceeds the guide but then returns below it?",
      "Preserve the initial plan, cutoff, level, subsequent invalidation and whether any order was modeled or executed; avoid rewriting the first decision."
    ],
    [
      "Which missing information should trigger WAIT before declaring the breakout actionable?",
      "Retain WAIT if current spread/depth, corporate-action adjustments or original level timestamp cannot be established."
    ],
    [
      "Why does a post-breakout retest not verify an earlier order fill?",
      "Historical high-low candles do not prove queue position, order type or actual execution; later touches do not reconstruct the original book."
    ],
    [
      "Create a new fictional resistance study using a different price scale and an explicit rejection rule.",
      "Mark the earlier level and use a new completed-bar comparison. State the separate volume and liquidity data required before interpreting execution."
    ],
    [
      "How could an independent reviewer score the method without assigning a profitable-trade grade?",
      "Check that level selection, source, cutoff, disconfirmation and uncertainty were recorded in advance. The later return alone does not measure skill."
    ]
  ],
  "16": [
    [
      "What contemporaneous observations would distinguish a fast selloff from a proven catalyst-driven panic?",
      "Record dated disclosures, halts, spread, volume, session and completed bars. A large decline without these sources does not establish motive."
    ],
    [
      "Which evidence is still missing when price is observed falling from $9.50 to $7.60?",
      "The model lacks order-book depth, independent catalyst confirmation, stabilization, verified executions and the subsequent path."
    ],
    [
      "Compute the fictional decline from $9.50 to $7.60 as a percent of the earlier price.",
      "The decrease is $1.90 divided by $9.50, or 20%. The earlier $9.50 price is the percentage denominator."
    ],
    [
      "Why does a 20% decline not identify a floor from which a rebound must start?",
      "A percentage change says nothing about the availability of buyers, remaining forced sales, borrow pressure or a verified recovery signal."
    ],
    [
      "How might a trading halt or new offering change interpretation of the same price drop?",
      "Market access, information timing and liquidity conditions can differ greatly. Check primary sources and halt records before classifying the event."
    ],
    [
      "A learner calls every sharp red candle a dip-buying opportunity. What causal leap is involved?",
      "A downward candle cannot establish stabilization, future demand or a tradable price. The absence of recovery evidence must remain explicit."
    ],
    [
      "Define a stabilization observation that could be verified prospectively without using later candles.",
      "Specify completed-bar behavior, quote quality, time window and invalidation threshold; never describe later price improvement as already visible."
    ],
    [
      "Record two distinct WAIT conditions for a possible fictional recovery attempt.",
      "Retain WAIT when a halt or offering is unresolved, or when spreads and depth cannot support the modeled quantity and stop assumptions."
    ],
    [
      "How would a NO TRADE response differ if the source reveals continuing selling or unverified liquidity?",
      "Document the failed source or execution gate and decline the hypothetical setup; a dramatic decline is not permission to ignore controls."
    ],
    [
      "Why is an eventual large bounce insufficient to reclassify the first observed plunge as a safe setup?",
      "The bounce is future information relative to the earlier cutoff. It does not verify the original available risk, depth or expected fill."
    ],
    [
      "Construct a different fictional decline and describe what independent evidence would justify only reconsideration.",
      "Use a new dated price interval, verify current source and quote conditions, and keep a conditional no-trade gate until stabilization is observed."
    ],
    [
      "Which process measures are appropriate when reviewing a skipped panic that later recovered?",
      "Evaluate source verification, cutoff discipline and adherence to risk rules rather than assigning an error based solely on hypothetical missed profit."
    ]
  ],
  "17": [
    [
      "What broker-specific information must be checked before assuming a security can be sold short?",
      "Verify current locate availability, loan terms, margin, recall possibility, order restrictions and fee conventions with the relevant broker."
    ],
    [
      "Why is a dated short-interest report not evidence of current borrow available to this member?",
      "Short interest aggregates reported positions at a prior date. It does not certify shares available for a specific account or order now."
    ],
    [
      "Calculate $0.18 modeled annual borrow cost as a percentage of $9.00 fictional exposure.",
      "Divide $0.18 by $9.00 and multiply by 100 to get 2%. The example does not constitute a live stock-loan rate."
    ],
    [
      "What units and rate convention must be known before converting a borrow-rate quote into a daily cost?",
      "Identify annualization basis, actual principal, fee accrual method, loan duration and broker rules; a flat per-share example is insufficient."
    ],
    [
      "Why is a long position's potential loss floor not a valid short-position loss cap?",
      "A short seller may face prices rising beyond the initial sale price, with theoretically unbounded price exposure and additional borrowing or recall costs."
    ],
    [
      "A member treats the fictional 2% number as a verified borrow quote. What correction is required?",
      "Mark it as modeled arithmetic only. Current availability, exact charges, locate conditions and broker confirmation are not established."
    ],
    [
      "Which chronological records are necessary to audit a short-sale hypothetical versus a real fill?",
      "Separate modeled order conditions from dated actual broker borrow approvals, executions, costs, margin and closing transactions."
    ],
    [
      "How would a borrow recall alter an otherwise unchanged fictional chart thesis?",
      "Recall can force action independently of the chart pattern. Include operational triggers and broker-specific timing in the risk review."
    ],
    [
      "State a mandatory NO TRADE rule when locate status or acceptable loss exposure cannot be verified.",
      "Retain NO TRADE when broker authorization, loan availability, margin coverage or risk constraints are absent, regardless of a bearish chart idea."
    ],
    [
      "Why does a downward price candle not identify the actual short borrow fee or execution opportunity?",
      "OHLC has no broker stock-loan ledger or account-specific availability; transaction and financing assumptions must be independently documented."
    ],
    [
      "Build a new fictional borrow-cost exercise with a different exposure and a clearly stated annualization.",
      "Compute cost divided by exposure with consistent units, and list remaining quote, day-count, recall and price-risk uncertainties."
    ],
    [
      "How should an independent reviewer handle a profitable hypothetical short with missing locate evidence?",
      "Flag the process as unsupported even if the later price path favors it. A modeled profit does not retroactively produce regulatory or broker permissions."
    ]
  ],
  "18": [
    [
      "What multiday price context must precede a first-red-day label rather than just any red candle?",
      "Verify the prior run's comparable completed sessions, reference closes and the current daily close against a predeclared first-red definition."
    ],
    [
      "Which daily-session boundary is necessary for comparing $6.40 and $6.08?",
      "Use matched regular-session or other explicitly defined close conventions and a consistent split-adjustment basis; intraday snapshots are not final closes."
    ],
    [
      "Calculate the percent change from the $6.40 reference close to the $6.08 completed close.",
      "The difference is negative $0.32; divide by $6.40 and multiply by 100 to get a fictional −5% daily change."
    ],
    [
      "Why does a negative daily change fail to prove that a short entry was executable?",
      "Daily closes omit account borrow permission, spread, depth, intraday sequence and any actual order confirmations."
    ],
    [
      "How might a split adjustment or incorrect prior-close time create a false first-red signal?",
      "Misaligned reference prices can fabricate direction or magnitude. Verify corporate actions and source dates before applying the label."
    ],
    [
      "A learner calls every −5% day the start of a multiday reversal. What is unjustified?",
      "One red session cannot establish a future trajectory, first-red eligibility, catalyst significance or probability of a continued decline."
    ],
    [
      "Which evidence should be frozen before discussing a red candle that formed only at session close?",
      "Record the prior context, data source, close definition and contemporaneous observations; do not imply the final bar was known earlier."
    ],
    [
      "Write two conditional interpretations of an identical red close given different prior runs.",
      "After a verified multiday run it may meet one descriptive setup; without that context it remains only a red daily candle."
    ],
    [
      "Which unknown borrow or quote condition should force WAIT or NO TRADE for a bearish hypothetical?",
      "Absent borrow approval, current spread, risk budget or complete prior context, do not convert the descriptive label into an execution decision."
    ],
    [
      "Why can a subsequent decline not prove that an earlier first-red-day classification was correct?",
      "The earlier classification must meet its own contemporaneous criteria. Later returns do not supply missing prior-run or broker evidence."
    ],
    [
      "Construct a new completed daily red candle from different prices with an explicit prior-run test.",
      "Recalculate the percent change from the comparable prior close, then separately establish or reject the first-red contextual criterion."
    ],
    [
      "How should a reviewer classify a correctly rejected short idea if the price later falls further?",
      "It remains a sound evidence-bound rejection if mandatory information was absent. Avoid marking hypothetical missed opportunity as a realized loss."
    ]
  ],
  "19": [
    [
      "What sources should be distinguished when investigating issuer disclosures and promotional messages?",
      "Separate primary SEC/issuer filings, paid third-party material, reposts, and independent verification records; preserve attribution and publication timestamps."
    ],
    [
      "Why are nine promotional claims not equivalent to nine independently documented facts?",
      "Every claim requires its own supporting source and scope. Repetition across paid channels does not increase primary-source confirmation."
    ],
    [
      "Compute the documentation coverage when six of nine fictional claims have contemporaneous source records.",
      "Six divided by nine times 100 is approximately 66.67%. This is a record-coverage measure, not a legal compliance score."
    ],
    [
      "What does the one-third unsupported share tell an auditor, and what does it not prove?",
      "Three claims lack the specified documentation. That gap alone does not establish intent, securities fraud, unlawful promotion or market impact."
    ],
    [
      "Why do payment and sponsorship disclosures matter when evaluating the provenance of a promotional message?",
      "Compensation and source incentives help characterize the communication; whether particular conduct is lawful needs fact-specific jurisdictional and professional review."
    ],
    [
      "A learner concludes the fictional promotion is proven illegal because source coverage is incomplete. Correct the inference.",
      "Missing substantiation warrants scrutiny and qualified language, not a categorical fraud finding. Preserve allegation, verification and adjudication as separate categories."
    ],
    [
      "How would you cross-check a promotional contract claim against the primary issuer document?",
      "Find the original dated filing or release, compare conditional wording, confirm parties and scope, and record any amendments rather than trusting paraphrases."
    ],
    [
      "Which neutral language should the research record use for an unresolved contradictory advertisement?",
      "State that the claim is unverified or conflicts with a dated source. Avoid asserting intentional deception or illegality without supported findings."
    ],
    [
      "When should the lesson require WAIT instead of treating the promoted ticker as vetted?",
      "Retain WAIT when primary-source language, issuer identity, sponsor compensation or publication chronology cannot be verified."
    ],
    [
      "Why can a sharp subsequent price move not independently establish promotion-driven market manipulation?",
      "Price action alone does not reveal speakers' intent, trading linkage, legal elements or other concurrent causes of the move."
    ],
    [
      "Design a fresh fictional advertisement audit distinguishing sponsored material from an issuer's original release.",
      "Record who paid, what was claimed, when it appeared, the primary-source citation and the unresolved questions in separate fields."
    ],
    [
      "What evidence would a reviewer require before accepting an allegation about specific illegal market conduct?",
      "A factual and legally relevant record, verified sources and appropriate professional review are needed; the instructional calculation alone cannot decide liability."
    ]
  ],
  "20": [
    [
      "Which separate evidence sets would be needed before describing a price rise as caused by short covering?",
      "Look for dated short-interest/loan information, contemporaneous executions if lawfully available, corporate events and alternative catalysts; avoid assuming covering from candles."
    ],
    [
      "Why can session trading volume exceed the outstanding short position without proving a squeeze?",
      "Volume counts repeated transactions and does not identify unique shares, buyer motivations or short-cover quantity."
    ],
    [
      "Compute the difference between fictional session volumes of 1.4 million and 900,000 shares.",
      "Subtract 900,000 from 1,400,000 to obtain 500,000 additional shares traded in the specified comparison."
    ],
    [
      "What does an increase of 500,000 aggregate shares not reveal about the buyers?",
      "It does not identify which executions closed shorts, opened longs, involved the same shares repeatedly, or were affected by broker borrow rules."
    ],
    [
      "How can short-interest report dates make a same-day covering explanation unreliable?",
      "Published short interest may reflect an earlier reporting period, while intraday volumes and current stock loans are on different clocks."
    ],
    [
      "A learner calls any high-volume upward bar proof of forced short covering. Identify the unsupported link.",
      "Neither price nor total volume assigns trade motive. A squeeze remains a hypothesis until sufficiently specific independent evidence is available."
    ],
    [
      "Which corporate action or issuer event could provide an alternate explanation for a sudden price move?",
      "A disclosure, halt, split adjustment or broader market event may change participation; record precise dates and avoid asserting a unique cause."
    ],
    [
      "How would you distinguish a high-volume observation from a claim about executable liquidity?",
      "Aggregate volume is past execution; current bid-ask depth, spread and order size must be independently verified for an execution model."
    ],
    [
      "What NO TRADE conditions remain appropriate during a suspected squeeze with uncertain borrow or halts?",
      "Retain NO TRADE if borrow/locate, risk cap, current liquidity or orderly execution cannot be established; a dramatic chart is not an exemption."
    ],
    [
      "Why can a later sudden reversal not prove the earlier rise was definitely a short squeeze?",
      "Reversal timing does not reveal previous trade motives, actual forced covering, or which competing disclosure drove prices."
    ],
    [
      "Build a fresh fictional volume comparison and identify the dated short-interest record separately.",
      "Compute share-volume differences in common session units, then state the incompatible timing and information limits of a short-interest snapshot."
    ],
    [
      "How would a neutral reviewer distinguish a plausible squeeze hypothesis from verified historical evidence?",
      "Label the hypothesis, sources, observation window, alternatives and missing proof; do not present a fictional case or price pattern as verified covering."
    ]
  ]
};
export const foundations30GuidedD11to20 = Object.freeze(Object.fromEntries(Object.entries(authored).map(([day,rows])=>[day,Object.freeze(rows.map(([question,review])=>Object.freeze({question,review})))])));
