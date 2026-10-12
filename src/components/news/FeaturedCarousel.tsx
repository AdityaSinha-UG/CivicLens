import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Building2,
  Radio,
  ImageOff
} from 'lucide-react';
import { NewsArticle } from '../../types/news';
import { Badge } from '../common/Badge';

interface FeaturedCarouselProps {
  articles: NewsArticle[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ articles }) => {
  // Take the top 5 to 6 most important local stories
  const featuredStories = articles.slice(0, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Keep index within bounds if articles array changes
    if (currentIndex >= featuredStories.length && featuredStories.length > 0) {
      setCurrentIndex(0);
    }
  }, [featuredStories.length, currentIndex]);

  if (featuredStories.length === 0) return null;

  const currentArticle = featuredStories[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredStories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredStories.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Gesture Support for Mobile
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

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    touchStartCoords.current = null;
  };

  const formattedDate = currentArticle.publishedAt
    ? new Date(currentArticle.publishedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const hasImageError = Boolean(imageErrors[currentArticle.id]);

  return (
    <section
      className="relative mb-6 sm:mb-8 rounded-3xl overflow-hidden border-2 border-black bg-black shadow-[0_12px_0_0_#121212] select-none group touch-pan-y"
      aria-label="Featured Local Civic Stories"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Immersive Photo Background */}
      <div className="relative w-full h-[410px] sm:h-[480px] md:h-[520px] overflow-hidden bg-[#18181B]">
        {currentArticle.thumbnailUrl && !hasImageError ? (
          <img
            src={currentArticle.thumbnailUrl}
            alt={currentArticle.headline}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() =>
              setImageErrors((prev) => ({ ...prev, [currentArticle.id]: true }))
            }
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#E03E0B] via-[#FA541C] to-[#121212] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3">
              <ImageOff size={32} />
            </div>
            <span className="font-['Syne'] text-xl font-bold text-white tracking-wide uppercase">
              {currentArticle.category}
            </span>
            <span className="text-xs text-white/70 mt-1">
              Civic Dispatch • {currentArticle.locality}
            </span>
          </div>
        )}

        {/* Cinematic Scrim Gradient Overlay for Superior Text Contrast */}
        <div className="absolute inset-0 scrim-gradient-full" />

        {/* Top Badges & Live Ticker Bar */}
        <div className="absolute top-3.5 sm:top-6 left-3.5 sm:left-6 right-3.5 sm:right-6 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#D4FF00] text-black shadow-md shrink-0">
              <Radio size={12} className="animate-pulse" />
              <span>TOP STORY</span>
            </span>
            <Badge variant="category" category={currentArticle.category} className="shadow-md truncate max-w-[120px] sm:max-w-none text-[10px] sm:text-xs">
              {currentArticle.category}
            </Badge>
          </div>

          {/* Position Indicator Badge: e.g. 1 / 6 */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold text-white shadow-md shrink-0">
            <span className="text-[#D4FF00]">{currentIndex + 1}</span>
            <span className="text-white/50">/</span>
            <span>{featuredStories.length}</span>
          </div>
        </div>

        {/* Bottom Content Layer Overlaid Directly on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10 z-10 flex flex-col justify-end">
          <div className="max-w-3xl space-y-2 sm:space-y-3">
            {/* Headline */}
            <h2 className="font-['Syne'] text-lg sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm line-clamp-3 sm:line-clamp-none">
              {currentArticle.headline.replace(/^\[Demo\]\s*/i, '')}
            </h2>

            {/* Short Factual Description */}
            <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 max-w-2xl">
              {currentArticle.factualDescription}
            </p>

            {/* Meta & Actions Row */}
            <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 sm:gap-3 text-white/80 min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <Building2 size={13} className="text-[#D4FF00] shrink-0" />
                  <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-[200px] text-[11px] sm:text-xs">
                    {currentArticle.source.name}
                  </span>
                </div>

                {formattedDate && (
                  <div className="hidden xs:flex items-center gap-1.5 text-white/70 border-l border-white/20 pl-2 sm:pl-3 text-[11px] sm:text-xs shrink-0">
                    <Calendar size={12} />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Clickable Original Article Link */}
              <a
                href={currentArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-black hover:bg-[#D4FF00] font-bold text-[11px] sm:text-xs transition-colors shadow-md shrink-0 cursor-pointer"
                aria-label={`Read original article: ${currentArticle.headline}`}
              >
                <span>Read Original</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Navigation Controls & Pip Indicators */}
          <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/15 flex items-center justify-between">
            {/* Slide Pip Indicators */}
            <div className="flex items-center gap-1.5">
              {featuredStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-5 sm:w-7 bg-[#D4FF00]'
                      : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Previous and Next Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous story"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next story"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
