/* Original SEC chronology research view. Existing authenticated issuer API only.
 * No background requests, new permissions, live quotes, trade signals or storage.
 */
(function(root){'use strict';
const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
function mount({host,response,symbol,sessionValid}={}){
 const engine=root.CrownlightSecEvidenceV1;
 if(!host||!engine||typeof sessionValid!=='function')throw Error('Authorized issuer research dependencies unavailable.');
 if(host.querySelector('#cl-sec-acceptance-evidence'))return;
 const section=make('section');section.id='cl-sec-acceptance-evidence';
 section.className='v11-workbench-panel';section.setAttribute('aria-label','SEC acceptance chronology research');
 const heading=make('h3','SEC filing acceptance — not a catalyst alert');
 const intro=make('p','One verified issuer at a time. SEC acceptance is not first public dissemination, a market forecast or a trading opportunity. No live market feed.');intro.className='small';
 const label=make('label','Retrospective acceptance window');
 const select=make('select');select.setAttribute('aria-label','SEC acceptance lookback window');
 for(const [value,name] of [['24','Previous 24 hours'],['72','Previous 72 hours']]){
  const option=make('option',name);option.value=value;select.append(option);
 }
 label.append(select);
 const status=make('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const evidence=make('div'),teaching=make('div');
 const lesson=root.GroundUpWatchlistLearningV3?.forStage?.('RESEARCH');
 if(lesson)teaching.append(make('h4','Talia: '+lesson.topic),make('p','Objective: '+lesson.objective),
   make('p','Investigate: '+lesson.exercise),make('p','Common mistake: '+lesson.mistake));
 section.append(heading,intro,label,status,evidence,teaching);host.append(section);
 let serial=0;
 async function refresh(){
  const token=++serial;evidence.replaceChildren();
  status.textContent='Rechecking account access before evaluating issuer evidence…';
  try{
   const valid=await sessionValid();
   if(token!==serial)return;
   if(!valid||!host.isConnected)throw Error('Account access changed. Reload the SEC issuer research.');
   const report=engine.assess(response,symbol,new Date().toISOString(),{windowHours:Number(select.value)});
   const messages={
    UNAVAILABLE:'Current SEC issuer evidence cannot be verified.',
    INSUFFICIENT_EVENT_TIME:'Exact SEC acceptance evidence is incomplete. Unknown does not mean zero.',
    NO_SEC_ACCEPTANCE_IN_WINDOW:'No qualifying acceptance in supplied recent issuer records; this is not proof of absence.',
    SEC_ACCEPTED_IN_WINDOW:'Verified SEC acceptance records found; not necessarily market-moving catalysts.'
   };
   status.textContent=(messages[report.match]||'SEC evidence unavailable.')+' Evaluation: '+(report.asOf||'time unknown')+'.';
   if(report.acceptedFilings.length){
    const ul=make('ul');
    for(const item of report.acceptedFilings){
     const li=make('li',item.form+' · Accepted '+item.acceptedAt+' · Filed '+item.filedDate+' · ');
     const anchor=make('a','Original SEC filing');anchor.href=item.sourceUrl;anchor.target='_blank';anchor.rel='noopener noreferrer';li.append(anchor);ul.append(li);
    }
    evidence.append(ul);
   }
   evidence.append(make('p','Excluded records: '+report.excluded.unknownTime+' unknown time; '+
    report.excluded.future+' later than the decision/source observation; '+report.excluded.outsideWindow+
    ' outside the window; '+report.excluded.invalid+' invalid provenance. Not certified for historical replay or brokerage execution.'));
  }catch(err){evidence.replaceChildren();status.textContent=err?.message||'Issuer research unavailable.'}
 }
 select.addEventListener('change',refresh);refresh();
 return Object.freeze({element:section,refresh});
}
root.CrownlightScannerSecResearchViewV1=Object.freeze({mount});
})(globalThis);
