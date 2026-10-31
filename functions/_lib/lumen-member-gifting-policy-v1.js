// Member-to-member gifting policy: disabled until an audited atomic ledger
// procedure, verified recipient lookup, abuse controls and legal approval exist.
export const giftingPolicy=Object.freeze({
 enabled:false,minLumens:10,maxLumens:200,
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
 message:'Lumen gifting is under development and cannot be submitted.'};
}
