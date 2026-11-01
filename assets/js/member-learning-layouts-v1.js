/* Crownlight live instructional layouts: presentation only, all teaching/auth from existing engines. */
(()=>{'use strict';
 const names={
 foundations:['Foundations Classroom','First principles and guided practice'],
 indicator:['Indicator Analysis Lab','Price, volume, calculations and study limitations'],
 replay:['Historical Replay Practice','Chronological evidence and no-lookahead reasoning'],
 tape:['Tape & Order-Flow Desk','Trades, quotations and market microstructure'],
 scanner:['Scanner + Watchlist Workshop','Research candidates and validated filters'],
 risk:['Risk & Execution Desk','Position sizing, invalidation and uncertainty'],
 filings:['SEC Filings Research Room','Issuer identity and original disclosures'],
 academy:['Boot Camp Mission Control','Established Academy programs and learning progress']
 };
 const programs={free5:'foundations',truth5:'foundations',foundations30:'foundations',charts45:'indicator',indicators10:'indicator',practicum90:'replay',tape10:'tape',scanners10:'scanner',watchlist7:'scanner',risk60:'risk',filings7:'filings'};
 const catalog=[['foundations','free5'],['indicator','indicators10'],['replay','practicum90'],['tape','tape10'],['scanner','scanners10'],['risk','risk60'],['filings','filings7'],['academy','']];
 const make=(tag,cl,t)=>{const el=document.createElement(tag);if(cl)el.className=cl;if(t!==undefined)el.textContent=t;return el};
 function head(kind,target,sections){
  target.querySelector('[data-cl-live-layout-head]')?.remove();
  const info=names[kind];if(!info)return;
  const box=make('section','cl-live-learning-head');box.dataset.clLiveLayoutHead='true';
  box.setAttribute('aria-label',info[0]+' learning room');
  const copy=make('div','cl-live-learning-copy');
  copy.append(make('p','cl-live-learning-kicker','ORIGINAL INSTRUCTION · EXISTING LEARNING ENGINE'),make('h2','',info[0]),make('p','',info[1]));
  const nav=make('nav','cl-live-learning-links');nav.setAttribute('aria-label','Go to current lesson sections');
  sections.forEach(([label,id])=>{const a=make('a','',label);a.href='#'+id;nav.append(a)});
  box.append(copy,nav);target.prepend(box);
 }
 function layout(kind){if(!names[kind])return;document.body.dataset.clLiveLayout=kind}
 function classifyLab({concept='',setup='',studies='',id=''}={}){
  const s=[concept,setup,studies,id].map(x=>String(x||'')).join(' ').toLowerCase();
  if(/filing|10-k|10-q|8-k|edgar|corporate action/.test(s))return 'filings';
  if(/level ii|time\s*(?:and|&)\s*sales|tape|order book|microstructure/.test(s))return 'tape';
  if(/scanner|watchlist|screener/.test(s))return 'scanner';
  if(/risk|position siz|slippage|execution|stop.loss|expectancy/.test(s))return 'risk';
  if(/replay|on.?demand|decision boundary/.test(s))return 'replay';
  if(/indicator|vwap|ema|rsi|macd|bollinger|fibonacci|moving average|\batr\b/.test(s))return 'indicator';
  return 'foundations';
 }
 function resetLab(){
  const el=document.getElementById('lab-player-content');
  el?.querySelector('[data-cl-live-layout-head]')?.remove();if(el)delete el.dataset.clLiveLayout;
  delete document.body.dataset.clLiveLayout;
 }
 function activateLab(meta){
  const el=document.getElementById('lab-player-content');
  if(!el)return false;
  // This is only invoked after the existing server-authorized mode check.
  const kind=classifyLab(meta||{});layout(kind);el.dataset.clLiveLayout=kind;
  head(kind,el,[['Talia','gu-v32-teaching-slot'],['Source references','gu-ws-study-source'],['Decision and review','gu-ws-member-workbench'],['Results','player-results']]);return true;
 }
 function resetAcademy(){
  const space=document.getElementById('academy-workspace');space?.querySelector('[data-cl-live-layout-head]')?.remove();
  if(space)delete space.dataset.clLiveLayout;
  delete document.body.dataset.clLiveLayout;
 }
 function academy(program){
  const kind=programs[program],el=document.getElementById('academy-workspace');
  if(!kind||!el||el.hidden||!document.getElementById('academy-course-title')?.textContent?.trim())return false;
  layout(kind);el.dataset.clLiveLayout=kind;
  head(kind,el,[['Lesson','academy-engine'],['Briefing','academy-objective'],['Related Labs','academy-related'],['Reflection','academy-reflection']]);
  document.getElementById('academy-related')?.closest('section')?.classList.add('cl-live-learning-related');
  return true;
 }
 function legacy(){
  const shell=document.getElementById('gu-bc-shell');if(!shell||shell.hidden)return false;
  layout('foundations');shell.dataset.clLiveLayout='foundations';
  let parent=shell.parentElement;if(!parent)return false;
  parent.querySelector('[data-cl-live-layout-head]')?.remove();
  const wrapper=make('div','cl-live-legacy-head');
  head('foundations',wrapper,[['Talia','gu-bc-guided'],['Evidence','gu-bc-source-case'],['Reflection','gu-bc-note']]);
  shell.before(wrapper);return true;
 }
 function mission(){
  const root=document.getElementById('academy-program-list');if(!root||root.querySelector('[data-cl-learning-catalog]'))return;
  const panel=make('section','cl-live-learning-catalog');panel.dataset.clLearningCatalog='true';
  panel.setAttribute('aria-label','Eight established learning layouts');
  panel.append(make('p','cl-live-learning-kicker','LIVE ACADEMY / ONE LEARNING ENGINE'),make('h3','',names.academy[0]));
  const nav=make('nav','cl-live-learning-catalog-grid');nav.setAttribute('aria-label','Choose a teaching layout');
  catalog.forEach(([kind,program],index)=>{
   const card=make('a','cl-live-learning-catalog-item');
   card.dataset.clCatalogLayout=kind;card.href=program?'bootcamp-academy.html?program='+encodeURIComponent(program):'bootcamp-academy.html#academy-programs';
   card.append(make('span','',String(index+1).padStart(2,'0')),make('strong','',names[kind][0]),make('small','',names[kind][1]));nav.append(card);
  });
  panel.append(nav);root.querySelector('h2')?.after(panel);
 }
 function init(){
  mission();
  const course=new URL(location.href).searchParams.get('program');
  const space=document.getElementById('academy-workspace');
  if(space&&course){const update=()=>{if(!space.hidden)academy(course)};new MutationObserver(update).observe(space,{attributes:true,attributeFilter:['hidden']});update();}
  const legacyShell=document.getElementById('gu-bc-shell');
  if(legacyShell){const update=()=>{if(!legacyShell.hidden)legacy()};new MutationObserver(update).observe(legacyShell,{attributes:true,attributeFilter:['hidden']});update();}
 }
 globalThis.CrownlightMemberLayoutsV1=Object.freeze({version:'1.1',programToLayout:programs,classifyLab,activateLab,resetLab,activateAcademy:academy,resetAcademy});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
