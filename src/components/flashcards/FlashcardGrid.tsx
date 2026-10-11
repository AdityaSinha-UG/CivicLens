import React from 'react';
import { CivicFlashcard } from '../../types/flashcard';
import { FlashcardCard } from './FlashcardCard';

interface FlashcardGridProps {
  cards: CivicFlashcard[];
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {cards.map((card) => (
        <FlashcardCard key={card.id} card={card} isCompact={true} />
      ))}
    </div>
  );
};
