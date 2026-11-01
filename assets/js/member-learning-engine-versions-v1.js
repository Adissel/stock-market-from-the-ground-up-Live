/* Public engine dispatcher for a server-selected member presentation version. */
(()=>{'use strict';
const root='/assets/learning-versions/20261101-free-v33-v32/js/';
const frozen={learning:'LEARNING_V33_FREEZE_20261101',lab:'LAB_V32_FREEZE_20261101',tutor:'TALIA_FREEZE_20261101'};
const files={lab:['lab-engine-v32-teaching.js','lab-v32-synthetic-replay.js','lab-v33-workspace-flow.js'],tutor:['lab-v33-instructor.js'],learning:['lab-v33-grade-display.js','lab-engine-v32-universal.js','lab-journey-checkpoint-v33.js']};
let last=null;
function script(src){return new Promise((resolve,reject)=>{const node=document.createElement('script');node.src=src;node.async=false;node.onload=()=>{node.remove();resolve()};node.onerror=()=>{node.remove();reject(Error('Required lesson engine did not load'))};document.head.appendChild(node)})}
async function configure(session,stillCurrent){
 let data;
 try{const r=await fetch('/api/member-learning-engine-versions',{headers:session?.access_token?{authorization:'Bearer '+session.access_token}:{},cache:'no-store'});
 data=await r.json();if(!r.ok||!data?.ok)throw Error('Version lookup unavailable');
 }catch{data={planCode:'FREE',versions:{...frozen},source:'unverified_free_fallback'}}
 if(stillCurrent&&!stillCurrent())return null;
 for(const key of ['lab','tutor','learning']){
  const isFrozen=data.versions[key]===frozen[key],wasFrozen=last?.[key]===frozen[key];
  if(!isFrozen&&!wasFrozen)continue;
  for(const file of files[key]){
   await script((isFrozen?root:'/assets/js/')+file);
   if(stillCurrent&&!stillCurrent())return null;
  }
 }
 last={...data.versions};
 const badge=document.getElementById('player-shell-badge');
 if(badge)badge.textContent='LEARNING v3.3 · '+(data.source==='unverified_free_fallback'?'Free fallback':['FREE','PICK_WHAT_YOU_WANT'].includes(data.planCode)?'Foundational':'Member');
 return data;
}
window.GroundUpMemberEngineVersions=Object.freeze({configure});
})();
