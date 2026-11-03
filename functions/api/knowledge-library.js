/* Knowledge Library V1: private server-side membership and staff enforcement.
 * Existing 38 free static references are untouched; article bodies never enter public JS.
 */
const HEAD={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:HEAD});
const fault=(message,status=400)=>Object.assign(new Error(message),{status});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const levels=Object.freeze(['beginner','intermediate','advanced','professional','institutional_quantitative']);
const eligible=Object.freeze(['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','FULL_ANNUAL','LIFETIME','ONDEMAND_MONTHLY','PICK_WHAT_YOU_WANT']);
function cfg(env){
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
 const pub=String(env.SUPABASE_PUBLISHABLE_KEY||'');
 const key=String(env.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base)||!pub||!key)
   throw fault('Knowledge library service unavailable.',503);
 return {base,pub,key};
}
function svc(c){
 return {apikey:c.key,accept:'application/json',
   ...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(c.key)?{authorization:'Bearer '+c.key}:{})};
}
async function json(url,init,publicError='Knowledge service unavailable.'){
 let r;
 try{r=await fetch(url,{...init,cache:'no-store'});}catch{throw fault(publicError,503);}
 const d=await r.json().catch(()=>null);
 if(!r.ok){
   if(d?.code==='40001'||d?.code==='23505')throw fault('Article changed or slug already exists. Reload before saving.',409);
   if(d?.code==='23514'||d?.code==='22023'||d?.code==='22P02')throw fault('Article failed validation. Check publication, tiers and source requirements.',400);
   if(d?.code==='42501')throw fault('Content-management access denied.',403);
   if(d?.code==='P0002')throw fault('Article no longer exists.',404);
   throw fault(publicError,r.status===404?503:503);
 }
 return d;
}
async function rows(c,table,query){
 return json(c.base+'/rest/v1/'+table+'?'+query,{headers:svc(c)});
}
async function actor(c,req,{required=true}={}){
 const token=/^Bearer\s+(.+)$/i.exec(req.headers.get('authorization')||'')?.[1];
 if(!token){if(required)throw fault('Sign in required.',401);return null;}
 const r=await fetch(c.base+'/auth/v1/user',{cache:'no-store',headers:{apikey:c.pub,authorization:'Bearer '+token}}).catch(()=>null);
 if(!r||r.status===401||r.status===403){if(required)throw fault('Session expired. Sign in again.',401);return null;}
 if(!r.ok)throw fault('Member identity service unavailable.',503);
 const user=await r.json().catch(()=>null);
 if(!uuid.test(String(user?.id||'')))throw fault('Invalid member identity.',401);
 const id=user.id;
 const [profiles,flags,showcase]=await Promise.all([
  rows(c,'profiles','select=account_kind,deleted_at&id=eq.'+id+'&limit=1'),
  rows(c,'admin_user_flags','select=status&user_id=eq.'+id+'&limit=20'),
  rows(c,'admin_user_roles','select=role_code,expires_at&user_id=eq.'+id+'&role_code=eq.SHOWCASE_VIEWER&limit=10')
 ]);
 if(profiles.length!==1||profiles[0].account_kind!=='member'||profiles[0].deleted_at!=null)
   throw fault('Member account is ineligible.',403);
 if(flags.some(x=>['restricted','suspended'].includes(String(x.status).toLowerCase())))
   throw fault('Member account is restricted.',403);
 if(showcase.some(x=>!x.expires_at||Date.parse(x.expires_at)>Date.now()))
   throw fault('Showcase accounts cannot access member content.',403);
 return id;
}
async function requireEditor(c,id){
 const roles=await rows(c,'admin_user_roles','select=role_code,expires_at&user_id=eq.'+id+'&limit=40');
 const active=roles.filter(x=>!x.expires_at||Date.parse(x.expires_at)>Date.now()).map(x=>x.role_code);
 if(active.includes('OWNER'))return {id,owner:true};
 if(!active.length)throw fault('Content editor role required.',403);
 const assigned=await rows(c,'admin_role_permissions','select=role_code,permission_code&permission_code=eq.content.manage&role_code=in.('+active.map(encodeURIComponent).join(',')+')&limit=40');
 if(!assigned.length)throw fault('Content management permission required.',403);
 return {id,owner:false};
}
async function memberships(c,id){
 const base=new Set(['FREE']),now=Date.now();
 const [grants,subs,founders,launch]=await Promise.all([
   rows(c,'user_plan_grants','select=plan_code,status,starts_at,ends_at&user_id=eq.'+id+'&status=in.(active,trialing)&limit=100'),
   rows(c,'site_subscriptions','select=plan_code,status,current_period_start,current_period_end&user_id=eq.'+id+'&status=in.(active,trialing)&limit=100'),
   rows(c,'gu_founder_members_v014173','select=earned_plan_code,revoked_at&user_id=eq.'+id+'&limit=1'),
   rows(c,'gu_founder_release_v014173','select=public_launch_open&singleton=eq.true&limit=1')
 ]);
 for(const x of grants){
  const start=x.starts_at?Date.parse(x.starts_at):0,end=x.ends_at?Date.parse(x.ends_at):Infinity;
  if(eligible.includes(x.plan_code)&&Number.isFinite(start)&&start<=now&&end>now)base.add(x.plan_code);
 }
 for(const x of subs){
  const start=x.current_period_start?Date.parse(x.current_period_start):0;
  const end=x.current_period_end?Date.parse(x.current_period_end):Infinity;
  if(eligible.includes(x.plan_code)&&Number.isFinite(start)&&start<=now&&end>now)base.add(x.plan_code);
 }
 // Founding members retain beta educational access until site-wide LIVE.
 if(launch.length===1&&launch[0].public_launch_open===false&&founders.some(f=>!f.revoked_at)){
  for(const plan of eligible)base.add(plan);
 }
 return [...base];
}
const publicSelect='id,slug,title,summary,subject,learning_level,access_plans,tags,sort_order,updated_at';
const editorSelect='id,slug,title,summary,subject,learning_level,access_plans,tags,body_markdown,sources,status,review_state,is_visible,sort_order,version,updated_at,published_at,deleted_at';
function slim(row){return {id:row.id,slug:row.slug,title:row.title,summary:row.summary,
 subject:row.subject,learning_level:row.learning_level,access_plans:row.access_plans,
 tags:row.tags,sort_order:row.sort_order,updated_at:row.updated_at};}
