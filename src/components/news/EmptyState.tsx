import React from 'react';
import { SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface EmptyStateProps {
  query?: string;
  category?: string;
  locality: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  category,
  locality,
  onReset,
}) => {
  const filterDesc = query
    ? `"${query}"`
    : category && category !== 'All'
    ? `category "${category}"`
    : 'your active filters';

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-8 text-center my-6 shadow-[0_10px_0_0_#121212] max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF2E8] border-2 border-black text-[#FA541C] flex items-center justify-center mx-auto mb-4 shadow-[0_3px_0_0_#121212]">
        <SearchX size={26} />
      </div>

      <h3 className="font-['Syne'] text-xl font-extrabold text-black">
        No Matching Reports Found
      </h3>

      <p className="text-xs sm:text-sm text-black/75 mt-2 leading-relaxed font-medium">
        No articles found matching {filterDesc} in{' '}
        <span className="font-extrabold text-black underline">{locality}</span>.
      </p>

      {/* Safety & Factuality Disclosure */}
      <div className="mt-5 p-3.5 bg-[#FFF2E8] border-2 border-black rounded-2xl text-left flex items-start gap-2.5 text-xs text-black/85">
        <AlertCircle size={16} className="text-[#FA541C] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="block text-black uppercase font-bold text-[10px] tracking-wider mb-0.5">Important Civic Notice</strong>
          The absence of results in this search does not mean that no civic incidents or emergencies exist in the locality. Please consult local emergency helplines or official municipal portals for urgent situations.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          icon={<RefreshCw size={14} />}
          className="bg-black text-[#D4FF00] hover:bg-white hover:text-black font-black uppercase text-xs"
        >
          Reset Filters & Show All
        </Button>
      </div>
    </div>
  );
};
