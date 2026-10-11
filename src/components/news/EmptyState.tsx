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
    <div className="bg-[#FFF9F4] border border-[#E5D3C2] rounded-xl p-8 text-center my-6 shadow-xs max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#F5EAE0] text-[#615E52] flex items-center justify-center mx-auto mb-3">
        <SearchX size={24} />
      </div>

      <h3 className="font-serif text-lg font-bold text-[#292923]">
        No matching reports found in current dataset
      </h3>

      <p className="text-xs sm:text-sm text-[#615E52] mt-2 leading-relaxed">
        We found no articles matching {filterDesc} in{' '}
        <span className="font-semibold text-[#292923]">{locality}</span>.
      </p>

      {/* Safety & Factuality Disclosure */}
      <div className="mt-4 p-3 bg-[#FAF2E3] border border-[#D9A441]/30 rounded-lg text-left flex items-start gap-2.5 text-xs text-[#615E52]">
        <AlertCircle size={16} className="text-[#8C6415] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Important notice:</strong> The absence of results in this search does not mean that no civic incidents or emergencies exist in the locality. Please consult local emergency helplines or official municipal portals for urgent situations.
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          icon={<RefreshCw size={14} />}
        >
          Reset Filters & Show All
        </Button>
      </div>
    </div>
  );
};
