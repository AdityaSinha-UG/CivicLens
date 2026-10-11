import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  ArrowLeft,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { CivicFlashcard, FlashcardViewMode } from '../../types/flashcard';
import { CivicCategory } from '../../types/news';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardGrid } from './FlashcardGrid';
import { Button } from '../common/Button';

interface FlashcardViewerProps {
  cards: CivicFlashcard[];
  locality: string;
  onReturnToFeed: () => void;
}

const CATEGORIES: (CivicCategory | 'All')[] = [
  'All',
  'Politics/Government',
  'Infrastructure/Roads',
  'Utilities',
  'Disasters/Emergencies',
  'Traffic/Transport',
  'Public Safety',
  'Community/Other',
];

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  cards,
  locality,
  onReturnToFeed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<FlashcardViewMode>('carousel');
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory | 'All'>('All');

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'carousel') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, filteredCards.length]);

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="space-y-6">
      {/* Top Controls: Return to Feed & View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5D3C2]">
        <Button
          variant="outline"
          size="sm"
          onClick={onReturnToFeed}
          icon={<ArrowLeft size={16} />}
        >
          Return to Local News Feed
        </Button>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#F5EAE0] p-1 rounded-lg border border-[#E5D3C2]">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-[#315B48] text-white shadow-xs'
                : 'text-[#615E52] hover:text-[#292923]'
            }`}
            aria-pressed={viewMode === 'carousel'}
          >
            <Maximize2 size={13} />
            <span>Card View</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#315B48] text-white shadow-xs'
                : 'text-[#615E52] hover:text-[#292923]'
            }`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={13} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Technical disclosure */}
      <div className="p-3 bg-[#FAF2E3] border border-[#D9A441]/35 rounded-xl text-xs text-[#615E52] flex items-start gap-2.5">
        <Sparkles size={16} className="text-[#8C6415] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Deterministic Flashcard Engine:</strong> These cards are generated via deterministic natural-language sentence extraction and civic impact mapping, strictly without non-deterministic AI generation.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-[#615E52] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Tag size={12} />
          Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#315B48] text-white border-[#315B48] shadow-xs'
                  : 'bg-[#FFF9F4] text-[#615E52] border-[#E5D3C2] hover:bg-[#F6EDE4] hover:text-[#292923]'
              }`}
              aria-pressed={isSelected}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {filteredCards.length === 0 ? (
        <div className="bg-[#FFF9F4] border border-[#E5D3C2] rounded-xl p-8 text-center my-6 max-w-md mx-auto">
          <Info size={28} className="text-[#615E52] mx-auto mb-2" />
          <h4 className="font-serif font-bold text-[#292923]">No flashcards in this category</h4>
          <p className="text-xs text-[#615E52] mt-1">
            Try switching categories or view all cards for {locality}.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={() => setSelectedCategory('All')}>
              Show All Categories
            </Button>
          </div>
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="space-y-4">
          {/* Card Presentation */}
          {currentCard && <FlashcardCard card={currentCard} />}

          {/* Carousel Controls */}
          <div className="flex items-center justify-between max-w-2xl mx-auto pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              icon={<ChevronLeft size={16} />}
              aria-label="Previous flashcard"
            >
              Previous
            </Button>

            <span className="text-xs font-semibold text-[#615E52] bg-[#F5EAE0] px-3 py-1 rounded-full border border-[#E5D3C2]">
              Card <strong className="text-[#292923]">{currentIndex + 1}</strong> of{' '}
              <strong className="text-[#292923]">{filteredCards.length}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              icon={<ChevronRight size={16} />}
              iconPosition="right"
              aria-label="Next flashcard"
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <FlashcardGrid cards={filteredCards} />
      )}
    </div>
  );
};
