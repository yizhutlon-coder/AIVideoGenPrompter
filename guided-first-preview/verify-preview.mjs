import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

for (const file of ['guided-first-preview/PromptStudio.html', 'guided-first-preview/tools/WalkThrough.html']) {
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  if (!scripts.length) throw new Error(`No script found in ${file}`);
  for (const script of scripts) new Script(script[1], { filename: file });
  process.stdout.write(`PASS ${file}: ${scripts.length} script(s) parse\n`);
}

const main = readFileSync('guided-first-preview/PromptStudio.html', 'utf8');
const guide = readFileSync('guided-first-preview/tools/WalkThrough.html', 'utf8');
for (const [name, ok] of [
  ['guided start visible without Ollama', main.includes('<body class="preview-guided">') && main.includes("$('tool').style.display = 'block';")],
  ['direct route preserved', main.includes('Paste an idea · local AI') && main.includes('function showPreviewPath(path)')],
  ['local AI setup optional', main.includes('function togglePreviewAISetup()')],
  ['Chinese version for supported guide targets', guide.includes("['wanI2V','zimage'].includes(built.key)") && main.includes('async function translateWalkPromptToChinese(draft)')]
]) {
  if (!ok) throw new Error(`FAIL ${name}`);
  process.stdout.write(`PASS ${name}\n`);
}

const start = main.indexOf('async function checkStatus() {');
const end = main.indexOf("$('modelSel').addEventListener", start);
if (start < 0 || end < 0) throw new Error('Could not isolate local AI status handler');
const checkStatusSource = main.slice(start, end);
for (const [name, fetch] of [
  ['no Ollama server', async () => { throw new Error('offline'); }],
  ['Ollama with no installed model', async () => ({ ok: true, json: async () => ({ models: [] }) })]
]) {
  const elements = Object.fromEntries(['dot','stateTxt','previewAiState','previewSetupBtn','previewDirectHint','goBtn','tool'].map(id => [id, { style: {}, textContent: '', disabled: false }]));
  const context = { fetch, AbortSignal, pulling: false, appState: 'checking', chatModel: null,
    $: id => elements[id], setSteps: () => {}, isCloudModelName: () => false };
  runInNewContext(checkStatusSource, context);
  await context.checkStatus();
  if (elements.tool.style.display !== 'block' || elements.goBtn.disabled !== true || !elements.previewAiState.textContent.includes('guide works now'))
    throw new Error(`FAIL guided startup with ${name}`);
  process.stdout.write(`PASS guided startup with ${name}\n`);
}
