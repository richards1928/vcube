const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3031;
const CDP_PORT = 9241;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Richards Dakarapu\\.gemini\\antigravity\\brain\\e6cfca55-8dfe-42e8-a39f-baef71c0c841';
const SCREENSHOTS_DIR = path.join(ARTIFACT_DIR, 'screenshots');

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
  console.log('1. Starting Next.js production server on port', PORT);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

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

  async function snap(name, urlPath, w, h, mob, scrollToSelector) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: mob ? 2 : 1,
      mobile: !!mob
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}${urlPath}` });
    await sleep(2000);

    if (scrollToSelector) {
      await cdp.send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('${scrollToSelector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        `
      });
      await sleep(1000);
    }

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${name}.png`);
  }

  // 1. Homepage Editorial Vision Section
  await snap('homepage-vision-desktop-1920', '/', 1920, 1080, false, '#vision');
  await snap('homepage-vision-laptop-1440', '/', 1440, 900, false, '#vision');
  await snap('homepage-vision-mobile-390', '/', 390, 844, true, '#vision');

  // 2. Construction Service Page Showcase
  await snap('service-construction-desktop-1440', '/services/construction', 1440, 900, false);
  await snap('service-construction-mobile-390', '/services/construction', 390, 844, true);

  // 3. Interiors Service Page Showcase
  await snap('service-interiors-desktop-1440', '/services/interiors', 1440, 900, false);
  await snap('service-interiors-mobile-390', '/services/interiors', 390, 844, true);

  // 4. Branding Service Page Showcase
  await snap('service-branding-desktop-1440', '/services/branding', 1440, 900, false);
  await snap('service-branding-mobile-390', '/services/branding', 390, 844, true);

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}

  console.log('All transformed section captures completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

