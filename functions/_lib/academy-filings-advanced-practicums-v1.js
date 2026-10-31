/* 13 advanced filing/source-verification cases covering all 7 study days.
 * Fictional issuer numbers. No legal, accounting or investing certification.
 */
export const filingsAdvancedV1=Object.freeze({
 "1": [
  {
   "id": "filings7-D01-A01",
   "scenario": "A fictional issuer reports $2.5 million quarterly revenue compared with $2 million a year earlier.",
   "task": "Calculate growth and identify which claim this supports.",
   "worked": "Growth is ($2.5m−$2.0m)/$2.0m=25% for comparable quarters. Revenue growth is not proof of net earnings, free cash flow or a future stock-price increase.",
   "pitfall": "Calling the 25% top-line change a 25% net-profit increase mixes two distinct financial measures.",
   "transfer": "Add current expenses of $2.7m and list what can and cannot be inferred without complete GAAP statements."
  },
  {
   "id": "filings7-D01-A02",
   "scenario": "A secondary article names a technology company but supplies no CIK, fiscal period or filing accession.",
   "task": "Design the first-principles original-source identification process.",
   "worked": "Find the legal filer through SEC EDGAR, verify name/ticker and CIK, retrieve accession/form/date, determine the reporting period and verify the quoted item or exhibit. Do not start with a prediction.",
   "pitfall": "Identical company names or ticker changes make unsourced document matches unreliable.",
   "transfer": "Rebuild the ledger for a renamed fictional issuer and state how you rule out a wrong entity."
  }
 ],
 "2": [
  {
   "id": "filings7-D02-A01",
   "scenario": "A fictional 8-K is accepted after market close and an associated press release is posted earlier that afternoon.",
   "task": "Build a decision-time ledger with separate timestamps and identify the available facts.",
   "worked": "Store release publication and SEC filing acceptance timestamps separately. A trading choice before SEC acceptance cannot cite that filing; a verified earlier press release may supply only the facts actually disclosed then.",
   "pitfall": "Treating filing availability and press-release availability as identical creates lookahead and misquotes the source.",
   "transfer": "Move the decision cutoff between the two timestamps and distinguish what may legitimately be used."
  },
  {
   "id": "filings7-D02-A02",
   "scenario": "A Form 8-K reports a material agreement, but the excerpt states completion depends on regulatory approval.",
   "task": "Explain the difference between an announced conditional agreement and completed revenue.",
   "worked": "A binding agreement may have conditions precedent; neither closing nor cash receipt nor GAAP revenue follows automatically. Review the original item, exhibit, conditions and recognition criteria.",
   "pitfall": "An announced conditional contract should not automatically be booked as a realized profit or guaranteed catalyst.",
   "transfer": "Remove the exhibit and identify why the remaining headline cannot establish completion or exact accounting impact."
  }
 ],
 "3": [
  {
   "id": "filings7-D03-A01",
   "scenario": "A fictional earnings report shows revenue $10m, direct costs $6m, operating costs $3m, and interest costs $0.5m.",
   "task": "Compute available intermediate results and name missing elements before net-income claims.",
   "worked": "Gross profit under this simplified cost classification is $10m−$6m=$4m. Operating result before other items is $4m−$3m=$1m. Subtracting $0.5m interest yields $0.5m before tax and any omitted items, not a verified reported net income.",
   "pitfall": "Failing to distinguish gross, operating and pretax figures turns a toy calculation into a false GAAP net-income statement.",
   "transfer": "Introduce a fictional $0.2m tax expense and ask whether missing gains or adjustments could still change reported net income."
  },
  {
   "id": "filings7-D03-A02",
   "scenario": "An issuer reports adjusted non-GAAP EPS $0.30 and GAAP EPS $0.12 in the same period.",
   "task": "Calculate their difference and establish the required analytical follow-up.",
   "worked": "The reported arithmetic difference is $0.18/share. Determine the issuer's reconciliation and exclusions, share basis and whether both measures represent the same diluted period; do not infer the difference is cash received.",
   "pitfall": "Subtracting two EPS values without checking denominator and adjustment basis may misrepresent the economic bridge.",
   "transfer": "Examine a fictional adjustment schedule and classify recurring/nonrecurring costs without treating the adjusted figure as a guaranteed future result."
  }
 ],
 "4": [
  {
   "id": "filings7-D04-A01",
   "scenario": "Ten million common shares are outstanding, followed by issuance of two million additional common shares.",
   "task": "Compute post-issuance ownership proportions and identify the simplifying assumptions.",
   "worked": "New total is 12m. Earlier holders collectively own 10/12≈83.33%, assuming no sales or conversions. New shares represent 2/12≈16.67% of outstanding; proceeds depend on price, costs and closing.",
   "pitfall": "A filing that permits issuance is not itself proof the shares were sold or that cash was received.",
   "transfer": "Add warrants for 1m shares with an exercise condition and distinguish current outstanding from fully diluted scenario counts."
  },
  {
   "id": "filings7-D04-A02",
   "scenario": "An issuer registers up to $20m securities on a shelf, while a headline says it already raised $20m.",
   "task": "Identify the evidence needed to classify registration versus completed financing.",
   "worked": "Registration generally establishes a potential offering framework, not necessarily a takedown, pricing, sale or net proceeds. Locate prospectus supplement and closing disclosures to verify amounts.",
   "pitfall": "Conflating registration capacity with closed proceeds misstates actual capital and dilution.",
   "transfer": "Assume a later $5m gross takedown with $0.3m expenses and compute simplified net proceeds, explicitly labeled conditional."
  }
 ],
 "5": [
  {
   "id": "filings7-D05-A01",
   "scenario": "A shareholder owns 1,000 shares at a fictional $0.80 before a 1-for-10 reverse split.",
   "task": "Compute mechanically adjusted shares, theoretical price and total position value.",
   "worked": "1,000/10=100 shares; $0.80×10=$8.00 theoretical price; 100×$8=$800, identical to the presplit 1,000×$0.80=$800 ignoring price moves and fees.",
   "pitfall": "Calling the nominal $0.80 to $8.00 price jump a 900% return ignores the inverse share count.",
   "transfer": "Repeat for a 1-for-5 ratio and explain why a holder of 103 shares may face fractional-share treatment."
  },
  {
   "id": "filings7-D05-A02",
   "scenario": "A fictional earnings-per-share chart was built using unadjusted share counts before a reverse split.",
   "task": "Explain the reconciliation needed before comparing pre/post corporate-action EPS.",
   "worked": "Check the official effective date, historical presentation and whether reported EPS and weighted-average shares were retrospectively adjusted. Compare consistent share units and disclosure periods.",
   "pitfall": "Multiplying every EPS mechanically by the split ratio without checking reported restatement conventions can double-adjust historical series.",
   "transfer": "Document a revised fiscal-year exhibit and determine which earlier share-per-unit calculations must be relabeled."
  }
 ],
 "6": [
  {
   "id": "filings7-D06-A01",
   "scenario": "Guidance is $12m–$14m revenue, but a repost claims that $14m of revenue is already received.",
   "task": "Build a claim-evidence matrix and distinguish forecast, actual and market expectation.",
   "worked": "$14m is an upper projected bound; no actual cash receipt is established. Record original issuer wording, dated forecast, actual reporting period and a distinct contemporaneous expectations source before labeling an earnings surprise.",
   "pitfall": "Treating a maximum guidance number as realized revenue or an analyst beat is incorrect.",
   "transfer": "Add later actual $13m: classify it inside guidance and explain why it might still be below a separate expectation."
  },
  {
   "id": "filings7-D06-A02",
   "scenario": "A social-media catalyst claim circulates at 09:28; issuer confirms selected facts in a later filing at 10:12.",
   "task": "Audit hindsight risks in a 09:35 fictional trading decision.",
   "worked": "At 09:35, the later 10:12 filing is unavailable. Only verified information known at or before 09:35 may support the first decision. The later confirmation does not retroactively validate the earlier rumor for grading.",
   "pitfall": "Updating a frozen 09:35 decision with a 10:12 source gives the learner knowledge that did not exist then.",
   "transfer": "Record separate first and second decisions and identify what independently changed at 10:12."
  }
 ],
 "7": [
  {
   "id": "filings7-D07-A01",
   "scenario": "A fictional press headline claims profits doubled; the corresponding exhibit shows revenue $1m→$2m, operating cost $2.2m, and a contingent future agreement.",
   "task": "Prepare a source-backed independent memo with computation and NO TRADE criterion.",
   "worked": "Revenue growth is ($2m−$1m)/$1m=100%. $2m revenue minus stated $2.2m operating costs leaves a $0.2m shortfall before any missing items; the headline's profit claim is unsupported. A contingent agreement is not realized revenue. Decision: withhold conclusion/trade until original filing and full period statements reconcile.",
   "pitfall": "An arithmetic revenue doubling cannot establish earnings growth or a contract's recognized income.",
   "transfer": "Freeze a decision before a later corrected exhibit, then produce a second memo at the later timestamp with both versions explicitly cited."
  }
 ]
});
