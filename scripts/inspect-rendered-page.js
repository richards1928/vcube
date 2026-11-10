const http = require('http');
const { spawn, execSync } = require('child_process');

const PORT = 3049;
const CDP_PORT = 9273;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && this.callbacks.has(msg.id)) {
            const { resolve, reject } = this.callbacks.get(msg.id);
            this.callbacks.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (e) {}
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      const timer = setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          reject(new Error(`CDP ${method} timed out`));
        }
      }, 10000);

      this.callbacks.set(id, {
        resolve: (res) => { clearTimeout(timer); resolve(res); },
        reject: (err) => { clearTimeout(timer); reject(err); }
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
  }
}

async function getCDPTarget() {
  for (let i = 0; i < 20; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${CDP_PORT}/json`, (res) => {
          let buf = '';
          res.on('data', chunk => buf += chunk);
          res.on('end', () => resolve(JSON.parse(buf)));
        }).on('error', reject);
      });
      const page = data.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(500);
  }
  throw new Error('CDP target not found');
}

async function main() {
  const nextServer = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${PORT}/design-preview`, r => {
          if (r.statusCode === 200) res();
          else rej(new Error('Status ' + r.statusCode));
        }).on('error', rej);
      });
      console.log('Next.js server is ready');
      break;
    } catch {
      await sleep(500);
    }
  }

  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await sleep(2000);
  const wsUrl = await getCDPTarget();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const evalResult = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const sections = ['about', 'expertise', 'selected-work', 'approach', 'contact'];
      return sections.map(id => {
        const el = document.getElementById(id);
        if (!el) return { id, exists: false };
        const rect = el.getBoundingClientRect();
        return {
          id,
          exists: true,
          top: rect.top,
          height: rect.height,
          bg: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('Sections status:', JSON.stringify(evalResult.result.value, null, 2));

  // Check layoutMetrics
  const metrics = await cdp.send('Page.getLayoutMetrics');
  console.log('Layout metrics:', JSON.stringify(metrics.contentSize, null, 2));

  cdp.close();
  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
}

main().catch(console.error);
