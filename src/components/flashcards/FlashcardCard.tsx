import React, { useState } from 'react';
import { ExternalLink, Calendar, Building2, MapPin, CheckCircle2, AlertCircle, ImageOff } from 'lucide-react';
import { CivicFlashcard } from '../../types/flashcard';
import { Badge } from '../common/Badge';

interface FlashcardCardProps {
  card: CivicFlashcard;
  isCompact?: boolean;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  isCompact = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = card.publishedAt
    ? new Date(card.publishedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article
      className={`relative rounded-3xl overflow-hidden border-2 border-black bg-black shadow-[0_12px_0_0_#121212] select-none transition-all group ${
        isCompact
          ? 'h-[390px] sm:h-[420px] flex flex-col justify-end'
          : 'h-[460px] sm:h-[520px] md:h-[560px] max-w-2xl mx-auto flex flex-col justify-end'
      }`}
      aria-label={card.headline}
    >
      {/* Immersive Photo Background Filling the Entire Card */}
      <div className="absolute inset-0 w-full h-full">
        {card.thumbnailUrl && !imageError ? (
          <img
            src={card.thumbnailUrl}
            alt={card.headline}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#E03E0B] via-[#FA541C] to-[#121212] p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2">
              <ImageOff size={28} />
            </div>
            <span className="font-['Syne'] text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              {card.category}
            </span>
          </div>
        )}

        {/* Cinematic Gradient Scrim for Guaranteed High Text Contrast */}
        <div className="absolute inset-0 scrim-gradient-full" />
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-6 right-3.5 sm:right-6 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          <Badge variant="category" category={card.category} className="shadow-md text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">
            {card.category}
          </Badge>
          {card.isDemoContent && (
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white/80 border border-white/20 backdrop-blur-md shrink-0">
              DEMO
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-white shadow-md shrink-0">
          <MapPin size={12} className="text-[#D4FF00]" />
          <span className="truncate max-w-[90px] sm:max-w-none">{card.locality}</span>
        </div>
      </div>

      {/* Overlay Content Stack Layered Directly Over Photograph */}
      <div className="relative z-10 p-4 sm:p-7 md:p-8 flex flex-col justify-end space-y-2 sm:space-y-3">
        {/* Headline */}
        <h3
          className={`font-['Syne'] font-extrabold text-white leading-tight tracking-tight drop-shadow-sm ${
            isCompact ? 'text-base sm:text-xl line-clamp-2' : 'text-lg sm:text-2xl md:text-3xl line-clamp-2 sm:line-clamp-3'
          }`}
        >
          {card.headline}
        </h3>

        {/* Short factual description / Key Verified Points */}
        <div className="space-y-1">
          <ul className="space-y-1 sm:space-y-1.5">
            {card.keyPoints.slice(0, isCompact ? 1 : 2).map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-white/95 leading-relaxed drop-shadow-xs"
              >
                <CheckCircle2
                  size={14}
                  className="text-[#D4FF00] shrink-0 mt-0.5"
                />
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Civic Impact Badge / Assessment */}
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start gap-1.5 sm:gap-2">
          <AlertCircle size={14} className="text-[#D4FF00] shrink-0 mt-0.5" />
          <p className="text-[10px] sm:text-xs text-white/90 leading-snug line-clamp-2">
            <strong className="text-[#D4FF00] uppercase font-bold text-[9px] sm:text-[10px] block mb-0.5">
              Civic Impact
            </strong>
            {card.impactAssessment}
          </p>
        </div>

        {/* Footer Meta: Publisher, Date, and Original Source Link */}
        <div className="pt-1.5 sm:pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 min-w-0">
            <Building2 size={13} className="text-[#D4FF00] shrink-0" />
            <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-[200px] text-[11px] sm:text-xs">
              {card.sourceName}
            </span>
            {formattedDate && (
              <span className="text-white/70 text-[10px] sm:text-[11px] hidden sm:flex items-center gap-1">
                <Calendar size={11} className="inline" />
                {formattedDate}
              </span>
            )}
          </div>

          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white text-black hover:bg-[#D4FF00] font-bold text-[11px] sm:text-xs transition-colors shadow-md shrink-0 cursor-pointer"
            aria-label={`Open source notice for ${card.headline}`}
          >
            <span>View Source</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
};
