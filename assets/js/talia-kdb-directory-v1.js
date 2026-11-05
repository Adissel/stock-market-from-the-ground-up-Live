/* Talia Classroom lesson directory: published metadata only; per-article access stays server-owned. */
(function(){
'use strict';
const host=document.getElementById('talia-kdb-directory');if(!host)return;
const el=t=>document.createElement(t);
const node=(t,s,cls)=>{const e=el(t);e.textContent=String(s??'');if(cls)e.className=cls;return e;};
const wrap=node('div','','talia-kdb-directory-wrap');host.replaceChildren(wrap);
wrap.append(node('h2','Talia Knowledge Classroom · Guided Lesson Library'),
 node('p','Browse the original nine-stage interactive lessons. Your membership is checked before article text or instruction opens. No official grades or paid AI are used.','tkdb-dir-lead'));
const tools=node('div','','tkdb-dir-tools');
const search=el('input');search.type='search';search.placeholder='Search by topic or subject';search.setAttribute('aria-label','Search interactive lesson topics');
const level=el('select');level.setAttribute('aria-label','Filter lessons by learning level');
const subject=el('select');subject.setAttribute('aria-label','Filter lessons by subject');
function option(value,label){const o=el('option');o.value=value;o.textContent=label;return o;}
level.append(option('','All levels'));
for(const v of ['beginner','intermediate','advanced','professional','institutional_quantitative'])level.append(option(v,v.replace(/_/g,' ').replace(/\b\w/g,s=>s.toUpperCase())));
subject.append(option('','All subjects'));
tools.append(search,level,subject);wrap.append(tools);
const status=node('p','Loading published Knowledge lesson catalog…','tkdb-dir-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const list=node('div','','tkdb-dir-grid');
const more=el('button');more.type='button';more.textContent='Show more lessons';more.hidden=true;
wrap.append(status,list,more);
const slugOk=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
let all=[],visible=30,matching=[];
function filtered(){const q=search.value.trim().toLowerCase();return all.filter(a=>
 (!q||[a.title,a.subject,a.summary].join(' ').toLowerCase().includes(q))&&
 (!level.value||a.learning_level===level.value)&&(!subject.value||a.subject===subject.value));}
function render(){
 matching=filtered();status.textContent=matching.length+' guided topic'+(matching.length===1?'':'s')+' found of '+all.length+' published Knowledge articles. Article access enforced individually.';
 list.replaceChildren();
 for(const a of matching.slice(0,visible)){
  if(!slugOk.test(a.slug))continue;
  const card=node('article','','tkdb-dir-card');
  card.append(node('small',a.learning_level.replace(/_/g,' ')+' · '+a.subject),
   node('h3',a.title));
  const link=node('a','Open nine-stage interactive lesson');link.href='/knowledge-article.html?slug='+encodeURIComponent(a.slug);
  link.setAttribute('aria-label','Open interactive learning for '+a.title+'; membership required');
  card.append(link);list.append(card);
 }
 if(!matching.length)list.append(node('p','No Knowledge lessons match the selected filters.'));
 more.hidden=matching.length<=visible;
 more.textContent='Show '+Math.min(30,matching.length-visible)+' more lessons';
}
search.addEventListener('input',()=>{visible=30;render();});
for(const control of [level,subject])control.addEventListener('change',()=>{visible=30;render();});
more.addEventListener('click',()=>{visible+=30;render();});
async function load(){
 try{
  const rows=[];let page=0;
  while(page<20){
   const r=await fetch('/api/knowledge-library?action=list&page='+page,{cache:'no-store'});
   if(!r.ok)throw Error('Catalog HTTP '+r.status);
   const d=await r.json();if(!d.ok||!Array.isArray(d.articles))throw Error('Invalid Knowledge catalog response');
   rows.push(...d.articles);page++;
   if(!d.hasMore)break;
  }
  const checked=new Set();
  all=rows.filter(a=>a&&slugOk.test(a.slug)&&typeof a.title==='string'&&typeof a.subject==='string'&&!checked.has(a.slug)&&checked.add(a.slug));
  for(const title of [...new Set(all.map(a=>a.subject))].sort())subject.append(option(title,title));
  render();
 }catch{status.textContent='Knowledge lessons could not be loaded. Use the existing Knowledge Database catalog to browse source articles.';
  const a=node('a','Open Knowledge Database');a.href='/knowledge-database.html';list.replaceChildren(a);more.hidden=true;}
}
void load();
})();
