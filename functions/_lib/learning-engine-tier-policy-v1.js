/* SMFGU-ENGINES-ENTITLEMENTS-001 V1 — Owner policy target labels only.
 * No checkout price, premium feature grant, member ledger, quiz or database writes.
 * Shared Learning v3.3, Shared Lab v3.2 and Talia Tutor are THREE independent
 * future add-on product families; their target editions do NOT imply release.
 */
export const ENGINE_FAMILIES=Object.freeze(['learning','lab','tutor']);
const basic=Object.freeze({learning:'BASIC',lab:'BASIC',tutor:'FOUNDATION'});
const advanced=Object.freeze({learning:'ADVANCED',lab:'ADVANCED',tutor:'ADVANCED'});
const pro=Object.freeze({learning:'PROFESSIONAL',lab:'PROFESSIONAL',tutor:'PROFESSIONAL'});
const enterprise=Object.freeze({learning:'ENTERPRISE',lab:'ENTERPRISE',tutor:'ENTERPRISE'});
const onDemand=Object.freeze({learning:'PRODUCT_DEPENDENT',lab:'PRODUCT_DEPENDENT',tutor:'PRODUCT_DEPENDENT'});
const unassigned=Object.freeze({learning:'UNASSIGNED',lab:'UNASSIGNED',tutor:'UNASSIGNED'});
export const TARGET_TIERS=Object.freeze({
 FREE:basic,FOUNDING_14:basic,PICK_WHAT_YOU_WANT:basic,
 FOUNDING_30:advanced,
 FOUNDING_60:pro,FULL_MONTHLY:pro,
 LIFETIME:enterprise,
 ONDEMAND_MONTHLY:onDemand
});
// FULL_ANNUAL and old FOUNDING_MONTHLY / FOUNDING_ANNUAL were not assigned
// independently in the Nov 1 Owner directive. Do not assume an upgrade.
export function enginePolicyForPlan(planCode){
 const code=String(planCode||'').trim().toUpperCase();
 const target=TARGET_TIERS[code]||unassigned;
 const basedOnProduct=code==='ONDEMAND_MONTHLY';
 const basicIncluded=['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT'].includes(code);
 const recognized=Object.hasOwn(TARGET_TIERS,code);
 return{
  target:{...target},source:'owner_policy_20261101',recognized,
  basicIncluded,requiresVerifiedProduct:basedOnProduct,
  releaseState:recognized?'target_recorded_premium_not_released':'owner_assignment_required',
  independentlyUpgradeable:ENGINE_FAMILIES.slice(),
  // Basic explanations, worked maths, correction, free retries and independent
  // assessment protection must remain intact for every entitled Lab.
  equalTeachingQualityWithinAccessibleLesson:true,
  effectiveCapabilities:{learning:'BASIC',lab:'BASIC',tutor:'FOUNDATION'},
  premiumFeaturesReleased:false,
  addOnCheckoutEnabled:false,
  nextAction:recognized?'Release-gate each engine family and configure a separately authorized add-on entitlement, price, checkout and revocation lifecycle before sale.':
   'Owner must explicitly approve a tier for this legacy plan; no implicit upgrade.'
 };
}
