// Check H3 Studio's actual AI-project gate without starting Ollama or a browser.
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../../tools/H3Studio.html', import.meta.url), 'utf8');
const start = html.indexOf('function aiProjectIssues(');
const end = html.indexOf('async function aiSend()', start);
if (start < 0 || end < 0) throw new Error('AI project gate not found');
const ctx = vm.createContext({});
vm.runInContext(html.slice(start, end), ctx);
const issues = vm.runInContext('aiProjectIssues', ctx);
const simple = vm.runInContext('aiSafeSimpleProject', ctx);
const editIssues = vm.runInContext('aiEditIssues', ctx);

const base = { mode:'T2VA', dur:8, media:[], text:{ imd:'[Shot 1] A woman walks across a battlefield.', ss:'N/A', mus:'N/A' } };
const clone = x => JSON.parse(JSON.stringify(x));
const cases = [
  ['valid text-only project', base, 'A woman walks across a battlefield.', true, false],
  ['invented picture in text-only mode', { ...base, media:[{ kind:'pic', desc:'character photo', on:true }] }, 'Text-only video: a woman walks.', true, true],
  ['missing first shot marker', { ...base, text:{ ...base.text, imd:'A woman walks across a battlefield.' } }, 'A woman walks.', true, true],
  ['first shot has timestamp', { ...base, text:{ ...base.text, imd:'[Shot 1] At 00:00.000, a woman walks.' } }, 'A woman walks.', true, true],
  ['second shot lacks cut time', { ...base, text:{ ...base.text, imd:'[Shot 1] She walks. [Shot 2] She stops.' } }, 'Two shots: she walks, then stops.', true, true],
  ['empty soundscape', { ...base, text:{ ...base.text, ss:'' } }, 'A woman walks.', true, true],
  ['empty reference mode', { ...base, mode:'REF', text:{ subj:'',summ:'',ret:'',dd:'[Shot 1] A woman walks.',ss:'N/A',mus:'N/A' } }, 'Use reference mode.', true, true],
  ['explicit pictures exclude invented video', { ...base, mode:'REF', media:[{kind:'pic',desc:'woman',on:true},{kind:'pic',desc:'battlefield',on:true},{kind:'vid',desc:'invented video',on:true}], text:{subj:'<Subject 1> = woman from <Picture 1>.',summ:'[reference generation] woman runs.',ret:'<Subject 1>: fully_preserved.',dd:'[Shot 1] A woman runs on the battlefield.',ss:'N/A',mus:'N/A'} }, 'Use only these two pictures; no video or audio reference.', true, true],
  ['explicit exclusion catches invented audio', { ...base, mode:'REF', media:[{kind:'pic',desc:'woman',on:true},{kind:'aud',desc:'invented audio',on:true}], text:{subj:'<Subject 1> = woman from <Picture 1>.',summ:'[reference generation] woman runs.',ret:'<Subject 1>: fully_preserved.',dd:'[Shot 1] A woman runs.',ss:'N/A',mus:'N/A'} }, 'Picture 1 is the woman. No video or audio reference.', true, true],
];
let failed = 0;
for (const [name, project, request, fresh, expected] of cases) {
  const actual = issues(clone(project), request, fresh).length > 0;
  if (actual !== expected) failed++;
  console.log(`${actual === expected ? 'PASS' : 'FAIL'} ${name}`);
}
const simpleCases = [
  ['text-only', 'Text-only 8-second video: a woman walks across a battlefield. Keep only that action. No camera move, sound, music, outfit, weapon, or other visual detail is specified.', 'T2VA', 0, 1],
  ['plain text', 'A woman walks across a battlefield for 8 seconds.', 'T2VA', 0, 1],
  ['two explicit shots', 'Text-only 8-second video with two shots. In shot 1, a woman stands on a dock. At 4 seconds cut to shot 2 as she walks toward a boat. No music or sound.', 'T2VA', 0, 2],
  ['first frame', 'Picture 1 is the first frame, showing a woman on a dock. Make an 8-second video where she walks toward a boat. No other references or sound.', 'I2VA', 1, 1],
  ['two pictures', 'Picture 1 is the woman to preserve. Picture 2 supplies a battlefield, her outfit, and a position guide who is replaced by the woman in picture 1. The woman from picture 1 jumps around the battlefield cutting down enemies. Use only these two pictures; no video or audio reference.', 'REF', 2, 1],
  ['8 second phrasing', 'Make a video 8 seconds long where a woman walks across a battlefield.', 'T2VA', 0, 1],
  ['simple smile', 'A woman smiles for 8 seconds.', 'T2VA', 0, 1],
  ['specified look', 'A woman in a red coat walks across a snowy field for 8 seconds.', 'T2VA', 0, 1],
  ['two action sentences', 'A woman walks to a door. She opens it.', 'T2VA', 0, 1]
];
for (const [name, request, mode, media, shots] of simpleCases) {
  const project = simple(request);
  const body = project?.text?.[mode === 'REF' ? 'dd' : 'imd'] || '';
  const okay = project?.mode === mode && project.media.length === media &&
    (body.match(/\[Shot \d+\]/g) || []).length === shots &&
    (name !== 'two pictures' ||
      (project.text.subj.includes('<Subject 2> = the described scene from <Picture 2>') &&
       !body.includes('(S1)') && !project.text.subj.includes('<Picture 2> ='))) &&
    !issues(project, request, true).length;
  if (!okay) failed++;
  console.log(`${okay ? 'PASS' : 'FAIL'} simple project: ${name}${okay ? '' : ' '+JSON.stringify(project)}`);
}
{
  const start = html.indexOf('function insertStarter(');
  const end = html.indexOf('function renderMedia(', start);
  const fields = { subj:'', ret:'' };
  const starterCtx = vm.createContext({
    mode:'REF', media:[], JOB_RETAIN:{ 'identity — subject look':'fully_preserved', 'frame anchor (first/last)':'fully_preserved', 'camera reference':'attribute_transfer', 'voice timbre':'reference' },
    F:key => fields[key], setF:(key,value) => { fields[key] = value; }, renderEditor:()=>{}, refreshLight:()=>{}
  });
  vm.runInContext(html.slice(start, end), starterCtx);
  for (const [name, media, label, marker] of [
    ['picture content', {kind:'pic',_tag:'<Picture 1>',desc:'woman',job:'identity — subject look'}, '<Subject 1>', 'fully_preserved'],
    ['picture frame anchor', {kind:'pic',_tag:'<Picture 2>',desc:'ending frame',job:'frame anchor (first/last)'}, '<Picture 2>', 'fully_preserved'],
    ['whole-video camera', {kind:'vid',_tag:'<Video 1>',desc:'left pan',job:'camera reference'}, '<Video 1>', 'attribute_transfer'],
    ['voice reference', {kind:'aud',_tag:'<Audio 1>',desc:'quiet voice',job:'voice timbre'}, '<Audio 1>', 'reference']
  ]) {
    fields.subj = ''; fields.ret = ''; starterCtx.media = [media];
    vm.runInContext('insertStarter(0)', starterCtx);
    const okay = fields.subj.startsWith(label) && fields.ret.startsWith(label) && fields.ret.includes(marker);
    if (!okay) failed++;
    console.log(`${okay ? 'PASS' : 'FAIL'} reference starter: ${name}`);
  }
}
for (const [name, request, expected] of [
  ['plain action copied', 'A woman walks across a battlefield for 8 seconds.', '[Shot 1] A woman walks across a battlefield.'],
  ['alternate duration stripped', 'Make a video 8 seconds long where a woman walks across a battlefield.', '[Shot 1] A woman walks across a battlefield.'],
  ['specified details copied', 'A woman in a red coat walks across a snowy field for 8 seconds.', '[Shot 1] A woman in a red coat walks across a snowy field.'],
  ['both actions retained', 'A woman walks to a door. She opens it.', '[Shot 1] A woman walks to a door. She opens it.']
]) {
  const actual = simple(request)?.text?.imd;
  const okay = actual === expected;
  if (!okay) failed++;
  console.log(`${okay ? 'PASS' : 'FAIL'} literal content: ${name}${okay ? '' : ' '+JSON.stringify(actual)}`);
}
const declines = [
  ['missing cut time', 'Text-only 8-second video. In shot 1, a woman walks. In shot 2, she runs.'],
  ['named video reference', 'Use Video 1 as a reference. A woman walks.'],
  ['dialogue', 'A woman walks and says hello for 8 seconds.'],
  ['picture number gap', 'Picture 2 is the woman. She walks for 8 seconds.']
];
for (const [name, request] of declines) {
  const okay = simple(request) === null;
  if (!okay) failed++;
  console.log(`${okay ? 'PASS' : 'FAIL'} complex request sent to Ollama: ${name}`);
}
const edited = clone(base);
edited.text.imd = '[Shot 1] A woman walks slowly across a battlefield.';
for (const [name, candidate, request, expected] of [
  ['allowed shot change', edited, 'Make shot 1 slower.', false],
  ['unasked asset change', {...edited, media:[{kind:'pic',desc:'invented',on:true}]}, 'Make shot 1 slower.', true],
  ['unasked duration change', {...edited, dur:12}, 'Make shot 1 slower.', true],
  ['unasked music change', {...edited, text:{...edited.text,mus:'Orchestral score.'}}, 'Make shot 1 slower.', true],
  ['requested soundscape change', {...edited, text:{...edited.text,ss:'Rain sounds.'}}, 'Add rain sounds to the soundscape.', false]
]) {
  const actual = editIssues(candidate, base, request).length > 0;
  if (actual !== expected) failed++;
  console.log(`${actual === expected ? 'PASS' : 'FAIL'} edit boundary: ${name}`);
}
process.exitCode = failed ? 1 : 0;
