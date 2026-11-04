/* Knowledge Article V1: dedicated, authenticated full-body page with safe Markdown DOM rendering. */
(function(){
'use strict';
const el=id=>document.getElementById(id);
const make=(tag,value)=>{const n=document.createElement(tag);if(value!=null)n.textContent=String(value);return n};
const status=el('kal-page-status'),doc=el('kal-document'),message=el('kal-message');
const content=el('kal-article-content'),sources=el('kal-article-references'),outline=el('kal-outline');
const levels={beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced',
 professional:'Professional',institutional_quantitative:'Institutional / Quantitative'};
const tiers={FREE:'Free',FOUNDING_14:'Founding 14-Day',FOUNDING_30:'Founding 30-Day',
 FOUNDING_60:'Founding 60-Day',FULL_MONTHLY:'Full Monthly',FULL_ANNUAL:'Full Annual',
 LIFETIME:'Lifetime',ONDEMAND_MONTHLY:'On-Demand',PICK_WHAT_YOU_WANT:'Pick What You Want'};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const safeSlug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const params=new URLSearchParams(location.search);
const id=params.get('article')||params.get('id')||'',slug=params.get('slug')||'';
function safeLink(label,href){
 let url;try{url=new URL(String(href||''))}catch{return make('span',label)}
 if(url.protocol!=='https:')return make('span',label);
 const a=make('a',label);a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';return a;
}
function action(label,href){const a=make('a',label);a.className='kal-action';a.href=href;return a}
function showError(title,description,kind,requiredPlans=[]){
 content.replaceChildren();content.hidden=true;sources.hidden=true;outline.replaceChildren();el('kal-outline-panel').hidden=true;
 const lesson=el('kal-talia-classroom');if(lesson){lesson.replaceChildren();lesson.hidden=true;}
 message.hidden=false;message.replaceChildren(make('h2',title),make('p',description));
 const options=make('div');
 if(kind==='sign-in')options.append(action('Sign in to read','/account.html'));
 if(kind==='membership')options.append(action('View memberships','/membership.html'));
 options.append(action('Return to Knowledge Database','/knowledge-database.html'));
 message.append(options);
 if(requiredPlans.length)el('kal-access-plans').textContent='Eligible tiers: '+requiredPlans.map(p=>tiers[p]||p).join(', ');
 el('kal-access-status').textContent=kind==='sign-in'?'Sign-in required.':kind==='membership'?'Membership access required.':'Article unavailable.';
 status.textContent=title;doc.setAttribute('aria-busy','false');
}
function inline(parent,text){
 // Only DOM text nodes and trusted element names are created; article HTML never executes.
 const re=/(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\(https:\/\/[^\s)\n]+\))/g;
 let offset=0,match;
 while((match=re.exec(text))!==null){
  if(match.index>offset)parent.append(document.createTextNode(text.slice(offset,match.index)));
  const token=match[0];
  if(token.startsWith('**'))parent.append(make('strong',token.slice(2,-2)));
  else {
   const parts=/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(token);
   parent.append(parts?safeLink(parts[1],parts[2]):document.createTextNode(token));
  }
  offset=match.index+token.length;
 }
 if(offset<text.length)parent.append(document.createTextNode(text.slice(offset)));
}
function addHeading(label,rank,num){
 const heading=make('h'+Math.min(rank,5),label);heading.id='article-section-'+num;content.append(heading);
 if(rank<=3){
  const link=make('a',label);link.href='#'+heading.id;
  link.className='kal-outline-link'+(rank===3?' kal-outline-sub':'');
  outline.append(link);
 }
}
function renderMarkdown(markdown,title){
 content.replaceChildren();outline.replaceChildren();
 const lines=String(markdown||'').replace(/\r\n/g,'\n').split('\n');
 let paragraph=[],list=null,listType='',codeLines=null,section=0,seenTitle=false;
 function flush(){if(!paragraph.length)return;const p=make('p');inline(p,paragraph.join(' '));content.append(p);paragraph=[]}
 function endList(){list=null;listType=''}
 for(const raw of lines){
  const line=raw.trim();
  const fence=line.length>=3&&line.charCodeAt(0)===96&&line.charCodeAt(1)===96&&line.charCodeAt(2)===96;
  if(fence){flush();endList();if(codeLines!==null){const pre=make('pre');pre.append(make('code',codeLines.join('\n')));content.append(pre);codeLines=null}else codeLines=[];continue}
  if(codeLines!==null){codeLines.push(raw);continue}
  if(!line){flush();endList();continue}
  const head=/^(#{1,5})\s+(.+)$/.exec(line);
  if(head){
   flush();endList();const rank=head[1].length;
   if(rank===1&&!seenTitle&&head[2].trim().toLowerCase()===String(title||'').split(' — ')[0].trim().toLowerCase()){seenTitle=true;continue}
   seenTitle=true;addHeading(head[2],Math.max(2,rank),++section);continue
  }
  if(/^(-{3,}|\*{3,})$/.test(line)){flush();endList();content.append(make('hr'));continue}
  const bullet=/^[-*]\s+(.+)$/.exec(line),numbered=/^\d+[.)]\s+(.+)$/.exec(line);
  if(bullet||numbered){
   flush();const kind=bullet?'ul':'ol';
   if(kind!==listType){list=make(kind);listType=kind;content.append(list)}
   const li=make('li');inline(li,(bullet||numbered)[1]);list.append(li);continue
  }
  if(line.startsWith('> ')){flush();endList();const block=make('blockquote');inline(block,line.slice(2));content.append(block);continue}
  endList();paragraph.push(line);
 }
 flush();if(codeLines!==null){const pre=make('pre');pre.append(make('code',codeLines.join('\n')));content.append(pre)}
 el('kal-outline-panel').hidden=outline.childElementCount===0;
}
async function token(){
 if(typeof window.getSupabaseClient!=='function')return null;
 const sb=await window.getSupabaseClient();
 const {data,error}=await sb.auth.getSession();
 if(error)return null;
 return data?.session?.access_token||null;
}
async function load(){
 if(!((id&&uuid.test(id))||(!id&&slug&&slug.length<=120&&safeSlug.test(slug)))){
  showError('Article address missing','Choose an article from the Knowledge Database.','invalid');return
 }
 try{
  const session=await token();
  if(!session){showError('Sign in to read this article','The full article is protected by your membership. Sign in to your account to continue.','sign-in');return}
  const q=new URLSearchParams({action:'read'});
  if(id)q.set('id',id);else q.set('slug',slug);
  const response=await fetch('/api/knowledge-library?'+q.toString(),{
   cache:'no-store',headers:{authorization:'Bearer '+session}});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok){
   if(response.status===401){showError('Your session has expired','Sign in again to read this article.','sign-in');return}
   if(response.status===403){showError('Membership access required',data.error||'This article is not included in your current membership.','membership',data.requiredPlans||[]);return}
   showError('Article cannot be opened',data.error||'The article is unavailable.','unavailable');return
  }
  const a=data.article;
  if(!a||!uuid.test(a.id))throw new Error('Unexpected article record');
  el('kal-article-title').textContent=a.title;
  el('kal-breadcrumb-title').textContent=a.title;
  el('kal-article-meta').textContent=(levels[a.learning_level]||a.learning_level)+' · '+a.subject;
  el('kal-article-summary').textContent=a.summary||'An educational research article.';
  el('kal-article-tags').replaceChildren(...(a.tags||[]).slice(0,12).map(tag=>make('span',tag)));
  el('kal-access-status').textContent='Member access verified. This article is available to your eligible membership.';
  el('kal-access-plans').textContent='Membership tiers: '+(a.access_plans||[]).map(p=>tiers[p]||p).join(', ');
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.content=String(a.summary||a.title).slice(0,260);
  document.title=a.title+' | The Stock Market: From the Ground Up';
  if(a.slug&&safeSlug.test(a.slug)&&slug!==a.slug)
   history.replaceState(null,'','/knowledge-article.html?slug='+encodeURIComponent(a.slug));
  renderMarkdown(a.body_markdown,a.title);
  content.hidden=false;message.hidden=true;
  // Trusted delivery point: the server has authenticated the reader and checked membership before sending this body.
  const lessonHost=el('kal-talia-classroom');
  if(lessonHost){
    try{
      const args={article:a,element:lessonHost};
      const original=window.CrownlightKnowledgeLesson?.mount(args);
      if(!original)window.CrownlightKnowledgeRemaining?.mount(args);
    }catch{lessonHost.replaceChildren();lessonHost.hidden=true;}
  }
  const list=el('kal-source-list');list.replaceChildren();
  for(const s of a.sources||[]){
   if(!s||typeof s.url!=='string'||!s.url.startsWith('https://'))continue;
   const li=make('li');li.append(safeLink(s.title||s.url,s.url));list.append(li);
  }
  sources.hidden=list.childElementCount===0;
  el('kal-copy-link').hidden=false;el('kal-print').hidden=false;
  status.textContent='Article loaded. '+a.title;doc.setAttribute('aria-busy','false');
 }catch{
  showError('Unable to load the article','Please check your connection and try again.','unavailable');
 }
}
el('kal-copy-link').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(location.href);status.textContent='Article link copied. Membership is still required to read it.'}
 catch{status.textContent='Copy the article URL from the browser address bar.'}
});
el('kal-print').addEventListener('click',()=>window.print());
void load();
})();
