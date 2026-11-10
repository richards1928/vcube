const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3045;
const CDP_PORT = 9268;
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
    this.exceptions = [];
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            this.exceptions.push(msg.params.exceptionDetails);
          }
          if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
            this.consoleErrors.push({
              type: msg.params.type,
              text: (msg.params.args || []).map(a => a.value || a.description || '').join(' ')
            });
          }
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
      }, 30000);

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
  console.log('--- Phase 8.5 Visual Verification ---');
  console.log('1. Starting Next.js production server on port', PORT);
  const nextServer = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${PORT}/`, r => {
          if (r.statusCode === 200) res();
          else rej(new Error('Status ' + r.statusCode));
        }).on('error', rej);
      });
      console.log('   Next.js is responsive on port', PORT);
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
    '--window-size=1440,900',
    'about:blank'
  ]);

  await sleep(2000);
  const wsUrl = await getCDPTarget();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Runtime.enable');

  const targets = [
    { route: '/contact', name: 'phase85-contact-desktop-1440', width: 1440, height: 900, isMobile: false },
    { route: '/contact', name: 'phase85-contact-mobile-390', width: 390, height: 844, isMobile: true },
    { route: '/services/construction', name: 'phase85-construction-desktop-1440', width: 1440, height: 900, isMobile: false },
    { route: '/', name: 'phase85-home-desktop-1440', width: 1440, height: 900, isMobile: false },
  ];

  const results = [];

  for (const t of targets) {
    console.log(`\nInspecting ${t.route} (${t.width}x${t.height}, mobile=${t.isMobile})...`);
    cdp.exceptions = [];
    cdp.consoleErrors = [];

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 1,
      mobile: t.isMobile
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}${t.route}` });
    await sleep(2000);

    const doc = await cdp.send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        h1: document.querySelector('h1') ? document.querySelector('h1').innerText.replace(/\\s+/g, ' ').trim() : null,
        hasCoordinates: document.body.innerText.includes('17.4435') || document.body.innerText.includes('78.3772'),
        hasPlaceholderAddress: document.body.innerText.includes('Commercial District') || document.body.innerText.includes('Infrastructure Corridor'),
        hasHQMarker: document.body.innerText.includes('VCUBE HQ'),
        hasServingRegion: document.body.innerText.includes('Serving Hyderabad & Regional Telangana'),
        hasIS456Certified: document.body.innerText.includes('IS 456 Certified'),
        hasExecutionProtocol: document.body.innerText.includes('Engineered RCC Framework'),
        bodyLength: document.body.innerText.length
      })`,
      returnByValue: true
    });

    const info = doc.result.value;
    console.log(`   Title: ${info.title}`);
    console.log(`   H1: ${info.h1}`);
    console.log(`   Has Coordinates (17.4435 / 78.3772): ${info.hasCoordinates}`);
    console.log(`   Has Placeholder Address: ${info.hasPlaceholderAddress}`);
    console.log(`   Has VCUBE HQ marker: ${info.hasHQMarker}`);
    console.log(`   Has 'Serving Hyderabad & Regional Telangana': ${info.hasServingRegion}`);
    console.log(`   Has 'IS 456 Certified': ${info.hasIS456Certified}`);
    console.log(`   Has 'Engineered RCC Framework': ${info.hasExecutionProtocol}`);
    console.log(`   Exceptions: ${cdp.exceptions.length}`);
    console.log(`   Console Errors: ${cdp.consoleErrors.length}`);

    // Screenshot
    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const outPath = path.join(SCREENSHOTS_DIR, `${t.name}.png`);
    fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`   Screenshot saved: ${t.name}.png`);

    const passed = !info.hasCoordinates && !info.hasPlaceholderAddress && !info.hasHQMarker && !info.hasIS456Certified && cdp.exceptions.length === 0;

    results.push({
      target: t,
      info,
      exceptions: cdp.exceptions.length,
      passed
    });
  }

  cdp.close();

  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}

  console.log('\n--- Verification Summary ---');
  const allPassed = results.every(r => r.passed);
  console.log(allPassed ? 'ALL PHASE 8.5 VERIFICATIONS PASSED!' : 'SOME CHECKS FAILED');

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'phase85-verification-results.json'),
    JSON.stringify(results, null, 2)
  );

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
