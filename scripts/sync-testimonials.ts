// Read-only: pulls recent feedback from MongoDB and writes src/lib/data/testimonials.json (name + text only, no emails).
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

config({ path: '.env.local' });

const OUT = 'src/lib/data/testimonials.json';
const EXCLUDE = /adithyan/i;
const NEW_COUNT = 8;
// Bug reports and feature requests are feedback, not testimonials: keep short, praise-only entries.
// MAX_LEN excludes long mixed feedback; trim praise by hand in the JSON when needed (re-runs keep existing entries).
const NEGATIVE = /\b(bug|bugs|wrong|incorrect|fix|not able|cannot|can't|cant|please|pls|can you|could you|can u|error)\b/i;
const MAX_LEN = 200;
const POSITIVE = /\b(good|great|amazing|awesome|superb|useful|helpful|love|loving|excellent)\b/i;

const SEED = [
  { name: 'Abhishek Ghosh', quote: 'The interface is good. Overall the website is a solid 10/10 and deserves more recognition.' },
  { name: 'Maverick', quote: 'Good, very useful.' },
  { name: 'Suryansh Upadhyay', quote: 'Decent work.' },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri || !dbName) throw new Error('MONGODB_URI and MONGODB_DB must be set in .env.local');

  const client = new MongoClient(uri);
  await client.connect();
  try {
    const docs = await client
      .db(dbName)
      .collection('feedback')
      .find({}, { projection: { name: 1, feedback: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();
    console.log(`Fetched ${docs.length} feedback documents`);

    const current: { name: string; quote: string }[] = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : SEED;
    const seen = new Set(current.map((t) => t.name.toLowerCase()));

    const fresh = docs
      .map((d) => ({ name: String(d.name ?? '').replace(/\s*\(.*?\)\s*/g, ' ').trim(), quote: String(d.feedback ?? '').replace(/\s+/g, ' ').trim() }))
      .filter((t) => t.name && t.quote && !EXCLUDE.test(t.name) && POSITIVE.test(t.quote) && !NEGATIVE.test(t.quote) && t.quote.length <= MAX_LEN && !seen.has(t.name.toLowerCase()))
      .slice(0, NEW_COUNT);

    const result = [...current.filter((t) => !EXCLUDE.test(t.name)), ...fresh];
    writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
    console.log(`Wrote ${result.length} testimonials (${fresh.length} new) to ${OUT}`);
    fresh.forEach((t) => console.log(`- ${t.name}: ${t.quote.slice(0, 90)}`));
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
