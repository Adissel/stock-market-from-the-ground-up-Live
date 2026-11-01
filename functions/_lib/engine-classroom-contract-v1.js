/* SMFGU-ENGINE-ARCH-001 — one read-only classroom runtime contract for
 * Shared Learning, Shared Lab, and Talia. Target membership edition, member
 * content entitlement and operational capability are THREE separate concepts.
 * This module cannot sell, grant, grade, advance progress or call an AI model.
 */
import {enginePolicyForPlan} from './learning-engine-tier-policy-v1.js';
export const CLASSROOM_SCHEMA='smfgu.classroom.engines.v1';
const SOURCES=Object.freeze({
 learning:Object.freeze(['LEARNING_V33_FREEZE_20261101','LEARNING_V33_CURRENT']),
 lab:Object.freeze(['LAB_V32_FREEZE_20261101','LAB_V32_CURRENT']),
 tutor:Object.freeze(['TALIA_FREEZE_20261101','TALIA_CURRENT'])
});
const BASE=Object.freeze({learning:'BASIC',lab:'BASIC',tutor:'FOUNDATION'});
const abilities=Object.freeze({
 learning:Object.freeze(['first_principles','worked_examples','correction','practice_and_transfer']),
 lab:Object.freeze(['five_subject_facets','fictional_practice','evidence_cutoff','protected_assessment_boundary']),
 tutor:Object.freeze(['source_grounded_explanation','guided_example','try_another','teach_deeper'])
});
/** Read-only presentation contract. Never equate a target policy with an entitlement. */
export function classroomForMember(planCode,selectedVersions){
 const policy=enginePolicyForPlan(planCode);
 const engines={};
 for(const family of ['learning','lab','tutor']){
  const requested=selectedVersions?.[family];
  // Invalid or missing metadata must not silently select a future engine.
  const sourceVersion=SOURCES[family].includes(requested)?requested:SOURCES[family][0];
  engines[family]=Object.freeze({
   sourceVersion,configuredTarget:policy.target[family],
   effectiveEdition:BASE[family],premiumFeaturesReleased:false,
   existingBasicTeaching:Object.freeze([...abilities[family]])
  });
 }
 return Object.freeze({
  schema:CLASSROOM_SCHEMA,releaseState:'basic_only',
  engines:Object.freeze(engines),
  lessonAccess:'separately_authorized_per_member_and_product',
  entitlementGrant:false,officialGradeGrant:false,paidAiGrant:false,
  protectedAnswersIncluded:false,memberProgressModified:false,
  sourceBoundaries:Object.freeze({
   fictionalEvidenceMustBeLabeled:true,
   historicalEvidenceRequiresProvenanceAndRights:true,
   noFutureBarsBeforeDecision:true,
   chartIndicatorsMustIdentifyCalculationLimitations:true
  }),
  teachingQuality:Object.freeze({
   fullFirstPrinciplesForEveryAccessibleLesson:true,
   explanationsAndOrdinaryRetriesDoNotRequireExtraPayment:true,
   premiumAddsToolsNotWithheldBasicUnderstanding:true
  })
 });
}
