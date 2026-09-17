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
  vm.runInContext("appState='ready'; chatModel='qwen2.5:7b-instruct'", ctx);
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
    const row = { key, mode: 'rich-live', input, networkCalls: h.calls(), output, displayed, check, hardIssues, sourceNote: h.element('source-note-' + key).textContent };
    results.push(row);
    if (hardIssues.length) failed++;
    console.log(`${key.padEnd(10)} live    ${hardIssues.length ? 'FAIL' : 'PASS'}  network=${h.calls()} hard=${hardIssues.length}${hardIssues.length ? ' ' + hardIssues.join(' | ') + ' ' + displayed.slice(0, 240) : ''}`);
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
