/* Original Tutor source prototype, NOT member-authorized production access.
 * A verified first public observation is a separate server-evidence field;
 * EDGAR acceptance and fiscal period end cannot substitute for that field.
 * No learner grade, premium entitlement, paid inference or progress write.
 */
const held=Object.freeze({status:'source_prototype_not_released',visible:false,
 reason:'verified_public_observation_required',hasFutureInformation:false,
 officialGrade:false,premiumEntitlementGranted:false});
export function draftHistoricalFilingVisibility({periodEnd,edgarAcceptedAt,firstObservedPublicAt,asOf,verifiedServerEvidence}={}){
 if(verifiedServerEvidence!==true||![periodEnd,edgarAcceptedAt,firstObservedPublicAt,asOf].every(Number.isSafeInteger))
  return held;
 if(periodEnd<0||edgarAcceptedAt<periodEnd||firstObservedPublicAt<edgarAcceptedAt||asOf<0)
  return held;
 if(firstObservedPublicAt>asOf)
  return Object.freeze({...held,reason:'first_observed_public_evidence_after_replay_cutoff'});
 return Object.freeze({status:'source_prototype_not_released',visible:true,asOf,
  firstObservedPublicAt,reason:'verified_observation_no_later_than_cutoff',
  hasFutureInformation:false,officialGrade:false,premiumEntitlementGranted:false});
}
