import type { NewsArticle, NewsFilterOptions, NewsSearchResult, INewsProvider } from '../types/news.ts';

/**
 * MockNewsProvider
 * Deterministic provider for UI layout testing.
 * Curated with civic imagery representing Pune municipal topics.
 * Strictly labeled as demo content. No fabricated live events or false claims.
 */
export class MockNewsProvider implements INewsProvider {
  private demoArticles: NewsArticle[] = [
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

  async searchArticles(options: NewsFilterOptions): Promise<NewsSearchResult> {
    // Simulate brief network latency for realistic state management
    await new Promise((resolve) => setTimeout(resolve, 350));

    const query = options.query?.trim().toLowerCase() || '';
    const category = options.category;
    const locality = options.locality?.toLowerCase() || 'pune';

    // Deterministic filtering logic
    const filtered = this.demoArticles.filter((article) => {
      // Locality check
      const matchesLocality = article.locality.toLowerCase().includes(locality) || locality === 'all';
      if (!matchesLocality) return false;

      // Category check
      if (category && category !== 'All' && article.category !== category) {
        return false;
      }

      // Query text check
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
      statusMessage: 'Serving local demo articles.',
    };
  }

  async getArticleById(id: string): Promise<NewsArticle | null> {
    const article = this.demoArticles.find((a) => a.id === id);
    return article || null;
  }
}

/**
 * CivicNewsProvider
 * Connects to the local server /api/news endpoint (backed by SerpApi).
 * Gracefully falls back to MockNewsProvider if server is unreachable,
 * offline, or if the API key is not yet configured.
 */
export class CivicNewsProvider implements INewsProvider {
  private fallbackProvider = new MockNewsProvider();
  private articleCache = new Map<string, NewsArticle>();

  async searchArticles(options: NewsFilterOptions): Promise<NewsSearchResult> {
    const params = new URLSearchParams();
    if (options.locality) params.set('locality', options.locality);
    if (options.query) params.set('query', options.query);
    if (options.category && options.category !== 'All') params.set('category', options.category);
    if (options.refresh) params.set('refresh', 'true');

    try {
      const response = await fetch(`/api/news?${params.toString()}`);
      if (!response.ok) {
        console.warn(`[newsService] /api/news returned HTTP ${response.status}, using demo fallback.`);
        const fallbackResult = await this.fallbackProvider.searchArticles(options);
        return {
          ...fallbackResult,
          statusMessage: `Local server returned HTTP ${response.status}. Displaying demo civic dispatches.`,
        };
      }

      const result: NewsSearchResult = await response.json();

      // Cache articles in memory for fast getArticleById lookup
      if (Array.isArray(result.articles)) {
        for (const article of result.articles) {
          this.articleCache.set(article.id, article);
        }
      }

      return result;
    } catch (err) {
      console.warn('[newsService] Network error requesting /api/news, using demo fallback:', err);
      const fallbackResult = await this.fallbackProvider.searchArticles(options);
      return {
        ...fallbackResult,
        statusMessage: 'Offline or server unavailable. Displaying local demo civic dispatches.',
      };
    }
  }

  async getArticleById(id: string): Promise<NewsArticle | null> {
    if (this.articleCache.has(id)) {
      return this.articleCache.get(id) || null;
    }
    return this.fallbackProvider.getArticleById(id);
  }
}

// Default exported singleton provider instance
export const newsService = new CivicNewsProvider();
