/**
 * Core domain types for CivicLens news discovery.
 * Designed for future SerpApi / news aggregation provider integration.
 */

export type CivicCategory =
  | 'Politics/Government'
  | 'Infrastructure/Roads'
  | 'Utilities'
  | 'Disasters/Emergencies'
  | 'Traffic/Transport'
  | 'Public Safety'
  | 'Community/Other';

export interface NewsSource {
  name: string;
  domain?: string;
  isVerifiedNotice?: boolean;
}

export interface NewsArticle {
  id: string;
  headline: string;
  factualDescription: string;
  source: NewsSource;
  publishedAt?: string; // ISO string or human-readable format
  category: CivicCategory;
  locality: string;
  thumbnailUrl?: string;
  sourceUrl: string; // Must point directly to article or official notice
  isDemoContent: boolean;
}

export interface NewsFilterOptions {
  locality: string;
  query?: string;
  category?: CivicCategory | 'All';
  refresh?: boolean;
}

export interface NewsSearchResult {
  articles: NewsArticle[];
  totalResults: number;
  lastUpdated: string;
  queryExecuted: string;
  isDemoMode: boolean;
  isConfigured?: boolean;
  statusMessage?: string;
}

/**
 * Interface to be implemented by future SerpApi adapter or backend service.
 */
export interface INewsProvider {
  searchArticles(options: NewsFilterOptions): Promise<NewsSearchResult>;
  getArticleById(id: string): Promise<NewsArticle | null>;
}
