import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
test('classroom offers all approved perspectives and gradual-release methods',()=>{
 for(const item of ['Understand','Recognize','Apply','Common Mistake','Limitations'])assert.ok(source.includes("'"+item+"'"),item);
 for(const item of ['I DO','WE DO','YOU DO','REVIEW','TRANSFER'])assert.ok(source.includes("'"+item+"'"),item);
 assert.match(source,/Instructional perspective:.*Method:/);
 assert.match(source,/question:labQuestion\(instructionalQuestion\(q\)\)/);
});
test('instruction controls remain ungraded, bounded and scrubbed on identity change',()=>{
 assert.match(source,/\.slice\(0,450\):q/);
 assert.match(source,/setPerspective\('Understand'\);setMethod\('I DO'\)/);
 assert.match(source,/this prototype does not assign scores/);
 assert.doesNotMatch(source,/masteryAwarded:true|officialGrade:true/);
});
