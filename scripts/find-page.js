const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/Richards Dakarapu/.gemini/antigravity/brain/e6cfca55-8dfe-42e8-a39f-baef71c0c841/.system_generated/logs/transcript_full.jsonl') });

rl.on('line', line => {
  if (line.includes('src\\\\app\\\\page.tsx') && line.includes('Replacement')) {
    try {
      const parsed = JSON.parse(line);
      const call = parsed.tool_calls?.find(c => c.name === 'edit_file' && c.args.Path.toLowerCase().includes('page.tsx'));
      if (call) {
        console.log('--- REPLACEMENT FOUND ---');
        console.log(call.args.Replacement);
        console.log('--- END REPLACEMENT ---');
      }
    } catch(e) {}
  }
});

