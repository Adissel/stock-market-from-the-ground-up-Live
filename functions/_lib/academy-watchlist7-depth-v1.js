const specifications = Object.freeze([
  Object.freeze({ operation: 'ratio', a: 4, b: 6, expected: 66.66666666666667, units: 'percent required-field completeness', formula: '4 / 6 x 100', evidence: 'A fictional research row contains issuer identity, symbol, research question, and checked-at time, but lacks a next-review event and removal rule.', decision: 'The row is 66.67% complete against the six-field exercise contract and remains a research draft, not an order instruction.' }),
  Object.freeze({ operation: 'ratio', a: 84000, b: 56000, expected: 150, units: 'percent of comparable baseline volume', formula: '84,000 / 56,000 x 100', evidence: 'A fictional candidate records 84,000 shares in a completed five-minute interval against 56,000 shares in the defined comparable five-minute baseline.', decision: 'The 150% result equals 1.5 times the stated baseline; spread, depth, catalyst, and quote freshness remain separate gates.' }),
  Object.freeze({ operation: 'difference', a: 23, b: 11, expected: 12, units: 'minutes between original release and repost', formula: '23 - 11', evidence: 'A fictional issuer posts a conditional release at 08:11 ET and a social account republishes it at 08:23 ET as a completed agreement.', decision: 'The repost is twelve minutes later and cannot change the conditional language or establish contract completion.' }),
  Object.freeze({ operation: 'ratio', a: 0.35, b: 0.70, expected: 50, units: 'percent of candle range occupied by the body', formula: '0.35 / 0.70 x 100', evidence: 'A completed fictional five-minute candle opens at $7.80, closes at $8.15, reaches $8.30, and falls to $7.60; body is $0.35 and range is $0.70.', decision: 'The body occupies 50% of the range, but OHLC does not reveal intrabar event order or the next candle.' }),
  Object.freeze({ operation: 'ratio', a: 0.08, b: 3.14, expected: 2.547770700636943, units: 'percent midpoint spread', formula: '0.08 / 3.14 x 100', evidence: 'A fictional quote shows $3.10 bid and $3.18 ask, producing an $0.08 spread and $3.14 midpoint under a predeclared 2.00% maximum.', decision: 'The 2.55% midpoint spread fails the exercise limit; displayed quotes still do not prove executable depth.' }),
  Object.freeze({ operation: 'difference', a: 5, b: 3, expected: 2, units: 'ranking-point margin', formula: '5 - 3', evidence: 'Under a fictional rubric fixed before review, Candidate A earns five documented research points and Candidate B earns three; A then loses primary-source eligibility after an amendment.', decision: 'The two-point ranking margin cannot override a mandatory source veto; preserve both the original and amended versions.' }),
  Object.freeze({ operation: 'ratio', a: 1, b: 4, expected: 25, units: 'percent presently eligible candidates', formula: '1 / 4 x 100', evidence: 'In a fresh fictional transfer, four candidates are reviewed: one passes every declared gate, one lacks a primary source, one breaches spread, and one has a stale quote.', decision: 'Only 25% are presently eligible under the exercise rules; this is neither a win rate nor permission to trade.' })
]);

export function watchlist7Depth(base, day) {
  const spec = specifications[day - 1];
  if (!spec) throw new RangeError(`Watchlist7 day ${day} is outside the seven-day curriculum.`);
  const prefix = `WATCHLIST7-D${String(day).padStart(2, '0')}-ADV-`;
  const worked = `${spec.formula} = ${spec.expected} ${spec.units}. ${spec.decision}`;
  const rows = [
    ['Freeze the research cutoff and identify the record being evaluated.', spec.evidence],
    ['Explain the day concept from first principles.', base.explanation],
    ['Bound the educational reference.', `${base.reference.label} supports the stated research method; ${base.reference.scope}`],
    ['Apply the canonical procedure in sequence.', base.sourceProcedure.join(' ')],
    ['Show the numerical work with inputs, denominator, and units.', worked],
    ['Interpret the result without converting research into an order.', `${spec.decision} ${base.whenNot}`],
    ['Identify evidence that is still missing.', `The calculation cannot replace source ownership, timestamp, session, quote freshness, depth, or the day-specific requirement. ${base.why}`],
    ['Diagnose and correct the common misconception.', `${base.error} Correct it by returning to the declared source, cutoff, and mandatory gates.`],
    ['Write a prospective rejection or WAIT rule.', `If the required evidence is absent or contradictory, retain WAIT or REMOVE. ${base.reviewGuide}`],
    ['Explain why guided work is not independent acceptance.', 'The worked calculation is ungraded practice; repeating it does not establish transfer, protected mastery, or independent editorial approval.'],
    ['Transfer the method to different evidence.', `Use new inputs and a different candidate: ${base.transfer}`],
    ['Review process independently from later price movement.', `${base.investigation} Preserve the original decision before inspecting any later fictional result.`]
  ];

  return Object.freeze({
    formativeQuestions: Object.freeze(rows.map(([prompt, review], index) => Object.freeze({
      id: `${prefix}Q${String(index + 1).padStart(2, '0')}`,
      prompt: `Watchlist7 day ${day} — ${base.title}: ${prompt} FICTIONAL evidence: ${spec.evidence}`,
      review: `Watchlist7 day ${day} guided review: ${review}`
    }))),
    advancedPracticums: Object.freeze([Object.freeze({
      id: `${prefix}CASE`,
      scenario: `FICTIONAL ADVANCED WATCHLIST CASE: ${spec.evidence}`,
      task: `Calculate ${spec.formula}, apply the existing source procedure, and make a research disposition without using a future price. ${base.selfCheck}`,
      worked: `${worked} ${base.explanation}`,
      pitfall: `COMMON MISCONCEPTION: ${base.error} ${base.whenNot}`,
      transfer: `INDEPENDENT FICTIONAL TRANSFER: ${base.transfer} Use different inputs and name the evidence that would require WAIT or removal.`
    })]),
    advancedNumericChecks: Object.freeze([Object.freeze({ operation: spec.operation, a: spec.a, b: spec.b, expected: spec.expected, units: spec.units, note: spec.evidence })]),
    instructionalFocus: spec.evidence,
    supplementarySourceStatus: 'ORIGINAL_WATCHLIST7_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'
  });
}
