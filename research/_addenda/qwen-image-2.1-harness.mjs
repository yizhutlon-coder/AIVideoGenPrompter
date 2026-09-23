import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadApp, TARGETS, validate } from './validator-harness/extract.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'PromptStudio.html'), 'utf8');
let failures = 0;

function check(ok, label, detail = '') {
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + label + (detail ? ' — ' + detail : ''));
  if (!ok) failures++;
}
function hard(key, output, intent) {
  return validate(key, output, intent).filter(x => !x.startsWith('advisory:'));
}
function hasIssue(issues, fragment) {
  return issues.some(x => x.toLowerCase().includes(fragment.toLowerCase()));
}

check(!!TARGETS.qwenimg21, 'separate Qwen-Image 2.1 target exists');
check(TARGETS.qwenimg.system.includes('(2512)'), '2512 target remains version-specific');
check(TARGETS.qwenimg21.system.includes('up to 10 references') || TARGETS.qwenimg21.system.includes('at most 10 references'), 'system prompt states official reference cap');
check(TARGETS.qwenimg21.system.includes('official wrapper exactly'), 'system prompt carries RGBA wrapper rule');

{
  const ctx = loadApp();
  const simple = vm.runInContext("simplePromptFor('qwenimg21', 'A red ceramic cup on a white table.', '')", ctx);
  check(simple === 'A red ceramic cup on a white table.', 'Simple mode remains literal and adds no negative', JSON.stringify(simple));
}

check(!hard('qwenimg21', 'A red ceramic cup on a white table.', 'A red ceramic cup on a white table.').length,
  'grounded T2I prompt passes');

{
  const issues = hard('qwenimg21', 'A red ceramic cup.\n\nNegative prompt: blurry', 'A red ceramic cup.');
  check(hasIssue(issues, 'negative prompt included'), 'default CFG-1 target rejects a negative block', issues.join(' | '));
}

{
  const intent = 'Picture 1 is the woman. Picture 2 is the blue jacket. Put the blue jacket from picture 2 on the woman in picture 1.';
  const output = 'Put the blue jacket from <image2> on the woman in <image1>. Keep everything else unchanged.';
  check(!hard('qwenimg21', output, intent).length, 'ordered two-reference edit passes');
  const missing = hard('qwenimg21', 'Put the blue jacket on the woman in <image1>. Keep everything else unchanged.', intent);
  check(hasIssue(missing, 'reference image 2'), 'missing numbered reference is rejected', missing.join(' | '));
  const invented = hard('qwenimg21', output + ' Use <image3> for lighting.', intent);
  check(hasIssue(invented, 'unlisted reference <image3>'), 'invented numbered reference is rejected', invented.join(' | '));
}

{
  const refs = Array.from({length: 11}, (_, i) => `image ${i + 1}`).join(', ');
  const tags = Array.from({length: 11}, (_, i) => `<image${i + 1}>`).join(', ');
  const issues = hard('qwenimg21', `Combine ${tags}. Keep everything else unchanged.`, `Use ${refs} as references.`);
  check(hasIssue(issues, 'more than 10 reference images'), '11 references exceed official cap', issues.join(' | '));
}

{
  const intent = 'Create a transparent PNG of a red ceramic cup.';
  const good = 'This is an RGBA image with transparency. A red ceramic cup. The image has alpha channel and the background is transparent.';
  check(!hard('qwenimg21', good, intent).length, 'official RGBA wrapper passes');
  const missing = hard('qwenimg21', 'A red ceramic cup on a transparent background.', intent);
  check(hasIssue(missing, 'official RGBA prompt wrapper'), 'transparent T2I without wrapper is rejected', missing.join(' | '));
  const unsolicited = hard('qwenimg21', good, 'Create a red ceramic cup.');
  check(hasIssue(unsolicited, 'switches to transparent RGBA mode'), 'unsolicited transparency is rejected', unsolicited.join(' | '));
}

