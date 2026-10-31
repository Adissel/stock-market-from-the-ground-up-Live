/* Invite-only instructional Beta contract: fake users/provider; no live grades,
 * payments, accounts or Supabase records are written by this test. */
import assert from 'node:assert/strict';
import {onRequest as academy} from '../functions/api/bootcamp-academy.js';
import {onRequest as assessment} from '../functions/api/academy-protected-assessment-v1.js';
import {academyBetaTester} from '../functions/_lib/academy-three-camps-beta-access-v1.js';
const user='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',nonTester='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const previous=globalThis.fetch;
const calls=[];
let actor=user,enrolled=true;
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,options={})=>{
 const path=String(url);calls.push({path,method:options.method||'GET'});
 if(path.endsWith('/auth/v1/user'))return json({id:actor});
 if(path.includes('/profiles?'))return json([{account_kind:'member',deleted_at:null}]);
 if(path.includes('/admin_user_flags?')||path.includes('/admin_user_roles?'))return json([]);
 if(path.includes('/rpc/user_has_tool_access'))return json(false); // no paid access
 if(path.includes('/gu_product_access_config_v1?'))return json([]);
 if(path.includes('/gu_bootcamp_academy_enrollments_v014168?'))
  return json(enrolled?[{status:'active',program_version:'0.14.0.168',program_code:'tape10'}]:[]);
 if(path.includes('/gu_bootcamp_academy_progress_v014168?'))return json([]);
 if(path.includes('/rpc/gu_bootcamp_academy_save_v014168')){
  const data=JSON.parse(options.body);
  assert.equal(data.p_user,actor);
  assert.equal(data.p_program,'tape10');
  assert.equal(data.p_action,'enroll');
  return json({ok:true,program:'tape10',enrollment:'active',graded:false,competencyMasteryAwarded:false});
 }
 if(path.includes('/gu_academy_protected_cases_v1?')||
    path.includes('/competency_cases_v135?')||
    path.includes('/competency_attempts_v135?')||
    path.includes('/rpc/submit_competency_case_v135'))
  throw Error('Beta must not query protected assessment keys, attempts, or grading RPC');
 throw Error('Unexpected provider route '+path);
};
const env={ACADEMY_THREE_CAMPS_ENABLED:'false',ACADEMY_THREE_CAMPS_BETA_ENABLED:'true',
 ACADEMY_THREE_CAMPS_BETA_USERS:user,SUPABASE_URL:'https://fixture.supabase.co',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fake',SUPABASE_SECRET_KEY:'sb_secret_fake'};
const req=(path,method='GET',body)=>new Request('https://member.example'+path,{
 method,headers:{authorization:'Bearer fake-member',...(method==='POST'?{origin:'https://member.example','content-type':'application/json'}:{})},
 body:body===undefined?undefined:JSON.stringify(body)});
try{
 assert(academyBetaTester(env,user));
 assert(!academyBetaTester(env,nonTester));
 assert(!academyBetaTester({...env,ACADEMY_THREE_CAMPS_BETA_USERS:user+',bad'},user));
 assert(!academyBetaTester({...env,ACADEMY_THREE_CAMPS_BETA_ENABLED:'false'},user));
 const c=await academy({request:req('/api/bootcamp-academy?action=catalog'),env});
 assert.equal(c.status,200);assert.equal((await c.json()).programs.length,7,'No public catalog expansion');
 const route='/api/bootcamp-academy?program=tape10';
 let res=await academy({request:req(route),env}),data=await res.json();
 assert.equal(res.status,200);assert.equal(data.program.code,'tape10');
 assert.equal(data.betaStudy,true);assert.equal(data.curriculum.length,10);
 let write=await academy({request:req('/api/bootcamp-academy','POST',
  {version:'0.14.0.168',program:'tape10',action:'enroll',day:0}),env});
 assert.equal(write.status,200);assert.equal((await write.json()).enrolled,true);
 const ass='/api/academy-protected-assessment-v1?program=tape10&day=1';
 res=await assessment({request:req(ass),env});data=await res.json();
 assert.equal(res.status,200);assert.equal(data.officialAssessment,false);
 assert.equal(data.reason,'beta_instruction_only');
 assert(!JSON.stringify(data).includes('answer_key'));
 res=await assessment({request:req(ass,'POST',{caseCode:'ANY',answers:{Q1:'A'}}),env});
 assert.equal(res.status,409,'No Beta official grades');
 actor=nonTester;
 res=await academy({request:req(route),env});assert.equal(res.status,404);
 res=await assessment({request:req(ass),env});assert.equal(res.status,404);
 actor=user;enrolled=false;
 res=await assessment({request:req(ass),env});assert.equal(res.status,403);
 enrolled=true;
 res=await academy({request:req(route),env:{...env,ACADEMY_THREE_CAMPS_BETA_ENABLED:'false'}});
 assert.equal(res.status,404,'The Beta kill switch must revoke access');
 assert(!calls.some(x=>/submit_competency_case_v135|competency_cases_v135|competency_attempts_v135/.test(x.path)));
 console.log('PASS: invite-only Beta, denied non-testers, 7 public courses, private ungraded enrollment, official grade blocked, disabled switch');
}finally{globalThis.fetch=previous}
