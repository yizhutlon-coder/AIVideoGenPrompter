// Exercise the app's real generate() path with the installed local Ollama model.
// Run: node research/_addenda/promptstudio-usefulness-eval-2026-09-22.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import { loadApp, TARGETS } from './validator-harness/extract.mjs';

const model = process.argv.includes('--model') ? process.argv[process.argv.indexOf('--model') + 1] : 'qwen2.5:7b-instruct';
const shortVideo = 'A woman runs across a battlefield carrying a sword.';
const detailedVideo = 'One continuous shot: A baker in a blue apron opens a wooden shutter before sunrise. The fixed camera holds a medium view. The baker says exactly, "We are open." The shutter creaks. Rain taps the window. No music. The baker closes the shutter after speaking.';
const shortImage = 'A red fox sits beside a green bicycle.';
const detailedImage = 'Editorial photograph of a red fox beside a green bicycle on a wet blue dock at dawn. Side view, soft overcast light, muted colors. The bicycle has a yellow basket. Keep the dock empty of people.';
const detailedRef = 'picture 1 = a woman with short black hair in a red coat; use her identity and coat. picture 2 = a blue dock at dawn, a green boat, and a woman who is only a position guide; use its scene and position. Replace the guide in picture 2 with the woman in picture 1. In one fixed-camera shot, the final woman opens a black umbrella, then walks toward the boat. Rain taps the umbrella. No music.';
const broadCases = Object.keys(TARGETS).flatMap(key => {
  const short = key === 'minimaxref'
    ? 'picture 1 = the character reference. picture 2 = the battlefield and position guide. Replace the guide with the character from picture 1. She runs.'
    : key === 'wanI2V' ? 'In my still image, the woman waves twice.'
    : key === 'scail' ? 'The person from the reference image runs like the driver.'
    : TARGETS[key].group === 'image' ? shortImage : shortVideo;
  const detailed = key === 'minimaxref' ? detailedRef
    : key === 'wanI2V' ? 'In my still image, the woman raises her left hand, waves twice, then lowers it. The camera pans slowly right while she waves. Her clothing, appearance, and setting stay as shown in the image.'
    : key === 'scail' ? 'Use the identity and red coat from the reference image. Use the running motion, blue dock, green boat, and fixed side-view camera from the driving video. Replace the driver with the referenced woman; keep the timing and the dock unchanged. The finished silent clip shows her run toward the boat.'
    : key === 'sdxlAnime' ? 'Pony V6 anime illustration of a woman with short black hair and green eyes wearing a red coat, holding a black umbrella beside a green boat on a blue dock at dawn. Side view, soft overcast light, muted colors. No other people.'
    : key === 'qwenimg21' ? 'Edit image 1: keep the woman, her red coat, the blue dock, camera angle, and soft overcast lighting unchanged. Replace only the black umbrella with a yellow umbrella. Do not change the green boat or the background. Preserve the face and hair from image 1.'
    : TARGETS[key].group === 'image' ? detailedImage : detailedVideo;
  return [{key, kind:'short', input:short}, {key, kind:'detailed', input:detailed}];
});
const targetedCases = [
  {key:'wan',kind:'targeted',input:'A woman in a red coat walks toward a green boat on a blue dock at dawn, then opens a black umbrella. The camera pans left. Rain is visible on the dock. Use an editorial documentary style.'},
  {key:'flux',kind:'targeted',input:'Make an empty bookshop window at night. A hand-lettered sign on the glass reads exactly "CLOSED TODAY". The sign is white on black paper, at the upper left of the pane. A red bicycle is reflected in the lower right. No people. Use a 35 mm documentary photograph look.'},
  {key:'zimage',kind:'targeted',input:'Create a poster on cream paper. At the top, the exact Chinese text "春日书展" in black Songti lettering. Below it place two red cranes facing each other across a blue river. Use a flat printmaking style. Keep the bottom third blank.'},
  {key:'krea2',kind:'targeted',input:'A game character sheet showing the same masked courier from the front and back. Their jacket is orange with blue cuffs, and their boots are black. Use rough ink lines and flat muted colors on an off-white background. No weapons or logos.'},
  {key:'qwenimg',kind:'targeted',input:'A cream paper book cover with the exact title "MIDNIGHT TAXI" in large red letters centered at the top. A small blue taxi sits at the bottom. The rest of the cover stays empty.'},
  {key:'qwenimg21',kind:'targeted',input:'Create an isolated red ceramic teapot with a short curved spout and a black handle, seen from the side. Make the background transparent and preserve the teapot shadow in the alpha image.'},
  {key:'minimaxref',kind:'targeted',input:'picture 1 = a woman with a red coat.\npicture 2 = a blue dock with a green boat and a person used only as a position guide.\nReplace the guide from picture 2 with the woman from picture 1. She opens a black umbrella, then walks toward the boat. Fixed camera. Rain taps the umbrella. No music.'},
  {key:'minimax',kind:'targeted',input:'Make two shots. Shot 1: A red fox sits beside a green bicycle at dawn. Fixed camera. At 00:03.000 cut to Shot 2: the fox runs toward a blue boat. Rain taps the boat. No music.'},
  {key:'scail',kind:'targeted',input:'Reference image: an older woman in a red coat. Driving video: a runner turns left on a blue dock beside a green boat, shown by a fixed side camera. Replace the driver with the woman from the reference. Keep the dock, boat, camera, and turning motion.'}
];
const targeted = process.argv.includes('--targeted');
const cases = targeted ? targetedCases : broadCases;

