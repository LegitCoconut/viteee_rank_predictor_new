import { Campus, Domain, ALL_DOMAINS, ALL_CAMPUSES } from '@/lib/viteee-data';

export type RanksAction = 'analysis' | 'counselling';

export interface RanksQuery {
  rank: number | null;
  action: RanksAction | null;
  domains: Domain[];
  minCategory: number | null;
  campuses: Campus[];
  order: string[] | null;
}

const DOMAIN_CODES: Record<Domain, string> = {
  'computer-science': 'cs',
  electronics: 'el',
  mechanical: 'me',
  core: 'co',
};
const CODE_TO_DOMAIN: Record<string, Domain> = Object.fromEntries(
  Object.entries(DOMAIN_CODES).map(([k, v]) => [v, k as Domain]),
) as Record<string, Domain>;

const CAMPUS_CODES: Record<Campus, string> = {
  vellore: 'v',
  chennai: 'c',
  ap: 'a',
  bhopal: 'b',
};
const CODE_TO_CAMPUS: Record<string, Campus> = Object.fromEntries(
  Object.entries(CAMPUS_CODES).map(([k, v]) => [v, k as Campus]),
) as Record<string, Campus>;

export function buildRanksQuery(q: RanksQuery): string {
  const params = new URLSearchParams();
  if (q.rank) params.set('rank', String(q.rank));
  if (q.action) params.set('action', q.action === 'analysis' ? 'a' : 'c');
  if (q.domains.length > 0 && q.domains.length < ALL_DOMAINS.length) {
    params.set('d', q.domains.map((d) => DOMAIN_CODES[d]).join(','));
  }
  if (q.minCategory !== null) params.set('cat', String(q.minCategory));
  if (q.campuses.length > 0 && q.campuses.length < ALL_CAMPUSES.length) {
    params.set('cp', q.campuses.map((c) => CAMPUS_CODES[c]).join(','));
  }
  if (q.order && q.order.length > 0) {
    params.set('o', q.order.join('|'));
  }
  return params.toString();
}

export function parseRanksQuery(search: string | URLSearchParams): RanksQuery {
  const p = typeof search === 'string' ? new URLSearchParams(search) : search;
  const rankRaw = p.get('rank');
  const rank = rankRaw && /^\d+$/.test(rankRaw) ? parseInt(rankRaw, 10) : null;

  const actionRaw = p.get('action');
  const action: RanksAction | null =
    actionRaw === 'a' || actionRaw === 'analysis'
      ? 'analysis'
      : actionRaw === 'c' || actionRaw === 'counselling'
        ? 'counselling'
        : null;

  const domains = (p.get('d') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((c) => CODE_TO_DOMAIN[c])
    .filter((d): d is Domain => Boolean(d));

  const catRaw = p.get('cat');
  const minCategory =
    catRaw && /^[1-5]$/.test(catRaw) ? parseInt(catRaw, 10) : null;

  const campuses = (p.get('cp') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((c) => CODE_TO_CAMPUS[c])
    .filter((c): c is Campus => Boolean(c));

  const orderRaw = p.get('o');
  const order = orderRaw ? orderRaw.split('|').filter(Boolean) : null;

  return { rank, action, domains, minCategory, campuses, order };
}
