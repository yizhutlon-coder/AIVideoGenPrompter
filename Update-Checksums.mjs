// Run with Node.js before publishing a release. Hash LF-normalized text as GitHub serves it.
import fs from 'node:fs';
import crypto from 'node:crypto';

const files = [
  '!START HERE.bat', 'PromptStudio.html', 'Start-PromptStudio.bat',
  'Launch-PromptStudio.ps1', 'Serve-PromptStudio.ps1',
  'start-promptstudio.sh', 'serve-promptstudio.py',
  'Start-Portable.bat', 'Make-Portable.bat',
  'Verify-PortableZip.ps1', 'Verify-PortableRuntime.ps1',
  'tools/H3Builder.html', 'tools/H3Studio.html', 'tools/WalkThrough.html',
  'tools/ClipPicker.html', 'tools/ClipStitcher.html',
  'tools/MetaInspector.html', 'tools/ClipChopper.bat', 'tools/ClipChopper.ps1',
  'tools/video-prompt-translator.html', 'README.md', 'SECURITY.md',
  'Update-Checksums.mjs'
];
const lines = files.map(file => {
  const data = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const hash = crypto.createHash('sha256').update(data, 'utf8').digest('hex');
  return `${hash}  ${file}`;
});
const manifest = lines.join('\n') + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync('docs/SHA256SUMS.txt', 'utf8') !== manifest) {
    console.error('Release checksums are out of date. Run node Update-Checksums.mjs.');
    process.exitCode = 1;
  } else console.log(`Verified ${lines.length} release checksums.`);
} else {
  fs.writeFileSync('docs/SHA256SUMS.txt', manifest, 'utf8');
  console.log(`Updated ${lines.length} release checksums.`);
}
