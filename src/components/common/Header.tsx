import React from 'react';
import { MapPin, Sparkles, Clock, Compass } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  locality: string;
  lastUpdated: string;
  onOpenLocalityModal: () => void;
  onCreateFlashcards: () => void;
  showFlashcardAction?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  locality,
  lastUpdated,
  onOpenLocalityModal,
  onCreateFlashcards,
  showFlashcardAction = true,
}) => {
  return (
    <header className="border-b border-[#E5D3C2] bg-[#FFF9F4]/90 backdrop-blur-xs sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand mobile & Locality Selector */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#315B48] flex items-center justify-center text-white">
            <Compass size={18} />
          </div>
          <span className="font-serif text-lg font-bold text-[#292923]">CivicLens</span>
        </div>

        {/* Locality badge button */}
        <button
          onClick={onOpenLocalityModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EAE0] hover:bg-[#EFE1D4] border border-[#E5D3C2] text-[#292923] text-xs font-semibold transition-colors cursor-pointer group"
          aria-label={`Change locality, currently set to ${locality}`}
        >
          <MapPin size={14} className="text-[#315B48] group-hover:scale-110 transition-transform" />
          <span>Locality: <span className="text-[#315B48] underline underline-offset-2">{locality}</span></span>
        </button>

        {/* Last updated indicator */}
        {lastUpdated && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#615E52] border-l border-[#E5D3C2] pl-3">
            <Clock size={12} className="text-[#827E70]" />
            <span>Updated: <strong className="font-medium text-[#292923]">{lastUpdated}</strong></span>
          </div>
        )}
      </div>

      {/* Prominent Action Button: Create Flashcards */}
      {showFlashcardAction && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCreateFlashcards}
            icon={<Sparkles size={15} className="text-[#292923]" />}
            className="shadow-xs font-semibold"
          >
            Create Flashcards
          </Button>
        </div>
      )}
    </header>
  );
};
