const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage() {
  const sourcePath = 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/vcube_infra_hero_architecture_1794154578348.jpg';
  const targetDir = path.join(__dirname, '..', 'public', 'images');

  if (!fs.existsSync(sourcePath)) {
    console.error('Source file does not exist:', sourcePath);
    process.exit(1);
  }

  const baseImage = sharp(sourcePath);
  const metadata = await baseImage.metadata();
  console.log('Source Metadata:', metadata.width, 'x', metadata.height);

  // 1. Save original JPG to public/images
  const outJpg = path.join(targetDir, 'hero-indian-morning.jpg');
  await sharp(sourcePath)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outJpg);
  console.log('Generated JPG:', outJpg, fs.statSync(outJpg).size, 'bytes');

  // 2. Generate high-quality WebP
  const outWebp = path.join(targetDir, 'hero-indian-morning.webp');
  await sharp(sourcePath)
    .webp({ quality: 85, effort: 6 })
    .toFile(outWebp);
  console.log('Generated WebP:', outWebp, fs.statSync(outWebp).size, 'bytes');

  // 3. Generate AVIF
  const outAvif = path.join(targetDir, 'hero-indian-morning.avif');
  await sharp(sourcePath)
    .avif({ quality: 80, effort: 6 })
    .toFile(outAvif);
  console.log('Generated AVIF:', outAvif, fs.statSync(outAvif).size, 'bytes');

  console.log('Hero image processing complete.');
}

processImage().catch(console.error);

