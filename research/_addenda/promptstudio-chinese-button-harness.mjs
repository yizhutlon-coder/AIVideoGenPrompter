// Per-model Chinese version checks. Add --live to exercise local Ollama.
import vm from 'node:vm';
import { loadApp, WAN_NEG, QWENIMG_NEG } from './validator-harness/extract.mjs';

const keys = ['wan', 'wanI2V', 'zimage', 'qwenimg'];
const source = 'A woman walks in a field.';
const chinese = {
  wan: '一名女子在田野里行走。\n\nNegative prompt: ' + WAN_NEG,
  wanI2V: '一名女子在田野里行走。\n\nNegative prompt: ' + WAN_NEG,
  zimage: '一名女子在田野里行走。',
  qwenimg: '一名女子在田野里行走。\n\nNegative prompt: ' + QWENIMG_NEG
};
let failures = 0;
function check(ok, label){
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + label);
  if (!ok) failures++;
}
function boot(key){
  const ctx = loadApp();
  const elements = new Map();
  function element(id){
    if (!elements.has(id)) elements.set(id, {
      id, style: {}, value: '', textContent: '', innerHTML: '', disabled: false,
      classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
      focus(){}, setSelectionRange(){}
    });
    return elements.get(id);
  }
  ctx.document.getElementById = element;
  ctx.document.querySelectorAll = selector => selector === '#chips input:checked' ? [{ dataset: { key } }] : [];
  ctx.AbortController = AbortController;
  ctx.setTimeout = setTimeout;
  ctx.clearTimeout = clearTimeout;
  ctx.fetch = fetch;
  vm.runInContext("appState='ready'; chatModel='qwen2.5:7b-instruct'", ctx);
  const run = expression => vm.runInContext(expression, ctx);
  return { ctx, element, run };
}
for (const key of keys){
  const h = boot(key);
  let copied = '';
  h.ctx.navigator.clipboard.writeText = value => { copied = value; return Promise.resolve(); };
  h.element('intent').value = source;
  h.run('simpleIntent = ' + JSON.stringify(source));
  await h.run('generate()');
  const original = h.run('lastRun.outputs[' + JSON.stringify(key) + ']');
  check(!!original && h.element('zh-btn-' + key).style.display !== 'none', key + ' offers a Chinese version');
  check(h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(original) + ', sourceForChinese(' + JSON.stringify(key) + '))').some(x => x.includes('not Chinese')), key + ' rejects English as Chinese');
  let attempts = 0;
  h.run('streamChat = async () => { globalThis.testAttempts++; return ' + JSON.stringify(original) + '; }');
  h.ctx.testAttempts = 0;
  await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
  attempts = h.ctx.testAttempts;
  check(attempts === 4 && !h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']'), key + ' withholds failed translation');
  h.run('streamChat = async () => ' + JSON.stringify(chinese[key]));
  await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
  const saved = h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']');
  const issues = h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(saved) + ', sourceForChinese(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:'));
  check(saved === chinese[key] && !issues.length && h.element('zh-wrap-' + key).style.display !== 'none', key + ' shows checked Chinese');
  h.run('streamChat = async () => ' + JSON.stringify(original));
  await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
  check(h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']') === saved && h.element('zh-out-' + key).textContent === saved, key + ' keeps previous version when redo fails');
  h.run('copyChinese(' + JSON.stringify(key) + ')');
  check(copied === h.run('pasteText(' + JSON.stringify(key) + ', lastRun.zhOutputs[' + JSON.stringify(key) + '])'), key + ' copies Chinese positive prompt');
  check(!!h.run('lastRun.hist.zhOutputs[' + JSON.stringify(key) + ']'), key + ' saves the version in history');
  h.run('loadHist(0)');
  check(h.element('zh-out-' + key).textContent === chinese[key] && h.element('zh-wrap-' + key).style.display !== 'none', key + ' restores Chinese version from history');
  h.run('invalidateChineseVersion(' + JSON.stringify(key) + ')');
  check(!h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']') && h.element('zh-btn-' + key).style.display !== 'none', key + ' drops stale version after revision');
}
{
  const h = boot('zimage');
  check(h.run('isChinesePrompt("zimage", "招牌上写着 \\\"OPEN NOW\\\"。")'), 'quoted English text remains allowed in Chinese prompt');
  check(!h.run('isChinesePrompt("zimage", "田野中一位 woman 步行。")'), 'mixed ordinary English is rejected');
  const battle = 'A woman runs across the battlefield wielding a claymore sword.';
  h.element('intent').value = battle;
  h.run('lastRun = {intent:' + JSON.stringify(battle) + ', outputs:{zimage:' + JSON.stringify(battle) + '}}');
  check(h.run('isChinesePrompt("zimage", "一名女子手持 claymore 剑在战场上奔跑。")'), 'source technical term can remain in a Chinese prompt');
  check(h.run('chineseCoverageIssues(' + JSON.stringify(battle) + ', "一名女子手持 claymore 剑穿越战场。").some(x => x.includes("running"))'), 'Chinese translation must retain the running action');
  const mixed = '一位 woman runs across the battlefield wielding a claymore sword. 女人手持 Claymore 剑在战场上奔跑。';
  check(h.run('isolateChineseDraft(' + JSON.stringify(mixed) + ')') === '女人手持 Claymore 剑在战场上奔跑。', 'English echo can be removed when a complete Chinese sentence follows');
}
for (const key of keys){
  const h = boot(key);
  h.element('langSel').value = 'zh';
  h.element('intent').value = source;
  h.run('simpleIntent = ' + JSON.stringify(source));
  h.run('streamChat = async () => ' + JSON.stringify('A woman walks in a field.'));
  await h.run('generate()');
  check(!h.run('lastRun.outputs[' + JSON.stringify(key) + ']'), key + ' global Chinese choice never falls back to English');
}