{
  const issues = hard('qwenimg21', 'Remove the background from <image1>, and output a PNG image.', 'Remove the background from image 1.');
  check(!issues.length, 'official background-removal instruction passes', issues.join(' | '));
}

{
  const intent = 'Create a poster that reads "OPEN LATE".';
  check(!hard('qwenimg21', 'A poster that reads "OPEN LATE".', intent).length, 'exact quoted visible text passes');
  const issues = hard('qwenimg21', 'A poster that reads "OPEN".', intent);
  check(hasIssue(issues, 'quoted visible text was changed or omitted'), 'changed visible text is rejected', issues.join(' | '));
}

{
  const issues = hard('qwenimg21', 'A woman walking.', 'Create a video of a woman walking.');
  check(hasIssue(issues, 'still images'), 'video request is routed away from Qwen-Image 2.1', issues.join(' | '));
}

{
  const issues = hard('qwenimg21', 'A photorealistic young woman in a red dress.', 'A woman.');
  check(hasIssue(issues, 'unstated'), 'general grounding still rejects invented image details', issues.join(' | '));
}

check(/name:'Qwen-Image 2\.1'[\s\S]*?lic:'Qwen Research — non-commercial'/.test(html),
  'picker exposes the non-commercial research license');
check(!/qwenimg21\s*:\s*'qwen'/.test(html), '2.1 is not mapped to the incompatible 2512 workflow');

if (process.argv.includes('--live')) {
  const modelArg = process.argv.indexOf('--model');
  const model = modelArg >= 0 ? process.argv[modelArg + 1] : 'qwen2.5:7b-instruct';
  const liveCases = [
    {
      name: 'detailed text-to-image',
      intent: 'Create an editorial photograph of a woman in a red coat holding a black umbrella beside a green boat on a blue dock at dawn. Rain falls. Side view. A small sign reads "PIER 7".'
    },
    {
      name: 'two-reference edit',
      intent: 'Image 1 is the base portrait. Image 2 supplies a blue denim jacket. Put the jacket from image 2 on the person in image 1. Preserve the face, hair, pose, lighting, crop, and background from image 1.'
    },
    {
      name: 'transparent generation',
      intent: 'Create a transparent PNG sticker of a red ceramic teapot with the words "TEA TIME" on it.'
    }
  ];
  for (const c of liveCases) {
    const res = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        model, stream:false, think:false,
        options:{temperature:0.1, num_predict:800},
        messages:[{role:'system', content:TARGETS.qwenimg21.system}, {role:'user', content:c.intent}]
      })
    });
    if (!res.ok) {
      check(false, 'live ' + c.name, 'Ollama HTTP ' + res.status);
      continue;
    }
    const body = await res.json();
    const output = String(body.message?.content || '').replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();
    const issues = hard('qwenimg21', output, c.intent);
    check(!!output && !issues.length, 'live ' + c.name, issues.length ? issues.join(' | ') + ' :: ' + output.slice(0, 500) : output.slice(0, 220));
  }
  const app = loadApp();
  const tutorQuestion = 'What is Qwen-Image 2.1 licensed for, how many reference images does it support, and does its default ComfyUI workflow use the old 2512 negative list?';
  const tutor = vm.runInContext('tutorKnownAnswer(' + JSON.stringify(tutorQuestion) + ')', app);
  const tutorOk = /Qwen Research License/i.test(tutor) && /non-commercial/i.test(tutor) && /10 reference/i.test(tutor) && /CFG\s*1|inactive/i.test(tutor) && /(?:does not|do not|not)\s+(?:use|append|inherit|carry)/i.test(tutor);
  check(tutorOk, 'tutor critical-facts answer', tutor.slice(0, 500) || 'no response');
}

if (failures) {
  console.error(`\n${failures} Qwen-Image-2.1 check(s) failed.`);
  process.exit(1);
}
console.log('\nAll Qwen-Image-2.1 checks passed.');
