/* Risk60 original D14: short-squeeze narrative and dated sources.
 * Fictional and ungraded; never establishes trader identities.
 */
export const risk60DepthDay14V1=Object.freeze({
 "14": {
  "sourceDay": 20,
  "formativeQuestions": [
   {
    "id": "risk60-D14-Q01",
    "prompt": "A fictional share price increases from $50 to $60. Calculate the completed percentage move.",
    "review": "($60−$50)/$50×100=20.0%. It describes price movement, not which actual participants bought or covered."
   },
   {
    "id": "risk60-D14-Q02",
    "prompt": "Does a completed 20% rise establish that it was caused exclusively by short covering?",
    "review": "No. Price movement alone does not reveal broker short-cover events, lender recalls, or the exact motives of traders."
   },
   {
    "id": "risk60-D14-Q03",
    "prompt": "What two dates should a researcher preserve for a reported short-interest statistic?",
    "review": "Record its position-measurement as-of date separately from the later publication/retrieval date and decision cutoff."
   },
   {
    "id": "risk60-D14-Q04",
    "prompt": "Can a prior-period short-interest total identify today's actual buy-to-cover orders?",
    "review": "No. A dated aggregate position report cannot classify individual current prints or broker obligations."
   },
   {
    "id": "risk60-D14-Q05",
    "prompt": "A fictional stock rises from $5.00 to $5.60. Calculate the price-change percentage.",
    "review": "($5.60−$5.00)/$5.00×100=12.0% using the earlier observed price as the denominator."
   },
   {
    "id": "risk60-D14-Q06",
    "prompt": "Give two alternative explanations to a forced-cover squeeze story after a rising bar.",
    "review": "Dated positive issuer news and ordinary directional buying are alternatives, while market-wide volatility is another hypothesis."
   },
   {
    "id": "risk60-D14-Q07",
    "prompt": "What does relative share volume measure that it does not establish about covering?",
    "review": "It measures activity against a declared baseline; it cannot identify forced repurchases or short-account participant identities."
   },
   {
    "id": "risk60-D14-Q08",
    "prompt": "Is a broker securities-lending recall observable from a single candle's green color?",
    "review": "No. A recall requires dated lending/broker evidence and is not encoded in the candle color or trade direction alone."
   },
   {
    "id": "risk60-D14-Q09",
    "prompt": "Why does the original publication time of an issuer announcement matter in this lesson?",
    "review": "It prevents attributing a later catalyst to an earlier observed price move and preserves the information cutoff."
   },
   {
    "id": "risk60-D14-Q10",
    "prompt": "Can a burst of high-volume prints certify a particular short seller received a margin call?",
    "review": "No. Margin requirements are account-specific, and aggregate prints do not reveal any individual broker call."
   },
   {
    "id": "risk60-D14-Q11",
    "prompt": "How should an unsupported social-media squeeze statement be logged?",
    "review": "Store it as an unverified hypothesis with source and timestamp, not as an established market fact or guaranteed setup."
   },
   {
    "id": "risk60-D14-Q12",
    "prompt": "An unrelated fictional stock moves $6.00 to $6.72 amid stale short-interest data. What is measurable?",
    "review": "The move is $0.72/$6.00×100=12%. Actual short covering and forced buy-in volume remain unknown."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D14-A01",
    "scenario": "A fictional ticker climbs from $50 to $60 while a widely shared short-interest table reports positions as of an earlier date and an issuer release appears afterward.",
    "task": "Calculate the change, separate delayed aggregate positions from live transaction identity and list plausible alternative catalysts without using later news prematurely.",
    "worked": "The completed gain is ($60−$50)/$50×100=20%. A dated short-interest figure is not a list of current cover transactions. Price and volume cannot establish forced buy-ins, lending recalls or margin-call causes.",
    "pitfall": "Calling every high-volume rally a squeeze or interpreting stale short-interest figures as real-time execution data invents participant intent and may leak future evidence.",
    "transfer": "For a second fictional $5.00-to-$5.60 rise, calculate 12% and specify original evidence required to distinguish news-driven buying from verified lender recalls."
   }
  ]
 }
});
