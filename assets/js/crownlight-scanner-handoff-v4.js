/* Crownlight Scanner Wave 4 — permitted, read-only member navigation.
 * Source observations, rules, credentials and member IDs are never passed
 * through the URL. Entitlements are enforced by the existing destination pages.
 */
(function(root){
'use strict';
const PATTERN=/^[A-Z][A-Z0-9.-]{0,11}$/;
function normalize(symbol){
 if(typeof symbol!=='string')return null;
 const value=symbol.trim().toUpperCase();
 return PATTERN.test(value)?value:null;
}
function links(symbol){
 const value=normalize(symbol);
 if(!value)throw Error('A valid research ticker is required.');
 return Object.freeze({
  watchlist:'advanced-tool.html?tool=WATCHLIST_WORKBENCH&scanner_symbol='+encodeURIComponent(value),
  talia:'talia-classroom.html',
  labs:'labs.html'
 });
}
function makeCell(doc,symbol){
 const cell=doc.createElement('td'),value=normalize(symbol);
 if(!value){cell.textContent='No valid ticker';return cell;}
 const nav=doc.createElement('nav');nav.className='cl-scanner-handoff';
 nav.setAttribute('aria-label','Research destinations for '+value);
 const paths=links(value);
 for(const [title,href] of [
  ['Research '+value+' in Watchlist',paths.watchlist],
  ['Study with Talia',paths.talia],
  ['Open Learning Labs',paths.labs]
 ]){
  const a=doc.createElement('a');a.href=href;a.className='cl-scanner-handoff-link';
  a.textContent=title;nav.append(a);
 }
 const message=doc.createElement('small');
 message.textContent='Ticker only. No saved research, market data, or entitlements transfer.';
 cell.append(nav,message);return cell;
}
function prefillAuthorizedWatchlist(doc,href){
 const params=new URL(href,'https://example.invalid').searchParams;
 if(params.get('tool')!=='WATCHLIST_WORKBENCH')return false;
 const ticker=normalize(params.get('scanner_symbol'));
 if(!ticker)return false;
 const access=doc.querySelector('#tool-content');
 if(!access||access.hidden)return false;
 const field=doc.querySelector('#w-ticker');
 if(!field)return false;
 if(field.value.trim())return true; // Never overwrite edited or restored research.
 field.value=ticker;
 const sec=doc.querySelector('#cl-sec-symbol');
 if(sec&&!sec.value.trim())sec.value=ticker;
 const notice=doc.createElement('p');notice.className='cl-scanner-context';
 notice.setAttribute('role','status');
 notice.textContent='Scanner supplied ticker '+ticker+' only. Verify issuer, original source, observation time and access rights. No record has been saved.';
 const panel=doc.querySelector('#w-free-bridge');
 if(panel)panel.append(notice);
 else field.insertAdjacentElement('afterend',notice);
 return true;
}
function boot(){
 if(!root.document||!root.location)return;
 let done=false;
 const target=root.document.querySelector('#tool-content');
 if(!target)return;
 const tryFill=()=>{if(!done)done=prefillAuthorizedWatchlist(root.document,root.location.href);};
 tryFill();
 if(done||typeof root.MutationObserver!=='function')return;
 const observer=new root.MutationObserver(()=>{tryFill();if(done)observer.disconnect();});
 observer.observe(target,{subtree:true,attributes:true,childList:true,attributeFilter:['hidden']});
 root.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
}
root.CrownlightScannerHandoffV4=Object.freeze({normalize,links,makeCell,prefillAuthorizedWatchlist});
if(root.document?.addEventListener)root.document.addEventListener('DOMContentLoaded',boot);
})(globalThis);
