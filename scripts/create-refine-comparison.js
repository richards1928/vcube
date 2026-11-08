const sharp = require('sharp');
const path = 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/screenshots/';

async function createRefinementComparison() {
  // 1. Desktop Logo Comparison: Previous Pass 2 vs Final Refined
  // Pass 2 desktop logo: pass2-logo-inspect-top.png (200x70)
  // Final refined desktop logo: refine-final-logo-desktop-zoom.png (220x75)
  const pass2Logo = await sharp(path + 'pass2-logo-inspect-top.png')
    .resize(240, 80, { fit: 'contain', background: { r: 9, g: 11, b: 13, alpha: 1 } })
    .toBuffer();

  const finalLogo = await sharp(path + 'refine-final-logo-desktop-zoom.png')
    .resize(240, 80, { fit: 'contain', background: { r: 9, g: 11, b: 13, alpha: 1 } })
    .toBuffer();

  await sharp({
    create: {
      width: 530,
      height: 125,
      channels: 4,
      background: { r: 12, g: 14, b: 18, alpha: 1 }
    }
  })
  .composite([
    { input: pass2Logo, top: 22, left: 15 },
    { input: finalLogo, top: 22, left: 275 }
  ])
  .png()
  .toFile(path + 'comparison-refine-logo-zoom.png');

  // 2. Desktop Header Comparison (1920x120 stacked)
  const pass2Header = await sharp(path + 'pass2-desktop-top-header.png')
    .resize(1920, 115)
    .toBuffer();

  const finalHeader = await sharp(path + 'refine-final-desktop-top-header.png')
    .resize(1920, 115)
    .toBuffer();

  await sharp({
    create: {
      width: 1920,
      height: 250,
      channels: 4,
      background: { r: 9, g: 11, b: 13, alpha: 1 }
    }
  })
  .composite([
    { input: pass2Header, top: 5, left: 0 },
    { input: finalHeader, top: 128, left: 0 }
  ])
  .png()
  .toFile(path + 'comparison-refine-desktop-header.png');

  // 3. Mobile Header Comparison (780x160 stacked)
  const pass2MobHeader = await sharp(path + 'pass2-mobile-390-header.png')
    .resize(780, 150)
    .toBuffer();

  const finalMobHeader = await sharp(path + 'refine-final-mobile-390-header.png')
    .resize(780, 150)
    .toBuffer();

  await sharp({
    create: {
      width: 780,
      height: 320,
      channels: 4,
      background: { r: 9, g: 11, b: 13, alpha: 1 }
    }
  })
  .composite([
    { input: pass2MobHeader, top: 5, left: 0 },
    { input: finalMobHeader, top: 165, left: 0 }
  ])
  .png()
  .toFile(path + 'comparison-refine-mobile-header.png');

  console.log('Successfully created all refinement comparisons!');
}

createRefinementComparison().catch(console.error);
