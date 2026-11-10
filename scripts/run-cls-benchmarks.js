const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

const PORT = 3008;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function fetchRoute(p) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${p}`, (res) => {
      resolve(res.statusCode);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function killPort(port) {
  try {
    const lines = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' }).split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid) && parseInt(pid) > 0) {
        try { execSync(`taskkill /pid ${pid} /f /t`); } catch (e) {}
      }
    });
  } catch (e) {}
}

async function main() {
  console.log(`Cleaning port ${PORT}...`);
  killPort(PORT);

  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      if (await fetchRoute('/') === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      await sleep(1000);
    }
  }

  if (!ready) {
    console.error(`Server failed to start on port ${PORT}`);
    server.kill();
    process.exit(1);
  }

  console.log('Production server online! Setting CHROME_PATH...');
  process.env.CHROME_PATH = CHROME_PATH;

  const mobileRuns = [];
  const desktopRuns = [];

  try {
    // 3 Mobile Runs
    for (let i = 1; i <= 3; i++) {
      console.log(`\n========================================`);
      console.log(`Running Mobile Lighthouse Audit #${i}...`);
      console.log(`========================================`);
      const outPath = `./cls-mobile-run-${i}.json`;
      const cmd = `npx lighthouse http://localhost:${PORT}/ --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=${outPath} --only-categories=performance --form-factor=mobile --throttling-method=simulate`;
      execSync(cmd, { stdio: 'inherit' });

      const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      const clsAudit = data.audits['cumulative-layout-shift'];
      const perfScore = Math.round(data.categories.performance.score * 100);
      const fcp = data.audits['first-contentful-paint']?.displayValue;
      const lcp = data.audits['largest-contentful-paint']?.displayValue;
      const tbt = data.audits['total-blocking-time']?.displayValue;
      const si = data.audits['speed-index']?.displayValue;
      const shifts = data.audits['layout-shifts']?.details?.items || [];

      mobileRuns.push({
        run: i,
        cls: clsAudit.numericValue,
        clsDisplay: clsAudit.displayValue,
        perfScore,
        fcp,
        lcp,
        tbt,
        si,
        shiftsCount: shifts.length,
        shiftItems: shifts.map(s => ({
          score: s.score,
          nodeLabel: s.node?.nodeLabel || s.node?.selector,
        }))
      });
      console.log(`Mobile Run #${i} -> CLS: ${clsAudit.displayValue} (${clsAudit.numericValue}), Perf: ${perfScore}`);
    }

    // 3 Desktop Runs
    for (let i = 1; i <= 3; i++) {
      console.log(`\n========================================`);
      console.log(`Running Desktop Lighthouse Audit #${i}...`);
      console.log(`========================================`);
      const outPath = `./cls-desktop-run-${i}.json`;
      const cmd = `npx lighthouse http://localhost:${PORT}/ --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=${outPath} --only-categories=performance --preset=desktop`;
      execSync(cmd, { stdio: 'inherit' });

      const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      const clsAudit = data.audits['cumulative-layout-shift'];
      const perfScore = Math.round(data.categories.performance.score * 100);
      const fcp = data.audits['first-contentful-paint']?.displayValue;
      const lcp = data.audits['largest-contentful-paint']?.displayValue;
      const tbt = data.audits['total-blocking-time']?.displayValue;
      const si = data.audits['speed-index']?.displayValue;
      const shifts = data.audits['layout-shifts']?.details?.items || [];

      desktopRuns.push({
        run: i,
        cls: clsAudit.numericValue,
        clsDisplay: clsAudit.displayValue,
        perfScore,
        fcp,
        lcp,
        tbt,
        si,
        shiftsCount: shifts.length,
        shiftItems: shifts.map(s => ({
          score: s.score,
          nodeLabel: s.node?.nodeLabel || s.node?.selector,
        }))
      });
      console.log(`Desktop Run #${i} -> CLS: ${clsAudit.displayValue} (${clsAudit.numericValue}), Perf: ${perfScore}`);
    }

    console.log(`\n========================================`);
    console.log(`BENCHMARK SUMMARY RESULTS`);
    console.log(`========================================`);

    const mobileClsSorted = mobileRuns.map(r => r.cls).sort((a, b) => a - b);
    const desktopClsSorted = desktopRuns.map(r => r.cls).sort((a, b) => a - b);
    const medianMobileCls = mobileClsSorted[1];
    const medianDesktopCls = desktopClsSorted[1];

    console.log('\n--- MOBILE RUNS ---');
    console.table(mobileRuns);
    console.log(`Median Mobile CLS: ${medianMobileCls.toFixed(5)}`);

    console.log('\n--- DESKTOP RUNS ---');
    console.table(desktopRuns);
    console.log(`Median Desktop CLS: ${medianDesktopCls.toFixed(5)}`);

    // Write final summary json
    fs.writeFileSync('cls-benchmark-summary.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      mobileRuns,
      desktopRuns,
      medianMobileCls,
      medianDesktopCls
    }, null, 2));

  } catch (err) {
    console.error('Error during benchmarks:', err.message);
  } finally {
    console.log('\nShutting down server...');
    killPort(PORT);
    server.kill();
  }
}

main().catch(console.error);

