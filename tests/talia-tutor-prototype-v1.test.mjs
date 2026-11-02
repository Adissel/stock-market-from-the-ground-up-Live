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
