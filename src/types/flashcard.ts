import { CivicCategory } from './news';

export interface CivicFlashcard {
  id: string;
  articleId?: string;
  category: CivicCategory;
  locality: string;
  headline: string;
  keyPoints: string[];
  impactAssessment: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  dateGenerated: string;
  isDemoContent: boolean;
}

export type FlashcardViewMode = 'carousel' | 'grid';
