/* Crownlight SEC evidence Wave 4 — read-only interpretation of the existing
 * authenticated SEC issuer response. No extra SEC requests or monitoring.
 */
(function(root){
'use strict';
function summarize(payload,symbol,asOf,forms){
 const engine=root.CrownlightSecEvidenceV1;
 if(!engine||typeof engine.assess!=='function')throw Error('SEC timing evaluator unavailable.');
 return Object.freeze({
  hours24:engine.assess(payload,symbol,asOf,{windowHours:24,...(forms===undefined?{}:{forms})}),
  hours72:engine.assess(payload,symbol,asOf,{windowHours:72,...(forms===undefined?{}:{forms})}),
  source:'SEC_EDGAR_PRIMARY',
  firstPublicDisseminationKnown:false,
  historicalTradingSignal:false
 });
}
function mount({host,payload,symbol,asOf}){
 if(!host||!host.ownerDocument)throw Error('Accessible research host is required.');
 const doc=host.ownerDocument,create=(tag,value)=>{
  const e=doc.createElement(tag);if(value!==undefined)e.textContent=value;return e;
 };
 const section=create('section');section.className='cl-scanner-sec-brief';
 section.setAttribute('aria-label','SEC acceptance-time research evidence');
 const heading=create('h3','SEC acceptance-time evidence — research only');
 const disclosure=create('p','24-hour and 72-hour windows use the SEC acceptance timestamp, not verified publication, press-release, or first-tradable time. No market signal is produced.');
 const label=create('label','Review window');
 const select=create('select');select.setAttribute('aria-label','SEC research lookback window');
 for(const hours of [24,72]){const o=create('option',String(hours)+' hours');o.value=String(hours);select.append(o);}
 label.append(select);
 const formLabel=create('label','Filing form');
 const formSelect=create('select');
 formSelect.setAttribute('aria-label','Filter official SEC filings by form type');
 for(const [code,name] of [
  ['','All common forms (8-K, 8-K/A, 10-Q, 10-K)'],
  ['8-K','8-K'],['8-K/A','8-K amendment'],['10-Q','10-Q'],['10-Q/A','10-Q amendment'],
  ['10-K','10-K'],['10-K/A','10-K amendment'],['S-1','S-1 registration'],
  ['S-1/A','S-1 amendment'],['SC 13D','Schedule 13D'],['SC 13G','Schedule 13G'],
  ['4','Form 4'],['DEF 14A','Proxy DEF 14A']
 ]){
  const o=create('option',name);o.value=code;formSelect.append(o);
 }
 formLabel.append(formSelect);
 const message=create('p');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 const table=create('table');const caption=create('caption','Official SEC accepted records, not a trade signal');table.append(caption);
 const header=create('tr');for(const name of ['Form','Accepted time (UTC)','Original SEC filing']){const th=create('th',name);th.scope='col';header.append(th);}
 const thead=create('thead');thead.append(header);table.append(thead);
 const body=create('tbody');table.append(body);
 const note=create('p','Unknown exact times and source verification failures are not treated as zero filings. Authentication and SEC fair-access limits remain enforced by the existing research endpoint.');
 section.append(heading,disclosure,label,formLabel,message,table,note);
 try{summarize(payload,symbol,asOf);}catch(e){
  message.textContent='Unable to verify SEC event chronology: '+(e.message||'unknown reason')+'.';table.hidden=true;host.append(section);return section;
 }
 function render(){
  let answer;
  try{
   const forms=formSelect.value?[formSelect.value]:undefined;
   const evaluations=summarize(payload,symbol,asOf,forms);
   answer=select.value==='72'?evaluations.hours72:evaluations.hours24;
  }catch{
   body.replaceChildren();
   table.hidden=true;
   message.textContent='Selected SEC filing evidence cannot be verified. No match has been established.';
   return;
  }
  body.replaceChildren();
  message.textContent=answer.match==='UNAVAILABLE'?'SEC evidence unavailable: '+answer.reason:
   answer.match+' · '+answer.acceptedFilings.length+' accepted filing(s) in selected lookback; '+
   answer.excluded.unknownTime+' missing exact times, '+answer.excluded.future+
   ' future, '+answer.excluded.invalid+' invalid, '+answer.excluded.outsideWindow+' outside the window.';
  table.hidden=answer.acceptedFilings.length===0;
  const safe=root.CrownlightSecEvidenceV1.safeFilingUrl;
  for(const f of answer.acceptedFilings){
   const row=create('tr');row.append(create('td',f.form),create('td',f.acceptedAt));
   const cell=create('td');
   if(safe(f.sourceUrl,answer.cik,f.accession)){
    const link=create('a','Open verified SEC archive');link.href=f.sourceUrl;
    link.rel='noopener noreferrer';link.target='_blank';cell.append(link);
   }else cell.textContent='Source path not verified';
   row.append(cell);body.append(row);
  }
 }
 select.addEventListener('change',render);formSelect.addEventListener('change',render);render();host.append(section);return section;
}
root.CrownlightScannerSecBriefV4=Object.freeze({summarize,mount});
})(globalThis);
