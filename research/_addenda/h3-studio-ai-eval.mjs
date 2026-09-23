// Live, synthetic H3 Studio AI-build evaluation. Requires local Ollama.
// node research/_addenda/h3-studio-ai-eval.mjs [--model NAME] [--save]
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../../tools/H3Studio.html', import.meta.url), 'utf8');
const segments = [
  ['var MODES =', 'var mode ='],
  ['var JOBS =', 'var JOB_EXCLUSIVE'],
  ['function aiRules()', 'function projForLLM()'],
  ['function sanitizeAI(', 'function extractJson('],
  ['function extractJson(', 'function aiProjectIssues('],
  ['function aiProjectIssues(', 'async function aiSend()']
].map(([a,b]) => {
  const start = html.indexOf(a), end = html.indexOf(b, start);
  if (start < 0 || end < 0) throw new Error('Missing app segment: ' + a);
  return html.slice(start,end);
});
const ctx = vm.createContext({});
vm.runInContext("var mode='T2VA';\n" + segments.join('\n'), ctx);
const rules = vm.runInContext('aiRules()', ctx);
const sanitize = vm.runInContext('sanitizeAI', ctx);
const parse = vm.runInContext('extractJson', ctx);
const issues = vm.runInContext('aiProjectIssues', ctx);

const cases = [
  { id:'simple-text', request:'Text-only 8-second video: a woman walks across a battlefield. Keep only that action. No camera move, sound, music, outfit, weapon, or other visual detail is specified.', mode:'T2VA', media:0, shots:1, required:['woman','walk','battlefield'] },
  { id:'plain-text', request:'A woman walks across a battlefield for 8 seconds.', mode:'T2VA', media:0, shots:1, required:['woman','walk','battlefield'] },
  { id:'two-shot', request:'Text-only 8-second video with two shots. In shot 1, a woman stands on a dock. At 4 seconds cut to shot 2 as she walks toward a boat. No music or sound.', mode:'T2VA', media:0, shots:2, required:['woman','dock','boat'] },
  { id:'first-frame', request:'Picture 1 is the first frame, showing a woman on a dock. Make an 8-second video where she walks toward a boat. No other references or sound.', mode:'I2VA', media:1, shots:1, required:['woman','walk','boat'] },
  { id:'two-pictures', request:'Picture 1 is the woman to preserve. Picture 2 supplies a battlefield, her outfit, and a position guide who is replaced by the woman in picture 1. The woman from picture 1 jumps around the battlefield cutting down enemies. Use only these two pictures; no video or audio reference.', mode:'REF', media:2, shots:1, required:['woman','battlefield','enem'] }
];

