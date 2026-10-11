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
          ? 'h-[420px] flex flex-col justify-end'
          : 'h-[500px] sm:h-[540px] md:h-[560px] max-w-2xl mx-auto flex flex-col justify-end'
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#E03E0B] via-[#FA541C] to-[#121212] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2">
              <ImageOff size={32} />
            </div>
            <span className="font-['Syne'] text-lg font-bold text-white tracking-wide uppercase">
              {card.category}
            </span>
          </div>
        )}

        {/* Cinematic Gradient Scrim for Guaranteed High Text Contrast */}
        <div className="absolute inset-0 scrim-gradient-full" />
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="category" category={card.category} className="shadow-md">
            {card.category}
          </Badge>
          {card.isDemoContent && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white/80 border border-white/20 backdrop-blur-md">
              DEMO RECORD
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md">
          <MapPin size={13} className="text-[#D4FF00]" />
          <span>{card.locality}</span>
        </div>
      </div>

      {/* Overlay Content Stack Layered Directly Over Photograph */}
      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col justify-end space-y-3">
        {/* Headline */}
        <h3
          className={`font-['Syne'] font-extrabold text-white leading-tight tracking-tight drop-shadow-sm ${
            isCompact ? 'text-lg sm:text-xl line-clamp-2' : 'text-xl sm:text-2xl md:text-3xl'
          }`}
        >
          {card.headline}
        </h3>

        {/* Short factual description / Key Verified Points */}
        <div className="space-y-1.5">
          <ul className="space-y-1.5">
            {card.keyPoints.slice(0, isCompact ? 1 : 2).map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-xs"
              >
                <CheckCircle2
                  size={15}
                  className="text-[#D4FF00] shrink-0 mt-0.5"
                />
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Civic Impact Badge / Assessment */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start gap-2">
          <AlertCircle size={15} className="text-[#D4FF00] shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-white/90 leading-snug line-clamp-2">
            <strong className="text-[#D4FF00] uppercase font-bold text-[10px] block mb-0.5">
              Civic Impact
            </strong>
            {card.impactAssessment}
          </p>
        </div>

        {/* Footer Meta: Publisher, Date, and Original Source Link */}
        <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Building2 size={13} className="text-[#D4FF00] shrink-0" />
            <span className="font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]">
              {card.sourceName}
            </span>
            {formattedDate && (
              <span className="text-white/70 text-[11px] hidden sm:flex items-center gap-1">
                <Calendar size={11} className="inline" />
                {formattedDate}
              </span>
            )}
          </div>

          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black hover:bg-[#D4FF00] font-bold text-xs transition-colors shadow-md shrink-0 cursor-pointer"
            aria-label={`Open source notice for ${card.headline}`}
          >
            <span>View Source</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  );
};
