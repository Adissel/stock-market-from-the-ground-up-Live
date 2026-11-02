import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync('.github/workflows/basic-learning-lab-batch-v1.yml','utf8');
const jobs=['numerical-verification','lab-curriculum-parity','free-and-academy-continuity','chart-study-and-visual-parity','checkpoint-and-account-boundaries'];
test('full Basic regression batch retains five independently required suites',()=>{
 for(const id of jobs){
  assert.match(workflow,new RegExp('^  '+id+':','m'),id+' job missing');
  assert.match(workflow,new RegExp('^      - '+id+'$','m'),id+' not required by summary');
 }
 assert.match(workflow,/if: always\(\)/);
 assert.match(workflow,/details\['result'\]!='success'/);
 assert.match(workflow,/cancel-in-progress: false/);
 assert.match(workflow,/queue: max/);
});
test('basic workflow covers all six owner gates with named source tests',()=>{
 const required=[
  'basic-atr-bollinger-lessons-v1.test.mjs',
  'learning-indicators-v1.test.mjs',
  'academy-member-day-restoration-v1.test.mjs',
  'lab-bridge-batches15-21-source-v1.test.mjs',
  'learning-lab-engine-feature-audit-v1.test.mjs',
  'lab-batch04-echarts-v1.test.mjs',
  'lab-advanced-echarts-preview-v1.test.mjs',
  'test_v33_member_checkpoint_resume.mjs'
 ];
 for(const name of required)assert(workflow.includes('tests/'+name),name+' missing from regression coverage');
});
test('the Basic workflow never asserts production, editorial, or authenticated acceptance',()=>{
 assert.match(workflow,/member, editorial, accessibility and deployment acceptance remain separate/i);
});
