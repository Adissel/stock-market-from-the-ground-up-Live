/* Knowledge Database catalog: all 145+ published articles link to their own full-page reader. */
(function(){
'use strict';
const host=document.getElementById('gu-article-library-v1');if(!host)return;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const params=new URLSearchParams(location.search);
const legacyId=params.get('article')||'';
if(legacyId&&uuid.test(legacyId)){
 location.replace('/knowledge-article.html?article='+encodeURIComponent(legacyId));
 return;
}
const levels={beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced',
 professional:'Professional',institutional_quantitative:'Institutional / Quantitative'};
const plans={FREE:'Free',FOUNDING_14:'Founding 14-Day',FOUNDING_30:'Founding 30-Day',
 FOUNDING_60:'Founding 60-Day',FULL_MONTHLY:'Full Monthly',FULL_ANNUAL:'Full Annual',
 LIFETIME:'Lifetime',ONDEMAND_MONTHLY:'On-Demand',PICK_WHAT_YOU_WANT:'Pick What You Want'};
const elem=(tag,label,cls)=>{const e=document.createElement(tag);if(label!=null)e.textContent=String(label);if(cls)e.className=cls;return e};
const heading=elem('h2','Membership Article Library');heading.id='gu-article-library-title';
host.append(heading,elem('p','Browse published research articles by subject, experience level and membership. Each article opens on its own page. The original 38 free Foundations references above remain available.','kal-intro'));
const filters=elem('div',null,'kal-filters');
const search=elem('input');search.type='search';search.placeholder='Find a topic or article';search.setAttribute('aria-label','Search articles');
const level=elem('select');level.setAttribute('aria-label','Filter by experience level');
for(const [value,label] of [['','All experience levels'],...Object.entries(levels)]){
 const option=elem('option',label);option.value=value;level.append(option);
}
const subject=elem('select');subject.setAttribute('aria-label','Filter by subject');
const membership=elem('select');membership.setAttribute('aria-label','Filter by membership tier');
for(const [value,label] of [['','All membership tiers'],...Object.entries(plans)]){
 const option=elem('option',label);option.value=value;membership.append(option);
}
filters.append(search,level,subject,membership);host.append(filters);
const status=elem('p','Loading published articles…','kal-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const results=elem('div',null,'kal-grid');
host.append(status,results);
let all=[];
function fillSubjects(){
 subject.replaceChildren();const allOption=elem('option','All subjects');allOption.value='';subject.append(allOption);
 for(const name of [...new Set(all.map(a=>a.subject))].sort()){
  const option=elem('option',name);option.value=name;subject.append(option);
 }
}
function filtered(){
 const query=search.value.trim().toLowerCase();
 return all.filter(a=>(!query||[a.title,a.summary,a.subject,...(a.tags||[])].join(' ').toLowerCase().includes(query))&&
 (!level.value||a.learning_level===level.value)&&(!subject.value||a.subject===subject.value)&&
 (!membership.value||a.access_plans.includes(membership.value)));
}
function render(){
 results.replaceChildren();
 const matched=filtered();
 status.textContent=matched.length+' article'+(matched.length===1?'':'s')+' shown of '+all.length+' published articles.';
 if(!matched.length)results.append(elem('p','No articles match these filters. The 38 free Foundation references remain available above.'));
 for(const article of matched){
  const card=elem('article',null,'kal-card');
  card.append(elem('p',(levels[article.learning_level]||article.learning_level)+' · '+article.subject,'kal-meta'),
   elem('h3',article.title),elem('p',article.summary||'Original educational reference.'));
  const tier=elem('p','Available to: '+article.access_plans.map(p=>plans[p]||p).join(', '),'kal-tier');
  const href='/knowledge-article.html?slug='+encodeURIComponent(article.slug);
  const read=elem('a','Read full article','btn secondary');read.href=href;
  read.setAttribute('aria-label','Read '+article.title+' on its own page');
  card.append(tier,read);results.append(card);
 }
}
async function load(){
 try{
  let page=0,more=true;all=[];
  while(more&&page<20){
   const response=await fetch('/api/knowledge-library?action=list&page='+page,{cache:'no-store'});
   const data=await response.json();
   if(!response.ok||!data.ok)throw new Error(data.error||'Catalog unavailable.');
   all.push(...data.articles);more=data.hasMore===true;page++;
  }
  fillSubjects();render();
 }catch{
  status.textContent='Membership articles are temporarily unavailable; the 38 free Foundations references remain available.';
 }
}
for(const control of [search,level,subject,membership])control.addEventListener(control===search?'input':'change',render);
void load();
})();