function boot(key) {
  const ctx = loadApp();
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, style:{}, dataset:{}, value:'', textContent:'', innerHTML:'', disabled:false,
      scrollTop:0, scrollHeight:0, checked:false,
      classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
      focus(){}, setSelectionRange(){}
    });
    return elements.get(id);
  }
  ctx.document.getElementById = element;
  ctx.document.querySelectorAll = query => query === '#chips input:checked' ? [{dataset:{key}}] : [];
  ctx.AbortController = AbortController;
  ctx.setTimeout = setTimeout;
  ctx.clearTimeout = clearTimeout;
  let networkCalls = 0;
  ctx.fetch = (...args) => { networkCalls++; return fetch(...args); };
  vm.runInContext("appState='ready'; chatModel=" + JSON.stringify(model), ctx);
  return {element, run: expression => vm.runInContext(expression, ctx), networkCalls: () => networkCalls};
}

const results = [];
const path = new URL(targeted ? './promptstudio-usefulness-targeted-2026-09-22.json' : './promptstudio-usefulness-results-2026-09-22.json', import.meta.url);
for (const c of cases) {
  const h = boot(c.key);
  h.element('intent').value = c.input;
  const began = Date.now();
  await h.run('generate()');
  const output = h.run('lastRun?.outputs?.[' + JSON.stringify(c.key) + ']') || '';
  const displayed = h.element('out-' + c.key).textContent || h.element('out-' + c.key).innerHTML;
  const hardIssues = output ? h.run('splitSeverity(validate(' + JSON.stringify(c.key) + ', lastRun.outputs[' + JSON.stringify(c.key) + '], sourceFor(' + JSON.stringify(c.key) + '))).hard') : ['no copyable prompt'];
  const simpleMode = h.element('source-note-' + c.key).textContent.includes('Simple version:');
  const fallback = /(?:simpler draft|could not produce a valid target prompt)/i.test(h.element('source-note-' + c.key).textContent);
  const prompt = output ? h.run('pasteText(' + JSON.stringify(c.key) + ', lastRun.outputs[' + JSON.stringify(c.key) + '])') : '';
  const normalize = s => s.toLowerCase().replace(/\s+/g,' ').replace(/[.!?]+$/,'').trim();
  const row = {...c, model, output, prompt, displayed:output ? undefined : displayed,
    hardIssues, simpleMode, fallback, exactEcho:normalize(prompt) === normalize(c.input),
    networkCalls:h.networkCalls(), seconds:Math.round((Date.now()-began)/100)/10};
  if (targeted && output && ['wan','zimage','qwenimg'].includes(c.key)) {
    await h.run('makeChineseVersion(' + JSON.stringify(c.key) + ')');
    row.chinese = h.run('lastRun?.zhOutputs?.[' + JSON.stringify(c.key) + ']') || '';
    row.chineseStatus = h.element('zh-chk-' + c.key).textContent;
  }
  results.push(row);
  fs.writeFileSync(path, JSON.stringify({date:'2026-09-22',model,results},null,2)+'\n');
  console.log(`${c.key.padEnd(10)} ${c.kind.padEnd(8)} ${output ? 'OK  ' : 'FAIL'} ${simpleMode?'simple':'model '} ${row.exactEcho?'echo':'changed'} calls=${row.networkCalls} ${row.seconds}s`);
}
console.log('Saved ' + results.length + ' results to ' + path.pathname);
