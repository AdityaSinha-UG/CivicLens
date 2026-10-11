import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  ArrowLeft,
  Tag,
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
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
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

  // Controlled Mouse-Wheel and Trackpad navigation with debounce lockout
  const wheelLockRef = useRef<boolean>(false);
  const wheelTimeoutRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'carousel') return;
    if (wheelLockRef.current) return;

    // Check vertical or horizontal trackpad delta
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    if (Math.abs(delta) > 30) {
      if (delta > 0 && currentIndex < filteredCards.length - 1) {
        wheelLockRef.current = true;
        handleNext();
      } else if (delta < 0 && currentIndex > 0) {
        wheelLockRef.current = true;
        handlePrev();
      }

      // Lock out wheel triggers for 450ms to prevent skipping multiple cards
      if (wheelLockRef.current) {
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = window.setTimeout(() => {
          wheelLockRef.current = false;
        }, 450);
      }
    }
  };

  const currentCard = filteredCards[currentIndex];
  const progressPercent = filteredCards.length > 0
    ? ((currentIndex + 1) / filteredCards.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls: Return to Feed & View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black/15">
        <Button
          variant="outline"
          size="sm"
          onClick={onReturnToFeed}
          icon={<ArrowLeft size={16} />}
          className="bg-white hover:bg-[#121212] hover:text-white border-2 border-black font-bold shadow-[0_4px_0_0_#121212]"
        >
          Back to Feed
        </Button>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-black/10 p-1 rounded-2xl border-2 border-black">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'text-black hover:bg-black/10'
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
                ? 'bg-[#121212] text-white shadow-sm'
                : 'text-black hover:bg-black/10'
            }`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={13} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-black text-black uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Tag size={13} />
          Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border-2 border-black ${
                isSelected
                  ? 'bg-[#121212] text-[#D4FF00] shadow-[0_3px_0_0_#121212]'
                  : 'bg-white text-black hover:bg-[#D4FF00]'
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
        <div className="bg-white border-2 border-black rounded-3xl p-8 text-center my-6 max-w-md mx-auto shadow-[0_8px_0_0_#121212]">
          <Info size={32} className="text-black mx-auto mb-2" />
          <h4 className="font-['Syne'] font-extrabold text-lg text-black">
            No flashcards in this category
          </h4>
          <p className="text-xs text-black/70 mt-1">
            Try switching categories or view all cards for {locality}.
          </p>
          <div className="mt-5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategory('All')}
              className="bg-black text-white hover:bg-[#D4FF00] hover:text-black font-bold"
            >
              Show All Categories
            </Button>
          </div>
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="space-y-4">
          {/* Progress Bar Header */}
          <div className="max-w-2xl mx-auto flex items-center justify-between text-xs font-mono font-bold text-black px-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
              <span>SWIPE / SCROLL TO BROWSE</span>
            </div>
            <div className="bg-black text-white px-2.5 py-0.5 rounded-full text-[11px]">
              <span className="text-[#D4FF00]">{currentIndex + 1}</span> / {filteredCards.length}
            </div>
          </div>

          <div className="max-w-2xl mx-auto h-1.5 bg-black/15 rounded-full overflow-hidden border border-black/20">
            <div
              className="h-full bg-black transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Card Container with Wheel and Touch Listeners */}
          <div
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="focus:outline-none"
            tabIndex={0}
            role="region"
            aria-label="Civic Flashcard Deck"
          >
            {currentCard && <FlashcardCard card={currentCard} />}
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              icon={<ChevronLeft size={18} />}
              aria-label="Previous flashcard"
              className="bg-white hover:bg-black hover:text-white border-2 border-black font-black shadow-[0_4px_0_0_#121212]"
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
                      ? 'w-7 bg-black'
                      : 'w-2.5 bg-black/25 hover:bg-black/50'
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
              className="bg-white hover:bg-black hover:text-white border-2 border-black font-black shadow-[0_4px_0_0_#121212]"
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
