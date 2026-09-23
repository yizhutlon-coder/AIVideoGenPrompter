import http from 'node:http';

const name = `test');alert(1);//"><img src=x onerror=alert(2)>`;
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8765');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
  if (req.url === '/api/tags') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ models: [
      { name, size: 123456789 },
      { name: 'gpt-oss:120b-cloud', size: 0 },
      { name: 'renamed-cloud-alias', size: 0 }
    ] }));
    return;
  }
  res.writeHead(404).end();
}).listen(11434, '127.0.0.1', () => console.log('Mock Ollama listening on 127.0.0.1:11434'));
