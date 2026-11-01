/* Boot Camp stages are private study drafts, not canonical Labs or grades.
 * Uses the existing member Supabase session and an authenticated Worker API.
 */
(function(root){'use strict';
const limit=(s,max=1500)=>typeof s==='string'&&s.length<=max;
function normalize(s){
 if(!s||s.version!==1||s.mode!=='guided'||!Number.isSafeInteger(s.stage)||
  s.stage<0||s.stage>8||!Array.isArray(s.learnerReplies)||s.learnerReplies.length>9)return null;
 const out={version:1,mode:'guided',stage:s.stage},texts=[
  'observations','prediction','practice','transfer','reflection'
 ],flags=['predictionLocked','practiceResolved','practiceAssisted','transferResolved','selfReview'],
 counts=['practiceCount','transferCount'];
 for(const k of texts){if(!limit(s[k]))return null;out[k]=s[k]}
 for(const k of flags){if(typeof s[k]!=='boolean')return null;out[k]=s[k]}
 for(const k of counts){if(!Number.isSafeInteger(s[k])||s[k]<0||s[k]>999)return null;out[k]=s[k]}
 const seen=new Set();
 out.learnerReplies=[];
 for(const row of s.learnerReplies){
  if(!Array.isArray(row)||row.length!==2||!Number.isSafeInteger(row[0])||
   row[0]<0||row[0]>8||seen.has(row[0])||!Array.isArray(row[1])||
   row[1].length>5||row[1].some(v=>!limit(v,500)))return null;
  seen.add(row[0]);out.learnerReplies.push([row[0],[...row[1]]]);
 }
 return out;
}
function create({client,userId,programCode,day,alive}={}){
 if(!client?.auth?.getSession||!/^[-0-9a-f]{36}$/i.test(String(userId||''))||
  !/^[a-z][a-z0-9]{1,25}$/.test(String(programCode||''))||
  !Number.isSafeInteger(day)||day<1||day>90||typeof alive!=='function')return null;
 const valid=()=>alive()===true;
 let revision=0,ready=false,queue=Promise.resolve();
 async function send(method,payload){
  if(!valid())throw Error('Member lesson session changed; no stage draft was stored.');
  const session=(await client.auth.getSession())?.data?.session;
  if(!valid()||!session||session.user?.id!==userId||!session.access_token)
   throw Error('Member session changed. Reopen the lesson before saving.');
  const u='/api/academy-stage-checkpoint';
  const r=await fetch(method==='GET'?u+'?'+new URLSearchParams({program:programCode,day:String(day)}):u,{
   method,cache:'no-store',credentials:'same-origin',
   headers:{authorization:'Bearer '+session.access_token,...(payload?{'content-type':'application/json'}:{})},
   ...(payload?{body:JSON.stringify(payload)}:{})
  });
  const data=await r.json().catch(()=>null);
  if(!valid())throw Error('Member session changed during checkpoint request.');
  if(r.status===409)throw Error('Another device or tab saved a newer draft. Reload this Lab before saving again; no grade changed.');
  if(!r.ok||data?.ok!==true)throw Error(String(data?.error||'Private stage checkpoint unavailable.'));
  return data;
 }
 return {
  async load(){
   if(!valid())return null;
   ready=false;
   const data=await send('GET');
   if(!Number.isSafeInteger(data.revision)||data.revision<0)
    throw Error('Saved stage revision is invalid. No progress was overwritten.');
   const saved=data.snapshot===null?null:normalize(data.snapshot);
   if(data.snapshot!==null&&!saved)throw Error('Saved stage content is invalid. No progress was overwritten.');
   if(saved===null&&data.revision!==0||saved!==null&&data.revision<1)
    throw Error('Saved stage record is inconsistent. No progress was overwritten.');
   revision=data.revision;ready=true;return saved;
  },
  save(raw){
   const snap=normalize(raw);
   if(!snap)return Promise.reject(Error('Invalid ungraded study checkpoint.'));
   queue=queue.catch(()=>{}).then(async()=>{
    if(!ready||!valid())throw Error('Member stage checkpoint was not loaded. Reload before saving.');
    const data=await send('POST',{action:'save',program:programCode,day,snapshot:snap,expectedRevision:revision});
    if(!Number.isSafeInteger(data.saved?.rev)||data.saved.rev!==revision+1)
     throw Error('Stage checkpoint write was not confirmed.');
    revision=data.saved.rev;return data.saved;
   });
   return queue;
  }
 };
}
root.GroundUpAcademyStageCheckpointV1=Object.freeze({create,normalize});
})(typeof window!=='undefined'?window:globalThis);
