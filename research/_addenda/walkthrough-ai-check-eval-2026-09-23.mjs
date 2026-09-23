// Check the guide's local-model bridge without contacting Ollama.
import vm from 'node:vm';
import { loadApp } from './validator-harness/extract.mjs';

const app = loadApp();
const draft = {
  key: 'qwenimg21',
  source: 'image 1 = base image\nReplace the black umbrella with a yellow umbrella\nKeep the face unchanged',
  prompt: 'Edit <image1>: Replace the black umbrella with a yellow umbrella. Keep the face unchanged.'
};
app.guidedDraft = draft;
vm.runInContext(`
  appState = 'ready'; chatModel = 'qwen2.5:7b-instruct';
  streamChat = async (system, user, onDelta, temp) => {
    globalThis.guidedCall = {system, user, temp};
    return 'No clear issue found.';
  };
`, app);
let streamed = '';
app.guidedCallback = value => { streamed = value; };
const result = await vm.runInContext('reviewWalkPromptWithAI(guidedDraft, guidedCallback)', app);
if (result.model !== 'qwen2.5:7b-instruct' || !result.review.startsWith('No clear issue found.') ||
    streamed !== result.review || !app.guidedCall.user.includes(draft.source) ||
    !app.guidedCall.user.includes(draft.prompt) || app.guidedCall.temp !== 0.1)
  throw new Error('The selected model did not receive the original fields and draft');
console.log('PASS configured model receives the guided fields and prompt');

app.aiRaw = 'Needs review:\n- Input: "yellow umbrella" | Prompt: "[absent]" | Why: the color is missing';
const falseAlarm = vm.runInContext('verifyWalkAIReview(aiRaw, guidedDraft.source, guidedDraft.prompt)', app);
if (!falseAlarm.startsWith('No supported issue found')) throw new Error('False absence claim was displayed');
console.log('PASS AI claim that repeats an existing detail is discarded');

app.aiRaw = 'Needs review:\n- Input: "yellow umbrella" | Prompt: "blue umbrella" | Why: the color changed';
app.badPrompt = draft.prompt.replace('yellow umbrella', 'blue umbrella');
const supported = vm.runInContext('verifyWalkAIReview(aiRaw, guidedDraft.source, badPrompt)', app);
if (!supported.includes('Needs review:') || !supported.includes('yellow umbrella → blue umbrella')) throw new Error('Supported mismatch was lost');
console.log('PASS supported mismatches remain visible');

app.guidedDraft = {...draft, prompt: ''};
await vm.runInContext('reviewWalkPromptWithAI(guidedDraft)', app).then(
  () => { throw new Error('Empty draft was accepted'); },
  error => { if (!/Assemble a valid/.test(error.message)) throw error; }
);
console.log('PASS incomplete draft is rejected before an AI call');

vm.runInContext("appState = 'no-model'", app);
app.guidedDraft = draft;
await vm.runInContext('reviewWalkPromptWithAI(guidedDraft)', app).then(
  () => { throw new Error('Missing model was accepted'); },
  error => { if (!/installed local model/.test(error.message)) throw error; }
);
console.log('PASS missing local model gives a clear error');
