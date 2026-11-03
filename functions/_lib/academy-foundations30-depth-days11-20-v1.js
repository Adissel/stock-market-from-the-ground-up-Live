import { foundations30Guided240 } from './academy-foundations30-guided-240-v1.js';
/* Original Foundations30 D11–D20 advanced fictional instruction. Additive only; no grading, actual fills, or historical-bar rights. */
const cases=Object.freeze([
  {
    "op": "weighted-average",
    "inputs": [
      40,
      6.2,
      60,
      6.35
    ],
    "expected": 6.29,
    "formula": "(40 × $6.20 + 60 × $6.35) / 100 = $6.29 per modeled share",
    "evidence": "A fictional journal models two planned lots, 40 shares at $6.20 and 60 at $6.35; neither lot represents a broker-confirmed fill.",
    "pitfall": "A modeled average cost cannot prove executed prices, changed risk limits, or a valid later re-entry.",
    "transfer": "Recompute a fresh two-lot hypothetical average and document separate exit-risk and fill uncertainties."
  },
  {
    "op": "difference",
    "inputs": [
      10.12,
      10.05
    ],
    "expected": 0.07,
    "formula": "$10.12 simulated fill − $10.05 displayed reference = $0.07 per share",
    "evidence": "A fictional practice order records a $10.05 reference quotation and a $10.12 modeled fill; venue prints and broker execution identifiers are absent.",
    "pitfall": "The displayed quote is not a guarantee of execution and the simulated $0.07 difference is not an actual customer slippage report.",
    "transfer": "Compare two alternative hypothetical orders with quote staleness and depth assumptions clearly labeled."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      3,
      8
    ],
    "expected": 37.5,
    "formula": "3 observed transitions / 8 predeclared observation intervals × 100 = 37.5%",
    "evidence": "A fictional chart exercise records eight completed observation intervals and three changes meeting a prospectively defined trend-state rule.",
    "pitfall": "A fraction of labeled intervals is neither a universal lifecycle nor a probability that the next candle must reverse.",
    "transfer": "Assess a fresh ten-interval fictional sequence under a predeclared state rule and identify genuinely unclassified intervals."
  },
  {
    "op": "percent-change",
    "inputs": [
      8.1,
      8.55
    ],
    "expected": 5.555555555555555,
    "formula": "($8.55 completed daily close − $8.10 previous close) / $8.10 × 100",
    "evidence": "A fictional completed daily session closes at $8.55 after an $8.10 reference close, with a declared consistent split-adjustment and session basis.",
    "pitfall": "A positive daily percentage is not sufficient to establish a first-green-day setup, catalyst integrity, borrow status, or next-session continuation.",
    "transfer": "Classify a different completed daily bar after several declines and separate known closes from future outcomes."
  },
  {
    "op": "difference",
    "inputs": [
      12.6,
      12.25
    ],
    "expected": 0.35,
    "formula": "$12.60 completed close − $12.25 prior marked level = $0.35",
    "evidence": "A fictional completed candle closes at $12.60 with an earlier documented $12.25 reference level; participation and later retest are unknown.",
    "pitfall": "A close above a prior guide does not prove a filled breakout, sustained demand, or a universal success rate.",
    "transfer": "Create a new breakout and failed-breakout fictional case with a frozen evidence cutoff and an explicit invalidation rule."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      1.9,
      9.5
    ],
    "expected": 20,
    "formula": "($9.50 earlier price − $7.60 later observed price) / $9.50 × 100",
    "evidence": "A fictional observed move falls from $9.50 to $7.60 with no independently confirmed halt, offering, complete order book, or later recovery.",
    "pitfall": "A 20% decline does not establish a panic bottom, stabilization, available liquidity, or a safe rebound entry.",
    "transfer": "Evaluate a fresh falling-price scenario and retain WAIT until an observable, time-stamped stabilization rule is met."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      0.18,
      9
    ],
    "expected": 2,
    "formula": "$0.18 modeled annual borrow charge / $9.00 fictional short exposure × 100",
    "evidence": "A hypothetical short-exposure lesson assumes $9.00 exposure per share and a modeled $0.18 annualized borrow cost for arithmetic only.",
    "pitfall": "The modeled 2% rate is not a current borrow quote, locate approval, actual daily fee, or evidence that loss is capped.",
    "transfer": "Calculate a new hypothetical borrow-cost percentage and list the broker verification and unlimited-loss boundaries."
  },
  {
    "op": "percent-change",
    "inputs": [
      6.4,
      6.08
    ],
    "expected": -5,
    "formula": "($6.08 completed daily close − $6.40 reference close) / $6.40 × 100",
    "evidence": "A fictional completed red daily session closes at $6.08 against a $6.40 prior close; its prior multiday trend is not supplied.",
    "pitfall": "A −5% session does not independently establish first-red-day context, a tradable short, borrow availability, or tomorrow's direction.",
    "transfer": "Build a fresh two-session contrast where the red day is known only at the closing cutoff and the prior run is verified."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      6,
      9
    ],
    "expected": 66.66666666666666,
    "formula": "6 contemporaneously documented source claims / 9 reviewed claims × 100",
    "evidence": "A fictional promotion audit lists nine claims; six have dated contemporaneous primary-source records and three rely only on promotional reposts.",
    "pitfall": "Documentation coverage is not proof of legality or illegality; allegation and adjudicated securities fraud are different evidentiary categories.",
    "transfer": "Audit an unfamiliar fictional advertisement with a payment disclosure and distinguish missing evidence from verified misconduct."
  },
  {
    "op": "difference",
    "inputs": [
      1400000,
      900000
    ],
    "expected": 500000,
    "formula": "1,400,000 fictional session shares − 900,000 comparison shares = 500,000 shares",
    "evidence": "A fictional session has 1.4 million shares of reported trading volume compared with 900,000 in a defined comparable session; short-cover executions are not identified.",
    "pitfall": "Higher total volume cannot identify how many trades were short covering or prove a squeeze, and published short interest may have a different date.",
    "transfer": "Compare fresh fictional volume and dated short-interest snapshots without attributing price moves to an unverified covering motive."
  }
].map(x=>Object.freeze(x)));
export function foundations30DepthDays11to20(base,day) {
 const spec=cases[day-11];
 if(!spec||day<11||day>20||base.day!==day)throw Error('Foundations30 day identity mismatch: '+day);
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
  formativeQuestions:foundations30Guided240(base,day,spec),
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
