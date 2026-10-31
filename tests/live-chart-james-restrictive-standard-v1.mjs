/* Production real Auth James_Test restrictive STANDARD QA. No money, wallet or workspace writes.
 * Expects a short-lived, owner-authorized restrictive ceiling in the existing QA table.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const cfg=readFileSync('config.js','utf8');
const sb=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL,password=process.env.LAB_QA_PASSWORD;
if(!sb||!key||!email||!password)throw Error('BLOCKED: genuine QA credentials unavailable');
const req=async(url,opt={})=>{
 const r=await fetch(url,{...opt,cache:'no-store',signal:AbortSignal.timeout(25000)});
 return {status:r.status,body:await r.json().catch(()=>null)};
};
try{
 const login=await req(sb+'/auth/v1/token?grant_type=password',{method:'POST',
  headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email,password})});
 assert.equal(login.status,200,'Real member login required');
 const token=login.body?.access_token;assert(token);
 const auth=await req(sb+'/auth/v1/user',{headers:{apikey:key,authorization:'Bearer '+token}});
 assert.equal(auth.body?.id,'f42f9301-18e6-43a3-8531-32d371fd22c1');
 const headers={authorization:'Bearer '+token};
 const tier=await req(origin+'/api/chart-tier-access',{headers});
 assert.equal(tier.status,200);assert.equal(tier.body?.tier,'STANDARD');
 assert.deepEqual(tier.body.allowed,['STANDARD']);
 assert.equal(tier.body.qaTierCeiling?.active,true);
 assert.equal(tier.body.qaTierCeiling?.restrictive,true);
 assert.equal(tier.body.staffChartRole,null);assert.equal(tier.body.ownerChartAccess,false);
 const workspace=await req(origin+'/api/chart-workspace',{headers});
 assert.equal(workspace.status,200);assert.equal(workspace.body?.tier,'STANDARD');
 assert.notEqual(workspace.body?.workspace?.selected,'PROFESSIONAL');
 assert.equal(workspace.body?.workspace?.selected,'STANDARD');
 const forged=await req(origin+'/api/chart-workspace?user_id=00000000-0000-4000-8000-000000000000',{headers});
 assert.equal(forged.status,200);
 assert.deepEqual(forged.body?.workspace,workspace.body.workspace);
 const guest=await req(origin+'/api/chart-workspace');
 assert([401,403].includes(guest.status));
 const foreign=await req(origin+'/api/chart-workspace',{method:'PUT',headers:{...headers,origin:'https://invalid.example','content-type':'application/json'},
  body:JSON.stringify({selected:'PROFESSIONAL',expectedUpdatedAt:workspace.body?.updatedAt})});
 assert.equal(foreign.status,403);
 const fresh=await req(origin+'/api/chart-workspace',{headers});
 assert.deepEqual(fresh.body?.workspace,workspace.body.workspace);
 console.log('PASS: James_Test genuine Auth STANDARD restriction, Professional denial projection, same-user reload, forged selector ignored, guest and foreign-origin denial.');
 console.log('No workspace, Lumen, account, entitlement, provider or payment was mutated by this QA script.');
}catch(e){console.error('FAIL or BLOCKED: '+String(e.message).slice(0,200));process.exitCode=1}
