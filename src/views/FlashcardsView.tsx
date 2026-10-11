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
      <div className="pb-4 border-b border-[#E5D3C2]">
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#315B48]">
          <BookOpen size={14} />
          <span>Quick Civic Knowledge</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292923] mt-0.5">
          Civic Flashcards: {locality}
        </h1>
        <p className="text-xs sm:text-sm text-[#615E52] mt-1">
          Bite-sized, categorized civic notices designed for rapid community awareness and daily briefing.
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
