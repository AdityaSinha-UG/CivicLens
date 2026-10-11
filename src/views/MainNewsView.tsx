import React from 'react';
import { Sparkles } from 'lucide-react';
import { NewsArticle, CivicCategory } from '../types/news';
import { SearchBar } from '../components/news/SearchBar';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingState } from '../components/news/LoadingState';
import { EmptyState } from '../components/news/EmptyState';
import { ErrorState } from '../components/news/ErrorState';
import { DemoNoticeBanner } from '../components/common/Banner';
import { Button } from '../components/common/Button';

interface MainNewsViewProps {
  locality: string;
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: CivicCategory | 'All';
  onSearch: (query: string) => void;
  onSelectCategory: (category: CivicCategory | 'All') => void;
  onRefresh: () => void;
  onCreateFlashcards: () => void;
  onResetFilters: () => void;
}

export const MainNewsView: React.FC<MainNewsViewProps> = ({
  locality,
  articles,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  onSearch,
  onSelectCategory,
  onRefresh,
  onCreateFlashcards,
  onResetFilters,
}) => {
  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <DemoNoticeBanner />

      {/* Editorial Page Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5D3C2]">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#315B48]">
            Local Civic Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292923] mt-0.5">
            Reports & Notices for {locality}
          </h1>
          <p className="text-xs sm:text-sm text-[#615E52] mt-1">
            Verified updates covering road repairs, water supply, public transit, and municipal notices.
          </p>
        </div>

        {/* Action button */}
        <div className="shrink-0">
          <Button
            variant="secondary"
            onClick={onCreateFlashcards}
            icon={<Sparkles size={16} className="text-[#292923]" />}
            className="w-full sm:w-auto shadow-xs font-semibold"
          >
            Create Flashcards ({articles.length})
          </Button>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <SearchBar
        locality={locality}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectCategory={onSelectCategory}
        onRefresh={onRefresh}
      />

      {/* Feed Area */}
      <div>
        {/* Results Metadata */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between text-xs text-[#615E52] mb-4 px-1">
            <div>
              <span>
                Showing <strong className="text-[#292923]">{articles.length}</strong> reports in{' '}
                <strong className="text-[#315B48]">{locality}</strong>
              </span>
              {selectedCategory !== 'All' && (
                <span>
                  {' '}• Category: <strong className="text-[#292923]">{selectedCategory}</strong>
                </span>
              )}
              {searchQuery && (
                <span>
                  {' '}• Query: <strong className="text-[#292923]">"{searchQuery}"</strong>
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={onResetFilters}
                className="text-xs text-[#315B48] hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* State Handlers */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={onRefresh} />
        ) : articles.length === 0 ? (
          <EmptyState
            query={searchQuery}
            category={selectedCategory}
            locality={locality}
            onReset={onResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
