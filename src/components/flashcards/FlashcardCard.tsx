import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';
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
  return (
    <div
      className={`bg-[#FFF9F4] border border-[#E5D3C2] rounded-2xl shadow-card transition-all flex flex-col justify-between ${
        isCompact ? 'p-5' : 'p-6 sm:p-8 max-w-2xl mx-auto min-h-[380px]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5D3C2]">
          <div className="flex items-center gap-2">
            <Badge variant="category" category={card.category}>
              {card.category}
            </Badge>
            {card.isDemoContent && (
              <Badge variant="demo">Demo Card</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#615E52] font-medium">
            <MapPin size={13} className="text-[#315B48]" />
            <span>{card.locality}</span>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-4">
          <h3
            className={`font-serif font-bold text-[#292923] leading-snug ${
              isCompact ? 'text-base sm:text-lg mb-3' : 'text-xl sm:text-2xl mb-4'
            }`}
          >
            {card.headline}
          </h3>
        </div>

        {/* Key Points - Deterministic Extraction */}
        <div className="space-y-2 mt-3">
          <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#827E70]">
            Key Verified Points
          </h4>
          <ul className="space-y-2">
            {card.keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs sm:text-sm text-[#292923] leading-relaxed"
              >
                <CheckCircle2
                  size={16}
                  className="text-[#315B48] shrink-0 mt-0.5"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Civic Impact Section */}
        <div className="mt-5 p-3 sm:p-3.5 rounded-xl bg-[#F8EFE5] border border-[#E5D3C2] flex items-start gap-2.5">
          <AlertCircle size={17} className="text-[#8C6415] shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] uppercase font-bold text-[#8C6415] block tracking-wide">
              Civic Impact Summary
            </span>
            <p className="text-xs sm:text-sm text-[#4A473D] mt-0.5 leading-relaxed font-medium">
              {card.impactAssessment}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Source attribution & Direct Link */}
      <div className="mt-6 pt-4 border-t border-[#E5D3C2] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#615E52] truncate">
          <Building2 size={13} className="text-[#315B48] shrink-0" />
          <span className="truncate max-w-[170px] sm:max-w-[240px]">
            {card.sourceName}
          </span>
        </div>

        <a
          href={card.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#315B48] hover:text-[#244637] hover:underline transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#315B48] rounded px-1 py-0.5"
          aria-label={`Open source notice for ${card.headline}`}
        >
          <span>View Source</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
