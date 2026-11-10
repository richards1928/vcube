const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3035;
const CDP_PORT = 9245;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Richards Dakarapu\\.gemini\\antigravity\\brain\\e6cfca55-8dfe-42e8-a39f-baef71c0c841';
const SCREENSHOTS_DIR = path.join(ARTIFACT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function getCDPTarget() {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${CDP_PORT}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const targets = JSON.parse(data);
        const page = targets.find(t => t.type === 'page');
        if (page) resolve(page.webSocketDebuggerUrl);
        else reject(new Error('No page target found'));
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('1. Starting Next.js production server on port', PORT);
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

  console.log('2. Launching headless Chrome on port', CDP_PORT);
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-backgrounding-occluded-windows',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--window-size=1920,1080',
    'about:blank'
  ]);

  await sleep(1500);
  const wsUrl = await getCDPTarget();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  async function snap(name, urlPath, w, h, mob, evaluateJs) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: mob ? 2 : 1,
      mobile: !!mob
    });
    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}${urlPath}` });
    await sleep(2200);

    if (evaluateJs) {
      await cdp.send('Runtime.evaluate', { expression: evaluateJs });
      await sleep(1000);
    }

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${name}.png`);
  }

  // 1. Projects Page
  console.log('Capturing Projects Page...');
  await snap('phase8-projects-desktop-1440', '/projects', 1440, 900, false);
  await snap('phase8-projects-mobile-390', '/projects', 390, 844, true);

  // 2. Clients Page
  console.log('Capturing Clients Page...');
  await snap('phase8-clients-desktop-1440', '/clients', 1440, 900, false);
  await snap('phase8-clients-mobile-390', '/clients', 390, 844, true);

  // 3. Queries Page
  console.log('Capturing Queries Page...');
  await snap('phase8-queries-desktop-1440', '/queries', 1440, 900, false);
  await snap('phase8-queries-mobile-390', '/queries', 390, 844, true);

  // 4. Contact Page
  console.log('Capturing Contact Page...');
  await snap('phase8-contact-desktop-1440', '/contact', 1440, 900, false);
  await snap('phase8-contact-mobile-390', '/contact', 390, 844, true);

  // 5. Overflow Audit across 7 viewports
  console.log('Running Horizontal Overflow Check across 7 viewports...');
  const viewports = [
    { name: '360px', w: 360, h: 640, mob: true },
    { name: '390px', w: 390, h: 844, mob: true },
    { name: '430px', w: 430, h: 932, mob: true },
    { name: '768px', w: 768, h: 1024, mob: true },
    { name: '1024px', w: 1024, h: 768, mob: false },
    { name: '1440px', w: 1440, h: 900, mob: false },
    { name: '1920px', w: 1920, h: 1080, mob: false }
  ];

  const testPaths = ['/', '/projects', '/clients', '/queries', '/contact'];
  const overflowIssues = [];

  for (const p of testPaths) {
    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mob
      });
      await cdp.send('Page.navigate', { url: `http://localhost:${PORT}${p}` });
      await sleep(1000);

      const evalResult = await cdp.send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        })`,
        returnByValue: true
      });

      const { scrollWidth, clientWidth, hasOverflow } = evalResult.result.value;
      if (hasOverflow) {
        overflowIssues.push({ path: p, viewport: vp.name, scrollWidth, clientWidth });
      }
    }
  }

  if (overflowIssues.length === 0) {
    console.log('OVERFLOW AUDIT PASSED: 0 horizontal overflows across all 7 viewports and 5 key routes!');
  } else {
    console.warn('Overflow detected in:', overflowIssues);
  }

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}

  console.log('Phase 8 verification capture complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

