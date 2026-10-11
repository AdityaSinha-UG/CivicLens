import React, { useState, useEffect } from 'react';
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
      className="relative mb-8 rounded-3xl overflow-hidden border-2 border-black bg-black shadow-[0_12px_0_0_#121212] select-none group"
      aria-label="Featured Local Civic Stories"
    >
      {/* Immersive Photo Background */}
      <div className="relative w-full h-[440px] sm:h-[480px] md:h-[520px] overflow-hidden bg-[#18181B]">
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
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#D4FF00] text-black shadow-md">
              <Radio size={13} className="animate-pulse" />
              <span>TOP STORY</span>
            </span>
            <Badge variant="category" category={currentArticle.category} className="shadow-md">
              {currentArticle.category}
            </Badge>
          </div>

          {/* Position Indicator Badge: e.g. 1 / 6 */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-mono font-bold text-white shadow-md">
            <span className="text-[#D4FF00]">{currentIndex + 1}</span>
            <span className="text-white/50">/</span>
            <span>{featuredStories.length}</span>
          </div>
        </div>

        {/* Bottom Content Layer Overlaid Directly on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 z-10 flex flex-col justify-end">
          <div className="max-w-3xl space-y-3">
            {/* Headline */}
            <h2 className="font-['Syne'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
              {currentArticle.headline.replace(/^\[Demo\]\s*/i, '')}
            </h2>

            {/* Short Factual Description */}
            <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 max-w-2xl">
              {currentArticle.factualDescription}
            </p>

            {/* Meta & Actions Row */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-white/80">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#D4FF00]" />
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {currentArticle.source.name}
                  </span>
                </div>

                {formattedDate && (
                  <div className="flex items-center gap-1.5 text-white/70 border-l border-white/20 pl-3">
                    <Calendar size={13} />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Clickable Original Article Link */}
              <a
                href={currentArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-[#D4FF00] font-bold text-xs transition-colors shadow-md"
                aria-label={`Read original article: ${currentArticle.headline}`}
              >
                <span>Read Original Article</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Navigation Controls & Pip Indicators */}
          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            {/* Slide Pip Indicators */}
            <div className="flex items-center gap-1.5">
              {featuredStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-[#D4FF00]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Previous and Next Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous story"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next story"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