export async function onRequest({request,env}){
 try{
  const u=new URL(request.url),a=u.searchParams.get('action')||'list',c=cfg(env);
  if(request.method==='GET'&&a==='list'){
   const page=Math.max(0,Math.min(100,Number.parseInt(u.searchParams.get('page')||'0',10)||0));
   const q='select='+publicSelect+'&status=eq.published&is_visible=eq.true&deleted_at=is.null&order=sort_order.asc,updated_at.desc&limit=100&offset='+(page*100);
   const articles=await rows(c,'gu_knowledge_articles_v1',q);
   return reply({ok:true,articles:articles.map(slim),page,hasMore:articles.length===100,
    note:'Existing 38 free educational references remain available separately.'});
  }
  if(request.method==='GET'&&a==='read'){
   const id=u.searchParams.get('id')||'';
   if(!uuid.test(id))throw fault('Valid article ID required.',400);
   const user=await actor(c,request);
   const found=await rows(c,'gu_knowledge_articles_v1','select='+editorSelect+'&id=eq.'+id+'&status=eq.published&is_visible=eq.true&deleted_at=is.null&limit=1');
   if(found.length!==1)throw fault('Article is unavailable.',404);
   const plans=await memberships(c,user);
   const row=found[0];
   if(!row.access_plans.some(x=>plans.includes(x)))return reply({ok:false,error:'Your membership does not include this article.',requiredPlans:row.access_plans},403);
   return reply({ok:true,article:{...slim(row),body_markdown:row.body_markdown,sources:row.sources},memberPlans:plans});
  }
  if(request.method==='GET'&&(a==='admin/list'||a==='admin/get'||a==='admin/history')){
   const id=await actor(c,request);await requireEditor(c,id);
   if(a==='admin/list'){
    const page=Math.max(0,Math.min(100,Number.parseInt(u.searchParams.get('page')||'0',10)||0));
    const found=await rows(c,'gu_knowledge_articles_v1','select=id,slug,title,summary,subject,learning_level,access_plans,status,review_state,is_visible,sort_order,version,updated_at,deleted_at&order=updated_at.desc&limit=100&offset='+(page*100));
    return reply({ok:true,articles:found,page,hasMore:found.length===100});
   }
   const articleId=u.searchParams.get('id')||'';
   if(!uuid.test(articleId))throw fault('Valid article ID required.',400);
   if(a==='admin/get'){
    const found=await rows(c,'gu_knowledge_articles_v1','select='+editorSelect+'&id=eq.'+articleId+'&limit=1');
    if(!found.length)throw fault('Article not found.',404);
    return reply({ok:true,article:found[0]});
   }
   const revisions=await rows(c,'gu_knowledge_article_revisions_v1',
     'select=id,article_version,action,edited_by,created_at&article_id=eq.'+articleId+'&order=article_version.desc&limit=100');
   return reply({ok:true,revisions});
  }
  if(request.method==='POST'&&['save','archive','restore'].includes(a)){
   const origin=request.headers.get('origin');
   if(origin&&origin!==u.origin)throw fault('Cross-origin content mutation denied.',403);
   const user=await actor(c,request);await requireEditor(c,user);
   const contentLength=Number(request.headers.get('content-length')||'0');
   if(contentLength>150000)throw fault('Article exceeds maximum upload size.',413);
   const body=await request.json().catch(()=>null);
   if(!body||typeof body!=='object'||Array.isArray(body)||JSON.stringify(body).length>150000)
     throw fault('Invalid article submission.',400);
   const itemId=body.id==null?null:String(body.id);
   if(itemId!==null&&!uuid.test(itemId))throw fault('Invalid article ID.',400);
   if(itemId!==null&&(!Number.isSafeInteger(body.version)||body.version<1))
     throw fault('Current article version required.',400);
   if(a==='save'){
    if(!body.article||typeof body.article!=='object'||Array.isArray(body.article))
      throw fault('Article fields required.',400);
    const p=body.article;
    if(!levels.includes(p.learning_level)||!Array.isArray(p.access_plans)||
       !p.access_plans.length||p.access_plans.some(x=>!eligible.includes(x))||
       !Array.isArray(p.tags)||!Array.isArray(p.sources))
      throw fault('Learning level, membership plans, tags or sources invalid.',400);
   }
   const saved=await json(c.base+'/rest/v1/rpc/gu_knowledge_mutate_v1',{
    method:'POST',headers:{...svc(c),'content-type':'application/json'},
    body:JSON.stringify({p_actor:user,p_action:a,p_id:itemId,
      p_expected_version:itemId?body.version:null,p_payload:a==='save'?body.article:{}})
   },'Article mutation was not confirmed.');
   return reply({ok:true,article:saved});
  }
  return reply({ok:false,error:'Unsupported knowledge library operation.'},405);
 }catch(e){return reply({ok:false,error:e.message||'Knowledge library failed.'},e.status||503);}
}
