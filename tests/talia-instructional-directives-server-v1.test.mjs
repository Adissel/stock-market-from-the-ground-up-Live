import test from 'node:test';
import assert from 'node:assert/strict';
import {answerFromGuide,parseInstructionalDirective} from '../functions/_lib/original-competency-tutor-v014100.js';

const guide={title:'VWAP evidence',concept:'VWAP is a cumulative price-volume relationship.',
 procedure:'Use completed fictional bars, typical price, volume, cumulative notional and cumulative volume.',
 workedCase:'FICTIONAL bars use different prices and volumes to calculate a proxy VWAP.',
 selfCheck:'Calculate a fresh proxy VWAP and label the units.',reviewExplanation:'Recompute cumulative notional before dividing.',
 commonError:'Calling an OHLCV proxy exact transaction-level VWAP.',limit:'Bar data cannot reconstruct every trade print.',
 invalidation:'Restart the calculation at the authorized session boundary.',
 transferQuestion:'FICTIONAL new bars have different prices and volumes; calculate without reusing the demonstration.'};
const prompt=(perspective,method)=>`Instructional perspective: ${perspective}. Method: ${method}. Teach VWAP.`;

test('server recognizes only the five approved perspectives and methods',()=>{
 assert.deepEqual(parseInstructionalDirective(prompt('Apply','WE DO')),{perspective:'Apply',method:'WE DO',question:'Teach VWAP.'});
 assert.equal(parseInstructionalDirective('Method: I DO. Teach VWAP.'),null);
 assert.equal(parseInstructionalDirective('Instructional perspective: Predict. Method: I DO. Teach VWAP.'),null);
});

test('each gradual-release method produces distinct source-only teaching behavior',()=>{
 const methods=['I DO','WE DO','YOU DO','REVIEW','TRANSFER'];
 const responses=methods.map(method=>answerFromGuide(guide,method==='REVIEW'?'review':'explain','I divided too early.',prompt('Understand',method)));
 assert.equal(new Set(responses).size,5);
 assert.match(responses[0],/watch the reasoning sequence/i);
 assert.match(responses[1],/Hint before a solution/i);
 assert.match(responses[2],/complete an ungraded attempt before reviewing/i);
 assert.match(responses[3],/Likely misconception:[\s\S]*Recompute cumulative notional/i);
 assert.match(responses[4],/genuinely different fictional evidence[\s\S]*different prices and volumes/i);
 for(const response of responses)assert.match(response,/does not disclose a protected answer[\s\S]*assign a score/i);
});

test('five perspectives select their matching reviewed instructional evidence',()=>{
 const expected={Understand:/first principle:[\s\S]*cumulative price-volume/i,Recognize:/observable evidence[\s\S]*completed fictional bars/i,
  Apply:/reviewed fictional demonstration[\s\S]*FICTIONAL bars/i,'Common Mistake':/exact transaction-level VWAP[\s\S]*Recompute cumulative notional/i,
  Limitations:/cannot reconstruct every trade print[\s\S]*session boundary/i};
 for(const [perspective,pattern] of Object.entries(expected))assert.match(answerFromGuide(guide,'explain','',prompt(perspective,'I DO')),pattern);
});
