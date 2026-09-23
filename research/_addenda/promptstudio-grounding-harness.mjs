// End-to-end checks for the grounding choice and the local Ollama translation path.
// node research/_addenda/promptstudio-grounding-harness.mjs
// node research/_addenda/promptstudio-grounding-harness.mjs --live --save
import fs from 'node:fs';
import vm from 'node:vm';
import { loadApp, TARGETS } from './validator-harness/extract.mjs';

const live = process.argv.includes('--live');
const sparseLive = process.argv.includes('--sparse-live');
const save = process.argv.includes('--save');
const onlyKey = process.argv.includes('--key') ? process.argv[process.argv.indexOf('--key') + 1] : '';
const model = process.argv.includes('--model') ? process.argv[process.argv.indexOf('--model') + 1] : 'qwen2.5:7b-instruct';
const sparse = 'The woman from image 1 jumps around the battlefield cutting down enemies.';
const sparseRef = 'picture 1 = the character reference.\npicture 2 = the battlefield, outfit, and position guide to be replaced by the woman in picture 1.\nThe woman from picture 1 jumps around the battlefield cutting down enemies.';
const richVideo = 'A woman in a red coat stands on a blue dock at dawn. She opens a black umbrella, then walks toward a green boat. The camera pans left. Rain taps the umbrella. No music.';
const richImage = 'A woman in a red coat holds a black umbrella beside a green boat at a blue dock at dawn. Rain falls. Side view. Editorial photograph.';
const richAnime = 'Anime illustration of a woman in a red coat holding a black umbrella beside a green boat at a blue dock at dawn. Rain falls. Side view.';
const richRef = 'picture 1 = a woman with short black hair and a red coat; use her identity.\npicture 2 = a blue dock at dawn, a green boat, a black umbrella, and a woman who is only a position guide; use its scene and outfit.\nReplace the woman in picture 2 with the woman in picture 1. She opens the umbrella, then walks toward the boat. The camera pans left. Rain taps the umbrella. No music.';

