const { spawn, execSync } = require('child_process');
const http = require('http');

const PORT = 3000;
const CDP_PORT = 9260;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://localhost:${PORT}`, r => res()).on('error', rej);
      });
      break;
    } catch {
      await sleep(1000);
    }
  }

  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await sleep(1500);
  const targets = await new Promise((resolve) => {
    http.get(`http://localhost:${CDP_PORT}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const wsUrl = targets.find(t => t.type === 'page').webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  await new Promise(r => ws.onopen = r);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION THROWN:', JSON.stringify(msg.params.exceptionDetails, null, 2));
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
  };

  function send(method, params = {}) {
    return new Promise(r => {
      ws.send(JSON.stringify({ id: 1, method, params }));
      setTimeout(r, 500);
    });
  }

  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Testing /clients...');
  await send('Page.navigate', { url: `http://localhost:${PORT}/clients` });
  await sleep(3000);

  console.log('Testing /contact...');
  await send('Page.navigate', { url: `http://localhost:${PORT}/contact` });
  await sleep(3000);

  ws.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}
}

main().catch(console.error);

