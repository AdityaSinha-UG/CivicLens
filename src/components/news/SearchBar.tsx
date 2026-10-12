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
    <div className="space-y-4">
      {/* Search Input and Action Controls */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/60 dark:text-[#F5EEE6]/50">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Search local topics, road closures, water notices in ${locality}...`}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-black dark:border-[#5A3A1A] bg-white dark:bg-[#2A1E10] text-black dark:text-[#F5EEE6] font-medium text-sm placeholder-black/50 dark:placeholder-[#F5EEE6]/35 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FA541C] shadow-[0_3px_0_0_#121212] transition-colors"
            aria-label={`Search civic notices in ${locality}`}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black/60 dark:text-[#F5EEE6]/50 hover:text-black dark:hover:text-[#F5EEE6] cursor-pointer"
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
            className="flex-1 sm:flex-none whitespace-nowrap bg-black dark:bg-[#FA541C] text-white dark:text-black hover:bg-[#D4FF00] dark:hover:bg-[#D4FF00] hover:text-black border-2 border-black dark:border-[#FA541C] font-black uppercase text-xs tracking-wider shadow-[0_4px_0_0_#121212] py-3 px-5 rounded-2xl"
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
            className="bg-white dark:bg-[#2A1E10] hover:bg-black dark:hover:bg-[#FA541C] hover:text-white dark:hover:text-black text-black dark:text-[#F5EEE6] border-2 border-black dark:border-[#5A3A1A] font-black shadow-[0_4px_0_0_#121212] p-3 rounded-2xl"
          >
            <RotateCw size={17} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </form>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-black dark:text-[#F5EEE6] font-black uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Sparkles size={13} className="text-[#FA541C]" />
          Topics:
        </span>
        {suggestedQueries.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => {
              setInputValue(query);
              onSearch(query);
            }}
            className="shrink-0 px-3 py-1 rounded-full bg-[#FFF2E8] dark:bg-[#3A2410] hover:bg-[#FA541C] dark:hover:bg-[#FA541C] hover:text-white border border-black/30 dark:border-[#5A3A1A] text-black dark:text-[#F5EEE6] font-semibold transition-all cursor-pointer text-[11px]"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-black/10 dark:border-[#5A3A1A]/40">
        <span className="text-[11px] font-black text-black dark:text-[#F5EEE6] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Tag size={12} />
          Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border-2 ${
                isSelected
                  ? 'bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black border-black dark:border-[#FA541C] shadow-[0_3px_0_0_#121212]'
                  : 'bg-white dark:bg-[#2A1E10] text-black dark:text-[#F5EEE6] border-black dark:border-[#5A3A1A] hover:bg-[#FFF2E8] dark:hover:bg-[#3A2410]'
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
