const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  const eventsDir = path.join(__dirname, '..', '..', '_data', 'events');

  let files;
  try {
    files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.json'));
  } catch {
    return { statusCode: 200, body: JSON.stringify([]) };
  }

  const events = files
    .map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(eventsDir, f), 'utf8'));
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
