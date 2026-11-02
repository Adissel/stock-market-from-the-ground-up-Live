import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const academy=readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
const begin=academy.indexOf(' function validAcademyProgressRecords(');
const end=academy.indexOf('\n async function open(',begin);
assert.ok(begin>0&&end>begin,'Member validator declaration must be present before Academy open');
// Execute the production function unchanged, not a duplicate test-only implementation.
const validate=runInNewContext(academy.slice(begin,end)+'\n validAcademyProgressRecords',{},{timeout:1000});
test("01 Accept empty first-time progress",()=>{
 assert.equal(validate([],'free5',5,'member-A'),true);
});
test("02 Accept day-one checkpoint",()=>{
 assert.equal(validate([{"day":1,"status":"in_progress"}],'free5',5,'member-A'),true);
});
test("03 Accept final-day checkpoint",()=>{
 assert.equal(validate([{"day":5,"status":"reflection_saved"}],'free5',5,'member-A'),true);
});
test("04 Accept distinct completed days",()=>{
 assert.equal(validate([{"day":1},{"day":2},{"day":5}],'free5',5,'member-A'),true);
});
test("05 Accept matching camel-case program",()=>{
 assert.equal(validate([{"day":1,"programCode":"free5"}],'free5',5,'member-A'),true);
});
test("06 Accept matching snake-case program",()=>{
 assert.equal(validate([{"day":1,"program_code":"free5"}],'free5',5,'member-A'),true);
});
test("07 Accept matching userId",()=>{
 assert.equal(validate([{"day":1,"userId":"member-A"}],'free5',5,'member-A'),true);
});
test("08 Accept matching user_id",()=>{
 assert.equal(validate([{"day":1,"user_id":"member-A"}],'free5',5,'member-A'),true);
});
test("09 Accept matching memberId",()=>{
 assert.equal(validate([{"day":1,"memberId":"member-A"}],'free5',5,'member-A'),true);
});
test("10 Accept matching member_id",()=>{
 assert.equal(validate([{"day":1,"member_id":"member-A"}],'free5',5,'member-A'),true);
});
test("11 Reject null progress response",()=>{
 assert.equal(validate(null,'free5',5,'member-A'),false);
});
test("12 Reject null checkpoint record",()=>{
 assert.equal(validate([null],'free5',5,'member-A'),false);
});
test("13 Reject zero day",()=>{
 assert.equal(validate([{"day":0}],'free5',5,'member-A'),false);
});
test("14 Reject day exceeding curriculum",()=>{
 assert.equal(validate([{"day":6}],'free5',5,'member-A'),false);
});
test("15 Reject fractional day",()=>{
 assert.equal(validate([{"day":1.5}],'free5',5,'member-A'),false);
});
test("16 Reject duplicate-day checkpoints",()=>{
 assert.equal(validate([{"day":2},{"day":2}],'free5',5,'member-A'),false);
});
test("17 Reject wrong camel-case program",()=>{
 assert.equal(validate([{"day":1,"programCode":"truth5"}],'free5',5,'member-A'),false);
});
test("18 Reject wrong snake-case program",()=>{
 assert.equal(validate([{"day":1,"program_code":"truth5"}],'free5',5,'member-A'),false);
});
test("19 Reject different account userId",()=>{
 assert.equal(validate([{"day":1,"userId":"member-B"}],'free5',5,'member-A'),false);
});
test("20 Reject different account member_id",()=>{
 assert.equal(validate([{"day":1,"member_id":"member-B"}],'free5',5,'member-A'),false);
});
