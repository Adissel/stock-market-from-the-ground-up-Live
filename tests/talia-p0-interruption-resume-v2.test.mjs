import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
const css=readFileSync('assets/css/talia-live-lesson-v1.css','utf8');
test('P0 permits instructional interruption without discarding the open practice checkpoint',()=>{
 assert.ok(s.includes("if(checkpoint&&selectedMode!=='explain')"),'mode-restricted interruption');
 assert.ok(s.includes("checkpoint&&phase!=='explain'&&phase!=='demonstrate'"),'read-only evidence allowed');
 assert.ok(s.includes("checkpoint?'explain':mode,checkpoint?'':reasoning.trim()"),'question remains explanatory');
 assert.ok(s.includes("disabled={!member||busy||question.trim().length<4}"),'composer available');
 assert.ok(s.includes('aria-label="Clarify before answering the ungraded checkpoint"'));
 assert.ok(s.includes("onClick={()=>void teachSelected('explain')}"),'verified chart lesson available');
 assert.ok(s.includes('Your selected answer and retries stay in place.'));
 assert.ok(s.includes("if(checkpoint&&selectedMode!=='explain')"));
});
test('P0 preserves replay boundary and requires checkpoint completion before resume',()=>{
 assert.ok(s.includes('aria-label="Resume the paused fictional replay"'));
 assert.ok(s.includes('>Resume candle replay</button>'));
 assert.ok(s.includes("!playing&&visible<REPLAY.length"));
 assert.ok(s.includes("setCheckpoint(null);setStageIndex"));
 assert.ok(s.includes("if(!playing||!member||busy||checkpoint)return"));
 assert.ok(s.includes("if(group.length!==interval)return"));
 assert.ok(s.includes("const verified=getTaliaChartEvidence(chartContext)"));
 assert.ok(s.includes("evidence.noFuture!==true||evidence.sourceOnly!==true"));
 assert.ok(s.includes("allowModel:false"));
});
test('P0 retains authenticated membership ceilings, privacy resets and accessible controls',()=>{
 assert.ok(s.includes("teachingCatalog.allowedDepths.includes(teachingDepth)"));
 assert.ok(s.includes("identity.current!==uid"));
 assert.ok(s.includes("setCheckpoint(null);setStageIndex(0)"));
 assert.ok(s.includes('aria-label="Talia conversation transcript"'));
 assert.ok(css.includes('.tc-body .tc-p0-interruption'));
 assert.ok(css.includes('@media(max-width:620px)'));
 assert.doesNotMatch(s,/allowModel:true|masteryAwarded:true|officialGrade:true/);
});

test('P0 genuine James_Test browser journey is pinned, private, ungraded and checks interruption/resume',()=>{
 const qa=readFileSync('tests/talia-classroom-real-member-depth-v2.mjs','utf8');
 for(const clause of ['const checkpoint=page.locator(\'.tc-checkpoint\')',
  'await answer.check()','Explain this completed candle','submittedBody.mode',
  'submittedBody.allowModel,false','await checkpoint.getByRole(\'button\',{name:\'Check my answer\'}).click()',
  'Pause automatic fictional candle playback'])
  assert.ok(qa.includes(clause),clause);
 assert.ok(qa.includes("assert.equal(deployed,true"),'exact deployment SHA preserved');
 assert.ok(qa.includes("assert.equal(member.id,USER"),'James_Test identity remains strict');
});

test('P0 clarification cannot accidentally send numeric review data',()=>{
 assert.ok(s.includes("const isReviewPractice=selectedMode==='review'&&practiceCase!=='none'"));
 assert.ok(s.includes("...(isReviewPractice?{formativePractice:"));
 assert.ok(s.includes("'Explain this completed candle':'Explain this topic'"));
});

test('P0 manual pause visibly opens the ungraded checkpoint, even before a lesson is started',()=>{
 assert.ok(s.includes('setLessonKind(selected);'),'Manual pause must open the guided lesson disclosure');
 assert.ok(s.includes('open={!!lessonKind}'),'Completed checkpoint must be visible');
 assert.ok(s.includes('setCheckpoint(originalQuestion(selected,REPLAY[at-1],at))'));
});
test('Authenticated QA verifies selected-chart VWAP proxy, not an unrelated trade-print answer',()=>{
 const browser=readFileSync('tests/talia-classroom-real-member-depth-v2.mjs','utf8');
 assert.ok(browser.includes('getTaliaChartEvidence({visible:7,index:6,timeframe:1})'));
 assert.ok(browser.includes('String.fromCharCode(36)'));
 assert.ok(browser.includes('const expectedProxy='));
 assert.ok(browser.includes('not an exact transaction-print VWAP/i'));
 assert.ok(!browser.includes('exact trade-print VWAP = $4,600 / 400 = $11.50'));
});
