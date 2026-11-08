const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3006;
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

async function main() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  // Poll until server ready
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const code = await fetchRoute('/');
      if (code === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      await sleep(1000);
    }
  }

  if (!ready) {
    console.error('Server failed to initialize on port ' + PORT);
    server.kill();
    process.exit(1);
  }

  console.log('Production server online! Starting Lighthouse mobile audit...');
  process.env.CHROME_PATH = CHROME_PATH;

  try {
    // 1. Mobile Audit
    const mobileCmd = `npx lighthouse http://localhost:${PORT}/ --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=./lighthouse-mobile-optimized.json --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --throttling-method=simulate`;
    console.log('Executing mobile audit...');
    execSync(mobileCmd, { stdio: 'inherit' });

    // 2. Desktop Audit
    const desktopCmd = `npx lighthouse http://localhost:${PORT}/ --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=./lighthouse-desktop-optimized.json --only-categories=performance,accessibility,best-practices,seo --preset=desktop`;
    console.log('Executing desktop audit...');
    execSync(desktopCmd, { stdio: 'inherit' });

    console.log('Lighthouse audits finished. Reading results...');
    const mData = JSON.parse(fs.readFileSync('./lighthouse-mobile-optimized.json', 'utf8'));
    const dData = JSON.parse(fs.readFileSync('./lighthouse-desktop-optimized.json', 'utf8'));

    console.log('--- AUDIT RESULTS ---');
    console.log('Mobile Scores:');
    for (const [k, v] of Object.entries(mData.categories)) {
      console.log(`  ${v.title}: ${Math.round(v.score * 100)}`);
    }
    console.log('Desktop Scores:');
    for (const [k, v] of Object.entries(dData.categories)) {
      console.log(`  ${v.title}: ${Math.round(v.score * 100)}`);
    }

    console.log('Key Mobile Audits:');
    ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'speed-index', 'cumulative-layout-shift'].forEach(a => {
      const audit = mData.audits[a];
      if (audit) console.log(`  ${audit.title}: ${audit.displayValue}`);
    });

    console.log('Key Desktop Audits:');
    ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'speed-index', 'cumulative-layout-shift'].forEach(a => {
      const audit = dData.audits[a];
      if (audit) console.log(`  ${audit.title}: ${audit.displayValue}`);
    });
  } catch (err) {
    console.error('Error running audit:', err.message);
  } finally {
    console.log('Shutting down production server...');
    try {
      execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' }).split('\n').forEach(line => {
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

