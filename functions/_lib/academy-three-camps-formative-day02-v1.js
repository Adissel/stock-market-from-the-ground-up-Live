/* Separate hand-authored 12-question reference batch: day 02 of each NEW Boot Camp.
 * Ungraded free-form teaching feedback only, not secure assessment content.
 * Unreviewed other study days are not silently auto-filled or approved.
 */
const bank={
 "tape10": [
  {
   "prompt": "A fictional quote is $5.00 bid for 400 shares and $5.06 ask for 250. Calculate the spread in dollars per share.",
   "review": "$5.06 − $5.00 = $0.06 per share. A spread is a quoted reference, not a realized execution cost."
  },
  {
   "prompt": "For the same quote, calculate the quoted midpoint in dollars per share.",
   "review": "($5.00 + $5.06)/2 = $5.03 per share. A midpoint is not necessarily executable."
  },
  {
   "prompt": "Compute the spread as a percentage of the quoted midpoint; show the denominator.",
   "review": "$0.06 / $5.03 × 100 ≈ 1.19%. Always identify the midpoint as the chosen denominator."
  },
  {
   "prompt": "A 600-share market buy arrives when the best ask shows only 250 shares. Which size gap must be disclosed?",
   "review": "600 − 250 = 350 shares beyond the visible best-ask size; the price and availability of the remainder are unknown."
  },
  {
   "prompt": "Can a screenshot of 250 shares displayed at the ask guarantee all 250 will fill? Identify why not.",
   "review": "No. Other orders, cancellations, routing, hidden activity and feed latency can change executable interest."
  },
  {
   "prompt": "If the offer falls from $5.06 to $5.02 while the bid stays $5.00, recompute the spread.",
   "review": "$5.02 − $5.00 = $0.02 per share. Confirm the two quotes are contemporaneous."
  },
  {
   "prompt": "Differentiate a last-sale print of $5.08 from the current displayed ask of $5.06.",
   "review": "The print is a historical execution observation. The ask describes displayed selling interest at another instant."
  },
  {
   "prompt": "A buy limit is $5.04 while the best ask is $5.06. What protection does the limit provide?",
   "review": "The buy limit generally prevents execution above $5.04, but may not execute at all; venue and broker instructions matter."
  },
  {
   "prompt": "A market order is sent at a $5.06 best ask. May the actual fill be higher? State the missing risk inputs.",
   "review": "Yes. Available depth, changed quotes, latency, order size, and routing can yield a different execution price."
  },
  {
   "prompt": "State the difference between displayed share size and actual trade volume during a one-minute interval.",
   "review": "Displayed size is current quoted interest at a specified moment; volume is the cumulative quantity of executed shares over an interval."
  },
  {
   "prompt": "If the quote source is delayed by 15 minutes, what live-execution conclusion should you withhold?",
   "review": "A delayed snapshot cannot establish the current executable best price, depth, or realized spread."
  },
  {
   "prompt": "Draft a no-trade condition when the full 600-share intended order cannot be evaluated against sufficient fresh depth.",
   "review": "Withhold or revise the planned order until risk budget, timely depth, order type, and tolerable slippage are documented."
  }
 ],
 "indicators10": [
  {
   "prompt": "For two fictional trades, 100 shares at $8 and 300 at $9, calculate the first row's traded notional.",
   "review": "100 shares × $8/share = $800, a dollar amount rather than a per-share price."
  },
  {
   "prompt": "Calculate traded notional for the second row: 300 shares at $9.",
   "review": "300 shares × $9/share = $2,700."
  },
  {
   "prompt": "Add the two traded-dollar amounts; show units and intermediate terms.",
   "review": "$800 + $2,700 = $3,500 of traded notional."
  },
  {
   "prompt": "Add the share quantities and distinguish total shares from dollar volume.",
   "review": "100 + 300 = 400 shares; that is not a dollar amount."
  },
  {
   "prompt": "Compute the volume-weighted mean price using both rows.",
   "review": "$3,500 / 400 shares = $8.75 per share."
  },
  {
   "prompt": "Compute the simple, unweighted mean of $8 and $9 and compare it with the weighted result.",
   "review": "($8+$9)/2=$8.50 per share, lower than weighted $8.75 because more shares traded at $9."
  },
  {
   "prompt": "Move 200 of the fictional $9 shares to the $8 row. Recompute both price-row quantities.",
   "review": "The rows become 300 shares at $8 and 100 shares at $9, totaling 400 shares."
  },
  {
   "prompt": "After that redistribution, recompute total traded dollars and the volume-weighted mean.",
   "review": "300 × $8 + 100 × $9 = $3,300; $3,300/400 = $8.25 per share."
  },
  {
   "prompt": "Does the unweighted mean change when only the number of shares at each unchanged price changes?",
   "review": "No. With row prices still $8 and $9, their simple mean remains $8.50."
  },
  {
   "prompt": "A source provides two average bar prices but no bar volume. Which calculation cannot yet be reproduced?",
   "review": "Trade- or bar-weighted VWAP cannot be reproduced without valid volume weights and a declared price convention."
  },
  {
   "prompt": "What happens if the analyst mixes extended-hours rows into a regular-session calculation without relabeling it?",
   "review": "The input population violates the claimed session boundary; the resulting number is not the specified regular-session measure."
  },
  {
   "prompt": "State a no-signal decision when the volume units or data cutoff of a chart indicator are unknown.",
   "review": "Withhold an indicator-based trading decision until units, calculation scope, timestamps and data provenance are checked."
  }
 ],
 "filings7": [
  {
   "prompt": "A fictional 8-K Item 1.01 describes an agreement. What should be checked before asserting what the agreement obligates the issuer to do?",
   "review": "Read Item 1.01 and the cited exhibit, including counterparties, closing conditions, milestones and termination provisions."
  },
  {
   "prompt": "An exhibit says 'up to $5 million contingent on milestones.' Is $5 million already recognized revenue?",
   "review": "No. It is a conditional ceiling, not evidence of payment receipt or revenue recognition."
  },
  {
   "prompt": "How would you rewrite the headline 'Company gets $5 million' to preserve the exhibit's uncertainty?",
   "review": "State that the issuer disclosed a conditional agreement with potential payments of up to $5 million, subject to specified milestones."
  },
  {
   "prompt": "Which document is a primary source for the agreement terms: the filed exhibit or a social-media repost?",
   "review": "The issuer-filed exhibit is primary evidence of disclosed terms; the repost is a secondary interpretation."
  },
  {
   "prompt": "List two distinctions between a signed agreement and a completed cash transaction.",
   "review": "Contract execution may precede performance, closing, invoicing and cash receipt; these events should not be conflated."
  },
  {
   "prompt": "Does a new filing alone prove next-quarter revenue or earnings? State the accounting uncertainty.",
   "review": "No. Conditions, performance obligations, recognition rules, timing and costs may prevent or change accounting impact."
  },
  {
   "prompt": "If an 8-K summary conflicts with its exhibit, which exact text should be investigated?",
   "review": "Compare the relevant filing item and exhibit language, dates and any amendments or incorporated terms; do not infer blindly."
  },
  {
   "prompt": "A release says 'up to 5 million over three years.' Can the amount be called current-quarter cash proceeds?",
   "review": "No. Maximum contingent multiyear consideration is not current-quarter receipts."
  },
  {
   "prompt": "A disclosure has an 18:20 acceptance time but a hypothetical trading decision was at 15:30. Can the filing justify that earlier trade?",
   "review": "No. It was not in the disclosed public record at the earlier frozen decision time."
  },
  {
   "prompt": "Why must an analyst record exhibit number and accession alongside the issuer's name?",
   "review": "They identify the precise primary disclosure and version needed for independent reproduction."
  },
  {
   "prompt": "An agreement involves warrants as well as cash. What additional dilution-related evidence must be reviewed?",
   "review": "Review warrant amount, strike price, exercisability, share count and associated filing terms before concluding future dilution."
  },
  {
   "prompt": "Construct a no-trade or no-conclusion rule when the contract exhibit is missing or important milestone definitions are unknown.",
   "review": "Suspend confident revenue and catalyst claims until the primary exhibit, conditions, timing, uncertainties and source provenance can be checked."
  }
 ]
};
export const formativeDay02V1=Object.freeze(Object.fromEntries(Object.entries(bank).map(([code,questions])=>
 [code,Object.freeze(questions.map((row,i)=>Object.freeze({id:code+'-D02-F'+String(i+1).padStart(2,'0'),...row})))])));
if(Object.values(formativeDay02V1).some(questions=>questions.length!==12||
 new Set(questions.map(x=>x.prompt)).size!==12||
 questions.some(x=>x.prompt.length<30||x.review.length<30)))throw Error('Second-day questions incomplete');
