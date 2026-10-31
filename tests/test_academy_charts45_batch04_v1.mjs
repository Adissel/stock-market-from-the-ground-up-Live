import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const p=academyPrograms.find(x=>x.code==='charts45');
assert.equal(p.curriculum.length,45);
assert(p.curriculum.every(d=>d.lesson?.status==='ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING'));
console.log('PASS 45 original course-day draft cases; acceptance pending');
