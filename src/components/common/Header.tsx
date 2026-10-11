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
    <header className="border-b-2 border-black bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
      {/* Brand mobile & Locality Selector */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black text-[#D4FF00] flex items-center justify-center border-2 border-black">
            <Compass size={18} />
          </div>
          <span className="font-['Syne'] text-xl font-black text-black">CivicLens</span>
        </div>

        {/* Locality badge button */}
        <button
          onClick={onOpenLocalityModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF2E8] hover:bg-[#FA541C] hover:text-white border-2 border-black text-black text-xs font-black transition-all cursor-pointer shadow-[0_2px_0_0_#121212] group"
          aria-label={`Change locality, currently set to ${locality}`}
        >
          <MapPin size={14} className="text-[#FA541C] group-hover:text-white transition-colors" />
          <span>Locality: <span className="underline decoration-2 underline-offset-2">{locality}</span></span>
        </button>

        {/* Last updated indicator */}
        {lastUpdated && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-black/70 border-l-2 border-black/10 pl-3">
            <Clock size={12} />
            <span>Updated: <strong>{lastUpdated}</strong></span>
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
            icon={<Sparkles size={15} className="text-black" />}
            className="bg-[#D4FF00] hover:bg-black hover:text-[#D4FF00] text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-[0_3px_0_0_#121212]"
          >
            Create Flashcards
          </Button>
        </div>
      )}
    </header>
  );
};
