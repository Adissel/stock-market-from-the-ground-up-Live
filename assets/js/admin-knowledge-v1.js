/* Knowledge Article Administration V1: protected by server-owned role and member checks. */
(function(){
'use strict';
const $=id=>document.getElementById(id),get=id=>$(id).value;
const plans={FREE:'Free',FOUNDING_14:'Founding 14-Day',FOUNDING_30:'Founding 30-Day',
 FOUNDING_60:'Founding 60-Day',FULL_MONTHLY:'Full Monthly',FULL_ANNUAL:'Full Annual',
 LIFETIME:'Lifetime',ONDEMAND_MONTHLY:'On-Demand',PICK_WHAT_YOU_WANT:'Pick What You Want'};
const field=['title','slug','summary','subject','body','sources','tags','order','level','review','publication'];
const asText=v=>String(v==null?'':v),e=(tag,text)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;return node};
const state={id:null,version:null,rows:[],page:0,hasMore:false};
function msg(s,problem=false){$('ak-status').textContent=s;$('ak-status').style.color=problem?'#ffc5ad':'#a5e0d6'}
async function token(){
 const sb=await window.getSupabaseClient();const {data,error}=await sb.auth.getSession();
 if(error||!data?.session?.access_token)throw new Error('Sign in with an authorized Admin or Content Manager account to edit articles.');
 return data.session.access_token;
}
async function api(action,{method='GET',data,params={}}={}){
 const q=new URLSearchParams({action,...params});
 const r=await fetch('/api/knowledge-library?'+q,{method,cache:'no-store',
  headers:{authorization:'Bearer '+await token(),...(data?{'content-type':'application/json'}:{})},
  body:data?JSON.stringify(data):undefined});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||!j.ok)throw new Error(j.error||'Knowledge service error ('+r.status+').');
 return j;
}
const planHost=$('ak-plans');
for(const [code,name] of Object.entries(plans)){
 const label=e('label'),box=e('input');box.type='checkbox';box.value=code;box.dataset.plan=code;
 const span=e('span',name);label.append(box,span);planHost.append(label);
}
function chosen(){return [...planHost.querySelectorAll('[data-plan]:checked')].map(x=>x.value)}
function setPlans(arr){planHost.querySelectorAll('[data-plan]').forEach(x=>x.checked=(arr||[]).includes(x.value))}
function newDoc(){
 state.id=null;state.version=null;$('ak-form').reset();$('ak-form').dataset.existing='false';
 $('ak-editor-title').textContent='Create a new article';$('ak-order').value='100';
 setPlans(['FREE']);$('ak-archive').disabled=true;$('ak-restore').disabled=true;$('ak-history').disabled=true;
 $('ak-record').textContent='New article · Not yet saved';$('ak-preview-area').hidden=true;$('ak-history-area').hidden=true;
 $('ak-title').focus();
}
function slugify(v){return asText(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,120)}
function sourceLines(){
 return get('ak-sources').split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
  const ix=line.indexOf('|'),title=ix<0?line:line.slice(0,ix).trim(),url=ix<0?line:line.slice(ix+1).trim();
  if(!/^https:\/\/[^\s]+$/i.test(url))throw new Error('Every source must be an HTTPS URL: '+title);
  return {title:title.slice(0,180),url};
 });
}
function article(){
 const access=chosen();if(!access.length)throw new Error('Select at least one membership tier.');
 const tags=get('ak-tags').split(',').map(x=>x.trim()).filter(Boolean);
 if(tags.length>20||tags.some(x=>x.length>50))throw new Error('Use 20 tags or fewer, each at most 50 characters.');
 return {
  slug:get('ak-slug').trim(),title:get('ak-title').trim(),summary:get('ak-summary').trim(),
  subject:get('ak-subject').trim(),learning_level:get('ak-level'),
  status:get('ak-publication'),review_state:get('ak-review'),sort_order:Number(get('ak-order')),
  access_plans:access,tags,body_markdown:get('ak-body'),sources:sourceLines(),
  is_visible:$('ak-visible').checked
 };
}
function show(a){
 state.id=a.id;state.version=a.version;
 const vals={title:a.title,slug:a.slug,summary:a.summary,subject:a.subject,body:a.body_markdown,
  sources:(a.sources||[]).map(x=>(x.title||x.url)+' | '+x.url).join('\n'),
  tags:(a.tags||[]).join(', '),order:a.sort_order,level:a.learning_level,
  review:a.review_state,publication:a.status};
 for(const name of field)$(name.startsWith('ak-')?name:'ak-'+name).value=asText(vals[name]);
 setPlans(a.access_plans);$('ak-visible').checked=a.is_visible===true;
 $('ak-editor-title').textContent='Edit: '+a.title;
 $('ak-archive').disabled=a.deleted_at!=null;
 $('ak-restore').disabled=a.deleted_at==null;
 $('ak-history').disabled=false;
 $('ak-record').textContent='ID '+a.id+' · Revision '+a.version+' · Last updated '+new Date(a.updated_at).toLocaleString();
 $('ak-preview-area').hidden=true;$('ak-history-area').hidden=true;
}
async function open(id){
 try{const j=await api('admin/get',{params:{id}});show(j.article);msg('Loaded '+j.article.title+' (revision '+j.article.version+').');}
 catch(err){msg(err.message,true)}
}
function drawList(){
 const q=get('ak-search').trim().toLowerCase(),lvl=get('ak-filter-level'),status=get('ak-filter-status');
 const rows=state.rows.filter(a=>(!q||[a.title,a.subject,a.summary,a.slug].join(' ').toLowerCase().includes(q))&&
  (!lvl||a.learning_level===lvl)&&(!status||a.status===status));
 const host=$('ak-list');host.replaceChildren();
 $('ak-count').textContent=rows.length+' matching records ('+state.rows.length+' loaded).';
 for(const a of rows){
  const btn=e('button');btn.type='button';btn.className='ak-list-item';
  btn.setAttribute('aria-current',String(a.id===state.id));
  const head=e('strong',a.title),more=e('small',a.subject+' · '+a.learning_level+' · '+a.status+
   (a.is_visible?' · Visible':' · Hidden')+' · v'+a.version);
  btn.append(head,more);btn.addEventListener('click',()=>open(a.id));host.append(btn);
 }
 $('ak-more').hidden=!state.hasMore;
}
async function load(append=false){
 try{
  const page=append?state.page+1:0;
  const j=await api('admin/list',{params:{page}});
  state.rows=append?state.rows.concat(j.articles):j.articles;
  state.page=page;state.hasMore=j.hasMore===true;
  $('ak-app').hidden=false;drawList();
  msg('Authorized article inventory loaded. Draft and hidden article bodies are not accessible to members.');
 }catch(err){msg(err.message,true)}
}
async function save(ev){
 ev?.preventDefault();
 try{
  const p=article();
  if(p.is_visible&&(p.status!=='published'||p.review_state!=='accepted'))throw new Error('Only accepted, published articles may be visible.');
  if(p.status==='published'&&(p.body_markdown.length<400||!p.sources.length))throw new Error('Publication requires at least 400 characters and one HTTPS source.');
  const j=await api('save',{method:'POST',data:{id:state.id,version:state.version,article:p}});
  show(j.article);await load();
  msg('Article '+j.article.slug+' saved with audit revision '+j.article.version+'.');
 }catch(err){msg(err.message,true)}
}
async function mutate(action){
 if(!state.id)return;
 const question=action==='archive'?'Move this article to trash? It will become inaccessible immediately.':'Restore this article as a hidden draft?';
 if(!confirm(question))return;
 try{
  const j=await api(action,{method:'POST',data:{id:state.id,version:state.version}});
  show(j.article);await load();msg('Article '+action+' completed at revision '+j.article.version+'.');
 }catch(err){msg(err.message,true)}
}
function preview(){
 let p;try{p=article()}catch(err){msg(err.message,true);return}
 const el=$('ak-preview-area');el.replaceChildren(e('h3',p.title),e('p',p.summary),e('div',p.body_markdown),
   e('p','Experience: '+p.learning_level+' · Subject: '+p.subject+' · Membership: '+p.access_plans.join(', ')));
 el.hidden=false;el.scrollIntoView({block:'nearest',behavior:'smooth'});
 msg('Local safe-text preview. This does not publish the article.');
}
async function history(){
 if(!state.id)return;
 try{
  const j=await api('admin/history',{params:{id:state.id}});
  const el=$('ak-history-area');el.replaceChildren(e('h3','Revision history'));
  for(const r of j.revisions){el.append(e('p','v'+r.article_version+' · '+r.action+' · '+new Date(r.created_at).toLocaleString()))}
  el.hidden=false;msg(j.revisions.length+' revision record(s).');
 }catch(err){msg(err.message,true)}
}
async function exportJson(){
 try{
  const items=[];let page=0,more=true;
  while(more&&page<50){
   const j=await api('admin/list',{params:{page}});
   for(const row of j.articles){const d=await api('admin/get',{params:{id:row.id}});items.push(d.article)}
   more=j.hasMore;page++;
  }
  const blob=new Blob([JSON.stringify({schema:'smfgu-knowledge-library-v1',exportedAt:new Date().toISOString(),articles:items},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=e('a');a.href=url;a.download='smfgu-knowledge-articles-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),2000);msg(items.length+' article(s) exported, including drafts for administrative backup.');
 }catch(err){msg(err.message,true)}
}
async function upload(ev){
 const file=ev.target.files?.[0];if(!file)return;
 ev.target.value='';
 if(file.size>4000000){msg('Use files smaller than 4 MB per import batch.',true);return}
 try{
  const content=await file.text();let items;
  if(file.name.toLowerCase().endsWith('.json')){
   const parsed=JSON.parse(content);
   items=Array.isArray(parsed)?parsed:Array.isArray(parsed.articles)?parsed.articles:[parsed];
  }else{
   items=[{title:file.name.replace(/\.(md|txt)$/i,'').replace(/[-_]/g,' ').trim(),
    subject:'Uncategorized',learning_level:'beginner',body_markdown:content,summary:'Imported research draft.'}];
  }
  if(!items.length||items.length>250)throw new Error('Import supports 1–250 articles per file.');
  if(!confirm('Import '+items.length+' article(s) as HIDDEN DRAFTS? No articles will be published automatically.'))return;
  let success=0;
  for(let i=0;i<items.length;i++){
   const x=items[i],title=asText(x.title).trim();
   const slug=slugify(asText(x.slug)||title);
   const p={title,slug,summary:asText(x.summary||'Imported original research draft.').slice(0,700),
    subject:asText(x.subject||'Uncategorized').slice(0,100),
    learning_level:['beginner','intermediate','advanced','professional','institutional_quantitative'].includes(x.learning_level)?x.learning_level:'beginner',
    access_plans:Array.isArray(x.access_plans)?x.access_plans.filter(v=>Object.hasOwn(plans,v)):['FREE'],
    tags:Array.isArray(x.tags)?x.tags.slice(0,20).map(v=>asText(v).slice(0,50)):[],
    sources:Array.isArray(x.sources)?x.sources.filter(s=>s&&/^https:\/\//.test(s.url||'')).slice(0,25):[],
    body_markdown:asText(x.body_markdown||x.body||'').slice(0,100000),
    status:'draft',review_state:'draft',is_visible:false,sort_order:Number.isInteger(x.sort_order)?x.sort_order:100};
   if(!p.access_plans.length)p.access_plans=['FREE'];
   if(p.title.length<8||!slug)throw new Error('Invalid title on imported row '+(i+1));
   await api('save',{method:'POST',data:{article:p}});success++;
   msg('Imported '+success+' / '+items.length+' hidden drafts…');
  }
  await load();msg('Imported '+success+' hidden draft articles. Review each before publication.');
 }catch(err){msg('Import stopped: '+err.message+'. Earlier successfully imported drafts remain in the library.',true)}
}
$('ak-new').addEventListener('click',newDoc);
$('ak-reload').addEventListener('click',()=>load());
$('ak-export').addEventListener('click',exportJson);
$('ak-upload').addEventListener('change',upload);
$('ak-form').addEventListener('submit',save);
$('ak-preview').addEventListener('click',preview);
$('ak-history').addEventListener('click',history);
$('ak-archive').addEventListener('click',()=>mutate('archive'));
$('ak-restore').addEventListener('click',()=>mutate('restore'));
$('ak-more').addEventListener('click',()=>load(true));
for(const id of ['ak-search','ak-filter-level','ak-filter-status'])$(id).addEventListener(id==='ak-search'?'input':'change',drawList);
$('ak-title').addEventListener('input',()=>{if(!state.id)$('ak-slug').value=slugify(get('ak-title'))});
newDoc();void load();
})();