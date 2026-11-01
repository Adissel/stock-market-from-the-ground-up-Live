import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const js=read('assets/js/academy-stage-checkpoint-v1.js');
const academy=read('assets/js/bootcamp-academy-v014168.js');
const thirty=read('assets/js/bootcamp.js');
const engine=read('assets/js/lab-engine-v32-universal.js');
const api=read('functions/api/academy-stage-checkpoint.js');
const sql=read('supabase/migrations/20261101_academy_stage_checkpoint_v1.sql');
const USER='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const example=()=>({
 version:1,mode:'guided',stage:3,observations:'Completed volume is known',
 prediction:'Forecast pending',predictionLocked:true,practice:'Original practice',
 practiceCount:1,practiceResolved:false,practiceAssisted:true,
 transfer:'Independent new case',transferCount:0,transferResolved:false,
 selfReview:false,reflection:'Review evidence',learnerReplies:[[2,['Evidence observed']]]
});
function fixture({otherUser=false,initial=null}={}){
 let db={revision:initial?1:0,snapshot:initial},alive=true,calls=[];
 const ctx={URLSearchParams,fetch:async(url,options)=>{
  calls.push({url,options});
  if(options.method==='GET')return {ok:true,status:200,json:async()=>({
   ok:true,snapshot:db.snapshot,revision:db.revision
  })};
  const body=JSON.parse(options.body);
  if(body.expectedRevision!==db.revision)return {ok:false,status:409,json:async()=>({ok:false})};
  db={snapshot:body.snapshot,revision:db.revision+1};
  return {ok:true,status:200,json:async()=>({ok:true,saved:{rev:db.revision}})};
 }};
 ctx.window=ctx;
 runInNewContext(js,ctx);
 const client={auth:{getSession:async()=>({data:{session:{
  access_token:'test-token',user:{id:otherUser?'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb':USER}
 }}})}};
 const store=ctx.GroundUpAcademyStageCheckpointV1.create({
  client,userId:USER,programCode:'risk60',day:1,alive:()=>alive
 });
 return {store,api:ctx.GroundUpAcademyStageCheckpointV1,calls,
  get db(){return db;},bump:()=>{db.revision++;},stop:()=>{alive=false;}};
}
test('Stage checkpoint round-trips without changing official grade or reflection APIs',async()=>{
 const f=fixture();
 assert.equal(await f.store.load(),null);
 const snap=example();
 assert.deepEqual(JSON.parse(JSON.stringify(await f.store.save(snap))),{rev:1});
 assert.equal(f.db.snapshot.stage,3);
 assert.equal(f.db.snapshot.version,1);
 assert.equal(f.calls.length,2);
 assert.match(String(f.calls[1].url),/academy-stage-checkpoint/);
 assert.equal(JSON.parse(f.calls[1].options.body).program,'risk60');
 assert.equal(JSON.parse(f.calls[1].options.body).day,1);
 assert.equal(Object.hasOwn(f.db.snapshot,'grade'),false);
 assert.equal(Object.hasOwn(f.db.snapshot,'mastery'),false);
 assert.match(academy,/progressStore:enrolled&&progressAvailable/);
 assert.match(thirty,/progressStore:progressAvailable/);
 assert.match(engine,/if\(progressStore\)/);
});
test('Stale second tab receives CAS conflict and cannot overwrite the first',async()=>{
 const f=fixture();
 await f.store.load();
 await f.store.save(example());
 const competing=fixture({initial:example()});
 await competing.store.load();
 // Simulate another device winning the same revision before this tab saves.
 competing.bump();
 await assert.rejects(competing.store.save(example()),/Another device or tab saved a newer draft/);
 assert.equal(competing.db.revision,2);
 assert.equal(competing.db.snapshot.stage,3);
});
test('Wrong account and stale lesson are fail-closed',async()=>{
 const wrong=fixture({otherUser:true});
 await assert.rejects(wrong.store.load(),/Member session changed/);
 assert.equal(wrong.calls.length,0);
 const stale=fixture();
 await stale.store.load();
 stale.stop();
 await assert.rejects(stale.store.save(example()),/Member stage checkpoint was not loaded|Member session changed/);
 assert.equal(stale.calls.length,1);
});
test('Draft validator excludes grades and disallows invalid/oversized content',()=>{
 const f=fixture(),snap=example();
 assert.equal(f.api.normalize({...snap,stage:9}),null);
 assert.equal(f.api.normalize({...snap,observations:'x'.repeat(1501)}),null);
 assert.equal(f.api.normalize({...snap,learnerReplies:[[2,['a']],[2,['b']]]}),null);
 assert.equal(f.api.normalize({...snap,learnerReplies:[[2,['ok']]],grade:100}).grade,undefined);
 assert.match(api,/new Set\(\['version','mode','stage','learnerReplies'/);
 assert.match(api,/Object\.keys\(snapshot\)\.some\(key=>!allowed\.has\(key\)\)/);
 assert.match(api,/academyBetaCourse/);
 assert.match(api,/Active Academy enrollment required/);
 assert.match(api,/same-origin/);
});
test('Migration is additive, RLS-restricted, CAS-serialized and leaves original reflections intact',()=>{
 assert.match(sql,/ENABLE ROW LEVEL SECURITY/);
 assert.match(sql,/REVOKE ALL ON TABLE.*FROM PUBLIC,anon,authenticated/);
 assert.match(sql,/GRANT SELECT,INSERT,UPDATE.*TO service_role/);
 assert.match(sql,/SECURITY INVOKER/);
 assert.match(sql,/pg_advisory_xact_lock/);
 assert.match(sql,/coalesce\(v_current,0\)<>p_expected_revision/);
 assert.doesNotMatch(sql,/DROP TABLE|TRUNCATE|DELETE FROM/);
 assert.match(sql,/gu_bootcamp_academy_enrollments_v014168/);
 assert.doesNotMatch(sql,/UPDATE public\.gu_bootcamp_progress_v014144/);
});
console.log('PASS Academy stage checkpoint client, CAS, member isolation, and additive schema source checks');
