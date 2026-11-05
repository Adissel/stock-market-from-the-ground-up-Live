import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
test('Cloudflare canonical path and .html alias share protected V4 controls',()=>{
 for(const path of ['/talia-classroom','/talia-classroom.html','/talia-tutor-prototype','/talia-tutor-prototype.html'])assert(s.includes("endsWith('"+path+"')"),path);
 for(const part of ['const prototype=typeof window!==\'undefined\'&&isTaliaAdvancedRoute()','const advancedExperience=isTaliaAdvancedRoute()','advancedExperience&&<section className="tp-teaching-loop"'])assert(s.includes(part),part);
});
test('Both pages cache-bust exactly the same shared chart bundle',()=>{
 assert(readFileSync('talia-classroom.html','utf8').includes('talia-classroom-v1.bundle.js?v=20261105-chart-tabs1'));
 assert(readFileSync('assets/js/talia-prototype-gate-v1.js','utf8').includes('talia-classroom-v1.bundle.js?v=20261105-chart-tabs1'));
 assert(s.includes('/api/member-tool-access?tool=MARKET_TUTOR'));
 assert(readFileSync('talia-tutor-prototype.html','utf8').includes('data-route-access="staff"'));
});
