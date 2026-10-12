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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#18110A] border-t-2 border-black dark:border-[#5A3A1A] px-2 py-1.5 sm:px-4 sm:py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_0_0_rgba(0,0,0,0.4)] flex items-center justify-around select-none"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-3 sm:px-4 rounded-2xl transition-all cursor-pointer min-w-[64px] sm:min-w-[76px] min-h-[44px] ${
              isActive
                ? 'bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black shadow-[0_3px_0_0_#121212]'
                : 'text-black dark:text-[#F5EEE6] hover:bg-black/5 dark:hover:bg-white/5 font-bold'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="shrink-0">{tab.icon}</div>
            <span className="text-[10px] sm:text-[11px] font-black uppercase mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
