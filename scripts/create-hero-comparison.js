const sharp = require('sharp');
const path = 'C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/screenshots/';

async function createHeroComparisons() {
  // 1. Desktop Hero Crop (1920 x 850)
  const prevHero = await sharp(path + 'navbar-pass2-desktop-top.png')
    .extract({ left: 0, top: 0, width: 1920, height: 850 })
    .resize(960, 425)
    .toBuffer();

  const newHero = await sharp(path + 'hero-redesign-desktop-1920.png')
    .extract({ left: 0, top: 0, width: 1920, height: 850 })
    .resize(960, 425)
    .toBuffer();

  await sharp({
    create: {
      width: 1960,
      height: 465,
      channels: 4,
      background: { r: 9, g: 11, b: 13, alpha: 1 }
    }
  })
  .composite([
    { input: prevHero, top: 20, left: 15 },
    { input: newHero, top: 20, left: 985 }
  ])
  .png()
  .toFile(path + 'comparison-hero-desktop.png');

  // 2. Mobile 390 Hero Crop (780 x 1200)
  const prevMob = await sharp(path + 'navbar-pass2-mobile-390.png')
    .extract({ left: 0, top: 0, width: 780, height: 1200 })
    .resize(390, 600)
    .toBuffer();

  const newMob = await sharp(path + 'hero-redesign-mobile-390.png')
    .extract({ left: 0, top: 0, width: 780, height: 1200 })
    .resize(390, 600)
    .toBuffer();

  await sharp({
    create: {
      width: 820,
      height: 640,
      channels: 4,
      background: { r: 9, g: 11, b: 13, alpha: 1 }
    }
  })
  .composite([
    { input: prevMob, top: 20, left: 15 },
    { input: newMob, top: 20, left: 415 }
  ])
  .png()
  .toFile(path + 'comparison-hero-mobile.png');

  console.log('Hero comparisons created successfully!');
}

createHeroComparisons().catch(console.error);
