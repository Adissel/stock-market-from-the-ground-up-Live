// Central reward publication policy. No client inputs are an authority for awards.
// Not connected to a balance mutation or a member-initiated RPC.
export const REWARD_POLICY_VERSION='2026-10-31-draft-v1';
export const awardPolicy=Object.freeze({
 enabled:false,
 currency:'Crownlight Lumens',
 minAward:0,
 eligibility:'server_verified_independently_reviewed_completion',
 scopeTypes:Object.freeze(['canonical_lab','academy_program']),
 excluded:Object.freeze(['ungraded_reflection','answer_reveal','skip','client_progress_percent','unreviewed_assessment']),
 nonExpiring:true,
 perCompletionIdempotency:'user_id:scope_type:scope_id:approved_revision',
 memberFacingAmount:null
});
export function validRewardDefinition(row){
 return row&&typeof row==='object'&&
  awardPolicy.scopeTypes.includes(row.scopeType)&&
  typeof row.scopeId==='string'&&/^[a-zA-Z0-9_-]{2,100}$/.test(row.scopeId)&&
  Number.isSafeInteger(row.amount)&&row.amount>0&&row.amount<=100000&&
  row.approved===true&&typeof row.approvedRevision==='string'&&
  row.approvedRevision.length>0&&row.serverEvidenceRequired===true;
}
export function rewardPreview(row){
 return awardPolicy.enabled&&validRewardDefinition(row)
  ?{published:true,lumens:row.amount,scopeId:row.scopeId}
  :{published:false,lumens:null,reason:'Reward amount is not yet approved and active.'};
}
