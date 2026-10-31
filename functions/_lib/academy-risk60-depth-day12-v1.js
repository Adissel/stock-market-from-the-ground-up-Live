/* Risk60 original D12: fictional short-side risk and borrow uncertainty.
 * Separate ungraded learning from any official protected assessment.
 */
export const risk60DepthDay12V1=Object.freeze({
 "12": {
  "sourceDay": 17,
  "formativeQuestions": [
   {
    "id": "risk60-D12-Q01",
    "prompt": "A fictional short sells 120 borrowed shares at $10.00 and covers at $12.00. What is gross result?",
    "review": "Short gross result=(initial sale−cover price)×shares=($10−$12)×120=−$240 before commissions and borrow expense."
   },
   {
    "id": "risk60-D12-Q02",
    "prompt": "How large is the adverse per-share change for that $10.00 short closed at $12.00?",
    "review": "The price moved $2.00 per share against the short position; this differs from a long-position profit calculation."
   },
   {
    "id": "risk60-D12-Q03",
    "prompt": "A new fictional 50-share short sells at $8.00 and covers at $9.50. Calculate gross loss.",
    "review": "($8.00−$9.50)×50=−$75 gross price-only trading result, excluding borrow and commission costs."
   },
   {
    "id": "risk60-D12-Q04",
    "prompt": "Why can short-selling risk be greater than the proceeds received from the original sale?",
    "review": "A share price has no fixed upper bound, so repurchase cost can exceed original short-sale proceeds by a large amount."
   },
   {
    "id": "risk60-D12-Q05",
    "prompt": "Is a historical borrow-locate result a guarantee of current shortable share availability?",
    "review": "No. Locate availability, fees, broker permission, recalls and execution restrictions require a timely account-specific check."
   },
   {
    "id": "risk60-D12-Q06",
    "prompt": "What does a protective stop order fail to guarantee for an adverse short-position move?",
    "review": "It cannot guarantee a fill at the trigger; gaps, halts, order type, routing and liquidity may cause worse execution."
   },
   {
    "id": "risk60-D12-Q07",
    "prompt": "A 120-share short is notionally sold at $10.00 and covered at $7.50. Calculate gross result.",
    "review": "The favorable difference is $2.50/share and gross result is 120×$2.50=$300, before costs and actual fill verification."
   },
   {
    "id": "risk60-D12-Q08",
    "prompt": "The same 120-share short is instead covered at $12.50. What is price-only gross result?",
    "review": "($10.00−$12.50)×120=−$300; the loss increases with adverse price movement and share quantity."
   },
   {
    "id": "risk60-D12-Q09",
    "prompt": "What transaction closes a short position rather than increasing it?",
    "review": "A buy-to-cover execution reduces borrowed-share exposure; a displayed quote or merely submitted order is not an executed cover."
   },
   {
    "id": "risk60-D12-Q10",
    "prompt": "Can a bearish chart pattern independently authorize short selling in a real brokerage account?",
    "review": "No. Broker permissions, locate/borrow, regulations, fees, current quotes and risk controls are separate from pattern interpretation."
   },
   {
    "id": "risk60-D12-Q11",
    "prompt": "Does a hypothetical short fill produced by a classroom simulator prove a real broker locate occurred?",
    "review": "No. A simulated fill is conditional educational data and cannot establish an actual borrow, fill or customer trade."
   },
   {
    "id": "risk60-D12-Q12",
    "prompt": "In a separate 80-share short at $15.00 covered at $15.75, what is gross direction?",
    "review": "($15.00−$15.75)×80=−$60 gross, with borrowing expense and any execution cost still unmodeled."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D12-A01",
    "scenario": "A fictional training account sells short 120 shares at a simulated $10.00 reference and later covers at $12.00, without modelled borrow fees.",
    "task": "Calculate the price-only directional result and identify broker-specific permissions, borrow costs, gap and stop-execution risks not established by the simulation.",
    "worked": "Gross short P/L=(sale−cover)×quantity=($10.00−$12.00)×120=−$240. Borrow fees, market routing and commission would change net results; simulated availability is not an actual locate.",
    "pitfall": "Applying long-position profit sign, treating proceeds as a loss cap, or describing a stop trigger as guaranteed execution understates short-side risk.",
    "transfer": "For an independent fictional 50-share short initiated at $8.00 and covered at $9.50, compute −$75 gross and state what is still unknown about borrow."
   }
  ]
 }
});
