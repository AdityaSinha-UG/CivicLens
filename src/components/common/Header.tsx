import React from 'react';
import { MapPin, Sparkles, Clock, Compass, Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="border-b-2 border-black dark:border-[#5A3A1A] bg-white/95 dark:bg-[#18110A]/96 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)]">
      {/* Brand mobile & Locality Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="md:hidden flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black flex items-center justify-center border-2 border-black dark:border-[#FA541C]">
            <Compass size={16} />
          </div>
          <span className="font-['Syne'] text-base sm:text-xl font-black text-black dark:text-[#F5EEE6]">CivicLens</span>
        </div>

        {/* Locality badge button */}
        <button
          onClick={onOpenLocalityModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FFF2E8] dark:bg-[#2E1F0D] hover:bg-[#FA541C] dark:hover:bg-[#FA541C] hover:text-white border-2 border-black dark:border-[#5A3A1A] text-black dark:text-[#F5EEE6] text-[11px] sm:text-xs font-black transition-all cursor-pointer shadow-[0_2px_0_0_#121212] group max-w-[130px] sm:max-w-[220px]"
          aria-label={`Change locality, currently set to ${locality}`}
        >
          <MapPin size={13} className="text-[#FA541C] group-hover:text-white transition-colors shrink-0" />
          <span className="truncate">
            <span className="underline decoration-2 underline-offset-2">{locality}</span>
          </span>
        </button>

        {/* Last updated indicator */}
        {lastUpdated && (
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono font-bold text-black/70 dark:text-[#F5EEE6]/50 border-l-2 border-black/10 dark:border-[#5A3A1A]/50 pl-3">
            <Clock size={12} />
            <span>Updated: <strong>{lastUpdated}</strong></span>
          </div>
        )}
      </div>

      {/* Right side: Flashcard action + Mobile theme toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {showFlashcardAction && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onCreateFlashcards}
            icon={<Sparkles size={14} className="text-black" />}
            title="Create Flashcards from today's stories"
            aria-label="Create Flashcards"
            className="bg-[#D4FF00] hover:bg-black hover:text-[#D4FF00] text-black font-black uppercase text-[11px] sm:text-xs tracking-wider border-2 border-black shadow-[0_2px_0_0_#121212] px-2.5 sm:px-3 py-1.5"
          >
            <span className="hidden sm:inline">Create Flashcards</span>
            <span className="sm:hidden font-mono text-[10px]">Cards</span>
          </Button>
        )}

        {/* Mobile theme toggle (md:hidden — desktop uses the sidebar toggle) */}
        <button
          onClick={toggleTheme}
          className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#FFF2E8] dark:bg-[#2E1F0D] border-2 border-black dark:border-[#5A3A1A] text-black dark:text-[#F5EEE6] hover:bg-[#FA541C] dark:hover:bg-[#FA541C] hover:text-white dark:hover:text-black transition-all cursor-pointer"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