const keys = Object.keys(TARGETS).filter(k => !onlyKey || k === onlyKey);
if (!keys.length) throw new Error('Unknown target key: ' + onlyKey);
const results = [];
let failed = 0;
const probe = loadApp();
const needsMoreDetail = vm.runInContext('needsMoreDetail', probe);
const groundingIssues = vm.runInContext('groundingIssues', probe);
const referenceOutputIssues = vm.runInContext('referenceOutputIssues', probe);
const choiceCases = [
  ['sparse action', sparse, ['minimax'], true],
  ['sparse references', sparseRef, ['minimaxref'], true],
  ['concise detailed scene', 'A red kite circles above a foggy harbor at dawn, then lands on a blue fishing boat. Fixed camera. Rain and gull calls; no music.', ['minimax'], false],
  ['short specific scene', 'A red flower on a blue table at dawn, seen from above.', ['sdxl'], false],
  ['detailed reference', richRef, ['minimaxref'], false]
];
for (const [name, input, selected, expected] of choiceCases) {
  const actual = needsMoreDetail(input, selected);
  if (actual !== expected) failed++;
  console.log(`choice ${name}: ${actual === expected ? 'PASS' : 'FAIL'} (${actual ? 'offer details' : 'translate directly'})`);
}
const groundingCases = [
  ['allowed smile inflection', 'sdxl', 'A woman smiling.', 'A woman smiles.', false],
  ['allowed gray spelling', 'sdxl', 'A gray cat.', 'A grey cat.', false],
  ['allowed plural shots', 'minimax', 'Two shots: first she stands; second she sits.', '[Shot 1] She stands. [Shot 2] She sits.', false],
  ['allowed unquoted speech', 'minimax', 'She says hello.', '[Shot 1] She says: <d>[English] hello.</d>', false],
  ['invented camera', 'minimax', 'A woman walks in a field.', 'integrated_multimodal_description: [Shot 1] A woman walks in a field. The camera pans left.\noverall_soundscape: N/A\nnon_diegetic_music: N/A', true],
  ['invented sword', 'scail', 'A woman cuts down enemies.', 'A woman cuts down enemies with a sword.', true],
  ['invented castle', 'wan', 'A woman walks in a field.', 'A woman walks in a field beside a castle.', true],
  ['invented combat gear', 'minimax', sparse, 'integrated_multimodal_description: [Shot 1] A woman in combat gear jumps around the battlefield cutting down enemies.\noverall_soundscape: N/A\nnon_diegetic_music: N/A', true],
  ['bare anime categories', 'sdxlAnime', sparse, 'score_9, source_anime, battlefield, enemies, hair, eyes, clothing, pose, lighting\nnegative: N/A', true],
  ['invented hairstyle', 'sdxl', 'A woman walks in a field.', 'A woman with long blonde hair walks in a field.', true],
  ['invented anime hair and eyes tags', 'sdxlAnime', richAnime, 'score_9, source_anime, 1girl, hair_red, eyes_black, red_coat, black_umbrella', true],
  ['anime hair color from another object', 'sdxlAnime', 'A woman with black hair wears a red coat.', 'score_9, source_anime, 1girl, hair_red, red_coat', true],
  ['allowed anime hair and eyes tags', 'sdxlAnime', 'A woman with red hair and black eyes wears a red coat.', 'score_9, source_anime, 1girl, hair_red, eyes_black, red_coat', false],
  ['invented wave', 'wan', 'A woman walks in a field.', 'A woman walks in a field and waves.', true],
  ['meta commentary', 'minimax', sparse, 'No specific camera move or style was requested.', true]
];
for (const [name, key, input, output, expected] of groundingCases) {
  const actual = groundingIssues(key, input, output).length > 0;
  if (actual !== expected) failed++;
  console.log(`ground ${name}: ${actual === expected ? 'PASS' : 'FAIL'}`);
}
const badMotionSource = 'subject_definitions:\n<Subject 1> = woman from <Picture 1>. <Picture 2> = battlefield.\nsummary:\n[reference generation] She jumps and cuts enemies.\nretention_analysis:\n<Subject 1>: fully_preserved.\ndetailed_description:\n[Shot 1] She jumps and cuts enemies as described in <Picture 1>.\noverall_soundscape:\nN/A\nnon_diegetic_music:\nN/A';
if (!referenceOutputIssues('picture 1 = character reference. picture 2 = battlefield and position guide replaced by picture 1. She jumps and cuts enemies.', badMotionSource).some(x => x.includes('source of motion'))) failed++;
else console.log('ground still-picture motion attribution: PASS');
const replacementRequest = 'picture 1 = final woman. picture 2 = battlefield and a position guide replaced by picture 1. She runs.';
const sceneSubject = 'subject_definitions:\n<Subject 1> = woman from <Picture 1>.\n<Subject 2> = battlefield scene from <Picture 2>.\nsummary:\n[reference generation] She runs.\nretention_analysis:\n<Subject 1>: fully_preserved.\n<Subject 2>: attribute_transfer.\ndetailed_description:\n[Shot 1] <Subject 1> runs in <Subject 2>.\noverall_soundscape:\nN/A\nnon_diegetic_music:\nN/A';
const extraGuidePerson = sceneSubject.replace('<Subject 2> = battlefield scene from <Picture 2>.', '<Subject 2> = the woman used as a position guide from <Picture 2>.');
if (referenceOutputIssues(replacementRequest, sceneSubject).some(x => x.includes('replaced position guide')) ||
    !referenceOutputIssues(replacementRequest, extraGuidePerson).some(x => x.includes('replaced position guide'))) failed++;
