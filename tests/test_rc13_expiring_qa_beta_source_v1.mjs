import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const api=readFileSync('functions/api/bootcamp-academy.js','utf8');
const runner=readFileSync('tests/live-academy-two-member-three-programs-qa-v1.mjs','utf8');
const guards=[
 "const RC13_QA_EXPIRES_AT=Date.parse('2026-11-03T07:05:09Z');",
 "env?.ACADEMY_THREE_CAMPS_BETA_ENABLED==='true'",
 "env?.ACADEMY_THREE_CAMPS_ENABLED!=='true'",
 "authorized===true",
 "RC13_QA_USERS.has(id.toLowerCase())",
 "Date.now()<RC13_QA_EXPIRES_AT",
 "if(!allowed(data.program,env,userId)&&!rc13QaBeta(env,data.program,userId,trainingAuthorized))",
 "form=await readInput(request,env,auth.userId,auth.authorized)",
 "const rc13Beta=rc13QaBeta(env,requestedCode,auth.userId,auth.authorized)",
 "if(newCourses.has(requestedCode)&&!allowed(requestedCode,env,auth.userId)&&!rc13Beta)",
 "const eligibleBeta=(academyBetaCourse(env,requestedCode,auth.userId)||rc13Beta)&&auth.freeEligible===true",
 "if(!allowed(code,env,auth.userId)&&!rc13Beta)",
 "toolAccess(env,request,'ONDEMAND_TRAINING')"
];
for(const x of guards)assert(api.includes(x),'RC13 scoped QA beta safety condition missing: '+x);
for(const id of ['f42f9301-18e6-43a3-8531-32d371fd22c1','bf3d5823-946d-4478-8d0f-cbea33495e5b'])
 assert.equal((api.match(new RegExp(id,'g'))||[]).length,1,'Only two exact enrolled QA users may be admitted');
assert(api.includes("new Set(['tape10','indicators10','filings7'])"));
assert(api.includes('result.competencyMasteryAwarded!==false'),'Stored Academy progress must fail closed on unexpected mastery');
assert(runner.includes("if(probe.status===200){qaRouteReady=true;break;}"));
assert(runner.includes("assert.equal(stale.status,409"));
assert(runner.includes("NOT six genuine 30–45 minute browser study journeys"));
assert(!api.includes("ACADEMY_THREE_CAMPS_ENABLED='true'"),'Public release must not be enabled');
console.log('PASS expiring two-user owner QA beta eligibility: positive training entitlement, general release off, source grading and course gates preserved.');
