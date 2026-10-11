import { NewsArticle } from '../types/news';
import { CivicFlashcard } from '../types/flashcard';

/**
 * Deterministic (Rule-Based, Non-AI) Flashcard Generator
 * Transforms structured civic articles into concise flashcards.
 */
export function generateFlashcardFromArticle(article: NewsArticle): CivicFlashcard {
  // Deterministic sentence extraction
  const sentences = article.factualDescription
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter((s) => s.length > 0);

  const keyPoints = sentences.length > 0 
    ? sentences.map((s) => `${s}.`)
    : [article.factualDescription];

  // Deterministic impact rule per civic category
  let impactAssessment = 'General neighbourhood civic development.';
  switch (article.category) {
    case 'Traffic/Transport':
      impactAssessment = 'Commuters should plan for potential route diversions or service frequency adjustments.';
      break;
    case 'Utilities':
      impactAssessment = 'Residents should store sufficient water or prepare for utility downtime during maintenance.';
      break;
    case 'Infrastructure/Roads':
      impactAssessment = 'Local transit may experience minor detours while structural repairs take place.';
      break;
    case 'Politics/Government':
      impactAssessment = 'Public consultation or administrative notification affecting local ward governance.';
      break;
    case 'Disasters/Emergencies':
      impactAssessment = 'Precautionary measures active. Follow official municipal disaster cell directives.';
      break;
    case 'Public Safety':
      impactAssessment = 'Enhanced civic safety monitoring and community surveillance active.';
      break;
    case 'Community/Other':
      impactAssessment = 'Neighbourhood community initiative; open to resident participation.';
      break;
  }

  return {
    id: `fc-${article.id}`,
    articleId: article.id,
    category: article.category,
    locality: article.locality,
    headline: article.headline.replace(/^\[Demo\]\s*/i, ''),
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Advisory notice published by civic authorities.'],
    impactAssessment,
    sourceName: article.source.name,
    sourceUrl: article.sourceUrl,
    publishedAt: article.publishedAt,
    thumbnailUrl: article.thumbnailUrl,
    dateGenerated: new Date().toISOString(),
    isDemoContent: article.isDemoContent,
  };
}

export function generateFlashcardsFromArticleList(articles: NewsArticle[]): CivicFlashcard[] {
  return articles.map((a) => generateFlashcardFromArticle(a));
}
