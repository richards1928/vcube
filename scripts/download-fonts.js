const https = require('https');
const fs = require('fs');
const path = require('path');

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function main() {
  const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  // 1. Fetch font css definitions with woff2 links
  const cinzelCss = await fetchText('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
  const interCss = await fetchText('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  const outfitCss = await fetchText('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

  function getLatinFontFace(css, familyName) {
    // Split into font-face blocks
    const blocks = css.split('@font-face');
    const results = [];
    for (const b of blocks) {
      if (!b.includes('src: url(')) continue;
      // Check if latin block (usually preceded or commented with latin)
      const isLatin = b.includes('/* latin */') || (!b.includes('/* cyrillic') && !b.includes('/* vietnamese') && !b.includes('/* greek'));
      const weightMatch = b.match(/font-weight:\s*(\d+)/);
      const urlMatch = b.match(/src:\s*url\((https:\/\/[^)]+)\)/);
      if (weightMatch && urlMatch) {
        results.push({
          weight: weightMatch[1],
          url: urlMatch[1],
          isLatin
        });
      }
    }
    return results;
  }

  console.log('Parsing font faces...');
  const cinzelFaces = getLatinFontFace(cinzelCss, 'Cinzel');
  const interFaces = getLatinFontFace(interCss, 'Inter');
  const outfitFaces = getLatinFontFace(outfitCss, 'Outfit');

  console.log('Cinzel faces:', cinzelFaces.length);
  console.log('Inter faces:', interFaces.length);
  console.log('Outfit faces:', outfitFaces.length);

  // Download unique weights for latin
  async function downloadFaces(faces, prefix) {
    // filter to latin or unique weights
    const weightsSeen = new Set();
    // Prefer blocks that have latin comment or last occurrences
    const reversed = [...faces].reverse();
    for (const face of reversed) {
      if (!weightsSeen.has(face.weight)) {
        weightsSeen.add(face.weight);
        const filename = `${prefix}-${face.weight}.woff2`;
        const dest = path.join(fontsDir, filename);
        console.log(`Downloading ${prefix} weight ${face.weight} from ${face.url} -> ${filename}`);
        await downloadBinary(face.url, dest);
      }
    }
  }

  await downloadFaces(cinzelFaces, 'Cinzel');
  await downloadFaces(interFaces, 'Inter');
  await downloadFaces(outfitFaces, 'Outfit');

  console.log('Downloaded all fonts successfully to public/fonts/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

