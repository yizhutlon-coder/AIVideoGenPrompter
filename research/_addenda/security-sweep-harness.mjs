import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const pages = [
  'PromptStudio.html', 'tools/H3Builder.html', 'tools/H3Studio.html',
  'tools/ClipPicker.html', 'tools/ClipStitcher.html', 'tools/MetaInspector.html',
  'tools/video-prompt-translator.html', 'tools/h3-studio-from-spec/H3Studio.html',
  'tools/h3-studio-review/H3Studio.html'
];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, source] of scripts) new Function(source);
  console.log(`syntax ${page}: ${scripts.length} script(s) OK`);
}

const stitcher = fs.readFileSync('tools/ClipStitcher.html', 'utf8');
const safeNameSource = stitcher.match(/function safeShellName\(s\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(safeNameSource);
const safeShellName = vm.runInNewContext(`${safeNameSource}; safeShellName`);
for (const name of ['clip 01.mp4', 'scene-2_final.mov']) assert.equal(safeShellName(name), true, name);
for (const name of ['a" & calc & ".mp4', 'clip%PATH%.mp4', 'clip$(touch x).mp4', 'clip\nrun.mp4', '../clip.mp4', 'CON.mp4']) {
  assert.equal(safeShellName(name), false, name);
}
assert.match(stitcher, /if \(unsafeShellNames\(\)\.length\) \{ toast\('Rename unsafe clips or output before downloading a batch file'\); return; \}/);
console.log('shell command name guard: OK');

const main = fs.readFileSync('PromptStudio.html', 'utf8');
assert.doesNotMatch(main, /onclick="(?:useModel|delModel)\('\$\{esc\(m\.name\)\}/);
assert.match(main, /data-model-index="\$\{i\}"/);
assert.match(main, /sel\.replaceChildren\(/);
console.log('model-name HTML injection guard: OK');

const backupSource = main.match(/function validSavedData\(key, value\)\{[\s\S]*?\n\}\nasync function importSavedData/)?.[0];
assert.ok(backupSource);
const targetNames = { wan: { name: 'Wan' }, minimax: { name: 'H3' } };
const validSavedData = vm.runInNewContext(
  `const TARGETS = ${JSON.stringify(targetNames)}; const COMFY_FOLDERS = ['loras']; ${backupSource.replace(/\nasync function importSavedData$/, '')}; validSavedData`
);
assert.equal(validSavedData('ps_history', JSON.stringify([{ intent:'hello', ts:1, outputs:{ wan:'safe' } }])), true);
assert.equal(validSavedData('ps_history', JSON.stringify([{ intent:'hello', ts:1, outputs:{ "wan');alert(1)//":'bad' } }])), false);
assert.equal(validSavedData('ps_pins', JSON.stringify([{ name:'Pin', text:'text', key:'evil' }])), false);
assert.equal(validSavedData('ps_comfy_models', JSON.stringify({ folders:{ loras:['safe.safetensors'] } })), true);
assert.equal(validSavedData('ps_comfy_models', JSON.stringify({ folders:{ loras:'not an array' } })), false);
console.log('saved-data import validation: OK');

const meta = fs.readFileSync('tools/MetaInspector.html', 'utf8');
const inflateSource = meta.match(/async function inflate\(u8\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(inflateSource);
const inflate = vm.runInNewContext(`${inflateSource}; inflate`, { DecompressionStream, Blob, TextEncoder, Uint8Array, Error });
assert.equal((await inflate(zlib.deflateSync(Buffer.from('small')))).length, 5);
await assert.rejects(() => inflate(zlib.deflateSync(Buffer.alloc(17 * 1024 * 1024))), /exceeds 16 MB/);
console.log('compressed metadata limit: OK');

const inspectSource = meta.match(/async function inspectFile\(file\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(inspectSource);
let fullReadCalled = false;
const inspectFile = vm.runInNewContext(`${inspectSource}; inspectFile`, {
  Uint8Array, scanForJson: () => 0
});
const big = {
  name:'large.mp4', type:'video/mp4', size:257*1024*1024,
  slice: () => ({ arrayBuffer:async () => new Uint8Array([1,2]).buffer }),
  arrayBuffer:async () => { fullReadCalled=true; throw Error('full read'); }
};
const partial = await inspectFile(big);
assert.equal(fullReadCalled, false);
assert.match(partial.notes.join(' '), /first and last 12 MB/);
console.log('large-file bounded scan: OK');
