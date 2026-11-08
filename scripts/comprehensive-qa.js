const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3008;
const CDP_PORT = 9222;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Richards Dakarapu\\.gemini\\antigravity\\brain\\e6cfca55-8dfe-42e8-a39f-baef71c0c841';
const SCREENSHOTS_DIR = path.join(ARTIFACT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Simple CDP client over native WebSocket
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
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
        } else if (msg.method) {
          const listeners = this.eventListeners.get(msg.method) || [];
          listeners.forEach(fn => fn(msg.params));
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

  on(event, fn) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(fn);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function getNewTabWs(url) {
  const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const tab = await res.json();
  return tab.webSocketDebuggerUrl;
}

async function closeTab(targetId) {
  try {
    await fetch(`http://127.0.0.1:${CDP_PORT}/json/close/${targetId}`);
  } catch(e) {}
}

async function run() {
  console.log(`Starting production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  // Wait for server
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/`);
      if (res.status === 200) { ready = true; break; }
    } catch(e) {}
    await sleep(800);
  }
  if (!ready) {
    console.error('Server failed to start');
    server.kill();
    process.exit(1);
  }
  console.log('Server online! Launching Headless Chrome with CDP on port ' + CDP_PORT);

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=C:\\Users\\RICHAR~1\\AppData\\Local\\Temp\\chrome-qa-run',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars'
  ]);
  await sleep(2000);

  const qaReport = {
    timestamp: new Date().toISOString(),
    routesChecked: {},
    responsiveAudits: {},
    functionalChecks: {},
    clsElements: [],
    consoleMessages: [],
    accessibilityFindings: {},
  };

  const routes = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/services/construction', name: 'construction' },
    { path: '/services/interiors', name: 'interiors' },
    { path: '/services/branding', name: 'branding' },
    { path: '/projects', name: 'projects' },
    { path: '/clients', name: 'clients' },
    { path: '/queries', name: 'queries' },
    { path: '/contact', name: 'contact' },
  ];

  const viewports = [
    { name: 'desktop_1920', width: 1920, height: 1080, mobile: false, dpr: 1 },
    { name: 'laptop_1440', width: 1440, height: 900, mobile: false, dpr: 1 },
    { name: 'tablet_1024', width: 1024, height: 768, mobile: false, dpr: 2 },
    { name: 'tablet_768', width: 768, height: 1024, mobile: true, dpr: 2 },
    { name: 'mobile_390', width: 390, height: 844, mobile: true, dpr: 3 },
    { name: 'mobile_360', width: 360, height: 780, mobile: true, dpr: 2 },
  ];

  const wsUrl = await getNewTabWs('about:blank');
  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');

  client.on('Log.entryAdded', (entry) => {
    qaReport.consoleMessages.push(entry);
  });
  client.on('Runtime.consoleAPICalled', (entry) => {
    qaReport.consoleMessages.push(entry);
  });

  // 1. PAGE BY PAGE & VIEWPORT AUDITS
  console.log('Auditing 9 routes across desktop viewports...');
  for (const r of routes) {
    const url = `http://localhost:${PORT}${r.path}`;
    console.log(`Auditing: ${r.path}`);

    // Set 1920 desktop viewport
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    await client.send('Page.navigate', { url });
    await sleep(1500);

    // Evaluate route health
    const evalRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.innerText || 'MISSING';
        const h2Count = document.querySelectorAll('h2').length;
        const totalImages = document.images.length;
        const brokenImages = Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const whatsappLinks = Array.from(document.querySelectorAll('a[href*="wa.me"], button')).filter(el => (el.innerText || '').toLowerCase().includes('whatsapp')).length;
        return { title, h1, h2Count, totalImages, brokenImages, hasHorizontalScroll, scrollWidth, innerWidth, whatsappLinks };
      })()`,
      returnByValue: true
    });

    const routeData = evalRes.result.value;
    qaReport.routesChecked[r.path] = routeData;

    // Take desktop screenshot
    const shot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${r.name}-desktop-1920.png`), Buffer.from(shot.data, 'base64'));
  }

  // 2. RESPONSIVE AUDIT ACROSS VIEWPORTS FOR HOMEPAGE
  console.log('Testing responsive viewports on Homepage...');
  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.mobile
    });
    await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });
    await sleep(1200);

    const vpCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasOverflow = scrollWidth > innerWidth;
        const overflowElements = [];
        if (hasOverflow) {
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > innerWidth) {
              overflowElements.push({ tag: el.tagName, class: el.className?.slice ? el.className.slice(0, 50) : '', right: rect.right });
            }
          });
        }
        return { width: innerWidth, scrollWidth, hasOverflow, overflowCount: overflowElements.length, overflowElements: overflowElements.slice(0, 5) };
      })()`,
      returnByValue: true
    });

    qaReport.responsiveAudits[vp.name] = vpCheck.result.value;

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `homepage-${vp.name}.png`), Buffer.from(shot.data, 'base64'));
  }

  // 3. HOMEPAGE SPECIFIC: 3D EXPLORER & SKELETON TRANSITION
  console.log('Testing 3D Explorer lazy-loading & interaction...');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });
  await sleep(1000);

  // Scroll down to the 3D explorer to trigger IntersectionObserver
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1800, behavior: 'instant' });`
  });
  await sleep(2500); // Allow dynamic chunk to load and mount WebGL

  const threeCheck = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const hasCanvas = Boolean(canvas);
      let webglWorks = false;
      if (canvas) {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        webglWorks = Boolean(gl);
      }
      const stageButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('01') || b.innerText.includes('06')).length;
      const explodeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Explode'));
      const cinematicBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('CINEMATIC') || b.innerText.includes('MANUAL'));
      return {
        hasCanvas,
        webglWorks,
        stageButtons,
        hasExplodeBtn: Boolean(explodeBtn),
        hasCinematicBtn: Boolean(cinematicBtn),
        cinematicState: cinematicBtn?.innerText || ''
      };
    })()`,
    returnByValue: true
  });
  qaReport.functionalChecks['3d_explorer'] = threeCheck.result.value;

  const explorerShot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'homepage-3d-explorer-active.png'), Buffer.from(explorerShot.data, 'base64'));

  // Click on "Explode Slabs"
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const explodeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Explode'));
      if (explodeBtn) explodeBtn.click();
    })()`
  });
  await sleep(800);
  const explodedShot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'homepage-3d-exploded-slabs.png'), Buffer.from(explodedShot.data, 'base64'));

  // 4. PROJECT FILTERS INTERACTION TEST
  console.log('Testing Project Filters on /projects...');
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/projects` });
  await sleep(1200);

  const filterTest = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button')).filter(b => ['All Projects', 'Construction', 'Interiors', 'Branding'].includes(b.innerText.trim()));
      const initialCards = document.querySelectorAll('#projects .group, .grid .group').length;
      
      // Click 'Construction'
      const constBtn = buttons.find(b => b.innerText.trim() === 'Construction');
      if (constBtn) constBtn.click();
      return { filterButtonsCount: buttons.length, initialCards };
    })()`,
    returnByValue: true
  });
  await sleep(500);

  const constructionCards = await client.send('Runtime.evaluate', {
    expression: `document.querySelectorAll('#projects .group, .grid .group').length`,
    returnByValue: true
  });
  qaReport.functionalChecks['project_filters'] = {
    ...filterTest.result.value,
    constructionFilteredCount: constructionCards.result.value
  };

  const projectFilterShot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'projects-filter-active.png'), Buffer.from(projectFilterShot.data, 'base64'));

  // 5. MOBILE MENU INTERACTION TEST
  console.log('Testing mobile navigation drawer...');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });
  await sleep(1000);

  const mobileMenuTest = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('button[aria-label="Toggle Mobile Menu"]');
      if (toggle) toggle.click();
      return { hasToggle: Boolean(toggle) };
    })()`,
    returnByValue: true
  });
  await sleep(600);
  const mobileMenuDrawerOpen = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('header a')).map(a => a.innerText.trim()).filter(Boolean);
      return { open: links.length > 5, links };
    })()`,
    returnByValue: true
  });
  qaReport.functionalChecks['mobile_menu'] = {
    ...mobileMenuTest.result.value,
    ...mobileMenuDrawerOpen.result.value
  };

  const mobileMenuShot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'mobile-menu-drawer.png'), Buffer.from(mobileMenuShot.data, 'base64'));

  // 6. DESKTOP CLS & ACCESSIBILITY AUDIT
  console.log('Investigating CLS and Accessibility...');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });
  await sleep(2000);

  const a11yAndCls = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt]), img[alt=""]')).length;
      const buttonsWithoutLabel = Array.from(document.querySelectorAll('button:not([aria-label])')).filter(b => !b.innerText.trim()).length;
      const inputsWithoutLabel = Array.from(document.querySelectorAll('input:not([aria-label]):not([id]), textarea:not([aria-label]):not([id])')).length;
      
      // Check images with layout dimensions defined
      const unconstrainedImages = Array.from(document.querySelectorAll('img')).filter(img => !img.hasAttribute('width') && !img.style.width && !img.parentElement.style.position).length;

      return { imagesWithoutAlt, buttonsWithoutLabel, inputsWithoutLabel, unconstrainedImages };
    })()`,
    returnByValue: true
  });
  qaReport.accessibilityFindings = a11yAndCls.result.value;

  // Cleanup
  console.log('QA run completed. Writing report data...');
  fs.writeFileSync('./qa-audit-results.json', JSON.stringify(qaReport, null, 2));

  client.close();
  chrome.kill();
  server.kill();

  try {
    execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' }).split('\n').forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid) && parseInt(pid) > 0) {
        try { process.kill(parseInt(pid)); } catch (e) {}
      }
    });
  } catch(e) {}

  console.log('All QA steps completed successfully.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

