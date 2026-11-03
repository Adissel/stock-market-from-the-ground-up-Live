import assert from 'node:assert/strict';
import { academyByCode } from '../functions/_lib/bootcamp-academy-v014168.js';
import { first22DayLessons } from '../functions/_lib/academy-first22-teaching-v1.js';

const program = academyByCode.watchlist7;
const ids = new Set();
assert.equal(program.curriculum.length, 7);

for (let index = 0; index < 7; index += 1) {
  const lesson = program.curriculum[index].lesson;
  const original = first22DayLessons.watchlist7[index];
  for (const [key, value] of Object.entries(original)) assert.strictEqual(lesson[key], value);
  assert.equal(lesson.formativeQuestions.length, 12);
  assert.equal(lesson.advancedPracticums.length, 1);
  assert.match(lesson.reference.url, /^https:\/\//);
  for (const question of lesson.formativeQuestions) {
    assert(!ids.has(question.id));
    ids.add(question.id);
    assert(question.prompt.length >= 30);
    assert(question.review.length >= 30);
  }
  const numeric = lesson.advancedNumericChecks[0];
  const actual = numeric.operation === 'difference' ? numeric.a - numeric.b : numeric.a / numeric.b * 100;
  assert(Math.abs(actual - numeric.expected) < 1e-9);
  assert.equal(program.curriculum[index].officiallyGraded, false);
  assert.equal(program.curriculum[index].masteryAwarded, false);
}

assert.equal(ids.size, 84);
console.log('PASS Watchlist7 advanced seven days: 84 prompts, seven cases/calculations, frozen original lineage, no grading.');
