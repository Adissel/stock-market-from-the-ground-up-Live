/* Verify Prototype Center refuses unauthorized roles before rendering.
   No remote data, network or paid provider access. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('assets/js/prototype-center-v1.js','utf8');
async function run({roles=[],permissions=['control_panel.access'],session=true,verified=true,apiOK=true}={}){
 const nodes=new Map([['pt-app',{hidden:true}],['pt-gate',{hidden:false,textContent:'Checking…'}]]);
 let start,called='',redirect='';
 const sb={auth:{getSession:async()=>({data:{session:session?{access_token:'SYNTHETIC_TOKEN',user:{id:'user-qa'}}:null}}),getUser:async()=>({data:{user:{id:verified?'user-qa':'other-qa'}},error:null})}};
 const document={readyState:'loading',addEventListener:(event,fn)=>{if(event==='DOMContentLoaded')start=fn},getElementById:id=>nodes.get(id)};
 const location={pathname:'/prototype.html',search:'',hash:'',replace:value=>{redirect=value}};
 const global={document,location,window:{getSupabaseClient:async()=>sb},fetch:async(url,opts)=>{called=url;assert.equal(opts.headers.authorization,'Bearer SYNTHETIC_TOKEN');return{ok:apiOK,json:async()=>({ok:true,roles,permissions})}}};
 vm.runInNewContext(source,global,{timeout:1000});
 assert.equal(typeof start,'function','DOM entry registered');
 await start();return {nodes,called,redirect};
}
for(const roles of [['MODERATOR'],[],['SHOWCASE_VIEWER'],['OWNER','SHOWCASE_VIEWER']]){
 const result=await run({roles});
 assert.equal(result.nodes.get('pt-app').hidden,true,roles.join(',')+' must not reveal Prototype app');
 assert.match(result.nodes.get('pt-gate').textContent,/Owner or authorized Administrator/);
 assert.equal(result.called,'/api/admin?action=context');
}
for(const role of ['OWNER','ADMIN','TECH_ADMIN']){
 const result=await run({roles:[role],permissions:[]});
 assert.equal(result.nodes.get('pt-app').hidden,true,role+' without admin permission must not load');
}
const wrongIdentity=await run({roles:['OWNER'],verified:false});
assert.equal(wrongIdentity.nodes.get('pt-app').hidden,true);
assert.match(wrongIdentity.nodes.get('pt-gate').textContent,/Verified sign-in required/);
const signedOut=await run({session:false});
assert.match(signedOut.redirect,/signin\.html/);
assert.equal(signedOut.nodes.get('pt-app').hidden,true);
const noApi=await run({roles:['OWNER'],apiOK:false});
assert.equal(noApi.nodes.get('pt-app').hidden,true);
console.log('PASS: 9 isolated authorization-denial scenarios; no unauthorized Prototype content revealed.');
