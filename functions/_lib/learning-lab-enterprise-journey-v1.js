/* SMFGU-ENTERPRISE-RESEARCH-JOURNEY-001
 * Read-only source candidate composed from existing Academy program/day IDs.
 * No automatic grade, progress write, market data, purchase, or book access.
 */
import {academyPrograms} from './bootcamp-academy-v014168.js';
export const JOURNEY_SCHEMA='smfgu.learning.lab.enterprise-journey.v1';
const stages=Object.freeze([
 ['foundations30',1,'Define observable evidence and limitations'],
 ['charts45',12,'Examine completed chart structure'],
 ['risk60',15,'Specify risk and invalidation'],
 ['indicators10',5,'Compare indicator assumptions'],
 ['tape10',7,'Separate observations from inference'],
 ['filings7',4,'Check source publication and rights'],
 ['practicum90',45,'Transfer method and disclose uncertainty']
]);
const safeId=s=>typeof s==='string'&&/^(?:(?:F[123]|DT|TAPE)-C[0-9]+-L[0-9]+|SITE-[0-9]+)$/.test(s);
export function buildEnterpriseResearchJourney({authorization,family,
 trainingAuthorized=false,labAuthorized=false,publishedLabs=[]}={}){
 if(authorization?.ok!==true||authorization.edition!=='ENTERPRISE'||
  authorization.family!==family||!['learning','lab'].includes(family)||
  typeof trainingAuthorized!=='boolean'||typeof labAuthorized!=='boolean'||
  !Array.isArray(publishedLabs)||publishedLabs.length>500)return null;
 const visible=new Set();
 for(const l of publishedLabs){
  if(!l||!safeId(l.lab_id)||l.active!==true||
   l.registry_visible!==true||visible.has(l.lab_id))return null;
  visible.add(l.lab_id);
 }
 const programs=new Map(academyPrograms.map(p=>[p.code,p]));
 if(programs.size!==10||academyPrograms.reduce((n,p)=>n+p.curriculum.length,0)!==274)return null;
 const rows=[];
 for(const [index,[code,dayNumber,phase]] of stages.entries()){
  const p=programs.get(code),day=p?.curriculum?.[dayNumber-1];
  if(!p||p.days!==p.curriculum.length||day?.day!==dayNumber||
   day.programCode!==code||day.officiallyGraded!==false||
   typeof day.title!=='string'||!day.title.trim()||
   !/^bootcamp(?:-academy)?\.html(?:\?program=[a-z0-9]+)?$/.test(p.route))return null;
  const optional=[],seen=new Set();
  for(const ref of day.relatedLabs||[]){
   if(!labAuthorized||optional.length>=2)break;
   const id=ref?.id;
   if(!safeId(id)||!visible.has(id)||seen.has(id))continue;
   seen.add(id);
   optional.push(Object.freeze({labId:id,href:'labs.html?open='+encodeURIComponent(id),
    matchingBookEntitlementStillRequired:true,graded:false}));
  }
  const href=trainingAuthorized?(code==='foundations30'?p.route:
   p.route+'&day='+dayNumber):null;
  rows.push(Object.freeze({number:index+1,phase,programCode:code,
   programTitle:p.title,day:dayNumber,dayTitle:day.title,
   trainingHref:href,trainingLocked:!trainingAuthorized,
   optionalPublishedLabs:Object.freeze(optional),officialGrade:false,
   independentCompletionRecorded:false}));
 }
 return Object.freeze({schema:JOURNEY_SCHEMA,family,edition:'ENTERPRISE',
  stages:Object.freeze(rows),academyPrograms:10,academyDays:274,
  bookLinksAreNotEntitlements:true,marketDataLicensed:false,readOnly:true,
  graded:false,masteryAwarded:false,
  boundary:'Academy links require training rights. Optional Labs require separate matching book entitlements. This ungraded preview does not publish protected lessons, data feeds, assessments, or forecasts.'});
}
