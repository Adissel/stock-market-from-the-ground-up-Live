import test from 'node:test';
import assert from 'node:assert/strict';
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
 assert.match(classroom,/pathname\.endsWith\('\/talia-tutor-prototype\.html'\)\?'\/talia-tutor-prototype\.html':'\/talia-classroom\.html'/);
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

test('Prototype educational cycle is ungraded, contextual and available only in the staff preview',()=>{
 const classroom=read('src/tutor/TaliaClassroom.tsx');
 for(const label of ['1 · Explain & demonstrate','2 · Diagnose understanding','3 · Correct reasoning','4 · Independent transfer'])assert.ok(classroom.includes(label),label);
 assert.match(classroom,/setMode\('review'\)/);
 assert.match(classroom,/setMode\('question'\)/);
 assert.match(classroom,/Do not grade it/);
 assert.match(classroom,/pathname\.endsWith\('\/talia-tutor-prototype\.html'\)&&<section className="tp-teaching-loop"/);
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
 assert.match(source,/Only '\+visible\+' bars have been revealed/);
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
