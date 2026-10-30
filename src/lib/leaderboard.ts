import { redis } from '@/lib/redis';

export type Board = 'random' | 'predefined';

export interface LeaderboardEntry {
    examId?: string;
    name: string;
    score: number;
    wrong: number;
    marks: number;
    maxMarks: number;
    total: number;
    testLabel: string;
    timestamp: string;
}

export const LEADERBOARD_SIZE = 10;
const PREDEFINED_TTL_SECONDS = 48 * 60 * 60;

// The predefined board covers one IST calendar day (24h, resets at midnight IST); the random board is all-time.
function istDate(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function keyFor(board: Board): string {
    return board === 'random' ? 'lb:random' : `lb:predefined:${istDate()}`;
}

// One round trip: keep each name's best score, admit only scores that beat the current lowest
// once the board is full, and trim back to the limit. ZSET member = "n:<name>", details live in a hash.
const ADD_SCRIPT = `
local key, dkey = KEYS[1], KEYS[2]
local member, score, entry, limit, ttl = ARGV[1], tonumber(ARGV[2]), ARGV[3], tonumber(ARGV[4]), tonumber(ARGV[5])
local cur = redis.call('ZSCORE', key, member)
if cur then
  if score <= tonumber(cur) then return 0 end
elseif redis.call('ZCARD', key) >= limit then
  local low = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  if score <= tonumber(low[2]) then return 0 end
end
redis.call('ZADD', key, score, member)
redis.call('HSET', dkey, member, entry)
local over = redis.call('ZCARD', key) - limit
if over > 0 then
  local out = redis.call('ZRANGE', key, 0, over - 1)
  redis.call('ZREMRANGEBYRANK', key, 0, over - 1)
  for _, m in ipairs(out) do redis.call('HDEL', dkey, m) end
end
if ttl > 0 then
  redis.call('EXPIRE', key, ttl)
  redis.call('EXPIRE', dkey, ttl)
end
return 1
`;

export async function submitToLeaderboard(board: Board, entry: LeaderboardEntry): Promise<boolean> {
    const key = keyFor(board);
    const pct = (entry.marks / entry.maxMarks) * 100;
    // Earlier submission wins ties; 1ms is far below the smallest real score gap.
    const score = pct - Date.now() / 1e15;
    const added = await redis.eval(
        ADD_SCRIPT,
        [key, `${key}:d`],
        [
            `n:${entry.name.toLowerCase()}`,
            String(score),
            JSON.stringify(entry),
            String(LEADERBOARD_SIZE),
            String(board === 'predefined' ? PREDEFINED_TTL_SECONDS : 0),
        ],
    );
    if (added === 1) cache.delete(key); // this instance shows the new score immediately
    return added === 1;
}

// Per-instance read cache: however many visitors load the page, Redis is read at most once per board per TTL.
// shortcut: not shared across server instances, move to a CDN cache or shared Redis cache if you scale out.
const READ_TTL_MS = 30_000;
const cache = new Map<string, { at: number; data: LeaderboardEntry[] }>();

export async function getLeaderboard(board: Board): Promise<LeaderboardEntry[]> {
    const key = keyFor(board);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < READ_TTL_MS) return hit.data;

    const [members, details] = await redis
        .pipeline()
        .zrange<string[]>(key, 0, LEADERBOARD_SIZE - 1, { rev: true })
        .hgetall<Record<string, LeaderboardEntry | string>>(`${key}:d`)
        .exec<[string[], Record<string, LeaderboardEntry | string> | null]>();

    const out: LeaderboardEntry[] = [];
    for (const m of members ?? []) {
        const d = details?.[m];
        if (!d) continue;
        out.push(typeof d === 'string' ? JSON.parse(d) : d);
    }
    cache.set(key, { at: Date.now(), data: out });
    return out;
}
