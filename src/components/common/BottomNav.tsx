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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F4] border-t border-[#E5D3C2] px-4 py-2 shadow-lg flex items-center justify-around select-none"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer min-w-[72px] ${
              isActive
                ? 'text-[#315B48] font-bold'
                : 'text-[#615E52] hover:text-[#292923]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div
              className={`p-1.5 rounded-lg transition-transform ${
                isActive ? 'bg-[#315B48]/12 scale-105' : 'bg-transparent'
              }`}
            >
              {tab.icon}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
