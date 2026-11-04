/* Public Constellation teaching-style showcase: stage labels and original
 * conceptual explanations only, no staff authentication, API, membership or grades.
 */
(()=>{'use strict';
 const stages=[
  ['Start with the evidence','Name the market-learning concept, data scope and investigable question.','Choose a completed fictional candle and identify what its Open, High, Low and Close represent.'],
  ['Learn before predicting','Explore definitions, formulas, counterexamples and the limits of observable evidence.','Use Talia’s free explanation to separate candle anatomy from a prediction.'],
  ['Experiment with the chart','Inspect only currently revealed observations and compare how fictional price changes affect a developing candle.','Pause the simulated one-minute replay, inspect its real body and wicks, then advance.'],
  ['Predict as a hypothesis','Make a falsifiable expectation before revealing later fictional evidence; it is not a trade recommendation.','Write what observation would invalidate your interpretation.'],
  ['Practice with feedback','Attempt a new instructional case and use free corrective teaching without losing progress.','Calculate a candle range or apply VWAP arithmetic using a separate fictional example.'],
  ['Assess under safeguards','Formal assessments use protected, reviewed questions in authenticated courses—not this public demonstration.','See how independent reasoning differs from copying an explanation.'],
  ['Review and correct','Compare original observations with outcomes, identify a misconception and retry guided exercises.','Explain why a completed candle alone cannot establish the next candle.'],
  ['Transfer to a new situation','Apply the same concept to different fictional prices or a different timeframe without lookahead.','Evaluate what changes when one-minute observations are grouped into five-minute candles.'],
  ['Results document learning','Use verified course records to track studied competencies and helpful next steps, not trading guarantees.','Return to your learning path to see what concept to investigate next.']
 ];
 const run=()=>{
  const root=document.getElementById('learning-constellation');if(!root)return;
  const buttons=[...root.querySelectorAll('[data-home-stage]')];
  const title=document.getElementById('gu-lc-public-selected');
  const explain=document.getElementById('gu-lc-public-explain');
  const action=document.getElementById('gu-lc-public-action');
  const kicker=root.querySelector('.gu-lc-public-kicker');
  if(buttons.length!==stages.length||!title||!explain||!action||!kicker)return;
  for(const button of buttons)button.addEventListener('click',()=>{
   const i=Number(button.dataset.homeStage);
   if(!Number.isInteger(i)||i<0||i>=stages.length)return;
   for(const b of buttons)b.setAttribute('aria-pressed',String(b===button));
   kicker.textContent=String(i+1).padStart(2,'0')+' / 09 · '+String(button.textContent||'').trim();
   [title.textContent,explain.textContent,action.textContent]=stages[i];
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
