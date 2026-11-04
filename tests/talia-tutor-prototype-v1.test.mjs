import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
test('Dedicated Talia prototype is linked and loads existing React Tutor rather than a duplicate engine',()=>{
 const page=read('talia-tutor-prototype.html'),center=read('prototype.html'),boot=read('assets/js/talia-prototype-gate-v1.js');
 assert.match(center,/href="\/talia-tutor-prototype\.html"/);
 assert.match(page,/id="talia-classroom-root"/);
 assert.match(boot,/talia-classroom-v1\.bundle\.js/);
 assert.match(page,/data-route-access="staff"/);
 assert.doesNotMatch(page,/talia-classroom-v1\.bundle\.js/); // loaded only after verified staff access
});
test('Prototype staff check is fail closed and uses existing authenticated admin authority',()=>{
 const gate=read('assets/js/talia-prototype-gate-v1.js');
 for(const token of ['getSession()','getUser()','/api/admin?action=context','control_panel.access','SHOWCASE_VIEWER','OWNER','ADMIN','TECH_ADMIN','workspace.hidden=true','cache:\'no-store\''])assert.ok(gate.includes(token),token);
 assert.ok(gate.indexOf('if(!mounted)')>gate.indexOf('permissions.includes'));
 assert.doesNotMatch(gate,/localStorage|service_role|stripe|api\/market-tutor/);
});
test('Prototype preserves existing ECharts and accessible fictional prefix presentation',()=>{
 const tsx=read('src/tutor/TaliaClassroom.tsx');
 const html=read('talia-tutor-prototype.html');
 assert.match(html,/crownlight-echarts-loader-v1\.js/);
 assert.match(tsx,/REPLAY\.slice\(0,visible\)/);
 assert.match(tsx,/CrownlightECharts/);
 assert.match(tsx,/getSupabaseClient/);
});

test('Prototype sign-in returns staff to the prototype route without bypassing staff authorization',()=>{
 const classroom=read('src/tutor/TaliaClassroom.tsx');
 assert.match(classroom,/isTaliaPrototypePath\(\)\?'\/talia-tutor-prototype\.html':'\/talia-classroom\.html'/);
 const gate=read('assets/js/talia-prototype-gate-v1.js');
 assert.match(gate,/\/api\/admin\?action=context/);
 assert.match(gate,/control_panel\.access/);
});


test('Redesigned instructor workstation preserves actual Tutor API and protects staff entry',()=>{
 const page=read('talia-tutor-prototype.html');
 const css=read('assets/css/talia-prototype-v1.css');
 const gate=read('assets/js/talia-prototype-gate-v1.js');
 for(const token of ['id="talia-classroom-root"','id="tp-connection"','tp-operational-bar','tp-instructor','data-route-access="staff"','data-tp-view="split"','data-tp-view="chart"','data-tp-view="tutor"'])
  assert.ok(page.includes(token),'Required real classroom integration '+token);
 assert.ok(gate.includes("connection.textContent='Authorized staff session'"));
 assert.ok(gate.includes("connection.textContent='Access not verified'"));
 assert.ok(css.includes('.tp-console-heading')&&css.includes('.tp-workspace-summary'));
 assert.doesNotMatch(page,/onclick=|fakeResponse|mockTutorResponse/);
});

test('Guided educational cycle remains ungraded and available to signed-in classroom members',()=>{
 const classroom=read('src/tutor/TaliaClassroom.tsx');
 for(const label of ['1 · Explain & demonstrate','2 · Diagnose understanding','3 · Correct reasoning','4 · Independent transfer'])assert.ok(classroom.includes(label),label);
 assert.match(classroom,/setMode\('review'\)/);
 assert.match(classroom,/setMode\('question'\)/);
 assert.match(classroom,/Do not grade it/);
 assert.match(classroom,/advancedExperience&&<section className="tp-teaching-loop"/);
});

