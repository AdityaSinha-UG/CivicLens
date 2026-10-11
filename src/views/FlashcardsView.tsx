import React from 'react';
import { CivicFlashcard } from '../types/flashcard';
import { FlashcardViewer } from '../components/flashcards/FlashcardViewer';
import { BookOpen } from 'lucide-react';

interface FlashcardsViewProps {
  cards: CivicFlashcard[];
  locality: string;
  onReturnToFeed: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  locality,
  onReturnToFeed,
}) => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="pb-4 border-b-2 border-black/15">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black text-[#D4FF00]">
            <BookOpen size={13} />
            <span>FLASHCARD DECK</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-black/80">
            {locality}
          </span>
        </div>
        <h1 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mt-2">
          Civic Cards: {locality}
        </h1>
        <p className="text-xs sm:text-sm text-black/85 font-medium mt-1">
          Full-bleed photographic cards designed for quick community awareness, key verified points, and civic impact.
        </p>
      </div>

      {/* Main Flashcard Viewer & Interactions */}
      <FlashcardViewer
        cards={cards}
        locality={locality}
        onReturnToFeed={onReturnToFeed}
      />
    </div>
  );
};
