const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3025;
const CDP_PORT = 9235;
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
    http.get(`http://127.0.0.1:${CDP_PORT}/json`, (res) => {
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
  console.log('1. Starting production server on port', PORT);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  // Wait for server
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${PORT}`, r => res()).on('error', rej);
      });
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

  // 1. Desktop Top
  console.log('Capturing desktop top...');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(3000);
  let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-desktop-top.png'), Buffer.from(shot.data, 'base64'));

  // 2. Desktop Scrolled
  console.log('Capturing desktop scrolled...');
  await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 300);' });
  await sleep(1000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-desktop-scrolled.png'), Buffer.from(shot.data, 'base64'));

  // 3. Mobile 390 Top
  console.log('Capturing mobile 390px top...');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(3000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-mobile-390.png'), Buffer.from(shot.data, 'base64'));

  // 4. Mobile 360 Top
  console.log('Capturing mobile 360px top...');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(3000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-mobile-360.png'), Buffer.from(shot.data, 'base64'));

  // 5. Mobile 430 Top
  console.log('Capturing mobile 430px top...');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(3000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-mobile-430.png'), Buffer.from(shot.data, 'base64'));

  // 6. Mobile Scrolled
  console.log('Capturing mobile scrolled...');
  await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 300);' });
  await sleep(1000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'navbar-pass2-mobile-scrolled.png'), Buffer.from(shot.data, 'base64'));

  // DOM measurements check
  const measurements = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const header = document.querySelector('header');
        const logo = header.querySelector('img');
        const logoRect = logo ? logo.getBoundingClientRect() : null;
        const cta = header.querySelector('button');
        const ctaRect = cta ? cta.getBoundingClientRect() : null;
        return {
          logo: logoRect ? { width: logoRect.width, height: logoRect.height, left: logoRect.left, top: logoRect.top } : null,
          header: { height: header.getBoundingClientRect().height },
          viewportWidth: window.innerWidth
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Mobile measurements:', JSON.stringify(measurements.result.value, null, 2));

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}
  console.log('Capture Pass 2 completed successfully!');
}

main().catch(err => {
  console.error('Error in capture:', err);
  process.exit(1);
});

