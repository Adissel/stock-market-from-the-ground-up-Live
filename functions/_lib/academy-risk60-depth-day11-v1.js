/* Original Risk60 D11; fictional price-change and causation audit.
 * Ungraded question/feedback and unseen transfer only.
 */
export const risk60DepthDay11V1=Object.freeze({
 "11": {
  "sourceDay": 16,
  "formativeQuestions": [
   {
    "id": "risk60-D11-Q01",
    "prompt": "A completed fictional price drops from $9.20 to $8.95. What is the dollar difference?",
    "review": "The observed change is $8.95−$9.20=−$0.25 per share; the direction is measurable without attributing trader intent."
   },
   {
    "id": "risk60-D11-Q02",
    "prompt": "Calculate percentage change from $9.20 to $8.95 with the original value as denominator.",
    "review": "($8.95−$9.20)/$9.20×100≈−2.72%; name the prior completed observation and its timestamp."
   },
   {
    "id": "risk60-D11-Q03",
    "prompt": "Does one completed red candle establish a panic liquidation?",
    "review": "No. A price bar contains neither participant identity nor proof of distressed selling or particular trade motivation."
   },
   {
    "id": "risk60-D11-Q04",
    "prompt": "Which independent sources would help assess price-change execution quality?",
    "review": "Check fresh synchronized bid/ask, displayed depth, volume window, source time and any trading-halt status separately."
   },
   {
    "id": "risk60-D11-Q05",
    "prompt": "A quote service is unavailable during this decline. May the spread be certified as current?",
    "review": "No. Without eligible contemporaneous bid and offer, the current marketable spread remains unknown."
   },
   {
    "id": "risk60-D11-Q06",
    "prompt": "For a different $13.00 to $12.61 decline, compute absolute and percent changes.",
    "review": "The dollar difference is −$0.39/share and the percentage is −$0.39/$13.00×100=−3.00%."
   },
   {
    "id": "risk60-D11-Q07",
    "prompt": "May the $13.00 to $12.61 movement be called forced selling during a quote outage?",
    "review": "No. The 3% decline is observed, but its cause and currently available execution size are not verified."
   },
   {
    "id": "risk60-D11-Q08",
    "prompt": "Does an eventual price rebound prove that the original move was a harmless pullback?",
    "review": "No. Future recovery cannot be introduced as an earlier-known cause or as a guaranteed reversal."
   },
   {
    "id": "risk60-D11-Q09",
    "prompt": "Why must a research journal state the price observation interval?",
    "review": "The interval defines which prices were compared and prevents treating a five-minute fall as a full-session return."
   },
   {
    "id": "risk60-D11-Q10",
    "prompt": "What distinguishes a completed price observation from an executable market order quote?",
    "review": "A completed print or candle is past transaction evidence; a fresh bid/ask and quantity are needed for current execution assumptions."
   },
   {
    "id": "risk60-D11-Q11",
    "prompt": "If the declared quote-freshness veto fails, what is the defensible process action?",
    "review": "Choose WAIT or NO TRADE while requesting current source and quote evidence, rather than inventing a fill."
   },
   {
    "id": "risk60-D11-Q12",
    "prompt": "A separate $20.00 to $19.40 drop appears. What exactly can the trainee conclude?",
    "review": "It is a completed −$0.60/share or −3.00% move; forced selling, next-bar direction and executable depth are unknown."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D11-A01",
    "scenario": "At a fictional 10:15 ET cutoff, completed observations move from $9.20 to $8.95. A social-media comment labels it panic, while current quotes are missing.",
    "task": "Calculate the price change and percentage, separate measured decline from unverified motives, and apply a predefined quote-availability veto.",
    "worked": "Difference=$8.95−$9.20=−$0.25/share; rate=(−$0.25/$9.20)×100≈−2.72%. Participant intent is not verified. Without a current bid and ask, spread and order size are unknown; WAIT/NO TRADE is valid.",
    "pitfall": "A red candle is not proof of distressed selling, and a missing live quote cannot be replaced with a recent price print to guarantee an execution.",
    "transfer": "On another fictional $13.00 to $12.61 decline during a quote outage, calculate −3.00%, state what is known, and list the evidence required before a trade plan."
   }
  ]
 }
});
