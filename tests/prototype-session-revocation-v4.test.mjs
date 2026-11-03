/* PT4 — synthetic authenticated session, role, grant-expiry and revocation contracts.
 * No member records, real JWTs, credentials or privileged database writes.
 * This verifies role decisions on every request; genuine login remains separate.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyPrototypeStaff,onRequest as cases} from '../functions/api/prototype-training-cases.js';
import {onRequest as protectedDocument} from '../functions/api/prototype-document.js';

const userId='00000000-0000-4000-8000-000000000123';
const html=readFileSync('prototype.html','utf8');
let fetches=0,assetReads=0;
const state={
 authStatus:200, roleRows:[{role_code:'OWNER',expires_at:null}],
 profile:{account_kind:'member',deleted_at:null},
 flag:{status:'active'}, permissions:[{permission_code:'control_panel.access'}],
 databaseFail:false
};
const env={SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_SYNTHETIC_PUBLIC',
 SUPABASE_SECRET_KEY:'sb_secret_SYNTHETIC_NEVER_REAL',
 ASSETS:{fetch:async()=>{assetReads++;return new Response(html,{status:200})}}};
const previousFetch=globalThis.fetch;
const respond=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async url=>{
 fetches++;
 const path=String(url);
 if(path.endsWith('/auth/v1/user'))return respond(state.authStatus===200?{id:userId}:{msg:'session unavailable'},state.authStatus);
 if(state.databaseFail)return respond({msg:'private service unavailable'},503);
 if(path.includes('/admin_user_roles?'))return respond(state.roleRows);
 if(path.includes('/profiles?'))return respond([state.profile]);
 if(path.includes('/admin_user_flags?'))return respond([state.flag]);
 if(path.includes('/admin_role_permissions?'))return respond(state.permissions);
 throw Error('Unexpected synthetic endpoint');
};
const bearer=new Request('https://site.example/api/prototype-document',{headers:{authorization:'Bearer SYNTHETIC_QA_ACCESS_TOKEN'}});
const anon=new Request('https://site.example/api/prototype-document');
const status=async()=> (await verifyPrototypeStaff(bearer,env)).status;
try{
 assert.equal((await verifyPrototypeStaff(anon,env)).status,401,'anonymous must deny before network fetch');
 assert.equal(await status(),200,'active staff grant and permission');
 const doc=await protectedDocument({request:bearer,env});
 assert.equal(doc.status,200,'staff document success');
 assert.match(doc.headers.get('cache-control'),/no-store/);
 assert.match(doc.headers.get('x-robots-tag'),/noindex/);
 const caseResponse=await cases({request:bearer,env});
 assert.equal(caseResponse.status,200,'active staff may read fictional teaching cases');
 const body=await caseResponse.json();
 assert.equal(body.gradingEnabled,false);
 assert.equal(body.privateAnswerKeysIncluded,false);
 assert(body.cases.every(item=>!Object.hasOwn(item,'expectedNumerator')),'protected answer keys remain absent');
 const grantedAssetReads=assetReads;
 state.roleRows=[];
 assert.equal(await status(),403,'staff role must be re-read and revoked promptly');
 assert.equal((await protectedDocument({request:bearer,env})).status,403,'revoked staff document denial');
 assert.equal((await cases({request:bearer,env})).status,403,'revoked staff cases denial');
 assert.equal(assetReads,grantedAssetReads,'revoked staff must never request protected HTML');
 state.roleRows=[{role_code:'OWNER',expires_at:new Date(Date.now()-60_000).toISOString()}];
 assert.equal(await status(),403,'expired staff grant must fail closed');
 state.roleRows=[{role_code:'ADMIN',expires_at:new Date(Date.now()+60_000).toISOString()}];
 assert.equal(await status(),200,'valid time-limited admin grant');
 state.permissions=[];
 assert.equal(await status(),403,'permission removal must take effect on next request');
 state.permissions=[{permission_code:'control_panel.access'}];
 state.flag={status:'suspended'};
 assert.equal(await status(),403,'suspension must take effect without token refresh');
 state.flag={status:'active'};
 state.profile={account_kind:'member',deleted_at:new Date().toISOString()};
 assert.equal(await status(),403,'deleted profile must fail closed');
 state.profile={account_kind:'member',deleted_at:null};
 state.roleRows=[{role_code:'OWNER',expires_at:null},{role_code:'SHOWCASE_VIEWER',expires_at:null}];
 assert.equal(await status(),403,'mixed showcase and staff roles must fail closed');
 state.roleRows=[{role_code:'OWNER',expires_at:null}];
 state.authStatus=401;
 assert.equal(await status(),401,'Supabase Auth 401 must deny invalid / revoked session');
 assert.equal((await protectedDocument({request:bearer,env})).status,401);
 state.authStatus=200;state.databaseFail=true;
 assert.equal((await protectedDocument({request:bearer,env})).status,503,'private service outage must fail closed');
 state.databaseFail=false;state.authStatus=503;
 assert.equal((await protectedDocument({request:bearer,env})).status,503,'Auth service outage must fail closed');
 assert(fetches>15,'Role checks must be re-evaluated per request');
 console.log('PASS PT4: synthetic Owner/Admin positive, real-time role revocation, expiration, permission, profile, flags, Auth rejection, fail-closed and protected assets. Genuine account acceptance separate.');
}finally{globalThis.fetch=previousFetch}
