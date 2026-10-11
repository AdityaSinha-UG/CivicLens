import React from 'react';
import { Newspaper, BookOpen, User } from 'lucide-react';
import { NavTab } from './Sidebar';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'main' as NavTab,
      label: 'News',
      icon: <Newspaper size={20} />,
    },
    {
      id: 'flashcards' as NavTab,
      label: 'Flashcards',
      icon: <BookOpen size={20} />,
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile',
      icon: <User size={20} />,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-black px-4 py-2.5 shadow-[0_-4px_0_0_rgba(0,0,0,0.06)] flex items-center justify-around select-none"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer min-w-[76px] ${
              isActive
                ? 'bg-black text-[#D4FF00] shadow-[0_3px_0_0_#121212]'
                : 'text-black hover:bg-black/5 font-bold'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="shrink-0">{tab.icon}</div>
            <span className="text-[11px] font-black uppercase mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
