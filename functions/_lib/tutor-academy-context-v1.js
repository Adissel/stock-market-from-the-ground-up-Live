/* Authenticated Academy context for the existing Market Tutor.
 * The browser may request a canonical program/day/stage, but only this server
 * registry supplies titles, competencies and sequence references. No lesson
 * body, reflection, assessment answer or completion claim crosses this seam.
 */
import {academyByCode} from './bootcamp-academy-v014168.js';
import {academyBetaCourse} from './academy-three-camps-beta-access-v1.js';

const REQUEST=/^Academy program: ([a-z0-9]{3,24})\. Study day: (\d{1,3})\. Instructional stage: (Start|Learn|Experiment|Predict|Practice|Assess|Review|Transfer|Results)\.\s*/;
const draftPrograms=new Set(['tape10','indicators10','filings7']);
const fail=(message,status)=>Object.assign(new Error(message),{status});

export function parseAcademyTutorRequest(question=''){
 const text=String(question||'');
 const match=text.match(REQUEST);
 if(!match)return null;
 return {programCode:match[1],day:Number(match[2]),requestedStage:match[3],question:text.slice(match[0].length)};
}

export function resolveAcademyTutorContext({question,academyAccess,env,userId}){
 const requested=parseAcademyTutorRequest(question);
 if(!requested)return null;
 const program=academyByCode[requested.programCode];
 if(!program||!Number.isSafeInteger(requested.day)||requested.day<1||requested.day>program.days)
  throw fail('Unknown Academy learning context.',404);
 const beta=draftPrograms.has(requested.programCode)&&academyBetaCourse(env,requested.programCode,userId);
 const released=env?.ACADEMY_THREE_CAMPS_ENABLED==='true';
 if(draftPrograms.has(requested.programCode)&&!released&&!beta)
  throw fail('Unknown Academy learning context.',404);
 const free=requested.programCode==='free5';
 if(!academyAccess?.userId||(free?academyAccess.freeEligible!==true:
   academyAccess.authorized!==true&&!(beta&&academyAccess.freeEligible===true)))
  throw fail('Authorized Academy access is required for this Tutor context.',403);
 const day=program.curriculum[requested.day-1];
 if(!day||day.programCode!==requested.programCode||day.day!==requested.day)
  throw fail('Academy curriculum context could not be verified.',503);
 return Object.freeze({
  programCode:program.code,programTitle:program.title,day:day.day,dayTitle:day.title,
  requestedStage:requested.requestedStage,registeredPhase:day.phase||'learn',
  phaseLabel:day.phaseLabel||'Guided learning',
  competencyCodes:Array.isArray(day.competencies)?day.competencies.filter(x=>typeof x==='string').slice(0,8):[],
  prerequisiteDay:day.day>1?day.day-1:null,
  prerequisiteStatus:day.day>1?'sequence_reference_only_not_completion_verified':'program_entry',
  progressVerified:false,officiallyGraded:false,masteryAwarded:false,
  returnUrl:'/bootcamp-academy.html?program='+encodeURIComponent(program.code)+'&day='+day.day,
  query:(day.title+' '+requested.question).slice(0,450)
 });
}
