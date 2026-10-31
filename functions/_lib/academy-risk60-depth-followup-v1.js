/* Original Risk60 D03-D05; 36 custom formative prompts and three original
 * numerical/practical transfer cases. Fictional data; ungraded.
 */
export const risk60DepthFollowupV1=Object.freeze({
 "3": {
  "formativeQuestions": [
   {
    "id": "risk60-D03-Q01",
    "prompt": "Twelve fictional decisions include nine complete source records. Calculate documentation completeness.",
    "review": "Nine of twelve = 9/12 × 100 = 75% complete, retaining all twelve eligible decisions in the denominator."
   },
   {
    "id": "risk60-D03-Q02",
    "prompt": "Three undocumented decisions later have favorable outcomes. Does that correct the missing evidence?",
    "review": "No. A later market result does not retroactively supply the original source timestamps or pre-decision records."
   },
   {
    "id": "risk60-D03-Q03",
    "prompt": "Why is removing losing decisions from a sample an invalid compliance procedure?",
    "review": "Deleting unfavorable outcomes selects the denominator with hindsight and artificially improves apparent process quality."
   },
   {
    "id": "risk60-D03-Q04",
    "prompt": "A new sample includes 14 of 18 decisions with source records. What is the documented rate?",
    "review": "14/18 × 100 ≈ 77.78%; the four undocumented decisions remain part of the full sample."
   },
   {
    "id": "risk60-D03-Q05",
    "prompt": "How many entries from that 18-decision sample still lack dated source records?",
    "review": "18−14=4 records are missing evidence, regardless of later market direction or realized paper outcomes."
   },
   {
    "id": "risk60-D03-Q06",
    "prompt": "Why is a 100% win rate among three selected examples insufficient evidence of a reliable method?",
    "review": "Selection bias, sample size, unrealized execution costs and unknown risk distribution prevent such a conclusion."
   },
   {
    "id": "risk60-D03-Q07",
    "prompt": "How should a process journal classify an entry with an absent decision cutoff?",
    "review": "Retain the entry but mark the source-time evidence as unavailable and schedule a specific documentation correction."
   },
   {
    "id": "risk60-D03-Q08",
    "prompt": "What denominator belongs in a protocol-compliance calculation when some decisions lack records?",
    "review": "Use every eligible decision in the previously specified review period, not only winning or perfectly recorded events."
   },
   {
    "id": "risk60-D03-Q09",
    "prompt": "A 20-entry log includes 15 documented sizing checks. Calculate its sizing-check compliance.",
    "review": "15/20 × 100=75% compliance, with five entries lacking the stated evidence of the required process step."
   },
   {
    "id": "risk60-D03-Q10",
    "prompt": "What differentiates a favorable outcome from a well-documented process decision?",
    "review": "A favorable outcome is retrospective; process adherence is whether pre-specified controls were evidenced before the order."
   },
   {
    "id": "risk60-D03-Q11",
    "prompt": "May future market observations be stored in the same research record as the frozen decision?",
    "review": "Yes, but in separate clearly time-labeled outcome fields, never as facts known at the original decision cutoff."
   },
   {
    "id": "risk60-D03-Q12",
    "prompt": "For a new sample of 18 entries with four missing sources, give a concrete remediation step.",
    "review": "Retain all eighteen, identify the four omissions, require original-source timestamps for subsequent decisions, and audit again."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D03-A01",
    "scenario": "An 18-entry fictional process journal contains 14 dated source references and 11 pre-decision risk checks, while 16 later market outcomes are favorable.",
    "task": "Compute source and sizing-check compliance rates with denominators and explain whether the 16 favorable outcomes validate the missing checks.",
    "worked": "Source evidence is 14/18≈77.78%, risk sizing checks 11/18≈61.11%, and favorable outcomes 16/18≈88.89%. These are three different measures; later favorable moves cannot validate missing earlier evidence or prove profit after costs.",
    "pitfall": "Conflating process compliance with win rate, averaging unrelated ratios or removing losing entries destroys the audit's original denominator.",
    "transfer": "For a second fictional sample of twelve decisions, ten have original sources and eight have risk checks. Compute 83.33% and 66.67% separately."
   }
  ]
 },
 "4": {
  "formativeQuestions": [
   {
    "id": "risk60-D04-Q01",
    "prompt": "Reported volume is 1.2 million shares and dated float is 300,000 shares. Compute turnover.",
    "review": "1,200,000/300,000 = 4.0×, assuming the two share counts use a consistent security and adjustment basis."
   },
   {
    "id": "risk60-D04-Q02",
    "prompt": "Does 4× turnover establish that every share changed hands exactly four times?",
    "review": "No. Shares may trade repeatedly, the float estimate may change, and a turnover ratio does not identify unique holders."
   },
   {
    "id": "risk60-D04-Q03",
    "prompt": "A fictional issuer reports volume 750,000 and float 500,000. Calculate the ratio.",
    "review": "750,000/500,000 = 1.5× for the explicitly stated measurement period and dated estimated float."
   },
   {
    "id": "risk60-D04-Q04",
    "prompt": "What are the units of reported share turnover and how should the result be expressed?",
    "review": "Shares divided by shares is dimensionless, usually reported as 1.5× rather than dollars or shares per minute."
   },
   {
    "id": "risk60-D04-Q05",
    "prompt": "What provenance fields must be checked before volume is divided by float?",
    "review": "Record security identity, reporting interval, float effective date, split adjustment and whether the share definitions align."
   },
   {
    "id": "risk60-D04-Q06",
    "prompt": "Can 4× cumulative turnover guarantee a future 500-share market sell at the last price?",
    "review": "No. Cumulative historical volume supplies no contemporaneous bid price, level depth, routing or actual fill."
   },
   {
    "id": "risk60-D04-Q07",
    "prompt": "Why may an issuer's reported float estimate differ from current freely tradable supply?",
    "review": "Restricted shares, lockups, issuance, corporate actions and stale reporting can change what is actually tradable."
   },
   {
    "id": "risk60-D04-Q08",
    "prompt": "A separate sample reports 600,000 shares traded and 400,000 estimated float. Compute turnover.",
    "review": "600,000/400,000=1.5× under comparable share-unit assumptions; it does not measure the number of traders."
   },
   {
    "id": "risk60-D04-Q09",
    "prompt": "If total volume doubles while the float estimate stays fixed, what follows mathematically?",
    "review": "The turnover ratio doubles, but current displayed bid/ask depth and execution quality need not increase."
   },
   {
    "id": "risk60-D04-Q10",
    "prompt": "What must accompany a turnover claim based on only one hour of reported volume?",
    "review": "Specify the one-hour volume window and the dated float denominator; it is not the same as full-session turnover."
   },
   {
    "id": "risk60-D04-Q11",
    "prompt": "May presplit share volume be combined with a post-reverse-split float without adjustment?",
    "review": "No. Normalize shares to a consistent corporate-action basis and effective date before computing the ratio."
   },
   {
    "id": "risk60-D04-Q12",
    "prompt": "If a high-turnover ticker lacks verified quotes, is an immediate trade supported?",
    "review": "No. Under a predeclared execution-risk rule, current spread and depth remain unknown, making NO TRADE defensible."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D04-A01",
    "scenario": "A fictional stock reports 1.2 million shares traded, while its 300,000-share float estimate predates a corporate-action announcement. No live quote is available.",
    "task": "Calculate conditional turnover, identify the missing float-adjustment evidence and explain why this ratio does not quantify executable depth.",
    "worked": "Mechanical ratio is 1,200,000/300,000=4.0× only if share units and corporate-action dates align. The older float might be stale. Even a valid 4.0× observation cannot price a new buy or sell without contemporaneous bid/ask and depth.",
    "pitfall": "Interpreting aggregate volume as unique turnover of individual holders or a guaranteed fill ignores repeated trades and absent quote evidence.",
    "transfer": "Evaluate a different 750,000-share session against a dated 500,000-share float, then explain the separate liquidity check after computing 1.5×."
   }
  ]
 },
 "5": {
  "formativeQuestions": [
   {
    "id": "risk60-D05-Q01",
    "prompt": "A fictional ask book lists 80 and 120 shares at the first two levels. Calculate visible size.",
    "review": "80+120=200 shares of displayed offered size across the two stated synchronized book levels."
   },
   {
    "id": "risk60-D05-Q02",
    "prompt": "A proposed market buy is 250 shares against only 200 visible offers. What size is unpriced?",
    "review": "250−200=50 shares have no observed offer price in the supplied snapshot."
   },
   {
    "id": "risk60-D05-Q03",
    "prompt": "Calculate the hypothetical notional for 80 shares offered at $6.20.",
    "review": "80×$6.20=$496.00, a snapshot estimate only; no executed transaction is established."
   },
   {
    "id": "risk60-D05-Q04",
    "prompt": "Calculate notional for 120 shares displayed at a $6.23 offer.",
    "review": "120×$6.23=$747.60 under static displayed-depth assumptions and before any fees."
   },
   {
    "id": "risk60-D05-Q05",
    "prompt": "Add the two displayed level notionals to find their total dollar amount.",
    "review": "$496.00+$747.60=$1,243.60 for the 200 shares actually shown in the fictional two-level book."
   },
   {
    "id": "risk60-D05-Q06",
    "prompt": "Compute the static average offer price across those 200 visible shares.",
    "review": "$1,243.60/200=$6.218/share, a conditional size-weighted book estimate and not a fill report."
   },
   {
    "id": "risk60-D05-Q07",
    "prompt": "Can the unpriced last 50 shares be assumed to execute at the second $6.23 offer?",
    "review": "No. The supplied book has no third-level price or size for those 50; mark the unknown rather than inventing a quote."
   },
   {
    "id": "risk60-D05-Q08",
    "prompt": "A displayed 80-share ask level vanishes. Does that event alone prove spoofing?",
    "review": "No. A cancellation or disappearance is not sufficient evidence of intent or manipulation without more context."
   },
   {
    "id": "risk60-D05-Q09",
    "prompt": "A new offer book has 60 at $9.10 and 90 at $9.12. How many shares are priced?",
    "review": "60+90=150 shares are displayed at the two stated prices under the fictional static snapshot."
   },
   {
    "id": "risk60-D05-Q10",
    "prompt": "A hypothetical buy targets 200 shares in that second book. How many remain unpriced?",
    "review": "200−150=50 shares remain unsupported by visible offer price evidence."
   },
   {
    "id": "risk60-D05-Q11",
    "prompt": "What does a $9.12 buy limit change about that 200-share hypothetical order?",
    "review": "It caps the permitted execution price but does not guarantee all shares fill or that displayed liquidity persists."
   },
   {
    "id": "risk60-D05-Q12",
    "prompt": "What is the proper transfer decision when order size exceeds timely visible liquidity?",
    "review": "Quantify missing size, review limit price and risk conditions, and consider reducing quantity or NO TRADE."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D05-A01",
    "scenario": "At a single fictional instant, Level II shows 80 shares offered at $6.20 and 120 offered at $6.23, while a trainee plans a 250-share buy.",
    "task": "Calculate static 200-share notional and average, identify the remaining unpriced order quantity, and explain why a complete execution cannot be asserted.",
    "worked": "The two notionals are 80×$6.20=$496 and 120×$6.23=$747.60, totaling $1,243.60 for 200 displayed shares. A static 200-share average is $1,243.60/200=$6.218/share; 50 of the 250 shares remain unpriced.",
    "pitfall": "A static snapshot does not guarantee that visible size stays in the book or that the remaining 50 shares execute at any invented third-level price.",
    "transfer": "For another fictional buy of 200 shares against 60 offered at $9.10 and 90 at $9.12, compute supported size and state which 50 shares remain unpriced."
   }
  ]
 }
});
