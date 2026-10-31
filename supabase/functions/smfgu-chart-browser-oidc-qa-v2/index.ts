/* Single-run, noncommercial Chart Studio identity isolation acceptance.
 * No payments, founders, Lumens, or real-user changes. Self-cleaning QA users.
 * GitHub OIDC RS256 validation happens before ANY privileged operation.
 * Disable the deployed function after acceptance; source retained for audit.
 */
import {createClient} from 'npm:@supabase/supabase-js@2';
const AUD='smfgu-chart-browser-acceptance-v2-20261031';
const PROJECT='cybernexuspublishing/stock-market-from-the-ground-up';
const WORKFLOW=PROJECT+'/.github/workflows/chart-studio-browser-oidc-qa-v2.yml@refs/heads/main';
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
 const bad=[];
 if(payload.iss!=='https://token.actions.githubusercontent.com')bad.push('issuer');
 if(payload.aud!==AUD)bad.push('audience');
 if(payload.repository!==PROJECT)bad.push('repository');
 if(payload.ref!=='refs/heads/main')bad.push('branch');
 if(payload.workflow_ref!==WORKFLOW)bad.push('workflow');
 // GitHub may customize 'sub'. Signed repository, ref and workflow claims above are authoritative.
 if(!['push','workflow_dispatch'].includes(payload.event_name))bad.push('event');
 if(!/^\d{5,16}$/.test(String(payload.run_id||'')))bad.push('run_id');
 if(!Number.isInteger(payload.exp)||payload.exp<=now||payload.exp>now+900)bad.push('expiration');
 if(!Number.isInteger(payload.iat)||payload.iat>now+60||now-payload.iat>600)bad.push('issuance');
 if(bad.length)throw Error('GitHub OIDC claims denied: '+bad.join(','));
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

/* Privileged identity creation is allowed only for signed GitHub workflow
 * and only for two disposable QA members. No Founder, staff, wallet or billing writes.
 * Credentials only returned to its OIDC-authenticated, ephemeral Actions runner.
 * Always call cleanup in a finally block, including on assertion failure.
 */
const mkPassword=()=>{let bytes=new Uint8Array(24);crypto.getRandomValues(bytes);
 return "SmfguB9!"+Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("")};
const check=async req=>{
 let c;try{c=await githubClaims(req)}catch{return null}
 return c;
};
const args=async req=>{try{return await req.json()}catch{return {}}};
const sameProject=url=>url==='https://oxihglyfgzywsupnyicb.supabase.co';
Deno.serve(async req=>{
 if(req.method!=='POST')return reply({ok:false,error:'METHOD'},405);
 const claims=await check(req);if(!claims)return reply({ok:false,error:'OIDC_DENIED'},403);
 const parsed=await args(req),run=claims.runId+'-'+claims.attempt;
 if(!['begin','finish'].includes(parsed.action))return reply({ok:false,error:'ACTION'},400);
 const url=Deno.env.get('SUPABASE_URL')||'';
 const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
 const pub=Deno.env.get('SUPABASE_ANON_KEY')||'';
 if(!sameProject(url)||!secret||!pub)return reply({ok:false,error:'CONFIG'},503);
 const admin=createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}});
 if(parsed.action==='finish'){
  const ids=Array.isArray(parsed.ids)?parsed.ids:[];
  if(ids.length>3)return reply({ok:false,error:'BAD_IDS'},400);
  let deleted=0,failed=0;
  for(const id of ids){
   if(typeof id!=='string'||!/^[a-f0-9-]{36}$/i.test(id)){failed++;continue}
   const existing=await admin.auth.admin.getUserById(id);
   if(existing.error||existing.data?.user?.app_metadata?.qa_chart_run!==run||
    existing.data.user.app_metadata?.qa_batch!=='SMFGU-CHART-OIDC-BROWSER-V2'){failed++;continue}
   const w=await admin.from('crownlight_chart_workspaces_v1').delete().eq('user_id',id);
   const g=await admin.from('crownlight_chart_qa_grants_v1').delete().eq('user_id',id);
   const d=await admin.auth.admin.deleteUser(id);
   if(w.error||g.error||d.error)failed++;else deleted++;
  }
  return reply({ok:failed===0&&deleted===ids.length,deleted,failed},failed?503:200)
 }
 const users=[];
 const clean=async()=>{
  let failures=0;
  for(const {id} of users){
   const w=await admin.from('crownlight_chart_workspaces_v1').delete().eq('user_id',id);
   const g=await admin.from('crownlight_chart_qa_grants_v1').delete().eq('user_id',id);
   const d=await admin.auth.admin.deleteUser(id);
   if(w.error||g.error||d.error)failures++;
  }
  return failures;
 };
 try{
  for(const [tier,tag] of [['STANDARD','std'],['PROFESSIONAL','pro']]){
   const email='stockmarketfromthegroundup+chromium-'+run+'-'+tag+'@gmail.com';
   const password=mkPassword();
   const username='StudioBrowser'+tag+claims.runId.slice(-8);
   const made=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{username},
    app_metadata:{smfgu_qa_only:true,noncommercial:true,qa_batch:'SMFGU-CHART-OIDC-BROWSER-V2',
     qa_chart_run:run,qa_target_plan:'FREE'}});
   if(made.error||!made.data?.user?.id)throw Error('CREATE_USER_'+tag);
   const id=made.data.user.id;users.push({tier,id,email,password});
  }
  const start=new Date(Date.now()-60000).toISOString();
  const end=new Date(Date.now()+18*60000).toISOString();
  const grant=await admin.from('crownlight_chart_qa_grants_v1').upsert({
   user_id:users[1].id,tier:'PROFESSIONAL',scope:'CHART_STUDIO_ONLY',
   starts_at:start,ends_at:end,reason:'Signed OIDC disposable browser test '+run
  },{onConflict:'user_id'});
  if(grant.error)throw Error('SCOPED_GRANT');
  const sessions=[];
  for(const u of users){
   const sb=createClient(url,pub,{auth:{persistSession:false,autoRefreshToken:false}});
   const signed=await sb.auth.signInWithPassword({email:u.email,password:u.password});
   if(signed.error||signed.data.user?.id!==u.id||!signed.data.session?.access_token||
    !signed.data.session?.refresh_token)throw Error('SIGNED_GOTRUE_'+u.tier);
   sessions.push({tier:u.tier,id:u.id,access:signed.data.session.access_token,
    refresh:signed.data.session.refresh_token});
  }
  // No token/password is included in GitHub logs; authorized job holds this in memory.
  return reply({ok:true,ids:users.map(x=>x.id),sessions,expiresAt:end,qaRun:run});
 }catch(e){
  const failures=await clean();
  return reply({ok:false,error:String(e.message||'START_ERROR').slice(0,80),
   cleanupComplete:failures===0},503);
 }
});
