/* No shared QA passwords or production service secrets. GitHub-hosted
 * OIDC authenticates this exact workflow to a temporary Supabase Edge function.
 * Never display bearer tokens or identity credentials in CI logs.
 */
import assert from 'node:assert/strict';
const base=process.env.ACTIONS_ID_TOKEN_REQUEST_URL||'';
const bearer=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN||'';
assert(base&&bearer,'GitHub Actions OIDC grant unavailable: acceptance blocked');
const oidcUrl=new URL(base);oidcUrl.searchParams.set('audience','smfgu-chart-matrix-acceptance-20261031');
const grant=await fetch(oidcUrl,{headers:{Authorization:'Bearer '+bearer},signal:AbortSignal.timeout(15000)});
assert.equal(grant.status,200,'GitHub OIDC identity issuance failed');
const jwt=(await grant.json()).value;
assert(typeof jwt==='string'&&jwt.split('.').length===3,'Invalid GitHub OIDC token');
const r=await fetch('https://oxihglyfgzywsupnyicb.supabase.co/functions/v1/smfgu-chart-matrix-github-oidc-v1',{
 method:'POST',headers:{authorization:'Bearer '+jwt,'content-type':'application/json'},
 body:'{}',signal:AbortSignal.timeout(110000)
});
const report=await r.json().catch(()=>({error:'Non-JSON acceptance response'}));
console.log('CHART_ACCEPTANCE '+JSON.stringify({status:r.status,ok:report.ok===true,
 acceptance:report.acceptance,cleaned:report.cleaned===true,
 scope:report.scope||null,problem:String(report.problem||report.error||'').slice(0,180)}));
assert.equal(r.status,200,'Real noncommercial QA member acceptance failed (see sanitized summary)');
assert.equal(report.ok,true);
assert.equal(report.acceptance,'PASSED');
assert.equal(report.cleaned,true,'Disposable QA identity cleanup is mandatory');
assert.equal(report.scope?.actualGoTrueMembers,2);
assert.deepEqual(report.scope?.actualTiers,['STANDARD','PROFESSIONAL']);
assert.equal(report.scope?.crossAccountSelectorDenied,true);
assert.equal(report.scope?.directDatabaseDenied,true);
assert.equal(report.scope?.commercialCharges,0);
assert.equal(report.scope?.lumenChanges,0);
console.log('PASS real independent Standard and Professional GoTrue-issued QA sessions with temporary noncommercial tier grant; cross-account isolation; cleanup');
