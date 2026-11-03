import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAcademyTutorRequest,resolveAcademyTutorContext} from '../functions/_lib/tutor-academy-context-v1.js';

const request=(program='risk60',day=12,stage='Practice')=>
 `Academy program: ${program}. Study day: ${day}. Instructional stage: ${stage}. Teach risk from first principles.`;
const paid={userId:'11111111-1111-4111-8111-111111111111',authorized:true,freeEligible:true};

test('canonical Academy marker is strict and preserves the learner question separately',()=>{
 assert.deepEqual(parseAcademyTutorRequest(request()),{programCode:'risk60',day:12,requestedStage:'Practice',question:'Teach risk from first principles.'});
 assert.equal(parseAcademyTutorRequest('Academy risk60 day 12'),null);
 assert.equal(parseAcademyTutorRequest(request('risk60',12,'Protected')),null);
});

test('server resolves registered day metadata without lesson bodies or progress claims',()=>{
 const context=resolveAcademyTutorContext({question:request(),academyAccess:paid,env:{},userId:paid.userId});
 assert.equal(context.programCode,'risk60');assert.equal(context.day,12);
 assert.equal(context.requestedStage,'Practice');assert.equal(context.prerequisiteDay,11);
 assert.equal(context.prerequisiteStatus,'sequence_reference_only_not_completion_verified');
 assert.equal(context.progressVerified,false);assert.equal(context.officiallyGraded,false);assert.equal(context.masteryAwarded,false);
 assert.match(context.returnUrl,/program=risk60&day=12/);
 assert.doesNotMatch(JSON.stringify(context),/reflection|answer|rubric|workedExample|sourceProcedure/i);
});

test('Free context requires Free eligibility and premium context requires authorized Academy access',()=>{
 assert.equal(resolveAcademyTutorContext({question:request('free5',2,'Learn'),academyAccess:{userId:paid.userId,freeEligible:true},env:{},userId:paid.userId}).programCode,'free5');
 assert.throws(()=>resolveAcademyTutorContext({question:request('free5',2,'Learn'),academyAccess:{userId:paid.userId,freeEligible:false},env:{},userId:paid.userId}),e=>e.status===403);
 assert.throws(()=>resolveAcademyTutorContext({question:request(),academyAccess:{userId:paid.userId,authorized:false,freeEligible:true},env:{},userId:paid.userId}),e=>e.status===403);
});

test('draft programs remain undiscoverable without release or an authorized beta assignment',()=>{
 assert.throws(()=>resolveAcademyTutorContext({question:request('tape10',1,'Start'),academyAccess:paid,env:{},userId:paid.userId}),e=>e.status===404);
 const released=resolveAcademyTutorContext({question:request('tape10',1,'Start'),academyAccess:paid,env:{ACADEMY_THREE_CAMPS_ENABLED:'true'},userId:paid.userId});
 assert.equal(released.programCode,'tape10');
});
