/**
 * Vercel Edge Runtime serverless function for CivicLens news API.
 *
 * This is the production equivalent of the Vite dev-server middleware in vite.config.ts.
 * The Vite middleware only runs during `npm run dev`. On Vercel, this file is the real
 * server-side endpoint deployed to the edge network.
 *
 * Endpoint: GET /api/news
 * Query params:
 *   - locality  (string)  default: "Pune"
 *   - query     (string)  free-text search
 *   - category  (string)  one of the CivicCategory values or "All"
 *   - refresh   ("true")  bypass server-side cache
 *
 * SERPAPI_API_KEY must be set in Vercel Project Settings → Environment Variables.
 * It is NEVER prefixed with VITE_ and is never bundled into the client.
 */

export const config = { runtime: 'edge' };

// ── Types (inlined to keep this file self-contained) ──────────────────────────

type CivicCategory =
  | 'Traffic/Transport'
  | 'Utilities'
  | 'Infrastructure/Roads'
  | 'Politics/Government'
  | 'Disasters/Emergencies'
  | 'Public Safety'
  | 'Community/Other';

interface NewsArticle {
  id: string;
  headline: string;
  factualDescription: string;
  source: { name: string; domain: string; isVerifiedNotice: boolean };
  publishedAt?: string;
  category: CivicCategory;
  locality: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  isDemoContent: boolean;
}

