import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const html=readFileSync('talia-classroom.html','utf8');
const css=readFileSync('assets/css/talia-spectrum-v1.css','utf8');
test('Talia classroom loads vivid theme but not protected Lab layouts',()=>{assert.match(html,/talia-spectrum-v1\.css/);assert.doesNotMatch(css,/\.lab-player|\.bootcamp-interactive|\.learning-engine|\.lab-engine/);});
test('three approved palettes theme teaching and actual ECharts chart',()=>{for(const name of ['spectrum','ultraviolet','solar'])assert.ok(css.includes('data-smfgu-theme="'+name+'"'),name);for(const component of ['.tc-chart','.tc-terminal-switches','.tc-transcript','.tp-instruction-engine'])assert.ok(css.includes(component),component);});
test('no private state or API mutations from theme',()=>{assert.doesNotMatch(css,/\.supabase|service_role|access_token|api\/|localStorage/);});