const argv = process.argv.slice(2);
const arg = flag => argv.includes(flag) ? argv[argv.indexOf(flag)+1] : null;
const models = arg('--model') ? [arg('--model')] : [
  'qwen2.5:7b-instruct', 'R4C3R/qwen2.5-7b-instruct-heretic:q8_0'
];
const selected = arg('--case') ? cases.filter(x => x.id === arg('--case')) : cases;
const strategy = arg('--strategy') || 'baseline';
function schemaFor(item, fixed){
  const reference = item.mode === 'REF';
  const fields = reference ? ['subj','summ','ret','dd','ss','mus'] : ['imd','ss','mus'];
  const text = { type:'object', properties:Object.fromEntries(fields.map(k=>[k,{type:'string'}])), required:fields, additionalProperties:false };
  const media = { type:'array', items:{ type:'object', properties:{
    kind:{type:'string',enum:['pic','vid','aud']}, desc:{type:'string'}, dur:{type:'integer'},
    audioMode:{type:'string',enum:['off','paired','alone']}, on:{type:'boolean'}, job:{type:'string'}
  }, required:['kind','desc','dur','on','job'], additionalProperties:false } };
  if (fixed) { media.minItems=item.media; media.maxItems=item.media; }
  return { type:'object', properties:{
    mode:{type:'string',enum:fixed?[item.mode]:['T2VA','I2VA','FL2VA','L2VA','REF']},
    dur:{type:'integer',minimum:5,maximum:15}, media, text
  }, required:['mode','dur','media','text'], additionalProperties:false };
}
function requestFor(model,item){
  if (strategy === 'tool') return { model, stream:false, think:false, options:{temperature:0,num_predict:2500}, tools:[{
    type:'function', function:{name:'set_h3_project',description:'Return the complete MiniMax H3 project that the user requested.',parameters:schemaFor(item,false)}
  }], messages:[
    {role:'system',content:'Call set_h3_project exactly once with the full project. Include only user-supplied assets and details. Begin the timeline with [Shot 1], without a timestamp. Use a timestamp on each later shot.'},
    {role:'user',content:item.request}
  ] };
  if (strategy === 'baseline') return { model, stream:false, options:{temperature:0.3}, messages:[
    {role:'system',content:rules}, {role:'user',content:'Set up a new project for this request:\n'+item.request}
  ] };
  if (strategy === 'json') return { model, stream:false, think:false, format:'json', options:{temperature:0}, messages:[
    {role:'system',content:rules}, {role:'user',content:'Set up a new project for this request:\n'+item.request}
  ] };
  const fixed = strategy === 'schema-fixed';
  const schema = schemaFor(item,fixed);
  const system = fixed
    ? `You format a MiniMax H3 project. The output mode is ${item.mode}; there are exactly ${item.media} user-supplied reference assets. Do not add any media or scene facts. Keep the user's actions and order. Use [Shot 1] without a timestamp; later shots start [Shot N] At MM:SS.mmm. Return only JSON in the provided schema.`
    : 'You format a MiniMax H3 project. Choose mode and media only from explicit user assets. Do not invent assets or scene facts. Use [Shot 1] without a timestamp; later shots start [Shot N] At MM:SS.mmm. Return only JSON in the provided schema.';
  return { model, stream:false, think:false, format:schema, options:{temperature:0,num_predict:2500}, messages:[
    {role:'system',content:system}, {role:'user',content:item.request}
  ] };
}
const results = [];
for (const model of models) for (const item of selected) {
  const response = await fetch('http://127.0.0.1:11434/api/chat', {
    method:'POST', headers:{'Content-Type':'application/json'}, signal:AbortSignal.timeout(120000),
    body:JSON.stringify(requestFor(model,item))
  });
  if (!response.ok) throw new Error(model+' '+item.id+' HTTP '+response.status);
  const data = await response.json();
  const args = data.message?.tool_calls?.[0]?.function?.arguments;
  const raw = strategy === 'tool' ? JSON.stringify(args || {}) : data.message?.content || '';
  const project = sanitize(strategy === 'tool' ? args : parse(raw));
  const problems = issues(project, item.request, true);
  if (project) {
    if (project.mode !== item.mode) problems.push('expected mode '+item.mode+', got '+project.mode);
    if (project.media.length !== item.media) problems.push('expected '+item.media+' media, got '+project.media.length);
    const body = project.mode === 'REF' ? project.text.dd : project.text.imd;
    if ((body.match(/\[Shot \d+\]/g) || []).length !== item.shots) problems.push('expected '+item.shots+' shots');
    for (const word of item.required) if (!body.toLowerCase().includes(word)) problems.push('missing '+word);
  }
  results.push({ model, case:item.id, strategy, pass:!problems.length, problems, project, raw });
  console.log(`${model} ${item.id}: ${problems.length ? 'FAIL '+problems.join(' | ') : 'PASS'}`);
}
if (argv.includes('--save')) fs.writeFileSync(new URL('./h3-studio-ai-eval-'+strategy+'-2026-09-22.json', import.meta.url), JSON.stringify({date:new Date().toISOString(),results},null,2)+'\n');
console.log(`Passed ${results.filter(x=>x.pass).length}/${results.length}`);
process.exitCode = results.some(x=>!x.pass) ? 1 : 0;
