/* Owner-only roadmap view. Read-only, source-linked, no entitlement changes.
 * It is called only after /api/owner-roadmap authenticated OWNER GET succeeds.
 */
(()=>{'use strict';
 function render(snapshot){
  const host=document.getElementById('or-november-content');
  if(!host)return;
  host.replaceChildren();
  if(!snapshot||snapshot.scope!=='owner_private_evidence_snapshot'||!Array.isArray(snapshot.metrics)||
     !Array.isArray(snapshot.gates)||snapshot.gates.length!==10){
   host.textContent='Current acceptance records are unavailable. No release status is inferred.';return;
  }
  const el=(tag,text,className)=>{
   const n=document.createElement(tag);if(className)n.className=className;
   if(text!==undefined)n.textContent=String(text);return n;
  };
  host.append(el('p',snapshot.disclaimer,'or-muted'),
   el('p','Evidence date: '+snapshot.asOf+' · Version '+snapshot.version+
   ' · Prior saved Owner progress and historical 2,190 requirements are preserved.','or-now-notice'));
  host.append(el('h3','Documented instructional and release baselines'));
  const cards=el('div',undefined,'or-now-metrics');
  for(const metric of snapshot.metrics){
   const card=el('article',undefined,'or-now-metric');
   card.dataset.state=metric.state||'open';
   card.append(el('span',metric.label,'or-now-label'),el('strong',metric.value,'or-now-value'),
               el('p',metric.unit,'or-muted'));
   if(Number.isFinite(metric.percent)){
    const outer=el('div',undefined,'or-now-meter'),inner=el('span');
    outer.setAttribute('role','img');
    outer.setAttribute('aria-label',metric.label+': '+metric.percent.toFixed(2)+' percent of its own specified denominator');
    inner.style.width=Math.max(0,Math.min(100,metric.percent))+'%';outer.append(inner);card.append(outer);
   }
   cards.append(card);
  }
  host.append(cards);
  const e=snapshot.engines||{};
  host.append(el('h3','Membership edition targets — not product activation'),
              el('p',[e.sourceLearning,e.sourceLab,e.sourceTutor].filter(Boolean).join(' · '),'or-muted'),
              el('p',e.note,'or-now-notice'));
  const scroll=el('div',undefined,'or-now-scroll'),table=el('table',undefined,'or-now-table');
  scroll.setAttribute('tabindex','0');scroll.setAttribute('role','region');
  scroll.setAttribute('aria-label','Current planned Learning, Lab and Talia editions by membership');
  const head=el('thead'),heading=el('tr');
  for(const column of ['Membership','Learning','Lab','Talia','Release and access'])heading.append(el('th',column));
  head.append(heading);table.append(head);
  const body=el('tbody');
  for(const row of e.rows||[]){
   const tr=el('tr');
   for(const cell of [row.name,row.learning,row.lab,row.tutor,row.state])tr.append(el('td',cell));
   body.append(tr);
  }
  table.append(body);scroll.append(table);host.append(scroll,
   el('p','All premium engine upgrades and separately priced add-on checkouts remain unreleased. Do not treat this matrix as an access grant.','or-now-notice'));
  host.append(el('h3','What Is Next — Ten Execution Gates'));
  const gates=el('ol',undefined,'or-now-gates');
  for(const g of snapshot.gates){
   const item=el('li',undefined,'or-now-gate');
   item.dataset.gateId=g.id;
   item.append(el('strong',g.id+' · '+g.title),
               el('span',String(g.state||'open').replaceAll('_',' '),'or-now-state'),
               el('p','Completion requirement: '+g.proof),
               el('p','Next action: '+g.next,'or-muted'));gates.append(item);
  }
  host.append(gates,el('h3','Controlling release and acceptance notes'));
  const refs=el('ul',undefined,'or-now-refs');
  for(const src of snapshot.sources||[]){
   if(typeof src.url!=='string'||!/^https:\/\/github\.com\/cybernexuspublishing\/stock-market-from-the-ground-up\/blob\/main\//.test(src.url))continue;
   const li=el('li'),link=el('a',src.label);
   link.href=src.url;link.target='_blank';link.rel='noopener noreferrer';
   li.append(link);refs.append(li);
  }
  host.append(refs);
 }
 window.OwnerRoadmapRelease20261101={render};
})();
