const fs = require('fs');
const path = require('path');

function searchAllImages(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) searchAllImages(full);
    else if (f.endsWith('.tsx') || f.endsWith('.jsx')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('<Image')) {
        const matches = c.match(/<Image[\s\S]+?\/>/g);
        if (matches) {
          matches.forEach(m => {
            const hasFill = m.includes('fill');
            const hasWidth = m.includes('width=');
            const hasHeight = m.includes('height=');
            const srcMatch = m.match(/src=(?:\{([^}]+)\}|"([^"]+)")/);
            const src = srcMatch ? (srcMatch[1] || srcMatch[2]) : 'unknown';
            console.log(`${full} -> src: ${src.trim()} | fill: ${hasFill} | w/h: ${hasWidth && hasHeight}`);
          });
        }
      }
    }
  }
}

searchAllImages('src');

