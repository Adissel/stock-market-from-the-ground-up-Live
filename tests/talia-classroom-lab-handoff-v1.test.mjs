/* Classroom public-Lab handoff source contract. No member secrets or assessed answers. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const source=readFileSync(new URL('../src/tutor/TaliaClassroom.tsx',import.meta.url),'utf8');
test('classroom validates canonical Lab IDs and known Learning Journey stages',()=>{
 assert.match(source,/const labHandoff=\(\(\)=>\{/);
 assert.match(source,/F\[123\]-C\\d\{2\}-L\\d\{2\}/);
 assert.match(source,/TAPE-C\\d\{2\}-L\\d\{2\}/);
 for(const stage of ['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'])
  assert.ok(source.includes("'"+stage+"'"),stage);
 assert.match(source,/stages\.includes\(stage\)\?stage:'Learn'/);
});
test('server-routed context retains original member question and a Lab return link',()=>{
 assert.match(source,/question:labQuestion\(q\)/);
 assert.match(source,/Learning Journey stage:/);
 assert.match(source,/Return to Lab/);
 assert.match(source,/\/api\/market-tutor/);
 assert.match(source,/allowModel:false/);
 assert.match(source,/authorization:'Bearer '/);
});
test('handoff does not forward grades, protected assessment material, or replay fixtures',()=>{
 const handoff=source.split('const labHandoff=')[1].split('function FictionalChart')[0];
 for(const sensitive of ['learnerAnswer','grade','rubric','REPLAY.slice','futureBars','assessmentAnswer'])
  assert.ok(!handoff.includes(sensitive),'unexpected handoff field '+sensitive);
});
