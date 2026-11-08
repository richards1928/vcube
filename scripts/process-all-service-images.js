const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processAll() {
  const images = [
    {
      src: 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/vcube_infra_architectural_detail_1794155320463.jpg',
      name: 'vision-detail'
    },
    {
      src: 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/vcube_infra_construction_execution_1794155343193.jpg',
      name: 'service-construction'
    },
    {
      src: 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/vcube_infra_architectural_interior_1794155365161.jpg',
      name: 'service-interiors'
    },
    {
      src: 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/vcube_infra_branding_signage_1794155389328.jpg',
      name: 'service-branding'
    }
  ];

  const targetDir = path.join(__dirname, '..', 'public', 'images');

  for (const item of images) {
    if (!fs.existsSync(item.src)) {
      console.error('File not found:', item.src);
      continue;
    }

    console.log(`Processing ${item.name}...`);
    // WebP
    const outWebp = path.join(targetDir, `${item.name}.webp`);
    await sharp(item.src)
      .webp({ quality: 85, effort: 6 })
      .toFile(outWebp);
    console.log(`Saved ${outWebp} (${(fs.statSync(outWebp).size / 1024).toFixed(1)} KB)`);

    // AVIF
    const outAvif = path.join(targetDir, `${item.name}.avif`);
    await sharp(item.src)
      .avif({ quality: 80, effort: 6 })
      .toFile(outAvif);
    console.log(`Saved ${outAvif} (${(fs.statSync(outAvif).size / 1024).toFixed(1)} KB)`);

    // JPG fallback
    const outJpg = path.join(targetDir, `${item.name}.jpg`);
    await sharp(item.src)
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(outJpg);
    console.log(`Saved ${outJpg} (${(fs.statSync(outJpg).size / 1024).toFixed(1)} KB)`);
  }

  console.log('All images processed successfully.');
}

processAll().catch(console.error);

