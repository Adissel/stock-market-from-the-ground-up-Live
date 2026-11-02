/* SMFGU-ACADEMY-RISK60-DEPTH-D23-D24 v1.0 — owner-authorized original
 * 12 feedback-rich formative prompts and one independent worked transfer per day.
 * All numbers are fictional; no trading results, answer keys, grades, or mastery.
 * Source provenance inherits canonical original Risk60 daily reference.
 */
export const risk60PracticeDeepDay23to24V1=Object.freeze({
  "23": {
    "topicSourceDay": 3,
    "formativeQuestions": [
      {
        "id": "risk60-D23-Q01",
        "prompt": "A fictional register has 24 decisions and 18 carry valid original-source timestamps. What is the completeness percentage?",
        "review": "Divide the eighteen dated, source-backed records by all twenty-four decisions: 18/24 × 100 = 75%. Keep the six incomplete records in the denominator."
      },
      {
        "id": "risk60-D23-Q02",
        "prompt": "How many of those twenty-four decisions lack a valid before-decision source record?",
        "review": "Subtract verified records from the fixed cohort size: 24 − 18 = 6 missing records. Do not silently exclude them."
      },
      {
        "id": "risk60-D23-Q03",
        "prompt": "Six incomplete records later become profitable. May the cohort's source-completeness rate be increased?",
        "review": "No. Outcome profitability is unrelated to whether the original source was documented before the decision. The initial completeness stays 18/24."
      },
      {
        "id": "risk60-D23-Q04",
        "prompt": "A second fictional register has fifteen decisions, ten timely source checks and five missing. Calculate completeness.",
        "review": "Use the whole independently defined denominator: 10/15 × 100 = 66.666…%, or approximately 66.7%, and retain the five missing items."
      },
      {
        "id": "risk60-D23-Q05",
        "prompt": "In that fifteen-case register, how many percentage points separate its completeness from seventy-five percent?",
        "review": "The gap is 75.0% − 66.666…% = 8.333… percentage points, not an 8.33% relative loss."
      },
      {
        "id": "risk60-D23-Q06",
        "prompt": "Why is deleting decisions without timestamp evidence a selection-bias problem?",
        "review": "Removal changes the denominator after inspecting record quality or outcomes, making a deficient process appear stronger than the original cohort."
      },
      {
        "id": "risk60-D23-Q07",
        "prompt": "Does an undated social-media screenshot establish a source's original publication time?",
        "review": "No. Its captured time and its original public availability are separate facts; obtain an attributable primary document and its publication timestamp."
      },
      {
        "id": "risk60-D23-Q08",
        "prompt": "What timestamps belong in a prospective source-audit record?",
        "review": "Preserve source publication, source retrieval, decision cutoff and any later amendment times; the first available evidence must precede the decision."
      },
      {
        "id": "risk60-D23-Q09",
        "prompt": "Can a company filing published at 09:20 establish what was known in a decision made at 09:05?",
        "review": "No. That would be look-ahead bias. The 09:05 decision must be scored using information actually available no later than 09:05."
      },
      {
        "id": "risk60-D23-Q10",
        "prompt": "A decision has a verified issuer link but no retrieval time. Is source timeliness established?",
        "review": "No. Identity of a source alone does not prove it was obtained by the decision cutoff; classify timing as unresolved until supported."
      },
      {
        "id": "risk60-D23-Q11",
        "prompt": "If five of six incomplete records are corrected retrospectively, is the original 75% metric rewritten?",
        "review": "No. Report the original at-cutoff completeness of 75% and a separately dated remediation count; do not backdate the correction."
      },
      {
        "id": "risk60-D23-Q12",
        "prompt": "Transfer: a new 40-decision register has thirty-three timely records. Compute completeness and missing count.",
        "review": "33/40 × 100 = 82.5% complete with 40 − 33 = 7 missing records. Retain all forty and state when the evidence was available."
      }
    ],
    "advancedPracticums": [
      {
        "id": "risk60-D23-A01",
        "scenario": "At a fictional 10:00 ET review a fixed training register contains 24 hypothetical decisions, 18 with primary-source documents timestamped before each decision and six without. Later charts show four of those six would have risen. A separate new cohort contains fifteen decisions with ten timely records.",
        "task": "Calculate initial completeness, missing counts, and the new-cohort completeness; distinguish percentage points from relative percent; decide whether profitable later outcomes alter the original source-quality metric.",
        "worked": "Original source completeness = 18/24 = 75.0%; six are incomplete. Independent new-cohort completeness = 10/15 = 66.666…%, with five missing. The gap is 8.333… percentage points. Neither later price outcomes nor post-cutoff remediation can change the recorded at-decision numerator or fixed denominator.",
        "pitfall": "Deleting cases with missing evidence, quietly backdating later source retrieval, or counting retrospectively profitable unsourced cases as documented would introduce selection and look-ahead bias.",
        "transfer": "For an unrelated fictional register of forty decisions with thirty-three timely primary-source records, compute 82.5% complete and seven missing; distinguish subsequent remediation from at-cutoff evidence."
      }
    ]
  },
  "24": {
    "topicSourceDay": 4,
    "formativeQuestions": [
      {
        "id": "risk60-D24-Q01",
        "prompt": "In a fictional session 900,000 shares trade against a separately dated 600,000-share float estimate. Calculate turnover.",
        "review": "900,000/600,000 = 1.5 times the dated float estimate. The ratio concerns aggregate shares traded, not distinct holders."
      },
      {
        "id": "risk60-D24-Q02",
        "prompt": "Does 1.5 times float turnover establish that 150 percent of unique owners sold?",
        "review": "No. The same shares may trade repeatedly, and float is an estimate at a different time. Owner identities cannot be inferred from turnover."
      },
      {
        "id": "risk60-D24-Q03",
        "prompt": "A separate fictional ticker trades 300,000 shares against an estimated float of 1,200,000. Find turnover.",
        "review": "300,000/1,200,000 = 0.25 times the estimated float for the stated trading window."
      },
      {
        "id": "risk60-D24-Q04",
        "prompt": "What percentage of the dated float is represented by that 0.25 times mechanical ratio?",
        "review": "Multiply the dimensionless ratio by one hundred: 0.25 × 100 = 25%. This is not 25% of unique accounts."
      },
      {
        "id": "risk60-D24-Q05",
        "prompt": "A fictitious float estimate predates a newly announced issuance. Is the old figure automatically current?",
        "review": "No. The issuance and effective date may change available shares. Flag the estimate as stale and obtain an attributable updated source."
      },
      {
        "id": "risk60-D24-Q06",
        "prompt": "If a 600,000-share estimate is revised to 750,000 while 900,000 traded shares are unchanged, find the revised ratio.",
        "review": "900,000/750,000 = 1.2 times. The published figure must identify which float estimate and timestamp were used."
      },
      {
        "id": "risk60-D24-Q07",
        "prompt": "Does high volume alone prove there are enough displayed ask shares for a planned immediate buy?",
        "review": "No. Session turnover is a flow total; visible offer depth, spreads, cancellations and execution conditions are different measurements."
      },
      {
        "id": "risk60-D24-Q08",
        "prompt": "Can a day-long share-volume numerator be casually compared with a five-minute volume metric?",
        "review": "No. The interval and units must be specified consistently; an entire-session total does not describe a single five-minute period."
      },
      {
        "id": "risk60-D24-Q09",
        "prompt": "A quote shows only top-of-book prices while the day reports high turnover. Can an order's full fill be computed?",
        "review": "No. Top-of-book prices without sizes and subsequent depth cannot justify a full-order execution or weighted fill estimate."
      },
      {
        "id": "risk60-D24-Q10",
        "prompt": "Why should a learner record the float estimate's publication date and share-class definition?",
        "review": "Both the date and share class affect the meaning of the denominator; confusing common shares with another class can invalidate the result."
      },
      {
        "id": "risk60-D24-Q11",
        "prompt": "Which two caveats must accompany turnover calculated with a dated float estimate?",
        "review": "State that repeated trading does not measure distinct ownership and that the denominator may be stale after corporate actions or issuance."
      },
      {
        "id": "risk60-D24-Q12",
        "prompt": "Transfer: fictional traded volume is 180,000 and dated float 720,000. Calculate turnover without inventing owners.",
        "review": "180,000/720,000 = 0.25 times, or 25% mechanical turnover; no number of unique buyers or sellers follows from that figure."
      }
    ],
    "advancedPracticums": [
      {
        "id": "risk60-D24-A01",
        "scenario": "A fictional stock records 900,000 shares traded in one completed session; a dated independently attributed float estimate is 600,000 shares. An ensuing share issuance suggests the estimate could be outdated. No share-holder ledger or executable order-book depth is supplied.",
        "task": "Compute mechanical float turnover, recalculate under a separately documented hypothetical 750,000-share float, and explain which claims about unique ownership or immediately executable liquidity cannot be made.",
        "worked": "Initial ratio = 900,000/600,000 = 1.50× dated estimated float. If a separately verified updated estimate were 750,000, the alternative ratio would be 900,000/750,000 = 1.20×. Neither number identifies distinct shareholders; repeated trades, source dates, changes to outstanding shares and quote depth remain unmeasured.",
        "pitfall": "Treating a volume-to-estimated-float quotient as a unique-owner census, assuming all traded shares remain in new hands, or treating session volume as guaranteed displayed liquidity is unsupported.",
        "transfer": "A different fictional issuer trades 180,000 shares in one session with a dated 720,000-share float. Calculate 0.25× mechanical turnover and identify the unknown account count, float currency and quote depth."
      }
    ]
  }
});
