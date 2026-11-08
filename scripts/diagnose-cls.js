const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const http = require('http');

const PORT = 3007;

function fetchRoute(p) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${p}`, (res) => {
      resolve(res.statusCode);
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function testViewport(browser, name, viewport) {
  console.log(`\n========================================`);
  console.log(`Testing Viewport: ${name} (${viewport.width}x${viewport.height})`);
  console.log(`========================================`);

  const page = await browser.newPage();
  await page.setViewport(viewport);

  // Set up LayoutShift observer in page
  await page.evaluateOnNewDocument(() => {
    window.__layoutShifts = [];
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__layoutShifts.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: (entry.sources || []).map(s => ({
                previousRect: s.previousRect ? {
                  top: s.previousRect.top,
                  bottom: s.previousRect.bottom,
                  left: s.previousRect.left,
                  right: s.previousRect.right,
                  width: s.previousRect.width,
                  height: s.previousRect.height,
                } : null,
                currentRect: s.currentRect ? {
                  top: s.currentRect.top,
                  bottom: s.currentRect.bottom,
                  left: s.currentRect.left,
                  right: s.currentRect.right,
                  width: s.currentRect.width,
                  height: s.currentRect.height,
                } : null,
                nodeInfo: s.node ? {
                  tagName: s.node.tagName,
                  className: s.node.className,
                  id: s.node.id,
                  outerHTML: (s.node.outerHTML || '').slice(0, 150),
                } : null,
              }))
            });
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error(e);
    }
  });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait another 4 seconds to observe any deferred shifts or 3D mounts
  await sleep(4000);

  const shifts = await page.evaluate(() => window.__layoutShifts);
  const totalCls = shifts.reduce((acc, s) => acc + s.value, 0);

  console.log(`Total Shifts: ${shifts.length}, Cumulative CLS: ${totalCls.toFixed(5)}`);
  shifts.forEach((s, idx) => {
    console.log(`\n  Shift #${idx + 1}: score = ${s.value.toFixed(5)} at time = ${s.startTime.toFixed(1)}ms`);
    s.sources.forEach((src, sIdx) => {
      console.log(`    Source #${sIdx + 1}: ${src.nodeInfo?.tagName}.${src.nodeInfo?.className || ''}`);
      console.log(`      Snippet: ${src.nodeInfo?.outerHTML}`);
      if (src.previousRect && src.currentRect) {
        console.log(`      Prev Rect: top=${src.previousRect.top}, h=${src.previousRect.height}, w=${src.previousRect.width}`);
        console.log(`      Curr Rect: top=${src.currentRect.top}, h=${src.currentRect.height}, w=${src.currentRect.width}`);
        console.log(`      Delta Top: ${src.currentRect.top - src.previousRect.top}, Delta Height: ${src.currentRect.height - src.previousRect.height}`);
      }
    });
  });

  await page.close();
}

async function main() {
  console.log(`Starting production Next.js server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      if (await fetchRoute('/') === 200) {
        console.log('Production server ready!');
        break;
      }
    } catch (e) {
      await sleep(1000);
    }
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    await testViewport(browser, 'Desktop', { width: 1344, height: 940, isMobile: false });
    await testViewport(browser, 'Mobile (Moto G4 / Pixel)', { width: 412, height: 823, isMobile: true, hasTouch: true });
  } finally {
    await browser.close();
    try {
      require('child_process').execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' }).split('\n').forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid) && parseInt(pid) > 0) {
          try { process.kill(parseInt(pid)); } catch (e) {}
        }
      });
    } catch (e) {}
    server.kill();
  }
}

main().catch(console.error);

