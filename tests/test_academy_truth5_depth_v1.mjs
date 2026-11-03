import assert from 'node:assert/strict';
import { academyByCode, truth5Lessons } from '../functions/_lib/bootcamp-academy-v014168.js';

const program = academyByCode.truth5;
const ids = new Set();

for (let index = 0; index < 5; index += 1) {
  const lesson = program.curriculum[index].lesson;
  const original = truth5Lessons[index];
  for (const [key, value] of Object.entries(original)) assert.strictEqual(lesson[key], value);
  assert.equal(lesson.formativeQuestions.length, 12);
  assert.equal(lesson.advancedPracticums.length, 1);
  for (const question of lesson.formativeQuestions) {
    assert(!ids.has(question.id));
    ids.add(question.id);
  }
  const numeric = lesson.advancedNumericChecks[0];
  const actual = numeric.operation === 'difference' ? numeric.a - numeric.b : numeric.a / numeric.b * 100;
  assert(Math.abs(actual - numeric.expected) < 1e-8);
  assert.equal(program.curriculum[index].officiallyGraded, false);
}

assert.equal(ids.size, 60);
console.log('PASS Truth5 advanced five days: 60 prompts, five cases/calculations, frozen lineage, no grading.');
