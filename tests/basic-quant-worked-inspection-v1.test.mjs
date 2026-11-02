import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const source=readFileSync('assets/js/learning-quant-studies-ui-v1.js','utf8');
test('Member workbench offers accessible inspectable worked-value entry without grading',()=>{assert.match(source,/Show worked values in practice fields/);assert.match(source,/Populate practice inputs with this fictional worked example/);assert.match(source,/fields\[i\]\.value=String\(base\.values\[i\]\)/);assert.match(source,/fictional teaching results, not a grade/);assert.match(source,/fields\[0\]\.focus\(\)/);});
test('Workbench retains canonical authorization and source-only teaching',()=>{assert.match(source,/selected!==studyId/);assert.match(source,/Fictional teaching inputs only/);assert.match(source,/stage:'practice',provenance:'fictional_authored'/);assert.match(source,/Independent transfer results/);});

test('Worked example table has semantic column and row headings for assistive navigation',()=>{assert.match(source,/const thead=node\('thead'\)/);assert.match(source,/th\.setAttribute\('scope','col'\)/);assert.match(source,/th\.setAttribute\('scope','row'\)/);assert.match(source,/table\.append\(thead,tbody\)/);});

test('Full chart data is accessible in an independent numerical table including warmup',()=>{assert.match(source,/Complete fictional indicator series with warmup periods/);assert.match(source,/gu-quant-series-table/);assert.match(source,/line\.data\?\.\[i\]/);assert.match(source,/Not available — warmup/);assert.match(source,/shell\.append\(chart,table,seriesTable\)/);});

test('Every authored indicator ECharts series receives an explicit supported type and retains warmup gaps',()=>{assert.match(source,/base\.chart\.map\(line=>\(\{name:line\.name,type:line\.type==='bar'\?'bar':'line',data:line\.data,connectNulls:false\}\)\)/);});
