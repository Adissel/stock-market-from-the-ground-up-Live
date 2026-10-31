/* Public proposed earning amounts; no credit issuance and no promised active rewards. */
import {awardPolicy,PLANNED_LUMEN_AMOUNT_V1} from '../_lib/lumen-learning-award-policy-v1.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=90','x-content-type-options':'nosniff'};
export async function onRequest({request}){
 if(request.method!=='GET')return new Response(JSON.stringify({ok:false,error:'Method not allowed'}),{status:405,headers:H});
 return new Response(JSON.stringify({ok:true,enabled:awardPolicy.enabled===true,
  status:awardPolicy.enabled?'active':'planned_not_yet_earnable',
  currency:'Crownlight Lumens',
  lab:PLANNED_LUMEN_AMOUNT_V1.canonicalLab,
  bootcamps:PLANNED_LUMEN_AMOUNT_V1.bootcamp,
  notice:awardPolicy.enabled?'Official awards require independently reviewed completion.':
   'Proposed amounts only. No learning-completion Lumens can currently be earned or granted.'}),{headers:H});
}
