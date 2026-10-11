import React, { useState } from 'react';
import { Search, RotateCw, X, Tag, Sparkles } from 'lucide-react';
import { CivicCategory } from '../../types/news';
import { Button } from '../common/Button';

interface SearchBarProps {
  locality: string;
  searchQuery: string;
  selectedCategory: CivicCategory | 'All';
  isLoading: boolean;
  onSearch: (query: string) => void;
  onSelectCategory: (category: CivicCategory | 'All') => void;
  onRefresh: () => void;
}

const CATEGORIES: (CivicCategory | 'All')[] = [
  'All',
  'Politics/Government',
  'Infrastructure/Roads',
  'Utilities',
  'Disasters/Emergencies',
  'Traffic/Transport',
  'Public Safety',
  'Community/Other',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  locality,
  searchQuery,
  selectedCategory,
  isLoading,
  onSearch,
  onSelectCategory,
  onRefresh,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const suggestedQueries = [
    `Local news in ${locality}`,
    `${locality} traffic updates`,
    `Water supply interruptions`,
    `Road closures and construction`,
    `Local government announcements`,
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input and Action Controls */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#615E52]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Search local topics, incidents, and civic notices in ${locality}...`}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5D3C2] bg-[#FFF9F4] text-[#292923] text-sm placeholder-[#827E70] focus:outline-none focus:ring-2 focus:ring-[#315B48] focus:border-[#315B48] shadow-xs transition-colors"
            aria-label={`Search civic notices in ${locality}`}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#827E70] hover:text-[#292923] cursor-pointer"
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            isLoading={isLoading}
            title="Refresh local news feed"
            aria-label="Refresh feed"
            className="px-3"
          >
            <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </form>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[#827E70] font-medium shrink-0 flex items-center gap-1 mr-1">
          <Sparkles size={13} className="text-[#D9A441]" />
          Suggested:
        </span>
        {suggestedQueries.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => {
              setInputValue(query);
              onSearch(query);
            }}
            className="shrink-0 px-2.5 py-1 rounded-md bg-[#FFF9F4] hover:bg-[#F6EDE4] border border-[#E5D3C2] text-[#615E52] hover:text-[#292923] transition-colors cursor-pointer text-[11px]"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-[#E5D3C2]/70">
        <span className="text-[11px] font-bold text-[#615E52] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Tag size={12} />
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-3 py-1.2 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#315B48] text-white border-[#315B48] shadow-xs'
                  : 'bg-[#FFF9F4] text-[#615E52] border-[#E5D3C2] hover:bg-[#F6EDE4] hover:text-[#292923]'
              }`}
              aria-pressed={isSelected}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
