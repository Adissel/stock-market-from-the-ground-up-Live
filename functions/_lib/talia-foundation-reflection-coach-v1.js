/* Talia ungraded source-only learning response. No private answers, inference,
 * correctness scoring, PII storage, model calls, entitlements or member writes.
 * Only original published lesson text supplied to existing Foundation Tutor.
 */
const plain=v=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,800):'';
const risk=/\b(?:always|guaranteed?|definitely|certain(?:ly)?|must fill|sure profit|proves?)\b/i;
const uncertain=/\b(?:i do not know|i don't know|not sure|confused|unsure|uncertain|need help|no idea)\b/i;
const math=/\b\d+(?:\.\d+)?\s*(?:%|shares?|dollars?|bps?|bp|times|x\b)|\$\d|\b\d+(?:\.\d+)?\s*(?:\/|\*|\+|-)\s*\d+/i;

/**
 * Classify only the writing signal that is actually present. This is a
 * formative routing aid, not a finding about correctness, cognition, grade or
 * mastery. Verified numerical causes remain the responsibility of the
 * existing authored-fictional practice evaluator.
 */
export function diagnoseFoundationReflection(guide,rawAnswer){
 const g=guide?.editorialTrainingReviewV1;
 if(guide?.foundationTopic!==true||!g||g.independentPublicationApproved!==false)return null;
 const reflection=plain(rawAnswer);
 if(!reflection)return Object.freeze({
  category:'process',status:'insufficient_evidence',evidenceBasis:'no_reasoning_submitted',
  target:'State the observable inputs, their units, and the reasoning step you want reviewed.'
 });
 if(uncertain.test(reflection))return Object.freeze({
  category:'conceptual',status:'observed_writing_signal',evidenceBasis:'expressed_uncertainty',
  target:'Restate the first principle in plain language before applying the technical rule.'
 });
 if(risk.test(reflection))return Object.freeze({
  category:'interpretive',status:'observed_writing_signal',evidenceBasis:'certainty_language',
  target:'Separate the observation from the interpretation and name evidence that would invalidate it.'
 });
 if(math.test(reflection))return Object.freeze({
  category:'calculation',status:'observed_writing_signal',evidenceBasis:'numeric_or_arithmetic_text',
  target:'Recheck every input, unit, timestamp, denominator, and intermediate calculation.'
 });
 return Object.freeze({
  category:'process',status:'observed_writing_signal',evidenceBasis:'reasoning_text_without_verifiable_result',
  target:'List the evidence, source boundary, assumptions, decision rule, and invalidation in order.'
 });
}

/** Output is educational scaffolding, never diagnosis, grade or recommendation. */
export function coachFoundationReflection(guide,rawAnswer){
 const g=guide?.editorialTrainingReviewV1;
 if(guide?.foundationTopic!==true||!g||g.independentPublicationApproved!==false)return '';
 const correction=plain(g.correction||g.correctiveTeaching),boundary=plain(g.limitation);
 const question=plain(g.diagnosticQuestion);
 const transfer=plain(guide.transferQuestion),source=plain(guide.concept);
 if(!correction||!boundary||!question||!transfer||!source)return '';
 const reflection=plain(rawAnswer),diagnostic=diagnoseFoundationReflection(guide,rawAnswer);
 if(!reflection)return [
  'Talia guided restart (ungraded): No reasoning was submitted. Begin with the first principle: '+source,
  'Identify only the observations already available and specify their units. '+question,
  'Original source-only correction for comparison: '+correction,
  'Then try an independent situation: '+transfer,
  'No inference about your knowledge, grade, skill or real trade is made.'
 ].join('\n\n');
 // These branches describe only text patterns; none establishes factual correctness.
 if(uncertain.test(reflection))return [
  'Talia guided clarification (ungraded): Conceptual review was selected because your writing expressed uncertainty. This is not a correctness finding.',
  'Start with the first principle: '+source,
  'Then check this specific reasoning step: '+correction,
  'Evidence or contract limitation: '+boundary,
  'Try the changed fictional example before comparing your answer: '+transfer,
  'This is instructional support, not a finding of a particular misconception or mastery.'
 ].join('\n\n');
 if(risk.test(reflection))return [
  'Talia certainty check (ungraded): Interpretive review was selected because your wording includes a certainty term. It is not evidence of a guaranteed outcome.',
  'Compare the statement with the actual source-linked decision rule: '+correction,
  'State a condition that could make that statement unsupported: '+boundary,
  'Now apply the rule to a different situation: '+transfer,
  'This is an explicit wording check, not a verified judgment of your answer.'
 ].join('\n\n');
 if(math.test(reflection))return [
  'Talia calculation check (ungraded): Calculation review was selected because your writing contains a number or arithmetic expression. This does not establish correctness.',
  'Confirm input units, timestamps, assumptions and denominator using: '+correction,
  'Check whether the calculation exceeds the available evidence: '+boundary,
  'Independently transfer the calculation: '+transfer,
  'No official mathematical score or mastery credit has been awarded.'
 ].join('\n\n');
 return [
  'Talia evidence-building check (ungraded): Process review was selected because the text does not contain a verifiable result. Compare what you wrote with this topic-specific method.',
  'Relevant first principle: '+source,
  'Decision rule or correction: '+correction,
  'Missing-source or invalidation boundary: '+boundary,
  'Test the idea independently: '+transfer,
  diagnostic?.target||'This text alone does not establish an accurate personal diagnosis.',
  'This text alone does not establish an accurate personal diagnosis.'
 ].join('\n\n');
}
