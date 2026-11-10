const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3052;
const CDP_PORT = 9275;
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
      }, 15000);

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

  // --- 1. Desktop 1440px ---
  console.log('3. Capturing desktop header at 1440px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  // A. Header Bar Closeup (top 150px)
  const headerShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 130, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'header-preview-desktop-1440.png'), Buffer.from(headerShot.data, 'base64'));
  console.log('   Saved: header-preview-desktop-1440.png');

  // B. Full Above-the-fold at 1440x900
  const foldShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'header-preview-desktop-fold.png'), Buffer.from(foldShot.data, 'base64'));
  console.log('   Saved: header-preview-desktop-fold.png');

  // C. Services Dropdown Open
  console.log('4. Opening Services dropdown on desktop...');
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-haspopup="true"]');
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  const dropdownShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 350, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'header-preview-desktop-dropdown.png'), Buffer.from(dropdownShot.data, 'base64'));
  console.log('   Saved: header-preview-desktop-dropdown.png');

  // --- 2. Mobile 390px ---
  console.log('5. Capturing mobile header at 390px...');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/design-preview` });
  await sleep(2000);

  // A. Mobile Closed Header
  const mobileClosedShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: 400, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'header-preview-mobile-closed.png'), Buffer.from(mobileClosedShot.data, 'base64'));
  console.log('   Saved: header-preview-mobile-closed.png');

  // B. Open Mobile Drawer
  console.log('6. Opening mobile drawer...');
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const menuBtn = document.querySelector('button[aria-label="Toggle Mobile Menu"]');
      if (menuBtn) menuBtn.click();
    })()`
  });
  await sleep(600);

  const mobileDrawerShot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: 750, scale: 1 }
  });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'header-preview-mobile-drawer.png'), Buffer.from(mobileDrawerShot.data, 'base64'));
  console.log('   Saved: header-preview-mobile-drawer.png');

  cdp.close();
  try { execSync(`taskkill /pid ${chrome.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  try { execSync(`taskkill /pid ${nextServer.pid} /f /t`, { stdio: 'ignore' }); } catch(e) {}
  console.log('\nAll header screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

