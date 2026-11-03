/* Original Foundations30 D01–D10 advanced instruction; ungraded and fictional.
 * Additive to v0.14.0.144 canonical study days. Progress stays in bootcamp.html.
 */
const cases=Object.freeze([
  {
    "op": "ratio-percent",
    "inputs": [
      5,
      7
    ],
    "expected": 71.42857142857143,
    "formula": "5 completed sessions / 7 scheduled × 100",
    "evidence": "A fictional learner schedules seven study sessions and documents five completed lessons with prior questions and a no-trade rule.",
    "pitfall": "Attendance cannot certify independent competency or predict returns.",
    "transfer": "Evaluate a new nine-session calendar where evidence for two sessions is missing."
  },
  {
    "op": "percent-change",
    "inputs": [
      3.2,
      3.6
    ],
    "expected": 12.5,
    "formula": "($3.60 − $3.20)/$3.20 × 100",
    "evidence": "Fictional observed price changes from $3.20 to $3.60 while quotes, spread and available execution size have not been verified.",
    "pitfall": "A gainers percentage is not proof of liquidity, achievable entry, or prospective profit.",
    "transfer": "Compare an independent $1 increase against two different initial prices and quote windows."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      14,
      20
    ],
    "expected": 70,
    "formula": "14 contemporaneous journal records / 20 decisions × 100",
    "evidence": "A fictional study journal has twenty reviewed decisions, of which fourteen retain their actual pre-outcome source timestamps.",
    "pitfall": "Only documenting winning screenshots does not measure true performance or instructional mastery.",
    "transfer": "Audit twelve fresh practice records for missing entry-time evidence rather than later chart outcomes."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      180000,
      1200000
    ],
    "expected": 15,
    "formula": "180,000 traded shares / 1,200,000 estimated float × 100",
    "evidence": "A fictional company reports 180,000 shares of volume and a dated float estimate of 1.2 million shares without any unique owner ledger.",
    "pitfall": "A volume-to-float ratio does not count unique owners or prove any share was traded just once.",
    "transfer": "Recalculate using a separate split-adjusted float and compare effective dates."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      0.2,
      0.5
    ],
    "expected": 40,
    "formula": "$0.20 candle body / $0.50 high-to-low range × 100",
    "evidence": "A completed fictional candle opens at $8.05, closes at $8.25, has high $8.40 and low $7.90; no tick sequence is known.",
    "pitfall": "OHLC candle color and wicks do not establish which extreme occurred first or the next bar.",
    "transfer": "Audit a different down candle and identify unknown intrabar event order."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      0.15,
      12.475
    ],
    "expected": 1.2024048096192386,
    "formula": "($12.55 ask − $12.40 bid) / $12.475 midpoint × 100",
    "evidence": "A synchronized fictional quote shows $12.40 bid and $12.55 ask but leaves displayed size, provenance and age uncertain.",
    "pitfall": "The quoted midpoint spread does not guarantee fills at the displayed bid or ask.",
    "transfer": "Evaluate a fresh quote where one side is several minutes stale."
  },
  {
    "op": "difference",
    "inputs": [
      43,
      31
    ],
    "expected": 12,
    "formula": "08:43 revised statement − 08:31 initial statement, minutes",
    "evidence": "A fictional company issues a conditional disclosure at 08:31 ET and a revised statement at 08:43 ET; the decision cutoff is 08:38 ET.",
    "pitfall": "A revised release cannot be retroactively used as proof for an earlier decision.",
    "transfer": "Create a different three-event news, issuer and chart chronology with a frozen cutoff."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      7,
      12
    ],
    "expected": 58.333333333333336,
    "formula": "7 qualifying scanner rows / 12 total × 100",
    "evidence": "Seven of twelve fictional scanner records pass declared universe, interval, volume and quote-freshness gates before catalyst verification.",
    "pitfall": "A passing scanner result does not authorize a trade or certify its catalyst.",
    "transfer": "Reassess a fresh fictional scanner with zero reference volume and an unknown quote time."
  },
  {
    "op": "difference",
    "inputs": [
      21.1,
      20.8
    ],
    "expected": 0.3000000000000007,
    "formula": "$21.10 completed close − $20.80 marked reference level",
    "evidence": "A fictional candle closes at $21.10 above an earlier marked $20.80 level, but future behavior and actual resting orders are not recorded.",
    "pitfall": "A horizontal guide cannot prove market-maker support, fill depth or a guaranteed reversal.",
    "transfer": "Mark a different horizontal level and record the independent disconfirmation rule."
  },
  {
    "op": "min-floors",
    "inputs": [
      75,
      0.3,
      1800,
      15
    ],
    "expected": 120,
    "formula": "min(floor($75 risk/$0.30 risk per share),floor($1,800 notional/$15 price))",
    "evidence": "A fictional position-sizing drill limits modeled price risk to $75, notional to $1,800 and per-share risk to $0.30 at $15.",
    "pitfall": "Sizing only from the risk amount can exceed buying-power or notional restrictions.",
    "transfer": "Recompute a different risk-budget and notional-cap case, accounting for hypothetical slippage."
  }
].map(x=>Object.freeze(x)));
const actionSteps=Object.freeze([
 ['Identify the decision-time evidence and cutoff.',(s,b)=>s.evidence+' Preserve the originally observed source time.'],
 ['Explain the objective without claiming a future result.',(s,b)=>b.objective+' '+b.observe],
 ['State the mathematical inputs and unit conventions.',s=>s.formula+' Use a consistent denominator and declared measurement window.'],
 ['Independently calculate the worked measure.',s=>s.formula+' = '+s.expected+' using only the fictional data provided.'],
 ['Explain what the number measures and what it cannot prove.',s=>s.pitfall+' This number is descriptive rather than a performance forecast.'],
 ['Diagnose the most likely learner misconception.',s=>s.pitfall+' Correct this inference before proceeding.'],
 ['Reapply the original verification procedure.',(s,b)=>b.observe+' Document source, time, session and uncertainty.'],
 ['Attempt the existing canonical practice case.',(s,b)=>b.practice+' No invented order or unverified market print.'],
 ['Write a mandatory WAIT or NO TRADE trigger.',s=>s.pitfall+' If core evidence is missing, retain WAIT.'],
 ['Identify absent information and alternate explanations.',(s,b)=>b.caution+' The fictional case is not a causal proof.'],
 ['Apply the method independently to different evidence.',s=>s.transfer+' Use new fictional inputs and an explicit cutoff.'],
 ['Review process separately from any later outcome.',s=>'Preserve the first decision before future prices are seen. '+s.pitfall]
]);
export function foundations30DepthDays01to10(base,day) {
 const spec=cases[day-1];
 if(!spec||day<1||day>10||base.day!==day)throw Error('Foundations30 day identity mismatch: '+day);
 const prefix='FOUNDATIONS30-D'+String(day).padStart(2,'0')+'-ADV-';
 const example=spec.formula+' = '+spec.expected+'. '+spec.evidence+' '+spec.pitfall;
 const advanced=Object.freeze({
  title:base.title,
  explanation:base.objective+' '+base.observe+' '+spec.evidence+' '+spec.pitfall,
  workedExample:'FICTIONAL TRAINING CASE — '+example,
  sourceProcedure:Object.freeze([
   'Freeze the original decision time, session, data origin and missing observations.',
   base.observe,
   'State numerator, denominator, units and calculation: '+spec.formula+'.',
   'Recalculate without future bars; independently list the unknowns.',
   base.practice,
   'Write a rejection or WAIT rule and preserve the original attempt.'
  ]),
  transfer:'FRESH FICTIONAL INDEPENDENT TRANSFER — '+spec.transfer+' '+base.practice,
  reviewGuide:'CORRECTIVE REVIEW — '+spec.pitfall+' '+base.caution,
  selfCheck:'FICTIONAL: '+spec.transfer+' What evidence would invalidate the conclusion?',
  error:spec.pitfall,
  whenNot:'Never imply a verified historical feed, guaranteed executable fill, official assessment, course mastery or live trading outcome.',
  investigation:'FRESH FICTIONAL TRANSFER CASE — '+spec.transfer+' Preserve original evidence and the cutoff.',
  reference:Object.freeze({
   label:day===1||day===10?'FINRA official investor-risk reference':'SEC Investor.gov official investor education',
   url:day===1||day===10?'https://www.finra.org/investors/insights/understanding-new-intraday-margin-requirements':'https://www.investor.gov/',
   scope:'General official investor-education context; the fictional price, quantity, and outcome are not source-verified market data.'
  }),
  formativeQuestions:Object.freeze(actionSteps.map(([action,correct],i)=>Object.freeze({
   id:prefix+'Q'+String(i+1).padStart(2,'0'),
   prompt:'Foundations30 day '+day+' — '+base.title+': '+action+' FICTIONAL EVIDENCE: '+spec.evidence,
   review:'Day '+day+' guided review: '+correct(spec,base)+' Ungraded teaching; no protected answer key.'
  }))),
  advancedPracticums:Object.freeze([Object.freeze({
   id:prefix+'CASE',
   scenario:'FICTIONAL ADVANCED FOUNDATIONS CASE — '+spec.evidence,
   task:'Calculate '+spec.formula+' while applying the original course objective, source cutoff and mandatory no-trade gates: '+base.objective,
   worked:example+' This calculation is educational and ungraded; original order execution is not established.',
   pitfall:'COMMON MISCONCEPTION: '+spec.pitfall+' '+base.caution+' Preserve unknown evidence.',
   transfer:'INDEPENDENT FICTIONAL TRANSFER: '+spec.transfer+' Write a prospective WAIT condition and do not use future prices.'
  })]),
  advancedNumericChecks:Object.freeze([Object.freeze({
   operation:spec.op,inputs:Object.freeze([...spec.inputs]),expected:spec.expected,
   formula:spec.formula,units:'explicit day-specific fictional measurement',
   note:spec.evidence
  })]),
  status:'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING',
  supplementarySourceStatus:'ORIGINAL_FOUNDATIONS30_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'
 });
 return Object.freeze({...base.lesson,
  formativeQuestions:advanced.formativeQuestions,
  advancedPracticums:advanced.advancedPracticums,
  advancedNumericChecks:advanced.advancedNumericChecks,
  supplementarySourceStatus:advanced.supplementarySourceStatus,
  advancedSupplementalCoaching:advanced
 });
}
