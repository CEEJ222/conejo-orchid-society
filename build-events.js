const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '_data', 'events');
const outFile = path.join(__dirname, '_data', 'events.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const obj = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      obj[key] = val;
    }
  });
  return obj;
}

let files;
try {
  files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));
} catch {
  files = [];
}

const events = files
  .map(f => {
    try {
      const content = fs.readFileSync(path.join(eventsDir, f), 'utf8');
      if (f.endsWith('.json')) return JSON.parse(content);
      if (f.endsWith('.md')) return parseFrontmatter(content);
      return null;
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => new Date(a.date) - new Date(b.date));

fs.writeFileSync(outFile, JSON.stringify(events, null, 2));
console.log(`Built ${events.length} events → _data/events.json`);
