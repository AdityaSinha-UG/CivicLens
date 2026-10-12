import React from 'react';
import { Sparkles, Newspaper } from 'lucide-react';
import { NewsArticle, CivicCategory } from '../types/news';
import { SearchBar } from '../components/news/SearchBar';
import { NewsCard } from '../components/news/NewsCard';
import { FeaturedCarousel } from '../components/news/FeaturedCarousel';
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
  isDemoMode?: boolean;
  statusMessage?: string;
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
  isDemoMode,
  statusMessage,
  onSearch,
  onSelectCategory,
  onRefresh,
  onCreateFlashcards,
  onResetFilters,
}) => {
  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <DemoNoticeBanner isDemoMode={isDemoMode} statusMessage={statusMessage} />

      {/* Editorial Page Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black/15 dark:border-[#5A3A1A]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black">
              <Newspaper size={13} />
              <span>HYPERLOCAL BULLETIN</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-black/80 dark:text-[#F5EEE6]/65">
              {locality} Edition
            </span>
          </div>
          <h1 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-[#F5EEE6] tracking-tight mt-2">
            Civic Radar: {locality}
          </h1>
          <p className="text-xs sm:text-sm text-black/85 dark:text-[#F5EEE6]/65 font-medium mt-1">
            Verified local dispatches across public transit, road infrastructure, water supply, and municipal notices.
          </p>
        </div>

        {/* Action button: Create Flashcards */}
        <div className="shrink-0">
          <Button
            variant="secondary"
            onClick={onCreateFlashcards}
            icon={<Sparkles size={16} className="text-black" />}
            className="w-full sm:w-auto font-black text-sm uppercase tracking-wider shadow-[0_5px_0_0_#121212] bg-[#D4FF00] hover:bg-white dark:hover:bg-[#2E1F0D] text-black border-2 border-black dark:border-[#5A3A1A]"
          >
            Create Flashcards ({articles.length})
          </Button>
        </div>
      </div>

      {/* Top Prominent Featured News Carousel */}
      {!isLoading && !error && articles.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <FeaturedCarousel articles={articles} />
      )}

      {/* Search Bar & Category Filters */}
      <div className="bg-white/95 dark:bg-[#231A0F] backdrop-blur-md rounded-3xl p-5 border-2 border-black dark:border-[#5A3A1A] shadow-[0_8px_0_0_#121212]">
        <SearchBar
          locality={locality}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          isLoading={isLoading}
          onSearch={onSearch}
          onSelectCategory={onSelectCategory}
          onRefresh={onRefresh}
        />
      </div>

      {/* Feed Area */}
      <div>
        {/* Results Metadata */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between text-xs font-bold text-black dark:text-[#F5EEE6] mb-4 px-2">
            <div>
              <span>
                Dispatches: <strong className="bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black px-2 py-0.5 rounded-md font-mono">{articles.length}</strong> in{' '}
                <strong className="underline decoration-2 underline-offset-2">{locality}</strong>
              </span>
              {selectedCategory !== 'All' && (
                <span>
                  {' '}• Category: <strong className="bg-white dark:bg-[#231A0F] px-2 py-0.5 rounded-md border border-black dark:border-[#5A3A1A]">{selectedCategory}</strong>
                </span>
              )}
              {searchQuery && (
                <span>
                  {' '}• Query: <strong className="bg-white dark:bg-[#231A0F] px-2 py-0.5 rounded-md border border-black dark:border-[#5A3A1A]">"{searchQuery}"</strong>
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={onResetFilters}
                className="text-xs text-black dark:text-[#F5EEE6] hover:text-white dark:hover:text-black bg-white dark:bg-[#2E1F0D] hover:bg-black dark:hover:bg-[#FA541C] px-2.5 py-1 rounded-full border border-black dark:border-[#5A3A1A] font-black transition-colors cursor-pointer"
              >
                Reset filters
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

};
