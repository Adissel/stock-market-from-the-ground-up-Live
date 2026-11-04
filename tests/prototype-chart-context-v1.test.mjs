import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const tsx=readFileSync('src/prototype/PrototypeExperiences.tsx','utf8');
const css=readFileSync('assets/css/prototype-chart-context-v1.css','utf8');
const html=readFileSync('prototype.html','utf8');
test('owner prototype React ECharts chart now handles right click directly',()=>{
 assert.match(tsx,/onContextMenuCapture=\{e=>/);
 assert.match(tsx,/target\.closest\('\.cx-chart-grabbable,\.cx-home-shared-market'\)/);
 assert.match(tsx,/e\.preventDefault\(\);openChartMenu\(e\.clientX,e\.clientY\)/);
 assert.match(tsx,/createPortal\(<div ref=\{box\} className="cx-context-menu"/);
 assert.match(tsx,/document\.body\)/);
});
test('three prototype pages and classroom charts share one full catalog',()=>{
 assert.match(tsx,/function PrototypeChartContextMenu/);
 assert.match(tsx,/specs\.map\(item=><button/);
 assert.match(tsx,/All 16 computed prototype chart studies/);
 for(const id of ['EMA_FAST','EMA_SLOW','EMA_200','SMA','VWAP','BB','HOD','LOD','OR','STRUCTURE','VOLUME','VOLMA','RSI','MACD','ATR','OBV'])
  assert(tsx.includes("'"+id+"'"),id);
 assert.match(tsx,/studio=\{studio\} prefs=\{indicatorPrefs\}/);
});
test('settings, quick EMA periods, line color/style and preview tier locks remain functional',()=>{
 assert.match(tsx,/\[9,20,200\]\.map\(period/);
 assert.match(tsx,/prefs\.setEnabled\(id,true\);close\(\)/);
 assert.match(tsx,/prefs\.setSettings\(study\.setting,period\)/);
 assert.match(tsx,/prefs\.setSettings\(key,Math\.max/);
 assert.match(tsx,/setAppearance\(a=>\(\{\.\.\.a,colors:/);
 assert.match(tsx,/setAppearance\(a=>\(\{\.\.\.a,types:/);
 assert.match(tsx,/studyAllowed\(studio,selected\.id\)/);
 assert.match(tsx,/This design preview never grants membership access/);
 assert.match(tsx,/Drawing adapter not yet connected/);
});
test('visible mobile and keyboard alternative in the actual price chart header',()=>{
 assert.match(tsx,/aria-label="Open chart indicator context menu"/);
 assert.match(tsx,/aria-label="Open chart drawing controls"/);
 assert.match(tsx,/document\.addEventListener\('keydown',key\)/);
 assert.match(tsx,/event\.key==='Escape'/);
 assert.match(tsx,/onMouseEnter=\{\(\)=>setMenu/);
 assert.match(tsx,/onFocus=\{\(\)=>setMenu/);
 assert(html.includes('prototype-chart-context-v1.css'));
 assert(css.includes('z-index:2147483000'));
 assert(css.includes('max-width:620px'));
});
test('prototype menu is isolated from simulator and contains no new entitlement, billing or grading call',()=>{
 const block=tsx.split('function PrototypeChartContextMenu(')[1].split('function IndicatorDock()')[0];
 for(const pattern of ['fetch(', 'localStorage', 'stripe', 'service_role', 'supabase', 'innerHTML', 'eval(', 'new Function('])
  assert(!block.includes(pattern),pattern);
 assert.match(tsx,/INTERNAL · FICTIONAL · READ ONLY/);
});
