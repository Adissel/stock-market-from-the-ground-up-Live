/* Shared, same-origin Supabase browser client.
 * Cloudflare Pages publishes pinned MIT-licensed Supabase UMD during the build.
 * No runtime dependency on jsDelivr, unpkg, or other third-party module CDNs.
 */
let siteSupabaseClient = null;
let siteSupabaseClientPending = null;
let siteSupabaseVendorPending = null;
const SITE_SUPABASE_VENDOR = '/assets/vendor/supabase-js/2.109.0/supabase.js';

function siteSupabaseFactory() {
  return window.supabase && typeof window.supabase.createClient === 'function'
    ? window.supabase.createClient : null;
}

function loadSiteSupabaseVendor() {
  if (siteSupabaseFactory()) return Promise.resolve(siteSupabaseFactory());
  if (siteSupabaseVendorPending) return siteSupabaseVendorPending;
  siteSupabaseVendorPending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SITE_SUPABASE_VENDOR;
    script.async = true;
    script.dataset.siteSupabaseVendor = '1';
    script.onload = () => {
      const createClient = siteSupabaseFactory();
      if (createClient) resolve(createClient);
      else reject(new Error('Local sign-in runtime did not export createClient.'));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error('Local sign-in runtime failed to load. Reload the page.'));
    };
    (document.head || document.documentElement).append(script);
  });
  // All simultaneous callers observe one pending request; retry is allowed after failure.
  siteSupabaseVendorPending.catch(() => { siteSupabaseVendorPending = null; });
  return siteSupabaseVendorPending;
}

async function getSupabaseClient() {
  if (siteSupabaseClient) return siteSupabaseClient;
  if (siteSupabaseClientPending) return siteSupabaseClientPending;
  const c = window.SITE_CONFIG || {};
  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return null;
  siteSupabaseClientPending = (async () => {
    const createClient = await loadSiteSupabaseVendor();
    siteSupabaseClient = createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return siteSupabaseClient;
  })();
  try { return await siteSupabaseClientPending; }
  finally { siteSupabaseClientPending = null; }
}

window.getSupabaseClient = getSupabaseClient;
