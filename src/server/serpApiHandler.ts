import type { NewsArticle, NewsSearchResult, CivicCategory, NewsFilterOptions } from '../types/news.ts';

// In-memory cache to save SerpApi credits during local hackathon development
interface CacheEntry {
  data: NewsSearchResult;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

// Minimal server request/response interfaces avoiding @types/node dependency
export interface ApiRequest {
  url?: string;
  method?: string;
}

export interface ApiResponse {
  statusCode?: number;
  setHeader(name: string, value: string): void;
  end(chunk?: string): void;
}

// Fallback demo articles preserved from the existing mock provider
export const DEMO_ARTICLES: NewsArticle[] = [
  {
    id: 'demo-pune-001',
    headline: '[Demo] Pune Metro Line 3: Planned Service Adjustments Near Shivajinagar Junction',
    factualDescription: 'Municipal transit authorities have scheduled structural inspection work on the underground corridor. Feeder bus frequency adjusted during evening hours.',
    source: {
      name: 'Pune Municipal Transport [Demo Record]',
      domain: 'pmc.gov.in',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-10T08:30:00Z',
    category: 'Traffic/Transport',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.pmc.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-002',
    headline: '[Demo] Scheduled Water Pipeline Maintenance in Kothrud and Karve Nagar',
    factualDescription: 'Water supply department announced a 12-hour supply pause on Thursday for valve replacement at the Parvati water treatment plant. Water tankers on standby.',
    source: {
      name: 'City Water Works Department [Demo Record]',
      domain: 'punecorporation.org',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-09T14:15:00Z',
    category: 'Utilities',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.pmc.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-003',
    headline: '[Demo] University Flyover Construction: Alternating Traffic Corridors Activated',
    factualDescription: 'Traffic police department has notified alternate diversion routes via Senapati Bapat Road while grade separator surfacing work is completed.',
    source: {
      name: 'Pune City Traffic Police [Demo Record]',
      domain: 'punepolice.gov.in',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-08T11:00:00Z',
    category: 'Infrastructure/Roads',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://punepolice.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-004',
    headline: '[Demo] Public Consultation Meeting on Ward Level Solid Waste Management Rules',
    factualDescription: 'Ward office circular invites resident welfare associations to submit public feedback on decentralized dry-waste segregation facilities before month end.',
    source: {
      name: 'Ward Committee Secretariat [Demo Record]',
      domain: 'pmc.gov.in',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-07T09:45:00Z',
    category: 'Politics/Government',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.pmc.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-005',
    headline: '[Demo] Monsoon Preparedness: Stormwater Drain Desilting Schedule Published',
    factualDescription: 'Disaster management cell published the ward-wise timeline for clearing major culverts and storm drains across low-lying riverbank sectors.',
    source: {
      name: 'District Disaster Management Cell [Demo Record]',
      domain: 'pune.gov.in',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-06T16:20:00Z',
    category: 'Disasters/Emergencies',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://pune.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-006',
    headline: '[Demo] Night Patrolling and Street Light Upgrades Along Sinhagad Road Corridor',
    factualDescription: 'Joint police and municipal engineering inspection identified 45 dark spots for high-mast LED installations and increased evening patrol beats.',
    source: {
      name: 'Public Safety Initiative [Demo Record]',
      domain: 'punepolice.gov.in',
      isVerifiedNotice: true,
    },
    publishedAt: '2026-10-05T19:10:00Z',
    category: 'Public Safety',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://punepolice.gov.in',
    isDemoContent: true,
  },
  {
    id: 'demo-pune-007',
    headline: '[Demo] Community Tree Plantation and Local Park Restoration in Viman Nagar',
    factualDescription: 'Local neighbourhood group partners with civic gardens department to plant 200 indigenous saplings and restore jogging track gravel.',
    source: {
      name: 'Neighbourhood Civic Forum [Demo Record]',
      domain: 'civicforum.example.org',
      isVerifiedNotice: false,
    },
    publishedAt: '2026-10-04T07:00:00Z',
    category: 'Community/Other',
    locality: 'Pune',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://pune.gov.in',
    isDemoContent: true,
  }
];

// Deterministic rule-based category classifier
function classifyCategory(headline: string, snippet: string, requestedCategory?: CivicCategory | 'All'): CivicCategory {
  if (requestedCategory && requestedCategory !== 'All') {
    return requestedCategory;
  }
  const text = `${headline} ${snippet}`.toLowerCase();
  if (/\b(metro|traffic|transit|bus|pmpml|diversion|congestion|signal|road closure|commute)\b/.test(text)) {
    return 'Traffic/Transport';
  }
  if (/\b(water|pipeline|leak|supply|electricity|power|mseb|outage|utility|drainage)\b/.test(text)) {
    return 'Utilities';
  }
  if (/\b(road|flyover|bridge|pothole|repair|highway|construction|culvert|infrastructure)\b/.test(text)) {
    return 'Infrastructure/Roads';
  }
  if (/\b(pmc|corporation|municipal|mayor|ward|tender|notice|gazette|collector|government|civic body)\b/.test(text)) {
    return 'Politics/Government';
  }
  if (/\b(flood|rain|monsoon|storm|waterlogging|disaster|fire|alert|landslide|cyclone)\b/.test(text)) {
    return 'Disasters/Emergencies';
  }
  if (/\b(police|patrol|crime|safety|security|cctv|arrest|accident|investigation)\b/.test(text)) {
    return 'Public Safety';
  }
  return 'Community/Other';
}

function extractDomain(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isGovDomain(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host.endsWith('.gov.in') || host.endsWith('.nic.in') || host.includes('punecorporation.org');
  } catch {
    return false;
  }
}

// Deterministic deduplication by normalized headline and link
function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const result: NewsArticle[] = [];

  for (const item of articles) {
    const normalizedTitle = item.headline
      .toLowerCase()
      .replace(/\s*[-–|]\s*[a-z0-9\s]+$/i, '')
      .replace(/[^a-z0-9]/g, '');

    if (item.sourceUrl && seenUrls.has(item.sourceUrl)) {
      continue;
    }
    if (seenTitles.has(normalizedTitle) && normalizedTitle.length > 10) {
      continue;
    }

    seenTitles.add(normalizedTitle);
    if (item.sourceUrl) seenUrls.add(item.sourceUrl);
    result.push(item);
  }

  return result;
}

// Filter existing mock articles for graceful demo mode
export function filterDemoArticles(options: NewsFilterOptions): NewsSearchResult {
  const query = options.query?.trim().toLowerCase() || '';
  const category = options.category;
  const locality = options.locality?.toLowerCase() || 'pune';

  const filtered = DEMO_ARTICLES.filter((article) => {
    const matchesLocality = article.locality.toLowerCase().includes(locality) || locality === 'all';
    if (!matchesLocality) return false;

    if (category && category !== 'All' && article.category !== category) {
      return false;
    }

    if (query) {
      const inHeadline = article.headline.toLowerCase().includes(query);
      const inDescription = article.factualDescription.toLowerCase().includes(query);
      const inSource = article.source.name.toLowerCase().includes(query);
      const inCategory = article.category.toLowerCase().includes(query);
      return inHeadline || inDescription || inSource || inCategory;
    }

    return true;
  });

  return {
    articles: filtered,
    totalResults: filtered.length,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    queryExecuted: options.query || `Local civic updates (${options.locality})`,
    isDemoMode: true,
    isConfigured: false,
    statusMessage: 'SERPAPI_API_KEY not configured. Serving local demo articles.',
  };
}

// Primary Server Handler for /api/news
export async function handleNewsApiRequest(
  req: ApiRequest,
  res: ApiResponse,
  apiKeyFromEnv?: string
): Promise<void> {
  const reqUrl = req.url || '';
  const urlObj = new URL(reqUrl, 'http://localhost');
  const params = urlObj.searchParams;

  const locality = (params.get('locality') || 'Pune').trim();
  const query = (params.get('query') || '').trim();
  const categoryParam = params.get('category') as CivicCategory | 'All' | null;
  const category: CivicCategory | 'All' = categoryParam || 'All';
  const forceRefresh = params.get('refresh') === 'true';

  // Read the key strictly on the server (never exposed to client bundle)
  const apiKey = (apiKeyFromEnv || '').trim();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  // Case 1: No API key configured -> return preserved demo experience with clear status
  if (!apiKey) {
    const demoResult = filterDemoArticles({ locality, query, category });
    res.statusCode = 200;
    res.end(JSON.stringify(demoResult));
    return;
  }

  // Check in-memory cache
  const cacheKey = `${locality.toLowerCase()}:${category}:${query.toLowerCase()}`;
  const now = Date.now();
  if (!forceRefresh && memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      res.statusCode = 200;
      res.end(JSON.stringify(cached.data));
      return;
    }
  }

  // Case 2: API key configured -> build civic query and request SerpApi
  let serpQuery = `${locality} civic news`;
  if (query) {
    serpQuery = `${query} ${locality}`;
  } else if (category && category !== 'All') {
    switch (category) {
      case 'Traffic/Transport':
        serpQuery = `${locality} (traffic OR metro OR transport OR "road closure")`;
        break;
      case 'Utilities':
        serpQuery = `${locality} (water supply OR electricity OR outage OR pipeline)`;
        break;
      case 'Infrastructure/Roads':
        serpQuery = `${locality} (road work OR flyover OR bridge OR construction)`;
        break;
      case 'Politics/Government':
        serpQuery = `${locality} (municipal OR PMC OR corporator OR notice)`;
        break;
      case 'Disasters/Emergencies':
        serpQuery = `${locality} (flood OR rainfall OR monsoon OR disaster OR emergency)`;
        break;
      case 'Public Safety':
        serpQuery = `${locality} (police OR safety OR security OR patrol)`;
        break;
      case 'Community/Other':
        serpQuery = `${locality} (civic OR community OR neighbourhood OR resident)`;
        break;
    }
  } else {
    // General civic news — locality-agnostic terms (no PMC, PMPML, or other Pune-specific refs)
    serpQuery = `${locality} (traffic OR "road closed" OR "water supply" OR municipal OR civic news)`;
  }

  try {
    const serpUrl = new URL('https://serpapi.com/search.json');
    serpUrl.searchParams.set('engine', 'google_news');
    serpUrl.searchParams.set('q', serpQuery);
    serpUrl.searchParams.set('gl', 'in');
    serpUrl.searchParams.set('hl', 'en');
    serpUrl.searchParams.set('api_key', apiKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const upstreamResponse = await fetch(serpUrl.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!upstreamResponse.ok) {
      console.warn(`[SerpApi] Upstream returned status ${upstreamResponse.status}`);
      const fallbackResult = filterDemoArticles({ locality, query, category });
      fallbackResult.statusMessage = upstreamResponse.status === 429
        ? 'SerpApi rate limit reached. Displaying local demo civic notices.'
        : `SerpApi upstream error (${upstreamResponse.status}). Serving local fallback data.`;
      res.statusCode = 200;
      res.end(JSON.stringify(fallbackResult));
      return;
    }

    const data = await upstreamResponse.json() as {
      news_results?: Array<{
        title?: string;
        link?: string;
        snippet?: string;
        date?: string;
        thumbnail?: string;
        source?: { name?: string; icon?: string };
      }>;
      error?: string;
    };

    if (data.error) {
      console.warn(`[SerpApi] Upstream error message: ${data.error}`);
      const fallbackResult = filterDemoArticles({ locality, query, category });
      fallbackResult.statusMessage =
        data.error.toLowerCase().includes('run out') || data.error.toLowerCase().includes('limit')
          ? 'SerpApi search quota exceeded. Serving local demo articles.'
          : `SerpApi notice: ${data.error}. Serving local fallback data.`;
      res.statusCode = 200;
      res.end(JSON.stringify(fallbackResult));
      return;
    }

    const rawResults = data.news_results || [];
    const normalizedArticles: NewsArticle[] = rawResults.map((item, index) => {
      const headline = item.title?.trim() || `Civic report for ${locality}`;
      const factualDescription = item.snippet?.trim() || 'No additional summary provided by publisher.';
      const sourceUrl = item.link || 'https://www.google.com';
      const sourceName = item.source?.name?.trim() || 'Local News Source';
      const domain = extractDomain(sourceUrl);
      const isVerified = isGovDomain(sourceUrl);
      const assignedCategory = classifyCategory(headline, factualDescription, category);

      return {
        id: `serp-${index}-${Math.abs(hashString(sourceUrl || headline))}`,
        headline,
        factualDescription,
        source: {
          name: sourceName,
          domain,
          isVerifiedNotice: isVerified,
        },
        publishedAt: item.date || undefined,
        category: assignedCategory,
        locality,
        thumbnailUrl: item.thumbnail || undefined,
        sourceUrl,
        isDemoContent: false,
      };
    });

    const deduplicated = deduplicateArticles(normalizedArticles);
    const hasLiveResults = deduplicated.length > 0;

    const searchResult: NewsSearchResult = {
      articles: deduplicated,
      totalResults: deduplicated.length,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queryExecuted: serpQuery,
      isDemoMode: false,
      isConfigured: true,
      statusMessage: hasLiveResults
        ? `Successfully retrieved ${deduplicated.length} live articles from SerpApi.`
        : `No matching articles found in recent news for this query. This does not indicate that no civic events occurred; try broadening your query or selecting another category.`,
    };

    // Cache valid non-empty responses for 15 minutes to preserve SerpApi credits
    if (hasLiveResults) {
      memoryCache.set(cacheKey, {
        data: searchResult,
        timestamp: now,
      });
    }

    res.statusCode = 200;
    res.end(JSON.stringify(searchResult));
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    console.error(`[SerpApi] Fetch error: ${errorMsg}`);

    const fallbackResult = filterDemoArticles({ locality, query, category });
    fallbackResult.statusMessage = `Network error contacting news provider: ${errorMsg}. Serving local fallback.`;
    res.statusCode = 200;
    res.end(JSON.stringify(fallbackResult));
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
