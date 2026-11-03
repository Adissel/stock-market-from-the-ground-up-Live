/* Membership-gated Knowledge Library V1, additive to 38 permanently free static study topics. */
(function(){
'use strict';
const host=document.getElementById('gu-article-library-v1');if(!host)return;
const levels={beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced',
 professional:'Professional',institutional_quantitative:'Institutional / Quantitative'};
const plans={FREE:'Free',FOUNDING_14:'Founding 14-Day',FOUNDING_30:'Founding 30-Day',
 FOUNDING_60:'Founding 60-Day',FULL_MONTHLY:'Full Monthly',FULL_ANNUAL:'Full Annual',
 LIFETIME:'Lifetime',ONDEMAND_MONTHLY:'On-Demand',PICK_WHAT_YOU_WANT:'Pick What You Want'};
const elem=(tag,label,cls)=>{const e=document.createElement(tag);if(label!=null)e.textContent=label;if(cls)e.className=cls;return e};
const heading=elem('h2','Membership Article Library');
heading.id='gu-article-library-title';
host.append(heading,elem('p','Browse new articles by subject, experience level, and available membership. The original 38 Foundations references above remain free. Only accepted, visible articles appear here.','kal-intro'));
const filters=elem('div',null,'kal-filters');
const search=elem('input');search.type='search';search.placeholder='Find a topic or article';search.setAttribute('aria-label','Search articles');
const level=elem('select');level.setAttribute('aria-label','Filter by experience level');
for(const [value,label] of [['','All experience levels'],...Object.entries(levels)]){const o=elem('option',label);o.value=value;level.append(o)}
const subject=elem('select');subject.setAttribute('aria-label','Filter by subject');
const membership=elem('select');membership.setAttribute('aria-label','Filter by membership tier');
for(const [value,label] of [['','All membership tiers'],...Object.entries(plans)]){const o=elem('option',label);o.value=value;membership.append(o)}
filters.append(search,level,subject,membership);host.append(filters);
const status=elem('p','Loading the article catalog…','kal-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const results=elem('div',null,'kal-grid');
const reader=elem('article',null,'kal-reader');reader.hidden=true;
host.append(status,results,reader);
let all=[],activeId=null;
function fillSubjects(){
 subject.replaceChildren();const option=elem('option','All subjects');option.value='';subject.append(option);
 for(const value of [...new Set(all.map(x=>x.subject))].sort()){const o=elem('option',value);o.value=value;subject.append(o)}
}
function filtered(){
 const q=search.value.trim().toLowerCase();
 return all.filter(a=>(!q||[a.title,a.summary,a.subject,...(a.tags||[])].join(' ').toLowerCase().includes(q))&&
 (!level.value||a.learning_level===level.value)&&(!subject.value||a.subject===subject.value)&&
 (!membership.value||a.access_plans.includes(membership.value)));
}
function render(){
 results.replaceChildren();const selected=filtered();
 status.textContent=selected.length+' article'+(selected.length===1?'':'s')+' shown ('+all.length+' visible article records).';
 if(!selected.length)results.append(elem('p','No published articles match these filters. The free Foundation references above remain available.'));
 for(const a of selected){
  const card=elem('article',null,'kal-card');
  card.append(elem('p',levels[a.learning_level]+' · '+a.subject,'kal-meta'),elem('h3',a.title),
   elem('p',a.summary||'Original educational reference.'));
  const tier=elem('p','Available to: '+a.access_plans.map(p=>plans[p]||p).join(', '),'kal-tier');
  const button=elem('button','Read article','btn secondary');
  button.type='button';button.addEventListener('click',()=>open(a.id));
  card.append(tier,button);results.append(card);
 }
}
async function authHeader(){
 if(typeof window.getSupabaseClient!=='function')return {};
 const sb=await window.getSupabaseClient();
 const {data}=await sb.auth.getSession();
 return data?.session?.access_token?{authorization:'Bearer '+data.session.access_token}:{};
}
async function open(id){
 activeId=id;reader.hidden=false;reader.replaceChildren();
 reader.append(elem('p','Checking your membership and loading the article…','kal-status'));
 reader.scrollIntoView({behavior:'smooth',block:'start'});
 try{
  const headers=await authHeader();
  const response=await fetch('/api/knowledge-library?action=read&id='+encodeURIComponent(id),
   {cache:'no-store',headers});
  const data=await response.json();
  if(id!==activeId)return;
  reader.replaceChildren();
  const close=elem('button','Close article','btn secondary');close.type='button';
  close.addEventListener('click',()=>{activeId=null;reader.hidden=true;reader.replaceChildren()});
  reader.append(close);
  if(!response.ok){
   reader.append(elem('h3',response.status===403?'Membership access required':'Unable to open article'),
    elem('p',data.error||'This article is currently unavailable.'));
   if(response.status===401)reader.append(link('Sign in','account.html'));
   else if(response.status===403)reader.append(link('View membership options','membership.html'));
   return;
  }
  const a=data.article;
  reader.append(elem('p',levels[a.learning_level]+' · '+a.subject,'kal-meta'),
   elem('h3',a.title),elem('p',a.summary||'','kal-summary'));
  // Intentionally render original Markdown as safe text, not executable HTML.
  const text=elem('div',a.body_markdown,'kal-body');reader.append(text);
  if(a.sources&&a.sources.length){
   const sourceHead=elem('h4','Research sources'),list=elem('ul');
   for(const s of a.sources){if(!/^https:\/\//.test(s.url||''))continue;
    const li=elem('li');li.append(link(s.title||s.url,s.url,true));list.append(li)}
   reader.append(sourceHead,list);
  }
 }catch(e){reader.replaceChildren(elem('p','Knowledge Library cannot load this article at present. Please retry.'))}
}
function link(title,href,external=false){const a=elem('a',title);a.href=href;if(external){a.target='_blank';a.rel='noopener noreferrer'}return a}
async function load(){
 try{
  let page=0,more=true;all=[];
  while(more&&page<20){
   const r=await fetch('/api/knowledge-library?action=list&page='+page,{cache:'no-store'});
   const j=await r.json();if(!r.ok||!j.ok)throw new Error(j.error||'Catalog unavailable.');
   all.push(...j.articles);more=j.hasMore===true;page++;
  }
  fillSubjects();render();
  const id=new URLSearchParams(location.search).get('article');
  if(id&&all.some(a=>a.id===id))open(id);
 }catch(e){status.textContent='Membership articles are currently unavailable; the 38 free Foundation references remain available above.';}
}
for(const input of [search,level,subject,membership])input.addEventListener(input===search?'input':'change',render);
void load();
})();