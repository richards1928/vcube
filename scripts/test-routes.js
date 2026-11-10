const http = require('http');
const { spawn } = require('child_process');

const PORT = 3005;
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
  '/design-preview',
  '/robots.txt',
  '/sitemap.xml',
];

function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, length: data.length, sample: data.slice(0, 100) }));
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting production server on port', PORT);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit'
  });

  // Wait for server to come up
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      await fetchRoute('/');
      ready = true;
      break;
    } catch (e) {
      await sleep(1000);
    }
  }

  if (!ready) {
    console.error('Server failed to start within 30 seconds');
    server.kill();
    process.exit(1);
  }

  console.log('Server is ready! Testing routes:');
  const results = [];
  for (const route of routes) {
    try {
      const res = await fetchRoute(route);
      console.log(`[PASS] ${res.path} -> Status: ${res.status}, Length: ${res.length} bytes`);
      results.push({ ...res, success: res.status === 200 });
    } catch (err) {
      console.error(`[FAIL] ${route} -> ${err.message}`);
      results.push({ path: route, success: false, error: err.message });
    }
  }

  if (server.pid) {
    try {
      require('child_process').execSync(`taskkill /pid ${server.pid} /f /t`);
    } catch(e) {}
  }
  console.log('\nAll route tests completed.');
  const allPassed = results.every(r => r.success);
  console.log(allPassed ? 'ALL ROUTES RETURNED HTTP 200' : 'SOME ROUTES FAILED');
  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

