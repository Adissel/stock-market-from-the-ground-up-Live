import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const read=p=>readFileSync(p,'utf8');
test('approved nonhome theme is idempotent and NEVER changes homepage',()=>{
 const dir=mkdtempSync(join(tmpdir(),'cl-chart-ui-'));
 try{
  mkdirSync(join(dir,'assets','css'),{recursive:true});
  writeFileSync(join(dir,'assets','css','crownlight-unified-chart-controls-v1.css'),'/* fixture */');
  const home='<!doctype html><html><head></head><body>HOME CHART</body></html>';
  const chart='<!doctype html><html><head></head><body><div class="cx-chart-grabbable">CHART</div></body></html>';
  writeFileSync(join(dir,'index.html'),home);
  writeFileSync(join(dir,'lab-player.html'),chart);
  writeFileSync(join(dir,'talia-classroom.html'),chart);
  const run=()=>spawnSync(process.execPath,['scripts/build-chart-controls-sitewide-v1.mjs'],{
   env:{...process.env,GU_SITE_BUILD_DIR:dir},encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);
  assert.equal(read(join(dir,'index.html')),home,'Homepage must remain untouched');
  for(const file of ['lab-player.html','talia-classroom.html']){
   const out=read(join(dir,file));
   assert.match(out,/crownlight-unified-chart-controls-v1\.css\?v=20261104-unified-chart2/);
   assert.equal((out.match(/crownlight-unified-chart-controls-v1\.css/g)||[]).length,1);
  }
  const before=read(join(dir,'talia-classroom.html'));
  const second=run();assert.equal(second.status,0,second.stderr);
  assert.equal(read(join(dir,'talia-classroom.html')),before,'No duplicate stylesheet');
 }finally{rmSync(dir,{recursive:true,force:true})}
});
test('all shared chart menus have compact controls, no instructional placeholder, and direct volume toggle',()=>{
 const src=read('src/prototype/PrototypeExperiences.tsx');
 const tutor=read('src/tutor/TaliaClassroom.tsx');
 const css=read('assets/css/crownlight-unified-chart-controls-v1.css');
 const studio=read('assets/js/crownlight-echarts-studio-v1.js');
 assert(!src.includes('Hover, focus or select any supported indicator to inspect presets, settings and tier requirements.'));
 assert.match(src,/item\.id==='VOLUME'&&studyAllowed\(studio,item\.id\)/);
 assert.match(src,/prefs\.setEnabled\(item\.id,!prefs\.enabled\[item\.id\]\)/);
 assert.match(src,/selected\.id!=='VOLUME'&&<button/);
 assert.match(src,/specs\.filter\(ind=>ind\.id!=='VOLUME'\)/);
 assert.match(src,/export function ClassicClassroomChart/);
 assert.match(tutor,/import \{ClassicClassroomChart\} from '\.\.\/prototype\/PrototypeExperiences'/);
 assert.match(tutor,/caseBars=\{REPLAY\.slice\(0,visible\)/);
 assert.match(tutor,/mode="talia" memberSafe=\{true\}/);
 assert.match(tutor,/if\(index>=visible\)return/);
 assert.match(studio,/showBarVolume=!showBarVolume;volumeState\(\);render\(\)/);
 assert.match(css,/\.cl-context-menu/);
 assert.match(css,/\.cx-context-menu/);
 assert.match(css,/\.tc-body \.tc-transcript/);
});
