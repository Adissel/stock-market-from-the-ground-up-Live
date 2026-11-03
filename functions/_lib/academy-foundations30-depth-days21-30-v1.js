import { foundations30Guided240 } from './academy-foundations30-guided-240-v1.js';
/* Original Foundations30 D21–D30 advanced fictional instruction. Preserve the existing shared engine, source and grading boundaries. */
const cases=Object.freeze([
  {
    "op": "ratio-percent",
    "inputs": [
      4,
      9
    ],
    "expected": 44.44444444444444,
    "formula": "4 relevant filings / 9 dated candidate records × 100",
    "evidence": "Nine fictional companies appear in one promotional theme list, but only four have independently timestamped documents supporting the specific claimed industry association.",
    "pitfall": "A theme mention does not establish equivalent financial exposure or guarantee two prices are correlated.",
    "transfer": "Construct another fictional sector pair and reject a thematic match where source evidence is missing."
  },
  {
    "op": "difference",
    "inputs": [
      1.25,
      0.6
    ],
    "expected": 0.65,
    "formula": "1.25% quoted spread − 0.60% quoted spread = 0.65 percentage points",
    "evidence": "Two fictional similarly themed securities have synchronized midpoint-spread readings of 1.25% and 0.60%, but only one has a verifiable issuer relationship.",
    "pitfall": "A relative spread difference cannot independently validate a leader-sympathy link, available depth, or actual execution.",
    "transfer": "Compare a different candidate pair with a stronger source relationship but an older or wider quote."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      7,
      20
    ],
    "expected": 35,
    "formula": "7 prospectively eligible cases / 20 predeclared setup observations × 100",
    "evidence": "A fictional prospective research register contains twenty observations and seven satisfy a source, risk, and quote-freshness rule before outcomes are considered.",
    "pitfall": "The 35% eligibility fraction is not a strategy win rate, expectancy estimate, or invitation to optimize after seeing winners.",
    "transfer": "Create a preregistered test rule for a different sample and distinguish eligibility from later returns."
  },
  {
    "op": "difference",
    "inputs": [
      40,
      27
    ],
    "expected": 13,
    "formula": "08:40 ET issuer clarification − 08:27 ET original filing = 13 minutes",
    "evidence": "A fictional company first publishes a conditional 08:27 ET filing and issues a separate clarification at 08:40 ET; the research decision was frozen at 08:32 ET.",
    "pitfall": "An accepted filing or later amendment cannot retroactively prove information available to an earlier decision or prove disclosed claims true.",
    "transfer": "Audit a different fictional EDGAR accession and compare acceptance, availability and revision times."
  },
  {
    "op": "difference",
    "inputs": [
      7.5,
      7
    ],
    "expected": 0.5,
    "formula": "$7.50 later observed price − $7.00 original planned limit = $0.50",
    "evidence": "A fictional no-trade plan caps hypothetical entry at $7.00; the next observed price is $7.50 without any documented order execution.",
    "pitfall": "The $0.50 difference is not a realized loss from skipping a trade, and chase anxiety is not an exception to the plan.",
    "transfer": "Design a fresh no-trade checklist and retrospectively audit a skipped opportunity without inventing returns."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      5,
      8
    ],
    "expected": 62.5,
    "formula": "5 watchlist records with all mandatory evidence / 8 candidates × 100",
    "evidence": "Eight fictional watchlist candidates are reviewed as of a declared pause; five include issuer identity, dated catalyst, quote source and an objective removal condition.",
    "pitfall": "A 62.5% research completeness rate is neither an order approval nor evidence that the remaining rows should be purchased.",
    "transfer": "Create an unfamiliar dated candidate list and preserve WAIT when issuer or quote evidence is stale."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      9,
      12
    ],
    "expected": 75,
    "formula": "9 decisions with original timestamp evidence / 12 journal cases × 100",
    "evidence": "A fictional review of twelve prior planned setups finds nine retain the original recorded decision cutoff and three were reconstructed from later chart screenshots.",
    "pitfall": "Later attractive charts cannot establish what the learner knew before the outcome, and journal documentation is not a verified fill.",
    "transfer": "Evaluate a different fresh journal sample separating correct rejection, missing data and actual hypothetical plan violations."
  },
  {
    "op": "difference",
    "inputs": [
      66,
      52
    ],
    "expected": 14,
    "formula": "11:06 ET issuer release − 10:52 ET market speculation = 14 minutes",
    "evidence": "A fictional intraday rumor appears at 10:52 ET and an issuer announcement arrives at 11:06 ET; separate quote and trade snapshots exist at different times.",
    "pitfall": "A later positive release cannot support a 10:55 decision or establish that the rumor caused an earlier price move.",
    "transfer": "Compare two alternate post-release scenarios after freezing a new fictional release-time cutoff."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      3,
      5
    ],
    "expected": 60,
    "formula": "3 independently available event records / 5 later collected records × 100",
    "evidence": "A fictional scheduled-event study finds five eventually collected documents, but only three can be proven accessible at the earlier declared decision cutoff.",
    "pitfall": "The two future records cannot be used to explain or justify the earlier plan even if the later price path looks obvious.",
    "transfer": "Construct a new event chronology with embargo, acceptance and publication times and reject all future evidence."
  },
  {
    "op": "ratio-percent",
    "inputs": [
      24,
      30
    ],
    "expected": 80,
    "formula": "24 study days with recorded source-and-process evidence / 30 scheduled days × 100",
    "evidence": "A fictional thirty-day learning review has dated source citations, independent reflection and unresolved-question fields for twenty-four study days, with six missing complete records.",
    "pitfall": "An 80% documentation rate is not 80% mastery, a trading license, a graded Lab score or a forecast of profitability.",
    "transfer": "Draft a different future training review that distinguishes completion, independently assessed competency and next-week practice."
  }
].map(x=>Object.freeze(x)));
export function foundations30DepthDays21to30(base,day) {
 const spec=cases[day-21];
 if(!spec||day<21||day>30||base.day!==day)throw Error('Foundations30 day identity mismatch: '+day);
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
