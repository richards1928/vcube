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
      }, 20000);

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
  await cdp.send('Runtime.enable');

  // --- Viewport fold captures ---
  const viewports = [
    { name: 'design-preview-desktop-1440', width: 1440, height: 900, isMobile: false },
    { name: 'design-preview-tablet-768', width: 768, height: 1024, isMobile: false },
    { name: 'design-preview-mobile-390', width: 390, height: 844, isMobile: true },
  ];

  for (const vp of viewports) {
    console.log(`Capturing fold at ${vp.width}x${vp.height}...`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
    await sleep(2000);

    const foldShot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale: 1 }
    });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${vp.name}-fold.png`), Buffer.from(foldShot.data, 'base64'));
    console.log(`Saved: ${vp.name}-fold.png`);
  }

  // --- Capture Desktop Sections at 1440px ---
  console.log('\nCapturing discrete sections at 1440px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const sections = [
    { id: 'hero', selector: 'header + main > section:first-child', name: '01-hero' },
    { id: 'about', selector: '#about', name: '02-studio-philosophy' },
    { id: 'expertise-civil', selector: '#expertise', name: '03-expertise-civil' },
    { id: 'selected-work', selector: '#selected-work', name: '04-selected-works' },
    { id: 'approach', selector: '#approach', name: '05-delivery-methodology' },
    { id: 'contact', selector: '#contact', name: '06-enquiry-consultation' },
    { id: 'footer', selector: 'footer', name: '07-footer' },
  ];

  for (const sec of sections) {
    console.log(`Capturing section: ${sec.name}...`);
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${sec.selector}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`
    });

    await sleep(800);

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png'
    });
    const fileName = `design-preview-sec-${sec.name}.png`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, fileName), Buffer.from(shot.data, 'base64'));
    console.log(`   Saved ${fileName} (${(shot.data.length / 1024).toFixed(1)} KB)`);
  }

  // --- Capture Mobile Sections at 390px ---
  console.log('\nCapturing key mobile views at 390px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  const mobileTargets = [
    { selector: 'header + main > section:first-child', name: 'mobile-01-hero' },
    { selector: '#about', name: 'mobile-02-philosophy' },
    { selector: '#expertise', name: 'mobile-03-expertise' },
    { selector: '#selected-work', name: 'mobile-04-portfolio' },
    { selector: '#approach', name: 'mobile-05-methodology' },
    { selector: '#contact', name: 'mobile-06-contact' },
  ];

  for (const mt of mobileTargets) {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${mt.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await sleep(800);
    const mShot = await cdp.send('Page.captureScreenshot', {
      format: 'png'
    });
    const mFileName = `design-preview-${mt.name}.png`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, mFileName), Buffer.from(mShot.data, 'base64'));
    console.log(`   Saved ${mFileName} (${(mShot.data.length / 1024).toFixed(1)} KB)`);
  }

  cdp.close();
  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  console.log('\nAll section and viewport captures completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