else console.log('ground scene subject allowed; replaced guide person rejected: PASS');
const validate = vm.runInContext('validate', probe);
const fiveShots = 'integrated_multimodal_description: [Shot 1] She stands. [Shot 2] At 00:01.000, she walks. [Shot 3] At 00:02.000, she stops. [Shot 4] At 00:03.000, she turns. [Shot 5] At 00:04.000, she sits.\noverall_soundscape: N/A\nnon_diegetic_music: N/A';
const shotIssues = validate('minimax', fiveShots, 'Five timed shots in five seconds.');
if (!shotIssues.some(x => x.startsWith('advisory: 5 shots')) || shotIssues.some(x => x.startsWith('HARD: 5 shots'))) failed++;
else console.log('ground five shots are pacing advice, not format failure: PASS');
const genericReferenceFallback = vm.runInContext('genericReferenceFallback', probe);
const genericRef = genericReferenceFallback('picture 1 = a red bird\npicture 2 = a blue forest\nThe bird from picture 1 flies through the forest from picture 2.');
if (!genericRef.includes('<Subject 1> = a red bird from <Picture 1>') ||
    !genericRef.includes('<Subject 2> = a blue forest from <Picture 2>') ||
    /^<Picture 2>\s*=/m.test(genericRef)) failed++;
else console.log('ground picture sources become reusable subjects: PASS');
const tutorKnownAnswer = vm.runInContext('tutorKnownAnswer', probe);
const h3Answer = tutorKnownAnswer('For local MiniMax H3, are 3-4 beats in 5 seconds required? When should a reference image become a Subject instead of a Picture?');
if (!h3Answer.includes('optional planning advice') || !h3Answer.includes('background, outfit') ||
    !h3Answer.includes('primary, or secondary does not decide') || tutorKnownAnswer('How does SDXL CFG work?')) failed++;
else console.log('tutor H3 reference labels use role, not prominence: PASS');
const h3AudioAnswer = tutorKnownAnswer('In H3 reference mode, should I use fully_copy for a voice sample that only guides timbre? What about copying just one recorded line?');
if (!h3AudioAnswer.includes('Use reference when a voice sample guides only timbre') ||
    !h3AudioAnswer.includes('Use partially_copy when an actual recorded line') ||
    h3AudioAnswer.includes('fully_copy for a voice sample')) failed++;
else console.log('tutor H3 audio markers distinguish signal copying from guidance: PASS');

function boot(key) {
  const ctx = loadApp();
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, style: {}, dataset: {}, value: '', textContent: '', innerHTML: '',
      disabled: false, scrollTop: 0, scrollHeight: 0,
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      focus() {}, setSelectionRange() {}
    });
    return elements.get(id);
  }
  ctx.document.getElementById = element;
  ctx.document.querySelectorAll = query => query === '#chips input:checked' ? [{ dataset: { key } }] : [];
  ctx.AbortController = AbortController;
  ctx.setTimeout = setTimeout;
  ctx.clearTimeout = clearTimeout;
  let calls = 0;
  ctx.fetch = (...args) => { calls++; return fetch(...args); };
  vm.runInContext("appState='ready'; chatModel=" + JSON.stringify(model), ctx);
  const run = expression => vm.runInContext(expression, ctx);
  return { ctx, element, run, calls: () => calls };
}

