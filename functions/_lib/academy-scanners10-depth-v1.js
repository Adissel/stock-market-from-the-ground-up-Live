const specifications = Object.freeze([
  Object.freeze({"operation":"ratio","a":315,"b":420,"expected":75,"units":"percent of declared scanner universe","formula":"315 / 420 x 100","evidence":"A fictional snapshot declares 420 instruments: 315 listed common shares, 65 ETFs, and 40 OTC securities. The stated screen evaluates only listed common shares.","decision":"Exactly 75% of the declared population enters this first filter. Excluded instruments are not negative price-screen results."}),
  Object.freeze({"operation":"ratio","a":0.6,"b":4.8,"expected":12.5,"units":"percent change from declared baseline","formula":"($5.40 - $4.80) / $4.80 x 100","evidence":"A fictional completed comparison changes from $4.80 to $5.40 using the same adjustment basis and a declared reference window. A filter requires at least 10%.","decision":"The 12.5% arithmetic clears this one filter; the scanner must still inspect split adjustments, session alignment and execution constraints."}),
  Object.freeze({"operation":"multiple","a":54000,"b":36000,"expected":1.5,"units":"times comparable five-minute baseline","formula":"54,000 / 36,000","evidence":"A completed fictional five-minute bar has 54,000 shares and the same time-of-day reference five-minute average is 36,000 shares.","decision":"The comparable interval is 1.50 times baseline volume. It cannot be compared directly with a full-day reference or treated as order-book liquidity."}),
  Object.freeze({"operation":"difference","a":2400,"b":4,"expected":600,"units":"new shares after hypothetical reverse split","formula":"2,400 / 4","evidence":"A fictional holder begins with 2,400 shares before a one-for-four reverse split, without fractional-share complications or intervening price movement.","decision":"The holding becomes 600 shares by the mechanical ratio. Per-share repricing does not automatically create a gain or prove a current tradable float."}),
  Object.freeze({"operation":"difference","a":14,"b":7,"expected":7,"units":"minutes old at the declared premarket decision pause","formula":"08:14 - 08:07","evidence":"At a fictional 08:14 ET premarket pause, the most recent quote is timestamped 08:07 ET. The rule permits a quote age of at most two minutes.","decision":"The quote is seven minutes old and fails freshness. Premarket depth and regular-session volume are not interchangeable."}),
  Object.freeze({"operation":"ratio","a":0.12,"b":7.46,"expected":1.60857908847185,"units":"percent quoted midpoint spread","formula":"($7.52 - $7.40) / $7.46 x 100","evidence":"A fictional bid is $7.40 and ask $7.52 at the same observed time. The predefined midpoint-spread threshold is 1.50%.","decision":"The quoted 1.61% spread breaches the rule; a passing spread would still not confirm executable depth or realized fills."}),
  Object.freeze({"operation":"difference","a":29,"b":17,"expected":12,"units":"minutes between issuer posting and social repost","formula":"08:29 - 08:17","evidence":"A fictional issuer posts a conditional disclosure at 08:17 ET; a social repost at 08:29 ET incorrectly describes the condition as completed.","decision":"The repost follows the issuer posting by twelve minutes. Neither timestamp establishes a completed transaction or a causal explanation for price."}),
  Object.freeze({"operation":"overlap","a":14,"b":9,"c":5,"expected":18,"units":"distinct invalid scanner hits","formula":"14 split-mismatch + 9 stale-quote - 5 in both groups","evidence":"A fictional scan returns sixty hits. Fourteen have price-adjustment mismatch, nine have stale quotes, and five belong to both defective groups.","decision":"Eighteen unique hits are defective on these two gates; the other forty-two are merely not excluded by these gates and still need review."}),
  Object.freeze({"operation":"difference","a":5,"b":3,"expected":2,"units":"optional ranking points","formula":"5 - 3","evidence":"A fictional candidate earns five optional scanner flags but has no verifiable primary catalyst; a second earns three flags with current source and spread evidence.","decision":"The two-point optional margin cannot override a mandatory primary-source veto. Rank is not an entry order."}),
  Object.freeze({"operation":"remaining","a":75,"b":6,"c":3,"d":2,"expected":68,"units":"records still complete after unique missing-data exclusions","formula":"75 - (6 missing timestamps + 3 missing volumes - 2 overlapping)","evidence":"A frozen fictional 75-row scanner output has six rows missing observed timestamps, three missing volume, and two rows missing both fields.","decision":"Seven distinct rows lack mandatory evidence; sixty-eight remain complete on these two checks only. Version the rule and input snapshot before audit."})
]);

export function scanners10Depth(base, day) {
  const spec = specifications[day - 1];
  if (!spec) throw new RangeError(`Scanners10 day ${day} is outside the ten-day curriculum.`);
  const prefix = `SCANNERS10-D${String(day).padStart(2, '0')}-ADV-`;
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
    ['Write a prospective rejection or WAIT rule.', `If the required evidence is absent or contradictory, retain EXCLUDE or WAIT. ${base.reviewGuide}`],
    ['Explain why guided work is not independent acceptance.', 'The worked calculation is ungraded practice; repeating it does not establish transfer, protected mastery, or independent editorial approval.'],
    ['Transfer the method to different evidence.', `Use new inputs and a different candidate: ${base.transfer}`],
    ['Review process independently from later price movement.', `${base.investigation} Preserve the original decision before inspecting any later fictional result.`]
  ];

  return Object.freeze({
    formativeQuestions: Object.freeze(rows.map(([prompt, review], index) => Object.freeze({
      id: `${prefix}Q${String(index + 1).padStart(2, '0')}`,
      prompt: `Scanners10 day ${day} — ${base.title}: ${prompt} FICTIONAL evidence: ${spec.evidence}`,
      review: `Scanners10 day ${day} guided review: ${review}`
    }))),
    advancedPracticums: Object.freeze([Object.freeze({
      id: `${prefix}CASE`,
      scenario: `FICTIONAL ADVANCED SCANNER CASE: ${spec.evidence}`,
      task: `Calculate ${spec.formula}, apply the existing source procedure, and make a research disposition without using a future price. ${base.selfCheck}`,
      worked: `${worked} ${base.explanation}`,
      pitfall: `COMMON MISCONCEPTION: ${base.error} ${base.whenNot}`,
      transfer: `INDEPENDENT FICTIONAL TRANSFER: ${base.transfer} Use different inputs and name the evidence that would require WAIT or removal.`
    })]),
    advancedNumericChecks: Object.freeze([Object.freeze({ operation: spec.operation, a: spec.a, b: spec.b, expected: spec.expected, units: spec.units, note: spec.evidence })]),
    instructionalFocus: spec.evidence,
    supplementarySourceStatus: 'ORIGINAL_SCANNERS10_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'
  });
}
