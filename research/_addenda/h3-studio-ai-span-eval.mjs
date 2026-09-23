// Experimental span-extraction evaluation. Nothing from this file is used by the app.
// node research/_addenda/h3-studio-ai-span-eval.mjs
import fs from 'node:fs';

const cases = [
  { id:'simple-text', request:'Text-only 8-second video: a woman walks across a battlefield. Keep only that action. No camera move, sound, music, outfit, weapon, or other visual detail is specified.', assets:0, actions:['woman walks across a battlefield'], cuts:[] },
  { id:'plain-text', request:'A woman walks across a battlefield for 8 seconds.', assets:0, actions:['woman walks across a battlefield'], cuts:[] },
  { id:'two-shot', request:'Text-only 8-second video with two shots. In shot 1, a woman stands on a dock. At 4 seconds cut to shot 2 as she walks toward a boat. No music or sound.', assets:0, actions:['woman stands on a dock','she walks toward a boat'], cuts:[4] },
  { id:'first-frame', request:'Picture 1 is the first frame, showing a woman on a dock. Make an 8-second video where she walks toward a boat. No other references or sound.', assets:1, actions:['she walks toward a boat'], cuts:[] },
  { id:'two-pictures', request:'Picture 1 is the woman to preserve. Picture 2 supplies a battlefield, her outfit, and a position guide who is replaced by the woman in picture 1. The woman from picture 1 jumps around the battlefield cutting down enemies. Use only these two pictures; no video or audio reference.', assets:2, actions:['woman from picture 1 jumps around the battlefield cutting down enemies'], cuts:[] },
  { id:'dialogue', request:'Make an 8-second text-only video. A woman walks into a room and says "Who goes there?" No music.', assets:0, actions:['woman walks into a room'], dialogue:['Who goes there?'], cuts:[] },
  { id:'three-pictures', request:'Picture 1 is the character. Picture 2 is the red coat she should wear. Picture 3 is a snowy field. The character walks across the field wearing the red coat. No video or audio reference.', assets:3, actions:['character walks across the field wearing the red coat'], cuts:[] },
];

const schema = {type:'object',additionalProperties:false,required:['assets','actions','dialogue','sound','music','cutTimes'],properties:{
  assets:{type:'array',items:{type:'object',additionalProperties:false,required:['kind','quote'],properties:{kind:{type:'string',enum:['picture','video','audio']},quote:{type:'string'}}}},
  actions:{type:'array',items:{type:'string'}}, dialogue:{type:'array',items:{type:'string'}},
  sound:{type:'array',items:{type:'string'}}, music:{type:'array',items:{type:'string'}},
  cutTimes:{type:'array',items:{type:'number'}}
}};
const variant = process.argv.includes('--v2') ? 'v2' : 'v1';
const system = variant === 'v1'
  ? `Extract only exact, contiguous quotes from the user text. Never paraphrase, add, or infer a reference asset. Each quote must occur verbatim in the user text, including every action and every explicitly named reference asset. A video to be generated is not an input video reference. Return JSON that matches the schema. If a category is absent, use an empty array. cutTimes are times explicitly stated for cuts, in seconds.`
  : `You are a literal quote extractor, not a video writer. Every string in every array must be an exact contiguous substring copied from the USER text. Never change pronouns, punctuation, or tense. In assets, include only numbered input Picture/Image/Photo/Video/Audio references; the requested output video is never an input asset. In actions, include every distinct requested visible action or state, in original order, but exclude asset definitions and instructions about format or duration. Put spoken words in dialogue, not actions. In cutTimes, include ONLY numbers explicitly attached to a cut or shot transition; video duration is never a cut time. If a category is not stated, return []. Example input: "Text-only 8-second video with two shots. In shot 1, a dog sits. At 4 seconds cut to shot 2 as it runs. No music." Example output: {"assets":[],"actions":["a dog sits","it runs"],"dialogue":[],"sound":[],"music":[],"cutTimes":[4]}. Return only JSON matching the schema.`;
const models = ['qwen2.5:7b-instruct','R4C3R/qwen2.5-7b-instruct-heretic:q8_0'];
const results=[];
for (const model of models) for (const item of cases) {
  const response=await fetch('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(120000),body:JSON.stringify({model,stream:false,think:false,format:schema,options:{temperature:0,num_predict:1800},messages:[{role:'system',content:system},{role:'user',content:item.request}]})});
  if(!response.ok) throw new Error(model+' '+item.id+' HTTP '+response.status);
  const data=await response.json();
  const raw=data.message?.content||'';
  let p; try{p=JSON.parse(raw)}catch{}
  const issues=[];
  if(!p){issues.push('invalid JSON');}
  else {
    const quotes=[...(p.assets||[]).map(x=>x.quote),...(p.actions||[]),...(p.dialogue||[]),...(p.sound||[]),...(p.music||[])];
    for(const quote of quotes) if(!item.request.toLowerCase().includes(String(quote).toLowerCase())) issues.push('non-source quote: '+quote);
    if((p.assets||[]).length!==item.assets) issues.push('asset count '+(p.assets||[]).length+' expected '+item.assets);
    if((p.assets||[]).some(x=>x.kind!=='picture')) issues.push('wrong asset kind');
    for(const action of item.actions) if(!(p.actions||[]).some(q=>String(q).toLowerCase().includes(action.toLowerCase()))) issues.push('missing action: '+action);
    for(const line of item.dialogue||[]) if(!(p.dialogue||[]).some(q=>String(q).toLowerCase().includes(line.toLowerCase()))) issues.push('missing dialogue: '+line);
    if(JSON.stringify(p.cutTimes||[])!==JSON.stringify(item.cuts)) issues.push('cut times '+JSON.stringify(p.cutTimes)+' expected '+JSON.stringify(item.cuts));
    if((p.assets||[]).some(x=>x.kind!=='picture') && /no video or audio reference/i.test(item.request)) issues.push('invented non-picture asset');
  }
  const pass=!issues.length;
  results.push({model,case:item.id,pass,issues,output:p,raw});
  console.log(`${model} ${item.id}: ${pass?'PASS':'FAIL '+issues.join(' | ')}`);
}
fs.writeFileSync(new URL('./h3-studio-ai-span-eval-'+variant+'-2026-09-22.json',import.meta.url),JSON.stringify({date:new Date().toISOString(),variant,results},null,2)+'\n');
console.log('Passed '+results.filter(x=>x.pass).length+'/'+results.length);
