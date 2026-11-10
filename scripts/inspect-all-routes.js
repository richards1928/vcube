const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3038;
const CDP_PORT = 9258;
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
    this.consoleLogs = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            this.consoleLogs.push({
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
          reject(new Error(`CDP command ${method} timed out after 60s`));
        }
      }, 60000);

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
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const routes = [
  { path: '/', slug: 'home', name: 'Homepage' },
  { path: '/about', slug: 'about', name: 'About Us' },
  { path: '/services/construction', slug: 'services-construction', name: 'Civil Construction' },
  { path: '/services/interiors', slug: 'services-interiors', name: 'Architectural Interiors' },
  { path: '/services/branding', slug: 'services-branding', name: 'Environmental Branding' },
  { path: '/projects', slug: 'projects', name: 'Our Projects' },
  { path: '/clients', slug: 'clients', name: 'Clients & Partners' },
  { path: '/queries', slug: 'queries', name: 'Project Queries' },
  { path: '/contact', slug: 'contact', name: 'Contact Us' },
];

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
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  const inspectionResults = [];

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    console.log(`\n[${i + 1}/${routes.length}] Inspecting ${r.name} (${r.path})...`);

    const routeData = {
      index: i + 1,
      name: r.name,
      path: r.path,
      slug: r.slug,
      desktop: {},
      mobile: {},
      domData: {},
      consoleLogs: []
    };

    // --- A. DESKTOP 1440x900 ---
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}${r.path}` });
    await sleep(2500);

    // Ensure all animation and scrolltrigger elements are fully revealed
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.querySelectorAll('*').forEach(el => {
          if (window.getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      `
    });
    await sleep(300);

    // Capture Full Page Screenshot (Desktop)
    const fullDesktopShot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    const desktopFileName = `final-${r.slug}-desktop-1440.png`;
    const desktopFilePath = path.join(SCREENSHOTS_DIR, desktopFileName);
    fs.writeFileSync(desktopFilePath, Buffer.from(fullDesktopShot.data, 'base64'));
    console.log(`   ✓ Desktop Full Page saved: ${desktopFileName}`);

    // Collect DOM inspection metrics on desktop
    try {
      const domEval = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim());
          const h2s = Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim());
          const h3s = Array.from(document.querySelectorAll('h3')).map(el => el.innerText.trim());
          
          const images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.getAttribute('src') || img.src,
            alt: img.alt || '',
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            isBroken: img.naturalWidth === 0
          }));

          const brokenImages = images.filter(i => i.isBroken);

          const logo = document.querySelector('img[alt*="Vcube"]');
          const logoData = logo ? {
            src: logo.getAttribute('src'),
            naturalWidth: logo.naturalWidth,
            naturalHeight: logo.naturalHeight,
            clientWidth: logo.clientWidth,
            clientHeight: logo.clientHeight
          } : null;

          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          const hasHorizontalOverflow = scrollWidth > clientWidth;

          return {
            docTitle: document.title,
            metaDesc: document.querySelector('meta[name="description"]')?.content || '',
            h1Count: h1s.length,
            h1s,
            h2Count: h2s.length,
            h2s: h2s.slice(0, 10),
            h3Count: h3s.length,
            totalImages: images.length,
            brokenImagesCount: brokenImages.length,
            brokenImages,
            logoData,
            scrollWidth,
            clientWidth,
            hasHorizontalOverflow
          };
        })()`,
        returnByValue: true
      });
      routeData.domData = domEval.result.value;
    } catch (e) {
      console.warn(`   Warning evaluating DOM on ${r.path}:`, e.message);
    }

    routeData.desktop = {
      file: desktopFileName,
      path: desktopFilePath
    };

    // --- B. MOBILE 390x844 ---
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}${r.path}` });
    await sleep(2200);

    // Ensure all animation and scrolltrigger elements are fully revealed
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.querySelectorAll('*').forEach(el => {
          if (window.getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      `
    });
    await sleep(300);

    // Capture Full Page Screenshot (Mobile)
    const fullMobileShot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    const mobileFileName = `final-${r.slug}-mobile-390.png`;
    const mobileFilePath = path.join(SCREENSHOTS_DIR, mobileFileName);
    fs.writeFileSync(mobileFilePath, Buffer.from(fullMobileShot.data, 'base64'));
    console.log(`   ✓ Mobile Full Page saved: ${mobileFileName}`);

    // Check mobile horizontal overflow
    try {
      const mobEval = await cdp.send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        })`,
        returnByValue: true
      });
      routeData.mobile = {
        file: mobileFileName,
        path: mobileFilePath,
        overflow: mobEval.result.value
      };
    } catch (e) {
      routeData.mobile = { file: mobileFileName, path: mobileFilePath };
    }

    routeData.consoleLogs = [...cdp.consoleLogs];
    cdp.consoleLogs = [];

    inspectionResults.push(routeData);
  }

  // Write inspection JSON
  const reportJsonPath = path.join(ARTIFACT_DIR, 'final-visual-inspection-data.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(inspectionResults, null, 2));
  console.log(`\n========================================`);
  console.log(`ALL 9 ROUTES INSPECTED SUCCESSFULLY!`);
  console.log(`18 full-page screenshots captured and saved.`);
  console.log(`Data output: ${reportJsonPath}`);
  console.log(`========================================`);

  cdp.close();
  try { execSync(`taskkill /F /PID ${chrome.pid} /T`); } catch {}
  try { execSync(`taskkill /F /PID ${server.pid} /T`); } catch {}
}

main().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});
