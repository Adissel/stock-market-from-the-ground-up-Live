/* Risk60 canonical D10 completed-pivot/time cutoffs. Ungraded.
 * Twelve original formative questions plus separate worked transfer.
 */
import {risk60DepthDay11V1} from './academy-risk60-depth-day11-v1.js';
import {risk60DepthDay12V1} from './academy-risk60-depth-day12-v1.js';
import {risk60DepthDay13V1} from './academy-risk60-depth-day13-v1.js';
import {risk60DepthDay14V1} from './academy-risk60-depth-day14-v1.js';
/* The original academy importer retains its stable named export. Extra
 * independently-authored day keys are added here without changing canonical
 * study IDs or the already shipped bootcamp-academy import contract.
 */
export const risk60DepthDay10V1=Object.freeze({
 ...risk60DepthDay11V1,...risk60DepthDay12V1,
 ...risk60DepthDay13V1,...risk60DepthDay14V1,
 "10": {
  "sourceDay": 13,
  "formativeQuestions": [
   {
    "id": "risk60-D10-Q01",
    "prompt": "A fictional 2-left/2-right pivot rule requires what observations to confirm a swing?",
    "review": "Two completed bars before and two completed bars after the candidate pivot, using the declared comparison rule and no unfinished future bars."
   },
   {
    "id": "risk60-D10-Q02",
    "prompt": "At first appearance of a potential high, can a two-right-bar swing-high pivot already be confirmed?",
    "review": "No. The next two bars do not yet exist at that time, so the candidate is provisional rather than a confirmed swing high."
   },
   {
    "id": "risk60-D10-Q03",
    "prompt": "Confirmed highs progress from $7.90 to $8.25. What market-structure observation follows?",
    "review": "The second confirmed high is $0.35 above the first, supporting the description of a higher high for that selected swing sequence."
   },
   {
    "id": "risk60-D10-Q04",
    "prompt": "Confirmed lows progress from $7.10 to $7.35. What observation follows?",
    "review": "The second low is $0.25 higher than the first; under the stated pivot rule this is a confirmed higher low."
   },
   {
    "id": "risk60-D10-Q05",
    "prompt": "Do a higher high and higher low guarantee a profitable breakout on the next candle?",
    "review": "No. Historical structure describes known pivots; it cannot certify a future candle, available fill, or probability without further evidence."
   },
   {
    "id": "risk60-D10-Q06",
    "prompt": "For a different sequence, confirmed highs fall from $10.20 to $9.90. How should they be labeled?",
    "review": "The second confirmed high is $0.30 lower, so the known sequence shows a lower high, not a breakout guarantee."
   },
   {
    "id": "risk60-D10-Q07",
    "prompt": "In that sequence, confirmed lows fall from $9.40 to $9.15. Label the pattern.",
    "review": "The second confirmed low is $0.25 lower, describing a lower low under the same completed-bar pivot definition."
   },
   {
    "id": "risk60-D10-Q08",
    "prompt": "A current unfinished bar briefly exceeds the prior confirmed high. May it be labeled a confirmed pivot high?",
    "review": "No. A brief intrabar price observation has not completed the required bar and right-side confirmation; keep it provisional."
   },
   {
    "id": "risk60-D10-Q09",
    "prompt": "Why should the source timeframe and bar-closing convention accompany a pivot label?",
    "review": "A 1-minute pivot and 5-minute pivot depend on different bar sets and right-side confirmation times; without those units the observation is ambiguous."
   },
   {
    "id": "risk60-D10-Q10",
    "prompt": "If the two-right-bar evidence arrives later, which time belongs to the confirmed pivot observation?",
    "review": "Record the original candidate bar and the later confirmation time distinctly; do not backdate the confirmed status to the candidate's first print."
   },
   {
    "id": "risk60-D10-Q11",
    "prompt": "What role does a no-trade boundary have when the declared pivot observation lacks confirmation?",
    "review": "It prevents treating a provisional swing as an independently confirmed entry and preserves a repeatable evidence requirement."
   },
   {
    "id": "risk60-D10-Q12",
    "prompt": "Transfer: a new completed series has highs $12.10 then $11.80 and lows $11.20 then $10.90. How is it described?",
    "review": "The known structure contains a lower high and lower low; note the pivot confirmation rule and avoid inferring the next bar or fill."
   }
  ],
  "advancedPracticums": [
   {
    "id": "risk60-D10-A01",
    "scenario": "A fictional completed-bar pivot detector requires two left and two right bars. It has confirmed highs $7.90 and $8.25 and lows $7.10 and $7.35, while the current one-minute bar remains unfinished.",
    "task": "Classify the already confirmed highs and lows, identify the confirmation-time lag and specify what the unfinished current bar cannot prove.",
    "worked": "The confirmed swing highs increase by $0.35 (higher high) and lows by $0.25 (higher low), but each pivot was known only after two subsequent completed bars. The current unfinished bar cannot be counted as a confirmed pivot or a predicted breakout.",
    "pitfall": "Backdating a later-confirmed pivot to its first price observation creates lookahead bias; treating HH/HL as a guarantee ignores execution and failure scenarios.",
    "transfer": "For a different completed fictional structure with highs $10.20 then $9.90 and lows $9.40 then $9.15, label lower high and lower low, record bar-confirmation times and state a no-trade boundary."
   }
  ]
 }
});
