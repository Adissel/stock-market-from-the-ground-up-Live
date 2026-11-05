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
