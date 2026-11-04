/* Crownlight Scanner: original offline rule evaluator v1.
 * Never infer live data, trade authorization, or validated statistical edge.
 * Champion configuration signatures and Challenger thresholds are untouched.
 */
(function(root){
'use strict';
const FIELDS=Object.freeze({
 price:'Last',change_pct:'Daily % change',volume:'Shares volume',rvol:'Provided RVOL',
 float:'Reported float',spread_pct:'Provided spread %',gap_pct:'Gap %',
 market_cap:'Market cap',vwap:'Provided VWAP',trades:'Reported trades',
 change_5m_pct:'5-minute % change',change_2d_pct:'2-day % change',
 yesterday_volume:'Yesterday volume',prev_close:'Prior close',
 day_high:'Day high',day_low:'Day low',
 dollar_volume_proxy:'Last × volume research proxy',
 vwap_distance_pct:'Signed percent above supplied VWAP',
 price_below_high_pct:'Percent distance below supplied day high',
 bar_vwap_proxy:'HLC3 bar VWAP proxy (not trade VWAP)',
 ema_9:'SMA-seeded 9-bar EMA',ema_20:'SMA-seeded 20-bar EMA',
 ema_200:'SMA-seeded 200-bar EMA',rsi_14:'Wilder RSI 14',atr_14:'Wilder ATR 14'
});
const OPS=Object.freeze(['GT','GTE','LT','LTE','EQ','NE','BETWEEN']);
const required=['price','change_pct','volume','rvol','float','spread_pct'];
const number=x=>{
 if(typeof x==='number')return Number.isFinite(x)?x:null;
 if(typeof x!=='string'||!x.trim()||!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(x.trim()))return null;
 const n=Number(x);return Number.isFinite(n)?n:null;
};
const err=x=>Object.assign(new Error(x),{code:'SCANNER_RULE_INVALID'});
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function validate(input){
 let nodes=0,leaves=0;
 function visit(n,depth){
  if(!obj(n)||depth>4||++nodes>128)throw err('Invalid or excessively nested rule tree.');
  if(n.type==='group'){
   if(!['AND','OR'].includes(n.op)||!Array.isArray(n.children)||n.children.length<1||
      n.children.length>12||Object.keys(n).some(k=>!['type','op','children'].includes(k)))
    throw err('Groups require AND/OR and 1–12 children.');
   return {type:'group',op:n.op,children:n.children.map(x=>visit(x,depth+1))};
  }
  if(n.type==='not'){
   if(Object.keys(n).some(k=>!['type','child'].includes(k)))throw err('Invalid NOT.');
   return {type:'not',child:visit(n.child,depth+1)};
  }
  if(n.type!=='rule'||!Object.hasOwn(FIELDS,n.field)||!OPS.includes(n.op)||
     Object.keys(n).some(k=>!['type','field','op','value','maxValue','compareField'].includes(k)))
   throw err('Unsupported field/operator/attribute.');
  if(++leaves>40)throw err('Maximum 40 condition rules.');
  if(n.compareField!==undefined){
   if(!Object.hasOwn(FIELDS,n.compareField)||n.op==='BETWEEN'||
      n.value!==undefined||n.maxValue!==undefined)throw err('Invalid criteria comparison.');
   return {type:'rule',field:n.field,op:n.op,compareField:n.compareField};
  }
  const v=number(n.value);
  if(v===null)throw err('Finite comparison value required.');
  if(n.op==='BETWEEN'){
   const maxValue=number(n.maxValue);
   if(maxValue===null||v>maxValue)throw err('Invalid ordered BETWEEN bounds.');
   return {type:'rule',field:n.field,op:n.op,value:v,maxValue};
  }
  if(n.maxValue!==undefined)throw err('Unexpected upper bound.');
  return {type:'rule',field:n.field,op:n.op,value:v};
 }
 const out=visit(input,0);if(!leaves)throw err('Empty expression.');return out;
}
function read(row,key){
 if(key==='dollar_volume_proxy'){
  const a=number(row.price),b=number(row.volume);
  return a!==null&&a>0&&b!==null&&b>=0?a*b:null;
 }
 if(key==='vwap_distance_pct'){
  const a=number(row.price),b=number(row.vwap);
  return a!==null&&a>0&&b!==null&&b>0?(a-b)/b*100:null;
 }
 if(key==='price_below_high_pct'){
  const a=number(row.price),b=number(row.day_high);
  return a!==null&&a>0&&b!==null&&b>0&&a<=b?(b-a)/b*100:null;
 }
 return Object.hasOwn(row,key)?number(row[key]):null;
}
// Tri-state semantics: unknown stays unknown even under NOT.
function evaluate(n,row){
 if(n.type==='rule'){
  const a=read(row,n.field),b=n.compareField===undefined?n.value:read(row,n.compareField);
  if(a===null||b===null)return null;
  switch(n.op){
   case 'GT':return a>b;case 'GTE':return a>=b;
   case 'LT':return a<b;case 'LTE':return a<=b;
   case 'EQ':return a===b;case 'NE':return a!==b;
   case 'BETWEEN':return a>=b&&a<=n.maxValue;
  }
  return null;
 }
 if(n.type==='not'){
  const x=evaluate(n.child,row);return x===null?null:!x;
 }
 let unknown=false;
 for(const child of n.children){
  const x=evaluate(child,row);
  if(n.op==='AND'&&x===false)return false;
  if(n.op==='OR'&&x===true)return true;
  if(x===null)unknown=true;
 }
 return unknown?null:n.op==='AND';
}
function validRow(row,allowSparse=false){
 if(!obj(row)||!/^[A-Z][A-Z0-9.-]{0,11}$/.test(String(row.symbol||'').trim().toUpperCase()))
  return false;
 // A ticker, a positive observed price and nonnegative reported shares are
 // mandatory in both modes. The old seven-field contract remains the default.
 if(read(row,'price')===null||read(row,'price')<=0||
    read(row,'volume')===null||read(row,'volume')<0)return false;
 if(!allowSparse)return required.every(k=>read(row,k)!==null)&&
  read(row,'rvol')>=0&&read(row,'float')>0&&read(row,'spread_pct')>=0;
 // Omitted optional fields are UNKNOWN when the rule actually needs them.
 // A supplied but malformed value is rejected, never converted to 0.
 const positive=['float','market_cap','vwap','prev_close','day_high','day_low'];
 const nonnegative=['rvol','spread_pct','trades','yesterday_volume'];
 for(const field of Object.keys(FIELDS)){
  if(!Object.hasOwn(row,field)||row[field]===null||row[field]==='')continue;
  const n=read(row,field);
  if(n===null||(positive.includes(field)&&n<=0)||
     (nonnegative.includes(field)&&n<0))return false;
 }
 const high=read(row,'day_high'),low=read(row,'day_low');
 if(high!==null&&low!==null&&low>high)return false;
 if(high!==null&&read(row,'price')>high)return false;
 return true;
}
const DEFAULT_COLUMNS=Object.freeze(['price','change_pct','volume','rvol','float','spread_pct','trades','vwap_distance_pct']);
function validateView(opt={}){
 if(!obj(opt))throw err('Invalid results view.');
 const sort=opt.sort===undefined?'change_pct':opt.sort;
 const descending=opt.descending===undefined?true:opt.descending;
 const secondarySort=opt.secondarySort===undefined?null:opt.secondarySort;
 const secondaryDescending=opt.secondaryDescending===undefined?true:opt.secondaryDescending;
 const limit=opt.limit===undefined?100:opt.limit;
 const columns=opt.columns===undefined?Array.from(DEFAULT_COLUMNS):opt.columns;
 if(!Object.hasOwn(FIELDS,sort)||typeof descending!=='boolean'||
    (secondarySort!==null&&(!Object.hasOwn(FIELDS,secondarySort)||secondarySort===sort))||
    typeof secondaryDescending!=='boolean'||
    !Number.isInteger(limit)||limit<1||limit>100||!Array.isArray(columns)||
    columns.length<1||columns.length>12||
    columns.some(x=>typeof x!=='string'||!Object.hasOwn(FIELDS,x))||
    new Set(columns).size!==columns.length)
  throw err('Invalid scanner results columns or sort settings.');
 return {sort,descending,secondarySort,secondaryDescending,limit,columns:columns.slice()};
}
function explain(tree,row){
 const expression=validate(tree);
 const details=[];
 function walk(n,path){
  if(n.type==='rule'){
   const left=read(row,n.field);
   const right=n.compareField===undefined?n.value:read(row,n.compareField);
   details.push({path,field:n.field,op:n.op,observed:left,
    comparisonField:n.compareField||null,target:right,upper:n.op==='BETWEEN'?n.maxValue:null,
    result:evaluate(n,row)===null?'UNKNOWN':evaluate(n,row)?'PASS':'FAIL'});
   return;
  }
  if(n.type==='not'){walk(n.child,path+'/NOT');return;}
  n.children.forEach((child,i)=>walk(child,path+'/'+n.op+'/'+(i+1)));
 }
 walk(expression,'root');
 return {outcome:evaluate(expression,row)===null?'UNKNOWN':evaluate(expression,row)?'PASS':'FAIL',
  details,liveMarketEvidence:false};
}
function analyze(rows,tree,opt={}){
 if(!Array.isArray(rows)||rows.length>2000)throw err('Invalid input or >2,000 records.');
 const expression=validate(tree),view=validateView(opt);
 const sparseMode=opt.allowSparse===true;
 const hits=[],seen=new Set(),reject={invalidInput:0,duplicateTicker:0,missingEvidence:0,failedRule:0};
 for(const row of rows){
  if(!validRow(row,sparseMode)){reject.invalidInput++;continue;}
  const symbol=String(row.symbol).trim().toUpperCase();
  if(seen.has(symbol)){reject.duplicateTicker++;continue;}seen.add(symbol);
  const match=evaluate(expression,row);
  if(match===null){reject.missingEvidence++;continue;}
  if(match===false){reject.failedRule++;continue;}
  hits.push({symbol,row});
 }
 function cmp(a,b,key,descending){
  const x=read(a.row,key),y=read(b.row,key);
  if(x===null&&y!==null)return 1;
  if(y===null&&x!==null)return -1;
  if(x!==null&&y!==null&&x!==y)return descending?y-x:x-y;
  return 0;
 }
 hits.sort((a,b)=>{
  const primary=cmp(a,b,view.sort,view.descending);if(primary)return primary;
  if(view.secondarySort){
   const secondary=cmp(a,b,view.secondarySort,view.secondaryDescending);
   if(secondary)return secondary;
  }
  return a.symbol.localeCompare(b.symbol);
 });
 return {inspected:rows.length,matched:hits.length,rejections:reject,
  rows:hits.slice(0,view.limit).map(x=>{
   const fields=[...new Set([...DEFAULT_COLUMNS,...view.columns])];
   const result={symbol:x.symbol};
   for(const field of fields)result[field]=read(x.row,field);
   result.ruleTrail=explain(expression,x.row);
   return result;
  }),
  expression,...view,liveFeed:false,tradeAuthorization:false,
  statisticalEdge:false,sourceStatus:'UNVERIFIED_MEMBER_IMPORTED_SNAPSHOT'};
}
root.CrownlightScannerRulesV1=Object.freeze({FIELDS,OPS,DEFAULT_COLUMNS,read,validate,validateView,evaluate,explain,analyze});
})(globalThis);
