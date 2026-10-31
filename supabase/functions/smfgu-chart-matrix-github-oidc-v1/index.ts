/* Retired one-time production QA authorization route.
 * GitHub Actions 41233580742 verified two distinct GoTrue-authenticated
 * Standard/Professional QA members and cross-account isolation. Both test
 * identities were deleted. Privileged Auth Admin code is NOT deployed.
 */
Deno.serve(()=>new Response(JSON.stringify({ok:false,error:'One-time Chart Studio QA completed; endpoint permanently retired.'}),{
 status:410,headers:{'content-type':'application/json','cache-control':'no-store',
 'x-content-type-options':'nosniff'}
}));
