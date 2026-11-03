/* SMFGU-LELAB-SCORECARD-V2 — evidence categories, not launch percentages.
 * Do not convert source presence into authenticated member acceptance.
 * Do not use this scorecard to turn on any production entitlement.
 */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const EDITIONS=Object.freeze(['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE']);
export const FAMILIES=Object.freeze(['learning','lab']);
export const SOURCE_STATES=Object.freeze(['integrated','partial','prototype','not_implemented']);

export function summarizeFeatureEvidence(audit){
 if(!audit||!Array.isArray(audit.features)||audit.features.length!==64)
  throw new Error('Expected 64 canonical Learning/Lab requirements');
 const idSet=new Set(),byEdition={},features=audit.features;
 const zeros=()=>({total:0,integrated:0,partial:0,prototype:0,not_implemented:0,
  sourceCovered:0,realMemberAccepted:0,independentReleaseAccepted:0});
 for(const family of FAMILIES)for(const edition of EDITIONS)
  byEdition[family+'_'+edition]=zeros();
 const totals=zeros();
 for(const feature of features){
  if(!feature||!/^L[EA]-(?:BAS|ADV|PRO|ENT)-0[1-8]$/.test(feature.id)||
    idSet.has(feature.id))throw new Error('Invalid or duplicate feature ID');
  idSet.add(feature.id);
  const key=feature.engine+'_'+feature.edition;
  if(!Object.hasOwn(byEdition,key)||!SOURCE_STATES.includes(feature.source_status))
   throw new Error(feature.id+': invalid edition or source state');
  if(typeof feature.acceptance_criterion!=='string'||!feature.acceptance_criterion.trim())
   throw new Error(feature.id+': missing acceptance criterion');
  if(typeof feature.real_member_accepted!=='boolean'||
     typeof feature.independent_release_accepted!=='boolean')
   throw new Error(feature.id+': acceptance must be explicitly boolean');
  if(feature.independent_release_accepted &&
     (!feature.real_member_accepted||feature.source_status!=='integrated'))
   throw new Error(feature.id+': release cannot precede member evidence and integration');
  for(const target of [byEdition[key],totals]){
   target.total++;
   target[feature.source_status]++;
   if(feature.source_status!=='not_implemented')target.sourceCovered++;
   if(feature.real_member_accepted)target.realMemberAccepted++;
   if(feature.independent_release_accepted)target.independentReleaseAccepted++;
  }
 }
 for(const family of FAMILIES)for(const edition of EDITIONS){
  const key=family+'_'+edition,row=byEdition[key],stored=audit.counts?.[key];
  if(row.total!==8)throw new Error(key+': expected exactly 8 requirements');
  if(stored){
   for(const state of SOURCE_STATES)if(stored[state]!==row[state])
    throw new Error(key+': stale source count for '+state);
  }
  row.sourceCoveragePercent=100*row.sourceCovered/row.total;
  row.integratedPercent=100*row.integrated/row.total;
  row.memberAcceptedPercent=100*row.realMemberAccepted/row.total;
  row.releaseAcceptedPercent=100*row.independentReleaseAccepted/row.total;
 }
 for(const target of [totals]){
  for(const field of ['sourceCovered','integrated','realMemberAccepted','independentReleaseAccepted'])
   target[field+'Percent']=100*target[field]/target.total;
 }
 return {
  schema:'smfgu.learning-lab.scorecard.v2',
  basis:'64 individual Learning/Lab edition requirements, not the whole website',
  warning:'Source coverage is not release approval. Member acceptance must be independently evidenced.',
  frozen:{learningBasic:audit.frozen?.learningBasic,labBasic:audit.frozen?.labBasic,
   labIds:audit.frozen?.labIds,competencies:audit.frozen?.competencies},
  totals,byEdition,
  sourceAuditVersion:audit.version
 };
}
export function loadScorecard(path=fileURLToPath(new URL('../data/learning-lab-engine-feature-audit-v1.json',import.meta.url))){
 return summarizeFeatureEvidence(JSON.parse(readFileSync(resolve(path),'utf8')));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
 console.log(JSON.stringify(loadScorecard(),null,2));