{
  const h = boot('wan');
  const boxes = Object.keys(TARGETS).map(key => ({ dataset: { key }, checked: false, parentElement: { classList: { toggle() {} } } }));
  h.ctx.document.querySelectorAll = selector => selector === '#chips input[data-key]' ? boxes : selector === '#chips input:checked' ? boxes.filter(box => box.checked) : [];
  for (let i = 0; i < 4; i++) {
    const example = h.run('EXAMPLES[' + i + ']');
    h.run('loadExample(' + i + ')');
    const selected = boxes.filter(box => box.checked).map(box => box.dataset.key);
    const simpleHint = h.element('detailPrompt').style.display === '';
    if (h.element('intent').value !== example.prompt || selected.join(',') !== example.targets.join(',') || simpleHint !== (i === 0)) failed++;
    else console.log('example ' + example.title + ': PASS (prompt, targets, mode hint)');
  }
  const html = fs.readFileSync(new URL('../../PromptStudio.html', import.meta.url), 'utf8');
  if (!/id="ctxWrap" style="display:block/.test(html)) failed++;
  else console.log('project context visible by default: PASS');
}

{
  const h = boot('ltx');
  let copied = '';
  h.ctx.navigator.clipboard.writeText = text => { copied = text; return Promise.resolve(); };
  h.element('intent').value = sparse;
  await h.run('generate()');
  const original = h.run('lastRun.outputs.ltx');
  h.run("copyOut('ltx')");
  if (copied !== original) failed++;
  else console.log('saved valid copy: PASS');
  h.run("pinPrompt('ltx')");
  if (h.run('loadPins().length') !== 1) failed++;
  else console.log('saved valid pin: PASS');
  const invented = original + ' She draws a sword.';
  h.run('lastRun.outputs.ltx = ' + JSON.stringify(invented));
  h.element('out-ltx').textContent = invented;
  copied = '';
  h.run("copyOut('ltx')");
  h.run("pinPrompt('ltx')");
  if (copied || h.run('loadPins().length') !== 1) failed++;
  else console.log('blocked invented copy and pin: PASS');
  h.run('lastRun.outputs.ltx = ' + JSON.stringify(original));
  h.element('out-ltx').textContent = original;
  h.element('ref-ltx').value = 'Keep the action the same.';
  h.run('streamChat = async () => ' + JSON.stringify(invented));
  await h.run("refine('ltx')");
  if (h.run('lastRun.outputs.ltx') !== original || h.element('out-ltx').textContent !== original) failed++;
  else console.log('rejected invented revision, kept prior output: PASS');
  h.element('ref-ltx').value = 'Add a red coat.';
  const revised = 'The woman from image 1 in a red coat jumps around the battlefield cutting down enemies.';
  h.run('streamChat = async () => ' + JSON.stringify(revised));
  await h.run("refine('ltx')");
  if (h.run('lastRun.outputs.ltx') !== revised || !h.run('sourceFor("ltx")').includes('red coat')) failed++;
  else console.log('accepted requested revision with provenance: PASS');
  h.run('lastRun.outputs.ltx = ' + JSON.stringify(invented));
  h.element('out-ltx').textContent = invented;
  h.run('streamChat = async () => ' + JSON.stringify(original));
  await h.run("fixOutput('ltx')");
  if (h.run('lastRun.outputs.ltx') !== original) failed++;
  else console.log('fixed invalid saved output: PASS');
}

{
  const h = boot('ltx');
  h.element('suggestDetails').checked = true;
  h.element('intent').value = 'A woman walks in a field.';
  const suggestion = 'A red castle stands behind her.';
  const template = 'A woman walks in a field. A red castle stands behind her.';
  h.run('streamChat = async (system) => system.includes("optional creative template") ? ' + JSON.stringify(suggestion) + ' : ' + JSON.stringify(template));
  await h.run('generate()');
  const output = h.run('lastRun.outputs.ltx');
  const source = h.run('sourceFor("ltx")');
  const hasBanner = h.element('results').innerHTML.includes('Suggested details · editable template');
  const saved = h.run('readHistory()[0]');
  if (output !== template || !source.includes(suggestion) || !hasBanner || saved.suggestedDetails !== suggestion ||
      h.run('splitSeverity(validate("ltx", lastRun.outputs.ltx, sourceFor("ltx"))).hard.length')) failed++;
  else console.log('opt-in detail template, provenance, and saved history: PASS');
  h.run('pinPrompt("ltx")');
  if (h.run('loadPins()[0]?.suggestedDetails') !== suggestion) failed++;
  else console.log('pinned template keeps its disclosure: PASS');
  h.run('editSuggestedDraft()');
  if (h.element('suggestDetails').checked || !h.element('intent').value.includes(suggestion)) failed++;
  else console.log('suggested details become editable faithful input: PASS');
  h.run('loadHist(0)');
  if (!h.element('results').innerHTML.includes('Suggested details · editable template') || h.run('lastRun.suggestedDetails') !== suggestion) failed++;
  else console.log('history restores template disclosure: PASS');
}

if (!vm.runInContext('suggestionConflicts("Fixed camera. No music.", "The camera pans left over an orchestral score.")', probe) ||
    vm.runInContext('suggestionConflicts("A woman walks.", "A red castle stands behind her.")', probe)) failed++;
else console.log('suggestions respect explicit exclusions without blocking ordinary details: PASS');

for (const key of keys) {
  const h = boot(key);
  const input = key === 'minimaxref' ? sparseRef : 'A woman walks in a field.';
  const suggestion = key === 'wanI2V' ? 'She raises her hand.' : 'A red castle stands behind her.';
  h.element('suggestDetails').checked = true;
  h.element('intent').value = input;
  h.run('streamChat = async (system) => system.includes("optional creative template") ? ' + JSON.stringify(suggestion) +
    ' : simplePromptFor(' + JSON.stringify(key) + ', ' + JSON.stringify(input + ' ' + suggestion) + ')');
  await h.run('generate()');
  const output = h.run('lastRun?.outputs?.[' + JSON.stringify(key) + ']') || '';
  const issues = output ? h.run('splitSeverity(validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))).hard') : ['no output'];
  const keptSuggestion = output.includes(key === 'wanI2V' ? 'raises' : 'castle');
  const disclosed = h.run('lastRun?.suggestedDetails') === suggestion;
  if (!keptSuggestion || !disclosed || issues.length) failed++;
  console.log(`${key.padEnd(10)} template ${!keptSuggestion || !disclosed || issues.length ? 'FAIL' : 'PASS'}  suggestion=${keptSuggestion} disclosure=${disclosed} hard=${issues.length}${issues.length ? ' ' + issues.join(' | ') : ''}`);
}

{
  const h = boot('wanI2V');
  h.element('suggestDetails').checked = true;
  h.element('intent').value = 'A woman walks in a field.';
  h.run('streamChat = async (system) => system.includes("optional creative template") ? "A red castle stands behind her." : "A woman walks in a field."');
  await h.run('generate()');
  if (h.run('lastRun?.suggestedDetails') || h.run('lastRun?.outputs?.wanI2V')?.includes('castle')) failed++;
  else console.log('Wan I2V rejects static-only suggestions: PASS');
}

{
  const h = boot('flux');
  h.element('suggestDetails').checked = true;
  h.element('intent').value = 'picture 1 = a character reference. A woman walks.';
  const source = 'picture 1 = a character reference. A woman walks.';
  h.run('streamChat = async (system) => system.includes("optional creative template") ? "Video 2 shows a sunset." : ' + JSON.stringify(source));
  await h.run('generate()');
  if (h.run('lastRun.suggestedDetails') || h.run('sourceFor("flux")').includes('Video 2')) failed++;
  else console.log('unlisted reference in suggested details rejected: PASS');
}

{
  const first = boot('ltx');
  const second = boot('ltx');
  second.ctx.localStorage = first.ctx.localStorage;
  first.element('intent').value = sparse;
  second.element('intent').value = sparse;
  await first.run('generate()');
  await second.run('generate()');
  const beforeClear = first.run('readHistory().length');
  first.ctx.confirm = () => true;
  first.run('clearHist()');
  // An open second pane may still hold the old entries in memory.
  second.run('persistHistoryEntry(lastRun.hist)');
  const stayedClear = first.ctx.localStorage.getItem('ps_history') === null;
  await second.run('generate()');
  const afterNewTranslation = first.run('readHistory().length');
  if (beforeClear !== 2 || !stayedClear || afterNewTranslation !== 1) failed++;
  else console.log('history clear survives stale split pane: PASS');
}

for (const key of keys) {
  const h = boot(key);
  const input = key === 'minimaxref' ? sparseRef : sparse;
  h.element('intent').value = input;
  await h.run('generate()');
  const offered = h.element('detailPrompt').style.display === '';
  const output = h.run('lastRun && lastRun.outputs[' + JSON.stringify(key) + ']');
  const issues = output ? h.run('validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no simple draft'];
  const row = { key, mode: 'simple', offered, networkCalls: h.calls(), output, hardIssues: issues };
  results.push(row);
  if (!offered || !output || h.calls() || issues.length) failed++;
  console.log(`${key.padEnd(10)} simple  ${!offered || !output || h.calls() || issues.length ? 'FAIL' : 'PASS'}  hint=${offered} network=${h.calls()} hard=${issues.length}`);
}

for (const key of keys) {
  const h = boot(key);
  h.ctx.localStorage.setItem('ps_ctx', 'Painterly style with muted colors.');
  h.element('intent').value = key === 'minimaxref' ? sparseRef : sparse;
  await h.run('generate()');
  const output = h.run('lastRun && lastRun.outputs[' + JSON.stringify(key) + ']');
  const issues = output ? h.run('validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no contextual simple draft'];
  const row = { key, mode: 'context-simple', networkCalls: h.calls(), output, hardIssues: issues };
  results.push(row);
  if (h.calls() || issues.length) failed++;
  console.log(`${key.padEnd(10)} context ${h.calls() || issues.length ? 'FAIL' : 'PASS'}  network=${h.calls()} hard=${issues.length}${issues.length ? ' ' + issues.join(' | ') : ''}`);
}

if (live) {
  for (const key of keys) {
    const h = boot(key);
    const input = key === 'minimaxref' ? richRef : key === 'sdxlAnime' ? richAnime : TARGETS[key].group === 'image' ? richImage : richVideo;
    h.element('intent').value = input;
    await h.run('generate()');
    const output = h.run('lastRun && lastRun.outputs[' + JSON.stringify(key) + ']');
    const check = h.element('chk-' + key).innerHTML;
    const hardIssues = output ? h.run('validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no checked output'];
    const displayed = h.element('out-' + key).textContent || h.element('out-' + key).innerHTML;
    const sourceNote = h.element('source-note-' + key).textContent;
    const row = { key, mode: 'rich-live', input, networkCalls: h.calls(), output, displayed, check, hardIssues, sourceNote };
    results.push(row);
    if (hardIssues.length) failed++;
    console.log(`${key.padEnd(10)} live    ${hardIssues.length ? 'FAIL' : 'PASS'}  network=${h.calls()} hard=${hardIssues.length}${sourceNote ? ' note=' + sourceNote : ''}${hardIssues.length ? ' ' + hardIssues.join(' | ') + ' ' + displayed.slice(0, 240) : ''}`);
  }
}

if (process.argv.includes('--examples-live')) {
  const examples = vm.runInContext('EXAMPLES', probe);
  for (const example of examples) for (const key of example.targets) {
    const h = boot(key);
    h.element('intent').value = example.prompt;
    await h.run('generate()');
    const output = h.run('lastRun && lastRun.outputs[' + JSON.stringify(key) + ']');
    const displayed = h.element('out-' + key).textContent || h.element('out-' + key).innerHTML;
    const issues = output ? h.run('validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no checked output'];
    if (issues.length) failed++;
    console.log('example live ' + example.title + ' / ' + key + ': ' + (issues.length ? 'FAIL ' + issues.join(' | ') + ' ' + displayed.slice(0, 180) : 'PASS'));
  }
}

if (sparseLive) {
  for (const key of keys) {
    const h = boot(key);
    const input = key === 'minimaxref' ? sparseRef : sparse;
    h.element('intent').value = input;
    h.run('skipNextDetailPrompt = true');
    await h.run('generate()');
    const output = h.run('lastRun && lastRun.outputs[' + JSON.stringify(key) + ']');
    const displayed = h.element('out-' + key).textContent || h.element('out-' + key).innerHTML;
    const hardIssues = output ? h.run('validate(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + '], sourceFor(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no checked output'];
    const row = { key, mode: 'sparse-live', input, networkCalls: h.calls(), output, displayed, hardIssues, sourceNote: h.element('source-note-' + key).textContent };
    results.push(row);
    if (hardIssues.length) failed++;
    console.log(`${key.padEnd(10)} sparse  ${hardIssues.length ? 'FAIL' : 'PASS'}  network=${h.calls()} hard=${hardIssues.length}${hardIssues.length ? ' ' + hardIssues.join(' | ') + ' ' + displayed.slice(0, 240) : ''}`);
  }
}

if (save) fs.writeFileSync(new URL('./promptstudio-grounding-live-results-2026-09-17.json', import.meta.url), JSON.stringify({ created: new Date().toISOString(), results }, null, 2) + '\n');
console.log(`Completed ${results.length} checks; failures=${failed}`);
process.exitCode = failed ? 1 : 0;