if (process.argv.includes('--live')) {
  for (const key of keys){
    const h = boot(key);
    h.element('intent').value = source;
    h.run('simpleIntent = ' + JSON.stringify(source));
    await h.run('generate()');
    h.ctx.liveResponses = [];
    h.ctx.originalStreamChat = h.run('streamChat');
    h.run('streamChat = async (...args) => { const result = await globalThis.originalStreamChat(...args); globalThis.liveResponses.push(result); return result; }');
    await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
    const output = h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']');
    const issues = output ? h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(output) + ', sourceForChinese(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no checked output'];
    check(!!output && !issues.length, key + ' local-model Chinese output' + (issues.length ? ': ' + issues.join(' | ') : ''));
    console.log(key + ' translation: ' + (output || h.element('zh-out-' + key).textContent).slice(0, 450));
    if (!output) console.log(key + ' rejected drafts: ' + JSON.stringify(h.ctx.liveResponses));
  }
}
if (process.argv.includes('--rich-live')) {
  for (const key of keys){
    const input = key === 'wan' || key === 'wanI2V'
      ? 'A woman in a red coat stands on a blue dock at dawn. She opens a black umbrella, then walks toward a green boat. The camera pans left.'
      : 'A woman in a red coat holds a black umbrella beside a green boat at a blue dock at dawn. Rain falls. Side view. Editorial photograph.';
    const h = boot(key);
    h.element('intent').value = input;
    h.run('simpleIntent = ' + JSON.stringify(input));
    await h.run('generate()');
    const original = h.run('lastRun.outputs[' + JSON.stringify(key) + ']');
    check(!!original, key + ' rich English source');
    if (!original) continue;
    h.ctx.liveResponses = [];
    h.ctx.originalStreamChat = h.run('streamChat');
    h.run('streamChat = async (...args) => { const result = await globalThis.originalStreamChat(...args); globalThis.liveResponses.push(result); return result; }');
    await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
    const output = h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']');
    const issues = output ? h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(output) + ', sourceForChinese(' + JSON.stringify(key) + '))').filter(x => !x.startsWith('advisory:')) : ['no checked output'];
    check(!!output && !issues.length, key + ' rich Chinese output' + (issues.length ? ': ' + issues.join(' | ') : ''));
    console.log(key + ' rich original: ' + original.slice(0, 250));
    console.log(key + ' rich translation: ' + (output || h.element('zh-out-' + key).textContent).slice(0, 300));
    if (!output) {
      console.log(key + ' rich rejected drafts: ' + JSON.stringify(h.ctx.liveResponses));
      for (const draft of h.ctx.liveResponses) {
        const full = draft + '\n\nNegative prompt: ' + h.run('splitOutput(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + ']).negativePrompt');
        console.log(key + ' rich rejection reasons: ' + JSON.stringify(h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(full) + ', sourceForChinese(' + JSON.stringify(key) + '))')));
      }
    }
  }
}
if (process.argv.includes('--battlefield-live')) {
  const input = 'A woman runs across the battlefield wielding a claymore sword.';
  for (const key of ['wan', 'wanI2V']) {
    const h = boot(key);
    h.element('intent').value = input;
    h.run('simpleIntent = ' + JSON.stringify(input));
    await h.run('generate()');
    const original = h.run('lastRun.outputs[' + JSON.stringify(key) + ']');
    h.ctx.liveResponses = [];
    h.ctx.originalStreamChat = h.run('streamChat');
    h.run('streamChat = async (...args) => { const result = await globalThis.originalStreamChat(...args); globalThis.liveResponses.push(result); return result; }');
    await h.run('makeChineseVersion(' + JSON.stringify(key) + ')');
    const output = h.run('lastRun.zhOutputs[' + JSON.stringify(key) + ']');
    check(!!output, key + ' battlefield Chinese version');
    console.log(key + ' battlefield original: ' + original);
    console.log(key + ' battlefield drafts: ' + JSON.stringify(h.ctx.liveResponses));
    if (!output) for (const draft of h.ctx.liveResponses) {
      const full = draft + '\n\nNegative prompt: ' + h.run('splitOutput(' + JSON.stringify(key) + ', lastRun.outputs[' + JSON.stringify(key) + ']).negativePrompt');
      console.log(key + ' battlefield rejection reasons: ' + JSON.stringify(h.run('validate(' + JSON.stringify(key) + ', ' + JSON.stringify(full) + ', sourceForChinese(' + JSON.stringify(key) + '))')));
    }
  }
}
console.log('Failures: ' + failures);
process.exitCode = failures ? 1 : 0;
