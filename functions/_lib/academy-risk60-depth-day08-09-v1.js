/* Risk60 D08–D09 standalone depth cases, 24 original formative prompts.
 * Hypothetical trade math distinct from broker-order evidence.
 */
export const risk60DepthDay08to09V1=Object.freeze({
 "8": {
  "sourceDay": 11,
  "formativeQuestions": [
   {
    "id": "risk60-D08-Q01",
    "prompt": "A fictional 200-share long position sells 50 shares and the fill is verified. How many shares remain?",
    "review": "The remaining owned quantity is 200−50=150 shares; only a confirmed executed sell reduces the open share count."
   },
   {
    "id": "risk60-D08-Q02",
    "prompt": "The verified 50-share exit is $10.50 versus a $10.00 entry. Calculate gross realized difference.",
    "review": "($10.50−$10.00)×50=$25.00 gross gain for those sold shares before fees; it does not close the other 150."
   },
   {
    "id": "risk60-D08-Q03",
    "prompt": "At the original $10.00 entry, what capital was allocated to the 200-share hypothetical long?",
    "review": "200×$10.00=$2,000 gross entry notional in the fictional example, not an audited actual account balance."
   },
   {
    "id": "risk60-D08-Q04",
    "prompt": "A 30-share limit order is posted but unfilled. How many shares have been sold by that new order?",
    "review": "Zero shares from the newly posted order. Placing an offer does not document execution or reduce actual holdings."
   },
   {
    "id": "risk60-D08-Q05",
    "prompt": "After the verified 50-share exit, if 30 additional shares are only offered, how many shares remain owned?",
    "review": "The position still holds 150 shares until an actual matching execution occurs; a pending limit sale is not a fill."
   },
   {
    "id": "risk60-D08-Q06",
    "prompt": "What evidence is essential before a simulated scale-out can be treated as a recorded fill?",
    "review": "A specified fill event needs execution timestamp, quantity, price, order reference and the simulator's documented fill assumptions."
   },
   {
    "id": "risk60-D08-Q07",
    "prompt": "A fictional long begins with 120 shares; 40 are confirmed sold and 30 more are offered. What remains?",
    "review": "120−40=80 owned shares remain; the offered 30 are part of the 80 until an actual execution record says otherwise."
   },
   {
    "id": "risk60-D08-Q08",
    "prompt": "A scale-out of 40 from 120 shares represents what proportion of original position size?",
    "review": "40/120×100≈33.33% of original shares exited; 80/120≈66.67% remain owned under the given fills."
   },
   {
    "id": "risk60-D08-Q09",
    "prompt": "Why must remaining position risk be recalculated after a partial confirmed exit?",
    "review": "Share count and therefore dollar exposure to future price changes have changed; intended stop conditions may also need review."
   },
   {
    "id": "risk60-D08-Q10",
    "prompt": "At 150 remaining shares and a hypothetical $0.30 adverse move, what is price-only exposure?",
    "review": "150×$0.30=$45 price-difference exposure for the still-open fictional shares before fees or adverse execution."
   },
   {
    "id": "risk60-D08-Q11",
    "prompt": "Does the later market quote determine realized result for the unfilled 150-share remainder?",
    "review": "No. An unexecuted quote is a mark/reference only; realized gains or losses require actual closing fills and cost accounting."
   },
   {
    "id": "risk60-D08-Q12",
    "prompt": "Transfer: for 90 initial shares, a verified 25-share sale, and an unfilled order for 20, state remaining shares.",
    "review": "90−25=65 shares remain owned; the unfilled twenty-share order does not reduce holdings or establish proceeds."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D08-A01",
    "scenario": "A fictional long starts with 200 shares at $10.00. A verified exit of 50 fills at $10.50; another sell for 30 shares is only posted, not executed.",
    "task": "Reconcile original shares, confirmed exit, unfilled order, realized gross difference and price-only risk on the remaining holdings.",
    "worked": "Confirmed remaining quantity=200−50=150. Realized gross difference for executed 50=(10.50−10.00)×50=$25 before costs. The unfilled 30-share offer leaves holdings unchanged. A further $0.30 adverse move affects the still-open 150 by $45 price-only.",
    "pitfall": "Treating an unfilled limit order as a sale double-counts proceeds and understates remaining share risk; a quoted price is not a settled execution.",
    "transfer": "For an unrelated 120-share fictional holding at $8.00, 40 confirmed sold at $8.20 and 30 posted but unfilled, calculate 80 remaining and $8 gross realized difference."
   }
  ]
 },
 "9": {
  "sourceDay": 12,
  "formativeQuestions": [
   {
    "id": "risk60-D09-Q01",
    "prompt": "A static fictional ask book offers 80 shares at $4.10 and 120 at $4.15. What total size is shown?",
    "review": "The two levels total 80+120=200 visible offered shares; the display can change before a proposed order reaches it."
   },
   {
    "id": "risk60-D09-Q02",
    "prompt": "For 80 shares at $4.10 calculate the hypothetical first-level notional.",
    "review": "80×$4.10=$328 of conditional dollar notional; it does not establish an executed fill."
   },
   {
    "id": "risk60-D09-Q03",
    "prompt": "For 120 shares at $4.15 calculate the conditional second-level notional.",
    "review": "120×$4.15=$498 in displayed-order notional, subject to routing, cancellation and execution uncertainty."
   },
   {
    "id": "risk60-D09-Q04",
    "prompt": "For that 200-share static book compute total hypothetical notional.",
    "review": "$328+$498=$826 for the 200 displayed shares; fees, delays and any hidden interaction are excluded."
   },
   {
    "id": "risk60-D09-Q05",
    "prompt": "Divide $826 by 200 shares to obtain the static weighted average offer price.",
    "review": "The hypothetical average is $826/200=$4.13 per share, not a proven historical broker fill."
   },
   {
    "id": "risk60-D09-Q06",
    "prompt": "What is the unsupported assumption if a learner calls the $4.13 static estimate a real fill?",
    "review": "That every specified level remained available, the simulated order interacted exactly with it, and no routing delay or fees altered execution."
   },
   {
    "id": "risk60-D09-Q07",
    "prompt": "A new fictional offer book has 30 shares at $7.00 and 70 at $7.10. Compute total notional.",
    "review": "30×$7.00+70×$7.10=$210+$497=$707, using the same snapshot assumptions."
   },
   {
    "id": "risk60-D09-Q08",
    "prompt": "For that new 100-share example calculate the weighted average quoted offer.",
    "review": "The conditional weighted average is $707/100=$7.07/share before fees, if the stated 100 shares remained available."
   },
   {
    "id": "risk60-D09-Q09",
    "prompt": "If the top offer cancels before routing, can the earlier weighted estimate remain the planned execution guarantee?",
    "review": "No. Available quote depth and prices changed, invalidating the old snapshot; obtain fresh evidence or withhold the result."
   },
   {
    "id": "risk60-D09-Q10",
    "prompt": "A proposed 250-share buy meets only 200 shares of shown asks. How many lack a shown price?",
    "review": "250−200=50 shares have no displayed offer price in the described book; do not invent a third price level."
   },
   {
    "id": "risk60-D09-Q11",
    "prompt": "What status should a paper simulator assign to its hypothetical order-fill model?",
    "review": "Label the simulation assumptions, market-data cutoff, available depth and delay; never describe a theoretical fill as an independently verified broker trade."
   },
   {
    "id": "risk60-D09-Q12",
    "prompt": "Transfer: a new book displays 25 shares at $5.00 and 75 at $5.20. Calculate its 100-share estimate.",
    "review": "Conditional notional $125+$390=$515; weighted average $515/100=$5.15/share under a static snapshot, not actual executed price."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D09-A01",
    "scenario": "A paper trading rehearsal sees a frozen fictional book with 80 shares offered at $4.10 and 120 at $4.15, but has no later order-routing or cancel/replace events.",
    "task": "Compute a clearly labeled static 200-share buy estimate and document two assumptions that prevent calling it a realized fill.",
    "worked": "Notional=80×$4.10+120×$4.15=$328+$498=$826. For 200 assumed available shares, average $826/200=$4.13/share. The result is conditional: quotes might cancel, order routing differs, and the simulator has not supplied transaction-level fills.",
    "pitfall": "Using a static order book as a broker execution ledger fabricates volume and profit observations; every paper fill requires declared simulator assumptions.",
    "transfer": "With 30 shares offered at $7.00 and 70 at $7.10, independently compute $707 total and $7.07 hypothetical average, then consider an early cancellation."
   }
  ]
 }
});
