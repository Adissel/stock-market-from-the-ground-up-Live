/* Authored fictional context and transaction-order investigations. No feed or persistence. */
(function(root){'use strict';
const core=root.CrownlightEvidenceCoreV1;
const freeze=Object.freeze;
const current=freeze({open:102,high:103,low:100.5,close:101.5});
const patterns=freeze({
 rising:freeze([{open:97,high:98,low:96.5,close:97.5,volume:180},
 {open:97.5,high:99,low:97.2,close:98.8,volume:230},
 {open:98.8,high:100.5,low:98.5,close:100.2,volume:260},
 {open:100.2,high:102.5,low:100,close:102,volume:290},{...current,volume:540}].map(freeze)),
 falling:freeze([{open:106,high:106.5,low:105,close:105.3,volume:220},
 {open:105.3,high:105.5,low:103.9,close:104.2,volume:255},
 {open:104.2,high:104.4,low:102.8,close:103.2,volume:335},
 {open:103.2,high:103.4,low:101.8,close:102,volume:415},{...current,volume:760}].map(freeze))
});
const paths=freeze({
 highFirst:freeze([100,103,99,101].map(price=>freeze({minute:0,price,shares:100}))),
 lowFirst:freeze([100,99,103,101].map(price=>freeze({minute:0,price,shares:100})))
});
function pattern(id,count){
 const cases=patterns[id];
 if(!cases||!Number.isSafeInteger(count)||count<0||count>cases.length)return null;
 const shown=cases.slice(0,count).map(v=>freeze({...v}));
 const done=count===cases.length;
 return freeze({caseId:id,revealed:count,total:cases.length,bars:freeze(shown),
  summary:done?freeze({current:core.candle(shown.at(-1)),priorChange:shown.at(-2).close-shown[0].open,
   lastVolume:shown.at(-1).volume}):null,
  limitation:'The last candle shape alone does not establish preceding trend or next price.'});
}
function wick(id,count){
 const path=paths[id];if(!path||!Number.isSafeInteger(count)||count<0||count>path.length)return null;
 const bars=core?.aggregate(path,count,1),weighted=core?.vwap(path,count);
 if(!bars||!weighted)return null;
 return freeze({caseId:id,revealed:count,total:path.length,
  prints:freeze(path.slice(0,count).map(t=>freeze({...t}))),
  bar:bars[0]||null,vwap:weighted.value,complete:count===path.length,
  limitation:'A completed wick identifies extremes but not the order in which they occurred.'});
}
const api=freeze({schema:'crownlight-evidence-scenarios-v1',pattern,wick});
root.CrownlightEvidenceScenariosV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
