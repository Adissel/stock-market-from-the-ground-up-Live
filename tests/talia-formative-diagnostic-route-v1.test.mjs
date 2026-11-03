import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {onRequest} from '../functions/api/market-tutor-v01492.js';

const route=readFileSync('functions/api/market-tutor-v01492.js','utf8');

test('authenticated Tutor route exposes bounded formative diagnosis without grading or persistence',()=>{
 assert.match(route,/diagnoseFoundationReflection\(guide,answer\)/);
 assert.match(route,/mode==='review'&&guide\.foundationTopic===true/);
 assert.match(route,/officialGrade:false,masteryAwarded:false,memberRecordWritten:false/);
 assert.match(route,/observed writing signal only/);
 assert.doesNotMatch(route,/formativeDiagnostic[\s\S]{0,500}(?:save|insert|update)\s*\(/i);
});

const uid='12345678-1234-4123-8123-123456789012';
const env={SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',
 SUPABASE_SECRET_KEY:'sb_secret_test',AI_SERVICE_ENABLED:'false',ASSETS:{fetch:async request=>{
  const path=new URL(request.url).pathname.replace(/^\//,'');
  return existsSync(path)?new Response(readFileSync(path)):Response.json({missing:true},{status:404});
 }}};
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options={})=>{
 const value=String(url);
 if(value.endsWith('/auth/v1/user'))return Response.json({id:uid,user_metadata:{market_tutor_ai_enabled:false}});
 if(value.includes('/rest/v1/profiles?'))return Response.json([{account_kind:'member',deleted_at:null}]);
 if(value.includes('/rest/v1/admin_user_flags?')||value.includes('/rest/v1/admin_user_roles?'))return Response.json([]);
 if(value.includes('/rest/v1/rpc/user_has_tool_access'))return Response.json(false);
 if(value.includes('/rest/v1/gu_product_access_config_v1?'))return Response.json([]);
 if(value.includes('/rest/v1/rpc/gu_v014107_take_tutor_request'))return Response.json({accepted:true,reason:'allowed'});
 throw Error('Unexpected network request '+value+' '+String(options.method||'GET'));
};
after(()=>{globalThis.fetch=originalFetch});

test('signed-in Foundation review returns the selected category and no private reflection',async()=>{
 const guide=JSON.parse(readFileSync('data/talia-foundation-explanations-batch06-v1.json','utf8')).guides
  .find(row=>row.editorialTrainingReviewV1);
 assert.ok(guide);
 const privateMarker='PrivateReflectionMarker987';
 const request=new Request('https://member.test/api/market-tutor-v01492',{method:'POST',headers:{
  authorization:'Bearer fixture','content-type':'application/json'},body:JSON.stringify({
   question:'Review my reasoning about '+guide.title,mode:'review',
   learnerAnswer:privateMarker+' I think this always guarantees the outcome.',allowModel:false,saveHistory:false
  })});
 const response=await onRequest({request,env}),data=await response.json();
 assert.equal(response.status,200);
 assert.equal(data.formativeDiagnostic.category,'interpretive');
 assert.equal(data.formativeDiagnostic.status,'observed_writing_signal');
 assert.equal(data.formativeDiagnostic.officialGrade,false);
 assert.equal(data.formativeDiagnostic.masteryAwarded,false);
 assert.equal(data.formativeDiagnostic.memberRecordWritten,false);
 assert.equal(data.historySaved,false);
 assert.doesNotMatch(JSON.stringify(data),new RegExp(privateMarker));
 assert.notEqual(data.generation,'grounded-model-draft');
});
