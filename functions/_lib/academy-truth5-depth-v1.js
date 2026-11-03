const daySpecifications = Object.freeze([
  Object.freeze({ operation: 'difference', a: 34, b: 9, expected: 25, units: 'minutes between the original source and the later claim', calculation: '34 - 9 = 25 minutes', reference: Object.freeze({ label: 'SEC Investor.gov — How To Read an 8-K', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/form-8-k', scope: 'Explains the purpose and timing of current reports; it does not verify a social-media claim or market outcome.' }) }),
  Object.freeze({ operation: 'ratio_percent', a: 7, b: 10, expected: 70, units: 'percent of claims linked to a primary source', calculation: '7 / 10 x 100 = 70%', reference: Object.freeze({ label: 'SEC — Forms 10-K and 10-Q', url: 'https://www.sec.gov/answers/form10k.htm', scope: 'Explains annual and quarterly filing roles; it does not certify a headline interpretation.' }) }),
  Object.freeze({ operation: 'ratio_percent', a: 18, b: 24, expected: 75, units: 'percent of records with verified timestamps', calculation: '18 / 24 x 100 = 75%', reference: Object.freeze({ label: 'SEC EDGAR filing search', url: 'https://www.sec.gov/edgar/search/', scope: 'Provides filing records and metadata; accepted time alone does not prove the learner retrieval time or market causation.' }) }),
  Object.freeze({ operation: 'ratio_percent', a: 6, b: 15, expected: 40, units: 'percent of observations selected for a misleading sample', calculation: '6 / 15 x 100 = 40%', reference: Object.freeze({ label: 'FINRA — Understanding Stock Splits', url: 'https://www.finra.org/investors/investing/investment-products/stocks/stock-splits', scope: 'Explains split mechanics; it does not establish an executable price, liquidity, or investment return.' }) }),
  Object.freeze({ operation: 'ratio_percent', a: 11, b: 16, expected: 68.75, units: 'percent of claims independently verified', calculation: '11 / 16 x 100 = 68.75%', reference: Object.freeze({ label: 'SEC Investor.gov — Researching Investments', url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments', scope: 'Provides a due-diligence starting point; it does not independently accept the learner capstone or predict a trade.' }) })
]);

function sourceBoundary(base) {
  const sourceCase = base.sourceClaimCase;
  if (!sourceCase) return 'The lesson procedure supports a verification method; it does not certify a market claim or outcome.';
  return `${sourceCase.sourceLabel} is a source-reported case with this boundary: ${sourceCase.limits}`;
}

export function truth5Depth(base, day) {
  const specification = daySpecifications[day - 1];
  if (!specification) throw new RangeError(`Truth5 day ${day} is outside the five-day curriculum.`);

  const { operation, a, b, expected, units, calculation, reference } = specification;
  const evidence = `FICTIONAL Truth5 day ${day} evidence set compares ${a} and ${b} for ${units}. It does not establish a real issuer claim, fill, or market outcome.`;
  const worked = `${calculation}. Preserve the source date, units, denominator when applicable, and decision cutoff.`;
  const prefix = `TRUTH5-D${String(day).padStart(2, '0')}-ADV-`;
  const rows = [
    ['Identify the claimant and decision cutoff.', evidence],
    ['Explain the applicable source hierarchy.', base.explanation],
    ['Bound the cited evidence.', sourceBoundary(base)],
    ['Follow the verification procedure.', base.sourceProcedure.join(' ')],
    ['Show the calculation and units.', worked],
    ['Interpret the result without overclaiming.', `${worked} The result measures only the stated fictional evidence set.`],
    ['Name an alternative explanation.', 'A timing, scope, corporate-action, or denominator mismatch may explain the apparent claim.'],
    ['Correct the practical misconception.', `${base.error} Return to the original record and consistent units.`],
    ['Specify a stop rule.', 'If issuer identity, publication time, measured period, or original source cannot be verified, retain UNVERIFIED and do not infer a trade.'],
    ['Separate practice from certification.', 'Guided review is ungraded practice and is not independent editorial or protected-assessment acceptance.'],
    ['Transfer the method independently.', `${base.transfer} Use a different claimant, document, and numerical evidence set.`],
    ['Review the quality of the conclusion.', `${base.reviewGuide} Preserve contrary and missing evidence in the ledger.`]
  ];

  return Object.freeze({
    formativeQuestions: Object.freeze(rows.map(([prompt, review], index) => Object.freeze({
      id: `${prefix}Q${String(index + 1).padStart(2, '0')}`,
      prompt: `Truth5 day ${day}: ${prompt} ${evidence}`,
      review: `Truth5 day ${day} review: ${review}`
    }))),
    advancedPracticums: Object.freeze([Object.freeze({
      id: `${prefix}CASE`,
      scenario: `FICTIONAL CLAIM REVIEW: ${evidence}`,
      task: 'Recalculate the stated measure, apply the lesson source procedure, and classify the claim without using later outcomes.',
      worked: `${worked} ${base.explanation}`,
      pitfall: `COMMON ERROR: ${base.error}`,
      transfer: `INDEPENDENT TRANSFER: ${base.transfer}`
    })]),
    advancedNumericChecks: Object.freeze([Object.freeze({ operation, a, b, expected, units, note: evidence })]),
    reference,
    instructionalFocus: evidence,
    supplementarySourceStatus: 'ORIGINAL_TRUTH5_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'
  });
}
