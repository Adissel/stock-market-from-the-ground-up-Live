import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync('.github/workflows/bootcamp-247-editorial-preflight-v1.yml','utf8');

test('curriculum tests and artifact upload remain mandatory before passing evidence',()=>{
 assert.match(workflow,/Verified source structural and authored curriculum regressions/);
 assert.match(workflow,/Save 247 unit-by-unit nonapproving review register/);
 assert.match(workflow,/if: success\(\)/);
});

test('missing legacy issue cannot convert passing source tests into a false curriculum failure',()=>{
 const commands=[...workflow.matchAll(/gh issue comment 157[^\n]+/g)].map(x=>x[0]);
 assert.equal(commands.length,2);
 for(const command of commands)assert.match(command.trimEnd(),/\|\|$/);
 assert.match(workflow,/Issue #157 is unavailable in this repository/);
 assert.match(workflow,/original failing step and logs remain authoritative/);
});
