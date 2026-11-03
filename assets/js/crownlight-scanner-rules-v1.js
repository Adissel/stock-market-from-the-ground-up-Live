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
 price_below_high_pct:'Percent distance below supplied day high'
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
function validRow(row){
 if(!obj(row)||!/^[A-Z][A-Z0-9.-]{0,11}$/.test(String(row.symbol||'').trim().toUpperCase()))
  return false;
 if(required.some(k=>read(row,k)===null))return false;
 return read(row,'price')>0&&read(row,'volume')>=0&&read(row,'rvol')>=0&&
  read(row,'float')>0&&read(row,'spread_pct')>=0;
}
function analyze(rows,tree,opt={}){
 if(!Array.isArray(rows)||rows.length>2000||!obj(opt))throw err('Invalid input or >2,000 records.');
 const expression=validate(tree);
 const sort=opt.sort===undefined?'change_pct':opt.sort;
 const descending=opt.descending===undefined?true:opt.descending;
 const limit=opt.limit===undefined?100:opt.limit;
 if(!Object.hasOwn(FIELDS,sort)||typeof descending!=='boolean'||
    !Number.isInteger(limit)||limit<1||limit>100)throw err('Invalid sort or result limit.');
 const hits=[],seen=new Set(),reject={invalidInput:0,duplicateTicker:0,missingEvidence:0,failedRule:0};
 for(const row of rows){
  if(!validRow(row)){reject.invalidInput++;continue;}
  const symbol=String(row.symbol).trim().toUpperCase();
  if(seen.has(symbol)){reject.duplicateTicker++;continue;}seen.add(symbol);
  const match=evaluate(expression,row);
  if(match===null){reject.missingEvidence++;continue;}
  if(match===false){reject.failedRule++;continue;}
  hits.push({symbol,row});
 }
 hits.sort((a,b)=>{
  const x=read(a.row,sort),y=read(b.row,sort);
  if(x===null)return y===null?a.symbol.localeCompare(b.symbol):1;
  if(y===null)return -1;
  return x!==y?(descending?y-x:x-y):a.symbol.localeCompare(b.symbol);
 });
 return {inspected:rows.length,matched:hits.length,rejections:reject,
  rows:hits.slice(0,limit).map(x=>({symbol:x.symbol,price:read(x.row,'price'),
   change_pct:read(x.row,'change_pct'),volume:read(x.row,'volume'),
   rvol:read(x.row,'rvol'),float:read(x.row,'float'),
   spread_pct:read(x.row,'spread_pct'),trades:read(x.row,'trades'),
   vwap_distance_pct:read(x.row,'vwap_distance_pct')})),
  expression,sort,descending,limit,liveFeed:false,tradeAuthorization:false,
  statisticalEdge:false,sourceStatus:'UNVERIFIED_MEMBER_IMPORTED_SNAPSHOT'};
}
root.CrownlightScannerRulesV1=Object.freeze({FIELDS,OPS,read,validate,evaluate,analyze});
})(globalThis);
