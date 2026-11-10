const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3055;
const CDP_PORT = 9278;
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
      }, 25000);

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
  console.log('1. Starting Next.js on port', PORT);
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
  await cdp.send('Runtime.enable');

  // --- Viewports list ---
  const viewports = [
    { name: 'final-polish-desktop-1440', width: 1440, height: 900, isMobile: false },
    { name: 'final-polish-tablet-768', width: 768, height: 1024, isMobile: false },
    { name: 'final-polish-mobile-390', width: 390, height: 844, isMobile: true },
  ];

  for (const vp of viewports) {
    console.log(`\nNavigating at ${vp.width}x${vp.height} (mobile=${vp.isMobile})...`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
    await sleep(2500);

    // Above the fold
    const foldShot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale: 1 }
    });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${vp.name}-fold.png`), Buffer.from(foldShot.data, 'base64'));
    console.log(`Saved fold: ${vp.name}-fold.png`);
  }

  // --- Capture Dedicated Hero at 1440px and 390px ---
  console.log('\nCapturing Dedicated Hero Screenshots...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const heroDesktopShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 850, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-polish-hero-desktop.png'), Buffer.from(heroDesktopShot.data, 'base64'));
  console.log('Saved: final-polish-hero-desktop.png');

  // Mobile Hero
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const heroMobileShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: 750, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-polish-hero-mobile.png'), Buffer.from(heroMobileShot.data, 'base64'));
  console.log('Saved: final-polish-hero-mobile.png');

  // --- Discrete Sectional Captures at 1440px ---
  console.log('\nCapturing Discrete Sections at 1440px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const sections = [
    { selector: 'header + main > section:first-child', name: '01-hero' },
    { selector: '#about', name: '02-intro-philosophy' },
    { selector: '#expertise', name: '03-core-expertise' },
    { selector: '#selected-work', name: '04-selected-works' },
    { selector: '#approach', name: '05-delivery-approach' },
    { selector: '#contact', name: '06-contact-consultation' },
  ];

  for (const sec of sections) {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${sec.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await sleep(800);

    const sShot = await cdp.send('Page.captureScreenshot', {
      format: 'png'
    });
    const sName = `final-polish-sec-${sec.name}.png`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, sName), Buffer.from(sShot.data, 'base64'));
    console.log(`Saved section: ${sName} (${(sShot.data.length / 1024).toFixed(1)} KB)`);
  }

  cdp.close();
  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  console.log('\nAll final polish screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

