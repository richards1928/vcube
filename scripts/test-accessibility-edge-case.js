const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3040;
const CDP_PORT = 9265;
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
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${CDP_PORT}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === 'page');
          if (page) resolve(page.webSocketDebuggerUrl);
          else reject(new Error('No page target found'));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('1. Starting local Next.js server on port', PORT);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://localhost:${PORT}`, r => {
          if (r.statusCode === 200) res();
          else rej(new Error('Status ' + r.statusCode));
        }).on('error', rej);
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
    '--window-size=1440,900',
    'about:blank'
  ]);

  await sleep(1500);
  const wsUrl = await getCDPTarget();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Runtime.enable');

  const testCases = [
    { route: '/clients', motion: 'no-preference', slug: 'clients-motion-standard' },
    { route: '/clients', motion: 'reduce', slug: 'clients-motion-reduced' },
    { route: '/contact', motion: 'no-preference', slug: 'contact-motion-standard' },
    { route: '/contact', motion: 'reduce', slug: 'contact-motion-reduced' },
  ];

  const results = [];

  for (const tc of testCases) {
    console.log(`\nTesting ${tc.route} with prefers-reduced-motion: ${tc.motion}...`);

    cdp.exceptions = [];
    cdp.consoleErrors = [];

    // Set media emulation
    await cdp.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: tc.motion }]
    });

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}${tc.route}` });
    await sleep(2500);

    // Evaluate DOM
    const evalData = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const errorScreen = document.body.innerText.includes("This page couldn't load");
        const h1 = document.querySelector('h1')?.innerText.trim() || '';
        const bodyText = document.body.innerText;
        const cardsCount = document.querySelectorAll('.rounded-2xl, .rounded-xl').length;

        // Check if main sections have opacity > 0
        const mainContent = document.querySelector('main');
        const mainOpacity = mainContent ? window.getComputedStyle(mainContent).opacity : '0';

        return {
          errorScreen,
          h1,
          cardsCount,
          mainOpacity,
          hasContent: bodyText.length > 300
        };
      })()`,
      returnByValue: true
    });

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(SCREENSHOTS_DIR, `verify-${tc.slug}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    const testPassed = !evalData.result.value.errorScreen && cdp.exceptions.length === 0 && evalData.result.value.hasContent;

    const resObj = {
      route: tc.route,
      motionSetting: tc.motion,
      passed: testPassed,
      h1: evalData.result.value.h1,
      cardsCount: evalData.result.value.cardsCount,
      hasContent: evalData.result.value.hasContent,
      errorScreenDetected: evalData.result.value.errorScreen,
      exceptionsCount: cdp.exceptions.length,
      exceptions: cdp.exceptions,
      consoleErrorsCount: cdp.consoleErrors.length,
      screenshot: `verify-${tc.slug}.png`
    };

    results.push(resObj);
    console.log(`   Result: ${testPassed ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`   H1: "${resObj.h1}", Exceptions: ${resObj.exceptionsCount}, ErrorScreen: ${resObj.errorScreenDetected}`);
  }

  // Also update final full-page screenshots for clients and contact
  console.log('\nUpdating final inspection screenshots for /clients and /contact...');
  
  // Clients Desktop
  await cdp.send('Emulation.setEmulatedMedia', { media: 'screen', features: [] });
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/clients` });
  await sleep(2200);
  const clientsDesktop = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-clients-desktop-1440.png'), Buffer.from(clientsDesktop.data, 'base64'));
  console.log('   ✓ Updated final-clients-desktop-1440.png');

  // Contact Desktop
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/contact` });
  await sleep(2200);
  const contactDesktop = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-contact-desktop-1440.png'), Buffer.from(contactDesktop.data, 'base64'));
  console.log('   ✓ Updated final-contact-desktop-1440.png');

  // Clients Mobile
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/clients` });
  await sleep(2200);
  const clientsMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-clients-mobile-390.png'), Buffer.from(clientsMobile.data, 'base64'));
  console.log('   ✓ Updated final-clients-mobile-390.png');

  // Contact Mobile
  await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/contact` });
  await sleep(2200);
  const contactMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'final-contact-mobile-390.png'), Buffer.from(contactMobile.data, 'base64'));
  console.log('   ✓ Updated final-contact-mobile-390.png');

  const reportPath = path.join(ARTIFACT_DIR, 'accessibility-edge-case-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}

  console.log('\n========================================');
  console.log('ACCESSIBILITY EDGE CASE TESTING COMPLETED');
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal testing error:', err);
  process.exit(1);
});

