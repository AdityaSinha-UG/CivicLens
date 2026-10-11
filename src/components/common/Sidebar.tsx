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
      description: 'Categorized summaries',
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
      className="hidden md:flex flex-col w-64 shrink-0 bg-[#FFF9F4] border-r border-[#E5D3C2] min-h-screen p-5 select-none sticky top-0 h-screen"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="pb-6 border-b border-[#E5D3C2]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#315B48] flex items-center justify-center text-white shadow-xs">
            <Compass size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#292923] block leading-none">
              CivicLens
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#615E52] font-semibold mt-1 block">
              Hyperlocal Discovery
            </span>
          </div>
        </div>

        {/* Selected Locality indicator */}
        <div className="mt-5 p-2.5 rounded-lg bg-[#F8EFE5] border border-[#E5D3C2] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className="text-[#315B48] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#615E52] uppercase font-bold block leading-none">
                Active Locality
              </span>
              <span className="text-sm font-semibold text-[#292923] truncate block mt-0.5">
                {locality || 'Pune'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenLocalityModal}
            className="text-xs text-[#315B48] hover:text-[#244637] font-semibold hover:underline px-1 py-0.5 cursor-pointer"
            title="Change active locality"
          >
            Change
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="mt-6 flex-1 space-y-1.5" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#315B48] text-white shadow-xs'
                  : 'text-[#292923] hover:bg-[#F6EDE4] text-[#615E52]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`shrink-0 ${
                  isActive ? 'text-white' : 'text-[#315B48]'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 truncate">
                <span
                  className={`text-sm font-semibold block leading-tight ${
                    isActive ? 'text-white' : 'text-[#292923]'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-[11px] block mt-0.5 truncate ${
                    isActive ? 'text-[#E8F0EC]' : 'text-[#615E52]'
                  }`}
                >
                  {item.description}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Badge */}
      <div className="pt-4 border-t border-[#E5D3C2] text-[11px] text-[#615E52] space-y-1">
        <div className="flex items-center justify-between font-mono text-[10px] text-[#615E52]">
          <span>PHASE 1 BUILD</span>
          <span className="text-[#315B48] font-bold">STABLE</span>
        </div>
        <p className="leading-snug">
          Deterministic local news architecture • SerpApi integration ready
        </p>
      </div>
    </aside>
  );
};
