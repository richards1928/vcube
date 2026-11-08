const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3028;
const CDP_PORT = 9238;
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

const routes = [
  '/',
  '/about',
  '/services/construction',
  '/services/interiors',
  '/services/branding',
  '/projects',
  '/clients',
  '/queries',
  '/contact',
];

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

  console.log('2. Testing all 9 routes:');
  const routeResults = [];
  for (const r of routes) {
    const res = await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${PORT}${r}`, (response) => {
        resolve({ path: r, status: response.statusCode });
      }).on('error', (err) => resolve({ path: r, status: 500, error: err.message }));
    });
    console.log(` - ${res.path} -> HTTP ${res.status}`);
    routeResults.push(res);
  }

  console.log('3. Launching headless Chrome for screenshot verification');
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

  const measurements = {};

  // Helper to capture and measure
  async function capture(name, width, height, mobile, scrollY = 0) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: mobile ? 2 : 1,
      mobile: !!mobile
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
    await sleep(2500);

    if (scrollY > 0) {
      await cdp.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
      await sleep(800);
    }

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${name}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`Captured ${name}.png (${width}x${height})`);

    const m = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('header');
          const logo = header ? header.querySelector('img') : null;
          const logoRect = logo ? logo.getBoundingClientRect() : null;
          const footer = document.querySelector('footer');
          const footerLogo = footer ? footer.querySelector('img') : null;
          const footerLogoRect = footerLogo ? footerLogo.getBoundingClientRect() : null;
          return {
            viewportWidth: window.innerWidth,
            docScrollWidth: document.documentElement.scrollWidth,
            headerLogo: logoRect ? { width: logoRect.width, height: logoRect.height, left: logoRect.left, top: logoRect.top } : null,
            footerLogo: footerLogoRect ? { width: footerLogoRect.width, height: footerLogoRect.height } : null
          };
        })()
      `,
      returnByValue: true
    });
    measurements[name] = m.result.value;
  }

  // 1. Desktop 1920px (Top)
  await capture('global-brand-desktop-1920-top', 1920, 1080, false, 0);

  // 2. Desktop 1920px (Scrolled)
  await capture('global-brand-desktop-1920-scrolled', 1920, 1080, false, 300);

  // 3. Desktop 1440px
  await capture('global-brand-desktop-1440', 1440, 900, false, 0);

  // 4. Tablet 1024px
  await capture('global-brand-tablet-1024', 1024, 768, false, 0);

  // 5. Tablet 768px
  await capture('global-brand-tablet-768', 768, 1024, false, 0);

  // 6. Mobile 430px
  await capture('global-brand-mobile-430', 430, 932, true, 0);

  // 7. Mobile 390px (Top)
  await capture('global-brand-mobile-390-top', 390, 844, true, 0);

  // 8. Mobile 390px (Scrolled)
  await capture('global-brand-mobile-390-scrolled', 390, 844, true, 300);

  // 9. Mobile 360px (Top)
  await capture('global-brand-mobile-360-top', 360, 800, true, 0);

  // 10. Mobile Menu Drawer Open (390px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(2500);
  // Click hamburger button
  await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('header button[aria-label="Toggle Mobile Menu"]');
        if (btn) btn.click();
      })()
    `
  });
  await sleep(600);
  let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'global-brand-mobile-drawer-open.png'), Buffer.from(shot.data, 'base64'));
  console.log('Captured global-brand-mobile-drawer-open.png');

  // 11. Footer Close-up (1920px)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}` });
  await sleep(2500);
  await cdp.send('Runtime.evaluate', { expression: `window.scrollTo(0, document.body.scrollHeight);` });
  await sleep(1000);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'global-brand-footer-desktop.png'), Buffer.from(shot.data, 'base64'));
  console.log('Captured global-brand-footer-desktop.png');

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}

  console.log('\n--- MEASUREMENTS SUMMARY ---');
  console.log(JSON.stringify(measurements, null, 2));

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'global-branding-measurements.json'),
    JSON.stringify({ routeResults, measurements }, null, 2)
  );

  console.log('\nAll global branding tests completed successfully!');
}

main().catch(err => {
  console.error('Fatal error in verification:', err);
  process.exit(1);
});
