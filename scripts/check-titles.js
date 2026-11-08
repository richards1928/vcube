const fs = require('fs');

const files = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/services/construction/page.tsx',
  'src/app/services/interiors/page.tsx',
  'src/app/services/branding/page.tsx',
  'src/app/projects/page.tsx',
  'src/app/clients/page.tsx',
  'src/app/queries/page.tsx',
  'src/app/contact/page.tsx',
];

console.log('Checking page titles:\n');
files.forEach(p => {
  if (fs.existsSync(p)) {
    const txt = fs.readFileSync(p, 'utf8');
    const templateMatch = txt.match(/template:\s*["'`](.+?)["'`]/);
    const defaultMatch = txt.match(/default:\s*["'`](.+?)["'`]/);
    const titleMatch = txt.match(/title:\s*["'`](.+?)["'`]/);

    if (templateMatch || defaultMatch) {
      console.log(`${p}:`);
      if (defaultMatch) console.log(`  default: "${defaultMatch[1]}"`);
      if (templateMatch) console.log(`  template: "${templateMatch[1]}"`);
    } else if (titleMatch) {
      console.log(`${p} -> "${titleMatch[1]}"`);
    } else {
      console.log(`${p} -> (no title match)`);
    }
  }
});

