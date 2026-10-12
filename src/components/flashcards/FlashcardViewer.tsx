import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  ArrowLeft,
  Tag,
  Info,
  MousePointer
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

  // Filtered cards list
  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : prev));
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'carousel') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  // Touch Swipe Gesture Handling (Left / Right swipe)
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartCoords.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoords.current) return;
    const diffX = touchStartCoords.current.x - e.changedTouches[0].clientX;
    const diffY = touchStartCoords.current.y - e.changedTouches[0].clientY;

    // Horizontal swipe threshold: 45px and more horizontal than vertical
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartCoords.current = null;
  };

  // Dedicated Native Wheel & Trackpad Navigation
  // Attached exclusively to the flashcard container so wheel events ONLY fire when hovering over the card.
  // Unconditionally prevents default window scrolling so the page NEVER scrolls up or down while scrolling over the flashcard.
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(currentIndex);
  const filteredCardsRef = useRef(filteredCards);
  const lastScrollTriggerRef = useRef<number>(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    filteredCardsRef.current = filteredCards;
  }, [filteredCards]);

  useEffect(() => {
    if (viewMode !== 'carousel') return;
    const container = deckContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // 1. ALWAYS prevent window scrolling while the user is scrolling over the flashcard
      e.preventDefault();
      e.stopPropagation();

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      // Ignore tiny trackpad jitter
      if (Math.abs(delta) < 15) {
        return;
      }

      const now = Date.now();
      // Throttling lockout: ensures one deliberate wheel gesture flips exactly one card
      if (now - lastScrollTriggerRef.current < 280) {
        return;
      }

      if (delta > 0) {
        // Scrolling DOWN -> next flashcard
        if (currentIndexRef.current < filteredCardsRef.current.length - 1) {
          lastScrollTriggerRef.current = now;
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (delta < 0) {
        // Scrolling UP -> previous flashcard
        if (currentIndexRef.current > 0) {
          lastScrollTriggerRef.current = now;
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [viewMode]);

  const currentCard = filteredCards[currentIndex];
  const progressPercent = filteredCards.length > 0
    ? ((currentIndex + 1) / filteredCards.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls: Return to Feed & View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black/15 dark:border-[#5A3A1A]/50">
        <Button
          variant="outline"
          size="sm"
          onClick={onReturnToFeed}
          icon={<ArrowLeft size={16} />}
          className="bg-white dark:bg-[#231A0F] hover:bg-[#121212] dark:hover:bg-[#FA541C] text-black dark:text-[#F5EEE6] hover:text-white dark:hover:text-black border-2 border-black dark:border-[#5A3A1A] font-bold shadow-[0_4px_0_0_#121212]"
        >
          Back to Feed
        </Button>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 p-1 rounded-2xl border-2 border-black dark:border-[#5A3A1A]">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-[#121212] dark:bg-[#FA541C] text-white dark:text-black shadow-sm'
                : 'text-black dark:text-[#F5EEE6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            aria-pressed={viewMode === 'carousel'}
          >
            <Maximize2 size={13} />
            <span>Card Deck</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#121212] dark:bg-[#FA541C] text-white dark:text-black shadow-sm'
                : 'text-black dark:text-[#F5EEE6] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={13} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1 touch-pan-x">
        <span className="text-[10px] sm:text-[11px] font-black text-black dark:text-[#F5EEE6] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-0.5">
          <Tag size={12} />
          Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer border-2 border-black dark:border-[#5A3A1A] whitespace-nowrap min-h-[34px] sm:min-h-[36px] flex items-center ${
                isSelected
                  ? 'bg-[#121212] dark:bg-[#FA541C] text-[#D4FF00] dark:text-black shadow-[0_2px_0_0_#121212]'
                  : 'bg-white dark:bg-[#231A0F] text-black dark:text-[#F5EEE6] hover:bg-[#D4FF00] dark:hover:bg-[#3A2410]'
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
        <div className="bg-white dark:bg-[#231A0F] border-2 border-black dark:border-[#5A3A1A] rounded-3xl p-6 sm:p-8 text-center my-6 max-w-md mx-auto shadow-[0_8px_0_0_#121212]">
          <Info size={32} className="text-black dark:text-[#F5EEE6] mx-auto mb-2" />
          <h4 className="font-['Syne'] font-extrabold text-base sm:text-lg text-black dark:text-[#F5EEE6]">
            No flashcards in this category
          </h4>
          <p className="text-xs text-black/70 dark:text-[#F5EEE6]/70 mt-1">
            Try switching categories or view all cards for {locality}.
          </p>
          <div className="mt-5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategory('All')}
              className="bg-black dark:bg-[#FA541C] text-white dark:text-black hover:bg-[#D4FF00] dark:hover:bg-[#D4FF00] font-bold border-2 border-black dark:border-[#5A3A1A]"
            >
              Show All Categories
            </Button>
          </div>
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="space-y-3 sm:space-y-4">
          {/* Progress Bar & Interaction Hint */}
          <div className="max-w-2xl mx-auto flex items-center justify-between text-xs font-mono font-bold text-black dark:text-[#F5EEE6] px-1 sm:px-2">
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 px-2 sm:px-2.5 py-1 rounded-full border border-black/20 dark:border-white/20">
              <MousePointer size={11} className="text-black dark:text-[#F5EEE6]" />
              <span className="text-[10px] sm:text-[11px] truncate">SWIPE / SCROLL FLIPS CARDS</span>
            </div>
            <div className="bg-black dark:bg-[#231A0F] text-white dark:text-[#F5EEE6] border border-transparent dark:border-[#5A3A1A] px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] shrink-0">
              <span className="text-[#D4FF00]">{currentIndex + 1}</span> / {filteredCards.length}
            </div>
          </div>

          <div className="max-w-2xl mx-auto h-1.5 bg-black/15 dark:bg-white/15 rounded-full overflow-hidden border border-black/20 dark:border-white/20">
            <div
              className="h-full bg-black dark:bg-[#FA541C] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Card Container with Native Wheel & Touch Listener */}
          <div
            ref={deckContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="max-w-2xl mx-auto w-full focus:outline-none cursor-ns-resize overscroll-contain"
            tabIndex={0}
            role="region"
            aria-label="Civic Flashcard Deck"
          >
            {currentCard && <FlashcardCard card={currentCard} />}
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between gap-2.5 max-w-2xl mx-auto pt-1 sm:pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              icon={<ChevronLeft size={18} />}
              aria-label="Previous flashcard"
              className="flex-1 sm:flex-none justify-center bg-white dark:bg-[#231A0F] hover:bg-black dark:hover:bg-[#FA541C] text-black dark:text-[#F5EEE6] hover:text-white dark:hover:text-black border-2 border-black dark:border-[#5A3A1A] font-black shadow-[0_3px_0_0_#121212] py-2.5 min-h-[44px]"
            >
              Previous
            </Button>

            {/* Position Dots on Tablet/Desktop */}
            <div className="hidden sm:flex items-center gap-1.5">
              {filteredCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-black dark:bg-[#FA541C]'
                      : 'w-2.5 bg-black/25 dark:bg-white/25 hover:bg-black/50 dark:hover:bg-white/50'
                  }`}
                  aria-label={`Jump to card ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              icon={<ChevronRight size={18} />}
              iconPosition="right"
              aria-label="Next flashcard"
              className="flex-1 sm:flex-none justify-center bg-white dark:bg-[#231A0F] hover:bg-black dark:hover:bg-[#FA541C] text-black dark:text-[#F5EEE6] hover:text-white dark:hover:text-black border-2 border-black dark:border-[#5A3A1A] font-black shadow-[0_3px_0_0_#121212] py-2.5 min-h-[44px]"
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
