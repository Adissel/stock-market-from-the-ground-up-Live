/* Crownlight chart context menu: full available indicator catalog + tier-aware UI.
 * Uses the existing server-verified Chart Studio tier status. No auth writes,
 * premium entitlement grants, chart data downloads, member data, or billing.
 */
(function(root){'use strict';
const entries=[
 ['EMA','Exponential Moving Average','STANDARD',[9,20,200],'period','price'],
 ['SMA','Simple Moving Average','ADVANCED',[20,50,200],'period','price'],
 ['VWAP','Session HLC3 VWAP estimate','STANDARD',[],'source','bar'],
 ['RSI','Relative Strength Index','ADVANCED',[7,14,21],'period','price'],
 ['MACD','Moving Average Convergence Divergence','ADVANCED',[],'macd','price'],
 ['BB','Bollinger Bands','ADVANCED',[20],'bollinger','price'],
 ['ATR','Average True Range','ADVANCED',[14,21],'period','none'],
 ['VOL_SMA','Volume Moving Average','ADVANCED',[20,50],'period','none'],
 ['PMH','Observed Premarket High','ADVANCED',[],'appearance','none'],
 ['PML','Observed Premarket Low','ADVANCED',[],'appearance','none'],
 ['HOD','Observed High of Day','ADVANCED',[],'appearance','none'],
 ['LOD','Observed Low of Day','ADVANCED',[],'appearance','none'],
 ['PDH','Previous Observed Day High','ADVANCED',[],'appearance','none'],
 ['PDL','Previous Observed Day Low','ADVANCED',[],'appearance','none'],
 ['ORH','Observed Opening Range High','ADVANCED',[5,15,30],'opening','none'],
 ['ORL','Observed Opening Range Low','ADVANCED',[5,15,30],'opening','none'],
 ['STRUCTURE','Confirmed HH / HL / LH / LL pivots','ADVANCED',[2,3],'structure','none']
];
const CATALOG=Object.freeze(entries.map(([type,label,tier,presets,controls,source])=>Object.freeze({
 type,label,tier,presets:Object.freeze(presets),controls,source
})));
const map=Object.freeze(Object.fromEntries(CATALOG.map(x=>[x.type,x])));
const colors=['#b49aff','#37ddf6','#f7c76a','#46edbc','#fb7185','#ffb65b'];
const supportedSources=Object.freeze(['close','open','high','low','hl2','hlc3','ohlc4']);
const colorOk=x=>typeof x==='string'&&/^#[0-9a-fA-F]{6}$/.test(x);
const validInt=(value,min,max,fallback)=>Number.isInteger(value)&&value>=min&&value<=max?value:fallback;
function allowed(type,status){
 const info=map[type];if(!info)return false;
 if(info.tier==='STANDARD')return true;
 if(status?.verified!==true||!Array.isArray(status.allowed)||!status.allowed.includes('ADVANCED'))return false;
 const expiry=Date.parse(status.accessExpiry||'');
 if(status.accessExpiry&&Number.isFinite(expiry)&&expiry<=Date.now())return false;
 return true;
}
function explanation(type,status){
 const info=map[type];if(!info)return 'Unsupported indicator.';
 return allowed(type,status)?'Included in your verified Chart Studio access.':
  'Locked · '+info.tier+' Chart Studio access required. Membership, eligible upgrade, or active Lumens pass may provide access. No access is granted by this menu.';
}
function normalize(input){
 const info=map[input?.type];if(!info)return null;
 const original=input||{};
 const noPeriod=['source','appearance','macd'].includes(info.controls);
 const period=noPeriod?1:validInt(original.period,
  info.controls==='structure'?1:info.controls==='opening'?1:2,
  info.controls==='structure'?5:info.controls==='opening'?60:200,
  info.controls==='structure'?2:info.controls==='opening'?5:info.type==='EMA'?20:14);
 const fast=validInt(original.fast,2,99,12);
 let slow=validInt(original.slow,3,200,26);
 if(slow<=fast)slow=fast+1;
 const signal=validInt(original.signal,2,100,9);
 const multiplier=typeof original.multiplier==='number'&&Number.isFinite(original.multiplier)&&
  original.multiplier>=.5&&original.multiplier<=5?original.multiplier:2;
 const priceSource=supportedSources.includes(original.priceSource)?original.priceSource:
  info.type==='VWAP'?'hlc3':'close';
 return Object.freeze({
  id:typeof original.id==='string'&&/^[A-Za-z0-9_-]{1,32}$/.test(original.id)?original.id:'',
  type:info.type,period,fast,slow,signal,multiplier,priceSource,
  color:colorOk(original.color)?original.color.toLowerCase():colors[CATALOG.indexOf(info)%colors.length],
  width:validInt(original.width,1,4,2),
  lineStyle:['solid','dashed','dotted'].includes(original.lineStyle)?original.lineStyle:'solid'
 });
}
function mount({shell,plot,trigger,drawingTrigger,getStatus,onAdd,onCustom,onManage,onAppearance,onLevel,onDrawing}={}){
 if(!shell||!plot||typeof plot.addEventListener!=='function'||typeof onAdd!=='function')return null;
 const doc=shell.ownerDocument||root.document;
 const el=(tag,label,cls)=>{const x=doc.createElement(tag);if(label!==undefined)x.textContent=label;if(cls)x.className=cls;return x};
 const btn=(label,callback)=>{const x=el('button',label);x.type='button';x.setAttribute('role','menuitem');x.addEventListener('click',callback);return x};
 const menu=el('section',undefined,'cl-context-menu');menu.hidden=true;menu.setAttribute('role','menu');
 menu.setAttribute('aria-label','Crownlight chart context menu');
 const primary=el('div',undefined,'cl-context-column');
 const secondary=el('div',undefined,'cl-context-column cl-context-catalog');secondary.hidden=true;
 const tertiary=el('div',undefined,'cl-context-column cl-context-options');tertiary.hidden=true;
 const announcement=el('p','Right-click the plot or use Chart menu.','cl-context-feedback');
 announcement.setAttribute('role','status');announcement.setAttribute('aria-live','polite');
 menu.append(primary,secondary,tertiary,announcement);
 const menuTitle=el('strong','CROWNLIGHT / CHART MENU','cl-context-title');primary.append(menuTitle);
 let disposed=false,selectedType='',currentTab='';
 const status=()=>typeof getStatus==='function'?getStatus():null;
 const tell=message=>{announcement.textContent=message};
 function close(){menu.hidden=true;selectedType='';secondary.hidden=true;tertiary.hidden=true}
 function open(x,y,tab=''){
  if(disposed)return;
  currentTab=tab;menu.hidden=false;
  secondary.hidden=true;tertiary.hidden=true;selectedType='';
  menu.style.left='8px';menu.style.top='8px';
  if(tab==='indicators')showIndicators();
  else if(tab==='drawings')showDrawings();
  const vw=root.innerWidth||doc.documentElement.clientWidth||1024;
  const vh=root.innerHeight||doc.documentElement.clientHeight||768;
  // Respect actual rendered width rather than placing a flyout outside the viewport.
  menu.style.left=Math.max(8,Math.min(x,vw-menu.offsetWidth-8))+'px';
  menu.style.top=Math.max(8,Math.min(y,vh-Math.min(menu.offsetHeight,vh-16)-8))+'px';
  const start=primary.querySelector('button');start?.focus();
 }
 function showIndicators(){
  currentTab='indicators';secondary.hidden=false;tertiary.hidden=true;secondary.replaceChildren();
  secondary.append(el('strong','All 17 indicator studies','cl-context-title'));
  for(const item of CATALOG){
   const permitted=allowed(item.type,status());
   const itemButton=btn(item.label+(permitted?'':' · Locked · '+item.tier),()=>{
    showPreset(item.type);
    if(!permitted)tell(explanation(item.type,status()));
   });
   itemButton.dataset.indicator=item.type;
   itemButton.setAttribute('aria-haspopup','menu');
   itemButton.setAttribute('aria-disabled',String(!permitted));
   itemButton.setAttribute('title',explanation(item.type,status()));
   itemButton.addEventListener('mouseenter',()=>showPreset(item.type));
   itemButton.addEventListener('focus',()=>showPreset(item.type));
   secondary.append(itemButton);
  }
  tell('All indicators appear here. Locked studies require verified tier access.');
 }
 function showPreset(type){
  const item=map[type];if(!item)return;
  selectedType=type;tertiary.hidden=false;tertiary.replaceChildren();
  tertiary.append(el('strong',item.label,'cl-context-title'));
  const isEnabled=allowed(type,status());
  if(!isEnabled)tertiary.append(el('p',explanation(type,status()),'cl-context-locked'));
  const choices=item.presets.length?item.presets:[null];
  for(const preset of choices){
   const label=preset===null?'Add '+item.label:item.type+' '+preset;
   const action=btn(label,()=>{
    if(!allowed(type,status())){tell(explanation(type,status()));return}
    const result=onAdd(type,preset);
    if(result===false){tell('Could not add the indicator. Check chart data, permissions, and the 18-study limit.');return}
    close();
   });
   action.setAttribute('aria-disabled',String(!isEnabled));tertiary.append(action);
  }
  const customize=btn('Custom settings · period, source, color, style…',()=>{
   if(!allowed(type,status())){tell(explanation(type,status()));return}
   const result=onCustom?.(type);
   if(result===false){tell('Custom settings could not be opened.');return}
   close();
  });
  customize.setAttribute('aria-disabled',String(!isEnabled));
  tertiary.append(customize);
  tertiary.append(el('p','Only completed revealed candles are calculated. Unavailable warmups remain missing.','cl-context-note'));
 }
 function showDrawings(){
  currentTab='drawings';secondary.hidden=false;tertiary.hidden=true;secondary.replaceChildren();
  secondary.append(el('strong','Drawing controls','cl-context-title'));
  for(const [tool,label,tier] of [['level','Horizontal price level','STANDARD'],
   ['segment','Trendline','ADVANCED'],['horizontalStraightLine','Extended horizontal line','ADVANCED'],
   ['fibonacciLine','Fibonacci levels','ADVANCED']]){
   const granted=tier==='STANDARD'||allowed('STRUCTURE',status());
   const x=btn(label+(granted?'':' · Locked · '+tier),()=>{
    if(!granted){tell('Locked · '+tier+' Studio access required for this drawing.');return}
    if(tool==='level'){onLevel?.();close();return}
    if(onDrawing?.(tool)===false){tell('Select an active Advanced or Professional chart to place this drawing.');return}
    close();
   });x.setAttribute('aria-disabled',String(!granted));secondary.append(x);
  }
  tell('Advanced drawings require verified access and an active enhanced chart. Saved drawings stay tied to their original chart data.');
 }
 const indicatorButton=btn('Indicators · all supported studies',showIndicators);
 const drawingButton=btn('Drawings',showDrawings);
 indicatorButton.addEventListener('mouseenter',showIndicators);
 drawingButton.addEventListener('mouseenter',showDrawings);
 primary.append(indicatorButton,drawingButton,
  btn('Manage indicators and line colors',()=>{close();onManage?.()}),
  btn('Chart appearance',()=>{close();onAppearance?.()}),
  btn('Close menu',close));
 function onContext(event){event.preventDefault();open(event.clientX,event.clientY)}
 function onMainClick(){const r=trigger?.getBoundingClientRect?.()||{left:12,bottom:48};open(r.left,r.bottom+5,'indicators')}
 function onDrawClick(){const r=drawingTrigger?.getBoundingClientRect?.()||{left:12,bottom:48};open(r.left,r.bottom+5,'drawings')}
 function outside(event){if(!menu.hidden&&!menu.contains(event.target)&&event.target!==trigger&&event.target!==drawingTrigger)close()}
 function keyboard(event){
  if(menu.hidden)return;
  if(event.key==='Escape'){event.preventDefault();close();trigger?.focus();return}
  if(event.key==='ArrowRight'){
   if(doc.activeElement===indicatorButton){showIndicators();secondary.querySelector('button')?.focus();event.preventDefault()}
   else if(doc.activeElement===drawingButton){showDrawings();secondary.querySelector('button')?.focus();event.preventDefault()}
   else if(secondary.contains(doc.activeElement)){showPreset(doc.activeElement.dataset.indicator);tertiary.querySelector('button')?.focus();event.preventDefault()}
  }
  if(event.key==='ArrowLeft'){
   if(tertiary.contains(doc.activeElement)){secondary.querySelector('[data-indicator="'+selectedType+'"]')?.focus();event.preventDefault()}
   else if(secondary.contains(doc.activeElement)){indicatorButton.focus();event.preventDefault()}
  }
  if(['ArrowDown','ArrowUp'].includes(event.key)){
   const panel=tertiary.contains(doc.activeElement)?tertiary:secondary.contains(doc.activeElement)?secondary:primary;
   const children=[...panel.querySelectorAll('button')].filter(x=>!x.hidden);
   const index=children.indexOf(doc.activeElement),delta=event.key==='ArrowDown'?1:-1;
   if(children.length){children[(index+delta+children.length)%children.length].focus();event.preventDefault()}
  }
 }
 shell.append(menu);
 plot.addEventListener('contextmenu',onContext);
 trigger?.addEventListener('click',onMainClick);
 drawingTrigger?.addEventListener('click',onDrawClick);
 doc.addEventListener('pointerdown',outside,true);
 menu.addEventListener('keydown',keyboard);
 return Object.freeze({open,close,refresh(){if(menu.hidden)return;if(currentTab==='drawings')showDrawings();else if(currentTab==='indicators')showIndicators()},
 dispose(){if(disposed)return;disposed=true;close();plot.removeEventListener('contextmenu',onContext);
  trigger?.removeEventListener('click',onMainClick);drawingTrigger?.removeEventListener('click',onDrawClick);
  doc.removeEventListener('pointerdown',outside,true);menu.remove()}});
}
const api=Object.freeze({version:'1.0.0',catalog:CATALOG,allowed,explanation,normalize,mount});
root.CrownlightChartContextMenuV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
