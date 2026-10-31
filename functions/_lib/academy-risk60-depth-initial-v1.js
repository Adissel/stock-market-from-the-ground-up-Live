/* Original Risk60 D1-D2 authored twelve-question ungraded formative packs,
 * mathematical worked scenarios and advanced independent transfer.
 * No private grade keys or user writes.
 */
export const risk60DepthInitialV1=Object.freeze({
 "1": {
  "formativeQuestions": [
   {
    "id": "risk60-D01-Q01",
    "prompt": "What do you do when the fictional 08:55 candidate has no current bid or ask?",
    "review": "Choose WAIT/NO TRADE: the last trade does not establish the current spread, liquidity, or executable entry."
   },
   {
    "id": "risk60-D01-Q02",
    "prompt": "Can a filing accepted at 09:03 support the student's earlier 08:55 decision?",
    "review": "No. Freeze the original cutoff; use that later filing only for a separately timestamped decision."
   },
   {
    "id": "risk60-D01-Q03",
    "prompt": "How do you verify legal issuer identity before relying on a ticker headline?",
    "review": "Cross-check the original issuer, SEC CIK, dated publication and exact document, rather than a secondary claim."
   },
   {
    "id": "risk60-D01-Q04",
    "prompt": "Why is a completed checklist alone not proof of an executed source check?",
    "review": "Checking a UI box does not establish the underlying document was read, authentic, current or matched to the ticker."
   },
   {
    "id": "risk60-D01-Q05",
    "prompt": "Which source clocks belong in a repeatable market decision ledger?",
    "review": "Distinguish the event timestamp, filing acceptance, source retrieval, quote timestamp and decision cutoff."
   },
   {
    "id": "risk60-D01-Q06",
    "prompt": "What prevents calculating a responsible order quantity from only the last price?",
    "review": "Risk budget, stop reference, timely quote, share availability and execution uncertainty are still missing."
   },
   {
    "id": "risk60-D01-Q07",
    "prompt": "What is the best response to two conflicting primary issuer identities?",
    "review": "Mark the candidate WAIT while comparing dated legal identifiers and the provenance of each original source."
   },
   {
    "id": "risk60-D01-Q08",
    "prompt": "Can a NO TRADE decision be evidence of successful process discipline?",
    "review": "Yes, if it follows the predefined missing-evidence or execution-risk veto rather than hindsight about price."
   },
   {
    "id": "risk60-D01-Q09",
    "prompt": "Why should an issuer source and a current market quote be checked separately?",
    "review": "A filing supports issuer disclosure; a timely quote supports executable price context. Neither substitutes for the other."
   },
   {
    "id": "risk60-D01-Q10",
    "prompt": "How should an original source with an uncertain publication time be classified?",
    "review": "Label its actual availability unverified and exclude its content from decisions before a confirmed publication cutoff."
   },
   {
    "id": "risk60-D01-Q11",
    "prompt": "Can a later quote change the recorded result of an earlier independent question?",
    "review": "No. Preserve the earlier answer and record a second decision using the new observation and a later cutoff."
   },
   {
    "id": "risk60-D01-Q12",
    "prompt": "How would you transfer this evidence gate to an unfamiliar ticker with conflicting names?",
    "review": "Record legal name, CIK, source URL, retrieval time and uncertainty, and withhold trade until reconciled."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D01-A01",
    "scenario": "At 08:55 ET a fictional ticker has a $9.50 last trade but no fresh bid/ask; an issuer filing arrives at 09:03 ET.",
    "task": "Prepare a source-availability and order-risk checklist for the 08:55 decision and then specify a distinct decision after 09:03.",
    "worked": "A last trade is not a current quote. At 08:55 the spread, available depth and filing confirmation are unknown; label the original decision WAIT/NO TRADE. At 09:03 the filing becomes newly available and permits only a separate evidence review.",
    "pitfall": "A completed interface checklist does not authenticate a quote or retroactively make a later filing available at an earlier decision pause.",
    "transfer": "For a different ticker with two conflicting issuer names at 07:40, verify legal filer, CIK, original URL and timestamps before any order plan."
   }
  ]
 },
 "2": {
  "formativeQuestions": [
   {
    "id": "risk60-D02-Q01",
    "prompt": "A completed fictional price moves from $8.00 to $8.40; calculate the change.",
    "review": "The price rose ($8.40−$8.00)/$8.00×100 = 5%; the $8.00 completed reference is the denominator."
   },
   {
    "id": "risk60-D02-Q02",
    "prompt": "What is the spread for a synchronized $8.32 bid and $8.40 ask?",
    "review": "Spread is ask minus bid, or $8.40−$8.32 = $0.08/share, not an executed round-trip cost."
   },
   {
    "id": "risk60-D02-Q03",
    "prompt": "Calculate the quoted midpoint between $8.32 bid and $8.40 ask.",
    "review": "The arithmetic midpoint is ($8.32+$8.40)/2=$8.36/share for the synchronized quote snapshot."
   },
   {
    "id": "risk60-D02-Q04",
    "prompt": "Express the $0.08 quoted spread as a percentage of the midpoint $8.36.",
    "review": "The midpoint-normalized spread is $0.08/$8.36×100≈0.957%, or roughly 0.96%."
   },
   {
    "id": "risk60-D02-Q05",
    "prompt": "Why does a 5% completed price rise not establish a profitable new entry?",
    "review": "It does not establish a new order fill, spread, fees, slippage or a later exit price."
   },
   {
    "id": "risk60-D02-Q06",
    "prompt": "Why should you not use the previous $8.00 close as a quoted spread midpoint?",
    "review": "That uses a different temporal benchmark and computes a different statistic, not the current midpoint spread."
   },
   {
    "id": "risk60-D02-Q07",
    "prompt": "For a synchronous $12.40 bid and $12.52 ask, compute spread.",
    "review": "Subtract $12.40 from $12.52 for a quoted $0.12/share spread, assuming eligible contemporaneous quotes."
   },
   {
    "id": "risk60-D02-Q08",
    "prompt": "What is the midpoint for bid $12.40 and offer $12.52?",
    "review": "Their midpoint is ($12.40+$12.52)/2=$12.46 per share; it is distinct from yesterday's close."
   },
   {
    "id": "risk60-D02-Q09",
    "prompt": "Compute the $0.12 spread relative to a $12.46 midpoint.",
    "review": "The percentage is $0.12/$12.46×100≈0.963%; round to 0.96% and name the denominator."
   },
   {
    "id": "risk60-D02-Q10",
    "prompt": "How far above a completed $11.80 close is the $12.52 ask?",
    "review": "The ask-to-close change is ($12.52−$11.80)/$11.80×100≈6.10%; it is not a realized return."
   },
   {
    "id": "risk60-D02-Q11",
    "prompt": "May a 09:35 bid and 09:32 ask be treated as a live synchronized spread?",
    "review": "No. Quote time mismatch undermines a contemporaneous inside-market calculation; refresh or reject."
   },
   {
    "id": "risk60-D02-Q12",
    "prompt": "What should happen when a predefined 1% spread limit meets a 1.4% quote spread?",
    "review": "Reject the candidate under the rule regardless of scan momentum or any later price movement."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D02-A01",
    "scenario": "An earlier fictional completed close is $11.80 while a later synchronized quote shows $12.40 bid and $12.52 ask.",
    "task": "Calculate prior-close-to-ask change, quoted spread, midpoint and midpoint-normalized spread; explain why neither confirms an execution.",
    "worked": "Change = ($12.52−$11.80)/$11.80×100≈6.10%. Spread=$0.12/share, midpoint=$12.46/share, midpoint-normalized spread=$0.12/$12.46×100≈0.963%. None is an executed trading return.",
    "pitfall": "Confusing prior-close change with quoted spread uses incompatible denominators, and reading a displayed price as a fill conceals slippage.",
    "transfer": "Use a new fictional $7.85/$8.05 quote and $7.50 completed prior close; independently compute both percentages and apply a 2% spread veto."
   }
  ]
 }
});
