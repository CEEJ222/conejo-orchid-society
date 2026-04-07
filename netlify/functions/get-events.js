const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const obj = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      obj[key] = val;
    }
  });
  return obj;
}

exports.handler = async () => {
  const eventsDir = path.join(__dirname, '..', '..', '_data', 'events');

  let files;
  try {
    files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));
  } catch {
    return { statusCode: 200, body: JSON.stringify([]) };
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

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  };
};
