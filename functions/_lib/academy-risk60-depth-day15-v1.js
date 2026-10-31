/* Original Risk60 D15 source-specific fictional practice. Ungraded. */
export const risk60DepthDay15V1=Object.freeze({
 "15": {
  "sourceDay": 23,
  "formativeQuestions": [
   {
    "id": "risk60-D15-Q01",
    "prompt": "What is confirmed by a completed $10.05 close above a $10.00 chart level?",
    "review": "Only the completed $0.05/share difference is observed; order execution and next price are not established."
   },
   {
    "id": "risk60-D15-Q02",
    "prompt": "What is the stated quoted spread between $10.01 bid and $10.17 offer?",
    "review": "Subtract bid from offer: $10.17−$10.01=$0.16 per share, assuming quotes share an eligible timestamp."
   },
   {
    "id": "risk60-D15-Q03",
    "prompt": "Calculate the midpoint of the fictional $10.01/$10.17 displayed market.",
    "review": "The arithmetic midpoint is ($10.01+$10.17)/2=$10.09/share; it is not a broker fill."
   },
   {
    "id": "risk60-D15-Q04",
    "prompt": "Compute the $0.16 spread as a percentage of its $10.09 midpoint.",
    "review": "$0.16/$10.09×100≈1.586%, rounded to 1.59%; the denominator must be identified."
   },
   {
    "id": "risk60-D15-Q05",
    "prompt": "The precommitted spread maximum is 1%. Does the 1.59% quote satisfy it?",
    "review": "No. The observed spread exceeds the stated threshold independently of the completed price level."
   },
   {
    "id": "risk60-D15-Q06",
    "prompt": "What is unknown when the issuer catalyst has no original dated source?",
    "review": "The claim's authenticity, issuer identity, original publication and relevant conditions remain unverified."
   },
   {
    "id": "risk60-D15-Q07",
    "prompt": "Does a positive price pattern eliminate the need for documented risk controls?",
    "review": "No. The learning plan requires each mandatory source, quote and size check before a hypothetical decision."
   },
   {
    "id": "risk60-D15-Q08",
    "prompt": "Why must a trainee distinguish a dated filing from a viral headline?",
    "review": "A secondary headline may omit conditions or timing, while original documentation is necessary for verification."
   },
   {
    "id": "risk60-D15-Q09",
    "prompt": "What should be recorded when a symbol is subject to a market trading halt?",
    "review": "Record the dated halt status and any known resumption requirements; do not infer a currently executable quote."
   },
   {
    "id": "risk60-D15-Q10",
    "prompt": "Find the quoted spread relative to midpoint for a $9.95 bid and $10.05 ask.",
    "review": "The spread is $0.10 and midpoint $10.00, yielding $0.10/$10.00×100=1.00%."
   },
   {
    "id": "risk60-D15-Q11",
    "prompt": "If an inclusive maximum of 1% is satisfied, are all research controls satisfied?",
    "review": "No. Passing spread does not establish source identity, eligible liquidity, position limits or a fill."
   },
   {
    "id": "risk60-D15-Q12",
    "prompt": "What can be concluded from a completed level reclaim without valid current ask data?",
    "review": "The price-level observation is known, but available buy execution data are missing, so retain WAIT."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D15-A01",
    "scenario": "A fictional completed breakout closes at $10.05 over a $10.00 level, while an eligible quote shows $10.01 bid and $10.17 ask and the issuer announcement is unverified.",
    "task": "Calculate spread, midpoint and the percentage relative to midpoint; compare with the exercise's 1.00% quoted-spread ceiling and identify missing original-source evidence.",
    "worked": "Spread=$10.17−$10.01=$0.16/share. Midpoint=($10.01+$10.17)/2=$10.09. Ratio=$0.16/$10.09×100≈1.586%, greater than 1.00%. The quote and verification conditions fail; this educational decision is NO TRADE.",
    "pitfall": "A completed candle crossing a chart level does not verify a real order fill, eliminate quote costs or authenticate a secondary news claim.",
    "transfer": "For an independent $9.95/$10.05 fictional quote calculate the 1.00% spread-to-midpoint ratio, then separately describe unresolved evidence if the original catalyst is unavailable."
   }
  ]
 }
});
