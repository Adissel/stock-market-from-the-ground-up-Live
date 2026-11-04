/* The authoritative V1 Lumen earning amounts are stored in Supabase.
 * Draft/catalog values must NEVER look like an earnable award.
 * Reward publication requires reviewer attribution and server release switch.
 */
const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',
 'x-content-type-options':'nosniff'};
const answer=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
const REVISION='lumen-v1.0';
async function read(env,where){
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
 const key=String(env.SUPABASE_SECRET_KEY||'');
 if(!base||!key)throw Error('Unconfigured private catalog');
 const headers={apikey:key,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key))
  headers.authorization='Bearer '+key;
 const response=await fetch(base+'/rest/v1/'+where,{headers,cache:'no-store'});
 if(!response.ok)throw Error('Unverified catalog');
 return response.json();
}
export async function onRequest({request,env}){
 if(request.method!=='GET')return answer({ok:false,error:'Method not allowed'},405);
 try{
  const [rows,flags]=await Promise.all([
   read(env,'gu_lumen_learning_rewards_v1?select=scope_type,scope_id,approved_revision,amount,published,reviewed_by,reviewed_at&approved_revision=eq.'+REVISION+'&limit=600'),
   read(env,'gu_lumen_completion_release_v1?select=learning_rewards_enabled&singleton=eq.true&limit=1')
  ]);
  if(!Array.isArray(rows)||rows.length!==429||flags?.length!==1)
   throw Error('Incomplete server catalog');
  const labRows=rows.filter(x=>x.scope_type==='lab');
  const campRows=rows.filter(x=>x.scope_type==='bootcamp');
  // Validate every scope, not only row counts. A duplicated or malformed lab
  // must not make an incomplete award catalog appear authoritative.
  const labIds=new Set(labRows.map(x=>x.scope_id));
  if(labRows.length!==419||campRows.length!==10||labIds.size!==419||
     labRows.some(x=>typeof x.scope_id!=='string'||
       !/^[A-Za-z0-9_-]{2,100}$/.test(x.scope_id)||x.amount!==2)||
     campRows.some(x=>!Number.isSafeInteger(x.amount)||x.amount<1))
   throw Error('Unreconciled reward definitions');
  const bootcamps=Object.create(null);
  for(const x of campRows){
   if(!/^[A-Za-z0-9_-]{2,100}$/.test(x.scope_id)||Object.hasOwn(bootcamps,x.scope_id))
    throw Error('Invalid server reward scope');
   bootcamps[x.scope_id]=x.amount;
  }
  const officiallyReleased=flags[0].learning_rewards_enabled===true;
  const everyoneReviewed=rows.every(x=>x.published===true&&x.reviewed_by&&x.reviewed_at);
  const enabled=officiallyReleased&&everyoneReviewed;
  return answer({ok:true,revision:REVISION,catalogSource:'server_authoritative_supabase',
   enabled,status:enabled?'active':'planned_not_yet_earnable',
   currency:'Crownlight Lumens',lab:2,bootcamps,
   itemCount:rows.length,
   notice:enabled?'Awards require independent protected assessment evidence.':
    'Catalog figures are proposed amounts only; no learning-completion Lumens can currently be earned or granted.'});
 }catch{return answer({ok:false,enabled:false,error:'Reward catalog is temporarily unavailable; no earning amount is promised.'},503)}
}