test('Advanced Tutor continues actual lessons and supplies only revealed chart evidence',()=>{
 const source=read('src/tutor/TaliaClassroom.tsx');
 const css=read('assets/css/talia-prototype-v1.css');
 assert.match(source,/const latestExchange=chat\.length>=3/);
 assert.match(source,/chat\[chat\.length-1\]\?\.who==='talia'/);
 assert.match(source,/continueLesson\('clarify'\)/);
 assert.match(source,/continueLesson\('challenge'\)/);
 assert.match(source,/continueLesson\('transfer'\)/);
 assert.match(source,/bar\[0\]\.toFixed\(2\)/);
 assert.match(source,/bar\[3\]\.toFixed\(2\)/);
 assert.match(source,/Only '\+visible\+' underlying one-minute candles revealed/);
 assert.match(source,/no automatic paid retry/);
 assert.match(source,/saveHistory:currentSave,conversationId:thread/);
 assert.ok(css.includes('.tp-followup'));
});

test('Talia advanced six-phase pathway stays ungraded and uses existing authenticated API',()=>{
 const tsx=read('src/tutor/TaliaClassroom.tsx');
 const css=read('assets/css/talia-prototype-v1.css');
 for(const phase of ['Observe','Explain','Attempt','Correct','Retry','Transfer'])
  assert.ok(tsx.includes(phase),'Missing instructional phase '+phase);
 for(const dimension of ['Knowledge','Recognition','Decision','Process'])
  assert.ok(tsx.includes('<option>'+dimension+'</option>'),'Missing practice dimension '+dimension);
 assert.match(tsx,/phaseInstructions:Record<Phase/);
 assert.match(tsx,/const preparePhase=/);
 assert.match(tsx,/setQuestion\(\(sessionTopic/);
 assert.match(tsx,/role="group" aria-label="Instruction phases"/);
 assert.match(tsx,/requestId:crypto.randomUUID\(\),allowModel:false/);
 assert.match(tsx,/saveHistory:currentSave,conversationId:thread/);
 assert.match(css,/\.tp-instruction-steps button\[aria-pressed=true\]/);
 assert.doesNotMatch(tsx,/awardMastery|giveGrade|privateAnswerKey/);
});

test('Personalized learning state and unsent text are scrubbed on identity change',()=>{
 const source=read('src/tutor/TaliaClassroom.tsx');
 const reset=source.slice(source.indexOf('const reset=useCallback'),source.indexOf('useEffect(()=>{',source.indexOf('const reset=useCallback')));
 for(const token of ["setQuestion('')","setMisconception('observation')","setConfidence('unsure')","setDimension('Recognition')","setConversationId(null)","pending.current?.abort()"])
  assert.ok(reset.includes(token),'Account switch must clear '+token);
});

test('Starting new Tutor topic aborts outstanding requests and resets all ungraded phase state',()=>{
 const source=read('src/tutor/TaliaClassroom.tsx');
 const marker=source.indexOf('New unsaved topic</button>');
 assert.ok(marker>0,'New unsaved topic action must exist');
 const start=source.lastIndexOf('onClick={()=>{pending.current?.abort();epoch.current++',marker);\n  assert.ok(start>0,'New topic reset handler must begin with request cancellation');\n  const action=source.slice(start,marker);
 for(const token of ['pending.current?.abort()','epoch.current++',"setQuestion('')","setReasoning('')","setPhase('Observe')",'setAttempts(0)',"setMisconception('observation')","setConfidence('unsure')",'setConversationId(null)','setSave(false)'])
  assert.ok(action.includes(token),'Topic reset must include '+token);
});

// Consolidated source-presence regression inventory. These are NOT authenticated browser tests.
test('Talia major release: 79 individually identified integration and safety contracts remain present',()=>{
 const contracts={
 "src/tutor/TaliaClassroom.tsx": [
  "getSupabaseClient",
  "getSession()",
  "getUser()",
  "onAuthStateChange",
  "pending.current?.abort()",
  "epoch.current++",
  "identity.current",
  "/api/member-tool-access?tool=MARKET_TUTOR",
  "/api/market-tutor",
  "allowModel:false",
  "saveHistory:currentSave",
  "conversationId:thread",
  "/api/member-tutor-history",
  "/api/member-tutor-conversations",
  "getToken",
  "source-grounded",
  "REPLAY.slice(0,visible)",
  "CrownlightECharts",
  "dataZoom",
  "candlestick",
  "showVolume",
  "vwap",
  "ema200",
  "ema20",
  "ema9",
  "showStructure",
  "fictional",
  "Observe",
  "Explain",
  "Attempt",
  "Correct",
  "Retry",
  "Transfer",
  "Knowledge",
  "Recognition",
  "Decision",
  "Process",
  "misconception",
  "confidence",
  "preparePhase",
  "requestCorrection",
  "requestRecommendation",
  "save",
  "reasoning",
  "aria-label",
  "role=\"log\"",
  "setQuestion('')",
  "setReasoning('')",
  "setMember(null)",
  "setConversationId(null)",
  "setSave(false)",
  "setBusy(false)",
  "setPhase('Observe')",
  "setAttempts(0)",
  "setMisconception('observation')",
  "setConfidence('unsure')",
  "setDimension('Recognition')"
 ],
 "assets/js/talia-prototype-gate-v1.js": [
  "getSession()",
  "getUser()",
  "/api/admin?action=context",
  "SHOWCASE_VIEWER",
  "control_panel.access",
  "workspace.hidden=true",
  "cache:'no-store'",
  "OWNER",
  "ADMIN",
  "TECH_ADMIN",
  "talia-classroom-v1.bundle.js"
 ],
 "talia-tutor-prototype.html": [
  "data-route-access=\"staff\"",
  "id=\"talia-classroom-root\"",
  "data-tp-view=\"split\"",
  "data-tp-view=\"chart\"",
  "data-tp-view=\"tutor\"",
  "id=\"tp-connection\"",
  "crownlight-echarts-loader-v1.js"
 ],
 "assets/css/talia-prototype-v1.css": [
  ".tp-instruction-steps",
  ".tp-followup",
  "@media(max-width:600px)",
  "prefers-reduced-motion"
 ]
};
 let checked=0;
 for(const [path,tokens] of Object.entries(contracts)){
  const source=read(path);
  for(const token of tokens){assert.ok(source.includes(token),path+' missing release contract '+token);checked++}
 }
 assert.equal(checked,79);
});

test('Private conversation creation and history require a fresh verified identity before rendering',()=>{
 const src=read('src/tutor/TaliaClassroom.tsx');
 const creation=src.slice(src.indexOf('const newConversation=async'),src.indexOf('const loadHistory=async'));
 const history=src.slice(src.indexOf('const loadHistory=async'),src.indexOf('const safeSuggest='));
 for(const body of [creation,history]){
  assert.match(body,/const confirmed=await getToken\(\)/);
  assert.match(body,/!confirmed\|\|version!==epoch\.current\|\|identity\.current!==uid/);
  assert.match(body,/cache:'no-store'/);
  assert.match(body,/authorization:'Bearer '\+access/);
 }
 assert.match(history,/if\(version!==epoch\.current\|\|identity\.current!==uid\)return;\s*setChat/);
 assert.doesNotMatch(history,/localStorage|sessionStorage|setItem/);
});

test('Staff prototype revokes visibility while revalidating and rejects session replacement races',()=>{
 const gate=read('assets/js/talia-prototype-gate-v1.js');
 for(const token of ['const invalidate=','revision++','requestRevision!==revision','current.data.session.user?.id!==user.id','current.data.session.access_token!==session.access_token','document.hidden','window.addEventListener(\'focus\'','workspace.hidden=true'])
  assert.ok(gate.includes(token),'Fail-closed reauthorization missing '+token);
 assert.match(gate,/cache:'no-store'/);
 assert.match(gate,/control_panel.access/);
 assert.doesNotMatch(gate,/localStorage|sessionStorage|service_role/);
});

/** Real gate script in a deterministic browser-API harness. No production credentials or staff writes. */
function gateHarness(roles=['OWNER'],permissions=['control_panel.access']){
 const status={hidden:false,textContent:''},workspace={hidden:true},connection={textContent:''};
 const listeners={doc:new Map(),win:new Map()},scripts=[],requests=[];
 let user='staff-A',token='token-A',authCallback=null,subscriptions=0,interval=null,intervalMs=0,reloads=0,cleared=false,policy={ok:true,roles,permissions},deferred=null;
 const auth={
  getSession:async()=>({data:{session:user?{access_token:token,user:{id:user}}:null}}),
  getUser:async()=>({data:{user:user?{id:user}:null}}),
  onAuthStateChange:cb=>{authCallback=cb;subscriptions++;return {data:{subscription:{unsubscribe(){}}}}}
 };
 const client={auth};
 const doc={hidden:false,getElementById:id=>({'tp-auth':status,'tp-workspace':workspace,'tp-connection':connection}[id]||null),
  addEventListener:(event,cb)=>listeners.doc.set(event,cb),
  createElement:tag=>({tagName:tag,src:'',type:'',onerror:null}),
  head:{append:script=>scripts.push(script)}};
 const win={getSupabaseClient:async()=>client,addEventListener:(event,cb)=>listeners.win.set(event,cb),
  setInterval:(cb,ms)=>{interval=cb;intervalMs=ms;return 123},
  clearInterval:id=>{if(id===123){interval=null;cleared=true}},
  location:{reload:()=>{reloads++}}};
 const fetch=async(url,options)=>{requests.push({url,options});if(deferred){const d=deferred;deferred=null;return d}return {ok:true,json:async()=>policy}};
 vm.runInNewContext(read('assets/js/talia-prototype-gate-v1.js'),{window:win,document:doc,fetch,queueMicrotask,Promise});
 const settle=async()=>{for(let i=0;i<35;i++)await Promise.resolve()};
 return {status,workspace,connection,doc,scripts,requests,settle,
  start:async()=>{listeners.doc.get('DOMContentLoaded')();await settle()},
  tick:async()=>{interval?.();await settle()},
  focus:async()=>{listeners.win.get('focus')?.();await settle()},
  event:async ev=>{listeners.doc.get(ev)?.();listeners.win.get(ev)?.();await settle()},
  authEvent:async ev=>{authCallback?.(ev);await settle()},
  setPolicy:p=>{policy=p},setUser:(u,t)=>{user=u;token=t||null},
  defer:()=>{let resolve;deferred=new Promise(r=>{resolve=r});return p=>resolve({ok:true,json:async()=>p})},
  stats:()=>({subscriptions,intervalMs,reloads,cleared})};
}
test('Staff prototype refreshes a verified owner session every 30 seconds, without mounting twice',async()=>{
 const h=gateHarness();await h.start();await h.tick();
 assert.equal(h.workspace.hidden,false);assert.equal(h.scripts.length,1);
 assert.equal(h.requests.length,2);assert.equal(h.stats().subscriptions,1);
 assert.equal(h.stats().intervalMs,30000);
 for(const q of h.requests){assert.equal(q.url,'/api/admin?action=context');assert.equal(q.options.cache,'no-store');assert.equal(q.options.headers.authorization,'Bearer token-A')}
});
for(const [label,roles,permissions,expected] of [
 ['owner authorized',['OWNER'],['control_panel.access'],true],
 ['admin authorized',['ADMIN'],['control_panel.access'],true],
 ['technical administrator authorized',['TECH_ADMIN'],['control_panel.access'],true],
 ['nonstaff denied',[],[],false],
 ['member denied',['MEMBER'],['control_panel.access'],false],
 ['owner missing permission denied',['OWNER'],[],false],
 ['admin missing permission denied',['ADMIN'],['dashboard.view'],false],
 ['mixed showcase owner denied',['OWNER','SHOWCASE_VIEWER'],['control_panel.access'],false],
 ['showcase alone denied',['SHOWCASE_VIEWER'],['control_panel.access'],false]
]){
 test('Staff prototype context: '+label,async()=>{
  const h=gateHarness(roles,permissions);await h.start();
  assert.equal(h.workspace.hidden,!expected);
  assert.equal(h.scripts.length,expected?1:0);
 });
}
test('Role revocation while tab remains focused conceals the existing workstation',async()=>{
 const h=gateHarness();await h.start();
 h.setPolicy({ok:true,roles:[],permissions:[]});await h.tick();
 assert.equal(h.workspace.hidden,true);assert.equal(h.status.hidden,false);
 assert.equal(h.connection.textContent,'Access not verified');
});
test('Server context failure closes already visible staff workspace',async()=>{
 const h=gateHarness();await h.start();
 h.setPolicy({ok:false,roles:['OWNER'],permissions:['control_panel.access']});await h.tick();
 assert.equal(h.workspace.hidden,true);
});
test('Signout hides private workspace synchronously and does not regrant without a session',async()=>{
 const h=gateHarness();await h.start();h.setUser(null);const finished=h.authEvent('SIGNED_OUT');
 assert.equal(h.workspace.hidden,true);await finished;assert.equal(h.workspace.hidden,true);
});
test('Token refresh hides stale state and requires new server authorization',async()=>{
 const h=gateHarness();await h.start();h.setUser('staff-A','fresh-token');
 await h.authEvent('TOKEN_REFRESHED');
 assert.equal(h.workspace.hidden,false);assert.equal(h.requests.at(-1).options.headers.authorization,'Bearer fresh-token');
});
test('Account switch reloads the app before retaining previously mounted member-private state',async()=>{
 const h=gateHarness();await h.start();h.setUser('staff-B','token-B');
 await h.authEvent('SIGNED_IN');
 assert.equal(h.workspace.hidden,true);assert.equal(h.stats().reloads,1);assert.equal(h.scripts.length,1);
});
test('User metadata changes trigger independent role revalidation',async()=>{
 const h=gateHarness();await h.start();let before=h.requests.length;
 await h.authEvent('USER_UPDATED');assert.equal(h.requests.length,before+1);
});
test('Hidden tab is concealed and does not poll while inactive',async()=>{
 const h=gateHarness();await h.start();h.doc.hidden=true;
 await h.event('visibilitychange');const before=h.requests.length;await h.tick();
 assert.equal(h.workspace.hidden,true);assert.equal(h.requests.length,before);
 h.doc.hidden=false;await h.event('visibilitychange');assert.equal(h.workspace.hidden,false);
});
test('Window focus triggers a fresh check rather than trusting a cached staff grant',async()=>{
 const h=gateHarness();await h.start();const before=h.requests.length;await h.focus();
 assert.equal(h.requests.length,before+1);
});
test('Old delayed server response cannot reauthorize a signed-out staff session',async()=>{
 const h=gateHarness();await h.start();const release=h.defer();await h.tick();
 h.setUser(null);await h.authEvent('SIGNED_OUT');
 release({ok:true,roles:['OWNER'],permissions:['control_panel.access']});
 await h.settle();assert.equal(h.workspace.hidden,true);
});
test('Pagehide clears the periodic poll without changing user roles',async()=>{
 const h=gateHarness();await h.start();await h.event('pagehide');
 assert.equal(h.stats().cleared,true);let before=h.requests.length;await h.tick();
 assert.equal(h.requests.length,before);
});
test('Backend revocation remains effective until a new affirmative permission response',async()=>{
 const h=gateHarness();await h.start();h.setPolicy({ok:true,roles:[],permissions:[]});
 await h.tick();await h.tick();assert.equal(h.workspace.hidden,true);
 h.setPolicy({ok:true,roles:['OWNER'],permissions:['control_panel.access']});
 await h.tick();assert.equal(h.workspace.hidden,false);
});
