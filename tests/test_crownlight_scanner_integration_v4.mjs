import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('advanced-tool.html','utf8');
const visual=readFileSync('assets/js/crownlight-scanner-visual-v1.js','utf8');
const watch=readFileSync('assets/js/watchlist-sec-research-v1.js','utf8');
const advance=readFileSync('assets/js/advanced-tools.js','utf8');
const requirements=[
 ['crownlight-scanner-rules-v1.js','crownlight-scanner-handoff-v4.js'],
 ['crownlight-scanner-handoff-v4.js','crownlight-scanner-visual-v1.js'],
 ['crownlight-scanner-visual-v1.js','advanced-tools.js'],
 ['crownlight-scanner-sec-evidence-v1.js','crownlight-scanner-sec-brief-v4.js'],
 ['crownlight-scanner-sec-brief-v4.js','watchlist-sec-research-v1.js']
];
for(const [a,b] of requirements)assert(html.includes(a)&&html.indexOf(a)<html.indexOf(b),a+' must precede '+b);
assert(html.includes('crownlight-scanner-handoff-v4.css'));
assert(visual.includes('CrownlightScannerHandoffV4?.makeCell'));
assert(watch.includes('CrownlightScannerSecBriefV4?.mount'));
assert(advance.includes("case'SCANNER_BUILDER':return universeWorkbench(true)"));
assert(advance.includes("case'WATCHLIST_WORKBENCH':return renderWatchlist()"));
assert(advance.includes("const response=await fetch('/api/advanced-tool-access-v014110"));
assert(watch.includes("'/api/sec-issuer-research-v1?symbol='"));
assert(watch.includes("current?.user?.id!==uid"));
assert(!/fetch\s*\(|localStorage/.test(readFileSync('assets/js/crownlight-scanner-handoff-v4.js','utf8')));
console.log('PASS scanner Wave4: authentic existing entitlement route, visual results and SEC read-only integration');
