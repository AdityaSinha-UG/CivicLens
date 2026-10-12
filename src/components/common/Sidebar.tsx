import React from 'react';
import { Newspaper, BookOpen, User, MapPin, Compass, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type NavTab = 'main' | 'flashcards' | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  locality: string;
  onOpenLocalityModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  locality,
  onOpenLocalityModal,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    {
      id: 'main' as NavTab,
      label: 'Local News Feed',
      description: 'Hyperlocal discovery',
      icon: <Newspaper size={19} />,
    },
    {
      id: 'flashcards' as NavTab,
      label: 'Civic Flashcards',
      description: 'Image deck & highlights',
      icon: <BookOpen size={19} />,
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile & Locality',
      description: 'Preferences & PIN',
      icon: <User size={19} />,
    },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-68 shrink-0 bg-white dark:bg-[#18110A] border-r-2 border-black dark:border-[#5A3A1A] min-h-screen p-6 select-none sticky top-0 h-screen shadow-[4px_0_0_0_rgba(0,0,0,0.06)] dark:shadow-[4px_0_0_0_rgba(0,0,0,0.4)]"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="pb-6 border-b-2 border-black/10 dark:border-[#5A3A1A]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black flex items-center justify-center border-2 border-black dark:border-[#FA541C] shadow-[0_4px_0_0_#121212]">
            <Compass size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-['Syne'] text-2xl font-black tracking-tight text-black dark:text-[#F5EEE6] block leading-none">
              CivicLens
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#FA541C] font-black mt-1 block">
              Hyperlocal Media
            </span>
          </div>
        </div>

        {/* Active Locality — click to open Location Picker */}
        <button
          onClick={onOpenLocalityModal}
          title="Change location for news"
          className="mt-6 w-full p-3 rounded-2xl bg-[#FFF2E8] dark:bg-[#2E1F0D] border-2 border-black dark:border-[#5A3A1A] flex items-center justify-between shadow-[0_3px_0_0_#121212] hover:border-[#FA541C] hover:shadow-[0_3px_0_0_#FA541C] transition-all group cursor-pointer"
          aria-label={`Active location: ${locality || 'Pune'}. Click to change.`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className="text-[#FA541C] shrink-0" />
            <div className="truncate text-left">
              <span className="text-[9px] text-black/60 dark:text-[#F5EEE6]/50 uppercase font-black block leading-none">
                Active Location
              </span>
              <span className="text-sm font-extrabold text-black dark:text-[#F5EEE6] truncate block mt-0.5">
                {locality || 'Pune'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-black text-black/40 dark:text-[#F5EEE6]/40 group-hover:text-[#FA541C] uppercase tracking-wider shrink-0 ml-1 transition-colors">
            Change
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="mt-6 flex-1 space-y-2" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                isActive
                  ? 'bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black border-black dark:border-[#FA541C] shadow-[0_5px_0_0_#121212] font-black'
                  : 'bg-white dark:bg-[#231A0F] text-black dark:text-[#F5EEE6] hover:bg-[#FFF2E8] dark:hover:bg-[#2E1F0D] border-transparent hover:border-black dark:hover:border-[#5A3A1A] font-bold'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`shrink-0 ${
                  isActive ? 'text-[#D4FF00] dark:text-black' : 'text-black dark:text-[#F5EEE6]'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 truncate">
                <span className="text-sm font-black block leading-tight">
                  {item.label}
                </span>
                <span
                  className={`text-[11px] block mt-0.5 truncate font-normal ${
                    isActive ? 'text-white/70 dark:text-black/70' : 'text-black/60 dark:text-[#F5EEE6]/50'
                  }`}
                >
                  {item.description}
                </span>
              </div>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[#D4FF00] dark:bg-black shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Theme Toggle + Info */}
      <div className="pt-4 border-t-2 border-black/10 dark:border-[#5A3A1A]/50 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFF2E8] dark:bg-[#2E1F0D] border-2 border-black dark:border-[#5A3A1A] text-black dark:text-[#F5EEE6] hover:bg-[#FA541C] dark:hover:bg-[#FA541C] hover:text-white dark:hover:text-black transition-all cursor-pointer group"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="text-[11px] font-black uppercase tracking-wider">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
          <div className="relative w-8 h-4 flex items-center">
            {isDark ? (
              <Sun size={16} className="text-[#FA541C] group-hover:text-black transition-colors" />
            ) : (
              <Moon size={16} className="text-black/70 group-hover:text-white transition-colors" />
            )}
          </div>
        </button>

        <div className="flex items-center justify-between font-mono text-[10px] font-black">
          <span className="bg-[#FFF2E8] dark:bg-[#2E1F0D] text-[#FA541C] px-2 py-0.5 rounded border border-black/20 dark:border-[#5A3A1A]">
            GEN Z EDITION
          </span>
          <span className="text-black dark:text-[#F5EEE6] font-extrabold">PHASE 1</span>
        </div>
        <p className="text-[11px] leading-snug font-medium text-black/60 dark:text-[#F5EEE6]/45">
          Deterministic local news discovery • SerpApi ready
        </p>
      </div>
    </aside>
  );
};
