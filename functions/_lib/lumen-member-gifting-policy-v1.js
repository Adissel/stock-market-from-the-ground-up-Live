// Deferred V2 feature. Member-to-member Lumen transfers are out of V1 scope.
// Keep all transfer and recipient-consent controls fail-closed in V1.
export const giftingPolicy=Object.freeze({
 enabled:false,releasePhase:'V2_DEFERRED',minLumens:10,maxLumens:200,
 recipient:'verified_opt_in_username',
 sender:'authenticated_member',
 cashOut:false,marketplaceResale:false,
 prerequisites:Object.freeze(['recipient_opt_in','account_eligibility','source_bucket_policy',
 'atomic_debit_credit','one_use_idempotency','ledger_audit','rate_limit',
 'velocity_and_cycle_detection','legal_approval','dispute_and_reversal_policy'])
});
export function validateGiftAmount(value){
 return Number.isSafeInteger(value)&&value>=giftingPolicy.minLumens&&value<=giftingPolicy.maxLumens;
}
export function giftAvailability(){
 return {enabled:giftingPolicy.enabled,min:giftingPolicy.minLumens,
 max:giftingPolicy.maxLumens,
 message:'Member-to-member Lumen gifting is deferred to a future release and is unavailable in V1.'};
}
