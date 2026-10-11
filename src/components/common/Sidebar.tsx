import React from 'react';
import { Newspaper, BookOpen, User, MapPin, Compass } from 'lucide-react';

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
      className="hidden md:flex flex-col w-68 shrink-0 bg-white border-r-2 border-black min-h-screen p-6 select-none sticky top-0 h-screen shadow-[4px_0_0_0_rgba(0,0,0,0.06)]"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="pb-6 border-b-2 border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-[#D4FF00] flex items-center justify-center border-2 border-black shadow-[0_4px_0_0_#121212]">
            <Compass size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-['Syne'] text-2xl font-black tracking-tight text-black block leading-none">
              CivicLens
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#FA541C] font-black mt-1 block">
              Hyperlocal Media
            </span>
          </div>
        </div>

        {/* Selected Locality indicator */}
        <div className="mt-6 p-3 rounded-2xl bg-[#FFF2E8] border-2 border-black flex items-center justify-between shadow-[0_3px_0_0_#121212]">
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className="text-[#FA541C] shrink-0" />
            <div className="truncate">
              <span className="text-[9px] text-black/60 uppercase font-black block leading-none">
                Active Locality
              </span>
              <span className="text-sm font-extrabold text-black truncate block mt-0.5">
                {locality || 'Pune'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenLocalityModal}
            className="text-[11px] font-black text-black hover:text-[#FA541C] underline decoration-2 uppercase px-1.5 py-0.5 cursor-pointer"
            title="Change active locality"
          >
            Change
          </button>
        </div>
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
                  ? 'bg-black text-[#D4FF00] border-black shadow-[0_5px_0_0_#121212] font-black'
                  : 'bg-white text-black hover:bg-[#FFF2E8] border-transparent hover:border-black font-bold'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`shrink-0 ${
                  isActive ? 'text-[#D4FF00]' : 'text-black'
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
                    isActive ? 'text-white/70' : 'text-black/60'
                  }`}
                >
                  {item.description}
                </span>
              </div>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[#D4FF00] shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Badge */}
      <div className="pt-4 border-t-2 border-black/10 text-xs text-black/70 space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] font-black">
          <span className="bg-[#FFF2E8] text-[#FA541C] px-2 py-0.5 rounded border border-black/20">
            GEN Z EDITION
          </span>
          <span className="text-black font-extrabold">PHASE 1</span>
        </div>
        <p className="text-[11px] leading-snug font-medium text-black/60">
          Deterministic local news discovery • SerpApi ready
        </p>
      </div>
    </aside>
  );
};
