/* SECURITY RETIREMENT — no privileged QA execution remains.
 * Signed GitHub OIDC acceptance run 41236465069 completed successfully.
 * Two noncommercial Standard and Professional GoTrue members were deleted.
 * No permanent identity/entitlement elevation, Stripe payment, or Lumen debit.
 * Do not restore account-provisioning logic without reviewed narrow QA scope.
 */
Deno.serve(()=>new Response(JSON.stringify({ok:false,error:'One-time real browser QA retired'}),{
 status:410,headers:{'content-type':'application/json','cache-control':'no-store',
 'x-content-type-options':'nosniff'}
}));