interface NewsSearchResult {
  articles: NewsArticle[];
  totalResults: number;
  lastUpdated: string;
  queryExecuted: string;
  isDemoMode: boolean;
  isConfigured: boolean;
  statusMessage?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function classifyCategory(
  headline: string,
  snippet: string,
  requested?: CivicCategory | 'All'
): CivicCategory {
  if (requested && requested !== 'All') return requested;
  const text = `${headline} ${snippet}`.toLowerCase();
  if (/\b(metro|traffic|transit|bus|diversion|congestion|signal|road closure|commute)\b/.test(text))
    return 'Traffic/Transport';
  if (/\b(water|pipeline|leak|supply|electricity|power|outage|utility|drainage)\b/.test(text))
    return 'Utilities';
  if (/\b(road|flyover|bridge|pothole|repair|highway|construction|culvert|infrastructure)\b/.test(text))
    return 'Infrastructure/Roads';
  if (/\b(corporation|municipal|mayor|ward|tender|notice|gazette|collector|government|civic body)\b/.test(text))
    return 'Politics/Government';
  if (/\b(flood|rain|monsoon|storm|waterlogging|disaster|fire|alert|landslide|cyclone)\b/.test(text))
    return 'Disasters/Emergencies';
  if (/\b(police|patrol|crime|safety|security|cctv|arrest|accident|investigation)\b/.test(text))
    return 'Public Safety';
  return 'Community/Other';
}

function extractDomain(url?: string): string {
  if (!url) return '';
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function isGovDomain(url?: string): boolean {
  if (!url) return false;
  try {
    const h = new URL(url).hostname;
    return h.endsWith('.gov.in') || h.endsWith('.nic.in');
  } catch { return false; }
}

function deduplicate(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const out: NewsArticle[] = [];
  for (const item of articles) {
    const norm = item.headline
      .toLowerCase()
      .replace(/\s*[-–|]\s*[a-z0-9\s]+$/i, '')
      .replace(/[^a-z0-9]/g, '');
    if (item.sourceUrl && seenUrls.has(item.sourceUrl)) continue;
    if (seenTitles.has(norm) && norm.length > 10) continue;
    seenTitles.add(norm);
    if (item.sourceUrl) seenUrls.add(item.sourceUrl);
    out.push(item);
  }
  return out;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return h;
}

/**
 * Build the SerpApi Google News query.
 * Deliberately avoids Pune-specific abbreviations (PMC, PMPML) so the query
 * works correctly for Delhi, Mumbai, Bangalore, and other cities.
 */
function buildSerpQuery(
  locality: string,
  category: CivicCategory | 'All',
  customQuery: string
): string {
  if (customQuery) return `${customQuery} ${locality}`;
  switch (category) {
    case 'Traffic/Transport':
      return `${locality} (traffic OR metro OR transport OR "road closure" OR diversion)`;
    case 'Utilities':
      return `${locality} (water supply OR electricity OR power outage OR pipeline OR drainage)`;
    case 'Infrastructure/Roads':
      return `${locality} (road work OR flyover OR bridge OR pothole OR construction)`;
    case 'Politics/Government':
      return `${locality} (municipal corporation OR civic body OR corporator OR ward notice OR government)`;
    case 'Disasters/Emergencies':
      return `${locality} (flood OR rainfall OR monsoon OR disaster OR emergency alert)`;
    case 'Public Safety':
      return `${locality} (police OR safety OR crime OR security OR patrol)`;
    case 'Community/Other':
      return `${locality} (civic OR community OR neighbourhood OR resident welfare)`;
    default:
      // General: locality-agnostic terms — works for any Indian city
      return `${locality} (traffic OR "road closed" OR "water supply" OR municipal OR civic news)`;
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
}

function jsonResponse(body: NewsSearchResult, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// ── Handler ────────────────────────────────────────────────────────────────────

export default async function handler(request: Request): Promise<Response> {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }

  const url = new URL(request.url);
  const params = url.searchParams;

  const locality = (params.get('locality') || 'Pune').trim();
  const customQuery = (params.get('query') || '').trim();
  const categoryParam = params.get('category') as CivicCategory | 'All' | null;
  const category: CivicCategory | 'All' = categoryParam || 'All';

  // Read API key server-side only — never sent to the browser
  const apiKey = (process.env.SERPAPI_API_KEY || '').trim();

  // ── No API key: return clear configuration error (not silent demo fallback) ──
  if (!apiKey) {
    return jsonResponse({
      articles: [],
      totalResults: 0,
      lastUpdated: nowTime(),
      queryExecuted: customQuery || `Civic updates for ${locality}`,
      isDemoMode: false,
      isConfigured: false,
      statusMessage:
        'SERPAPI_API_KEY is not configured. Go to Vercel Project Settings → Environment Variables and add SERPAPI_API_KEY (without the VITE_ prefix). Redeploy after saving.',
    });
  }

  const serpQuery = buildSerpQuery(locality, category, customQuery);

  try {
    const serpUrl = new URL('https://serpapi.com/search.json');
    serpUrl.searchParams.set('engine', 'google_news');
    serpUrl.searchParams.set('q', serpQuery);
    serpUrl.searchParams.set('gl', 'in');
    serpUrl.searchParams.set('hl', 'en');
    serpUrl.searchParams.set('num', '10');
    serpUrl.searchParams.set('api_key', apiKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const upstream = await fetch(serpUrl.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      const s = upstream.status;
      console.error(`[CivicLens /api/news] SerpApi HTTP ${s} for locality="${locality}"`);
      return jsonResponse({
        articles: [],
        totalResults: 0,
        lastUpdated: nowTime(),
        queryExecuted: serpQuery,
        isDemoMode: false,
        isConfigured: true,
        statusMessage: s === 429
          ? 'SerpApi rate limit reached. Please wait and try again, or upgrade your SerpApi plan.'
          : `SerpApi returned HTTP ${s}. Check your API key in Vercel settings and try again.`,
      });
    }

    const data = (await upstream.json()) as {
      news_results?: Array<{
        title?: string;
        link?: string;
        snippet?: string;
        date?: string;
        thumbnail?: string;
        source?: { name?: string };
      }>;
      error?: string;
    };

    if (data.error) {
      const isQuota =
        data.error.toLowerCase().includes('run out') ||
        data.error.toLowerCase().includes('limit') ||
        data.error.toLowerCase().includes('quota');
      console.warn(`[CivicLens /api/news] SerpApi error: ${data.error}`);
      return jsonResponse({
        articles: [],
        totalResults: 0,
        lastUpdated: nowTime(),
        queryExecuted: serpQuery,
        isDemoMode: false,
        isConfigured: true,
        statusMessage: isQuota
          ? 'SerpApi monthly search quota exceeded. Check your plan at serpapi.com or wait for quota reset.'
          : `SerpApi returned an error: ${data.error}`,
      });
    }

    const raw = data.news_results || [];
    const articles: NewsArticle[] = raw.map((item, i) => {
      const headline = item.title?.trim() || `Civic update for ${locality}`;
      const factualDescription = item.snippet?.trim() || 'No summary provided by publisher.';
      const sourceUrl = item.link || 'https://news.google.com';
      const sourceName = item.source?.name?.trim() || 'Local News Source';
      return {
        id: `serp-${i}-${Math.abs(hashString(sourceUrl + headline))}`,
        headline,
        factualDescription,
        source: {
          name: sourceName,
          domain: extractDomain(sourceUrl),
          isVerifiedNotice: isGovDomain(sourceUrl),
        },
        publishedAt: item.date || undefined,
        category: classifyCategory(headline, factualDescription, category),
        locality,
        thumbnailUrl: item.thumbnail || undefined,
        sourceUrl,
        isDemoContent: false,
      };
    });

    const deduplicated = deduplicate(articles);
    const hasResults = deduplicated.length > 0;

    console.log(`[CivicLens /api/news] locality="${locality}" category="${category}" → ${deduplicated.length} articles`);

    return jsonResponse({
      articles: deduplicated,
      totalResults: deduplicated.length,
      lastUpdated: nowTime(),
      queryExecuted: serpQuery,
      isDemoMode: false,
      isConfigured: true,
      statusMessage: hasResults
        ? `Live: ${deduplicated.length} articles for ${locality}`
        : `No articles found for "${serpQuery}". Try a different locality or category.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = msg.toLowerCase().includes('abort') || msg.toLowerCase().includes('timeout');
    console.error(`[CivicLens /api/news] Fetch error: ${msg}`);
    return jsonResponse({
      articles: [],
      totalResults: 0,
      lastUpdated: nowTime(),
      queryExecuted: serpQuery,
      isDemoMode: false,
      isConfigured: true,
      statusMessage: isTimeout
        ? 'News request timed out (12 s). SerpApi may be slow. Please try again.'
        : `Failed to contact SerpApi: ${msg}`,
    });
  }
}
