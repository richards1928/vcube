const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3048;
const CDP_PORT = 9272;
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
      }, 45000);

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
  console.log('--- Capturing /design-preview Screenshots ---');
  console.log('1. Starting Next.js server on port', PORT);
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
      console.log('   Next.js server is ready');
      break;
    } catch {
      await sleep(1000);
    }
  }

  console.log('2. Launching headless Chrome');
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

  const viewports = [
    { name: 'design-preview-desktop-1440', width: 1440, height: 900, dpr: 1, isMobile: false },
    { name: 'design-preview-tablet-768', width: 768, height: 1024, dpr: 1, isMobile: false },
    { name: 'design-preview-mobile-390', width: 390, height: 844, dpr: 1, isMobile: true },
  ];

  for (const vp of viewports) {
    console.log(`\nNavigating at ${vp.width}x${vp.height} (mobile=${vp.isMobile})...`);

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.isMobile
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
    await sleep(2500);

    // 1. Capture above-the-fold screenshot first
    const foldShot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: vp.width,
        height: vp.height,
        scale: 1
      }
    });
    const foldOutPath = path.join(SCREENSHOTS_DIR, `${vp.name}-fold.png`);
    fs.writeFileSync(foldOutPath, Buffer.from(foldShot.data, 'base64'));
    console.log(`Saved above-the-fold: ${vp.name}-fold.png`);

    // 2. Measure full document height
    const layoutMetrics = await cdp.send('Page.getLayoutMetrics');
    const fullHeight = Math.ceil(layoutMetrics.contentSize.height);
    console.log(`   Document full height for ${vp.name}: ${fullHeight}px`);

    // 3. Resize device metrics to full height so the compositor paints all sections
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: fullHeight,
      deviceScaleFactor: vp.dpr,
      mobile: vp.isMobile
    });
    await sleep(1500);

    // 4. Capture full page screenshot
    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });

    const outPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved full page: ${vp.name}.png (${(shot.data.length / 1024).toFixed(1)} KB)`);

    // Reset viewport back
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.isMobile
    });
  }

  // Also capture clean sectional screenshots at 1440 desktop for close inspection
  console.log('\nCapturing individual section closeups at 1440px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const sectionIds = ['about', 'expertise', 'selected-work', 'approach', 'contact'];
  for (const sId of sectionIds) {
    const box = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('${sId}');
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        const rect = el.getBoundingClientRect();
        return {
          x: Math.max(0, rect.left),
          y: Math.max(0, rect.top + window.scrollY),
          width: 1440,
          height: rect.height
        };
      })()`,
      returnByValue: true
    });

    if (box.result.value) {
      const b = box.result.value;
      await sleep(1000);
      const sShot = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: b.y,
          width: 1440,
          height: b.height,
          scale: 1
        },
        captureBeyondViewport: true
      });
      const sPath = path.join(SCREENSHOTS_DIR, `design-preview-section-${sId}.png`);
      fs.writeFileSync(sPath, Buffer.from(sShot.data, 'base64'));
      console.log(`Saved section screenshot: design-preview-section-${sId}.png (${(sShot.data.length / 1024).toFixed(1)} KB)`);
    }
  }

  cdp.close();

  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}

  console.log('\nAll screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

