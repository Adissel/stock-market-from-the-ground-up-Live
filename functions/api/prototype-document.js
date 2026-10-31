/* Strict owner/admin document delivery. Authentication is a bearer header, never URL/cookie.
 * Static prototype.html is not returned from public navigation; the authorized
 * document is fetched from the Pages ASSETS binding after independent role checks.
 */
import {verifyPrototypeStaff} from './prototype-training-cases.js';
const headers={
 'cache-control':'private, no-store, max-age=0',
 'pragma':'no-cache',
 'x-robots-tag':'noindex, nofollow, noarchive',
 'x-content-type-options':'nosniff',
 'referrer-policy':'no-referrer',
 'x-frame-options':'DENY',
 'vary':'Authorization',
 'content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'"
};
const fail=(status,message)=>new Response(JSON.stringify({ok:false,error:message}),{status,headers:{...headers,'content-type':'application/json; charset=utf-8'}});
export async function onRequest({request,env}){
 if(request.method!=='GET')return fail(405,'Method not allowed');
 try{
  const verdict=await verifyPrototypeStaff(request,env);
  if(verdict.status!==200)return fail(verdict.status===401?401:verdict.status===403?403:503,'Prototype document unavailable for this account');
  if(!env.ASSETS?.fetch)return fail(503,'Pages asset service unavailable');
  const assetUrl=new URL('/prototype.html',request.url);
  const source=await env.ASSETS.fetch(new Request(assetUrl.toString(),{method:'GET'}));
  if(!source.ok)return fail(503,'Protected document source unavailable');
  const html=await source.text();
  if(!html.includes('id="pt-app" hidden')||!html.includes('/assets/js/prototype-center-v1.js'))return fail(503,'Invalid protected prototype source');
  return new Response(html,{status:200,headers:{...headers,'content-type':'text/html; charset=utf-8'}});
 }catch{return fail(503,'Prototype authorization service unavailable')}
}
