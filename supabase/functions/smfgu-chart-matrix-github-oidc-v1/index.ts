/* Single-run, noncommercial Chart Studio identity isolation acceptance.
 * No payments, founders, Lumens, or real-user changes. Self-cleaning QA users.
 * GitHub OIDC RS256 validation happens before ANY privileged operation.
 * Disable the deployed function after acceptance; source retained for audit.
 */
import {createClient} from 'npm:@supabase/supabase-js@2';
const AUD='smfgu-chart-matrix-acceptance-20261031';
const PROJECT='cybernexuspublishing/stock-market-from-the-ground-up';
const WORKFLOW=PROJECT+'/.github/workflows/chart-studio-oidc-matrix-v1.yml@refs/heads/main';
const ORIGIN='https://stock-market-from-the-ground-up-d1r.pages.dev';
const OUT={'content-type':'application/json','cache-control':'no-store, private','x-content-type-options':'nosniff'};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:OUT});
const dec=x=>JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(x.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0))));
async function githubClaims(req){
 const jwt=/^Bearer\s+([^\s]+)$/i.exec(req.headers.get('authorization')||'')?.[1];
 if(!jwt)throw Error('Missing GitHub OIDC');
 const parts=jwt.split('.');if(parts.length!==3)throw Error('Invalid OIDC');
 const header=dec(parts[0]),payload=dec(parts[1]);
 if(header.alg!=='RS256'||typeof header.kid!=='string')throw Error('OIDC algorithm not approved');
 const now=Math.floor(Date.now()/1000);
 if(payload.iss!=='https://token.actions.githubusercontent.com'||payload.aud!==AUD||
  payload.repository!==PROJECT||payload.ref!=='refs/heads/main'||
  payload.workflow_ref!==WORKFLOW||
  payload.sub!=='repo:'+PROJECT+':ref:refs/heads/main'||
  !['push','workflow_dispatch'].includes(payload.event_name)||
  !/^\d{5,16}$/.test(String(payload.run_id||''))||
  !Number.isInteger(payload.exp)||payload.exp<=now||payload.exp>now+900||
  !Number.isInteger(payload.iat)||payload.iat>now+60||now-payload.iat>600)
  throw Error('GitHub OIDC claims denied');
 const jwks=await fetch('https://token.actions.githubusercontent.com/.well-known/jwks',
  {signal:AbortSignal.timeout(9000)}).then(x=>{if(!x.ok)throw Error('OIDC JWKS unavailable');return x.json()});
 const pub=jwks.keys?.find(x=>x.kid===header.kid&&x.kty==='RSA'&&x.use==='sig');
 if(!pub)throw Error('OIDC trusted key unavailable');
 const key=await crypto.subtle.importKey('jwk',pub,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 const raw=Uint8Array.from(atob(parts[2].replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
 const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,raw,
  new TextEncoder().encode(parts[0]+'.'+parts[1]));
 if(!valid)throw Error('OIDC signature invalid');
 return {runId:String(payload.run_id),attempt:String(payload.run_attempt||'1')};
}
const pass=()=>{const b=new Uint8Array(32);crypto.getRandomValues(b);
 return 'SmfgU9!'+Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')};
const allowed=t=>t==='STANDARD'?['STANDARD']:['STANDARD','ADVANCED','PROFESSIONAL'];
const http=async(url,token,method='GET',payload)=>{
 const r=await fetch(url,{method,headers:{authorization:'Bearer '+token,
  ...(payload?{'content-type':'application/json',origin:ORIGIN}:{})},
  body:payload?JSON.stringify(payload):undefined,cache:'no-store',signal:AbortSignal.timeout(16000)});
 const body=await r.json().catch(()=>({}));return {status:r.status,body,cache:r.headers.get('cache-control')};
};
Deno.serve(async req=>{
 if(req.method!=='POST')return reply({ok:false,error:'Method not allowed'},405);
 let claims;
 try{claims=await githubClaims(req)}
 catch(e){return reply({ok:false,error:'OIDC authorization denied'},403)}
 const url=Deno.env.get('SUPABASE_URL')||'',
  service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'',
  pub=Deno.env.get('SUPABASE_ANON_KEY')||'';
 if(!url.startsWith('https://oxihglyfgzywsupnyicb.supabase.co')||!service||!pub)
  return reply({ok:false,error:'QA runtime not configured'},503);
 const admin=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
 const publicClient=()=>createClient(url,pub,{auth:{autoRefreshToken:false,persistSession:false}});
 const ids=[],notes=[],createdAt=new Date().toISOString();
 let success=false,scope=null,problem=null,clean=true;
 try{
  const stamp=claims.runId+'-'+claims.attempt;
  for(const [tier,tag,study] of [['STANDARD','standard','MA'],['PROFESSIONAL','professional','RSI']]){
   const email='stockmarketfromthegroundup+chart-matrix-'+stamp+'-'+tag+'@gmail.com';
   const password=pass();
   const username='ChartMatrix'+(tag==='standard'?'Std':'Pro')+claims.runId.slice(-6);
   const {data:made,error:makeError}=await admin.auth.admin.createUser({
    email,password,email_confirm:true,user_metadata:{username},
    app_metadata:{smfgu_qa_only:true,noncommercial:true,
     qa_batch:'SMFGU-CHART-MATRIX-20261031',qa_target_plan:'FREE'}
   });
   if(makeError||!made?.user?.id)throw Error('QA Auth Admin createUser failed');
   const id=made.user.id;ids.push(id);
   const {data:identity,error:authErr}=await publicClient().auth.signInWithPassword({email,password});
   if(authErr||identity?.user?.id!==id||!identity.session?.access_token)
    throw Error('QA GoTrue password authentication failed');
   notes.push({tier,id,token:identity.session.access_token,study});
  }
  if(ids.length!==2||ids[0]===ids[1])throw Error('Independent QA users required');
  const expires=new Date(Date.now()+12*60000).toISOString();
  const grant=await admin.from('crownlight_chart_qa_grants_v1').upsert({
   user_id:ids[1],tier:'PROFESSIONAL',scope:'CHART_STUDIO_ONLY',
   starts_at:createdAt,ends_at:expires,reason:'OIDC-bound disposable noncommercial three-tier acceptance'
  },{onConflict:'user_id'});
  if(grant.error)throw Error('Scoped QA grant unavailable');
  const snapshots=[];
  for(const n of notes){
   const t=await http(ORIGIN+'/api/chart-tier-access',n.token);
   if(t.status!==200||t.body?.eligible!==true||t.body?.tier!==n.tier||
    JSON.stringify(t.body.allowed)!==JSON.stringify(allowed(n.tier)))
    throw Error('Live '+n.tier+' entitlement acceptance failed');
   const old=await http(ORIGIN+'/api/chart-workspace',n.token);
   if(old.status!==200||old.body.ok!==true||old.body.updatedAt!==null)
    throw Error('Disposable QA workspace preflight failed');
   const save=await http(ORIGIN+'/api/chart-workspace',n.token,'PUT',{
    selected:n.tier,sync:true,layout:'SIDE_BY_SIDE',studies:[n.study],drawings:[],
    expectedUpdatedAt:null
   });
   if(save.status!==200||save.body.ok!==true||!save.body.updatedAt)
    throw Error('QA member workspace save failed');
   const own=await http(ORIGIN+'/api/chart-workspace',n.token);
   if(own.status!==200||own.body?.workspace?.studies?.[0]!==n.study||
    own.body.updatedAt!==save.body.updatedAt)
    throw Error('QA member workspace read-back failed');
   snapshots.push(own.body);
  }
  for(let i=0;i<2;i++){
   const n=notes[i],other=notes[1-i];
   const fake=await http(ORIGIN+'/api/chart-workspace?user_id='+other.id+'&member_id='+other.id,n.token);
   if(fake.status!==200||JSON.stringify(fake.body)!==JSON.stringify(snapshots[i]))
    throw Error('Cross-account identity selector isolation failed');
   const direct=await fetch(url+'/rest/v1/crownlight_chart_workspaces_v1?select=user_id,settings&limit=3',{
    headers:{apikey:pub,authorization:'Bearer '+n.token},signal:AbortSignal.timeout(12000)});
   const directBody=await direct.json().catch(()=>null);
   if(!([401,403].includes(direct.status)||
     (direct.status===200&&Array.isArray(directBody)&&directBody.length===0)))
    throw Error('Direct member workspace table leakage detected');
  }
  const guest=await http(ORIGIN+'/api/chart-workspace','invalid-guest-token');
  if(![401,403].includes(guest.status))throw Error('Guest workspace denial failed');
  success=true;
  scope={actualGoTrueMembers:2,actualTiers:['STANDARD','PROFESSIONAL'],
   independentUserIds:true,qaWorkspacesSaved:2,isolatedReadback:true,
   crossAccountSelectorDenied:true,directDatabaseDenied:true,
   commercialCharges:0,lumenChanges:0,liveCustomerChanges:0,
   source:'PRODUCTION_AUTH_BACKEND',humanCaptchaSignInVerified:false};
 }catch(e){problem=String(e?.message||e).slice(0,150)}
 finally{
  // Only IDs created in this request may be removed. Never touch customer rows.
  for(const id of ids){
   const x=await admin.from('crownlight_chart_workspaces_v1').delete().eq('user_id',id);
   if(x.error)clean=false;
   const g=await admin.from('crownlight_chart_qa_grants_v1').delete().eq('user_id',id);
   if(g.error)clean=false;
   const d=await admin.auth.admin.deleteUser(id);
   if(d.error)clean=false;
  }
 }
 return reply({ok:success&&clean,acceptance:success?'PASSED':'FAILED',cleaned:clean,
  runId:claims.runId,scope,problem:problem||null},success&&clean?200:503);
});
