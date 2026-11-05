/* Genuine read/write RLS acceptance for only two designated nonstaff QA accounts.
 * Creates exactly one clearly marked, fictional, private Lab-progress and
 * Journal fixture for QA B if absent; then idempotently exercises QA B's own
 * updates and denies foreign-user updates in both directions.
 * NEVER changes A's records, performs live trading, awards credits or grades.
 * Other than B's two QA-only rows, no database mutations are allowed.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=readFileSync('config.js','utf8');
const base=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(base&&key,'Public Supabase configuration absent');
const credentials=[
 {name:'A',email:process.env.LAB_QA_EMAIL,password:process.env.LAB_QA_PASSWORD},
 {name:'B',email:process.env.LAB_QA_SECOND_EMAIL,password:process.env.LAB_QA_SECOND_PASSWORD}
];
if(credentials.some(x=>!x.email?.trim()||!x.password))throw Error('BLOCKED: both genuine QA secret pairs required');
const A_ID='f42f9301-18e6-43a3-8531-32d371fd22c1';
const B_ID='b6409eb8-7014-4d3a-bb94-e335963ce419';
const labId='DT-C01-L01',fixture='CROWN_QA_ONLY_TWO_ACCOUNT_RLS_20261104';
const journalTicker='QA000',journalDate='2026-11-04';
async function api(url,{token,method='GET',data,prefer}={}){
 const res=await fetch(url,{method,cache:'no-store',signal:AbortSignal.timeout(28000),
  headers:{apikey:key,'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),
   ...(prefer?{Prefer:prefer}:{})},
  ...(data!==undefined?{body:JSON.stringify(data)}:{})});
 const body=await res.json().catch(()=>null);
 return {status:res.status,body};
}
function path(table,query={}){return base+'/rest/v1/'+table+'?'+new URLSearchParams(query)}
async function user(credential){
 const login=await api(base+'/auth/v1/token?grant_type=password',{method:'POST',
  data:{email:credential.email,password:credential.password}});
 assert.equal(login.status,200,credential.name+' genuine Supabase Auth login');
 assert(login.body?.access_token&&login.body?.user?.id);
 const verified=await api(base+'/auth/v1/user',{token:login.body.access_token});
 assert.equal(verified.status,200,'Token must verify independently at GoTrue');
 assert.equal(verified.body.id,login.body.user.id);
 return {id:verified.body.id,token:login.body.access_token};
}
const A=await user(credentials[0]),B=await user(credentials[1]);
assert.equal(A.id,A_ID,'QA A must be the designated noncommercial test user');
assert.equal(B.id,B_ID,'QA B must be the designated noncommercial test user');
assert.notEqual(A.id,B.id);
const queryLab=id=>path('site_lab_progress',{select:'user_id,lab_id,status,responses',user_id:'eq.'+id,lab_id:'eq.'+labId,limit:'1'});
let lab=await api(queryLab(B.id),{token:B.token});
assert.equal(lab.status,200);
assert(Array.isArray(lab.body)&&lab.body.length<=1);
if(lab.body.length===0){
 const inserted=await api(path('site_lab_progress'),{token:B.token,method:'POST',prefer:'return=representation',
  data:{user_id:B.id,lab_id:labId,status:'in_progress',responses:{qaFixture:fixture,qaOnly:true,writeValidated:0},
   started_at:'2026-11-04T00:00:00Z'}});
 assert.equal(inserted.status,201,'QA B must create its own fictional Lab record through actual RLS');
 assert.equal(inserted.body?.length,1);
}else assert.equal(lab.body[0]?.responses?.qaFixture,fixture,
 'Never overwrite an existing nonfixture QA member Lab progress record');
const labUpdate=await api(queryLab(B.id),{token:B.token,method:'PATCH',
 data:{responses:{qaFixture:fixture,qaOnly:true,writeValidated:1}},prefer:'return=representation'});
assert.equal(labUpdate.status,200);
assert.equal(labUpdate.body?.length,1,'QA B must update its own Lab record');
assert.equal(labUpdate.body[0].responses.writeValidated,1);
const queryJournal=id=>path('decision_journal',{
 select:'id,user_id,ticker,evidence,result_note,decision,status',
 user_id:'eq.'+id,evidence:'eq.'+fixture,limit:'2'});
let journal=await api(queryJournal(B.id),{token:B.token});
assert.equal(journal.status,200);
assert(Array.isArray(journal.body)&&journal.body.length<=1,'QA marker must not duplicate');
if(journal.body.length===0){
 const created=await api(path('decision_journal'),{token:B.token,method:'POST',prefer:'return=representation',
  data:{user_id:B.id,ticker:journalTicker,trade_date:journalDate,journal_type:'observation',
   decision:'OBSERVATION ONLY',status:'draft',evidence:fixture,
   result_note:'FICTIONAL QA observation. No trade, grade or reward.'}});
 assert.equal(created.status,201,'QA B must create its own fictional Journal record through real RLS');
 assert.equal(created.body?.length,1);
 journal=created;
}
const row=journal.body[0];
assert.equal(row.user_id,B.id);
assert.equal(row.evidence,fixture);
assert.equal(row.ticker,journalTicker);
const journalUpdate=await api(path('decision_journal',{id:'eq.'+row.id,user_id:'eq.'+B.id}),{
 token:B.token,method:'PATCH',prefer:'return=representation',
 data:{result_note:'FICTIONAL QA observation. B authenticated write validated; no trade.'}});
assert.equal(journalUpdate.status,200);
assert.equal(journalUpdate.body?.length,1,'QA B must update its own Journal record');
const [aLabs,aJournal,bLab,bJournal]=await Promise.all([
 api(path('site_lab_progress',{select:'user_id,lab_id,status',user_id:'eq.'+A.id,limit:'100'}),{token:A.token}),
 api(path('decision_journal',{select:'id,user_id,result_note',user_id:'eq.'+A.id,limit:'100'}),{token:A.token}),
 api(queryLab(B.id),{token:B.token}),
 api(queryJournal(B.id),{token:B.token})
]);
for(const [label,r] of [['A Lab',aLabs],['A Journal',aJournal],['B Lab',bLab],['B Journal',bJournal]]){
 assert.equal(r.status,200,label+' own read status');assert(Array.isArray(r.body)&&r.body.length>0,label+' must show real positive owner rows');
}
assert(aLabs.body.every(x=>x.user_id===A.id));
assert(aJournal.body.every(x=>x.user_id===A.id));
assert(bLab.body.every(x=>x.user_id===B.id));
assert(bJournal.body.every(x=>x.user_id===B.id));
for(const [table,target,actor,filter] of [
 ['site_lab_progress',B,A,{user_id:'eq.'+B.id,lab_id:'eq.'+labId}],
 ['site_lab_progress',A,B,{user_id:'eq.'+A.id,lab_id:'eq.'+aLabs.body[0].lab_id}],
 ['decision_journal',B,A,{user_id:'eq.'+B.id,id:'eq.'+row.id}],
 ['decision_journal',A,B,{user_id:'eq.'+A.id,id:'eq.'+aJournal.body[0].id}]
]){
 const route=path(table,{select:'user_id',...filter});
 const denied=await api(route,{token:actor.token});
 assert.equal(denied.status,200,table+' cross read status');
 assert.deepEqual(denied.body,[],table+' foreign read disclosed private records');
 const sameValue=table==='site_lab_progress'?
  {status:target===A?aLabs.body[0].status:'in_progress'}:
  {result_note:target===A?aJournal.body[0].result_note:journalUpdate.body[0].result_note};
 const patch=await api(path(table,filter),{token:actor.token,method:'PATCH',
  prefer:'return=representation',data:sameValue});
 assert([200,204,401,403].includes(patch.status),table+' negative foreign write status');
 if(patch.status===200)assert.deepEqual(patch.body,[],table+' foreign write unexpectedly modified a private QA row');
}
const finalB=await api(queryJournal(B.id),{token:B.token});
assert.equal(finalB.body?.[0]?.result_note,journalUpdate.body[0].result_note);
console.log('PASS two real Supabase member tokens, positive own Lab+Journal records for A and B, own authenticated B insert/update, and 4 foreign read + 4 foreign update denials');
console.log('RESULT '+JSON.stringify({status:'NONVACUOUS_TWO_MEMBER_LAB_JOURNAL_READ_WRITE_RLS_PASS',
 users:2,qaOnlyLabRecordsB:1,qaOnlyJournalRecordsB:1,foreignReadDenials:4,foreignUpdateDenials:4,
 realPayments:0,rewards:0,grades:0,qaARecordsWritten:0}));
