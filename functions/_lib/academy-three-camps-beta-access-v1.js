/* Invite-only instructional Beta for the three new Academy programs.
 * Distinct from ACADEMY_THREE_CAMPS_ENABLED (general release).
 * Do not grant paid entitlement, publish private grading keys, or award mastery.
 * Tester IDs are server-controlled Cloudflare bindings, never sent to clients.
 */
export const newAcademyPrograms=Object.freeze(new Set(['tape10','indicators10','filings7']));
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const generalAcademyReleased=env=>env?.ACADEMY_THREE_CAMPS_ENABLED==='true';
export const academyBetaEnabled=env=>env?.ACADEMY_THREE_CAMPS_BETA_ENABLED==='true'&&!generalAcademyReleased(env);
export function academyBetaTester(env,userId){
 if(!academyBetaEnabled(env)||typeof userId!=='string'||!uuid.test(userId))return false;
 const binding=env?.ACADEMY_THREE_CAMPS_BETA_USERS;
 if(typeof binding!=='string'||binding.length>4000)return false;
 const ids=binding.split(',').map(x=>x.trim().toLowerCase());
 if(ids.length<1||ids.length>30||ids.some(x=>!uuid.test(x)))return false;
 if(ids.includes(userId.toLowerCase()))return true;
 // One revocable, server-only, explicitly designated noncommercial QA tester.
 // Preserve the existing encrypted allowlist and never treat QA access as a
 // paid tool entitlement, general course release or protected grading approval.
 const qa=env?.ACADEMY_THREE_CAMPS_BETA_QA_USER;
 const expiry=env?.ACADEMY_THREE_CAMPS_BETA_QA_EXPIRES_AT;
 const deadline=typeof expiry==='string'?Date.parse(expiry):NaN;
 const remaining=deadline-Date.now();
 // Explicitly time-bound single-user supplemental QA. Base invited testers
 // are unaffected; the supplemental account never conveys paid membership.
 return typeof qa==='string'&&uuid.test(qa)&&qa.toLowerCase()===userId.toLowerCase()&&
  Number.isFinite(deadline)&&remaining>0&&remaining<=48*60*60*1000;
}
export const academyBetaCourse=(env,code,userId)=>newAcademyPrograms.has(code)&&academyBetaTester(env,userId);
export const academyCourseAvailable=(env,code,userId)=>!newAcademyPrograms.has(code)||
 generalAcademyReleased(env)||academyBetaCourse(env,code,userId);
